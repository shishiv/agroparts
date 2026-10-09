// Camada de linguagem da interface: traduz a saída do motor para quem cuida de almoxarifado,
// manutenção e compras. O motor não muda; aqui só se escolhem palavras.
import type { AtributoTipado, Decisao, EspecificacaoTecnica, Folga, Relacao, Resposta } from "../src/motor/tipos";

/** Nome curto de cada decisão, igual em toda a interface. */
export const SELO: Record<Decisao, string> = {
  resolve: "Confirmado",
  revisa: "Precisa de uma pessoa",
  recusa: "Recusado",
};

const FOLGA: Record<Folga, string> = {
  C2: "folga C2, menor que a normal",
  CN: "folga normal",
  C3: "folga C3, maior que a normal",
  C4: "folga C4, bem maior que a normal",
  C5: "folga C5, bem maior que a normal",
};

const ORIGEM: Record<AtributoTipado["origem"], string> = {
  designacao: "código da peça",
  texto: "descrição do cadastro",
  "tabela DIN 625-1": "tabela de medidas da norma",
  convencao: "costume do mercado, porque o código não traz final",
};

export const origemTexto = (o: AtributoTipado["origem"]) => ORIGEM[o];

const fmt = (n: unknown) => String(n).replace(".", ",");

/** Medidas d x D x B quando o motor as tem, em mm. */
function medidas(e: EspecificacaoTecnica): string | null {
  const v = (nome: string) => e.atributos.find((a) => a.nome === nome)?.valor;
  const d = v("diâmetro interno");
  const D = v("diâmetro externo");
  const B = v("largura");
  if (d === undefined) return null;
  if (D === undefined || B === undefined) return `furo de ${fmt(d)} mm`;
  return `${fmt(d)} × ${fmt(D)} × ${fmt(B)} mm`;
}

/** A peça em uma linha, na ordem em que o almoxarifado fala dela. */
export function descreverPeca(e: EspecificacaoTecnica): string {
  const partes = [
    `Rolamento de esferas ${e.designacao_basica}`,
    medidas(e),
    e.atributos.find((a) => a.nome === "proteção") ? protecaoTexto(e) : null,
    FOLGA[e.folga],
    e.inox ? "aço inoxidável" : null,
  ];
  return partes.filter(Boolean).join(" · ");
}

function protecaoTexto(e: EspecificacaoTecnica): string {
  const p: Record<EspecificacaoTecnica["protecao"], string> = {
    aberto: "aberto, sem blindagem nem vedação",
    blindagem_simples: "blindagem metálica em um lado",
    blindagem_dupla: "blindagem metálica nos dois lados",
    vedacao_simples: "vedação de borracha em um lado",
    vedacao_dupla: "vedação de borracha nos dois lados",
    vedacao_sem_contato_simples: "vedação sem contato em um lado",
    vedacao_sem_contato_dupla: "vedação sem contato nos dois lados",
  };
  return p[e.protecao];
}

export interface Veredito {
  nivel: Decisao;
  titulo: string;
  frase: string;
}

/** A resposta principal: o que a placa diz. */
export function veredito(r: Resposta): Veredito {
  const e = r.especificacao;
  if (r.decisao === "resolve") return { nivel: "resolve", titulo: "Peça identificada", frase: "O código foi lido inteiro e nada no cadastro o contradiz." };
  if (r.decisao === "revisa") return { nivel: "revisa", titulo: "Precisa de uma pessoa", frase: "Nada se contradiz, mas falta uma informação para confirmar a peça." };
  if (e) return { nivel: "recusa", titulo: "O cadastro se contradiz", frase: "Dois dados do mesmo cadastro apontam para peças diferentes. O sistema não escolhe um deles." };
  return { nivel: "recusa", titulo: "Não reconhecemos esta peça", frase: "O protótipo só reconhece rolamento rígido de esferas das séries 60, 62 e 63." };
}

export interface Grupo {
  chave: string;
  nivel: Decisao;
  titulo: string;
  explicacao: string;
  relacoes: Relacao[];
}

/** Agrupa as relações do motor nas perguntas que a pessoa faz. */
export function agrupar(relacoes: Relacao[]): Grupo[] {
  const de = (f: (r: Relacao) => boolean) => relacoes.filter(f);
  const grupos: Grupo[] = [
    {
      chave: "mesma",
      nivel: "resolve",
      titulo: "É a mesma peça",
      explicacao: "Outro código do cadastro com a mesma especificação. Os dois códigos continuam existindo.",
      relacoes: de((r) => r.tipo === "SAME_AS" && r.decisao === "resolve"),
    },
    {
      chave: "outra-marca",
      nivel: "resolve",
      titulo: "Equivale na medida, com condições",
      explicacao: "O próprio cadastro cita as duas marcas para esta peça. Isso não prova que uma substitui a outra.",
      relacoes: de((r) => r.tipo === "CROSS_REFERENCE"),
    },
    {
      chave: "troca",
      nivel: "revisa",
      titulo: "Trocar uma marca pela outra precisa de uma pessoa",
      explicacao: "Falta uma fonte que diga em que condições a troca funciona.",
      relacoes: de((r) => r.tipo === "INTERCHANGEABLE_FOR" && r.decisao !== "resolve"),
    },
    {
      chave: "troca-ok",
      nivel: "resolve",
      titulo: "Substitui, com condições",
      explicacao: "Uma fonte publica as condições da troca.",
      relacoes: de((r) => r.tipo === "INTERCHANGEABLE_FOR" && r.decisao === "resolve"),
    },
    {
      chave: "talvez",
      nivel: "revisa",
      titulo: "Pode ser a mesma peça, precisa de uma pessoa",
      explicacao: "A especificação bate, mas um dos cadastros tem um problema que alguém precisa conferir.",
      relacoes: de((r) => r.tipo === "SAME_AS" && r.decisao === "revisa"),
    },
    {
      chave: "parece",
      nivel: "recusa",
      titulo: "Parece, mas não é",
      explicacao: "O texto é parecido, mas um detalhe técnico muda a peça.",
      relacoes: de((r) => r.tipo === "SAME_AS" && r.decisao === "recusa"),
    },
    {
      chave: "pista",
      nivel: "revisa",
      titulo: "Mesmas medidas, sem código para confirmar",
      explicacao: "Medida igual é só uma pista. Uma pessoa precisa conferir a peça.",
      relacoes: de((r) => r.tipo === "SIMILAR_TO" || r.tipo === "COMPATIBLE_WITH"),
    },
  ];
  return grupos.filter((g) => g.relacoes.length);
}

/** "CATMAT 311963" vira "Código 311963"; marcas ficam como estão. */
export const alvoTexto = (alvo: string) => alvo.replace(/^CATMAT (\d+)$/, "Código $1");

/** Os itens de um grupo em uma linha: "Códigos 290385, 346383 e 472505" ou "NSK 6206 DDU". */
export function alvosTexto(relacoes: Relacao[]): string {
  const e = (l: string[]) => (l.length > 1 ? `${l.slice(0, -1).join(", ")} e ${l.at(-1)}` : (l[0] ?? ""));
  const codigos = relacoes.map((r) => /^CATMAT (\d+)$/.exec(r.alvo)?.[1]);
  if (codigos.every((c) => c !== undefined)) return `${codigos.length > 1 ? "Códigos" : "Código"} ${e(codigos as string[])}`;
  return e(relacoes.map((r) => alvoTexto(r.alvo)));
}

/** Semelhança de texto em palavras, nunca em número. */
export function semelhancaEmPalavras(valor: number): string {
  if (valor >= 0.95) return "Textos iguais";
  if (valor >= 0.75) return "Textos quase iguais";
  if (valor >= 0.45) return "Textos parecidos";
  return "Textos diferentes";
}

export const APLICABILIDADE =
  "O protótipo não diz em que máquina a peça serve. Para isso é preciso ligar a peça à máquina de verdade, e esse dado ainda não existe aqui.";

type Regra = [RegExp, (...g: string[]) => string];

const lado = (p: string) => p.replace("vedação de contato", "vedação de borracha");

// Uma regra por forma de motivo que o motor escreve. O teste tests/linguagem.test.ts
// passa o cadastro inteiro e o gabarito por aqui e falha se alguma forma ficar sem tradução.
const REGRAS: Regra[] = [
  [/^contradição: (.+)$/, (m) => explicar(m) ?? m],
  [/^item com (?:contradição|pendência): (.+)$/, (m) => `Um dos dois cadastros tem um problema: ${minuscula(explicar(m) ?? m)}`],
  [/^um dos itens não tem especificação: (.+)$/, (m) => `Um dos dois cadastros não tem dados suficientes: ${minuscula(explicar(m) ?? m)}`],
  [
    /^designação (.+?) lida por inteiro e sem contradição com o texto( nem com a DIN 625-1)?$/,
    (cod, din) => `O código ${cod} foi lido inteiro e bate com a descrição${din ? " e com a tabela de medidas da norma" : ""}.`,
  ],
  [
    /^a tabela DIN 625-1 aberta não cobre (\d+); diâmetro externo e largura não foram conferidos$/,
    (b) => `A tabela aberta da norma não traz o tamanho ${b}. Por isso o diâmetro externo e a largura não foram conferidos.`,
  ],
  [/^duplicidade exata: mesmas palavras e mesma especificação$/, () => "Cadastro duplicado: as mesmas palavras e a mesma especificação."],
  [/^mesma especificação com textos diferentes$/, () => "Textos diferentes, mesma especificação."],
  [/^duplicidade exata$/, () => "Cadastro duplicado."],
  [
    /^designação (\d+), (.+), folga (C2|CN|C3|C4|C5)(, inoxidável)?$/,
    (b, p, f, inox) => `Os dois são ${b}, ${lado(p)}, ${FOLGA[f as Folga]}${inox ? ", aço inoxidável" : ""}.`,
  ],
  [/^semelhança de texto ([\d,]+) \(SIMILAR_TO, sem autoridade para decidir\)$/, () => ""],
  [/^atributo diverge: proteção: (.+) x (.+)$/, (a, b) => `Proteção diferente: este tem ${lado(a)}; o outro tem ${lado(b)}.`],
  [/^atributo diverge: folga radial (\w+) x (\w+)$/, (a, b) => `Folga diferente: ${FOLGA[a as Folga]} neste; ${FOLGA[b as Folga]} no outro.`],
  [/^atributo diverge: designação básica (\S+) x (\S+)$/, (a, b) => `Tamanho diferente: ${a} neste; ${b} no outro.`],
  [/^atributo diverge: material: (.+) x (.+)$/, (a, b) => `Material diferente: ${material(a)} neste; ${material(b)} no outro.`],
  [
    /^diâmetro interno ([\d,]+) mm \(".*"\) contradiz o código (\d+) \(furo ([\d,]+) mm\)$/,
    (d, cod, furo) => `A descrição diz furo de ${d} mm, mas o código ${cod} tem furo de ${furo} mm.`,
  ],
  [
    /^(diâmetro externo|largura) ([\d,]+) mm \(".*"\) contradiz a DIN 625-1 para (\d+) \(([\d,]+) mm\)$/,
    (nome, v, cod, ref) => `A descrição diz ${nome} de ${v} mm, mas a norma dá ${ref} mm para o ${cod}.`,
  ],
  [
    /^texto "(.+)" não combina com (.+) indicada pelo sufixo de "(.+)"$/,
    (t, p, cod) => `A descrição diz "${t}", mas o final do código "${cod}" indica ${lado(p)}.`,
  ],
  [
    /^texto "(.+)" não combina com (.+), que vale só por convenção \(designação sem sufixo\)$/,
    (t, p) => `A descrição diz "${t}", mas o código não tem final. Sem final, o costume é ${lado(p)}.`,
  ],
  [/^texto "(.+)" contradiz a folga (\w+) da designação$/, (t, f) => `A descrição diz "${t}", mas o código indica ${FOLGA[f as Folga]}.`],
  [/^texto "(.+)" declara folga que a designação não traz$/, (t) => `A descrição diz "${t}", mas o código não traz essa folga.`],
  [
    /^texto declara "(.+)", mas a designação não traz marca de inoxidável \(prefixo W no sistema SKF\)$/,
    (t) => `A descrição diz "${t}", mas o código da peça não indica aço inoxidável.`,
  ],
  [
    /^sufixo "(.+)" em "(.+)" não está nas fontes de regra registradas$/,
    (s, cod) => `O final "${s}" do código "${cod}" não está nas regras que o protótipo conhece. Alguém precisa conferir o que ele significa.`,
  ],
  [/^referências "(.+)" e "(.+)" declaram proteção ou folga diferentes$/, (a, b) => `Os códigos "${a}" e "${b}" indicam proteção ou folga diferentes.`],
  [/^mais de uma designação básica no texto: (.+)$/, (l) => `A descrição cita mais de um tamanho de rolamento: ${l}.`],
  [/^designação seguida de outro número \(por exemplo 6204\/6ZZ\); leitura ambígua$/, () => "O código vem colado a outro número, como em 6204/6ZZ. Dá para ler de mais de um jeito."],
  [
    /^designação ausente; dimensões (.+) mm coincidem com (.+) na tabela DIN 625-1 \(só recuperação\)$/,
    (dim, cods) => `A descrição não traz o código da peça. As medidas ${dim.replace(/ x /g, " × ")} mm batem com ${cods} na norma, mas medida igual é só uma pista.`,
  ],
  [
    /^designação ausente; dimensões (.+) mm sem correspondência na tabela DIN 625-1$/,
    (dim) => `A descrição não traz o código da peça, e as medidas ${dim.replace(/ x /g, " × ")} mm não aparecem na norma.`,
  ],
  [/^fora da família: dimensões em polegada; o recorte é métrico$/, () => "As medidas estão em polegada. O protótipo só cobre rolamentos métricos."],
  [/^fora da família: (.+) \("(.+)"\)$/, (tipo) => `É ${tipo.replace(/^rolamento /, "um rolamento ").replace(/^rolo /, "um rolo ")}. O protótipo só cobre rolamento rígido de esferas das séries 60, 62 e 63.`],
  [
    /^sem evidência mínima: nenhuma designação 60xx, 62xx ou 63xx e dimensões incompletas$/,
    () => "Não há código de rolamento das séries 60, 62 ou 63, nem as três medidas da peça.",
  ],
  [/^candidato recuperado pelas dimensões de (\d+); similaridade não decide identidade$/, (b) => `Tem as mesmas medidas do ${b}. Medida igual não prova que é a mesma peça.`],
  [/^referência cruzada publicada no registro de origem, com a mesma designação básica$/, () => "O cadastro cita as duas marcas para a mesma peça, com o mesmo tamanho básico."],
  [/^CROSS_REFERENCE não implica INTERCHANGEABLE_FOR sem condições técnicas e fonte$/, () => "Citar duas marcas juntas não prova que uma substitui a outra."],
  [/^a proteção "(.+)" de (\S+) não foi verificada em catálogo do fabricante$/, (s, m) => `Ninguém conferiu no catálogo da ${m} o que significa o final "${s}".`],
  [/^nenhuma fonte publica as condições de aplicação desta substituição$/, () => "Nenhuma fonte diz em que condições a troca funciona."],
  [/^(\S+ .+?): (\S+) pela regra de designação$/, (ref, cod) => `${ref}: código lido como ${cod}.`],
  [/^(\S+ .+?): sufixo "(.+)" não decodificado pelas fontes registradas$/, (ref, s) => `${ref}: o final "${s}" não foi decifrado.`],
  [/^(\S+ .+?): sufixo não decodificado$/, (ref) => `${ref}: o final do código não foi decifrado.`],
  [
    /^mesma designação básica dos dois lados: mesmas dimensões de contorno pela série ISO$/,
    () => "As duas têm o mesmo tamanho básico. Pela norma ISO, as medidas externas são iguais.",
  ],
  [/^direção preservada como publicada; a relação inversa exige fonte própria$/, () => "Vale no sentido em que o cadastro publicou. O sentido inverso precisa de outra fonte."],
];

function material(m: string): string {
  return m === "inoxidável" ? "aço inoxidável" : "sem indicação de inox";
}

function minuscula(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/**
 * Traduz um motivo do motor para uma frase clara.
 * Devolve "" quando o motivo só interessa ao sistema e null quando nenhuma regra o reconhece.
 */
export function explicar(motivo: string): string | null {
  const m = motivo.trim();
  for (const [re, f] of REGRAS) {
    const g = re.exec(m);
    if (g) return f(...g.slice(1));
  }
  return null;
}

/** Frases para mostrar; motivos sem tradução aparecem como vieram, para não esconder nada. */
export function frases(motivos: string[]): string[] {
  return motivos.map((m) => explicar(m) ?? m).filter((f) => f !== "");
}

/** Semelhança de texto que o motor anota numa relação, quando existe. */
export function semelhancaDaRelacao(r: Relacao): number | null {
  for (const m of r.motivos) {
    const g = /^semelhança de texto ([\d,]+) /.exec(m);
    if (g) return Number(g[1].replace(",", "."));
  }
  return null;
}

/** Qualidade da leitura da foto em palavras, a partir da confiança média do leitor de texto. */
export function leituraEmPalavras(confianca: number): { nivel: Decisao; texto: string } {
  if (confianca >= 80) return { nivel: "resolve", texto: "Leitura boa" };
  if (confianca >= 60) return { nivel: "revisa", texto: "Leitura razoável" };
  return { nivel: "recusa", texto: "Leitura ruim" };
}

/** Nome de cada estrato do lote e da medição. */
export function estratoTexto(e: string): string {
  const s = /^série (\d+)$/.exec(e);
  if (s) return `Série ${s[1]}`;
  if (e === "fora da família") return "Outros tipos de rolamento";
  if (e === "sem designação da família") return "Sem código de rolamento";
  return e.charAt(0).toUpperCase() + e.slice(1);
}
