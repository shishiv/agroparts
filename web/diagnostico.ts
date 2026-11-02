// Diagnóstico de duplicidade: o motor roda aqui, no navegador, sobre o CSV escolhido.
// Nada do arquivo é enviado: esta página não faz nenhum pedido de rede além do próprio site.
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow/latin-700.css";
import "@fontsource/barlow-semi-condensed/latin-600.css";
import "@fontsource/barlow-semi-condensed/latin-700.css";
import { loteParaCsv, traduzirLote, type LinhaLote, type ResultadoLote } from "../src/motor/lote";
import { adivinharColunas, decodificar, lerCsv, type Tabela } from "./csv";
import { esc, selo } from "./html";
import { frases, SELO } from "./linguagem";

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const PASSO = 50;

let tabela: Tabela | null = null;
let nomeDoArquivo = "";
let urlDoCsv: string | null = null;

const naFamilia = (l: LinhaLote) => l.estrato.startsWith("série ");

function diagnosticar(t: Tabela, codigo: number, descricao: number) {
  const entradas = t.linhas
    .map((l) => ({ origem: "entrada manual" as const, codigo: l[codigo]?.trim() ? l[codigo] : undefined, texto: l[descricao] ?? "" }))
    .filter((e) => e.texto.trim() !== "");
  return { lote: traduzirLote(entradas), semDescricao: t.linhas.length - entradas.length };
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
      ${linhas.length > mostrar ? `<button type="button" class="botao" id="mais-pessoa">Mostrar mais ${Math.min(PASSO, linhas.length - mostrar)}</button>` : ""}
    </div>`;
}

function desenhar(t: Tabela, mostrar = PASSO) {
  const codigo = Number($<HTMLSelectElement>("#col-codigo").value);
  const descricao = Number($<HTMLSelectElement>("#col-descricao").value);
  const { lote, semDescricao } = diagnosticar(t, codigo, descricao);
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

  <section class="bloco" aria-labelledby="t-grupos">
    <div class="tabela-titulo"><h2 id="t-grupos">Cadastros duplicados</h2><p>Cada grupo junta códigos diferentes com a mesma especificação. Nenhum cadastro é apagado nem alterado.</p></div>
    ${desenharGrupos(lote)}
  </section>

  <section class="bloco" aria-labelledby="t-pessoa">
    <div class="tabela-titulo"><h2 id="t-pessoa">${esc(SELO.revisa)}</h2><p>O sistema não decide estes cadastros sozinho.</p></div>
    ${desenharPessoa(pessoa, mostrar)}
  </section>`;

  document.querySelector("#mais-pessoa")?.addEventListener("click", () => {
    const y = scrollY;
    desenhar(t, mostrar + PASSO);
    scrollTo(0, y);
  });
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
    $("#colunas").hidden = false;
    desenhar(t);
  } catch {
    mostrarErro("Não foi possível ler este arquivo.");
  }
});

for (const id of ["#col-codigo", "#col-descricao"]) $(id).addEventListener("change", () => tabela && desenhar(tabela));
