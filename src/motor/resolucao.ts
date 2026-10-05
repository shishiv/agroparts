// Serviço único de resolução: texto sujo, código ou leitura de OCR -> entidades, atributos,
// evidências, decisão ternária e tipo de relação (ADR 0013). Busca e lote são vistas dele.
import { evidenciaCatmat, ITENS_ATIVOS, itemCatmat, urlItemCatmat, type ItemCatmat } from "./corpus";
import { designacaoCanonica } from "./designacao";
import { especificar, VERSAO_REGRAS, type ResultadoEspecificacao } from "./especificacao";
import { decidirPar, relacaoSameAs } from "./identidade";
import type { MaterialOriginal, Relacao, Resposta } from "./tipos";

export type TipoEntrada = "codigo" | "descricao" | "ocr";

export const APLICABILIDADE =
  "COMPATIBLE_WITH não é inferida: aplicabilidade a ativo exige vínculo real entre peça e ativo (ADR 0013).";

let cache: Map<number, ResultadoEspecificacao> | null = null;

/** Especificação de cada item ativo do CATMAT, calculada uma vez. */
export function especificacoesDoCorpus(): Map<number, ResultadoEspecificacao> {
  if (!cache) cache = new Map(ITENS_ATIVOS.map((i) => [i.codigoItem, especificar(i.descricaoItem)]));
  return cache;
}

function porDesignacaoBasica(basica: string): ItemCatmat[] {
  const esp = especificacoesDoCorpus();
  return ITENS_ATIVOS.filter((i) => esp.get(i.codigoItem)?.especificacao?.designacao_basica === basica);
}

export function original(tipo: TipoEntrada, texto: string): MaterialOriginal {
  const limpo = texto.trim();
  if (tipo === "codigo" && /^\d{4,7}$/.test(limpo)) {
    const item = itemCatmat(limpo);
    if (item) return { origem: "CATMAT", codigo: String(item.codigoItem), texto: item.descricaoItem, url: urlItemCatmat(item.codigoItem) };
  }
  return { origem: tipo === "ocr" ? "OCR" : "entrada manual", texto };
}

function relacoesNoCorpus(orig: MaterialOriginal, esp: ResultadoEspecificacao): Relacao[] {
  const relacoes: Relacao[] = [];
  const corpus = especificacoesDoCorpus();
  if (esp.especificacao) {
    for (const item of porDesignacaoBasica(esp.especificacao.designacao_basica)) {
      if (orig.codigo === String(item.codigoItem)) continue;
      const par = decidirPar(esp, corpus.get(item.codigoItem)!);
      const rel = relacaoSameAs(`CATMAT ${item.codigoItem}`, item.descricaoItem.trim(), par, [evidenciaCatmat(item)]);
      rel.motivos.push(`semelhança de texto ${String(par.semelhanca_texto).replace(".", ",")} (SIMILAR_TO, sem autoridade para decidir)`);
      if (par.exata) rel.condicoes = ["duplicidade exata"];
      relacoes.push(rel);
    }
  } else {
    for (const basica of esp.candidatos_por_dimensao) {
      for (const item of porDesignacaoBasica(basica)) {
        relacoes.push({
          tipo: "SIMILAR_TO",
          decisao: "revisa",
          alvo: `CATMAT ${item.codigoItem}`,
          alvo_texto: item.descricaoItem.trim(),
          nota: 0,
          motivos: [`candidato recuperado pelas dimensões de ${basica}; similaridade não decide identidade`],
          evidencias: [evidenciaCatmat(item)],
        });
      }
    }
  }
  const ordem = { resolve: 0, revisa: 1, recusa: 2 } as const;
  return relacoes.sort((a, b) => ordem[a.decisao] - ordem[b.decisao]);
}

/** Referências de marcas diferentes publicadas no mesmo registro viram CROSS_REFERENCE. */
function referenciasCruzadas(orig: MaterialOriginal, esp: ResultadoEspecificacao): Relacao[] {
  const comMarca = esp.designacoes.filter((d) => d.marca);
  const marcas = new Set(comMarca.map((d) => d.marca));
  if (comMarca.length < 2 || marcas.size < 2) return [];
  const [origem, ...alvos] = comMarca;
  const fonte = {
    fonte: orig.codigo ? `CATMAT item ${orig.codigo} (catálogo público, não é catálogo de fabricante)` : "texto de entrada",
    url: orig.url ?? "",
    trecho: orig.texto.trim(),
    licenca: orig.codigo ? "Decreto 8.777/2016, art. 4" : "entrada do usuário",
  };
  const relacoes: Relacao[] = [];
  for (const alvo of alvos) {
    if (alvo.basica !== origem.basica) continue;
    const condicoes = [
      `${origem.marca} ${origem.original}: ${origem.nao_decodificado.length ? "sufixo não decodificado" : designacaoCanonica(origem) + " pela regra de designação"}`,
      `${alvo.marca} ${alvo.original}: ${alvo.nao_decodificado.length ? `sufixo "${alvo.nao_decodificado.join("")}" não decodificado pelas fontes registradas` : designacaoCanonica(alvo) + " pela regra de designação"}`,
      "mesma designação básica dos dois lados: mesmas dimensões de contorno pela série ISO",
      "direção preservada como publicada; a relação inversa exige fonte própria",
    ];
    relacoes.push({
      tipo: "CROSS_REFERENCE",
      decisao: "resolve",
      alvo: `${alvo.marca} ${alvo.original}`,
      alvo_texto: `${origem.marca} ${origem.original} -> ${alvo.marca} ${alvo.original}`,
      nota: 1,
      motivos: ["referência cruzada publicada no registro de origem, com a mesma designação básica"],
      condicoes,
      evidencias: [fonte],
    });
    const impedimentos = [
      ...(alvo.nao_decodificado.length ? [`a proteção "${alvo.nao_decodificado.join("")}" de ${alvo.marca} não foi verificada em catálogo do fabricante`] : []),
      ...esp.pendencias.filter((p) => p.includes("inoxid")),
      "nenhuma fonte publica as condições de aplicação desta substituição",
    ];
    relacoes.push({
      tipo: "INTERCHANGEABLE_FOR",
      decisao: "revisa",
      alvo: `${alvo.marca} ${alvo.original}`,
      alvo_texto: `substituir ${origem.marca} ${origem.original} por ${alvo.marca} ${alvo.original}`,
      nota: 0,
      motivos: ["CROSS_REFERENCE não implica INTERCHANGEABLE_FOR sem condições técnicas e fonte", ...impedimentos],
      evidencias: [fonte],
    });
  }
  return relacoes;
}

export function resolver(tipo: TipoEntrada, texto: string): Resposta {
  const orig = original(tipo, texto);
  const esp = especificar(orig.texto);
  const evidencias = [...esp.evidencias];
  if (orig.origem === "CATMAT") evidencias.unshift(evidenciaCatmat(itemCatmat(orig.codigo!)!));
  return {
    versao_regras: VERSAO_REGRAS,
    original: orig,
    decisao: esp.decisao,
    nota: esp.nota,
    motivos: esp.motivos,
    especificacao: esp.especificacao,
    relacoes: [...referenciasCruzadas(orig, esp), ...relacoesNoCorpus(orig, esp)],
    aplicabilidade: APLICABILIDADE,
    evidencias,
  };
}
