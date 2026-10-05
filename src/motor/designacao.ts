// Leitura de designações de rolamentos rígidos de esferas das séries 60, 62 e 63.
// Regras de duas fontes registradas (docs/pesquisa/fontes-do-prototipo.md):
// o sistema de designação SKF para rolamentos rígidos de esferas e a convenção
// genérica de sufixos registrada na BOLTS (LGPL 2.1+). Sufixo fora dessas tabelas
// fica "não decodificado" e nunca é adivinhado.
import type { Folga, Protecao } from "./tipos";

export const FONTES_REGRA = {
  skf: {
    fonte: "Sistema de designação SKF, rolamentos rígidos de esferas",
    url: "https://www.skf.com/group/products/rolling-bearings/ball-bearings/deep-groove-ball-bearings/designation-system",
    licenca: "consultado como regra; nenhum conteúdo SKF é copiado para o site",
  },
  convencao: {
    fonte: "BOLTS, bearings.blt, sufixos -Z, -ZZ, -RS e -2RS",
    url: "https://github.com/boltsparts/BOLTS_archive/blob/master/data/bearings.blt",
    licenca: "LGPL 2.1 ou posterior",
  },
} as const;

type FonteRegra = keyof typeof FONTES_REGRA;

export const ROTULO_PROTECAO: Record<Protecao, string> = {
  aberto: "aberto, sem blindagem nem vedação",
  blindagem_simples: "blindagem metálica em um lado",
  blindagem_dupla: "blindagem metálica nos dois lados",
  vedacao_simples: "vedação de contato em um lado",
  vedacao_dupla: "vedação de contato nos dois lados",
  vedacao_sem_contato_simples: "vedação sem contato em um lado",
  vedacao_sem_contato_dupla: "vedação sem contato nos dois lados",
};

const SUFIXOS_PROTECAO: Record<string, [Protecao, FonteRegra]> = {
  "2RS1": ["vedacao_dupla", "skf"],
  "2RSH": ["vedacao_dupla", "skf"],
  "2RS": ["vedacao_dupla", "convencao"],
  RS1: ["vedacao_simples", "skf"],
  RSH: ["vedacao_simples", "skf"],
  RS: ["vedacao_simples", "convencao"],
  "2RZ": ["vedacao_sem_contato_dupla", "skf"],
  RZ: ["vedacao_sem_contato_simples", "skf"],
  "2Z": ["blindagem_dupla", "skf"],
  ZZ: ["blindagem_dupla", "convencao"],
  Z: ["blindagem_simples", "skf"],
};

const TOKEN = /^(2RS1|2RSH|2RS|RS1|RSH|RS|2RZ|RZ|2Z|ZZ|Z|C[2-5]|CN)/;

export interface Designacao {
  original: string;
  basica: string;
  serie: string;
  furo_mm: number;
  inox: boolean;
  protecao: Protecao;
  protecao_explicita: boolean;
  folga: Folga;
  folga_explicita: boolean;
  nao_decodificado: string[];
  fontes: FonteRegra[];
}

/** Código de furo ISO: 00=10, 01=12, 02=15, 03=17 mm; de 04 em diante, código x 5 mm. */
export function furoPorCodigo(codigo: string): number {
  const especiais: Record<string, number> = { "00": 10, "01": 12, "02": 15, "03": 17 };
  return especiais[codigo] ?? Number(codigo) * 5;
}

export function normalizarReferencia(texto: string): string {
  return texto.toUpperCase().replace(/[\s\-/.]+/g, "");
}

/** Lê uma designação das séries 60, 62 ou 63; devolve null fora da família. */
export function lerDesignacao(texto: string): Designacao | null {
  // A base é lida antes de remover separadores: em "6206-2Z" o "2" já é sufixo.
  const m = /^(W ?)?6([023])(\d{2})(?!\d)(.*)$/.exec(texto.toUpperCase().trim());
  if (!m) return null;
  const [, w, serieDig, furoCod, restoBruto] = m;
  const resto = normalizarReferencia(restoBruto);
  const fontes = new Set<FonteRegra>(["skf"]);
  let protecao: Protecao = "aberto";
  let protecaoExplicita = false;
  let folga: Folga = "CN";
  let folgaExplicita = false;
  const naoDecodificado: string[] = [];
  let pos = 0;
  while (pos < resto.length) {
    const t = TOKEN.exec(resto.slice(pos));
    if (!t) {
      naoDecodificado.push(resto.slice(pos));
      break;
    }
    const token = t[1];
    if (token in SUFIXOS_PROTECAO) {
      if (protecaoExplicita) naoDecodificado.push(token);
      else {
        const [p, fonte] = SUFIXOS_PROTECAO[token];
        protecao = p;
        protecaoExplicita = true;
        fontes.add(fonte);
      }
    } else if (folgaExplicita) {
      naoDecodificado.push(token);
    } else {
      folga = token as Folga;
      folgaExplicita = true;
    }
    pos += token.length;
  }
  return {
    original: texto.trim(),
    basica: `6${serieDig}${furoCod}`,
    serie: `6${serieDig}`,
    furo_mm: furoPorCodigo(furoCod),
    inox: Boolean(w),
    protecao,
    protecao_explicita: protecaoExplicita,
    folga,
    folga_explicita: folgaExplicita,
    nao_decodificado: naoDecodificado,
    fontes: [...fontes],
  };
}

/** Designação no formato SKF para a especificação, usada só como texto canônico. */
export function designacaoCanonica(d: Pick<Designacao, "basica" | "protecao" | "folga" | "inox">): string {
  const sufixo: Record<Protecao, string> = {
    aberto: "",
    blindagem_simples: "-Z",
    blindagem_dupla: "-2Z",
    vedacao_simples: "-RS1",
    vedacao_dupla: "-2RS1",
    vedacao_sem_contato_simples: "-RZ",
    vedacao_sem_contato_dupla: "-2RZ",
  };
  return `${d.inox ? "W " : ""}${d.basica}${sufixo[d.protecao]}${d.folga === "CN" ? "" : "/" + d.folga}`;
}
