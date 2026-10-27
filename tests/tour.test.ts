// Percorre cada explicação passo a passo e cada caso dos exemplos da apresentação num Chromium
// de verdade, no desktop e no celular, contra o site construído (dist/) e as mesmas rotas /api/*
// do Cloudflare Pages. Defina TOUR_CAPTURAS=/pasta para guardar uma captura de cada passo.
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import type { Server } from "node:http";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { chromium, type Browser, type BrowserContextOptions, type Page } from "playwright-core";
import { CASOS } from "../web/casos";
import { TOURS } from "../web/tour";
import { servir } from "./servidor";

function navegador(): string {
  const candidatos = [process.env.CHROME, "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"];
  const achado = candidatos.find((c) => c && existsSync(c));
  if (!achado) throw new Error("Chromium não encontrado. Defina CHROME=/caminho/do/navegador.");
  return achado;
}

let servidor: Server;
let base = "";
let browser: Browser;
const capturas = process.env.TOUR_CAPTURAS;

beforeAll(async () => {
  execSync("bun run build", { stdio: "ignore", cwd: resolve(__dirname, "..") });
  ({ base, servidor } = await servir());
  browser = await chromium.launch({ executablePath: navegador(), args: ["--no-sandbox"] });
  if (capturas) mkdirSync(capturas, { recursive: true });
}, 180_000);

afterAll(async () => {
  await browser?.close();
  servidor?.close();
});

const TELAS: Record<string, BrowserContextOptions> = {
  desktop: { viewport: { width: 1366, height: 900 } },
  celular: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" },
};

type Retrato = { titulo: string; progresso: string; foco: boolean; dentro: boolean; cobre: number; temAlvo: boolean; alvoVisivel: boolean };

/** Espera o passo assentar e mede o popover e o elemento destacado. */
async function retrato(page: Page, progressoAnterior: string): Promise<Retrato> {
  await page.waitForFunction(
    (antes) => {
      const p = document.querySelector(".driver-popover-progress-text")?.textContent ?? "";
      return p && p !== antes && !document.querySelector(".driver-popover-next-btn:disabled");
    },
    progressoAnterior,
    { timeout: 60_000 },
  );
  // Com animação, o driver.js ignora teclas durante a transição de 0,4 s entre passos.
  if (!(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches))) await page.waitForTimeout(500);
  let anterior = "";
  for (let i = 0; i < 40; i++) {
    const agora = await page.evaluate(() => JSON.stringify([document.querySelector(".driver-popover")?.getBoundingClientRect(), scrollY]));
    if (agora === anterior) break;
    anterior = agora;
    await page.waitForTimeout(120);
  }
  return page.evaluate(() => {
    const pop = document.querySelector(".driver-popover")!;
    const caixa = pop.getBoundingClientRect();
    const alvo = document.querySelector(".driver-active-element");
    const temAlvo = !!alvo && alvo !== document.body;
    const a = temAlvo ? alvo!.getBoundingClientRect() : null;
    const cobre = a ? Math.max(0, Math.min(caixa.right, a.right) - Math.max(caixa.left, a.left)) * Math.max(0, Math.min(caixa.bottom, a.bottom) - Math.max(caixa.top, a.top)) : 0;
    return {
      titulo: document.querySelector(".driver-popover-title")?.textContent ?? "",
      progresso: document.querySelector(".driver-popover-progress-text")?.textContent ?? "",
      foco: pop.contains(document.activeElement),
      dentro: caixa.left >= 0 && caixa.top >= 0 && caixa.right <= innerWidth + 0.5 && caixa.bottom <= innerHeight + 0.5,
      cobre,
      temAlvo,
      alvoVisivel: !!a && a.width > 0 && a.height > 0 && a.bottom > 0 && a.top < innerHeight,
    };
  });
}

/** Percorre o tour aberto até o fim, alternando clique e seta do teclado. */
async function percorrer(page: Page, nome: string, tela: string) {
  const passos = TOURS[nome].passos;
  let progresso = "";
  for (let i = 0; i < passos.length; i++) {
    const r = await retrato(page, progresso);
    progresso = r.progresso;
    if (capturas) await page.screenshot({ path: join(capturas, `${tela}-${nome}-${String(i + 1).padStart(2, "0")}.png`) });
    expect(r.titulo, `${tela} ${nome} passo ${i + 1}`).toBe(passos[i].titulo);
    expect(r.progresso).toBe(`${i + 1} de ${passos.length}`);
    expect(r.foco, `foco no popover em ${nome} passo ${i + 1}`).toBe(true);
    expect(r.dentro, `popover inteiro na tela em ${tela} ${nome} passo ${i + 1}`).toBe(true);
    if (passos[i].alvo) {
      expect(r.temAlvo, `${nome} passo ${i + 1} achou o elemento`).toBe(true);
      expect(r.alvoVisivel, `${nome} passo ${i + 1} mostra o elemento`).toBe(true);
      expect(r.cobre, `popover não cobre o elemento em ${tela} ${nome} passo ${i + 1}`).toBe(0);
    }
    if (i === passos.length - 1) await page.click(".driver-popover-next-btn");
    else if (i % 2) await page.keyboard.press("ArrowRight");
    else await page.click(".driver-popover-next-btn");
  }
  await expect.poll(() => page.locator(".driver-popover").count()).toBe(0);
}

async function abrirPeloMenu(page: Page, nome: string) {
  await page.click("#como-funciona");
  await page.click(`#menu-tours [data-tour="${nome}"]`);
}

describe.each(Object.keys(TELAS))("passo a passo no %s", (tela) => {
  test("a primeira visita abre no campo, e a visão geral abre pelo menu e vai até o fim", async () => {
    const ctx = await browser.newContext(TELAS[tela]);
    const page = await ctx.newPage();
    await page.goto(base);
    await page.waitForTimeout(500);
    expect(await page.locator(".driver-popover").count()).toBe(0);
    await abrirPeloMenu(page, "inicio");
    await percorrer(page, "inicio", tela);
    await ctx.close();
  }, 180_000);

  for (const nome of Object.keys(TOURS).filter((n) => n !== "inicio")) {
    test(`tour ${nome} roda o exemplo e destaca cada prova`, async () => {
      const ctx = await browser.newContext(TELAS[tela]);
      const page = await ctx.newPage();
      await page.goto(base);
      await abrirPeloMenu(page, nome);
      await percorrer(page, nome, tela);
      await ctx.close();
    }, 180_000);
  }

  test("teclado: seta volta, Esc sai, e Pular encerra a visão geral", async () => {
    const ctx = await browser.newContext(TELAS[tela]);
    const page = await ctx.newPage();
    await page.goto(base);
    const total = TOURS.inicio.passos.length;
    await abrirPeloMenu(page, "inicio");
    await retrato(page, "");
    await page.keyboard.press("ArrowRight");
    await retrato(page, `1 de ${total}`);
    await page.keyboard.press("ArrowLeft");
    expect((await retrato(page, `2 de ${total}`)).progresso).toBe(`1 de ${total}`);
    await page.keyboard.press("Escape");
    await expect.poll(() => page.locator(".driver-popover").count()).toBe(0);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("como-funciona");
    await abrirPeloMenu(page, "inicio");
    await page.click(".tour-pular");
    await expect.poll(() => page.locator(".driver-popover").count()).toBe(0);
    await ctx.close();
  }, 120_000);
});

describe.each(Object.keys(TELAS))("tela inicial no %s", (tela) => {
  test("Identificar com o campo vazio identifica o exemplo que o campo mostra, e o exemplo é uma peça identificada", async () => {
    const ctx = await browser.newContext(TELAS[tela]);
    const page = await ctx.newPage();
    await page.goto(base);
    for (const [modo, exemplo] of [
      ["codigo", "311960"],
      ["descricao", "ROLAMENTO RIGIDO DE ESFERAS 6205 2RS C3"],
    ]) {
      await page.check(`input[name="tipo"][value="${modo}"]`, { force: true });
      await page.fill("#texto", "");
      expect(await page.getAttribute("#texto", "placeholder")).toContain(exemplo);
      await page.click("#form-resolver .primario");
      await page.waitForSelector("#resultado .placa");
      expect(await page.inputValue("#texto")).toBe(exemplo);
      expect(await page.locator("#placa-titulo").textContent(), `exemplo do modo ${modo}`).toBe("Peça identificada");
      expect(await page.locator("#resultado .busca").textContent()).toBe(modo === "codigo" ? `Código ${exemplo}` : exemplo);
      expect(await page.$eval("#resultado .busca", (b) => b.scrollWidth <= b.clientWidth + 1 && b.scrollHeight <= b.clientHeight + 1), `${tela}: o exemplo do modo ${modo} cabe inteiro`).toBe(true);
      await page.evaluate(() => (document.querySelector("#resultado")!.innerHTML = ""));
    }
    await ctx.close();
  }, 60_000);
});

/** A tela não rola na horizontal e toda imagem visível carregou. */
async function telaInteira(page: Page) {
  await page.evaluate(() => document.querySelectorAll<HTMLImageElement>("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
  await page.waitForFunction(() => [...document.images].filter((i) => i.getBoundingClientRect().width > 0).every((i) => i.complete), null, { timeout: 30_000 });
  return page.evaluate(() => ({
    rola: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    quebradas: [...document.images].filter((i) => i.getBoundingClientRect().width > 0 && i.naturalWidth === 0).map((i) => i.src),
  }));
}

describe.each(Object.keys(TELAS))("exemplos da apresentação no %s", (tela) => {
  test("dois toques levam da tela inicial a cada caso; um roda o caso e outro volta", async () => {
    const ctx = await browser.newContext(TELAS[tela]);
    const page = await ctx.newPage();
    const erros: string[] = [];
    page.on("pageerror", (e) => erros.push(e.message));
    page.on("console", (m) => m.type() === "error" && erros.push(m.text()));
    await page.goto(base);
    for (const c of CASOS) {
      await page.goto(base);
      await page.click(".exemplos-link");
      await expect.poll(() => page.locator("#t-casos").textContent()).toBe("Exemplos da apresentação");
      await page.click(`.casos-lista a[href="#casos/${c.chave}"]`);
      await expect.poll(() => page.locator("#t-casos").textContent()).toBe(c.titulo);
      expect(await page.locator(".etapa").count()).toBe(5);
      expect(await telaInteira(page), `${tela} caso ${c.chave}`).toEqual({ rola: false, quebradas: [] });

      await page.click(`[data-rodar="${c.chave}"]`);
      if ("numeros" in c.resposta) {
        await page.waitForSelector("#lote-resultado .resumo-lote", { timeout: 60_000 });
        expect(await page.locator("#lote-resultado .resumo-lote strong").first().textContent()).toBe(c.resposta.numeros[0].numero);
      } else {
        await page.waitForSelector("#resultado .placa", { timeout: 90_000 });
        expect(await page.locator("#placa-titulo").textContent()).toBe(c.resposta.titulo);
        expect(await page.locator("#resultado .grupo-cabeca h3").evaluateAll((h) => h.map((x) => x.firstChild!.textContent!.trim()))).toEqual(c.resposta.grupos.map((g) => g.titulo));
      }
      expect(await telaInteira(page), `${tela} caso ${c.chave} ao vivo`).toEqual({ rola: false, quebradas: [] });

      await page.click("#resultado .voltar-caso, #lote-voltar[href^='#casos']");
      await expect.poll(() => page.evaluate(() => location.hash)).toBe(`#casos/${c.chave}`);
      await expect.poll(() => page.locator("#t-casos").textContent()).toBe(c.titulo);
    }
    expect(erros).toEqual([]);
    await ctx.close();
  }, 400_000);
});

test("com movimento reduzido, o passo a passo não anima", async () => {
  const ctx = await browser.newContext({ ...TELAS.desktop, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base);
  await abrirPeloMenu(page, "inicio");
  await retrato(page, "");
  expect(await page.evaluate(() => [document.body.classList.contains("driver-simple"), document.body.classList.contains("driver-fade")])).toEqual([true, false]);
  await ctx.close();
}, 60_000);
