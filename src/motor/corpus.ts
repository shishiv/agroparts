// Corpora públicos versionados em dados/publico/. Nada aqui é dado de cliente.
import bolts from "../../dados/publico/bolts-din625-1.json";
import catmat from "../../dados/publico/catmat-pdm-11797.json";
import compras from "../../dados/publico/compras-pdm-11797.json";
import type { Evidencia } from "./tipos";

export interface ItemCatmat {
  codigoItem: number;
  codigoClasse: number;
  nomeClasse: string;
  codigoPdm: number;
  nomePdm: string;
  descricaoItem: string;
  statusItem: boolean;
  dataHoraAtualizacao: string;
}

export interface LinhaCompra {
  idCompraItem: string;
  dataCompra: string;
  codigoItemCatalogo: number;
  descricaoDetalhadaItem: string;
  marca: string | null;
  nomeUasg: string;
  nomeOrgao: string;
  municipio: string;
  estado: string;
}

export const FONTE_CATMAT = catmat.fonte;
export const FONTE_COMPRAS = compras.fonte;
export const FONTE_BOLTS = bolts.fonte;

export const ITENS_CATMAT: ItemCatmat[] = catmat.itens as ItemCatmat[];
export const ITENS_ATIVOS: ItemCatmat[] = ITENS_CATMAT.filter((i) => i.statusItem);
export const LINHAS_COMPRA: LinhaCompra[] = compras.linhas as LinhaCompra[];

const porCodigo = new Map(ITENS_CATMAT.map((i) => [String(i.codigoItem), i]));
export const itemCatmat = (codigo: string | number) => porCodigo.get(String(codigo));

export const urlItemCatmat = (codigo: number | string) =>
  `https://dadosabertos.compras.gov.br/modulo-material/4_consultarItemMaterial?codigoItem=${codigo}`;

export function evidenciaCatmat(item: ItemCatmat): Evidencia {
  return {
    fonte: `CATMAT item ${item.codigoItem} (${item.nomePdm})`,
    url: urlItemCatmat(item.codigoItem),
    trecho: item.descricaoItem.trim(),
    licenca: FONTE_CATMAT.licenca,
    consultado_em: FONTE_CATMAT.consultado_em,
  };
}

export interface Dimensoes {
  d: number;
  D: number;
  B: number;
}

const DIMENSOES = bolts.dimensoes_mm as Record<string, Dimensoes>;

/** Dimensões DIN 625-1 de uma designação básica, quando a tabela aberta a cobre. */
export function dimensoesDin625(basica: string): Dimensoes | undefined {
  return DIMENSOES[basica];
}

/** Designações básicas da tabela com essas dimensões (recuperação por dimensão). */
export function designacoesPorDimensao(d: number, D: number, B: number): string[] {
  return Object.entries(DIMENSOES)
    .filter(([k, v]) => /^6[023]\d\d$/.test(k) && v.d === d && v.D === D && v.B === B)
    .map(([k]) => k);
}

export function evidenciaDin625(basica: string, dim: Dimensoes): Evidencia {
  return {
    fonte: `Tabela DIN 625-1 da BOLTS, linha ${basica}`,
    url: FONTE_BOLTS.url,
    trecho: `${basica}: d ${dim.d} mm, D ${dim.D} mm, B ${dim.B} mm`,
    licenca: FONTE_BOLTS.licenca,
    consultado_em: FONTE_BOLTS.consultado_em,
  };
}
