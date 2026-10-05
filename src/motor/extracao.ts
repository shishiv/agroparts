// Extração de atributos tipados de descrições livres de rolamentos.
// O texto de entrada nunca é reescrito: cada atributo guarda o trecho que o sustenta.
import type { Protecao } from "./tipos";

export const MARCAS = ["SKF", "NSK", "FAG", "NTN", "TIMKEN", "TINKEN", "KOYO", "NACHI", "ZKL", "SNR", "INA", "ZEN", "GBR", "FBJ"];

const PALAVRAS_PARADA = new Set([
  ...MARCAS, "MM", "DE", "DA", "DO", "COM", "SEM", "E", "X", "TIPO", "REF", "NACIONAL", "ROLAMENTO", "ROL", "MODELO",
  "USO", "PARA", "EM", "OU", "UN", "UND", "PC", "PCA", "PECA", "ORIGINAL", "SIMILAR",
]);

/** Termos que tiram o item do recorte "rígido de uma carreira de esferas". */
const FORA_DA_FAMILIA: [RegExp, string][] = [
  [/AUTOCOMPENSADOR/, "rolamento autocompensador"],
  [/DUAS CARREIRAS|2 CARREIRAS/, "rolamento de duas carreiras"],
  [/CONTATO ANGULAR/, "rolamento de contato angular"],
  [/(?<!CARGA )\bAXIAL\b(?! E RADIAL)/, "rolamento axial"],
  [/\bLINEAR\b/, "rolamento linear"],
  [/AGULHA/, "rolamento de agulhas"],
  [/\bMANCAL\b/, "rolamento alojado em mancal"],
  [/INSERCAO/, "rolamento de inserção"],
  [/ROLO DE LEVA/, "rolo de leva"],
];

export interface Trecho<T> {
  valor: T;
  trecho: string;
}

export interface Referencia {
  texto: string;
  marca: string | null;
  ambigua: boolean;
}

export interface Extracao {
  texto: string;
  referencias: Referencia[];
  diametro_interno?: Trecho<number>;
  diametro_externo?: Trecho<number>;
  largura?: Trecho<number>;
  /** Proteções compatíveis com o que o texto declara. */
  protecao_texto?: Trecho<Protecao[]>;
  folga_texto?: Trecho<string>;
  inox?: Trecho<boolean>;
  fora_da_familia?: Trecho<string>;
  polegada: boolean;
}

export function semAcento(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const num = (s: string) => Number(s.replace(",", "."));

function dimensao(t: string, rotulos: string): Trecho<number> | undefined {
  const m = new RegExp(`(?:${rotulos})\\s*[:=]?\\s*(\\d+(?:[.,]\\d+)?)\\s*(?:MM)?`).exec(t);
  return m ? { valor: num(m[1]), trecho: m[0].trim() } : undefined;
}

const VEDACOES: Protecao[] = ["vedacao_simples", "vedacao_dupla", "vedacao_sem_contato_simples", "vedacao_sem_contato_dupla"];

const PROTECOES_TEXTO: [RegExp, Protecao[]][] = [
  [/S\/ ?BLINDAGEM|SEM BLINDAGEM/, ["aberto", ...VEDACOES]],
  [/UMA BLINDAGEM|BLINDAGEM SIMPLES|1 BLINDAGEM/, ["blindagem_simples"]],
  [/BLINDAGEM DUPLA|DUPLA BLINDAGEM|BLINDAGEM D\b|BLINDADO DOS DOIS LADOS/, ["blindagem_dupla"]],
  [/PLACAS DE VEDACAO/, ["blindagem_dupla", "vedacao_dupla", "vedacao_sem_contato_dupla"]],
  [/VEDACAO DUPLA|DUPLA VEDACAO|2 VEDACOES/, ["vedacao_dupla", "vedacao_sem_contato_dupla"]],
  [/BLINDAD|BLINDAGEM/, ["blindagem_simples", "blindagem_dupla"]],
  [/VEDACAO|VEDADO/, VEDACOES],
];

/** Tokens de designação: base 60xx/62xx/63xx seguida de sufixos colados ou separados. */
function referenciasDoTrecho(trecho: string): Referencia[] {
  const refs: Referencia[] = [];
  const re = /(?<![\dA-Z/])(W ?)?6[023]\d{2}(?!\d)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(trecho))) {
    let fim = m.index + m[0].length;
    let texto = m[0];
    let ambigua = false;
    // Sufixos: blocos alfanuméricos curtos, separados por espaço, hífen ou barra.
    const resto = trecho.slice(fim);
    const sufixos = /^(?:[\s\-/]*([A-Z0-9]{1,5}))/;
    let r = resto;
    for (;;) {
      const s = sufixos.exec(r);
      if (!s) break;
      const token = s[1];
      if (/^\d/.test(token) && !/^2(RS|Z|RZ)/.test(token)) {
        // "6204/6ZZ" ou "6206/6307": outro número logo depois da base.
        if (/^[\s]*\//.test(r) || /^\d/.test(r)) ambigua = true;
        break;
      }
      if (PALAVRAS_PARADA.has(token)) break;
      texto += s[0];
      r = r.slice(s[0].length);
    }
    fim = trecho.length - r.length;
    const janela = trecho.slice(Math.max(0, m.index - 10), Math.min(trecho.length, fim + 12));
    const marca = MARCAS.find((mk) => new RegExp(`\\b${mk}\\b`).test(janela)) ?? null;
    refs.push({ texto: texto.trim(), marca: marca === "TINKEN" ? "TIMKEN" : marca, ambigua });
    re.lastIndex = fim;
  }
  return refs;
}

export function extrair(texto: string): Extracao {
  const t = semAcento(texto.toUpperCase()).replace(/[–—]/g, "-").replace(/\s+/g, " ");
  const ex: Extracao = { texto, referencias: [], polegada: /\bPOL\b|POLEGADA|"/.test(t) };

  // No CATMAT a referência vem em "REFERÊNCIA FABRICANTE N: ...", até a próxima vírgula.
  const campos = [...t.matchAll(/REFERENCIA ?FABRICANTE ?\d? ?:? ?([^,]+)/g)].map((m) => m[1]);
  const trechos = campos.length ? campos.flatMap((c) => c.split(/\/ (?=W?\d)|;/)) : [t];
  for (const trecho of trechos) ex.referencias.push(...referenciasDoTrecho(trecho));

  ex.diametro_interno = dimensao(t, "DIAMETRO ?INTERNO|DIAM\\.? ?INT\\.?|\\bFURO");
  ex.diametro_externo = dimensao(t, "DIAMETRO ?EXTERNO|DIAM\\.? ?EXT\\.?");
  ex.largura = dimensao(t, "LARGURA|ALTURA|ESPESSURA");
  const xyz = /\b(\d+(?:[.,]\d+)?) ?X ?(\d+(?:[.,]\d+)?) ?X ?(\d+(?:[.,]\d+)?) ?(?:MM)?/.exec(t);
  if (xyz && !ex.diametro_interno) {
    ex.diametro_interno = { valor: num(xyz[1]), trecho: xyz[0] };
    ex.diametro_externo = { valor: num(xyz[2]), trecho: xyz[0] };
    ex.largura = { valor: num(xyz[3]), trecho: xyz[0] };
  }

  for (const [re, valores] of PROTECOES_TEXTO) {
    const m = re.exec(t);
    if (m) {
      ex.protecao_texto = { valor: valores, trecho: m[0] };
      break;
    }
  }
  const f = /FOLGA ?(C[2-5]|CN|NORMAL)/.exec(t);
  if (f) ex.folga_texto = { valor: f[1] === "NORMAL" ? "CN" : f[1], trecho: f[0] };
  const inox = /INOX(IDAVEL)?/.exec(t);
  if (inox) ex.inox = { valor: true, trecho: inox[0] };
  for (const [re, motivo] of FORA_DA_FAMILIA) {
    const m = re.exec(t);
    if (m) {
      ex.fora_da_familia = { valor: motivo, trecho: m[0] };
      break;
    }
  }
  return ex;
}
