// Pitch da AgroParts no Rota Inova UEMG 2026 (desafio AGR08), no visual do modelo do Canva da equipe.
// Conteúdo e ordem: os 13 slides do pitch de docs/rota-inova/entrega-unica.html, mais uma página de fontes e créditos.
// O roteiro, de cerca de 6 minutos (a apresentação final tem de 5 a 7), fica no export `notes`, que o modo apresentador mostra.
import { type DesignSystem, type Page, type SlideMeta, useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

import fotoColheita from './assets/fotos/colheita-piracicaba.jpg';
import fotoEstoque from './assets/fotos/estoque-de-pecas.jpg';
import fotoRolamento from './assets/fotos/rolamento-com-tampa-6007.jpg';
import fotoUsina from './assets/fotos/usina-uberaba.jpg';
import fonteBold from './assets/fontes/Montserrat-Bold.ttf';
import fonteExtraBold from './assets/fontes/Montserrat-ExtraBold.ttf';
import fonteItalic from './assets/fontes/Montserrat-Italic.ttf';
import fonteLight from './assets/fontes/Montserrat-Light.ttf';
import fonteRegular from './assets/fontes/Montserrat-Regular.ttf';
import fonteSemiBold from './assets/fontes/Montserrat-SemiBold.ttf';
import telaEtiqueta from './assets/telas/desktop-07-ocr-etiqueta.jpg';
import telaParecida from './assets/telas/desktop-02-falsa-semelhanca.jpg';

// Cores do modelo do Canva (docs/rota-inova/estilo-slides.css).
export const design: DesignSystem = {
  palette: { bg: '#606cf5', text: '#ffffff', accent: '#05f1c7' },
  fonts: {
    display: 'Montserrat, sans-serif',
    body: 'Montserrat, sans-serif',
  },
  typeScale: { hero: 128, body: 32 },
  radius: 0,
};

const tinta = '#0e073f';
const roxo = '#a531b4';
const lavanda = '#9fa4eb';
const violeta = '#321eb1';
const azul = '#606cf5';
const verdeEscuro = '#007a66';
const veu = 'rgba(14, 7, 63, 0.78)'; // fundo do crédito sobre a foto
const branco = '#ffffff';

// Montserrat em arquivos estáticos (licença OFL, assets/fontes/OFL.txt).
// O modelo usa Agrandir nos títulos, que não tem licença livre.
const FONTES_ID = 'osd-webfont-rota-inova-pitch';
const fontes = `
@font-face { font-family: "Montserrat"; src: url("${fonteLight}"); font-weight: 300; }
@font-face { font-family: "Montserrat"; src: url("${fonteRegular}"); font-weight: 400; }
@font-face { font-family: "Montserrat"; src: url("${fonteItalic}"); font-weight: 400; font-style: italic; }
@font-face { font-family: "Montserrat"; src: url("${fonteSemiBold}"); font-weight: 600; }
@font-face { font-family: "Montserrat"; src: url("${fonteBold}"); font-weight: 700; }
@font-face { font-family: "Montserrat"; src: url("${fonteExtraBold}"); font-weight: 800; }
`;
if (typeof document !== 'undefined') {
  let estilo = document.getElementById(FONTES_ID);
  if (!estilo) {
    estilo = document.createElement('style');
    estilo.id = FONTES_ID;
    document.head.appendChild(estilo);
  }
  if (estilo.textContent !== fontes) estilo.textContent = fontes;
}

// As ilustrações são elementos do Canva e ficam fora do Git. O preparar.sh recorta do modelo.
// Sem elas, a página abre sem a ilustração em vez de quebrar.
declare global {
  interface ImportMeta {
    glob(padrao: string, opcoes: { eager: true; query: '?url'; import: 'default' }): Record<string, string>;
  }
}
const canva = import.meta.glob('./assets/canva/*.svg', { eager: true, query: '?url', import: 'default' });
const ilustracao = (nome: string): string | undefined => canva[`./assets/canva/${nome}.svg`];

// ---------- Peças de layout ----------

const PADDING_X = 140;
const LARGURA_FOTO = 800;

const Rodape = ({ comFoto = false, comChave = false, larguraFoto }: { comFoto?: boolean; comChave?: boolean; larguraFoto?: number }) => {
  const { current, total } = useSlidePageNumber();
  const foto = larguraFoto ?? (comFoto ? LARGURA_FOTO : 0);
  return (
    <div
      style={{
        position: 'absolute',
        left: comChave ? 250 : PADDING_X,
        right: foto ? foto + 60 : PADDING_X,
        bottom: 36,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 24,
        fontWeight: 700,
        color: branco,
      }}
    >
      <span>AgroParts · AGR08 · Rota Inova UEMG 2026</span>
      <span>
        {current} / {total}
      </span>
    </div>
  );
};

// Régua pontilhada do modelo, desenhada em SVG para sair igual no PDF.
const Regua = ({ cor = branco, ponto = design.palette.accent }: { cor?: string; ponto?: string }) => (
  <svg width={584} height={24} viewBox="0 0 584 24" style={{ display: 'block', flex: 'none', margin: '20px 0 30px' }} aria-hidden="true">
    <line x1={0} y1={12} x2={560} y2={12} stroke={cor} strokeWidth={4} strokeDasharray="9 3" />
    <circle cx={572} cy={12} r={12} fill={ponto} />
  </svg>
);

// O olho do modelo é menta, mas menta sobre o azul fica em 2,9:1. Em branco e negrito, passa como texto grande.
const Olho = ({ children }: { children: ReactNode }) => (
  <p style={{ margin: '0 0 14px', fontSize: 28, fontWeight: 700, color: branco, letterSpacing: '0.02em' }}>{children}</p>
);

const Titulo = ({ children, tamanho = 60, largura = 1600 }: { children: ReactNode; tamanho?: number; largura?: number }) => (
  <h2
    style={{
      margin: 0,
      maxWidth: largura,
      fontFamily: 'var(--osd-font-display)',
      fontSize: tamanho,
      lineHeight: 1.12,
      fontWeight: 800,
      letterSpacing: '-0.01em',
      color: tinta,
      textWrap: 'balance',
    }}
  >
    {children}
  </h2>
);

const fundo: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  // O open-slide liga "ss01" para a Geist; na Montserrat isso troca as letras pelas alternativas.
  fontFeatureSettings: 'normal',
  textWrap: 'pretty',
  fontSize: 'var(--osd-size-body)',
  lineHeight: 1.38,
  display: 'flex',
  flexDirection: 'column',
};

// Página padrão: olho, título, régua e o corpo centrado no espaço que sobra.
const Quadro = ({
  olho,
  titulo,
  tamanhoTitulo,
  foto,
  aoLado,
  children,
  gap = 32,
}: {
  olho?: ReactNode;
  titulo: ReactNode;
  tamanhoTitulo?: number;
  foto?: ReactNode;
  aoLado?: ReactNode;
  children: ReactNode;
  gap?: number;
}) => (
  <div style={{ ...fundo, padding: `84px ${foto ? LARGURA_FOTO + 80 : PADDING_X}px 120px ${PADDING_X}px` }}>
    {olho && <Olho>{olho}</Olho>}
    {aoLado ? (
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48 }}>
        <Titulo tamanho={tamanhoTitulo}>{titulo}</Titulo>
        <div style={{ flex: 'none' }}>{aoLado}</div>
      </div>
    ) : (
      <Titulo tamanho={tamanhoTitulo}>{titulo}</Titulo>
    )}
    <Regua />
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap }}>
      {children}
    </div>
    {foto}
    <Rodape comFoto={Boolean(foto)} />
  </div>
);

// Foto de canto a canto na metade direita, com o crédito sobre ela.
const FotoLado = ({ src, alt, credito, posicao = 'center' }: { src: string; alt: string; credito: ReactNode; posicao?: string }) => (
  <div style={{ position: 'absolute', top: 0, right: 0, width: LARGURA_FOTO, height: 1080 }}>
    <img src={src} alt={alt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: posicao }} />
    <p
      data-credito
      style={{
        position: 'absolute',
        right: 18,
        bottom: 16,
        maxWidth: 760,
        margin: 0,
        padding: '6px 14px',
        fontSize: 20,
        lineHeight: 1.3,
        color: branco,
        background: veu,
      }}
    >
      {credito}
    </p>
  </div>
);

// Captura do protótipo com moldura branca e sombra chapada do modelo (um bloco, não box-shadow, para sair no PDF).
// `recorte` é o trecho da imagem original, em pixels; `escala` amplia o trecho para ser lido na TV.
const Captura = ({
  src,
  alt,
  larguraImagem,
  recorte,
  escala,
}: {
  src: string;
  alt: string;
  larguraImagem: number;
  recorte: { x: number; y: number; largura: number; altura: number };
  escala: number;
}) => {
  const largura = Math.round(recorte.largura * escala);
  const altura = Math.round(recorte.altura * escala);
  return (
    <div data-captura style={{ position: 'relative', flex: 'none', width: largura + 16, height: altura + 16, marginRight: 16, marginBottom: 16 }}>
      <div style={{ position: 'absolute', left: 16, top: 16, width: largura + 16, height: altura + 16, background: tinta }} />
      <div style={{ position: 'relative', width: largura + 16, height: altura + 16, border: `8px solid ${branco}`, background: branco, overflow: 'hidden' }}>
        <img
          src={src}
          alt={alt}
          style={{
            position: 'absolute',
            display: 'block',
            maxWidth: 'none',
            width: larguraImagem * escala,
            left: -recorte.x * escala,
            top: -recorte.y * escala,
          }}
        />
      </div>
    </div>
  );
};

const Ilus = ({ nome, altura, style }: { nome: string; altura: number; style?: CSSProperties }) => {
  const src = ilustracao(nome);
  if (!src) return <div data-ilus-ausente style={{ height: altura, ...style }} aria-hidden="true" />;
  return <img data-ilus src={src} alt="" style={{ display: 'block', height: altura, width: '100%', objectFit: 'contain', ...style }} />;
};

const Painel = ({
  titulo,
  cor = design.palette.accent,
  children,
  style,
}: {
  titulo?: ReactNode;
  cor?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) => (
  <div data-caixa style={{ background: branco, color: tinta, padding: '26px 32px', fontSize: 32, lineHeight: 1.34, borderTop: `12px solid ${cor}`, ...style }}>
    {titulo && <h3 style={{ margin: '0 0 10px', fontSize: 32, lineHeight: 1.18, fontWeight: 800, color: violeta }}>{titulo}</h3>}
    {children}
  </div>
);

const Numero = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 800, color: azul, marginBottom: 8 }}>{children}</div>
);

const Frase = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <p style={{ margin: 0, fontSize: 38, lineHeight: 1.32, fontWeight: 600, ...style }}>{children}</p>
);

// Fonte de um número: em negrito, porque branco sobre o azul do modelo só passa de 3:1 como texto grande.
const Fonte = ({ children }: { children: ReactNode }) => (
  <p style={{ margin: 0, fontSize: 24, lineHeight: 1.35, fontWeight: 700 }}>{children}</p>
);

// Passo com ilustração do modelo em cima.
const Passo = ({
  ilus,
  alturaIlus = 170,
  titulo,
  children,
  tamanhoTitulo = 34,
}: {
  ilus: string;
  alturaIlus?: number;
  titulo: ReactNode;
  children?: ReactNode;
  tamanhoTitulo?: number;
}) => (
  <div data-caixa style={{ background: branco, color: tinta, padding: '28px 30px 32px', fontSize: 32, lineHeight: 1.3 }}>
    <Ilus nome={ilus} altura={alturaIlus} style={{ marginBottom: 20 }} />
    <b style={{ display: 'block', fontSize: tamanhoTitulo, lineHeight: 1.2, fontWeight: 800, color: azul, marginBottom: children ? 8 : 0, textAlign: children ? 'left' : 'center' }}>
      {titulo}
    </b>
    {children}
  </div>
);

// As três respostas da AgroParts, como placas nas cores do modelo.
const Placa = ({ cor, corTitulo, titulo, children }: { cor: string; corTitulo: string; titulo: ReactNode; children: ReactNode }) => (
  <div data-caixa style={{ background: branco, color: tinta, padding: '26px 30px', fontSize: 30, lineHeight: 1.3, borderTop: `16px solid ${cor}` }}>
    <b style={{ display: 'block', marginBottom: 8, fontSize: 38, lineHeight: 1.15, fontWeight: 800, color: corTitulo }}>{titulo}</b>
    {children}
  </div>
);

// Um cadastro de estoque, como etiqueta. O trecho que se repete fica em roxo.
const Etiqueta = ({ children }: { children: ReactNode }) => (
  <div data-caixa style={{ background: branco, color: tinta, padding: '20px 28px', fontSize: 34, fontWeight: 800, letterSpacing: '0.01em' }}>
    {children}
  </div>
);

const Marca = ({ children }: { children: ReactNode }) => <span style={{ color: roxo }}>{children}</span>;

const Nome = ({ children }: { children: ReactNode }) => <span style={{ whiteSpace: 'nowrap' }}>{children}</span>;

// Item de lista com o marcador quadrado do modelo: menta sobre o azul, roxo sobre o branco.
const Item = ({ children, marcador = roxo }: { children: ReactNode; marcador?: string }) => (
  <li style={{ display: 'flex', gap: '0.55em', margin: '0 0 16px' }}>
    <span aria-hidden="true" style={{ flex: 'none', width: '0.38em', height: '0.38em', marginTop: '0.5em', background: marcador }} />
    <span style={{ minWidth: 0 }}>{children}</span>
  </li>
);

const Lista = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <ul style={{ margin: 0, padding: 0, listStyle: 'none', ...style }}>{children}</ul>
);

const Link = ({ tamanho = 40 }: { tamanho?: number }) => (
  <a
    href="https://agroparts.pages.dev/"
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'inline-block', padding: '6px 20px', fontSize: tamanho, fontWeight: 800, color: tinta, background: design.palette.accent, textDecoration: 'none' }}
  >
    agroparts.pages.dev
  </a>
);

const Grade = ({ colunas, gap = 28, children, style }: { colunas: number; gap?: number; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))`, gap, ...style }}>{children}</div>
);

const Chave = () => (
  <Ilus nome="chave-branca-canto" altura={373} style={{ position: 'absolute', left: 49, top: 707, width: 155 }} />
);

const Chaves = ({ children }: { children: ReactNode }) => (
  <>
    <span style={{ color: design.palette.accent, fontWeight: 300 }}>{'{'}</span> {children}{' '}
    <span style={{ color: design.palette.accent, fontWeight: 300 }}>{'}'}</span>
  </>
);

// ---------- Páginas ----------

const Abertura: Page = () => (
  <div style={{ ...fundo, padding: `84px ${640 + 80}px 120px 250px`, justifyContent: 'center' }}>
    <Chave />
    <Olho>
      Rota Inova UEMG 2026 · Desafio AGR08
      <br />
      Eficiência na Gestão de Peças
    </Olho>
    <h1 style={{ margin: '10px 0 26px', fontFamily: 'var(--osd-font-display)', fontSize: 'var(--osd-size-hero)', lineHeight: 1.05, fontWeight: 800, color: tinta }}>
      <Chaves>AgroParts</Chaves>
    </h1>
    <p style={{ margin: 0, fontSize: 50, fontWeight: 700, lineHeight: 1.24 }}>Antes de comprar, saber se a peça já está no estoque.</p>
    <Regua />
    <p style={{ margin: '0 0 12px', fontSize: 28, lineHeight: 1.45, fontWeight: 700 }}>
      Allana Eduarda Braga Iquegami
      <br />
      Gabrielle Henrique Arruda Longo
      <br />
      Alberto Gabriel Rodrigues Bispo
      <br />
      Davi de Sousa Almeida
      <br />
      Myke Matos dos Santos
    </p>
    <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: tinta }}>Sistemas de Informação · UEMG Frutal</p>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 640, height: 1080 }}>
      <img src={fotoRolamento} alt="Rolamento de esferas com tampas de metal" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }} />
      <p data-credito style={{ position: 'absolute', right: 18, bottom: 16, margin: 0, padding: '6px 14px', fontSize: 20, lineHeight: 1.3, color: branco, background: veu }}>
        Foto: R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0
      </p>
    </div>
    <Rodape comChave larguraFoto={640} />
  </div>
);

const VariosNomes: Page = () => (
  <Quadro
    olho="O problema"
    titulo="A mesma peça tem vários nomes no estoque"
    tamanhoTitulo={66}
    gap={22}
    foto={<FotoLado src={fotoEstoque} alt="Depósito cheio de peças de máquina" credito={<>Foto: Ikiwaner, Wikimedia Commons, <Nome>CC BY-SA 3.0</Nome></>} />}
  >
    <Etiqueta>
      ROL <Marca>6318</Marca> ZZ C3
    </Etiqueta>
    <Etiqueta>
      ROLAMENTO RIG. ESFERAS <Marca>6318</Marca>-2Z/C3
    </Etiqueta>
    <Etiqueta>
      ROLAM <Marca>6318</Marca>ZZC3 P/ BOMBA
    </Etiqueta>
    <Frase style={{ marginTop: 16 }}>É a mesma peça? Ninguém tem certeza.</Frase>
  </Quadro>
);

const MuitosJeitos: Page = () => (
  <Quadro olho="O problema" titulo="E a peça chega de muitos jeitos" gap={26}>
    <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
      <Grade colunas={2} gap={24} style={{ flex: 1, minWidth: 0 }}>
        <Painel titulo="Código do fabricante">6318-2Z/C3</Painel>
        <Painel titulo="Código da usina">Cadastro 100234</Painel>
        <Painel titulo="Descrição curta">ROL 6318 ZZ C3</Painel>
        <Painel titulo="Nome do dia a dia" cor={roxo}>
          “o rolamento da bomba”
        </Painel>
        <Painel titulo="Outra marca" cor={roxo}>
          Parece a mesma. Uma pessoa confere.
        </Painel>
        <Painel titulo="Foto da etiqueta" cor={roxo}>
          Tirada no almoxarifado
        </Painel>
      </Grade>
      <Captura
        src={telaEtiqueta}
        alt="Etiqueta de rolamento 6318ZZ C3, como o protótipo mostra"
        larguraImagem={1102}
        recorte={{ x: 18, y: 188, largura: 432, altura: 212 }}
        escala={1.3}
      />
    </div>
    <Frase>A AgroParts aceita o código, a descrição ou a foto da etiqueta. Ninguém precisa fotografar peça por peça.</Frase>
    <Fonte>Exemplo ilustrativo, com etiqueta montada pela equipe. Não vem de uma usina real.</Fonte>
  </Quadro>
);

const PorQueImporta: Page = () => (
  <Quadro
    olho="Por que importa"
    titulo="Manutenção custa caro e a safra não espera"
    tamanhoTitulo={66}
    gap={20}
    foto={<FotoLado src={fotoUsina} alt="Usina de açúcar e álcool perto de Uberaba" credito={<>Usina perto de Uberaba (MG). Foto: Jonathan Wilkins, Wikimedia Commons, <Nome>CC BY-SA 3.0</Nome></>} />}
  >
    <Painel titulo="No setor da cana" style={{ padding: '22px 32px' }}>
      <Numero>R$ 1,25 bi</Numero>
      investidos em manutenção pela São Martinho em <Nome>9 meses</Nome> da safra 2025/26
    </Painel>
    <Painel titulo="Em outro setor" cor={roxo} style={{ padding: '22px 32px' }}>
      <Numero>16%</Numero>
      menos peças na prateleira do que o sistema dizia, num órgão de energia dos EUA
    </Painel>
    <Fonte>
      Fontes: São Martinho (02/2026) · <Nome>Departamento de Energia dos EUA (2024).</Nome>
    </Fonte>
  </Quadro>
);

const ComoEHoje: Page = () => (
  <Quadro olho="Como é hoje" titulo="Hoje, quem sabe é uma pessoa">
    <Grade colunas={2} gap={48}>
      <Passo ilus="pessoa-no-computador" alturaIlus={300} titulo="Perguntar a quem conhece o estoque" tamanhoTitulo={36}>
        A resposta fica na cabeça de uma pessoa.
      </Passo>
      <Passo ilus="livro" alturaIlus={300} titulo="Fazer um mutirão na lista" tamanhoTitulo={36}>
        Demora, e depois a bagunça volta.
      </Passo>
    </Grade>
  </Quadro>
);

const Solucao: Page = () => (
  <Quadro olho="A solução" titulo="A AgroParts confere a peça e responde" gap={28}>
    <Grade colunas={3}>
      <Passo ilus="celular" alturaIlus={120} titulo="1. Código ou foto" />
      <Passo ilus="busca" alturaIlus={120} titulo="2. Busca no catálogo" />
      <Passo ilus="janelas" alturaIlus={120} titulo="3. Compara as medidas" />
    </Grade>
    <Frase>A resposta é sempre uma destas três:</Frase>
    <Grade colunas={3}>
      <Placa cor={design.palette.accent} corTitulo={verdeEscuro} titulo="É a mesma peça">
        Mesmo código e mesmas medidas.
      </Placa>
      <Placa cor={lavanda} corTitulo={violeta} titulo="Precisa de uma pessoa">
        Falta informação. Uma pessoa decide.
      </Placa>
      <Placa cor={roxo} corTitulo={roxo} titulo="Parece, mas não é">
        Uma medida ou proteção diferente.
      </Placa>
    </Grade>
  </Quadro>
);

const Funcionando: Page = () => (
  <Quadro olho="Funcionando" titulo="O protótipo já está no ar" aoLado={<Link />}>
    <div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
      <Captura
        src={telaParecida}
        alt="Protótipo acha a mesma peça e recusa sete parecidas, com a diferença de cada uma"
        larguraImagem={1086}
        recorte={{ x: 0, y: 392, largura: 720, altura: 398 }}
        escala={1.26}
      />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Painel>
          <Numero>90 de 90</Numero>
          peças parecidas, mas diferentes, recusadas no teste da equipe
        </Painel>
        <Painel cor={roxo}>
          <Numero>396</Numero>
          cadastros lidos de uma vez, com 28 grupos de repetidos
        </Painel>
        <Fonte>Teste com o catálogo público de materiais do governo federal.</Fonte>
      </div>
    </div>
  </Quadro>
);

const PorQueConfiar: Page = () => (
  <Quadro olho="Por que confiar" titulo="Na dúvida, a AgroParts não arrisca: chama uma pessoa">
    <Grade colunas={3}>
      <Passo ilus="livro" titulo="Mostra a prova">
        Cada resposta diz de onde veio.
      </Passo>
      <Passo ilus="janelas" titulo="Não apaga nada">
        O sistema da usina continua igual.
      </Passo>
      <Passo ilus="lampada" titulo="Meta: errar pouco">
        Menos de 1 erro em 100 respostas automáticas.
      </Passo>
    </Grade>
  </Quadro>
);

const Mercado: Page = () => (
  <Quadro olho="Mercado" titulo="Lá fora, isso já é negócio. No agro, em português, não achamos" gap={30}>
    <Grade colunas={4}>
      <Painel titulo="Verusen" cor={lavanda}>
        Estados Unidos
      </Painel>
      <Painel titulo="SAP" cor={lavanda}>
        Alemanha
      </Painel>
      <Painel titulo="IBM" cor={lavanda}>
        Estados Unidos
      </Painel>
      <Painel titulo="Agro brasileiro" cor={roxo}>
        Não achamos uma solução feita para isso. É o espaço da AgroParts.
      </Painel>
    </Grade>
    <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Frase>Essas empresas já vendem soluções para organizar listas de peças. Nenhuma delas é feita para usinas, em português.</Frase>
        <Fonte>Fontes: sites das empresas, consultados em 25/08/2026.</Fonte>
      </div>
      <Ilus nome="notebook" altura={230} style={{ width: 320, flex: 'none' }} />
    </div>
  </Quadro>
);

const CabecaPainel = ({ ilus, children }: { ilus: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18, minHeight: 96 }}>
    <Ilus nome={ilus} altura={96} style={{ width: 120, flex: 'none' }} />
    <h3 style={{ margin: 0, fontSize: 32, lineHeight: 1.18, fontWeight: 800, color: violeta }}>{children}</h3>
  </div>
);

const Visao: Page = () => (
  <Quadro olho="Visão · Desafio AGR08" titulo="O que já funciona e o que vem depois">
    <Grade colunas={2} gap={48} style={{ alignItems: 'stretch' }}>
      <Painel style={{ fontSize: 30 }}>
        <CabecaPainel ilus="notebook">Já funciona no protótipo, com rolamentos</CabecaPainel>
        <Lista>
          <Item>Acha o rolamento pelo código, pela descrição ou pela foto da etiqueta</Item>
          <Item>Encontra cadastros repetidos numa lista pública</Item>
          <Item>Recusa o rolamento parecido que não é igual</Item>
        </Lista>
      </Painel>
      <Painel cor={roxo} style={{ fontSize: 30 }}>
        <CabecaPainel ilus="lampada">Próximos passos: ainda não faz</CabecaPainel>
        <Lista>
          <Item>Usar o catálogo do fabricante, com licença</Item>
          <Item>Passar a resposta ao sistema da usina, que faz o pedido de compra</Item>
          <Item>Responder a outros sistemas e a assistentes de IA</Item>
          <Item>Atender outras peças, como bombas e vedações</Item>
        </Lista>
      </Painel>
    </Grade>
  </Quadro>
);

const Equipe: Page = () => (
  <Quadro olho="A equipe" titulo="Cinco estudantes de Sistemas de Informação da UEMG Frutal" gap={30}>
    <Grade colunas={3}>
      <Passo ilus="notebook-grande" alturaIlus={150} titulo="Já temos experiência">
        Um de nós já criou soluções assim para clientes de móveis e de automóveis.
      </Passo>
      <Passo ilus="livro" alturaIlus={150} titulo="Usamos dados públicos">
        Assim o protótipo saiu sem esperar o acesso a uma empresa.
      </Passo>
      <Passo ilus="tomada" alturaIlus={150} titulo="Queremos o agro">
        Viemos ao Rota Inova para conhecer usinas e testar com elas.
      </Passo>
    </Grade>
    <p style={{ margin: 0, fontSize: 28, lineHeight: 1.45, fontWeight: 700 }}>
      <Nome>Allana Eduarda Braga Iquegami</Nome> · <Nome>Gabrielle Henrique Arruda Longo</Nome> · <Nome>Alberto Gabriel Rodrigues Bispo</Nome>
      <br />
      <Nome>Davi de Sousa Almeida</Nome> · <Nome>Myke Matos dos Santos</Nome>
    </p>
  </Quadro>
);

const ProximoPasso: Page = () => (
  <Quadro
    olho="Próximo passo"
    titulo="Um teste com uma usina de verdade"
    tamanhoTitulo={66}
    gap={28}
    foto={<FotoLado src={fotoColheita} alt="Colheita mecanizada de cana" credito={<>Colheita em Piracicaba (SP). Foto: Mariordo, Wikimedia Commons, <Nome>CC BY 3.0</Nome></>} />}
  >
    <Painel>
      <Numero>1 usina</Numero>e 1 tipo de peça
    </Painel>
    <Painel cor={roxo}>
      <Numero>10 a 50 peças</Numero>
      reais, conferidas antes e depois
    </Painel>
    <Frase>Vamos medir quanto tempo se leva para achar a peça, antes e depois.</Frase>
  </Quadro>
);

const Pedido: Page = () => (
  <div style={{ ...fundo, padding: `84px 620px 120px 250px`, justifyContent: 'center' }}>
    <Chave />
    <Olho>O que pedimos</Olho>
    <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 92, lineHeight: 1.08, fontWeight: 800, color: branco }}>Procuramos uma usina parceira</h2>
    <Regua />
    <Lista style={{ fontSize: 46, lineHeight: 1.3, fontWeight: 700, color: tinta }}>
      <Item marcador={design.palette.accent}>A lista de um tipo de peça</Item>
      <Item marcador={design.palette.accent}>Uma pessoa do almoxarifado para conferir as respostas</Item>
    </Lista>
    <div style={{ margin: '40px 0 0', display: 'flex', alignItems: 'center', gap: 32 }}>
      <Link tamanho={36} />
      <p style={{ margin: 0, fontSize: 28, lineHeight: 1.4, fontWeight: 700 }}>
        Equipe AgroParts
        <br />
        Sistemas de Informação, UEMG Frutal
      </p>
    </div>
    <Ilus nome="aviao" altura={460} style={{ position: 'absolute', right: 110, top: 300, width: 460 }} />
    <Rodape comChave />
  </div>
);

const ItemFonte = ({ children }: { children: ReactNode }) => (
  <Item>
    <span style={{ fontSize: 24, lineHeight: 1.35 }}>{children}</span>
  </Item>
);

const CabecaFonte = ({ children }: { children: ReactNode }) => (
  <h3 style={{ margin: '0 0 18px', fontSize: 30, fontWeight: 800, color: violeta }}>{children}</h3>
);

const FontesECreditos: Page = () => (
  <Quadro olho="Fontes e créditos" titulo="De onde vêm os números, as fotos e as ilustrações" tamanhoTitulo={52}>
    <Grade colunas={2} gap={40}>
      <Painel style={{ fontSize: 24 }}>
        <CabecaFonte>Números</CabecaFonte>
        <Lista>
          <ItemFonte>São Martinho, resultados do 3º trimestre da safra 2025/26, 09/02/2026: ri.saomartinho.com.br</ItemFonte>
          <ItemFonte>Departamento de Energia dos EUA, auditoria <Nome>DOE-OIG-24-30</Nome> da Western Area Power Administration, 24/09/2024: energy.gov</ItemFonte>
          <ItemFonte>Verusen, SAP e IBM: verusen.com, learning.sap.com, ibm.com/docs, consultados em 25/08/2026</ItemFonte>
          <ItemFonte>Teste do protótipo: catálogo público de materiais do governo federal (CATMAT) e compras públicas, Compras.gov.br</ItemFonte>
          <ItemFonte>Detalhes e cálculos: github.com/shishiv/agroparts</ItemFonte>
        </Lista>
      </Painel>
      <Painel cor={roxo} style={{ fontSize: 24 }}>
        <CabecaFonte>Fotos e ilustrações</CabecaFonte>
        <Lista>
          <ItemFonte>Rolamento com tampas de metal: R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0. Foto recortada.</ItemFonte>
          <ItemFonte>Depósito de peças: Ikiwaner, Wikimedia Commons, <Nome>CC BY-SA 3.0</Nome>. Foto recortada.</ItemFonte>
          <ItemFonte>Usina perto de Uberaba (MG): Jonathan Wilkins, Wikimedia Commons, <Nome>CC BY-SA 3.0</Nome>. Foto recortada.</ItemFonte>
          <ItemFonte>Colheita em Piracicaba (SP): Mariordo (Mario Roberto Duran Ortiz), Wikimedia Commons, CC BY 3.0. Foto recortada.</ItemFonte>
          <ItemFonte>Telas do protótipo: equipe AgroParts, 09/10/2026. Ilustrações: modelo do Canva da equipe.</ItemFonte>
          <ItemFonte>
            Licenças: <Nome>creativecommons.org/licenses/by/3.0</Nome>, <Nome>/by/4.0</Nome> e <Nome>/by-sa/3.0</Nome>
          </ItemFonte>
        </Lista>
      </Painel>
    </Grade>
  </Quadro>
);

// ---------- Roteiro (modo apresentador) ----------

export const notes: (string | undefined)[] = [
  `0:00 · Boa tarde. Somos a AgroParts, do curso de Sistemas de Informação da UEMG Frutal, no desafio AGR08, Eficiência na Gestão de Peças.
A nossa ideia é simples: antes de comprar uma peça, saber se ela já está no estoque.
Nos próximos minutos, vamos mostrar o problema, o protótipo funcionando e o que pedimos a vocês.`,
  `0:25 · Olhem estes três nomes. São do mesmo rolamento?
Numa usina, cada pessoa cadastra a peça do seu jeito. Com o tempo, a mesma peça ganha vários nomes, e ninguém tem certeza do que já tem na prateleira.
Na dúvida, a pessoa compra de novo.`,
  `0:45 · E não é só o nome. A peça chega como código do fabricante, código da usina, descrição curta, nome do dia a dia, outra marca ou foto da etiqueta.
Cada fabricante organiza o catálogo do seu jeito.
A AgroParts aceita o código, a descrição ou a foto da etiqueta. Ninguém precisa fotografar peça por peça.
A etiqueta da tela foi montada pela equipe: é um exemplo, não uma foto de usina.`,
  `1:20 · Isso pesa. Só a São Martinho gastou mais de 1,2 bilhão de reais com manutenção em nove meses de safra.
E uma auditoria nos Estados Unidos, numa empresa de energia, achou 16% menos peças na prateleira do que o sistema dizia.
Quando a lista não bate, a peça falta na hora errada, e na safra a máquina parada não pode esperar.`,
  `1:45 · Hoje, quem resolve é a pessoa que conhece o estoque. A resposta fica na cabeça dela.
Quando a lista cresce demais, a usina faz um mutirão para arrumar o cadastro. Demora, e depois de um tempo a bagunça volta.`,
  `2:05 · A AgroParts resolve isso. A pessoa digita o código, cola a descrição ou fotografa a etiqueta.
A AgroParts procura a peça no catálogo, compara as medidas e responde com uma destas três:
é a mesma peça; precisa de uma pessoa para decidir; ou parece, mas não é.`,
  `2:35 · Isto não é maquete: o site está no ar, em agroparts.pages.dev.
[Abra "Exemplos da apresentação" e o caso 2, "Parece, mas não é". Aperte "Rodar no protótipo".]
O código 317388 é um rolamento 6211 com blindagem nos dois lados. A AgroParts acha a mesma peça com outro código, o 472510.
E embaixo estão sete cadastros com nome quase igual. A AgroParts recusa todos e mostra a diferença de cada um: muda a proteção, a folga ou as duas.
No nosso teste, 90 de 90 peças parecidas foram recusadas.
[Volte aos exemplos e abra o caso 4, "A lista inteira de uma vez".]
Agora a lista inteira: 396 cadastros de rolamento do catálogo público do governo, lidos em poucos segundos. O protótipo achou 28 grupos de cadastros duplicados.
A lista é pública. Não vem de uma usina.
Se o site falhar, fique nesta página: a tela é uma captura do caso 2, e os números da direita são os dos dois casos.`,
  `4:00 · Por que confiar? Porque, na dúvida, a AgroParts não arrisca: chama uma pessoa.
Cada resposta mostra de onde veio, e nada é apagado do sistema da usina.
Quando uma pessoa decide, a decisão fica registrada ao lado da resposta do sistema.
A meta é errar menos de uma vez em cada cem respostas automáticas.`,
  `4:25 · Esse mercado existe. Lá fora, empresas como a Verusen, a SAP e a IBM já vendem soluções para organizar listas de peças.
Para o agro brasileiro, em português, ainda não existe. É esse o espaço da AgroParts.`,
  `4:45 · O desafio AGR08 pede mais, e sabemos o que falta.
Hoje, com rolamentos, a AgroParts já acha a peça pelo código, pela descrição ou pela foto, encontra cadastros repetidos e recusa a parecida.
Depois vêm o catálogo do fabricante, com licença, e outras peças, como bombas e vedações.
E a resposta vai para o sistema da usina, que faz o pedido de compra.`,
  `5:15 · Somos cinco estudantes de Sistemas de Informação. Um de nós já criou soluções assim para clientes de móveis e de automóveis.
Começamos com dados públicos para não esperar uma empresa. Agora queremos testar no agro.`,
  `5:30 · O próximo passo é um teste com uma usina de verdade: um tipo de peça, de 10 a 50 peças reais.
Vamos medir quanto tempo se leva para achar a peça, antes e depois.
Não prometa economia: ainda não há teste com usina.`,
  `5:45 · Para isso, procuramos uma usina parceira, que nos mostre a lista de um tipo de peça e indique uma pessoa do almoxarifado para conferir as respostas.
Obrigado.
(Cerca de 6 minutos em fala calma, dentro do limite de 5 a 7 minutos. Se o tempo apertar, pule o caso 4 da demonstração: fica em pouco mais de 5 minutos.)`,
  `Página de apoio: não precisa falar. Mostre só se perguntarem de onde vêm os números. Nas perguntas, volte à página 13.
Versão de 30 segundos, se pedirem um resumo:
Numa usina, a mesma peça aparece com vários nomes no estoque. Ninguém sabe se ela já está na prateleira.
A AgroParts confere o código e as medidas e responde: é a mesma peça, não é, ou precisa de uma pessoa.
O protótipo já está no ar em agroparts.pages.dev. Agora procuramos uma usina parceira para testar.`,
];

export const meta: SlideMeta = {
  title: 'AgroParts · Pitch Rota Inova UEMG 2026',
  createdAt: '2026-10-22T18:50:00.123Z',
};

export default [
  Abertura,
  VariosNomes,
  MuitosJeitos,
  PorQueImporta,
  ComoEHoje,
  Solucao,
  Funcionando,
  PorQueConfiar,
  Mercado,
  Visao,
  Equipe,
  ProximoPasso,
  Pedido,
  FontesECreditos,
] satisfies Page[];
