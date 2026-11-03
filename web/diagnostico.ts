// Diagnóstico de duplicidade: o motor roda aqui, no navegador, sobre o CSV escolhido.
// Nada do arquivo é enviado: esta página não faz nenhum pedido de rede além do próprio site.
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow/latin-700.css";
import "@fontsource/barlow-semi-condensed/latin-600.css";
import "@fontsource/barlow-semi-condensed/latin-700.css";
import {
  amostraParaCsv,
  amostrar,
  compararAgrupamento,
  SEMENTE_DA_AMOSTRA,
  visaoPorTipo,
  type ChaveNoGrupo,
  type GrupoEmMistura,
  type GrupoPorTipo,
} from "../src/motor/agrupamento";
import { descreverDivergencia, type Divergencia } from "../src/motor/especificacao";
import { loteParaCsv, type LinhaLote, type ResultadoLote } from "../src/motor/lote";
import { adivinharColunas, decodificar, lerCsv, type Tabela } from "./csv";
import { esc, picto } from "./html";
import { frases, SELO } from "./linguagem";

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const PASSO = 50;
const PASSO_GRUPOS = 10;

interface Mostrar {
  pessoa: number;
  misturas: number;
  tipos: number;
}
const INICIO: Mostrar = { pessoa: PASSO, misturas: PASSO_GRUPOS, tipos: PASSO_GRUPOS };

let tabela: Tabela | null = null;
let nomeDoArquivo = "";
let urlDoCsv: string | null = null;
let urlDaAmostra: string | null = null;

const naFamilia = (l: LinhaLote) => l.estrato.startsWith("série ");

/** `grupo` é a coluna do agrupamento da usina, ou null quando a pessoa deixa em "Nenhuma". */
function diagnosticar(t: Tabela, codigo: number, descricao: number, grupo: number | null) {
  const entradas = t.linhas
    .map((l) => ({
      original: { origem: "entrada manual" as const, codigo: l[codigo]?.trim() ? l[codigo] : undefined, texto: l[descricao] ?? "" },
      grupo_usina: grupo === null ? undefined : l[grupo],
    }))
    .filter((e) => e.original.texto.trim() !== "");
  const comparacao = compararAgrupamento(entradas);
  return {
    comparacao,
    porTipo: grupo === null ? null : visaoPorTipo(comparacao.lote),
    semDescricao: t.linhas.length - entradas.length,
  };
}

function opcoes(t: Tabela, escolhida: number) {
  return t.cabecalho.map((nome, i) => `<option value="${i}" ${i === escolhida ? "selected" : ""}>${esc(nome || `Coluna ${i + 1}`)}</option>`).join("");
}

const itemDoGrupo = (l: LinhaLote) =>
  `<div class="dx-item"><span class="dx-codigo">${esc(l.original.codigo ?? "sem código")}</span><span class="dx-texto">${esc(l.original.texto)}</span></div>`;

function desenharGrupos(lote: ResultadoLote) {
  if (!lote.grupos_duplicidade.length) return `<p class="estado">Nenhum grupo de cadastros duplicados nesta família.</p>`;
  const porGrupo = new Map<number, LinhaLote[]>();
  for (const l of lote.linhas) if (l.grupo_duplicidade) porGrupo.set(l.grupo_duplicidade, [...(porGrupo.get(l.grupo_duplicidade) ?? []), l]);
  return `<ul class="dx-grupos">${lote.grupos_duplicidade
    .map((g) => {
      const itens = porGrupo.get(g.grupo)!;
      return `<li class="dx-grupo">
        <h3>${esc(g.designacao)} <span class="dx-quantos">${itens.length} cadastros</span></h3>
        <p class="dx-motivo">Mesma especificação: ${esc(itens[0].descricao_por_regra ?? "")}</p>
        <div class="dx-itens">${itens.map(itemDoGrupo).join("")}</div>
      </li>`;
    })
    .join("")}</ul>`;
}

const cadastros = (n: number) => `${n} ${n === 1 ? "cadastro" : "cadastros"}`;
const capitalizar = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const desenharDivergencias = (ds: readonly Divergencia[]) =>
  `<ul class="ficha">${ds.map((d) => `<li class="ficha-dif">${picto("recusa", "ficha-picto")}<span>${esc(capitalizar(descreverDivergencia(d)))}</span></li>`).join("")}</ul>`;

const maisGrupos = (secao: "misturas" | "tipos", mostrados: number, total: number) =>
  total > mostrados
    ? `<div class="acoes mais"><p class="pequeno">Mostrando ${mostrados} de ${total}.</p><button type="button" class="botao" data-mais="${secao}">Mostrar mais ${Math.min(PASSO_GRUPOS, total - mostrados)}</button></div>`
    : "";

function desenharChave(k: ChaveNoGrupo) {
  return `<div class="dx-chave"><h4>${esc(k.designacao)} <span class="dx-quantos">${cadastros(k.linhas.length)}</span></h4><div class="dx-itens">${k.linhas.map(itemDoGrupo).join("")}</div></div>`;
}

function desenharMistura(g: GrupoEmMistura) {
  const total = g.chaves.reduce((soma, k) => soma + k.linhas.length, 0) + g.sem_chave.length;
  return `<li class="dx-grupo dx-mistura">
    <h3>Grupo ${esc(g.id)} <span class="dx-quantos">${cadastros(total)}</span></h3>
    ${desenharDivergencias(g.divergencias)}
    ${g.chaves.map(desenharChave).join("")}
    ${g.sem_chave.length ? `<div class="dx-chave"><h4>Precisa de uma pessoa</h4><div class="dx-itens">${g.sem_chave.map(itemDoGrupo).join("")}</div></div>` : ""}
  </li>`;
}

function desenharMisturas(grupos: readonly GrupoEmMistura[], mostrar: number) {
  if (!grupos.length) return `<p class="estado">Nenhum grupo da sua usina mistura peças diferentes.</p>`;
  return `<ul class="dx-grupos">${grupos.slice(0, mostrar).map(desenharMistura).join("")}</ul>${maisGrupos("misturas", Math.min(mostrar, grupos.length), grupos.length)}`;
}

function desenharGrupoPorTipo(g: GrupoPorTipo) {
  const codigos = (k: ChaveNoGrupo) => k.linhas.map((l) => l.original.codigo ?? "sem código").join(", ");
  return `<li class="dx-grupo dx-mistura">
    <h3>${esc(g.rotulo)} <span class="dx-quantos">${g.chaves.length} SKUs por identidade</span></h3>
    ${desenharDivergencias(g.divergencias)}
    <ul class="dx-codigos">${g.chaves.map((k) => `<li><strong>${esc(k.designacao)}</strong> ${esc(codigos(k))}</li>`).join("")}</ul>
  </li>`;
}

function desenharPorTipo(grupos: readonly GrupoPorTipo[], mostrar: number) {
  if (!grupos.length) return `<p class="estado">Nenhum SKU por tipo junta chaves diferentes.</p>`;
  return `<ul class="dx-grupos">${grupos.slice(0, mostrar).map(desenharGrupoPorTipo).join("")}</ul>${maisGrupos("tipos", Math.min(mostrar, grupos.length), grupos.length)}`;
}

function desenharPessoa(linhas: LinhaLote[], mostrar: number) {
  if (!linhas.length) return `<p class="estado">Nenhum cadastro precisa de uma pessoa.</p>`;
  return `<div class="rolagem tabela"><table class="dx-lista">
      <thead><tr><th scope="col">Código</th><th scope="col">Texto original</th><th scope="col">Por quê</th></tr></thead>
      <tbody>${linhas
        .slice(0, mostrar)
        .map((l) => `<tr><td>${esc(l.original.codigo ?? "")}</td><td class="txt">${esc(l.original.texto)}</td><td class="txt">${esc(frases(l.motivos).join(" "))}</td></tr>`)
        .join("")}</tbody>
    </table></div>
    <div class="acoes mais">
      <p class="pequeno">Mostrando ${Math.min(mostrar, linhas.length)} de ${linhas.length}. O CSV de resultado traz todos.</p>
      ${linhas.length > mostrar ? `<button type="button" class="botao" data-mais="pessoa">Mostrar mais ${Math.min(PASSO, linhas.length - mostrar)}</button>` : ""}
    </div>`;
}

function desenharAgrupamento(c: ReturnType<typeof diagnosticar>, mostrar: Mostrar) {
  const { comparacao, porTipo } = c;
  if (!porTipo) return "";
  const misturas = comparacao.grupos.filter((g): g is GrupoEmMistura => g.situacao === "mistura");
  const n = comparacao.contagem;

  if (urlDaAmostra) URL.revokeObjectURL(urlDaAmostra);
  urlDaAmostra = misturas.length
    ? URL.createObjectURL(new Blob([amostraParaCsv(amostrar(comparacao, SEMENTE_DA_AMOSTRA))], { type: "text/csv;charset=utf-8" }))
    : null;

  return `
  <section class="bloco" aria-labelledby="t-misturas">
    <div class="tabela-titulo"><h2 id="t-misturas">Agrupamento da sua usina</h2></div>
    <div class="resumo-lote">
      <div><strong>${n.mistura}</strong><span>grupos que misturam peças</span></div>
      <div><strong>${n.coerente}</strong><span>grupos sem mistura</span></div>
      <div><strong>${n.inconclusivo}</strong><span>grupos com cadastro em dúvida</span></div>
      <div><strong>${n.grupos_unitarios}</strong><span>grupos de um cadastro só</span></div>
    </div>
    ${urlDaAmostra ? `<div class="acoes"><a class="botao" id="baixar-amostra" href="${urlDaAmostra}" download="amostra-agroparts-misturas.csv">Baixar amostra para a usina julgar (CSV)</a></div>` : ""}
    ${desenharMisturas(misturas, mostrar.misturas)}
  </section>

  <section class="bloco" aria-labelledby="t-tipo">
    <div class="tabela-titulo"><h2 id="t-tipo">SKUs por tipo e por identidade</h2></div>
    <div class="resumo-lote">
      <div><strong>${porTipo.skus_por_tipo}</strong><span>SKUs por tipo</span></div>
      <div><strong>${porTipo.skus_por_identidade}</strong><span>SKUs por identidade</span></div>
    </div>
    ${desenharPorTipo(porTipo.grupos, mostrar.tipos)}
  </section>`;
}

function desenhar(t: Tabela, mostrar: Mostrar = INICIO) {
  const codigo = Number($<HTMLSelectElement>("#col-codigo").value);
  const descricao = Number($<HTMLSelectElement>("#col-descricao").value);
  const valorGrupo = $<HTMLSelectElement>("#col-grupo").value;
  const resultado = diagnosticar(t, codigo, descricao, valorGrupo === "" ? null : Number(valorGrupo));
  const { semDescricao } = resultado;
  const lote = resultado.comparacao.lote;
  const total = lote.linhas.length;
  const dentro = lote.linhas.filter(naFamilia).length;
  const pessoa = lote.linhas.filter((l) => l.decisao === "revisa");

  if (urlDoCsv) URL.revokeObjectURL(urlDoCsv);
  urlDoCsv = URL.createObjectURL(new Blob([loteParaCsv(lote)], { type: "text/csv;charset=utf-8" }));
  const nomeCsv = `diagnostico-agroparts-${nomeDoArquivo.replace(/\.csv$/i, "") || "cadastro"}.csv`;

  $("#resultado").innerHTML = `
  <div class="resumo-lote">
    <div><strong>${total}</strong><span>itens lidos</span></div>
    <div><strong>${dentro}</strong><span>na família coberta</span></div>
    <div><strong>${total - dentro}</strong><span>fora da família</span></div>
    <div><strong>${lote.grupos_duplicidade.length}</strong><span>grupos de cadastros duplicados</span></div>
    <div><strong>${pessoa.length}</strong><span>${SELO.revisa.toLowerCase()}</span></div>
  </div>
  ${semDescricao ? `<p class="pequeno">${semDescricao} ${semDescricao === 1 ? "linha sem descrição foi ignorada" : "linhas sem descrição foram ignoradas"}.</p>` : ""}
  <div class="acoes dx-baixar"><a class="botao primario" id="baixar" href="${urlDoCsv}" download="${esc(nomeCsv)}">Baixar CSV de resultado</a></div>
  ${desenharAgrupamento(resultado, mostrar)}

  <section class="bloco" aria-labelledby="t-grupos">
    <div class="tabela-titulo"><h2 id="t-grupos">Cadastros duplicados</h2><p>Cada grupo junta códigos diferentes com a mesma especificação. Nenhum cadastro é apagado nem alterado.</p></div>
    ${desenharGrupos(lote)}
  </section>

  <section class="bloco" aria-labelledby="t-pessoa">
    <div class="tabela-titulo"><h2 id="t-pessoa">${esc(SELO.revisa)}</h2><p>O sistema não decide estes cadastros sozinho.</p></div>
    ${desenharPessoa(pessoa, mostrar.pessoa)}
  </section>`;

  const maisDe: Record<string, (m: Mostrar) => Mostrar> = {
    pessoa: (m) => ({ ...m, pessoa: m.pessoa + PASSO }),
    misturas: (m) => ({ ...m, misturas: m.misturas + PASSO_GRUPOS }),
    tipos: (m) => ({ ...m, tipos: m.tipos + PASSO_GRUPOS }),
  };
  document.querySelectorAll<HTMLElement>("[data-mais]").forEach((botao) =>
    botao.addEventListener("click", () => {
      const y = scrollY;
      desenhar(t, maisDe[botao.dataset.mais!](mostrar));
      scrollTo(0, y);
    }),
  );
}

function mostrarErro(mensagem: string) {
  tabela = null;
  $("#colunas").hidden = true;
  $("#resultado").innerHTML = `<p class="erro" role="alert">${esc(mensagem)}</p>`;
}

$<HTMLInputElement>("#arquivo").addEventListener("change", async (ev) => {
  const arquivo = (ev.target as HTMLInputElement).files?.[0];
  if (!arquivo) return;
  nomeDoArquivo = arquivo.name;
  $("#resultado").innerHTML = `<p class="estado">Lendo o arquivo…</p>`;
  try {
    const t = lerCsv(decodificar(await arquivo.arrayBuffer()));
    if (t.cabecalho.length < 2 || !t.linhas.length) return mostrarErro("Não encontrei linhas com pelo menos duas colunas. Confira se o arquivo é um CSV com cabeçalho na primeira linha.");
    tabela = t;
    const chute = adivinharColunas(t);
    $("#col-codigo").innerHTML = opcoes(t, chute.codigo);
    $("#col-descricao").innerHTML = opcoes(t, chute.descricao);
    $("#col-grupo").innerHTML = `<option value="" selected>Nenhuma</option>${opcoes(t, -1)}`;
    $("#colunas").hidden = false;
    desenhar(t);
  } catch {
    mostrarErro("Não foi possível ler este arquivo.");
  }
});

for (const id of ["#col-codigo", "#col-descricao", "#col-grupo"]) $(id).addEventListener("change", () => tabela && desenhar(tabela));
