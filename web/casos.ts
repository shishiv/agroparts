// Exemplos da apresentação: cada caso contado como no PDF do Rota Inova, com a situação, a imagem,
// a entrada, a resposta e o porquê, e um botão que roda o caso no protótipo de verdade.
// O teste tests/casos.test.ts confere no motor cada resposta escrita aqui.
import type { Decisao, Protecao } from "../src/motor/tipos";
import { esc, LEGENDA_DO_DESENHO, picto, rolamento, texto } from "./html";

export type Foto = { src: string; alt: string; credito: string; largura: number; altura: number; legenda?: string };
export type Etiqueta = { rotulo: string; texto: string; marcas?: string[] };
export type Numero = { numero: string; texto: string };
/** O desenho dos dois lados de uma peça do caso, o mesmo que a resposta do protótipo mostra. */
export type Desenho = { protecao: Protecao; legenda: string };
export type Rodar = { tipo: "codigo" | "descricao"; texto: string } | { tipo: "lote" } | { tipo: "foto"; url: string };
export type GrupoEsperado = { nivel: Decisao; titulo: string; alvos: string };
export type RespostaEsperada = { nivel: Decisao; titulo: string; frase: string; grupos: GrupoEsperado[] } | { numeros: Numero[] };

export interface Caso {
  /** Igual à chave da explicação passo a passo do mesmo caso (tour.ts). */
  chave: string;
  /** Posição na lista, de 1 a 7. Os cinco primeiros são as provas do pitch. */
  numero: string;
  /** O nome do caso em todo o site: lista, menu "Como funciona" e explicação passo a passo. */
  titulo: string;
  resumo: string;
  /** Foto da lista de casos; sem foto, a lista mostra o desenho da peça. */
  miniatura?: Foto;
  situacao: { titulo: string; frases: string[]; foto?: Foto };
  figura: { titulo: string; frases: string[]; fotos?: Foto[]; etiquetas?: Etiqueta[]; numeros?: Numero[]; desenhos?: Desenho[] };
  entrada: { rotulo: string; valor: string; imagem?: Foto; nota: string };
  rodar: Rodar;
  /** A resposta numa frase, antes da placa. */
  leitura: string;
  resposta: RespostaEsperada;
  porque: string[];
}

const NILSSON = "Foto: R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0";
const ESTOQUE: Foto = {
  src: "/exemplos/estoque-de-pecas.jpg",
  alt: "Depósito com peças de máquina no chão e nas prateleiras",
  credito: "Foto: Ikiwaner, Wikimedia Commons, CC BY-SA 3.0",
  legenda: "Um depósito de peças de máquina",
  largura: 1000,
  altura: 667,
};
const USINA: Foto = {
  src: "/exemplos/usina-uberaba.jpg",
  alt: "Usina de açúcar e álcool perto de Uberaba, com chaminés soltando vapor",
  credito: "Usina perto de Uberaba (MG). Foto: Jonathan Wilkins, Wikimedia Commons, CC BY-SA 3.0",
  largura: 1000,
  altura: 667,
};
const COLHEITA: Foto = {
  src: "/exemplos/colheita-piracicaba.jpg",
  alt: "Colhedora de cana carregando um caminhão em Piracicaba",
  credito: "Colheita em Piracicaba (SP). Foto: Mariordo, Wikimedia Commons, CC BY 3.0",
  largura: 1000,
  altura: 667,
};
const ABERTO: Foto = {
  src: "/exemplos/foto-rolamento-6203-c3-rkw.jpg",
  alt: "Rolamento de esferas aberto, com as esferas à mostra",
  credito: NILSSON,
  largura: 799,
  altura: 800,
  legenda: "Aberto, com as esferas à mostra",
};
const FECHADO: Foto = {
  src: "/exemplos/rolamento-com-tampa-6007.jpg",
  alt: "Rolamento de esferas fechado, com uma tampa de metal sobre as esferas",
  credito: NILSSON,
  largura: 800,
  altura: 785,
  legenda: "Fechado, com blindagem metálica (uma tampa de metal)",
};
const ETIQUETA: Foto = {
  src: "/exemplos/etiqueta-impressa-catmat-311960.png",
  alt: "Etiqueta impressa: Rolamento rígido de esferas, 6318ZZ C3, 90 x 190 x 43 mm, CATMAT 311960",
  credito: "Etiqueta montada pela equipe com o texto do cadastro 311960. Não é foto de campo.",
  largura: 912,
  altura: 432,
};

export const CASOS: Caso[] = [
  {
    chave: "duplicado",
    numero: "1",
    titulo: "Dois cadastros, a mesma peça",
    resumo: "O mesmo rolamento entrou duas vezes no cadastro, com dois códigos.",
    miniatura: ESTOQUE,
    situacao: {
      titulo: "No almoxarifado",
      frases: [
        "Cada pessoa cadastra a peça do seu jeito.",
        "Às vezes, a mesma peça entra duas vezes no cadastro, com dois códigos.",
        "Aí a usina compra uma peça que já está na prateleira.",
      ],
      foto: ESTOQUE,
    },
    figura: {
      titulo: "A mesma peça, dois códigos",
      etiquetas: [
        {
          rotulo: "Código 311960",
          texto:
            "ROLAMENTO DE ESFERA, TIPO USO: MÁQUINAS EM GERAL , REFERÊNCIA FABRICANTE: 6318ZZ C3 , CARACTERÍSTICAS ADICIONAIS: RÍGIDO DE UMA CARREIRA DE ESFERAS; BLINDAGEM DUPLA , DIÂMETRO INTERNO: 90 MM, DIÂMETRO EXTERNO: 190 MM, LARGURA: 43 MM",
          marcas: ["6318ZZ C3", "BLINDAGEM DUPLA"],
        },
        {
          rotulo: "Código 311963",
          texto:
            "ROLAMENTO DE ESFERA, TIPO USO: MÁQUINAS EM GERAL , REFERÊNCIA FABRICANTE: 6318ZZ C3 , CARACTERÍSTICAS ADICIONAIS: RÍGIDO DE UMA CARREIRA DE ESFERAS, BLINDAGEM DUPLA , DIÂMETRO INTERNO: 90 MM, DIÂMETRO EXTERNO: 190 MM, LARGURA: 43 MM",
          marcas: ["6318ZZ C3", "BLINDAGEM DUPLA"],
        },
      ],
      frases: ["Os dois textos têm as mesmas palavras.", "Os dois falam de um rolamento 6318 fechado, com blindagem metálica nos dois lados."],
      desenhos: [
        { protecao: "blindagem_dupla", legenda: "311960: blindagem metálica nos dois lados" },
        { protecao: "blindagem_dupla", legenda: "311963: blindagem metálica nos dois lados" },
      ],
    },
    entrada: { rotulo: "Código", valor: "311960", nota: "Abre a tela de identificar com o código 311960 e mostra a resposta." },
    rodar: { tipo: "codigo", texto: "311960" },
    leitura: "O 311960 é identificado, e o 311963 aparece como a mesma peça.",
    resposta: {
      nivel: "resolve",
      titulo: "Peça identificada",
      frase: "O código da peça foi lido inteiro, e nada no texto o contradiz.",
      grupos: [{ nivel: "resolve", titulo: "É a mesma peça", alvos: "Código 311963" }],
    },
    porque: [
      "O código 6318ZZ C3 diz o tamanho, a proteção e a folga da peça.",
      "O cadastro 311963 tem o mesmo tamanho, a mesma proteção, a mesma folga e o mesmo material.",
      "Os dois códigos continuam no cadastro. Uma pessoa decide se junta os dois.",
    ],
  },
  {
    chave: "parece",
    numero: "2",
    titulo: "Parece, mas não é",
    resumo: "Sete cadastros têm nome quase igual, mas são outra peça. O protótipo mostra a diferença de cada um.",
    miniatura: ABERTO,
    situacao: {
      titulo: "No almoxarifado",
      frases: [
        "No cadastro, 6211ZZ e 6211 ZC3 parecem o mesmo rolamento.",
        "Quem compra com pressa pega o primeiro da lista.",
        "Mas um detalhe no código muda a peça.",
      ],
    },
    figura: {
      titulo: "Parecido não é igual",
      fotos: [ABERTO, FECHADO],
      frases: [
        "Os dois são rolamentos. Na máquina, um não substitui o outro.",
        "No cadastro, a diferença pode ser menor e não aparecer na foto.",
        "No código, ZZ quer dizer blindagem nos dois lados. Z quer dizer blindagem em um lado só.",
        "As fotos são ilustrativas. Elas não são as peças do cadastro.",
      ],
      desenhos: [
        { protecao: "blindagem_dupla", legenda: "6211ZZ: blindagem metálica nos dois lados" },
        { protecao: "blindagem_simples", legenda: "6211 ZC3: blindagem metálica em um lado só" },
      ],
    },
    entrada: { rotulo: "Código", valor: "317388", nota: "Abre a tela de identificar com o código 317388, o 6211ZZ, e mostra a resposta." },
    rodar: { tipo: "codigo", texto: "317388" },
    leitura: "O 317388 é identificado, por isso a placa é verde. O ponto deste caso está embaixo: os sete parecidos vão para o grupo vermelho.",
    resposta: {
      nivel: "resolve",
      titulo: "Peça identificada",
      frase: "O código da peça foi lido inteiro, e nada no texto o contradiz.",
      grupos: [
        { nivel: "resolve", titulo: "É a mesma peça", alvos: "Código 472510" },
        { nivel: "recusa", titulo: "Parece, mas não é", alvos: "Códigos 290385, 346383, 472505, 472506, 472507, 472508 e 472509" },
      ],
    },
    porque: [
      "O 317388 é um 6211 com blindagem metálica nos dois lados e folga normal.",
      "O 472510 tem os mesmos dados, escritos com outras palavras. É a mesma peça.",
      "Nos outros sete, muda a proteção, a folga ou as duas. O 290385, por exemplo, tem blindagem em um lado só e folga C3.",
      "A AgroParts nunca chama de igual o que só parece. Ela recusa e mostra a diferença.",
    ],
  },
  {
    chave: "marca",
    numero: "3",
    titulo: "Outra marca, mesma medida",
    resumo: "O cadastro cita uma SKF e uma NSK do mesmo tamanho. Antes de trocar uma pela outra, uma pessoa confere.",
    miniatura: COLHEITA,
    situacao: {
      titulo: "Na manutenção",
      frases: [
        "Na safra, a máquina parada não pode esperar.",
        "A manutenção pede um rolamento de uma marca. Na prateleira, tem outra marca do mesmo tamanho.",
        "Dá para trocar?",
      ],
      foto: COLHEITA,
    },
    figura: {
      titulo: "Duas marcas, o mesmo tamanho",
      etiquetas: [
        { rotulo: "SKF", texto: "6206 2RS1", marcas: ["6206"] },
        { rotulo: "NSK", texto: "6206 DDU", marcas: ["6206"] },
      ],
      frases: [
        "O cadastro 624270 cita as duas marcas para a mesma peça.",
        "O número 6206 é o tamanho: furo de 30 mm, 62 mm por fora e 16 mm de largura.",
        "O final do código muda de marca para marca: 2RS1 na SKF, DDU na NSK.",
      ],
    },
    entrada: { rotulo: "Código", valor: "624270", nota: "Abre a tela de identificar com o código 624270 e mostra a resposta." },
    rodar: { tipo: "codigo", texto: "624270" },
    leitura: "A placa fica amarela. O cadastro cita as duas marcas, mas a troca de uma pela outra precisa de uma pessoa.",
    resposta: {
      nivel: "revisa",
      titulo: "Precisa de uma pessoa",
      frase: "Nada se contradiz, mas falta uma informação para confirmar a peça.",
      grupos: [
        { nivel: "resolve", titulo: "Equivale na medida, com condições", alvos: "NSK 6206 DDU" },
        { nivel: "revisa", titulo: "Trocar uma marca pela outra precisa de uma pessoa", alvos: "NSK 6206 DDU" },
        { nivel: "recusa", titulo: "Parece, mas não é", alvos: "Códigos 248358, 283525, 346335, 357382, 472488, 481989 e 605719" },
      ],
    },
    porque: [
      "As duas marcas têm o mesmo tamanho básico. Pela norma, as medidas de fora são iguais.",
      "Ninguém conferiu no catálogo da NSK o que quer dizer o final DDU.",
      "O cadastro diz aço inoxidável, mas o código da peça não indica inox.",
      "Por isso, trocar de marca nunca é automático. Uma pessoa decide.",
    ],
  },
  {
    chave: "lote",
    numero: "4",
    titulo: "A lista inteira de uma vez",
    resumo: "O protótipo lê 396 cadastros de rolamento de uma vez e acha 28 grupos de cadastros duplicados.",
    miniatura: USINA,
    situacao: {
      titulo: "Na usina",
      frases: [
        "Uma usina guarda muitas peças para manter as máquinas rodando.",
        "Arrumar o cadastro peça por peça é um mutirão longo.",
        "Depois do mutirão, a bagunça volta.",
      ],
      foto: USINA,
    },
    figura: {
      titulo: "O cadastro inteiro",
      numeros: [
        { numero: "396", texto: "cadastros de rolamento de esferas do catálogo público do governo" },
        { numero: "28", texto: "grupos de cadastros duplicados" },
      ],
      frases: ["A lista é pública. Ela não vem de uma usina.", "Cada grupo junta códigos diferentes da mesma peça."],
    },
    entrada: {
      rotulo: "Lista",
      valor: "Todos os rolamentos de esferas ativos do catálogo público",
      nota: "Abre a tela do cadastro inteiro e lê os 396 cadastros.",
    },
    rodar: { tipo: "lote" },
    leitura: "Em poucos segundos, o protótipo lê a lista inteira e separa o que ele confirma sozinho.",
    resposta: {
      numeros: [
        { numero: "396", texto: "cadastros lidos" },
        { numero: "183", texto: "confirmados sem ajuda" },
        { numero: "74", texto: "para uma pessoa" },
        { numero: "28", texto: "grupos de cadastros duplicados" },
      ],
    },
    porque: [
      "Os outros 139 cadastros ficam recusados: são outro tipo de rolamento, não têm código ou se contradizem.",
      "Cada linha guarda o texto original ao lado do código padronizado.",
      "O resultado sai numa planilha de-para, para abrir no Excel.",
      "Nada é apagado nem gravado no sistema da usina.",
    ],
  },
  {
    chave: "pessoa",
    numero: "5",
    titulo: "O cadastro se contradiz",
    resumo: "O texto diz 60 mm. O código diz 65 mm. Uma pessoa decide, e o sistema guarda quem decidiu e por quê.",
    miniatura: FECHADO,
    situacao: {
      titulo: "No almoxarifado",
      frases: ["Alguém digitou o cadastro com pressa.", "O texto diz uma medida, e o código da peça diz outra.", "Qual dos dois está certo?"],
    },
    figura: {
      titulo: "O texto e o código não batem",
      etiquetas: [
        {
          rotulo: "Código 472447",
          texto:
            "ROLAMENTO DE ESFERA, TIPO USO: MÁQUINAS EM GERAL , CARACTERÍSTICAS ADICIONAIS: RÍGIDO DE UMA CARREIRA DE ESFERAS, BLINDAGEM DUPLA , DIÂMETRO INTERNO: 60 MM, DIÂMETRO EXTERNO: 100 MM, LARGURA: 18 MM, REFERÊNCIA FABRICANTE 1: 6013 ZZ",
          marcas: ["DIÂMETRO INTERNO: 60 MM", "6013 ZZ"],
        },
      ],
      fotos: [{ ...FECHADO, legenda: "O furo é o buraco do meio do rolamento. No 6013, ele tem 65 mm." }],
      frases: ["O texto diz furo de 60 mm.", "Mas o código 6013 é de um rolamento com furo de 65 mm."],
    },
    entrada: { rotulo: "Código", valor: "472447", nota: "Abre a tela de identificar com o código 472447 e mostra a resposta." },
    rodar: { tipo: "codigo", texto: "472447" },
    leitura: "A placa fica vermelha: o cadastro se contradiz. O 479589, que tem o mesmo código, fica para uma pessoa conferir.",
    resposta: {
      nivel: "recusa",
      titulo: "O cadastro se contradiz",
      frase: "Dois dados do mesmo cadastro apontam para peças diferentes. O sistema não escolhe um deles.",
      grupos: [
        { nivel: "revisa", titulo: "Pode ser a mesma peça, precisa de uma pessoa", alvos: "Código 479589" },
        { nivel: "recusa", titulo: "Parece, mas não é", alvos: "Código 472448" },
      ],
    },
    porque: [
      "A AgroParts não escolhe um lado. Ela mostra a contradição.",
      "Uma pessoa confere a peça e registra a decisão, com o nome e o motivo.",
      "O cadastro original não muda. A decisão fica guardada ao lado dele.",
    ],
  },
  {
    chave: "fornecedor",
    numero: "6",
    titulo: "Texto curto de fornecedor",
    resumo: "O fornecedor escreve “BLK Modelo 6205-2rs”. O protótipo acha a mesma peça no cadastro.",
    situacao: {
      titulo: "Nas compras",
      frases: [
        "O fornecedor manda a cotação do jeito dele, com poucas palavras.",
        "A peça já existe no cadastro com outro nome?",
        "Se ninguém perceber, a usina cria um código novo para uma peça que já tem.",
      ],
    },
    figura: {
      titulo: "Dois textos, a mesma peça",
      etiquetas: [
        { rotulo: "Texto do fornecedor", texto: "BLK Modelo 6205-2rs", marcas: ["6205-2rs"] },
        {
          rotulo: "Código 472486 do cadastro",
          texto:
            "ROLAMENTO DE ESFERA, TIPO USO: MÁQUINAS EM GERAL , CARACTERÍSTICAS ADICIONAIS: RÍGIDO, UMA CARREIRA DE ESFERA, VEDAÇÃO NBR EM AMB , DIÂMETRO INTERNO: 25 MM, DIÂMETRO EXTERNO: 52 MM, LARGURA: 15 MM, REFERÊNCIA FABRICANTE 1: 6205 2RS",
          marcas: ["VEDAÇÃO NBR EM AMB", "6205 2RS"],
        },
      ],
      frases: ["No código, 2RS quer dizer vedação de borracha nos dois lados.", "As palavras são outras, mas a peça é a mesma."],
      desenhos: [
        { protecao: "vedacao_dupla", legenda: "6205-2RS do fornecedor: vedação de borracha nos dois lados" },
        { protecao: "vedacao_dupla", legenda: "472486 do cadastro: vedação de borracha nos dois lados" },
      ],
    },
    entrada: {
      rotulo: "Descrição",
      valor: "BLK Modelo 6205-2rs",
      nota: "Abre a tela de identificar com o texto do fornecedor e mostra a resposta.",
    },
    rodar: { tipo: "descricao", texto: "BLK Modelo 6205-2rs" },
    leitura: "O texto do fornecedor é identificado, e o 472486 aparece como a mesma peça.",
    resposta: {
      nivel: "resolve",
      titulo: "Peça identificada",
      frase: "O código da peça foi lido inteiro, e nada no texto o contradiz.",
      grupos: [
        { nivel: "resolve", titulo: "É a mesma peça", alvos: "Código 472486" },
        { nivel: "recusa", titulo: "Parece, mas não é", alvos: "Códigos 248357, 346334, 357383, 388227 e 472487" },
      ],
    },
    porque: [
      "O texto é curto, mas traz o código 6205-2RS inteiro.",
      "O código bate com a tabela de medidas da norma: 25 × 52 × 15 mm.",
      "O cadastro 472486 tem o mesmo tamanho, a mesma proteção e a mesma folga. Não precisa criar outro código.",
    ],
  },
  {
    chave: "foto",
    numero: "7",
    titulo: "A foto serve para ler a etiqueta",
    resumo: "A câmera lê o texto de uma etiqueta impressa. Código gravado no metal ela não consegue ler.",
    miniatura: ETIQUETA,
    situacao: {
      titulo: "No almoxarifado",
      frases: [
        "A peça está na mão, e a caixa tem uma etiqueta.",
        "Fotografar é mais rápido do que digitar o código.",
        "A câmera lê o texto. Ela não reconhece a peça pela aparência.",
      ],
    },
    figura: {
      titulo: "Etiqueta impressa e código gravado",
      fotos: [
        { ...ETIQUETA, legenda: "Etiqueta impressa: a câmera leu." },
        {
          ...ABERTO,
          alt: "Rolamento 6203 C3 com o código gravado no anel de metal",
          legenda: "Código gravado no metal: a câmera não leu. O site pede para digitar.",
        },
      ],
      frases: ["A aparência não mostra a medida. Por isso, a câmera só lê o texto."],
    },
    entrada: {
      rotulo: "Foto da etiqueta",
      valor: "",
      imagem: ETIQUETA,
      nota: "Lê a etiqueta de exemplo e mostra a resposta. Na primeira vez, a leitura leva alguns segundos.",
    },
    rodar: { tipo: "foto", url: "/exemplos/etiqueta-impressa-catmat-311960.png" },
    leitura: "A etiqueta é lida e identificada, como o código 311960 digitado.",
    resposta: {
      nivel: "resolve",
      titulo: "Peça identificada",
      frase: "O código da peça foi lido inteiro, e nada no texto o contradiz.",
      grupos: [{ nivel: "resolve", titulo: "É a mesma peça", alvos: "Códigos 311960 e 311963" }],
    },
    porque: [
      "A foto vira texto: 6318ZZ C3, 90 × 190 × 43 mm.",
      "A pessoa confere o texto lido antes de identificar.",
      "Daí em diante, a resposta é igual à do código digitado.",
    ],
  },
];

export const casoPorChave = (chave: string) => CASOS.find((c) => c.chave === chave);

/** "Caso 2 de 7". */
export const ordemDoCaso = (c: Caso) => `Caso ${c.numero} de ${CASOS.length}`;

const seta = picto("seta");
/** Recorte quadrado de 240 px da foto, em public/exemplos/miniaturas/. */
export const miniatura = (f: Foto) => f.src.replace("/exemplos/", "/exemplos/miniaturas/");

function foto(f: Foto, classe = ""): string {
  // A etiqueta é texto: aparece inteira, sem recorte.
  const inteira = f.src.endsWith(".png") ? " inteira" : "";
  // A licença ("CC BY-SA 3.0") fica numa linha só.
  const credito = esc(f.credito).replace(/CC BY(-SA)? \d\.\d/, (l) => `<span class="junto">${l}</span>`);
  return `<figure class="foto${inteira} ${classe}">
    <img src="${esc(f.src)}" alt="${esc(f.alt)}" width="${f.largura}" height="${f.altura}" loading="lazy" />
    <figcaption>${f.legenda ? `<span class="foto-legenda">${texto(f.legenda)}</span>` : ""}<span class="credito">${credito}</span></figcaption>
  </figure>`;
}

/** O texto como está no cadastro, com os trechos que importam em negrito. */
function etiqueta(e: Etiqueta): string {
  let html = texto(e.texto);
  for (const m of e.marcas ?? []) html = html.replace(texto(m), `<b>${texto(m)}</b>`);
  const curto = e.texto.length <= 24 ? " curto" : "";
  return `<div class="cadastro"><p class="cadastro-rotulo">${esc(e.rotulo)}</p><p class="cadastro-texto${curto}">${html}</p></div>`;
}

const frases = (l: string[]) => l.map((f) => `<p>${texto(f)}</p>`).join("");
// Os desenhos vêm depois das fotos, em bloco próprio: cada desenho é uma peça do cadastro, não a foto de cima.
const desenhos = (l: Desenho[]) =>
  `<p class="desenhos-titulo">Como o protótipo desenha as peças do cadastro:</p>
  <div class="desenhos">${l.map((d) => `<figure>${rolamento(d.protecao)}<figcaption>${texto(d.legenda)}</figcaption></figure>`).join("")}</div>
  <p class="rol-legenda">${esc(LEGENDA_DO_DESENHO)}</p>`;
const numeros = (l: Numero[]) => `<div class="numeros">${l.map((n) => `<div><strong>${esc(n.numero)}</strong><span>${esc(n.texto)}</span></div>`).join("")}</div>`;

function resposta(r: RespostaEsperada): string {
  if ("numeros" in r) return numeros(r.numeros);
  return `<div class="resposta-mini placa-${r.nivel}">
    <div class="placa-faixa">${picto(r.nivel, "placa-picto")}<div><p class="placa-titulo">${esc(r.titulo)}</p><p class="placa-frase">${esc(r.frase)}</p></div></div>
    <ul class="grupos-mini">${r.grupos
      .map((g) => `<li class="grupo-${g.nivel}">${picto(g.nivel, "grupo-picto")}<div><p class="grupo-mini-titulo">${esc(g.titulo)}</p><p class="grupo-mini-alvos">${texto(g.alvos)}</p></div></li>`)
      .join("")}</ul>
  </div>`;
}

function etapa(n: number, titulo: string, corpo: string, figura = "", depois = ""): string {
  return `<li class="etapa">
    <span class="num" aria-hidden="true">${n}</span>
    <div class="etapa-corpo">
      <h2><span class="sr">Passo ${n}: </span>${esc(titulo)}</h2>
      <div class="etapa-par${figura ? "" : " so-texto"}"><div class="etapa-texto">${corpo}</div>${figura}</div>
      ${depois}
    </div>
  </li>`;
}

function navegacao(atual: Caso): string {
  return `<nav class="casos-nav" aria-label="Casos">
    <ol>${CASOS.map(
      (c) =>
        `<li><a href="#casos/${c.chave}"${c === atual ? ' aria-current="page"' : ""} title="${esc(c.titulo)}"><span class="num">${esc(c.numero)}</span><span class="sr">${esc(c.titulo)}</span></a></li>`,
    ).join("")}</ol>
  </nav>`;
}

/** Uma tela por caso: a situação, a imagem, a entrada com o botão que roda o caso, a resposta e o porquê. */
export function desenharCaso(c: Caso): string {
  const i = CASOS.indexOf(c);
  const antes = CASOS[i - 1];
  const depois = CASOS[i + 1];
  const fig = c.figura;
  const figura = [
    fig.etiquetas ? `<div class="cadastros">${fig.etiquetas.map(etiqueta).join("")}</div>` : "",
    fig.numeros ? numeros(fig.numeros) : "",
  ].join("");
  const fotosFigura = fig.fotos ? `<div class="fotos fotos-${fig.fotos.length}">${fig.fotos.map((f) => foto(f)).join("")}</div>` : "";
  const entrada = c.entrada.imagem
    ? `<figure class="entrada-foto"><img src="${esc(c.entrada.imagem.src)}" alt="${esc(c.entrada.imagem.alt)}" width="${c.entrada.imagem.largura}" height="${c.entrada.imagem.altura}" /></figure>`
    : `<p class="entrada-valor"><span class="rotulo">${esc(c.entrada.rotulo)}</span><span class="entrada-texto">${texto(c.entrada.valor)}</span></p>`;
  return `
    <div class="caso-topo"><a class="voltar" href="#casos">${seta}Todos os exemplos</a>${navegacao(c)}</div>
    <p class="caso-ordem">${esc(ordemDoCaso(c))}</p>
    <h1 id="t-casos" tabindex="-1">${esc(c.titulo)}</h1>
    <p class="lead">${esc(c.resumo)}</p>
    <ol class="etapas">
      ${etapa(1, c.situacao.titulo, frases(c.situacao.frases), c.situacao.foto ? foto(c.situacao.foto, "foto-cena") : "")}
      ${etapa(2, fig.titulo, `${frases(fig.frases)}${figura}`, fotosFigura, fig.desenhos ? desenhos(fig.desenhos) : "")}
      ${etapa(
        3,
        "O que a pessoa informa",
        `<div class="entrada-caso">${entrada}<button type="button" class="primario" data-rodar="${esc(c.chave)}">Rodar no protótipo ${seta}</button></div><p class="pequeno">${esc(c.entrada.nota)}</p>`,
      )}
      ${etapa(
        4,
        "O que a AgroParts responde",
        `<p>${texto(c.leitura)}</p>${resposta(c.resposta)}<p class="pequeno">${"grupos" in c.resposta ? "No protótipo, cada cadastro aparece com o desenho e com o que bate e o que muda." : "No protótipo, os grupos de cadastros duplicados aparecem logo abaixo dos números."}</p>`,
      )}
      ${etapa(5, "Por quê", frases(c.porque))}
    </ol>
    <nav class="caso-vizinhos" aria-label="Caso anterior e próximo">
      ${antes ? `<a class="anterior" href="#casos/${antes.chave}">${seta}<span>${esc(`${antes.numero}. ${antes.titulo}`)}</span></a>` : "<span></span>"}
      ${depois ? `<a class="proximo" href="#casos/${depois.chave}"><span>${esc(`${depois.numero}. ${depois.titulo}`)}</span>${seta}</a>` : `<a class="proximo" href="#resolver"><span>Identificar uma peça</span>${seta}</a>`}
    </nav>`;
}

/** A lista dos casos, com as três respostas e os quatro passos da apresentação. */
export function desenharIndice(): string {
  return `
    <a class="voltar" href="#resolver">${seta}Identificar uma peça</a>
    <h1 id="t-casos" tabindex="-1">Exemplos da apresentação</h1>
    <p class="lead">Sete casos de almoxarifado, passo a passo. Cada caso mostra a situação, a peça e a resposta. Um toque roda o caso no protótipo.</p>
    <ol class="casos-lista">${CASOS.map(
      (c) => `<li><a href="#casos/${c.chave}">
        ${
          c.miniatura
            ? `<img class="casos-miniatura" src="${esc(miniatura(c.miniatura))}" alt="" width="240" height="240" decoding="async" />`
            : `<span class="casos-miniatura casos-miniatura-desenho" aria-hidden="true">${rolamento("vedacao_dupla")}</span>`
        }
        <span class="num" aria-hidden="true">${esc(c.numero)}</span>
        <span class="casos-texto"><span class="casos-titulo"><span class="sr">${esc(ordemDoCaso(c))}: </span>${esc(c.titulo)}</span><span class="casos-resumo">${esc(c.resumo)}</span></span>
        ${seta}
      </a></li>`,
    ).join("")}</ol>

    <section class="bloco" aria-labelledby="t-tres">
      <h2 id="t-tres">As três respostas</h2>
      <ul class="tres-respostas">
        <li class="placa-resolve"><div class="placa-faixa">${picto("resolve", "placa-picto")}<div><p class="placa-titulo">É a mesma peça</p><p class="placa-frase">Mesmo código e mesmas medidas.</p></div></div></li>
        <li class="placa-revisa"><div class="placa-faixa">${picto("revisa", "placa-picto")}<div><p class="placa-titulo">Precisa de uma pessoa</p><p class="placa-frase">Falta informação. Uma pessoa decide.</p></div></div></li>
        <li class="placa-recusa"><div class="placa-faixa">${picto("recusa", "placa-picto")}<div><p class="placa-titulo">Parece, mas não é</p><p class="placa-frase">Uma medida ou uma proteção diferente, ou um cadastro que se contradiz.</p></div></div></li>
      </ul>
      <p>Na dúvida, a AgroParts não arrisca. E não apaga nada do cadastro da usina.</p>
    </section>

    <section class="bloco" aria-labelledby="t-quatro">
      <h2 id="t-quatro">Do código à resposta, em quatro passos</h2>
      <ol class="quatro-passos">
        <li><span class="num" aria-hidden="true">1</span><p><b>Entrada.</b> A pessoa digita o código ou fotografa a etiqueta.</p></li>
        <li><span class="num" aria-hidden="true">2</span><p><b>Busca.</b> A AgroParts procura a peça no catálogo.</p></li>
        <li><span class="num" aria-hidden="true">3</span><p><b>Compara.</b> Ela confere as medidas, uma por uma.</p></li>
        <li><span class="num" aria-hidden="true">4</span><p><b>Resposta.</b> É a mesma, não é, ou precisa de uma pessoa.</p></li>
      </ol>
    </section>`;
}
