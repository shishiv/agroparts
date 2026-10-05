// Interface do protótipo. Toda resolução passa pela API HTTP (/api/*); o navegador só
// faz o OCR da etiqueta e guarda o registro de revisões.
import type { Decisao, DecisaoHumana, Relacao, Resposta } from "../src/motor/tipos";
import type { Medicao, MedicaoIdentidade, MedicaoTraducao, ResultadoLote } from "../src/motor/lote";

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const pct = (n: number, d: number) => (d ? `${((100 * n) / d).toFixed(0).replace(".", ",")}%` : "não se aplica");
const fracao = (n: number, d: number) => `<strong>${n}/${d}</strong> <span class="pct">(${pct(n, d)})</span>`;

const ROTULO: Record<Decisao, string> = { resolve: "Resolve", revisa: "Revisa", recusa: "Recusa" };
const ICONE: Record<Decisao, string> = { resolve: "✓", revisa: "!", recusa: "✕" };
const selo = (d: Decisao) => `<span class="selo selo-${d}"><span aria-hidden="true">${ICONE[d]}</span> ${ROTULO[d]}</span>`;

async function api<T>(caminho: string, corpo?: unknown): Promise<T> {
  const r = await fetch(caminho, corpo === undefined ? undefined : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) });
  const dados = await r.json().catch(() => ({ erro: `resposta inválida (${r.status})` }));
  if (!r.ok) throw new Error((dados as { erro?: string }).erro ?? `erro ${r.status}`);
  return dados as T;
}

// ---------- Abas ----------
const ABAS = ["resolver", "lote", "medicao", "revisoes", "fontes"];
function mostrarAba(nome: string) {
  const aba = ABAS.includes(nome) ? nome : "resolver";
  for (const a of ABAS) $(`#aba-${a}`).hidden = a !== aba;
  document.querySelectorAll<HTMLAnchorElement>("nav a").forEach((l) => l.setAttribute("aria-current", l.dataset.aba === aba ? "page" : "false"));
  if (aba === "medicao") carregarMedicao();
  if (aba === "revisoes") desenharRevisoes();
  if (aba === "fontes") carregarFontes();
}
window.addEventListener("hashchange", () => mostrarAba(location.hash.slice(1)));

// ---------- Resolver ----------
type Tipo = "codigo" | "descricao" | "ocr";
let ultima: { tipo: Tipo; texto: string; resposta: Resposta } | null = null;

function tipoAtual(): Tipo {
  return (document.querySelector<HTMLInputElement>('input[name="tipo"]:checked')!.value as Tipo) ?? "codigo";
}

function ajustarModo() {
  const tipo = tipoAtual();
  $("#campo-foto").hidden = tipo !== "ocr";
  $("#campo-texto").hidden = tipo === "ocr";
  $("#rotulo-texto").textContent = tipo === "codigo" ? "Código CATMAT ou designação" : "Descrição livre, como veio do cadastro";
  $<HTMLTextAreaElement>("#texto").placeholder = tipo === "codigo" ? "311960 ou 6205-2RS C3" : "ROLAMENTO 6205 2RS C3 RIGIDO DE ESFERAS";
}
document.querySelectorAll('input[name="tipo"]').forEach((r) => r.addEventListener("change", ajustarModo));

function cartaoRelacao(r: Relacao): string {
  const ev = r.evidencias
    .map((e) => `<li>${e.url ? `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.fonte)}</a>` : esc(e.fonte)}${e.trecho ? `: <q>${esc(e.trecho)}</q>` : ""}</li>`)
    .join("");
  return `<article class="relacao relacao-${r.decisao}">
    <header><code class="tipo">${r.tipo}</code> ${selo(r.decisao)} <span class="alvo">${esc(r.alvo)}</span></header>
    ${r.alvo_texto ? `<p class="alvo-texto">${esc(r.alvo_texto)}</p>` : ""}
    <ul class="motivos">${r.motivos.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
    ${r.condicoes?.length ? `<p class="rotulo">Condições</p><ul class="condicoes">${r.condicoes.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}
    ${ev ? `<details><summary>Evidência</summary><ul class="evidencias">${ev}</ul></details>` : ""}
  </article>`;
}

function desenharResposta(r: Resposta) {
  const e = r.especificacao;
  const grupos: [string, Relacao[]][] = [
    ["Referência cruzada e intercâmbio", r.relacoes.filter((x) => x.tipo === "CROSS_REFERENCE" || x.tipo === "INTERCHANGEABLE_FOR")],
    ["Mesma identidade no cadastro (SAME_AS)", r.relacoes.filter((x) => x.tipo === "SAME_AS" && x.decisao !== "recusa")],
    ["Parecidos, mas recusados (falsa semelhança)", r.relacoes.filter((x) => x.tipo === "SAME_AS" && x.decisao === "recusa")],
    ["Só recuperados por semelhança (SIMILAR_TO)", r.relacoes.filter((x) => x.tipo === "SIMILAR_TO")],
  ];
  $("#resultado").innerHTML = `
  <section class="cartao resposta resposta-${r.decisao}" aria-label="Resultado">
    <div class="cabeca">
      ${selo(r.decisao)}
      <span class="nota">nota de evidência ${String(r.nota).replace(".", ",")} · não calibrada</span>
    </div>
    <ul class="motivos grande">${r.motivos.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>

    <div class="colunas">
      <div>
        <p class="rotulo">Original preservado · ${esc(r.original.origem)}${r.original.codigo ? ` ${esc(r.original.codigo)}` : ""}</p>
        <blockquote class="original">${esc(r.original.texto)}</blockquote>
        ${r.original.url ? `<p><a href="${esc(r.original.url)}" target="_blank" rel="noopener">Ver na API do CATMAT</a></p>` : ""}
      </div>
      <div>
        <p class="rotulo">Forma canônica (descrição por regra)</p>
        ${e ? `<p class="canonica">${esc(e.descricao_por_regra)}</p>` : `<p class="vazio">Sem especificação: a entrada não chegou à família.</p>`}
      </div>
    </div>

    ${
      e
        ? `<details class="atributos"><summary>Atributos tipados e origem (${e.atributos.length})</summary>
      <table><thead><tr><th scope="col">Atributo</th><th scope="col">Valor</th><th scope="col">Origem</th><th scope="col">Trecho</th></tr></thead>
      <tbody>${e.atributos.map((a) => `<tr><td>${esc(a.nome)}</td><td>${esc(a.valor)}${a.unidade ? " " + esc(a.unidade) : ""}</td><td>${esc(a.origem)}</td><td>${esc(a.trecho)}</td></tr>`).join("")}</tbody></table>
    </details>`
        : ""
    }

    ${grupos
      .filter(([, rs]) => rs.length)
      .map(([titulo, rs]) => `<h2>${titulo} <span class="contagem">${rs.length}</span></h2>${rs.map(cartaoRelacao).join("")}`)
      .join("")}
    <p class="nota-aplicabilidade">${esc(r.aplicabilidade)}</p>
    <details><summary>Fontes de regra usadas (${r.evidencias.length})</summary>
      <ul class="evidencias">${r.evidencias.map((ev) => `<li><a href="${esc(ev.url)}" target="_blank" rel="noopener">${esc(ev.fonte)}</a>: ${esc(ev.trecho)} <span class="licenca">${esc(ev.licenca)}</span></li>`).join("")}</ul>
    </details>

    <form id="form-revisao" class="revisao" novalidate>
      <h2>Revisão humana</h2>
      <p>A decisão fica registrada ao lado do original. O original não muda.</p>
      <div class="linha">
        <label>Revisor <input name="revisor" required maxlength="80" autocomplete="name" placeholder="nome ou função" /></label>
        <label>Decisão
          <select name="decisao">
            <option value="resolve">Resolve: aceito a especificação</option>
            <option value="revisa" ${r.decisao === "revisa" ? "selected" : ""}>Revisa: falta evidência</option>
            <option value="recusa" ${r.decisao === "recusa" ? "selected" : ""}>Recusa: não é esta peça</option>
          </select>
        </label>
      </div>
      <label>Justificativa <textarea name="justificativa" rows="2" required maxlength="500" placeholder="Por exemplo: conferido na etiqueta física do almoxarifado"></textarea></label>
      <button class="primario" type="submit">Registrar decisão</button>
      <p class="estado" id="revisao-estado" role="status" aria-live="polite"></p>
    </form>
  </section>`;
  $("#form-revisao").addEventListener("submit", registrarRevisao);
}

async function resolver(tipo: Tipo, texto: string) {
  $("#resultado").innerHTML = `<p class="estado">Resolvendo…</p>`;
  try {
    const resposta = await api<Resposta>("/api/resolver", { tipo, texto });
    ultima = { tipo, texto, resposta };
    desenharResposta(resposta);
    $("#resultado").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (e) {
    $("#resultado").innerHTML = `<p class="erro" role="alert">Não foi possível resolver: ${esc((e as Error).message)}</p>`;
  }
}

$("#form-resolver").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const tipo = tipoAtual();
  const texto = (tipo === "ocr" ? $<HTMLTextAreaElement>("#texto-ocr") : $<HTMLTextAreaElement>("#texto")).value.trim();
  if (!texto) {
    $("#resultado").innerHTML = `<p class="erro" role="alert">${tipo === "ocr" ? "Leia uma foto ou digite o texto da etiqueta." : "Digite um código ou uma descrição."}</p>`;
    return;
  }
  resolver(tipo, texto);
});

document.querySelectorAll<HTMLButtonElement>("[data-exemplo]").forEach((b) =>
  b.addEventListener("click", () => {
    const [tipo, texto] = b.dataset.exemplo!.split("|") as [Tipo, string];
    document.querySelector<HTMLInputElement>(`input[name="tipo"][value="${tipo}"]`)!.checked = true;
    ajustarModo();
    $<HTMLTextAreaElement>("#texto").value = texto;
    resolver(tipo, texto);
  }),
);
document.querySelectorAll<HTMLButtonElement>("[data-ir]").forEach((b) => b.addEventListener("click", () => (location.hash = b.dataset.ir!)));

// ---------- OCR no navegador ----------
let workerOcr: Promise<import("tesseract.js").Worker> | null = null;
async function lerImagem(imagem: Blob, legenda: string) {
  const estado = $("#ocr-estado");
  const previa = $("#previa");
  previa.hidden = false;
  previa.querySelector("img")!.src = URL.createObjectURL(imagem);
  previa.querySelector("figcaption")!.textContent = legenda;
  estado.textContent = "Carregando o leitor de texto (primeira vez pode levar alguns segundos)…";
  try {
    const { createWorker } = await import("tesseract.js");
    workerOcr ??= createWorker("eng", 1, {
      workerPath: "/ocr/worker.min.js",
      corePath: "/ocr/core",
      langPath: "/ocr",
      gzip: true,
      logger: (m: { status: string; progress: number }) => {
        if (m.status === "recognizing text") estado.textContent = `Lendo texto… ${Math.round(m.progress * 100)}%`;
      },
    });
    const worker = await workerOcr;
    const { data } = await worker.recognize(imagem);
    const texto = data.text.replace(/\n{2,}/g, "\n").trim();
    $<HTMLTextAreaElement>("#texto-ocr").value = texto;
    const confianca = Math.round(data.confidence);
    estado.textContent = !texto
      ? "Nenhum texto lido. Digite o código da etiqueta no campo abaixo."
      : confianca < 60
        ? `Leitura pouco confiável (confiança média ${confianca}%). Marcação gravada em metal curvo costuma falhar. Digite o código no campo abaixo.`
        : `Texto lido com confiança média ${confianca}%. Confira antes de resolver: a câmera só lê texto, não reconhece a peça.`;
  } catch (e) {
    estado.textContent = `O leitor de texto falhou (${(e as Error).message}). Digite o código no campo abaixo.`;
  }
}
$<HTMLInputElement>("#foto").addEventListener("change", (ev) => {
  const arquivo = (ev.target as HTMLInputElement).files?.[0];
  if (arquivo) lerImagem(arquivo, `Foto enviada: ${arquivo.name}`);
});
document.querySelectorAll<HTMLButtonElement>("[data-foto]").forEach((b) =>
  b.addEventListener("click", async () => {
    const r = await fetch(b.dataset.foto!);
    const legenda = b.dataset.foto!.includes("rkw")
      ? "Foto de rolamento 6203 C3 com marcação gravada. R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0."
      : "Etiqueta impressa de exemplo, montada com o texto do item CATMAT 311960. Não é foto de campo.";
    lerImagem(await r.blob(), legenda);
  }),
);

// ---------- Revisões (registro local) ----------
const CHAVE = "agroparts.revisoes.v1";
const lerRevisoes = (): DecisaoHumana[] => JSON.parse(localStorage.getItem(CHAVE) ?? "[]");

async function registrarRevisao(ev: Event) {
  ev.preventDefault();
  if (!ultima) return;
  const form = ev.target as HTMLFormElement;
  const dados = Object.fromEntries(new FormData(form)) as Record<string, string>;
  const estado = $("#revisao-estado");
  if (!dados.revisor?.trim() || !dados.justificativa?.trim()) {
    estado.textContent = "Preencha revisor e justificativa.";
    return;
  }
  try {
    const registro = await api<DecisaoHumana>("/api/revisoes", { tipo: ultima.tipo, texto: ultima.texto, ...dados });
    localStorage.setItem(CHAVE, JSON.stringify([registro, ...lerRevisoes()]));
    estado.innerHTML = `Decisão registrada: motor ${selo(registro.decisao_motor)} · pessoa ${selo(registro.decisao_humana)}. <a href="#revisoes">Ver registro</a>`;
  } catch (e) {
    estado.textContent = `Não registrou: ${(e as Error).message}`;
  }
}

function desenharRevisoes() {
  const lista = lerRevisoes();
  $("#revisoes-lista").innerHTML = lista.length
    ? lista
        .map(
          (r) => `<article class="cartao revisao-item">
      <p><strong>${esc(new Date(r.registrado_em).toLocaleString("pt-BR"))}</strong> · ${esc(r.revisor)} · motor ${selo(r.decisao_motor)} → pessoa ${selo(r.decisao_humana)}</p>
      <blockquote class="original">${esc(r.original.texto)}</blockquote>
      <p>Justificativa: ${esc(r.justificativa)}</p>
      <p class="pequeno">Original ${esc(r.original.origem)} ${esc(r.original.codigo ?? "")} · sha256 ${esc(r.sha256_original.slice(0, 16))}… · ${esc(r.versao_regras)}</p>
    </article>`,
        )
        .join("")
    : `<p class="vazio">Nenhuma revisão registrada neste navegador.</p>`;
}
$("#exportar-revisoes").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(lerRevisoes(), null, 2)], { type: "application/json" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "revisoes-agroparts.json" });
  a.click();
});
$("#limpar-revisoes").addEventListener("click", () => {
  if (confirm("Apagar o registro de revisões deste navegador? Exporte antes se quiser guardar.")) {
    localStorage.removeItem(CHAVE);
    desenharRevisoes();
  }
});

// ---------- Lote ----------
let lote: ResultadoLote | null = null;
function desenharLote(filtro = "todas", busca = "") {
  if (!lote) return;
  const estratos = Object.entries(lote.por_estrato).sort(([a], [b]) => a.localeCompare(b));
  const total = estratos.reduce((s, [, c]) => s + c.total, 0);
  const linhas = lote.linhas.filter(
    (l) => (filtro === "todas" || l.decisao === filtro) && (!busca || `${l.original.codigo} ${l.original.texto} ${l.designacao}`.toUpperCase().includes(busca.toUpperCase())),
  );
  $("#lote-resultado").innerHTML = `
  <div class="cartao">
    <h2>${total} itens traduzidos · ${lote.grupos_duplicidade.length} grupos de duplicidade</h2>
    <div class="rolagem"><table>
      <thead><tr><th scope="col">Estrato</th><th scope="col">Total</th><th scope="col">Resolve</th><th scope="col">Revisa</th><th scope="col">Recusa</th></tr></thead>
      <tbody>${estratos.map(([e, c]) => `<tr><th scope="row">${esc(e)}</th><td>${c.total}</td><td>${fracao(c.resolve, c.total)}</td><td>${fracao(c.revisa, c.total)}</td><td>${fracao(c.recusa, c.total)}</td></tr>`).join("")}</tbody>
    </table></div>
    <p class="pequeno">Contagem de decisões sobre o cadastro inteiro. A precisão só é medida no gabarito: veja a aba <a href="#medicao">Medição</a>.</p>
  </div>
  <details class="cartao"><summary>Grupos de duplicidade (${lote.grupos_duplicidade.length})</summary>
    <ul class="grupos">${lote.grupos_duplicidade.map((g) => `<li><code>${esc(g.designacao)}</code>: ${g.codigos.map((c) => `<button type="button" class="link" data-codigo="${esc(c)}">${esc(c)}</button>`).join(", ")}</li>`).join("")}</ul>
  </details>
  <div class="cartao">
    <div class="filtros">
      <label>Decisão <select id="filtro-lote">${["todas", "resolve", "revisa", "recusa"].map((v) => `<option ${v === filtro ? "selected" : ""}>${v}</option>`).join("")}</select></label>
      <label>Buscar <input id="busca-lote" value="${esc(busca)}" placeholder="código, texto ou designação" /></label>
      <span>${linhas.length} linhas</span>
    </div>
    <div class="rolagem"><table class="mapa">
      <thead><tr><th scope="col">Código</th><th scope="col">Original</th><th scope="col">Decisão</th><th scope="col">Designação</th><th scope="col">Motivo</th></tr></thead>
      <tbody>${linhas
        .slice(0, 150)
        .map((l) => `<tr><td><button type="button" class="link" data-codigo="${esc(l.original.codigo)}">${esc(l.original.codigo)}</button></td><td class="txt">${esc(l.original.texto)}</td><td>${selo(l.decisao)}</td><td><code>${esc(l.designacao ?? "")}</code></td><td class="txt">${esc(l.motivos[0])}</td></tr>`)
        .join("")}</tbody>
    </table></div>
    ${linhas.length > 150 ? `<p class="pequeno">Mostrando 150 de ${linhas.length}. O CSV traz todas.</p>` : ""}
  </div>`;
  $<HTMLSelectElement>("#filtro-lote").addEventListener("change", (e) => desenharLote((e.target as HTMLSelectElement).value, $<HTMLInputElement>("#busca-lote").value));
  $<HTMLInputElement>("#busca-lote").addEventListener("change", (e) => desenharLote($<HTMLSelectElement>("#filtro-lote").value, (e.target as HTMLInputElement).value));
}
$("#lote-resultado").addEventListener("click", (ev) => {
  const b = (ev.target as HTMLElement).closest<HTMLButtonElement>("[data-codigo]");
  if (!b) return;
  location.hash = "resolver";
  document.querySelector<HTMLInputElement>('input[name="tipo"][value="codigo"]')!.checked = true;
  ajustarModo();
  $<HTMLTextAreaElement>("#texto").value = b.dataset.codigo!;
  resolver("codigo", b.dataset.codigo!);
});
$("#rodar-lote").addEventListener("click", async () => {
  $("#lote-resultado").innerHTML = `<p class="estado">Traduzindo…</p>`;
  try {
    const inicio = performance.now();
    lote = await api<ResultadoLote>("/api/lote");
    desenharLote();
    $("#lote-resultado").insertAdjacentHTML("afterbegin", `<p class="pequeno">Tempo total: ${Math.round(performance.now() - inicio)} ms.</p>`);
  } catch (e) {
    $("#lote-resultado").innerHTML = `<p class="erro" role="alert">${esc((e as Error).message)}</p>`;
  }
});

// ---------- Medição ----------
function tabelaTraducao(titulo: string, linhas: MedicaoTraducao[]): string {
  const soma = (k: keyof MedicaoTraducao) => linhas.reduce((s, l) => s + (l[k] as number), 0);
  return `<div class="cartao"><h2>${titulo}</h2><div class="rolagem"><table>
    <thead><tr><th scope="col">Estrato</th><th scope="col">Itens</th><th scope="col">Elegíveis</th><th scope="col">Resolvidos</th><th scope="col">Revisa</th><th scope="col">Recusa</th><th scope="col">Precisão automática</th><th scope="col">Cobertura automática</th></tr></thead>
    <tbody>${linhas
      .map(
        (l) => `<tr><th scope="row">${esc(l.estrato)}</th><td>${l.total}</td><td>${l.elegiveis}</td><td>${l.resolvidos}</td><td>${l.revisados}</td><td>${l.recusados}</td>
        <td>${fracao(l.resolvidos_corretos, l.resolvidos)}</td><td>${fracao(l.resolvidos - l.resolvidos_nao_elegiveis, l.elegiveis)}</td></tr>`,
      )
      .join("")}</tbody>
    <tfoot><tr><th scope="row">Soma das contagens</th><td>${soma("total")}</td><td>${soma("elegiveis")}</td><td>${soma("resolvidos")}</td><td>${soma("revisados")}</td><td>${soma("recusados")}</td><td colspan="2">sem taxa agregada</td></tr></tfoot>
  </table></div></div>`;
}
function tabelaIdentidade(linhas: MedicaoIdentidade[]): string {
  return `<div class="cartao"><h2>Identidade entre códigos (SAME_AS, pares)</h2><div class="rolagem"><table>
    <thead><tr><th scope="col">Estrato</th><th scope="col">Pares</th><th scope="col">Verdadeiros</th><th scope="col">Falsos</th><th scope="col">Indeterminados</th><th scope="col">Precisão</th><th scope="col">Recall</th><th scope="col">Falsos recusados</th></tr></thead>
    <tbody>${linhas
      .map(
        (l) => `<tr><th scope="row">${esc(l.estrato)}</th><td>${l.pares}</td><td>${l.verdadeiros}</td><td>${l.falsos}</td><td>${l.indeterminados}</td>
        <td>${fracao(l.verdadeiros_resolvidos, l.resolvidos)}</td><td>${fracao(l.verdadeiros_resolvidos, l.verdadeiros)}</td><td>${fracao(l.falsos_recusados, l.falsos)}</td></tr>`,
      )
      .join("")}</tbody>
  </table></div><p class="pequeno">Indeterminado: um dos itens não é elegível no gabarito. Fica fora de precisão e recall.</p></div>`;
}
let medicaoCarregada = false;
async function carregarMedicao() {
  if (medicaoCarregada) return;
  try {
    const m = await api<Medicao>("/api/medicao");
    medicaoCarregada = true;
    $("#medicao-resultado").innerHTML = `
      ${tabelaTraducao("Tradução de itens do CATMAT para a forma canônica", m.traducao_catmat)}
      ${tabelaTraducao("Tradução de texto livre de fornecedores (compras públicas)", m.traducao_texto_livre)}
      ${tabelaIdentidade(m.identidade)}
      <div class="cartao"><h2>Referência cruzada</h2>
        <p>Recuperadas com fonte: ${fracao(m.referencia_cruzada.com_fonte, m.referencia_cruzada.total)}. Intercâmbio resolvido automaticamente: <strong>${m.referencia_cruzada.intercambio_resolvido_automaticamente}</strong> (esperado 0).</p>
        <p class="pequeno">Só um item do CATMAT nesta família publica referências de duas marcas. n = 1 não sustenta taxa.</p></div>
      <div class="cartao texto"><h2>Limites desta medição</h2><ul>
        <li>A elegibilidade usa as mesmas fontes de regra que o motor. Os 100% medem se o motor aplica as regras sem errar nos textos reais, não se as regras acertam a peça física.</li>
        <li>Quem rotulou o gabarito é a mesma origem que escreveu o motor. A revisão humana da equipe ainda não foi feita.</li>
        <li>O gabarito tem ${m.traducao_catmat.reduce((s, l) => s + l.total, 0) + m.traducao_texto_livre.reduce((s, l) => s + l.total, 0)} textos. A nota de evidência não está calibrada.</li>
        <li>Erros encontrados: <strong>${m.erros.length}</strong>${m.erros.length ? `: ${m.erros.map((e) => esc(`${e.item} (esperado ${e.esperado}, obtido ${e.obtido})`)).join("; ")}` : "."}</li>
        <li>Gabarito e regras: ${esc(m.versao_gabarito)}, ${esc(m.versao_regras)}. Arquivos em <code>dados/gabarito/v1/</code>.</li>
      </ul></div>`;
  } catch (e) {
    $("#medicao-resultado").innerHTML = `<p class="erro" role="alert">${esc((e as Error).message)}</p>`;
  }
}

// ---------- Fontes ----------
let fontesCarregadas = false;
async function carregarFontes() {
  if (fontesCarregadas) return;
  try {
    const f = await api<{ versao_regras: string; corpora: { nome: string; url: string; consultado_em: string; licenca: string }[]; regras: { fonte: string; url: string; licenca: string }[] }>("/api/fontes");
    fontesCarregadas = true;
    $("#fontes-lista").innerHTML = `<div class="cartao texto"><h2>Corpora</h2><ul>${f.corpora
      .map((c) => `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.nome)}</a>. Consulta em ${esc(new Date(c.consultado_em).toLocaleDateString("pt-BR"))}. Licença: ${esc(c.licenca)}.</li>`)
      .join("")}</ul>
      <h2>Regras</h2><ul>${f.regras.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.fonte)}</a>. ${esc(r.licenca)}.</li>`).join("")}</ul>
      <h2>Imagens e OCR</h2><ul>
        <li>Foto do rolamento 6203 C3: R. Henrik Nilsson, <a href="https://commons.wikimedia.org/wiki/File:Second_half_of_20th_century_ball_bearing_6203_C3_M7_by_RKW.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>, CC BY 4.0, reduzida para 800 px.</li>
        <li>OCR: tesseract.js 7 (Apache 2.0) com o modelo eng de tessdata_fast (Apache 2.0), servidos por este site.</li>
      </ul></div>`;
  } catch (e) {
    $("#fontes-lista").innerHTML = `<p class="erro" role="alert">${esc((e as Error).message)}</p>`;
  }
}

ajustarModo();
mostrarAba(location.hash.slice(1));
