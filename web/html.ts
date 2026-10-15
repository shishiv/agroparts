// Pedaços de HTML que a tela de identificar e a página de casos desenham do mesmo jeito.
import type { Decisao, EspecificacaoTecnica, Protecao } from "../src/motor/tipos";
import { LADOS, protecaoEmPalavras, SELO, type Comparacao } from "./linguagem";

export const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const picto = (id: string, classe = "") => `<svg class="${classe}" aria-hidden="true"><use href="#p-${id}" /></svg>`;
export const selo = (d: Decisao, riscado = false) =>
  `<span class="selo selo-${d}${riscado ? " selo-riscado" : ""}">${picto(d)}${SELO[d]}</span>`;
/**
 * Texto escapado que não quebra no lugar errado: o número fica com a unidade ("30 mm"), o código
 * fica inteiro ("6205-2RS1", "90 × 190 × 43 mm") e o "·" fica no fim da linha, nunca no começo.
 */
export const texto = (t: string) =>
  esc(t)
    .replace(/\d+(?: × \d+)+ mm/g, (m) => `<span class="junto">${m}</span>`)
    .replace(/(\d) (mm|%)/g, "$1\u00a0$2")
    .replace(/[^\s<>]*\d[^\s<>]*-[^\s<>]+/g, (m) => `<span class="junto">${m}</span>`)
    .replace(/ · /g, "\u00a0· ");
// O texto fica num <span>: o item da lista é flex, e cada pedaço solto viraria uma coluna.
export const lista = (itens: string[], classe = "motivos") =>
  itens.length ? `<ul class="${classe}">${itens.map((t) => `<li><span>${texto(t)}</span></li>`).join("")}</ul>` : "";
export const link = (url: string, texto: string) => (url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(texto)}</a>` : esc(texto));

/**
 * Desenho dos dois lados do rolamento, lado a lado: esferas à mostra, blindagem de metal ou
 * vedação de borracha. Assim, "em um lado" e "nos dois lados" aparecem diferentes.
 */
export function rolamento(p: Protecao, classe = "rol"): string {
  const nome = `Desenho dos dois lados do rolamento: ${p === "aberto" ? "aberto, com as esferas à mostra" : protecaoEmPalavras(p)}`;
  const [a, b] = LADOS[p];
  return `<svg class="${classe}" viewBox="0 0 104 48" role="img" aria-label="${esc(nome)}"><use href="#r-${a}" width="48" height="48" /><use href="#r-${b}" x="56" width="48" height="48" /></svg>`;
}

/** O que o desenho quer dizer, uma vez por resposta. */
export const LEGENDA_DO_DESENHO = "No desenho, cada círculo é um lado da peça: com esferas, aberto; cinza, blindagem de metal; preto, vedação de borracha.";

/** A peça em uma linha, com o desenho dos dois lados dela e a legenda do desenho. */
export function pecaComDesenho(e: EspecificacaoTecnica, peca: string): string {
  return `<div class="peca-linha"><figure class="rol-figura">${rolamento(e.protecao, "rol rol-grande")}<figcaption>Os dois lados da peça</figcaption></figure>
    <div><p class="peca">${texto(peca)}</p><p class="rol-legenda">${esc(LEGENDA_DO_DESENHO)}</p></div></div>`;
}

/** O desenho de outro cadastro, com o que ele diz em palavras: igual por fora ou muda por fora. */
export function rolamentoDoCadastro(c: Comparacao | null): string {
  if (!c)
    return `<figure class="rol-item"><svg class="rol" viewBox="0 0 104 48" aria-hidden="true"><use href="#r-incerto" width="48" height="48" /><use href="#r-incerto" x="56" width="48" height="48" /></svg><figcaption>Proteção não conferida</figcaption></figure>`;
  const fora = c.diferencas.some((d) => d.nome === "Proteção" || d.nome === "Tamanho") ? "Muda por fora" : "Igual por fora";
  return `<figure class="rol-item">${rolamento(c.protecao)}<figcaption>${fora}</figcaption></figure>`;
}

/**
 * O que bate e o que muda entre a peça procurada e outro cadastro, numa linha por dado. As notas
 * (sobre o texto ou um problema do cadastro) vêm no fim, com o pictograma de informação ou de atenção.
 */
export function ficha(c: Comparacao, notas: string[] = [], atencao = false): string {
  const difs = c.diferencas.map(
    (d) =>
      `<li class="ficha-dif">${picto("recusa", "ficha-picto")}<span><b>${esc(d.nome)}:</b> ${texto(d.outro)}. <span class="ficha-contra">Na peça procurada: ${texto(d.procurada)}.</span></span></li>`,
  );
  const iguais = c.iguais ? [`<li class="ficha-igual">${picto("resolve", "ficha-picto")}<span>${texto(c.iguais)}</span></li>`] : [];
  const extra = notas.map((n) => `<li class="ficha-nota${atencao ? " ficha-atencao" : ""}">${picto(atencao ? "revisa" : "info", "ficha-picto")}<span>${texto(n)}</span></li>`);
  return `<ul class="ficha">${[...difs, ...iguais, ...extra].join("")}</ul>`;
}
