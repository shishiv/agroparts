// Interface do protótipo. Toda resolução passa pela API HTTP (/api/*); o navegador só
// faz o OCR da etiqueta e guarda o registro de revisões. As palavras vêm de ./linguagem.
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow/latin-700.css";
import "@fontsource/barlow-semi-condensed/latin-600.css";
import "@fontsource/barlow-semi-condensed/latin-700.css";
import type { Decisao, DecisaoHumana, Relacao, Resposta } from "../src/motor/tipos";
import type { Medicao, MedicaoIdentidade, MedicaoTraducao, ResultadoLote } from "../src/motor/lote";
import {
  agrupar,
  alvoTexto,
  APLICABILIDADE,
  descreverPeca,
  estratoTexto,
  explicar,
  frases,
  leituraEmPalavras,
  origemTexto,
  SELO,
  semelhancaDaRelacao,
  semelhancaEmPalavras,
  veredito,
  type Grupo,
} from "./linguagem";
import { iniciarTours } from "./tour";

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const pct = (n: number, d: number) => (d ? `${Math.round((100 * n) / d)}%` : "não se aplica");
const fracao = (n: number, d: number) => `<strong>${n} de ${d}</strong> <span class="pct">${d ? `(${pct(n, d)})` : ""}</span>`;
const picto = (id: string, classe = "") => `<svg class="${classe}" aria-hidden="true"><use href="#p-${id}" /></svg>`;
const selo = (d: Decisao, riscado = false) =>
  `<span class="selo selo-${d}${riscado ? " selo-riscado" : ""}">${picto(d)}${SELO[d]}</span>`;
const lista = (itens: string[], classe = "motivos") => (itens.length ? `<ul class="${classe}">${itens.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "");
const link = (url: string, texto: string) => (url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(texto)}</a>` : esc(texto));

async function api<T>(caminho: string, corpo?: unknown): Promise<T> {
  const r = await fetch(caminho, corpo === undefined ? undefined : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) });
  const dados = await r.json().catch(() => ({ erro: `o servidor respondeu de um jeito inesperado (código ${r.status})` }));
  if (!r.ok) throw new Error((dados as { erro?: string }).erro ?? `o servidor recusou o pedido (código ${r.status})`);
  return dados as T;
}

// ---------- Abas ----------
const ABAS = ["resolver", "lote", "medicao", "revisoes", "fontes"];
function mostrarAba(nome: string) {
  const aba = ABAS.includes(nome) ? nome : "resolver";
  for (const a of ABAS) $(`#aba-${a}`).hidden = a !== aba;
  document.querySelectorAll<HTMLAnchorElement>("nav a").forEach((l) => {
    if (l.dataset.aba === aba) l.setAttribute("aria-current", "page");
    else l.removeAttribute("aria-current");
  });
  if (aba === "medicao") carregarMedicao();
  if (aba === "revisoes") desenharRevisoes();
  if (aba === "fontes") carregarFontes();
}
window.addEventListener("hashchange", () => {
  mostrarAba(location.hash.slice(1));
  window.scrollTo(0, 0);
});

// ---------- Identificar ----------
type Tipo = "codigo" | "descricao" | "ocr";
let ultima: { tipo: Tipo; texto: string; resposta: Resposta } | null = null;

function tipoAtual(): Tipo {
  return (document.querySelector<HTMLInputElement>('input[name="tipo"]:checked')?.value as Tipo) ?? "codigo";
}

function ajustarModo() {
  const tipo = tipoAtual();
  $("#campo-foto").hidden = tipo !== "ocr";
  $("#campo-texto").hidden = tipo === "ocr";
  $("#rotulo-texto").textContent = tipo === "codigo" ? "Código do cadastro ou da peça" : "Descrição, do jeito que está no cadastro";
  $<HTMLTextAreaElement>("#texto").placeholder = tipo === "codigo" ? "311960 ou 6205-2RS C3" : "ROLAMENTO 6205 2RS C3 RIGIDO DE ESFERAS";
}
document.querySelectorAll('input[name="tipo"]').forEach((r) => r.addEventListener("change", ajustarModo));

function itemRelacao(r: Relacao): string {
  const sem = semelhancaDaRelacao(r);
  const motivos = frases(r.motivos);
  const condicoes = frases(r.condicoes ?? []).filter((c) => c !== "Cadastro duplicado.");
  const fontes = r.evidencias.map((e) => `<li>${link(e.url, e.fonte)}${e.trecho ? `: <q>${esc(e.trecho)}</q>` : ""}</li>`).join("");
  return `<li class="item">
    <div class="item-alvo">
      <span class="item-codigo">${esc(alvoTexto(r.alvo))}</span>
      ${r.condicoes?.includes("duplicidade exata") ? `<span class="etiqueta">Cadastro duplicado</span>` : sem !== null ? `<span class="etiqueta">${semelhancaEmPalavras(sem)}</span>` : ""}
    </div>
    <div class="item-corpo">
      ${r.alvo_texto && r.tipo !== "CROSS_REFERENCE" && r.tipo !== "INTERCHANGEABLE_FOR" ? `<p class="item-texto">${esc(r.alvo_texto)}</p>` : ""}
      ${lista(motivos)}
      ${condicoes.length ? lista(condicoes, "condicoes") : ""}
      <details class="detalhes"><summary>Ver detalhes</summary>
        <div class="detalhes-corpo">
          ${fontes ? `<div><h3>Fonte</h3><ul class="fontes-regra">${fontes}</ul></div>` : ""}
          <div><h3>Como o sistema registrou</h3>${lista([`Relação ${r.tipo}, decisão ${r.decisao}`, ...r.motivos, ...(r.condicoes ?? [])], "registro")}</div>
        </div>
      </details>
    </div>
  </li>`;
}

function blocoGrupo(g: Grupo): string {
  return `<section class="grupo grupo-${g.nivel}" aria-labelledby="g-${g.chave}">
    <div class="grupo-cabeca">
      ${picto(g.nivel, "grupo-picto")}
      <div>
        <h3 id="g-${g.chave}">${esc(g.titulo)}<span class="contagem">${g.relacoes.length} ${g.relacoes.length === 1 ? "item" : "itens"}</span></h3>
        <p>${esc(g.explicacao)}</p>
      </div>
    </div>
    <ul class="itens">${g.relacoes.map(itemRelacao).join("")}</ul>
  </section>`;
}

function desenharResposta(r: Resposta) {
  const e = r.especificacao;
  const v = veredito(r);
  const o = r.original;
  const grupos = agrupar(r.relacoes);
  const origem = o.origem === "CATMAT" ? `Cadastro original, código ${o.codigo}` : o.origem === "OCR" ? "Texto lido na foto" : "Texto digitado";
  $("#resultado").innerHTML = `
  <section class="placa placa-${v.nivel} nova" aria-labelledby="placa-titulo">
    <div class="placa-faixa">
      ${picto(v.nivel, "placa-picto")}
      <div>
        <h2 class="placa-titulo" id="placa-titulo">${esc(v.titulo)}</h2>
        <p class="placa-frase">${esc(v.frase)}</p>
      </div>
    </div>
    <div class="placa-corpo">
      ${e ? `<div class="peca"><p class="rotulo">A peça</p><p class="peca-nome">${esc(descreverPeca(e))}</p></div>` : ""}
      ${
        grupos.length
          ? `<div class="resumo"><p class="rotulo">Outros itens encontrados</p><ul>${grupos
              .map((g) => `<li><button type="button" class="resumo-${g.nivel}" data-grupo="g-${g.chave}">${picto(g.nivel)}<b>${g.relacoes.length}</b><span>${esc(g.titulo)}</span></button></li>`)
              .join("")}</ul></div>`
          : ""
      }
      ${lista(frases(r.motivos), "motivos forte")}

      <div class="par">
        <div>
          <p class="rotulo">${esc(origem)}, sem alteração</p>
          <blockquote class="original">${esc(o.texto)}</blockquote>
          ${o.url ? `<p class="pequeno">${link(o.url, "Abrir no catálogo público do governo")}</p>` : ""}
        </div>
        <div>
          <p class="rotulo">Descrição padronizada</p>
          ${e ? `<p class="padronizada">${esc(e.descricao_por_regra)}</p>` : `<p class="vazio">Sem descrição padronizada: o texto não chegou a uma peça que o protótipo reconhece.</p>`}
        </div>
      </div>

      ${grupos.map(blocoGrupo).join("")}

      <p class="nota-final">${picto("info", "picto-mini")}<span>${esc(APLICABILIDADE)}</span></p>

      <details class="detalhes"><summary>Ver detalhes da leitura</summary>
        <div class="detalhes-corpo">
          ${
            e
              ? `<div><h3>Como lemos a peça</h3><div class="rolagem"><table>
            <thead><tr><th scope="col">Dado</th><th scope="col">Valor</th><th scope="col">De onde veio</th><th scope="col">Trecho</th></tr></thead>
            <tbody>${e.atributos.map((a) => `<tr><td>${esc(a.nome)}</td><td>${esc(a.valor)}${a.unidade ? " " + esc(a.unidade) : ""}</td><td>${esc(origemTexto(a.origem))}</td><td>${esc(a.trecho)}</td></tr>`).join("")}</tbody>
          </table></div></div>`
              : ""
          }
          <div><h3>Regras e fontes usadas</h3><ul class="fontes-regra">${r.evidencias
            .map((ev) => `<li>${link(ev.url, ev.fonte)}: ${esc(ev.trecho)} <span class="licenca">${esc(ev.licenca)}</span></li>`)
            .join("")}</ul></div>
          <div><h3>Como o sistema registrou</h3>${lista(
            [
              `Decisão ${r.decisao}`,
              `Pontuação interna ${String(r.nota).replace(".", ",")}. Ainda não foi calibrada, por isso não aparece como confiança.`,
              ...r.motivos,
              r.aplicabilidade,
              r.versao_regras,
            ],
            "registro",
          )}</div>
        </div>
      </details>

      <form id="form-revisao" class="revisao" novalidate aria-labelledby="t-revisao">
        <h2 id="t-revisao">Decisão de uma pessoa</h2>
        <p>Quem conhece a peça confirma ou corrige o sistema. A decisão fica registrada ao lado do cadastro original, que não muda.</p>
        <fieldset class="escolhas">
          <legend>O que você decide?</legend>
          ${(
            [
              ["resolve", "É esta peça"],
              ["revisa", "Ainda falta conferir"],
              ["recusa", "Não é esta peça"],
            ] as [Decisao, string][]
          )
            .map(
              ([valor, texto]) =>
                `<label class="escolha escolha-${valor}"><input type="radio" name="decisao" value="${valor}" ${valor === r.decisao ? "checked" : ""} />${picto(valor)}<span>${texto}</span></label>`,
            )
            .join("")}
        </fieldset>
        <div class="linha">
          <label>Quem decide <input name="revisor" required maxlength="80" autocomplete="name" placeholder="Nome ou função" /></label>
          <label>Por quê <textarea name="justificativa" rows="2" required maxlength="500" placeholder="Por exemplo: conferido na etiqueta da peça no almoxarifado"></textarea></label>
        </div>
        <button class="primario" type="submit">Registrar decisão ${picto("seta")}</button>
        <p class="revisao-estado" id="revisao-estado" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>`;
  $("#form-revisao").addEventListener("submit", registrarRevisao);
  document.querySelectorAll<HTMLButtonElement>("[data-grupo]").forEach((b) =>
    b.addEventListener("click", () => document.getElementById(b.dataset.grupo!)?.closest(".grupo")?.scrollIntoView({ block: "start" })),
  );
}

function marcarRoteiro(valor: string | null) {
  document.querySelectorAll<HTMLButtonElement>("[data-exemplo]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.exemplo === valor)));
}

async function resolver(tipo: Tipo, texto: string, rolar = true) {
  const botao = $<HTMLButtonElement>("#form-resolver .primario");
  botao.disabled = true;
  $("#resultado").innerHTML = `<p class="estado" style="margin-top:2rem">Procurando a peça no cadastro…</p>`;
  try {
    const resposta = await api<Resposta>("/api/resolver", { tipo, texto });
    ultima = { tipo, texto, resposta };
    desenharResposta(resposta);
    if (rolar) $("#resultado").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  } catch (e) {
    $("#resultado").innerHTML = `<p class="erro" role="alert">Não foi possível identificar a peça: ${esc((e as Error).message)}. Tente de novo em alguns segundos.</p>`;
  } finally {
    botao.disabled = false;
  }
}

function identificar(rolar = true): Promise<void> {
  const tipo = tipoAtual();
  const texto = (tipo === "ocr" ? $<HTMLTextAreaElement>("#texto-ocr") : $<HTMLTextAreaElement>("#texto")).value.trim();
  if (!texto) {
    $("#resultado").innerHTML = `<p class="erro" role="alert">${tipo === "ocr" ? "Leia uma foto ou digite o texto da etiqueta." : "Digite um código ou uma descrição."}</p>`;
    return Promise.resolve();
  }
  marcarRoteiro(null);
  return resolver(tipo, texto, rolar);
}
$("#form-resolver").addEventListener("submit", (ev) => {
  ev.preventDefault();
  identificar();
});

function escolherModo(tipo: Tipo) {
  document.querySelector<HTMLInputElement>(`input[name="tipo"][value="${tipo}"]`)!.checked = true;
  ajustarModo();
}
function rodarExemplo(valor: string, rolar = true): Promise<void> {
  const [tipo, texto] = valor.split("|") as [Tipo, string];
  if (location.hash && location.hash !== "#resolver") location.hash = "resolver";
  escolherModo(tipo);
  $<HTMLTextAreaElement>("#texto").value = texto;
  marcarRoteiro(valor);
  return resolver(tipo, texto, rolar);
}
document.querySelectorAll<HTMLButtonElement>("[data-exemplo]").forEach((b) => b.addEventListener("click", () => rodarExemplo(b.dataset.exemplo!)));
document.querySelectorAll<HTMLButtonElement>("[data-ir]").forEach((b) => b.addEventListener("click", () => (location.hash = b.dataset.ir!)));

// ---------- Leitura da foto no navegador ----------
let workerOcr: Promise<import("tesseract.js").Worker> | null = null;
async function lerImagem(imagem: Blob, legenda: string) {
  const estado = $("#ocr-estado");
  const previa = $("#previa");
  previa.hidden = false;
  const img = previa.querySelector("img") ?? previa.insertAdjacentElement("afterbegin", Object.assign(document.createElement("img"), { alt: "Foto enviada para leitura" }))!;
  (img as HTMLImageElement).src = URL.createObjectURL(imagem);
  previa.querySelector("figcaption")!.textContent = legenda;
  estado.textContent = "Preparando a leitura. Na primeira vez pode levar alguns segundos…";
  try {
    const { createWorker } = await import("tesseract.js");
    workerOcr ??= createWorker("eng", 1, {
      workerPath: "/ocr/worker.min.js",
      corePath: "/ocr/core",
      langPath: "/ocr",
      gzip: true,
      logger: (m: { status: string; progress: number }) => {
        if (m.status === "recognizing text") estado.textContent = `Lendo o texto da foto… ${Math.round(m.progress * 100)}%`;
      },
    });
    const worker = await workerOcr;
    const { data } = await worker.recognize(imagem);
    const texto = data.text.replace(/\n{2,}/g, "\n").trim();
    $<HTMLTextAreaElement>("#texto-ocr").value = texto;
    const leitura = leituraEmPalavras(Math.round(data.confidence));
    estado.innerHTML = !texto
      ? `${selo("recusa")} <span>Nenhum texto lido. Digite o código da etiqueta no campo abaixo.</span>`
      : leitura.nivel === "recusa"
        ? `<span class="selo selo-recusa">${picto("recusa")}${leitura.texto}</span> <span>Marcação gravada em metal curvo costuma falhar. Digite o código no campo abaixo.</span>`
        : `<span class="selo selo-${leitura.nivel}">${picto(leitura.nivel)}${leitura.texto}</span> <span>Confira o texto antes de identificar. A câmera só lê texto, não reconhece a peça.</span>`;
  } catch (e) {
    estado.textContent = `A leitura da foto falhou (${(e as Error).message}). Digite o código no campo abaixo.`;
  }
}
$<HTMLInputElement>("#foto").addEventListener("change", (ev) => {
  const arquivo = (ev.target as HTMLInputElement).files?.[0];
  if (arquivo) lerImagem(arquivo, `Foto enviada: ${arquivo.name}`);
});
async function lerFotoExemplo(url: string) {
  const r = await fetch(url);
  const legenda = url.includes("rkw")
    ? "Foto de rolamento 6203 C3 com marcação gravada. R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0."
    : "Etiqueta impressa de exemplo, montada pela equipe com o texto do cadastro 311960. Não é foto de campo.";
  await lerImagem(await r.blob(), legenda);
}
document.querySelectorAll<HTMLButtonElement>("[data-foto]").forEach((b) => b.addEventListener("click", () => lerFotoExemplo(b.dataset.foto!)));

// ---------- Decisões das pessoas (registro local) ----------
const CHAVE = "agroparts.revisoes.v1";
const lerRevisoes = (): DecisaoHumana[] => JSON.parse(localStorage.getItem(CHAVE) ?? "[]");

async function registrarRevisao(ev: Event) {
  ev.preventDefault();
  if (!ultima) return;
  const form = ev.target as HTMLFormElement;
  const dados = Object.fromEntries(new FormData(form)) as Record<string, string>;
  const estado = $("#revisao-estado");
  if (!dados.revisor?.trim() || !dados.justificativa?.trim()) {
    estado.innerHTML = `<span class="erro">Preencha quem decide e por quê.</span>`;
    (form.querySelector<HTMLInputElement>(!dados.revisor?.trim() ? "[name=revisor]" : "[name=justificativa]"))!.focus();
    return;
  }
  try {
    const registro = await api<DecisaoHumana>("/api/revisoes", { tipo: ultima.tipo, texto: ultima.texto, ...dados });
    localStorage.setItem(CHAVE, JSON.stringify([registro, ...lerRevisoes()]));
    estado.innerHTML = `<span>Decisão registrada. O sistema disse</span> ${selo(registro.decisao_motor, registro.decisao_motor !== registro.decisao_humana)} <span>e a pessoa decidiu</span> ${selo(registro.decisao_humana)} <a href="#revisoes">Ver todas as decisões</a>`;
  } catch (e) {
    estado.innerHTML = `<span class="erro">A decisão não foi registrada: ${esc((e as Error).message)}.</span>`;
  }
}

function desenharRevisoes() {
  const itens = lerRevisoes();
  $("#revisoes-lista").innerHTML = itens.length
    ? itens
        .map(
          (r) => `<article class="decisao-item">
      <div class="decisao-cabeca"><strong>${esc(r.revisor)}</strong><span class="pequeno">${esc(new Date(r.registrado_em).toLocaleString("pt-BR"))}${r.original.codigo ? ` · cadastro ${esc(r.original.codigo)}` : ""}</span></div>
      <div class="decisao-selos">
        <span>O sistema disse ${selo(r.decisao_motor, r.decisao_motor !== r.decisao_humana)}</span>
        <span>A pessoa decidiu ${selo(r.decisao_humana)}</span>
      </div>
      <p><b>Por quê:</b> ${esc(r.justificativa)}</p>
      <blockquote class="original">${esc(r.original.texto)}</blockquote>
      <details class="detalhes"><summary>Ver detalhes</summary>
        <div class="detalhes-corpo">${lista(
          [
            `Impressão digital do texto original (sha256): ${r.sha256_original}`,
            `Motivos do sistema: ${frases(r.motivos_motor).join(" ") || "nenhum"}`,
            `Regras: ${r.versao_regras}`,
          ],
          "registro",
        )}</div>
      </details>
    </article>`,
        )
        .join("")
    : `<p class="vazio" style="margin-top:1.5rem">Nenhuma decisão registrada neste navegador. Identifique uma peça e use "Decisão de uma pessoa" no fim da resposta.</p>`;
}
$("#exportar-revisoes").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(lerRevisoes(), null, 2)], { type: "application/json" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "decisoes-agroparts.json" });
  a.click();
});
$("#limpar-revisoes").addEventListener("click", () => {
  if (confirm("Apagar as decisões registradas neste navegador? Baixe o registro antes se quiser guardar.")) {
    localStorage.removeItem(CHAVE);
    desenharRevisoes();
  }
});

// ---------- Cadastro inteiro ----------
const barra = (c: { total: number; resolve: number; revisa: number; recusa: number }) =>
  `<div class="barra" role="img" aria-label="${c.resolve} confirmados, ${c.revisa} para uma pessoa, ${c.recusa} recusados de ${c.total}">${(["resolve", "revisa", "recusa"] as Decisao[])
    .map((d) => `<i class="b-${d}" style="width:${c.total ? (100 * c[d]) / c.total : 0}%"></i>`)
    .join("")}</div>`;

let lote: ResultadoLote | null = null;
const FILTROS: [string, string][] = [
  ["todas", "Todos"],
  ["resolve", SELO.resolve],
  ["revisa", SELO.revisa],
  ["recusa", SELO.recusa],
];
function desenharLote(filtro = "todas", busca = "", mostrar = 50) {
  if (!lote) return;
  const estratos = Object.entries(lote.por_estrato).sort(([a], [b]) => a.localeCompare(b));
  const soma = estratos.reduce((s, [, c]) => ({ total: s.total + c.total, resolve: s.resolve + c.resolve, revisa: s.revisa + c.revisa, recusa: s.recusa + c.recusa }), { total: 0, resolve: 0, revisa: 0, recusa: 0 });
  const linhas = lote.linhas.filter(
    (l) => (filtro === "todas" || l.decisao === filtro) && (!busca || `${l.original.codigo} ${l.original.texto} ${l.designacao}`.toUpperCase().includes(busca.toUpperCase())),
  );
  $("#lote-resultado").innerHTML = `
  <div class="resumo-lote">
    <div><strong>${soma.total}</strong><span>cadastros lidos</span></div>
    <div><strong>${soma.resolve}</strong><span>confirmados sem ajuda</span></div>
    <div><strong>${soma.revisa}</strong><span>para uma pessoa</span></div>
    <div><strong>${lote.grupos_duplicidade.length}</strong><span>grupos de cadastros duplicados</span></div>
  </div>

  <section class="bloco" aria-labelledby="t-por-serie">
    <div class="tabela-titulo"><h2 id="t-por-serie">Resultado por grupo</h2>
      <p>Isto conta o que o sistema decidiu, não se acertou. O acerto só é medido no conjunto marcado pela equipe: veja <a href="#medicao">Quanto acerta</a>.</p></div>
    <div class="rolagem tabela"><table>
      <thead><tr><th scope="col">Grupo</th><th scope="col" class="n">Cadastros</th><th scope="col">Divisão</th><th scope="col" class="n">${SELO.resolve}</th><th scope="col" class="n">${SELO.revisa}</th><th scope="col" class="n">${SELO.recusa}</th></tr></thead>
      <tbody>${estratos
        .map(([e, c]) => `<tr><th scope="row">${esc(estratoTexto(e))}</th><td class="n">${c.total}</td><td>${barra(c)}</td><td class="n">${fracao(c.resolve, c.total)}</td><td class="n">${fracao(c.revisa, c.total)}</td><td class="n">${fracao(c.recusa, c.total)}</td></tr>`)
        .join("")}</tbody>
    </table></div>
  </section>

  <section class="bloco" aria-labelledby="t-dup">
    <div class="tabela-titulo"><h2 id="t-dup">Cadastros duplicados</h2><p>Cada grupo junta códigos diferentes com a mesma especificação. Toque num código para ver a resposta completa.</p></div>
    <details class="detalhes"><summary>Ver os ${lote.grupos_duplicidade.length} grupos</summary>
      <ul class="grupos-dup">${lote.grupos_duplicidade
        .map((g) => `<li><b>${esc(g.designacao)}</b> ${g.codigos.map((c) => `<button type="button" class="link-codigo" data-codigo="${esc(c)}">${esc(c)}</button>`).join(", ")}</li>`)
        .join("")}</ul>
    </details>
  </section>

  <section class="bloco" aria-labelledby="t-mapa">
    <div class="tabela-titulo"><h2 id="t-mapa">Planilha de-para</h2><p>Cada linha mostra o texto original, o resultado e o código padronizado.</p></div>
    <div class="filtros">
      <label>Resultado <select id="filtro-lote">${FILTROS.map(([v, t]) => `<option value="${v}" ${v === filtro ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label>Buscar <input id="busca-lote" type="text" value="${esc(busca)}" placeholder="Código, texto ou peça" /></label>
      <span class="contador">${linhas.length} ${linhas.length === 1 ? "linha" : "linhas"}</span>
    </div>
    <div class="rolagem tabela"><table class="mapa">
      <thead><tr><th scope="col">Código</th><th scope="col">Texto original</th><th scope="col">Resultado</th><th scope="col">Código padronizado</th><th scope="col">Por quê</th></tr></thead>
      <tbody>${linhas
        .slice(0, mostrar)
        .map(
          (l) =>
            `<tr><td><button type="button" class="link-codigo" data-codigo="${esc(l.original.codigo)}">${esc(l.original.codigo)}</button></td><td class="txt">${esc(l.original.texto)}</td><td>${selo(l.decisao)}</td><td>${esc(l.designacao ?? "")}</td><td class="txt">${esc(explicar(l.motivos[0]) ?? l.motivos[0])}</td></tr>`,
        )
        .join("")}</tbody>
    </table></div>
    <div class="acoes mais">
      <p class="pequeno">Mostrando ${Math.min(mostrar, linhas.length)} de ${linhas.length} ${linhas.length === 1 ? "linha" : "linhas"}. A planilha CSV traz todas.</p>
      ${linhas.length > mostrar ? `<button type="button" class="botao" id="mais-lote">Mostrar mais ${Math.min(50, linhas.length - mostrar)}</button>` : ""}
    </div>
  </section>`;
  $<HTMLSelectElement>("#filtro-lote").addEventListener("change", (e) => desenharLote((e.target as HTMLSelectElement).value, $<HTMLInputElement>("#busca-lote").value));
  $<HTMLInputElement>("#busca-lote").addEventListener("change", (e) => desenharLote($<HTMLSelectElement>("#filtro-lote").value, (e.target as HTMLInputElement).value));
  document.querySelector("#mais-lote")?.addEventListener("click", () => {
    const y = scrollY;
    desenharLote(filtro, busca, mostrar + 50);
    scrollTo(0, y);
  });
}
$("#lote-resultado").addEventListener("click", (ev) => {
  const b = (ev.target as HTMLElement).closest<HTMLButtonElement>("[data-codigo]");
  if (!b) return;
  location.hash = "resolver";
  document.querySelector<HTMLInputElement>('input[name="tipo"][value="codigo"]')!.checked = true;
  ajustarModo();
  $<HTMLTextAreaElement>("#texto").value = b.dataset.codigo!;
  marcarRoteiro(null);
  resolver("codigo", b.dataset.codigo!);
});
async function lerLote() {
  const botao = $<HTMLButtonElement>("#rodar-lote");
  botao.disabled = true;
  $("#lote-resultado").innerHTML = `<p class="estado" style="margin-top:1.5rem">Lendo o cadastro inteiro…</p>`;
  try {
    const inicio = performance.now();
    lote = await api<ResultadoLote>("/api/lote");
    desenharLote();
    const s = ((performance.now() - inicio) / 1000).toFixed(1).replace(".", ",");
    $("#lote-resultado").insertAdjacentHTML("beforeend", `<p class="pequeno" style="margin-top:1rem">O cadastro inteiro foi lido em ${s} segundos.</p>`);
  } catch (e) {
    $("#lote-resultado").innerHTML = `<p class="erro" role="alert">Não foi possível ler o cadastro: ${esc((e as Error).message)}.</p>`;
  } finally {
    botao.disabled = false;
  }
}
$("#rodar-lote").addEventListener("click", lerLote);

// ---------- Quanto acerta ----------
function tabelaTraducao(id: string, titulo: string, explicacao: string, linhas: MedicaoTraducao[]): string {
  const soma = (k: keyof MedicaoTraducao) => linhas.reduce((s, l) => s + (l[k] as number), 0);
  return `<section class="bloco" aria-labelledby="${id}"><div class="tabela-titulo"><h2 id="${id}">${titulo}</h2><p>${explicacao}</p></div>
  <div class="rolagem tabela"><table>
    <thead><tr><th scope="col">Grupo</th><th scope="col" class="n">Cadastros</th><th scope="col" class="n">Dentro do recorte</th><th scope="col" class="n">${SELO.resolve}</th><th scope="col" class="n">${SELO.revisa}</th><th scope="col" class="n">${SELO.recusa}</th><th scope="col" class="n">Confirmados certos</th><th scope="col" class="n">Do recorte, confirmados sem ajuda</th></tr></thead>
    <tbody>${linhas
      .map(
        (l) => `<tr><th scope="row">${esc(estratoTexto(l.estrato))}</th><td class="n">${l.total}</td><td class="n">${l.elegiveis}</td><td class="n">${l.resolvidos}</td><td class="n">${l.revisados}</td><td class="n">${l.recusados}</td>
        <td class="n">${fracao(l.resolvidos_corretos, l.resolvidos)}</td><td class="n">${fracao(l.resolvidos - l.resolvidos_nao_elegiveis, l.elegiveis)}</td></tr>`,
      )
      .join("")}</tbody>
    <tfoot><tr><th scope="row">Soma</th><td class="n">${soma("total")}</td><td class="n">${soma("elegiveis")}</td><td class="n">${soma("resolvidos")}</td><td class="n">${soma("revisados")}</td><td class="n">${soma("recusados")}</td><td colspan="2">Sem porcentagem geral: cada grupo tem a sua.</td></tr></tfoot>
  </table></div></section>`;
}
function tabelaIdentidade(linhas: MedicaoIdentidade[]): string {
  return `<section class="bloco" aria-labelledby="t-pares"><div class="tabela-titulo"><h2 id="t-pares">Dois cadastros: é a mesma peça?</h2>
  <p>Pares de cadastros do mesmo tamanho. O que importa é não chamar de igual o que só parece.</p></div>
  <div class="rolagem tabela"><table>
    <thead><tr><th scope="col">Grupo</th><th scope="col" class="n">Pares</th><th scope="col" class="n">São a mesma</th><th scope="col" class="n">Não são</th><th scope="col" class="n">Sem como saber</th><th scope="col" class="n">Acerto quando diz que é a mesma</th><th scope="col" class="n">Achados entre os que são</th><th scope="col" class="n">Diferentes que foram barrados</th></tr></thead>
    <tbody>${linhas
      .map(
        (l) => `<tr><th scope="row">${esc(estratoTexto(l.estrato))}</th><td class="n">${l.pares}</td><td class="n">${l.verdadeiros}</td><td class="n">${l.falsos}</td><td class="n">${l.indeterminados}</td>
        <td class="n">${fracao(l.verdadeiros_resolvidos, l.resolvidos)}</td><td class="n">${fracao(l.verdadeiros_resolvidos, l.verdadeiros)}</td><td class="n">${fracao(l.falsos_recusados, l.falsos)}</td></tr>`,
      )
      .join("")}</tbody>
  </table></div><p class="pequeno">"Sem como saber": um dos dois cadastros está fora do recorte. Esses pares ficam fora das porcentagens.</p></section>`;
}
let medicaoCarregada = false;
async function carregarMedicao() {
  if (medicaoCarregada) return;
  try {
    const m = await api<Medicao>("/api/medicao");
    medicaoCarregada = true;
    const textos = m.traducao_catmat.reduce((s, l) => s + l.total, 0) + m.traducao_texto_livre.reduce((s, l) => s + l.total, 0);
    $("#medicao-resultado").innerHTML = `
      ${tabelaTraducao("t-catmat", "Cadastros do catálogo público", "Cada cadastro foi lido e comparado com a resposta marcada pela equipe.", m.traducao_catmat)}
      ${tabelaTraducao("t-livre", "Textos de fornecedores em compras públicas", "Textos curtos e sujos, como chegam de fornecedor.", m.traducao_texto_livre)}
      ${tabelaIdentidade(m.identidade)}
      <section class="bloco" aria-labelledby="t-marca"><h2 id="t-marca">Outra marca</h2>
        <p>Correspondências entre marcas encontradas com fonte: ${fracao(m.referencia_cruzada.com_fonte, m.referencia_cruzada.total)}. Trocas de marca aprovadas sem uma pessoa: <strong>${m.referencia_cruzada.intercambio_resolvido_automaticamente}</strong>. O esperado é nenhuma.</p>
        <p class="pequeno">Só um cadastro desta família cita duas marcas. Um caso só não sustenta porcentagem.</p></section>
      <section class="bloco" aria-labelledby="t-limites"><h2 id="t-limites">Limites desta medição</h2><ul class="lista">
        <li>A resposta marcada usa as mesmas regras de leitura do sistema. Os 100% mostram que o sistema aplica as regras sem errar nos textos reais. Não mostram que as regras acertam a peça física.</li>
        <li>A mesma origem escreveu o sistema e marcou as respostas. A conferência por outras pessoas da equipe ainda não foi feita.</li>
        <li>O conjunto marcado tem ${textos} textos. O protótipo não mostra percentual de confiança, porque a pontuação interna ainda não foi calibrada.</li>
        <li>Erros encontrados: <strong>${m.erros.length}</strong>${m.erros.length ? `: ${m.erros.map((e) => esc(`${e.item} (esperado ${e.esperado}, obtido ${e.obtido})`)).join("; ")}` : "."}</li>
      </ul>
      <details class="detalhes"><summary>Ver detalhes</summary><div class="detalhes-corpo">${lista(
        [`Gabarito ${m.versao_gabarito}, ${m.versao_regras}.`, "Arquivos do gabarito no repositório, pasta dados/gabarito/v1/."],
        "registro",
      )}</div></details></section>`;
  } catch (e) {
    $("#medicao-resultado").innerHTML = `<p class="erro" role="alert">Não foi possível carregar a medição: ${esc((e as Error).message)}.</p>`;
  }
}

// ---------- Fontes ----------
let fontesCarregadas = false;
async function carregarFontes() {
  if (fontesCarregadas) return;
  try {
    const f = await api<{ versao_regras: string; corpora: { nome: string; url: string; consultado_em: string; licenca: string }[]; regras: { fonte: string; url: string; licenca: string }[] }>("/api/fontes");
    fontesCarregadas = true;
    $("#fontes-lista").innerHTML = `
      <section class="bloco" aria-labelledby="t-dados"><h2 id="t-dados">Dados</h2><ul class="lista">${f.corpora
        .map((c) => `<li>${link(c.url, c.nome)}. Consulta em ${esc(new Date(c.consultado_em).toLocaleDateString("pt-BR"))}. Licença: ${esc(c.licenca)}.</li>`)
        .join("")}</ul></section>
      <section class="bloco" aria-labelledby="t-regras"><h2 id="t-regras">Regras de leitura dos códigos</h2><ul class="lista">${f.regras.map((r) => `<li>${link(r.url, r.fonte)}. ${esc(r.licenca)}.</li>`).join("")}</ul></section>
      <section class="bloco" aria-labelledby="t-imagens"><h2 id="t-imagens">Imagens e programas usados pelo site</h2><ul class="lista">
        <li>Foto do rolamento 6203 C3: R. Henrik Nilsson, ${link("https://commons.wikimedia.org/wiki/File:Second_half_of_20th_century_ball_bearing_6203_C3_M7_by_RKW.jpg", "Wikimedia Commons")}, CC BY 4.0, reduzida para 800 px.</li>
        <li>Leitura de texto na foto: tesseract.js 7 (Apache 2.0) com o modelo eng de tessdata_fast (Apache 2.0), servidos por este site.</li>
        <li>Letra Barlow, de Jeremy Tribby (SIL Open Font License 1.1), servida por este site.</li>
        <li>Explicação passo a passo do botão "Como funciona": driver.js 1.9, de Kamran Ahmed (MIT), servido por este site.</li>
      </ul></section>`;
  } catch (e) {
    $("#fontes-lista").innerHTML = `<p class="erro" role="alert">Não foi possível carregar as fontes: ${esc((e as Error).message)}.</p>`;
  }
}

ajustarModo();
mostrarAba(location.hash.slice(1));
iniciarTours({
  exemplo: (valor) => rodarExemplo(valor, false),
  aba: (nome) => {
    location.hash = nome;
    mostrarAba(nome);
  },
  lote: lerLote,
  modo: escolherModo,
  foto: lerFotoExemplo,
  identificar: () => identificar(false),
});
