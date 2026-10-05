// Decisão de SAME_AS entre dois materiais do cadastro.
// Contradição de atributo reprova o par; concordância só soma evidência.
// Semelhança de texto aparece como SIMILAR_TO e nunca decide identidade.
import { rotuloProtecao, type ResultadoEspecificacao } from "./especificacao";
import type { Decisao, Evidencia, Relacao } from "./tipos";

export function tokens(texto: string): Set<string> {
  return new Set(
    texto
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[^A-Z0-9]+/)
      .filter((t) => t.length > 1),
  );
}

/** Semelhança de Jaccard entre os conjuntos de palavras dos dois textos. */
export function semelhancaTexto(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  const uniao = ta.size + tb.size - inter;
  return uniao ? Math.round((inter / uniao) * 100) / 100 : 0;
}

export interface ParDecidido {
  decisao: Decisao;
  exata: boolean;
  motivos: string[];
  semelhanca_texto: number;
}

const normalizarTexto = (t: string) => [...tokens(t)].sort().join(" ");

export function decidirPar(a: ResultadoEspecificacao, b: ResultadoEspecificacao): ParDecidido {
  const semelhanca = semelhancaTexto(a.extracao.texto, b.extracao.texto);
  const ea = a.especificacao;
  const eb = b.especificacao;
  if (!ea || !eb) {
    const motivo = !ea ? a.motivos[0] : b.motivos[0];
    return { decisao: "recusa", exata: false, motivos: [`um dos itens não tem especificação: ${motivo}`], semelhanca_texto: semelhanca };
  }
  const diferencas: string[] = [];
  if (ea.designacao_basica !== eb.designacao_basica) diferencas.push(`designação básica ${ea.designacao_basica} x ${eb.designacao_basica}`);
  if (ea.protecao !== eb.protecao) diferencas.push(`proteção: ${rotuloProtecao(ea.protecao)} x ${rotuloProtecao(eb.protecao)}`);
  if (ea.folga !== eb.folga) diferencas.push(`folga radial ${ea.folga} x ${eb.folga}`);
  if (ea.inox !== eb.inox) diferencas.push(`material: ${ea.inox ? "inoxidável" : "não declarado inox"} x ${eb.inox ? "inoxidável" : "não declarado inox"}`);
  if (diferencas.length) {
    return { decisao: "recusa", exata: false, motivos: diferencas.map((d) => `atributo diverge: ${d}`), semelhanca_texto: semelhanca };
  }
  const pendentes = [a, b].filter((r) => r.decisao !== "resolve");
  if (pendentes.length) {
    return {
      decisao: "revisa",
      exata: false,
      motivos: pendentes.map((r) => `${r.decisao === "recusa" ? "item com contradição" : "item com pendência"}: ${r.motivos[0]}`),
      semelhanca_texto: semelhanca,
    };
  }
  const exata = normalizarTexto(a.extracao.texto) === normalizarTexto(b.extracao.texto);
  return {
    decisao: "resolve",
    exata,
    motivos: [
      exata ? "duplicidade exata: mesmas palavras e mesma especificação" : "mesma especificação com textos diferentes",
      `designação ${ea.designacao_basica}, ${rotuloProtecao(ea.protecao)}, folga ${ea.folga}${ea.inox ? ", inoxidável" : ""}`,
    ],
    semelhanca_texto: semelhanca,
  };
}

export function relacaoSameAs(alvo: string, alvoTexto: string, par: ParDecidido, evidencias: Evidencia[]): Relacao {
  return {
    tipo: "SAME_AS",
    decisao: par.decisao,
    alvo,
    alvo_texto: alvoTexto,
    nota: par.decisao === "resolve" ? 1 : 0,
    motivos: par.motivos,
    evidencias,
  };
}
