// Tradução em lote e medição contra o gabarito pré-registrado (ADR 0014).
import gabCatmat from "../../dados/gabarito/v1/catmat.json";
import gabLivre from "../../dados/gabarito/v1/textos-livres.json";
import { ITENS_ATIVOS, itemCatmat } from "./corpus";
import { chaveIdentidade, designacaoDaEspecificacao, especificar, VERSAO_REGRAS, type ResultadoEspecificacao } from "./especificacao";
import { decidirPar } from "./identidade";
import { resolver } from "./resolucao";
import type { Decisao, MaterialOriginal, Protecao } from "./tipos";

export interface LinhaLote {
  original: MaterialOriginal;
  estrato: string;
  decisao: Decisao;
  designacao: string | null;
  descricao_por_regra: string | null;
  chave: string | null;
  motivos: string[];
  grupo_duplicidade: number | null;
}

export interface Contagem {
  total: number;
  resolve: number;
  revisa: number;
  recusa: number;
}

export interface ResultadoLote {
  versao_regras: string;
  linhas: LinhaLote[];
  por_estrato: Record<string, Contagem>;
  grupos_duplicidade: { grupo: number; chave: string; designacao: string; codigos: string[] }[];
}

function estrato(r: ResultadoEspecificacao): string {
  if (r.especificacao) return `série ${r.especificacao.serie}`;
  if (r.extracao.fora_da_familia || r.extracao.polegada) return "fora da família";
  return "sem designação da família";
}

const vazia = (): Contagem => ({ total: 0, resolve: 0, revisa: 0, recusa: 0 });

export function traduzirLote(entradas: MaterialOriginal[]): ResultadoLote {
  const linhas: LinhaLote[] = entradas.map((original) => {
    const r = especificar(original.texto);
    const e = r.especificacao;
    return {
      original,
      estrato: estrato(r),
      decisao: r.decisao,
      designacao: e ? designacaoDaEspecificacao(e) : null,
      descricao_por_regra: e?.descricao_por_regra ?? null,
      chave: e && r.decisao === "resolve" ? chaveIdentidade(e) : null,
      motivos: r.motivos,
      grupo_duplicidade: null,
    };
  });
  const porChave = new Map<string, LinhaLote[]>();
  for (const l of linhas) if (l.chave) porChave.set(l.chave, [...(porChave.get(l.chave) ?? []), l]);
  const grupos: ResultadoLote["grupos_duplicidade"] = [];
  for (const [chave, ls] of [...porChave.entries()].sort()) {
    if (ls.length < 2) continue;
    const grupo = grupos.length + 1;
    ls.forEach((l) => (l.grupo_duplicidade = grupo));
    grupos.push({ grupo, chave, designacao: ls[0].designacao!, codigos: ls.map((l) => l.original.codigo ?? l.original.texto) });
  }
  const por_estrato: Record<string, Contagem> = {};
  for (const l of linhas) {
    const c = (por_estrato[l.estrato] ??= vazia());
    c.total++;
    c[l.decisao]++;
  }
  return { versao_regras: VERSAO_REGRAS, linhas, por_estrato, grupos_duplicidade: grupos };
}

export function loteCatmat(): ResultadoLote {
  return traduzirLote(
    ITENS_ATIVOS.map((i) => ({ origem: "CATMAT", codigo: String(i.codigoItem), texto: i.descricaoItem })),
  );
}

/** Mapa de códigos em CSV: o texto original vai intacto ao lado da tradução. */
export function loteParaCsv(r: ResultadoLote): string {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const cab = ["origem", "codigo", "texto_original", "estrato", "decisao", "designacao_canonica", "descricao_por_regra", "grupo_duplicidade", "motivos", "versao_regras"];
  const linhas = r.linhas.map((l) =>
    [l.original.origem, l.original.codigo, l.original.texto, l.estrato, l.decisao, l.designacao, l.descricao_por_regra, l.grupo_duplicidade, l.motivos.join(" | "), r.versao_regras]
      .map(esc)
      .join(","),
  );
  return [cab.join(","), ...linhas].join("\n") + "\n";
}

// ---------- Medição ----------

interface Rotulo {
  elegivel: boolean;
  designacao_basica?: string;
  protecao?: Protecao;
  folga?: string;
  inox?: boolean;
  motivo?: string;
}

export interface MedicaoTraducao {
  estrato: string;
  total: number;
  elegiveis: number;
  resolvidos: number;
  revisados: number;
  recusados: number;
  resolvidos_corretos: number;
  resolvidos_nao_elegiveis: number;
}

export interface MedicaoIdentidade {
  estrato: string;
  pares: number;
  verdadeiros: number;
  falsos: number;
  indeterminados: number;
  resolvidos: number;
  verdadeiros_resolvidos: number;
  falsos_recusados: number;
  falsos_resolvidos: number;
}

export interface Erro {
  conjunto: string;
  item: string;
  esperado: string;
  obtido: string;
}

export interface Medicao {
  versao_gabarito: string;
  versao_regras: string;
  traducao_catmat: MedicaoTraducao[];
  traducao_texto_livre: MedicaoTraducao[];
  identidade: MedicaoIdentidade[];
  referencia_cruzada: { total: number; recuperadas: number; com_fonte: number; intercambio_resolvido_automaticamente: number };
  erros: Erro[];
}

const chaveRotulo = (r: Rotulo) => `${r.designacao_basica}|${r.protecao}|${r.folga}|${r.inox ? "inox" : "aco"}`;

function medirTraducao(conjunto: string, itens: { id: string; texto: string; rotulo: Rotulo; serie: string }[], erros: Erro[]): MedicaoTraducao[] {
  const tabela = new Map<string, MedicaoTraducao>();
  for (const it of itens) {
    const est = `série ${it.serie}`;
    const m = tabela.get(est) ?? { estrato: est, total: 0, elegiveis: 0, resolvidos: 0, revisados: 0, recusados: 0, resolvidos_corretos: 0, resolvidos_nao_elegiveis: 0 };
    tabela.set(est, m);
    const r = especificar(it.texto);
    m.total++;
    if (it.rotulo.elegivel) m.elegiveis++;
    if (r.decisao === "resolve") {
      m.resolvidos++;
      const obtido = chaveIdentidade(r.especificacao!);
      if (!it.rotulo.elegivel) {
        m.resolvidos_nao_elegiveis++;
        erros.push({ conjunto, item: it.id, esperado: `não elegível (${it.rotulo.motivo})`, obtido: `resolve ${obtido}` });
      } else if (obtido === chaveRotulo(it.rotulo)) m.resolvidos_corretos++;
      else erros.push({ conjunto, item: it.id, esperado: chaveRotulo(it.rotulo), obtido });
    } else if (r.decisao === "revisa") m.revisados++;
    else m.recusados++;
  }
  return [...tabela.values()].sort((a, b) => a.estrato.localeCompare(b.estrato));
}

export function medir(): Medicao {
  const erros: Erro[] = [];
  const catmatItens = (gabCatmat.rotulos as (Rotulo & { codigoItem: number })[]).map((r) => {
    const item = itemCatmat(r.codigoItem)!;
    const grupo = (/6[023]\d\d/.exec(item.descricaoItem) ?? [""])[0];
    return { id: `CATMAT ${r.codigoItem}`, texto: item.descricaoItem, rotulo: r, serie: grupo.slice(0, 2), grupo, codigo: r.codigoItem };
  });
  const livres = (gabLivre.rotulos as (Rotulo & { idCompraItem: string; texto: string })[]).map((r) => {
    const base = (/6[023]\d\d/.exec(r.texto) ?? ["sem"])[0];
    return { id: `compra ${r.idCompraItem}`, texto: r.texto, rotulo: r, serie: r.designacao_basica?.slice(0, 2) ?? base.slice(0, 2) };
  });

  // Pares: todos os pares dentro do mesmo grupo de designação do gabarito.
  const ident = new Map<string, MedicaoIdentidade>();
  const grupos = new Map<string, typeof catmatItens>();
  for (const it of catmatItens) grupos.set(it.grupo, [...(grupos.get(it.grupo) ?? []), it]);
  for (const [, its] of grupos) {
    for (let i = 0; i < its.length; i++) {
      for (let j = i + 1; j < its.length; j++) {
        const a = its[i];
        const b = its[j];
        const est = `série ${a.serie}`;
        const m = ident.get(est) ?? { estrato: est, pares: 0, verdadeiros: 0, falsos: 0, indeterminados: 0, resolvidos: 0, verdadeiros_resolvidos: 0, falsos_recusados: 0, falsos_resolvidos: 0 };
        ident.set(est, m);
        m.pares++;
        const par = decidirPar(especificar(a.texto), especificar(b.texto));
        if (!a.rotulo.elegivel || !b.rotulo.elegivel) {
          m.indeterminados++;
          if (par.decisao === "resolve") erros.push({ conjunto: "identidade", item: `${a.id} x ${b.id}`, esperado: "indeterminado (não resolver)", obtido: "SAME_AS resolve" });
          continue;
        }
        const verdadeiro = chaveRotulo(a.rotulo) === chaveRotulo(b.rotulo);
        if (verdadeiro) m.verdadeiros++;
        else m.falsos++;
        if (par.decisao === "resolve") {
          m.resolvidos++;
          if (verdadeiro) m.verdadeiros_resolvidos++;
          else {
            m.falsos_resolvidos++;
            erros.push({ conjunto: "identidade", item: `${a.id} x ${b.id}`, esperado: "SAME_AS falso", obtido: "SAME_AS resolve" });
          }
        } else if (!verdadeiro && par.decisao === "recusa") m.falsos_recusados++;
        else if (verdadeiro) erros.push({ conjunto: "identidade", item: `${a.id} x ${b.id}`, esperado: "SAME_AS verdadeiro", obtido: `SAME_AS ${par.decisao}` });
      }
    }
  }

  // Referência cruzada: n = 1 no gabarito v1.
  const cr = { total: 0, recuperadas: 0, com_fonte: 0, intercambio_resolvido_automaticamente: 0 };
  for (const codigo of ["624270"]) {
    cr.total++;
    const r = resolver("codigo", codigo);
    const cruzada = r.relacoes.find((x) => x.tipo === "CROSS_REFERENCE" && x.alvo.startsWith("NSK"));
    if (cruzada) cr.recuperadas++;
    if (cruzada?.evidencias.some((e) => e.url.includes("codigoItem=624270"))) cr.com_fonte++;
    if (r.relacoes.some((x) => x.tipo === "INTERCHANGEABLE_FOR" && x.decisao === "resolve")) cr.intercambio_resolvido_automaticamente++;
  }

  return {
    versao_gabarito: "v1",
    versao_regras: VERSAO_REGRAS,
    traducao_catmat: medirTraducao("tradução CATMAT", catmatItens, erros),
    traducao_texto_livre: medirTraducao("tradução de texto livre", livres, erros),
    identidade: [...ident.values()].sort((a, b) => a.estrato.localeCompare(b.estrato)),
    referencia_cruzada: cr,
    erros,
  };
}
