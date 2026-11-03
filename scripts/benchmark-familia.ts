// Lê o benchmark público de F3 em dados/ e aplica as regras de dados/preregistro/f3-familia.json.
// É o único ponto que cria `TextoPublico`: os casos vêm de dados/publico/, nunca de arquivo de cliente.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { tokens } from "../src/motor/identidade";
import type { ArvoreCatmat, CasoFamilia, PreregistroFamilia, TextoPublico } from "./familia";

/** Uma entrada de dados/publico/compras-familia.json: um texto do campo marca nas compras de um PDM. */
export interface TextoDeCompra {
  pdm_consultado: number;
  /** O PDM da linha, como a API de compras devolve: em texto. */
  codigoPdm: string;
  marca: string;
  linhas: number;
  idCompraItem: string;
  codigoItemCatalogo: number;
}

export interface Exclusoes {
  /** Linhas de compra, não pares: a API devolveu um codigoPdm diferente do consultado. */
  linhas_com_pdm_diferente: number;
  sem_token: number;
  so_nome_de_marca: number;
  rotulo_ambiguo: number;
  acima_do_limite_por_pdm: number;
}

/** "reproduzido" pede pelo menos uma conferência que bateu e nenhuma que falhou, nos dois arquivos. */
export type Reproducao = "reproduzido" | "nao_conferido" | "nao_bate";

interface Fonte {
  consultado_em: string;
  sha256: string;
  conferencias: { em: string; sha256: string; bate: boolean }[];
}

/** Um texto normalizado num PDM, com o campo marca da linha de menor idCompraItem. */
interface Par {
  normal: string;
  pdm: number;
  marca: string;
  idCompraItem: string;
}

const sha256 = (texto: string) => createHash("sha256").update(texto).digest("hex");
const PALAVRAS_QUE_NAO_SAO_PECA = new Set(["PARA", "TIPO"]);

/**
 * As regras de seleção e de exclusão do pré-registro, na ordem dele.
 * Um caso por par (texto normalizado, PDM), com o texto da linha de menor idCompraItem do par.
 */
export function montarCasos(
  textos: readonly TextoDeCompra[],
  arvore: ArvoreCatmat,
  limitePorPdm: number,
): { pares: number; casos: (Omit<CasoFamilia, "texto"> & { texto: string })[]; exclusoes: Exclusoes } {
  const lugar = new Map<number, { grupo: number; classe: number }>();
  const vocabulario = new Set<string>();
  for (const g of arvore.grupos)
    for (const c of g.classes)
      for (const p of c.pdms) {
        lugar.set(p.codigo, { grupo: g.codigo, classe: c.codigo });
        for (const t of tokens(p.nome)) if (t.length >= 4 && !PALAVRAS_QUE_NAO_SAO_PECA.has(t)) vocabulario.add(t);
      }

  const exclusoes: Exclusoes = { linhas_com_pdm_diferente: 0, sem_token: 0, so_nome_de_marca: 0, rotulo_ambiguo: 0, acima_do_limite_por_pdm: 0 };
  const pares = new Map<string, Par>();
  for (const t of textos) {
    if (Number(t.codigoPdm) !== t.pdm_consultado) {
      exclusoes.linhas_com_pdm_diferente += t.linhas;
      continue;
    }
    const normal = [...tokens(t.marca)].sort().join(" ");
    const chave = `${t.pdm_consultado}\n${normal}`;
    const atual = pares.get(chave);
    if (!atual || t.idCompraItem < atual.idCompraItem || (t.idCompraItem === atual.idCompraItem && t.marca < atual.marca)) {
      pares.set(chave, { normal, pdm: t.pdm_consultado, marca: t.marca, idCompraItem: t.idCompraItem });
    }
  }

  const restantes: Par[] = [];
  for (const p of pares.values()) {
    if (!p.normal) exclusoes.sem_token++;
    else if (!/\d/.test(p.normal) && !p.normal.split(" ").some((t) => vocabulario.has(t))) exclusoes.so_nome_de_marca++;
    else restantes.push(p);
  }
  const pdmsDoTexto = new Map<string, Set<number>>();
  for (const p of restantes) pdmsDoTexto.set(p.normal, (pdmsDoTexto.get(p.normal) ?? new Set()).add(p.pdm));

  const porPdm = new Map<number, Par[]>();
  for (const p of restantes) {
    if (pdmsDoTexto.get(p.normal)!.size > 1) exclusoes.rotulo_ambiguo++;
    else porPdm.set(p.pdm, [...(porPdm.get(p.pdm) ?? []), p]);
  }
  const casos: (Omit<CasoFamilia, "texto"> & { texto: string })[] = [];
  for (const [pdm, doPdm] of [...porPdm].sort(([a], [b]) => a - b)) {
    const l = lugar.get(pdm);
    if (!l) throw new Error(`o PDM ${pdm} das compras não está na árvore`);
    const escolhidos = doPdm
      .map((p) => ({ p, h: sha256(p.normal) }))
      .sort((a, b) => (a.h < b.h ? -1 : 1))
      .slice(0, limitePorPdm);
    exclusoes.acima_do_limite_por_pdm += doPdm.length - escolhidos.length;
    for (const { p } of escolhidos) casos.push({ id: `${pdm}:${p.idCompraItem}`, texto: p.marca, rotulo: { grupo: l.grupo, classe: l.classe, pdm } });
  }
  return { pares: pares.size, casos, exclusoes };
}

function lerSnapshot(nome: string): { fonte: Fonte; corpo: Record<string, unknown>; editado_a_mao: boolean } {
  const { fonte, ...corpo } = JSON.parse(readFileSync(new URL(`../dados/publico/${nome}`, import.meta.url), "utf8"));
  if (typeof fonte?.sha256 !== "string" || !Array.isArray(fonte.conferencias)) throw new Error(`${nome} não tem sha256 e conferências na fonte`);
  return { fonte, corpo, editado_a_mao: sha256(JSON.stringify(corpo)) !== fonte.sha256 };
}

export async function carregarBenchmarkFamilia() {
  const pre = JSON.parse(readFileSync(new URL("../dados/preregistro/f3-familia.json", import.meta.url), "utf8"));
  const arvoreLida = lerSnapshot("catmat-arvore-manutencao.json");
  const comprasLidas = lerSnapshot("compras-familia.json");
  const arvore: ArvoreCatmat = {
    versao: `CATMAT consultado em ${arvoreLida.fonte.consultado_em.slice(0, 10)}, sha256 ${arvoreLida.fonte.sha256.slice(0, 12)}`,
    grupos: arvoreLida.corpo.grupos as ArvoreCatmat["grupos"],
  };
  const textos = comprasLidas.corpo.textos as TextoDeCompra[];
  const preregistro: PreregistroFamilia = {
    versao: pre.versao,
    limiar_por_classificador: pre.limiar_por_classificador,
    erro_maximo: pre.erro_maximo,
    margem_sobre_a_regua: pre.margem_sobre_a_regua,
    minimo_por_estrato: pre.minimo_por_estrato,
  };
  const montados = montarCasos(textos, arvore, pre.selecao.limite_por_pdm);
  const fontes = [arvoreLida, comprasLidas];
  const reproducao: Reproducao = fontes.some((f) => f.editado_a_mao || f.fonte.conferencias.some((c) => !c.bate))
    ? "nao_bate"
    : fontes.every((f) => f.fonte.conferencias.some((c) => c.bate))
      ? "reproduzido"
      : "nao_conferido";
  return {
    pre: preregistro,
    grupos: pre.selecao.grupos as number[],
    limite_mudou_com_a_ordem: pre.limite_mudou_com_a_ordem as number,
    limite_por_pdm: pre.selecao.limite_por_pdm as number,
    arvore,
    linhas_lidas: comprasLidas.corpo.linhas_lidas as number,
    textos_gravados: textos.length,
    ...montados,
    casos: montados.casos.map((c): CasoFamilia => ({ ...c, texto: c.texto as TextoPublico })),
    reproducao,
    fontes: { arvore: arvoreLida.fonte, compras: comprasLidas.fonte },
  };
}
