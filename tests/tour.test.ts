// Percorre cada explicação passo a passo num Chromium de verdade, no desktop e no celular,
// contra o site construído (dist/) e as mesmas rotas /api/* do Cloudflare Pages.
// Defina TOUR_CAPTURAS=/pasta para guardar uma captura de cada passo.
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import type { Server } from "node:http";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { chromium, type Browser, type BrowserContextOptions, type Page } from "playwright-core";
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
  test("a visão geral abre na primeira visita, vai até o fim e não volta sozinha", async () => {
    const ctx = await browser.newContext(TELAS[tela]);
    const page = await ctx.newPage();
    await page.goto(base);
    await percorrer(page, "inicio", tela);
    expect(await page.evaluate(() => localStorage.getItem("agroparts.tour.v1"))).toBe("sim");
    await page.reload();
    await page.waitForTimeout(500);
    expect(await page.locator(".driver-popover").count()).toBe(0);
    await ctx.close();
  }, 180_000);

  for (const nome of Object.keys(TOURS).filter((n) => n !== "inicio")) {
    test(`tour ${nome} roda o exemplo e destaca cada prova`, async () => {
      const ctx = await browser.newContext(TELAS[tela]);
      await ctx.addInitScript(() => localStorage.setItem("agroparts.tour.v1", "sim"));
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
    await retrato(page, "");
    await page.keyboard.press("ArrowRight");
    await retrato(page, "1 de 15");
    await page.keyboard.press("ArrowLeft");
    expect((await retrato(page, "2 de 15")).progresso).toBe("1 de 15");
    await page.keyboard.press("Escape");
    await expect.poll(() => page.locator(".driver-popover").count()).toBe(0);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("como-funciona");
    await page.reload();
    expect(await page.locator(".driver-popover").count()).toBe(0);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.click(".tour-pular");
    await expect.poll(() => page.locator(".driver-popover").count()).toBe(0);
    expect(await page.evaluate(() => localStorage.getItem("agroparts.tour.v1"))).toBe("sim");
    await ctx.close();
  }, 120_000);
});

test("com movimento reduzido, o passo a passo não anima", async () => {
  const ctx = await browser.newContext({ ...TELAS.desktop, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base);
  await retrato(page, "");
  expect(await page.evaluate(() => [document.body.classList.contains("driver-simple"), document.body.classList.contains("driver-fade")])).toEqual([true, false]);
  await ctx.close();
}, 60_000);
