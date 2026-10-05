// Tradução de um texto para a forma canônica (TechnicalSpecification) com decisão ternária.
// Regras pré-registradas em dados/gabarito/v1/preregistro.json:
//   resolve: designação da família lida por inteiro, sem sufixo não decodificado e sem contradição;
//   revisa:  sem contradição, mas com pendência (sufixo não decodificado, designação ausente...);
//   recusa:  fora da família, sem evidência mínima ou com contradição entre atributos.
import { designacoesPorDimensao, dimensoesDin625, evidenciaDin625 } from "./corpus";
import { designacaoCanonica, FONTES_REGRA, lerDesignacao, ROTULO_PROTECAO, type Designacao } from "./designacao";
import { extrair, type Extracao } from "./extracao";
import type { AtributoTipado, Decisao, EspecificacaoTecnica, Evidencia, Protecao } from "./tipos";

export const VERSAO_REGRAS = "regras-v1 (gabarito v1, 2026-10-05)";

export interface ResultadoEspecificacao {
  decisao: Decisao;
  nota: number;
  motivos: string[];
  contradicoes: string[];
  pendencias: string[];
  especificacao: EspecificacaoTecnica | null;
  extracao: Extracao;
  designacoes: (Designacao & { marca: string | null })[];
  candidatos_por_dimensao: string[];
  evidencias: Evidencia[];
}

const fmt = (n: number) => String(n).replace(".", ",");

function descricaoPorRegra(e: Omit<EspecificacaoTecnica, "descricao_por_regra" | "atributos">, dim?: { d: number; D: number; B: number }): string {
  const partes = [
    `${e.substantivo} ${e.modificador}`,
    designacaoDaEspecificacao(e),
    dim ? `${fmt(dim.d)} X ${fmt(dim.D)} X ${fmt(dim.B)} MM` : null,
    ROTULO_PROTECAO[e.protecao].toUpperCase(),
    `FOLGA ${e.folga}`,
    e.inox ? "ACO INOXIDAVEL" : null,
  ];
  return partes.filter(Boolean).join(", ");
}

export function especificar(texto: string): ResultadoEspecificacao {
  const ex = extrair(texto);
  const contradicoes: string[] = [];
  const pendencias: string[] = [];
  const evidencias: Evidencia[] = [];
  const base = (decisao: Decisao, motivos: string[]): ResultadoEspecificacao => ({
    decisao,
    nota: 0,
    motivos,
    contradicoes,
    pendencias,
    especificacao: null,
    extracao: ex,
    designacoes: [],
    candidatos_por_dimensao: [],
    evidencias,
  });

  if (ex.fora_da_familia) return base("recusa", [`fora da família: ${ex.fora_da_familia.valor} ("${ex.fora_da_familia.trecho}")`]);
  if (ex.polegada) return base("recusa", ["fora da família: dimensões em polegada; o recorte é métrico"]);

  const designacoes = ex.referencias
    .map((r) => {
      const d = lerDesignacao(r.texto);
      return d ? { ...d, marca: r.marca, ambigua: r.ambigua } : null;
    })
    .filter((d): d is Designacao & { marca: string | null; ambigua: boolean } => d !== null);

  if (designacoes.length === 0) {
    const { diametro_interno: di, diametro_externo: de, largura: l } = ex;
    if (di && de && l) {
      const cands = designacoesPorDimensao(di.valor, de.valor, l.valor);
      const r = base("revisa", [
        `designação ausente; dimensões ${fmt(di.valor)} x ${fmt(de.valor)} x ${fmt(l.valor)} mm` +
          (cands.length ? ` coincidem com ${cands.join(", ")} na tabela DIN 625-1 (só recuperação)` : " sem correspondência na tabela DIN 625-1"),
      ]);
      r.candidatos_por_dimensao = cands;
      r.pendencias.push("designação ausente");
      return r;
    }
    return base("recusa", ["sem evidência mínima: nenhuma designação 60xx, 62xx ou 63xx e dimensões incompletas"]);
  }

  const basicas = [...new Set(designacoes.map((d) => d.basica))];
  if (basicas.length > 1) pendencias.push(`mais de uma designação básica no texto: ${basicas.join(", ")}`);
  if (designacoes.some((d) => d.ambigua)) pendencias.push("designação seguida de outro número (por exemplo 6204/6ZZ); leitura ambígua");

  const decodificadas = designacoes.filter((d) => d.nao_decodificado.length === 0);
  for (const d of designacoes.filter((d) => d.nao_decodificado.length > 0)) {
    pendencias.push(`sufixo "${d.nao_decodificado.join("")}" em "${d.original}" não está nas fontes de regra registradas`);
  }
  const d = decodificadas[0] ?? designacoes[0];
  // Duas referências decodificadas da mesma base com proteção ou folga diferentes se contradizem.
  for (const outra of decodificadas.slice(1)) {
    if (outra.basica === d.basica && (outra.protecao !== d.protecao || outra.folga !== d.folga)) {
      contradicoes.push(`referências "${d.original}" e "${outra.original}" declaram proteção ou folga diferentes`);
    }
  }

  const atributos: AtributoTipado[] = [
    { nome: "designação básica", valor: d.basica, origem: "designacao", trecho: d.original },
    { nome: "série", valor: d.serie, origem: "designacao", trecho: d.original },
    { nome: "diâmetro interno", valor: d.furo_mm, unidade: "mm", origem: "designacao", trecho: `código de furo ${d.basica.slice(2)}` },
    { nome: "proteção", valor: d.protecao, origem: d.protecao_explicita ? "designacao" : "convencao", trecho: d.protecao_explicita ? d.original : "sem sufixo de proteção" },
    { nome: "folga radial", valor: d.folga, origem: d.folga_explicita ? "designacao" : "convencao", trecho: d.folga_explicita ? d.original : "sem sufixo de folga" },
  ];
  evidencias.push({ ...FONTES_REGRA.skf, trecho: "código de furo, sufixos -Z/-2Z/-RS1/-2RS1/-RZ/-2RZ, folgas C2 a C5, prefixo W (inoxidável)" });
  if (d.fontes.includes("convencao")) evidencias.push({ ...FONTES_REGRA.convencao, trecho: "ZZ = blindagem dupla, 2RS = vedação dupla, RS = vedação simples" });

  let checagens = 1;
  let aprovadas = 1;
  const checar = (ok: boolean) => {
    checagens++;
    if (ok) aprovadas++;
  };

  const tabela = dimensoesDin625(d.basica);
  if (tabela) {
    evidencias.push(evidenciaDin625(d.basica, tabela));
    checar(tabela.d === d.furo_mm);
  }
  const di = ex.diametro_interno?.valor;
  const de = ex.diametro_externo?.valor;
  const la = ex.largura?.valor;
  if (di !== undefined) {
    checar(di === d.furo_mm);
    if (di !== d.furo_mm) contradicoes.push(`diâmetro interno ${fmt(di)} mm ("${ex.diametro_interno!.trecho}") contradiz o código ${d.basica} (furo ${fmt(d.furo_mm)} mm)`);
    atributos.push({ nome: "diâmetro interno declarado", valor: di, unidade: "mm", origem: "texto", trecho: ex.diametro_interno!.trecho });
  }
  for (const [nome, valor, trecho, ref] of [
    ["diâmetro externo", de, ex.diametro_externo?.trecho, tabela?.D],
    ["largura", la, ex.largura?.trecho, tabela?.B],
  ] as const) {
    if (ref !== undefined) {
      atributos.push({ nome, valor: ref, unidade: "mm", origem: "tabela DIN 625-1", trecho: `${d.basica} na DIN 625-1` });
      if (valor !== undefined) {
        checar(valor === ref);
        if (valor !== ref) contradicoes.push(`${nome} ${fmt(valor)} mm ("${trecho}") contradiz a DIN 625-1 para ${d.basica} (${fmt(ref)} mm)`);
      }
    } else if (valor !== undefined) {
      atributos.push({ nome: `${nome} declarado (não conferido: a tabela DIN 625-1 aberta não cobre ${d.basica})`, valor, unidade: "mm", origem: "texto", trecho });
    }
  }

  const pt = ex.protecao_texto;
  if (pt) {
    const compativel = pt.valor.includes(d.protecao);
    checar(compativel);
    if (!compativel) {
      const msg = `texto "${pt.trecho}" não combina com ${ROTULO_PROTECAO[d.protecao]}`;
      if (d.protecao_explicita) contradicoes.push(`${msg} indicada pelo sufixo de "${d.original}"`);
      else pendencias.push(`${msg}, que vale só por convenção (designação sem sufixo)`);
    }
  }
  const ft = ex.folga_texto;
  if (ft) {
    const igual = ft.valor === d.folga;
    checar(igual);
    if (!igual) {
      if (d.folga_explicita) contradicoes.push(`texto "${ft.trecho}" contradiz a folga ${d.folga} da designação`);
      else pendencias.push(`texto "${ft.trecho}" declara folga que a designação não traz`);
    }
  }
  const inox = Boolean(ex.inox) || d.inox;
  if (ex.inox && !d.inox) {
    pendencias.push(`texto declara "${ex.inox.trecho}", mas a designação não traz marca de inoxidável (prefixo W no sistema SKF)`);
    checar(false);
  }
  if (inox) atributos.push({ nome: "material", valor: "aço inoxidável", origem: "texto", trecho: ex.inox?.trecho ?? d.original });

  const parcial: Omit<EspecificacaoTecnica, "descricao_por_regra" | "atributos"> = {
    substantivo: "ROLAMENTO",
    modificador: "RIGIDO DE ESFERAS, UMA CARREIRA",
    familia: "rolamento rígido de esferas, séries 60, 62 e 63",
    serie: d.serie,
    designacao_basica: d.basica,
    protecao: d.protecao,
    folga: d.folga,
    inox,
  };
  const especificacao: EspecificacaoTecnica = { ...parcial, atributos, descricao_por_regra: descricaoPorRegra(parcial, tabela) };

  let decisao: Decisao = "resolve";
  let motivos: string[];
  if (contradicoes.length) {
    decisao = "recusa";
    motivos = contradicoes.map((c) => `contradição: ${c}`);
  } else if (pendencias.length) {
    decisao = "revisa";
    motivos = pendencias;
  } else {
    motivos = [`designação ${d.original} lida por inteiro e sem contradição com o texto${tabela ? " nem com a DIN 625-1" : ""}`];
    if (!tabela) motivos.push(`a tabela DIN 625-1 aberta não cobre ${d.basica}; diâmetro externo e largura não foram conferidos`);
  }
  return {
    decisao,
    nota: contradicoes.length ? 0 : Math.round((aprovadas / checagens) * 100) / 100,
    motivos,
    contradicoes,
    pendencias,
    especificacao,
    extracao: ex,
    designacoes,
    candidatos_por_dimensao: [],
    evidencias,
  };
}

/** Chave de identidade da especificação: os atributos que definem SAME_AS. */
export function chaveIdentidade(e: Pick<EspecificacaoTecnica, "designacao_basica" | "protecao" | "folga" | "inox">): string {
  return `${e.designacao_basica}|${e.protecao}|${e.folga}|${e.inox ? "inox" : "aco"}`;
}

export const rotuloProtecao = (p: Protecao) => ROTULO_PROTECAO[p];

/** Designação canônica (notação SKF) de uma especificação técnica. */
export function designacaoDaEspecificacao(e: Pick<EspecificacaoTecnica, "designacao_basica" | "protecao" | "folga" | "inox">): string {
  return designacaoCanonica({ basica: e.designacao_basica, protecao: e.protecao, folga: e.folga, inox: e.inox });
}
