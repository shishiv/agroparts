// F2: o agrupamento que a usina já tem, comparado com a chave de identidade, e a visão por tipo.
// Funções puras. Nada aqui guarda estado, emite código de SKU ou cria relação:
// um grupo da usina que mistura chaves é evidência para uma pessoa, e a visão por tipo nunca é SAME_AS.
import {
  ATRIBUTOS_IDENTIDADE,
  descreverDivergencia,
  divergencias,
  rotuloProtecao,
  type AtributoIdentidade,
  type Divergencia,
  type Identidade,
} from "./especificacao";
import { celulaCsv, traduzirLote, type LinhaLote, type ResultadoLote } from "./lote";
import type { MaterialOriginal } from "./tipos";

type DuasOuMais<T> = [T, T, ...T[]];
type UmaOuMais<T> = [T, ...T[]];

const umaOuMais = <T>(a: T[]): a is UmaOuMais<T> => a.length >= 1;
const duasOuMais = <T>(a: T[]): a is DuasOuMais<T> => a.length >= 2;
const vazia = <T>(a: T[]): a is [] => a.length === 0;
const unica = <T>(a: T[]): a is [T] => a.length === 1;
const zeroOuUma = <T>(a: T[]): a is [] | [T] => a.length < 2;

/** Uma chave de identidade presente num grupo, com as linhas que a provam. */
export interface ChaveNoGrupo {
  chave: string;
  identidade: Identidade;
  /** Designação canônica, para a tela. */
  designacao: string;
  linhas: LinhaLote[];
}

// ---------- (1) O agrupamento da usina ----------

/** Um material como veio do cadastro, com o id do grupo que a usina deu a ele na mesma linha do arquivo. */
export interface EntradaAgrupada {
  original: MaterialOriginal;
  /** Id opaco do grupo na usina ("SKU unificado"). Copiado como veio (ADR 0001). Ausente ou em branco = sem grupo. */
  grupo_usina?: string;
}

/**
 * Um grupo da usina com dois ou mais cadastros, examinado por regra, nunca por semelhança:
 *   mistura:      duas ou mais chaves resolvidas diferentes, e `divergencias` diz quais atributos diferem;
 *   coerente:     todas as linhas resolveram e têm a mesma chave;
 *   inconclusivo: alguma linha não resolveu e as resolvidas não bastam para afirmar mistura.
 */
export type GrupoDaUsina =
  | { situacao: "mistura"; id: string; chaves: DuasOuMais<ChaveNoGrupo>; divergencias: UmaOuMais<Divergencia>; sem_chave: LinhaLote[] }
  | { situacao: "coerente"; id: string; chaves: [ChaveNoGrupo]; divergencias: []; sem_chave: [] }
  | { situacao: "inconclusivo"; id: string; chaves: [] | [ChaveNoGrupo]; divergencias: []; sem_chave: UmaOuMais<LinhaLote> };

export type SituacaoGrupo = GrupoDaUsina["situacao"];
export type GrupoEmMistura = Extract<GrupoDaUsina, { situacao: "mistura" }>;

export interface ComparacaoAgrupamento {
  /** O mesmo lote que `traduzirLote(entradas.map(e => e.original))` devolveria: a página não traduz duas vezes. */
  lote: ResultadoLote;
  /** Grupos com dois ou mais cadastros: mistura primeiro, depois inconclusivo, depois coerente; empate por id. */
  grupos: GrupoDaUsina[];
  /** Números absolutos (ADR 0014), derivados de `grupos` e das entradas na construção. */
  contagem: Record<SituacaoGrupo, number> & { grupos_unitarios: number; cadastros_com_grupo: number; cadastros_sem_grupo: number };
}

const ORDEM_SITUACAO: Record<SituacaoGrupo, number> = { mistura: 0, inconclusivo: 1, coerente: 2 };

const porCodigo = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Traduz as entradas e examina cada grupo da usina contra a chave de identidade do motor.
 * O grupo vem da mesma linha do material, então não há junção por código do ERP.
 * Não decide SAME_AS nem desfaz o grupo: diz onde o grupo junta chaves diferentes e por quê.
 * Sem nenhum `grupo_usina`, devolve o lote e `grupos` vazio: um só caminho para a página.
 */
export function compararAgrupamento(entradas: readonly EntradaAgrupada[]): ComparacaoAgrupamento {
  const lote = traduzirLote(entradas.map((e) => e.original));
  const porGrupo = new Map<string, LinhaLote[]>();
  entradas.forEach((e, i) => {
    const id = e.grupo_usina?.trim();
    if (id) porGrupo.set(id, [...(porGrupo.get(id) ?? []), lote.linhas[i]]);
  });

  const grupos: GrupoDaUsina[] = [];
  let grupos_unitarios = 0;
  for (const [id, linhas] of porGrupo) {
    if (linhas.length < 2) {
      grupos_unitarios++;
      continue;
    }
    grupos.push(examinarGrupo(id, linhas));
  }
  grupos.sort((a, b) => ORDEM_SITUACAO[a.situacao] - ORDEM_SITUACAO[b.situacao] || porCodigo(a.id, b.id));

  const cadastros_com_grupo = [...porGrupo.values()].reduce((soma, ls) => soma + ls.length, 0);
  return {
    lote,
    grupos,
    contagem: {
      mistura: grupos.filter((g) => g.situacao === "mistura").length,
      inconclusivo: grupos.filter((g) => g.situacao === "inconclusivo").length,
      coerente: grupos.filter((g) => g.situacao === "coerente").length,
      grupos_unitarios,
      cadastros_com_grupo,
      cadastros_sem_grupo: entradas.length - cadastros_com_grupo,
    },
  };
}

function examinarGrupo(id: string, linhas: LinhaLote[]): GrupoDaUsina {
  const chaves = agruparPorChave(linhas.filter((l) => l.identidade !== null));
  const sem_chave = linhas.filter((l) => l.identidade === null);
  if (duasOuMais(chaves)) {
    const diferem = divergencias(chaves.map((c) => c.identidade));
    // Chaves diferentes saem de identidades diferentes, então ao menos um atributo difere.
    if (!umaOuMais(diferem)) throw new Error(`grupo ${id}: chaves diferentes sem atributo divergente`);
    return { situacao: "mistura", id, chaves, divergencias: diferem, sem_chave };
  }
  if (zeroOuUma(chaves) && umaOuMais(sem_chave)) return { situacao: "inconclusivo", id, chaves, divergencias: [], sem_chave };
  if (unica(chaves) && vazia(sem_chave)) return { situacao: "coerente", id, chaves, divergencias: [], sem_chave: [] };
  throw new Error(`grupo ${id}: nenhum cadastro examinado`);
}

/**
 * FNV-1a de 32 bits sobre os bytes UTF-8 do texto. Síncrona e pura, porque `crypto.subtle` é assíncrono
 * e o sorteio não é segredo. É a função de hash que o pré-registro da fatia 4 cita.
 */
export function fnv1a32(texto: string): number {
  let h = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(texto)) {
    h ^= byte;
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Semente da amostra que a página de diagnóstico baixa. A fatia 4 a congela no pré-registro de F2,
 * em commit anterior à leitura do arquivo da usina, e um teste confere que as duas são iguais.
 */
export const SEMENTE_DA_AMOSTRA = "f2-agrupamento-v1";

/**
 * Amostra pré-registrada dos grupos em mistura que a pessoa da usina vai julgar.
 * Determinística: depende só da semente e dos ids, não da ordem do arquivo.
 * A semente fica no pré-registro, em commit anterior à leitura do arquivo da usina. Com menos misturas que `n`, devolve todas.
 * Ordena as misturas por `fnv1a32(semente + "\u0000" + id)`, desempata por id e pega as `n` primeiras.
 */
export function amostrar(c: ComparacaoAgrupamento, semente: string, n = 20): GrupoEmMistura[] {
  return c.grupos
    .filter((g): g is GrupoEmMistura => g.situacao === "mistura")
    .map((g) => ({ g, h: fnv1a32(`${semente}\u0000${g.id}`) }))
    .sort((a, b) => a.h - b.h || porCodigo(a.g.id, b.g.id))
    .slice(0, Math.max(0, n))
    .map(({ g }) => g);
}

/** Colunas de `amostraParaCsv`. `distincao_real` fica por último: é a única que a pessoa da usina preenche. */
export const COLUNAS_AMOSTRA = ["grupo_usina", "codigo", "chave", "designacao", "atributos_que_diferem", "texto_original", "distincao_real"] as const;

/**
 * CSV para a pessoa da usina julgar a amostra: uma linha por cadastro dos grupos sorteados, com o id do grupo da usina,
 * a chave, a designação, os atributos que diferem, o texto original intacto e a coluna `distincao_real` em branco.
 * Os cadastros sem chave saem com `chave` e `designacao` em branco.
 * Sai do navegador só como download, com o escape `celulaCsv` de lote.ts. A equipe recebe de volta só as contagens.
 */
export function amostraParaCsv(amostra: readonly GrupoEmMistura[]): string {
  const linhas = amostra.flatMap((g) => {
    const diferem = g.divergencias.map(descreverDivergencia).join(" | ");
    const cadastros = [
      ...g.chaves.flatMap((k) => k.linhas.map((l) => ({ l, chave: k.chave, designacao: k.designacao }))),
      ...g.sem_chave.map((l) => ({ l, chave: "", designacao: "" })),
    ];
    return cadastros.map(({ l, chave, designacao }) => [g.id, l.original.codigo, chave, designacao, diferem, l.original.texto, ""].map(celulaCsv).join(","));
  });
  return [COLUNAS_AMOSTRA.join(","), ...linhas].join("\n") + "\n";
}

// ---------- (2) A visão por tipo ----------

/** Atributos que uma visão por tipo pode juntar. A designação básica define o tipo e nunca se junta. */
export type AtributoJuntavel = Exclude<AtributoIdentidade, "designacao_basica">;

/** Juntar todos os atributos juntáveis: o tipo é só a designação básica. */
export const JUNTA_TUDO_MENOS_A_BASICA = ATRIBUTOS_IDENTIDADE.filter(
  (a): a is AtributoJuntavel => a !== "designacao_basica",
) as UmaOuMais<AtributoJuntavel>;

/**
 * Um grupo da visão por tipo que junta duas ou mais chaves de identidade.
 * Não é SAME_AS nem INTERCHANGEABLE_FOR (ADR 0013) e não tem código: `rotulo` é texto de tela, e nada o devolve ao ERP.
 */
export interface GrupoPorTipo {
  rotulo: string;
  chaves: DuasOuMais<ChaveNoGrupo>;
  /** Os atributos que este grupo juntou de fato, sempre contidos em `VisaoPorTipo.junta`. */
  divergencias: UmaOuMais<Divergencia>;
}

export interface VisaoPorTipo {
  /** O que a visão declara juntar. Não vazio: uma visão que não junta nada seria a identidade, que já é `lote.grupos_duplicidade`. */
  junta: UmaOuMais<AtributoJuntavel>;
  /** Linhas resolvidas consideradas (183 no CATMAT de hoje). */
  itens: number;
  skus_por_tipo: number;
  skus_por_identidade: number;
  /** Só os grupos que juntam chaves. `skus_por_identidade - skus_por_tipo` distinções somem nesta visão. */
  grupos: GrupoPorTipo[];
}

const MATERIAL = (inox: boolean) => (inox ? "inoxidável" : "não declarado inox");

function rotuloDoTipo(i: Identidade, mantidos: readonly AtributoIdentidade[]): string {
  return mantidos
    .map((a) => {
      switch (a) {
        case "designacao_basica":
          return i.designacao_basica;
        case "protecao":
          return rotuloProtecao(i.protecao);
        case "folga":
          return `folga ${i.folga}`;
        case "inox":
          return MATERIAL(i.inox);
      }
    })
    .join(" · ");
}

/**
 * Agrupa as linhas resolvidas por todos os atributos de identidade menos os de `junta`.
 * CATMAT de hoje: junta tudo -> 59 SKUs; junta folga e inox -> 133; a identidade dá 150.
 */
export function visaoPorTipo(lote: ResultadoLote, junta: UmaOuMais<AtributoJuntavel> = JUNTA_TUDO_MENOS_A_BASICA): VisaoPorTipo {
  const mantidos = ATRIBUTOS_IDENTIDADE.filter((a) => !junta.some((j) => j === a));
  const porTipo = new Map<string, LinhaLote[]>();
  const chavesVistas = new Set<string>();
  let itens = 0;
  for (const l of lote.linhas) {
    if (!l.identidade || !l.chave) continue;
    itens++;
    chavesVistas.add(l.chave);
    const i = l.identidade;
    const tipo = mantidos.map((a) => String(i[a])).join("|");
    porTipo.set(tipo, [...(porTipo.get(tipo) ?? []), l]);
  }

  const grupos: GrupoPorTipo[] = [];
  for (const linhas of porTipo.values()) {
    const chaves = agruparPorChave(linhas);
    if (!duasOuMais(chaves)) continue;
    const diferem = divergencias(chaves.map((c) => c.identidade));
    if (!umaOuMais(diferem)) throw new Error(`tipo ${chaves[0].chave}: chaves diferentes sem atributo divergente`);
    grupos.push({ rotulo: rotuloDoTipo(chaves[0].identidade, mantidos), chaves, divergencias: diferem });
  }
  return {
    junta,
    itens,
    skus_por_tipo: porTipo.size,
    skus_por_identidade: chavesVistas.size,
    grupos,
  };
}

/** Interna às duas visões: linhas resolvidas -> uma ChaveNoGrupo por chave, na ordem de aparição. */
function agruparPorChave(linhas: readonly LinhaLote[]): ChaveNoGrupo[] {
  const porChave = new Map<string, ChaveNoGrupo>();
  for (const l of linhas) {
    if (!l.chave || !l.identidade) continue;
    const existente = porChave.get(l.chave);
    if (existente) existente.linhas.push(l);
    else porChave.set(l.chave, { chave: l.chave, identidade: l.identidade, designacao: l.designacao ?? l.chave, linhas: [l] });
  }
  return [...porChave.values()];
}
