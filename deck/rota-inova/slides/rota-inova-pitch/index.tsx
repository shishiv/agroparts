// Pitch final da AgroParts no Rota Inova UEMG 2026 (desafio AGR08), no visual do modelo do Canva da equipe.
// Três atos: a dor (uma persona e o custo da manutenção da safra), a solução (o protótipo ao vivo) e os números
// (o retorno estimado, o modelo de negócio e o mercado). A última página traz as fontes e os créditos.
// O roteiro, de pouco mais de 5 minutos (o limite é 6), fica no export `notes`, que o modo apresentador mostra.
import { type DesignSystem, type Page, type SlideMeta, useIsActivePage, useSlidePageNumber } from '@open-slide/core';
import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';

import fotoColheita from './assets/fotos/colheita-piracicaba.jpg';
import fotoRolamento from './assets/fotos/rolamento-com-tampa-6007.jpg';
import qrAgroparts from './assets/qr-agroparts.svg';
import fonteBold from './assets/fontes/Montserrat-Bold.ttf';
import fonteExtraBold from './assets/fontes/Montserrat-ExtraBold.ttf';
import fonteItalic from './assets/fontes/Montserrat-Italic.ttf';
import fonteLight from './assets/fontes/Montserrat-Light.ttf';
import fonteRegular from './assets/fontes/Montserrat-Regular.ttf';
import fonteSemiBold from './assets/fontes/Montserrat-SemiBold.ttf';
import telaParecida from './assets/telas/desktop-02-falsa-semelhanca.jpg';
import demoCapa from './assets/video/demo-celular-capa.jpg';
import demoCelular from './assets/video/demo-celular.mp4';

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
// `margemDireita` reserva a faixa da direita para uma foto ou para o celular da demonstração.
const Quadro = ({
  olho,
  titulo,
  tamanhoTitulo,
  foto,
  margemDireita,
  aoLado,
  children,
  gap = 32,
}: {
  olho?: ReactNode;
  titulo: ReactNode;
  tamanhoTitulo?: number;
  foto?: ReactNode;
  margemDireita?: number;
  aoLado?: ReactNode;
  children: ReactNode;
  gap?: number;
}) => (
  <div style={{ ...fundo, padding: `84px ${margemDireita ?? (foto ? LARGURA_FOTO + 80 : PADDING_X)}px 120px ${PADDING_X}px` }}>
    {olho && <Olho>{olho}</Olho>}
    <Titulo tamanho={tamanhoTitulo}>{titulo}</Titulo>
    {aoLado && <div style={{ position: 'absolute', top: 84, right: PADDING_X }}>{aoLado}</div>}
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

// Moldura branca com a sombra chapada do modelo (um bloco, não box-shadow, para sair no PDF).
const Moldura = ({ largura, altura, children }: { largura: number; altura: number; children: ReactNode }) => (
  <div data-captura style={{ position: 'relative', flex: 'none', width: largura + 16, height: altura + 16, marginRight: 16, marginBottom: 16 }}>
    <div style={{ position: 'absolute', left: 16, top: 16, width: largura + 16, height: altura + 16, background: tinta }} />
    <div style={{ position: 'relative', width: largura + 16, height: altura + 16, border: `8px solid ${branco}`, background: branco, overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);

// Captura do protótipo. `recorte` é o trecho da imagem original, em pixels; `escala` amplia o trecho para ser lido na TV.
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
}) => (
  <Moldura largura={Math.round(recorte.largura * escala)} altura={Math.round(recorte.altura * escala)}>
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
  </Moldura>
);

// Gravação de 31 s do protótipo publicado, recortada na coluna do celular.
// Roda sozinha e em loop enquanto a página está na tela; no PDF, fica a capa, que é o resultado do código 311960
// com o pé esmaecido, para não mostrar uma linha cortada.
const DemoGravada = ({ altura }: { altura: number }) => {
  const ativa = useIsActivePage();
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (ativa) {
      v.currentTime = 0;
      v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [ativa]);
  return (
    <Moldura largura={altura / 2} altura={altura}>
      <video
        ref={video}
        src={demoCelular}
        poster={demoCapa}
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Gravação do protótipo: o código 311960 é identificado como rolamento 6318, e o cadastro 311963 aparece como a mesma peça"
        style={{ display: 'block', width: altura / 2, height: altura }}
      />
    </Moldura>
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

// Selo que diz de onde vem um número: dado publicado, estimativa ou hipótese.
const Selo = ({ children, cor, corTexto = tinta }: { children: ReactNode; cor: string; corTexto?: string }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 14px',
      fontSize: 24,
      lineHeight: 1.3,
      fontWeight: 800,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: corTexto,
      background: cor,
    }}
  >
    {children}
  </span>
);

const SeloDado = () => <Selo cor={design.palette.accent}>Dado publicado</Selo>;
const SeloEstimativa = () => <Selo cor={lavanda}>Estimativa</Selo>;
const SeloHipotese = () => (
  <Selo cor={roxo} corTexto={branco}>
    Hipótese
  </Selo>
);

// Uma linha de uma conta: selo e valor à esquerda, o que o valor quer dizer à direita.
const Linha = ({ selo, valor, cor, children }: { selo: ReactNode; valor: ReactNode; cor: string; children: ReactNode }) => (
  <div data-caixa style={{ display: 'flex', alignItems: 'center', gap: 40, background: branco, color: tinta, padding: '16px 32px', borderLeft: `14px solid ${cor}` }}>
    <div style={{ flex: 'none', width: 500 }}>
      {selo}
      <div style={{ marginTop: 6, fontSize: 60, lineHeight: 1.05, fontWeight: 800, color: azul }}>{valor}</div>
    </div>
    <p style={{ margin: 0, minWidth: 0, fontSize: 32, lineHeight: 1.34 }}>{children}</p>
  </div>
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

// Um momento da cena da persona.
const Momento = ({ hora, children }: { hora: string; children: ReactNode }) => (
  <div data-caixa style={{ display: 'flex', alignItems: 'baseline', gap: 24, background: branco, color: tinta, padding: '20px 28px', fontSize: 32, lineHeight: 1.3, fontWeight: 600 }}>
    <b style={{ flex: 'none', fontWeight: 800, color: violeta }}>{hora}</b>
    <span style={{ minWidth: 0 }}>{children}</span>
  </div>
);

// Como um setor escreve a peça no cadastro. O trecho que se repete fica em roxo.
const Setor = ({ nome, children }: { nome: string; children: ReactNode }) => (
  <div data-caixa style={{ background: branco, color: tinta, padding: '24px 30px 28px' }}>
    <b style={{ display: 'block', marginBottom: 12, fontSize: 32, lineHeight: 1.2, fontWeight: 800, color: violeta }}>{nome}</b>
    <span style={{ fontSize: 34, lineHeight: 1.3, fontWeight: 800, letterSpacing: '0.01em' }}>{children}</span>
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

// QR code que abre https://agroparts.pages.dev/. Gerado localmente; o comando está no README do deck.
// A moldura branca completa a margem clara que o leitor precisa em volta do código.
const QrCode = ({ tamanho }: { tamanho: number }) => (
  <div style={{ flex: 'none', background: branco, padding: 10, width: tamanho, height: tamanho }}>
    <img src={qrAgroparts} alt="QR code que abre agroparts.pages.dev" style={{ display: 'block', width: '100%', height: '100%' }} />
  </div>
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

// ---------- Abertura ----------

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

// ---------- Ato 1: a dor ----------

const Personagem = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
    <Ilus nome="pessoa-no-computador" altura={110} style={{ width: 140, flex: 'none' }} />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
      <p style={{ margin: 0, fontSize: 36, lineHeight: 1.2, fontWeight: 800, color: tinta }}>Márcia, almoxarife numa usina do Triângulo Mineiro</p>
      <Selo cor={lavanda}>Personagem e cena ilustrativos</Selo>
    </div>
  </div>
);

const DiaDeSafra: Page = () => (
  <Quadro
    olho="Ato 1 · A dor"
    titulo={
      <>
        Dia de safra.
        <br />A colhedora parou.
      </>
    }
    tamanhoTitulo={66}
    gap={20}
    foto={<FotoLado src={fotoColheita} alt="Colheita mecanizada de cana" credito={<>Colheita em Piracicaba (SP). Foto: Mariordo, Wikimedia Commons, <Nome>CC BY 3.0</Nome></>} />}
  >
    <Personagem />
    <Momento hora="14h05">O mecânico pede um rolamento 6318.</Momento>
    <Momento hora="14h20">O sistema diz: essa peça não existe.</Momento>
    <Momento hora="14h40">A colhedora espera a compra urgente.</Momento>
    <Frase style={{ marginTop: 12, fontWeight: 800 }}>Na prateleira, havia três. Com outro nome.</Frase>
  </Quadro>
);

// Uma usina da região, com a estimativa do gasto de manutenção de entressafra por safra.
const Usina = ({ nome, valor, lugar, toneladas }: { nome: string; valor: string; lugar: string; toneladas: string }) => (
  <div data-caixa style={{ background: branco, color: tinta, padding: '16px 24px 18px', borderTop: `10px solid ${lavanda}` }}>
    <b style={{ display: 'block', fontSize: 28, lineHeight: 1.2, fontWeight: 800, color: violeta }}>{nome}</b>
    <div style={{ margin: '4px 0 4px', fontSize: 56, lineHeight: 1.1, fontWeight: 800, color: azul }}>{valor}</div>
    <span style={{ display: 'block', fontSize: 24, lineHeight: 1.3, fontWeight: 600 }}>{lugar}</span>
    <span style={{ display: 'block', fontSize: 24, lineHeight: 1.3, fontWeight: 600 }}>{toneladas}</span>
  </div>
);

const QuantoCusta: Page = () => (
  <Quadro olho="Ato 1 · A dor" titulo="Quanto custa a manutenção da safra" gap={18}>
    <Linha selo={<SeloDado />} valor="R$ 183,5 mi" cor={design.palette.accent}>
      em “Manutenção Entressafra/Outros” na São Martinho, <Nome>em 9 meses</Nome>. Dividido pelas 21,7 mi t moídas: <Nome>R$ 8,46 por tonelada</Nome>
    </Linha>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <SeloEstimativa />
      <span style={{ fontSize: 32, lineHeight: 1.3, fontWeight: 700 }}>Por safra, nas usinas da nossa região, contando só 9 meses de gasto:</span>
    </div>
    <Grade colunas={4} gap={24}>
      <Usina nome="Cerradão" valor="R$ 53 mi" lugar="Frutal" toneladas="6,3 mi t moídas" />
      <Usina nome="CMAA" valor="R$ 85 mi" lugar="3 usinas no Triângulo" toneladas="10 mi t de capacidade" />
      <Usina nome="Usina Uberaba" valor="R$ 27 mi" lugar="Uberaba" toneladas="3,2 mi t de capacidade" />
      <Usina nome="Coruripe" valor="R$ 21 mi" lugar="Limeira do Oeste" toneladas="2,5 mi t de capacidade" />
    </Grade>
    <Linha selo={<SeloHipotese />} valor="R$ 530 mil" cor={roxo}>
      por safra, numa usina como a Cerradão, se 1 real em cada 100 for para peça que já estava na prateleira
    </Linha>
    <Fonte>Fontes: São Martinho (02/2026), Rabobank (2025), Globo Rural (04/2025), site da Usina Uberaba (10/2026), Broadcast Agro (03/2024).</Fonte>
  </Quadro>
);

const ComoEHoje: Page = () => (
  <Quadro olho="Ato 1 · A dor" titulo="Hoje é manual, no almoxarifado. Mas cada setor cadastra do seu jeito" gap={26}>
    <Grade colunas={3}>
      <Setor nome="Manutenção">
        ROL <Marca>6318</Marca> ZZ C3
      </Setor>
      <Setor nome="Compras">
        ROLAMENTO RIG. ESFERAS <Marca>6318</Marca>-2Z/C3
      </Setor>
      <Setor nome="Almoxarifado">
        ROLAM <Marca>6318</Marca>ZZC3 P/ BOMBA
      </Setor>
    </Grade>
    <Frase style={{ fontWeight: 800 }}>É a mesma peça. O sistema enxerga três.</Frase>
    <Painel cor={roxo} style={{ display: 'flex', alignItems: 'center', gap: 36, padding: '20px 32px' }}>
      <div style={{ flex: 'none', fontSize: 72, lineHeight: 1.05, fontWeight: 800, color: azul }}>16%</div>
      <span>menos peças na prateleira do que o sistema dizia, numa auditoria de energia nos EUA</span>
    </Painel>
    <Fonte>Fonte: Departamento de Energia dos EUA, auditoria <Nome>DOE-OIG-24-30</Nome> (09/2024).</Fonte>
  </Quadro>
);

// ---------- Ato 2: a solução ----------

const Solucao: Page = () => (
  <Quadro olho="Ato 2 · A solução" titulo="A AgroParts confere a peça e responde" gap={28}>
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

const CadaSetor: Page = () => (
  <Quadro olho="Ato 2 · A solução" titulo="Um ganho para cada setor" gap={30}>
    <Grade colunas={3} gap={36}>
      <Passo ilus="celular" alturaIlus={190} titulo="Almoxarifado" tamanhoTitulo={38}>
        Acha a peça pelo código, pela descrição ou pela foto da etiqueta.
      </Passo>
      <Passo ilus="lampada" alturaIlus={190} titulo="Manutenção" tamanhoTitulo={38}>
        Sabe na hora se a peça já está na prateleira.
      </Passo>
      <Passo ilus="notebook" alturaIlus={190} titulo="Compras" tamanhoTitulo={38}>
        Vê o cadastro repetido antes de comprar de novo.
      </Passo>
    </Grade>
    <Frase style={{ fontWeight: 800 }}>O sistema da usina continua igual. Nenhum cadastro é apagado.</Frase>
  </Quadro>
);

// O celular da demonstração ocupa a faixa da direita, de cima a baixo do corpo da página.
const ALTURA_CELULAR = 830;
const MARGEM_CELULAR = PADDING_X + ALTURA_CELULAR / 2 + 32 + 80;

const AoVivo: Page = () => (
  <Quadro olho="Ato 2 · Ao vivo" titulo="Escaneiem o QR e toquem Identificar" tamanhoTitulo={66} margemDireita={MARGEM_CELULAR} gap={34}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      <QrCode tamanho={300} />
      <Link tamanho={36} />
    </div>
    <Frase>
      O código 311960 é o rolamento 6318 da Márcia. Logo embaixo, o 311963: <b style={{ fontWeight: 800 }}>a mesma peça, com outro código.</b>
    </Frase>
    <div style={{ position: 'absolute', top: 84, right: PADDING_X }}>
      <DemoGravada altura={ALTURA_CELULAR} />
    </div>
  </Quadro>
);

const Prova: Page = () => (
  <Quadro olho="Ato 2 · A prova" titulo="O que o protótipo já provou">
    <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
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
          peças parecidas, mas diferentes, recusadas
        </Painel>
        <Painel cor={roxo}>
          <Numero>28 grupos</Numero>
          de cadastros repetidos em 396 cadastros, lidos de uma vez
        </Painel>
        <Fonte>Teste da equipe, com gabarito registrado antes, no catálogo público de materiais do governo federal (CATMAT), 10/2026. Não é cadastro de usina.</Fonte>
      </div>
    </div>
  </Quadro>
);

// ---------- Ato 3: os números ----------

// Um termo da conta do retorno, em coluna: o valor em cima e o que ele é embaixo.
const Termo = ({ valor, children, total = false }: { valor: string; children: ReactNode; total?: boolean }) => (
  <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6 }}>
    <span style={{ fontSize: total ? 56 : 48, lineHeight: '64px', fontWeight: 800, color: total ? violeta : azul, whiteSpace: 'nowrap' }}>{valor}</span>
    <span style={{ fontSize: 24, lineHeight: 1.3, fontWeight: 600, whiteSpace: 'nowrap' }}>{children}</span>
  </div>
);

const Operador = ({ children }: { children: string }) => (
  <span aria-hidden="true" style={{ flex: 'none', alignSelf: 'flex-start', fontSize: 48, lineHeight: '64px', fontWeight: 800, color: violeta }}>
    {children}
  </span>
);

const Retorno: Page = () => (
  <Quadro olho="Ato 3 · Os números" titulo="Quanto a usina ganha com a AgroParts" gap={26}>
    <Painel titulo="Cenário conservador: a menor usina da tabela, 2,5 mi t" cor={roxo}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 30, marginTop: 10 }}>
        <Termo valor="R$ 21 mi">
          manutenção por
          <br />
          safra (estimativa)
        </Termo>
        <Operador>×</Operador>
        <Termo valor="1%">
          peça repetida
          <br />
          (hipótese)
        </Termo>
        <Operador>=</Operador>
        <Termo valor="R$ 210 mil">
          por ano
          <br />
          (uma safra)
        </Termo>
        <Operador>÷</Operador>
        <Termo valor="R$ 60 mil">
          preço por ano
          <br />
          (hipótese)
        </Termo>
        <Operador>=</Operador>
        <Termo valor="3,5 vezes" total>
          o que a usina
          <br />
          paga
        </Termo>
      </div>
    </Painel>
    <Linha selo={<Selo cor={lavanda}>Exemplo da região, o teto</Selo>} valor="8,8 vezes" cor={design.palette.accent}>
      numa usina como a Cerradão, de Frutal, com 6,3 mi t <Nome>(Rabobank, 2025)</Nome>: R$ 53 mi × 1% = R$ 530 mil ÷ R$ 60 mil
    </Linha>
    <Frase style={{ fontWeight: 800 }}>Mesmo na usina menor, a conta empata com 0,3%: R$ 60 mil ÷ R$ 21 mi.</Frase>
    <Fonte>Estimativa com premissas, não resultado medido. O gasto base é de 9 meses, então a conta fica por baixo. A usina de 2,5 mi t é a Coruripe, Limeira do Oeste (Broadcast Agro, 03/2024).</Fonte>
  </Quadro>
);

const ModeloDeNegocio: Page = () => (
  <Quadro olho="Ato 3 · Os números" titulo="Quem paga, quanto e por quê" gap={32}>
    <Grade colunas={3} gap={32} style={{ alignItems: 'stretch' }}>
      <Painel titulo="Quem paga">A usina, pelo orçamento de suprimentos e manutenção.</Painel>
      <Painel titulo="Quanto" cor={roxo}>
        <Numero>R$ 5 mil</Numero>
        <p style={{ margin: '0 0 16px' }}>por usina, por mês</p>
        <Selo cor={roxo} corTexto={branco}>
          Hipótese de preço
        </Selo>
      </Painel>
      <Painel titulo="Por quê" cor={lavanda}>
        O retorno estimado vai de 3,5 a 8,8 vezes o preço. E o sistema da usina continua igual.
      </Painel>
    </Grade>
    <Painel cor={design.palette.accent}>
      <span style={{ fontSize: 36, lineHeight: 1.3, fontWeight: 800 }}>Para começar: piloto de 90 dias, sem custo, para a primeira usina.</span>
    </Painel>
  </Quadro>
);

const Mercado: Page = () => (
  <Quadro olho="Ato 3 · Os números" titulo="O mercado e quem já faz isso" gap={28}>
    <Grade colunas={2} gap={40} style={{ alignItems: 'stretch' }}>
      <Painel titulo="Só no Centro-Sul">
        <div style={{ margin: '4px 0 14px' }}>
          <SeloEstimativa />
        </div>
        <Numero>R$ 15 mi</Numero>
        por ano: 250 usinas × R$ 60 mil
        <br />O preço é hipótese.
      </Painel>
      <Painel titulo="Concorrência" cor={roxo}>
        <p style={{ margin: '0 0 16px', fontSize: 46, lineHeight: 1.16, fontWeight: 800, color: tinta }}>Não encontramos nenhuma solução igual.</p>
        Lá fora, Verusen (EUA), SAP (Alemanha) e IBM (EUA) organizam listas de peças. Nenhuma é feita para usinas, em português.
      </Painel>
    </Grade>
    <Fonte>Fontes: UNICA (22/06/2026), unidades operando no Centro-Sul · sites da Verusen, SAP e IBM (25/08/2026).</Fonte>
  </Quadro>
);

const Pedido: Page = () => (
  <div style={{ ...fundo, padding: `84px 620px 120px 250px`, justifyContent: 'center' }}>
    <Chave />
    <Olho>Ato 3 · O que pedimos</Olho>
    <h2 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 92, lineHeight: 1.08, fontWeight: 800, color: branco }}>Procuramos uma usina parceira</h2>
    <Regua />
    <Lista style={{ fontSize: 42, lineHeight: 1.3, fontWeight: 700, color: tinta }}>
      <Item marcador={design.palette.accent}>Piloto de 90 dias, sem custo</Item>
      <Item marcador={design.palette.accent}>1 tipo de peça, de 10 a 50 peças reais</Item>
      <Item marcador={design.palette.accent}>Uma pessoa do almoxarifado para conferir</Item>
    </Lista>
    <div style={{ margin: '36px 0 0', display: 'flex', alignItems: 'center', gap: 36 }}>
      <QrCode tamanho={200} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
        <Link tamanho={36} />
        <p style={{ margin: 0, fontSize: 32, lineHeight: 1.35, fontWeight: 700 }}>
          Contato: myke.matos@gmail.com
          <br />
          agroparts.pages.dev/contato
        </p>
      </div>
    </div>
    <Ilus nome="aviao" altura={460} style={{ position: 'absolute', right: 110, top: 300, width: 460 }} />
    <Rodape comChave />
  </div>
);

// ---------- Fontes ----------

const ItemFonte = ({ children }: { children: ReactNode }) => (
  <Item>
    <span style={{ fontSize: 24, lineHeight: 1.35 }}>{children}</span>
  </Item>
);

const CabecaFonte = ({ children }: { children: ReactNode }) => (
  <h3 style={{ margin: '0 0 18px', fontSize: 30, fontWeight: 800, color: violeta }}>{children}</h3>
);

const FontesDosNumeros: Page = () => (
  <Quadro olho="Fontes" titulo="De onde vêm os números" tamanhoTitulo={52}>
    <Grade colunas={2} gap={40}>
      <Painel style={{ fontSize: 24 }}>
        <CabecaFonte>Ato 1 · A dor</CabecaFonte>
        <Lista>
          <ItemFonte>
            São Martinho, Resultados 3T26, 09/02/2026, p. 2 e 15: <Nome>21,7 mi t</Nome> moídas e <Nome>R$ 183,5 mi</Nome> em “Manutenção Entressafra/Outros” em 9 meses.
          </ItemFonte>
          <ItemFonte>Conta: <Nome>R$ 183,5 mi</Nome> ÷ <Nome>21,7 mi t</Nome> = <Nome>R$ 8,46</Nome> por tonelada. Cada usina: <Nome>R$ 8,46</Nome> × as toneladas dela.</ItemFonte>
          <ItemFonte>Cerradão: <Nome>6,3 mi t</Nome> moídas (Rabobank, 2025). CMAA: <Nome>10 mi t</Nome> de capacidade em 3 usinas (Globo Rural, 25/04/2025).</ItemFonte>
          <ItemFonte>
            Usina Uberaba: <Nome>3,2 mi t</Nome> de capacidade (site da empresa, 28/10/2026). Coruripe, Limeira do Oeste: <Nome>2,5 mi t</Nome> de capacidade (Broadcast Agro, 20/03/2024).
          </ItemFonte>
          <ItemFonte>Departamento de Energia dos EUA, auditoria <Nome>DOE-OIG-24-30</Nome>, 24/09/2024.</ItemFonte>
        </Lista>
      </Painel>
      <Painel cor={roxo} style={{ fontSize: 24 }}>
        <CabecaFonte>Atos 2 e 3 · A solução e os números</CabecaFonte>
        <Lista>
          <ItemFonte>Teste do protótipo: catálogo de materiais do governo federal (CATMAT), Compras.gov.br, 10/2026.</ItemFonte>
          <ItemFonte>Hipóteses: 1% de peça repetida e o preço de <Nome>R$ 5 mil</Nome> por usina por mês. O piloto mede o número real.</ItemFonte>
          <ItemFonte>Mercado: UNICA, 22/06/2026, 250 unidades operando no Centro-Sul. 250 × <Nome>R$ 60 mil</Nome> = <Nome>R$ 15 mi</Nome> por ano.</ItemFonte>
          <ItemFonte>Verusen, SAP e IBM: verusen.com, learning.sap.com e ibm.com/docs, consultados em 25/08/2026.</ItemFonte>
          <ItemFonte>Contas e links: github.com/shishiv/agroparts, em docs/pesquisa/numeros-do-pitch.md</ItemFonte>
        </Lista>
      </Painel>
    </Grade>
  </Quadro>
);

const Creditos: Page = () => (
  <Quadro olho="Créditos" titulo="Fotos, telas e ilustrações" tamanhoTitulo={52}>
    <Painel style={{ fontSize: 24 }}>
      <Lista>
        <ItemFonte>Rolamento com tampas de metal: R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0. Foto recortada.</ItemFonte>
        <ItemFonte>Colheita em Piracicaba (SP): Mariordo (Mario Roberto Duran Ortiz), Wikimedia Commons, CC BY 3.0. Foto recortada.</ItemFonte>
        <ItemFonte>Telas e gravação do protótipo: equipe AgroParts, 09/10/2026 e 27/10/2026.</ItemFonte>
        <ItemFonte>Ilustrações: modelo do Canva da equipe. Fonte Montserrat, licença SIL Open Font License.</ItemFonte>
        <ItemFonte>
          Licenças: <Nome>creativecommons.org/licenses/by/3.0</Nome> e <Nome>creativecommons.org/licenses/by/4.0</Nome>
        </ItemFonte>
      </Lista>
    </Painel>
  </Quadro>
);

// ---------- Roteiro (modo apresentador) ----------
// Cada nota começa pelo minuto em que a página entra, numa fala calma de 125 palavras por minuto.
// Colchetes são instruções para quem apresenta: não se fala.

export const notes: (string | undefined)[] = [
  `0:00 · Boa tarde. Somos a AgroParts, cinco estudantes de Sistemas de Informação da UEMG Frutal, no desafio AGR08.
Em seis minutos: a dor, a solução e os números.`,
  `0:12 · Esta é a Márcia, almoxarife numa usina aqui do Triângulo Mineiro. Ela é uma personagem, mas a cena é comum.
Duas da tarde, dia de safra: a colhedora para. O mecânico pede um rolamento 6318.
A Márcia procura no sistema, e o sistema diz que a peça não existe. Compras faz um pedido urgente, e a colhedora espera.
No dia seguinte, alguém acha três rolamentos iguais na prateleira, cadastrados com outro nome.`,
  `0:47 · Quanto isso custa? A São Martinho publicou: gastou 183 milhões e meio com manutenção de entressafra em nove meses. Dá oito reais e quarenta e seis por tonelada de cana.
Nas usinas da nossa região, isso dá de 21 a 85 milhões por safra. Só a Cerradão, aqui em Frutal, são cerca de 53 milhões.
Se um real em cada cem for para peça que já estava na prateleira, são 530 mil reais por safra.
Esse um por cento é hipótese nossa. O piloto mede o número real.`,
  `1:29 · Por que isso acontece? Hoje o processo é manual, no almoxarifado. Mas o cadastro é feito por cada setor.
A manutenção, compras e o almoxarifado escrevem a mesma peça de três jeitos, e o sistema enxerga três peças.
E não é só aqui: numa auditoria de energia nos Estados Unidos, a prateleira tinha 16% menos peças do que o sistema dizia.`,
  `1:59 · A AgroParts resolve isso. A pessoa digita o código, cola a descrição ou fotografa a etiqueta.
A AgroParts procura a peça no catálogo, compara as medidas e responde uma de três coisas:
é a mesma peça; precisa de uma pessoa; ou parece, mas não é.`,
  `2:20 · Cada setor ganha. O almoxarifado acha a peça pelo código, pela descrição ou pela foto da etiqueta.
A manutenção sabe na hora se a peça já está na prateleira. E compras vê o cadastro repetido antes de comprar de novo.
O sistema da usina continua igual, e nenhum cadastro é apagado.`,
  `2:45 · E isto não é maquete. Escaneiem o QR e toquem Identificar.
[Pausa de 10 segundos enquanto escaneiam.]
O código 311960 é o rolamento 6318 da Márcia. A AgroParts identifica a peça e, logo embaixo, mostra o 311963: o mesmo rolamento, com outro código.
É a peça que estava na prateleira.
[O vídeo do celular, à direita, roda sozinho e mostra o mesmo caminho: é o plano B sem internet. No PDF, a tela é a capa do vídeo. O vídeo inteiro, de 31 s, também está em demo.mp4.]`,
  `3:16 · Testamos o protótipo com o catálogo público de materiais do governo federal.
A AgroParts recusou 90 de 90 peças parecidas, mas diferentes. E leu 396 cadastros de rolamento de uma vez: achou 28 grupos de cadastros repetidos.
Na dúvida, ela não arrisca: chama uma pessoa.`,
  `3:37 · Agora, os números, no cenário conservador: a menor usina da nossa tabela, com 2,5 milhões de toneladas.
Um por cento de 21 milhões são 210 mil reais por safra. A AgroParts custaria 60 mil por ano: o retorno estimado é de três vezes e meia o preço, e a conta empata com 0,3%.
Numa usina como a Cerradão, o teto da região, chega a quase nove vezes.
É estimativa, com as premissas na tela. O piloto mede o número real.`,
  `4:16 · Quem paga é a usina, pelo orçamento de suprimentos e manutenção, que é onde cai a compra repetida.
O preço que vamos testar é de 5 mil reais por usina, por mês.
E a primeira usina começa com um piloto de 90 dias, sem custo.`,
  `4:37 · O mercado: são 250 usinas operando no Centro-Sul, segundo a UNICA. A 60 mil reais por ano, são 15 milhões de reais por ano, só no Centro-Sul.
Lá fora, a Verusen, a SAP e a IBM já organizam listas de peças. No Brasil, não encontramos nenhuma solução igual, feita para usinas, em português.`,
  `5:03 · Por isso, o nosso pedido: uma usina parceira para um piloto de 90 dias, sem custo.
Um tipo de peça, de 10 a 50 peças reais, e uma pessoa do almoxarifado para conferir as respostas.
Vamos medir o tempo para achar a peça e as compras repetidas, antes e depois. O QR está na tela. Obrigado.
[Fim por volta de 5:30. Sobram cerca de 30 segundos do limite de 6 minutos.]`,
  `Página de apoio: não precisa falar. Mostre só se perguntarem de onde vêm os números. Nas perguntas, volte à página 12.

As três perguntas mais difíceis:
1. "Quem paga?" A usina, pelo orçamento de suprimentos e manutenção, que é onde cai a compra repetida. O preço em teste é de 5 mil reais por usina por mês, e a primeira usina faz o piloto de 90 dias sem custo.
2. "Por que vocês?" O protótipo já está no ar e recusou 90 de 90 peças parecidas em dados públicos. Estudamos em Frutal, perto das usinas do Triângulo. Um de nós já criou soluções assim para clientes de móveis e de automóveis. E não achamos no Brasil uma solução igual: a Tractian, que atua aqui, cuida da saúde das máquinas e do estoque, mas não confere se duas peças são a mesma.
3. "Qual é a prova?" Hoje, a prova é com dados públicos: 90 de 90 peças parecidas recusadas e 28 grupos de repetidos em 396 cadastros do governo federal. Ainda não testamos numa usina, por isso o retorno é estimativa. O piloto de 90 dias mede o tempo para achar a peça e as compras repetidas, antes e depois.

Se perguntarem:
- "De onde vem o 1%?" É hipótese. No catálogo público, 33 de 396 cadastros (8%) repetiam outro. Para pagar a AgroParts, basta 0,3% na menor usina da tabela.
- "Qual é a meta?" Hipótese, sem base ainda: 10 usinas até 2028, ou 600 mil reais por ano.

Versão de 30 segundos, se pedirem um resumo:
Numa usina, a mesma peça tem um nome em cada setor, e o sistema não acha o que está na prateleira.
A AgroParts confere o código e as medidas e responde: é a mesma peça, não é, ou precisa de uma pessoa.
Mesmo no cenário conservador, o retorno estimado é de três vezes e meia o preço. Procuramos uma usina parceira para um piloto de 90 dias.`,
  `Página de apoio: não precisa falar.`,
];

export const meta: SlideMeta = {
  title: 'AgroParts · Pitch final do Rota Inova UEMG 2026',
  createdAt: '2026-10-22T18:50:00.123Z',
};

export default [
  Abertura,
  DiaDeSafra,
  QuantoCusta,
  ComoEHoje,
  Solucao,
  CadaSetor,
  AoVivo,
  Prova,
  Retorno,
  ModeloDeNegocio,
  Mercado,
  Pedido,
  FontesDosNumeros,
  Creditos,
] satisfies Page[];
