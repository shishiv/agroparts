// Pitch final da AgroParts no Rota Inova UEMG 2026 (desafio AGR08): seis minutos, tom de Shark Tank.
// Três atos: a dor (a cena da safra e o que a manutenção já custa), a solução (o protótipo ao vivo e o teste com
// dados reais) e os números (quem já ganha com isso lá fora, o preço, o que basta para se pagar e o mercado).
// As duas últimas páginas trazem as fontes e os créditos.
// Cada página tem uma ideia: o título e o número ou a imagem que a prova. O resto é falado: o roteiro fica no
// export `notes`, que o modo apresentador mostra. Na tela só entra número publicado (com o nome de quem publicou),
// número que o protótipo mediu ou conta feita com eles; estimativas e hipóteses ficam nas notas de perguntas.
import { type DesignSystem, type Page, type SlideMeta, useIsActivePage, useSlidePageNumber } from '@open-slide/core';
import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';

import fotoColheita from './assets/fotos/colheita-piracicaba.jpg';
import fotoRolamento from './assets/fotos/rolamento-com-tampa-6007.jpg';
import qrAgroparts from './assets/qr-agroparts.svg';
import fonteBold from './assets/fontes/Montserrat-Bold.ttf';
import fonteExtraBold from './assets/fontes/Montserrat-ExtraBold.ttf';
import fonteLight from './assets/fontes/Montserrat-Light.ttf';
import fonteRegular from './assets/fontes/Montserrat-Regular.ttf';
import fonteSemiBold from './assets/fontes/Montserrat-SemiBold.ttf';
import demoCapa from './assets/video/demo-celular-capa.jpg';
import demoCelular from './assets/video/demo-celular.mp4';

// Fundo e tinta do modelo do Canva da equipe, com o menta como a única cor de destaque.
export const design: DesignSystem = {
  palette: { bg: '#0e073f', text: '#ffffff', accent: '#05f1c7' },
  fonts: {
    display: 'Montserrat, sans-serif',
    body: 'Montserrat, sans-serif',
  },
  typeScale: { hero: 260, body: 44 },
  radius: 0,
};

const suave = '#b3aee0'; // setores, países e número da página: 9:1 sobre o fundo
const placa = '#1c1456'; // fundo das linhas de cadastro
const apagado = '#2c2470'; // cadastros que não se repetem, na grade
const veu = 'rgba(14, 7, 63, 0.82)'; // fundo do crédito sobre a foto

// Montserrat em arquivos estáticos (licença OFL, assets/fontes/OFL.txt).
const FONTES_ID = 'osd-webfont-rota-inova-pitch';
const fontes = `
@font-face { font-family: "Montserrat"; src: url("${fonteLight}"); font-weight: 300; }
@font-face { font-family: "Montserrat"; src: url("${fonteRegular}"); font-weight: 400; }
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

// ---------- Peças de layout ----------

const MARGEM_X = 160;
const LARGURA_FOTO = 760;

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
  fontVariantNumeric: 'lining-nums',
  textWrap: 'pretty',
  fontSize: 'var(--osd-size-body)',
  lineHeight: 1.3,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const NumeroDaPagina = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <span style={{ position: 'absolute', left: MARGEM_X, bottom: 48, fontSize: 22, fontWeight: 600, color: suave, fontVariantNumeric: 'tabular-nums' }}>
      {current} / {total}
    </span>
  );
};

// Página padrão: o conteúdo centrado na altura. `direita` reserva a faixa de uma foto.
const Pagina = ({ children, direita = MARGEM_X, style }: { children: ReactNode; direita?: number; style?: CSSProperties }) => (
  <div style={{ ...fundo, padding: `120px ${direita}px 120px ${MARGEM_X}px`, ...style }}>
    {children}
    <NumeroDaPagina />
  </div>
);

const Titulo = ({ children, tamanho = 88, largura = 1600, style }: { children: ReactNode; tamanho?: number; largura?: number; style?: CSSProperties }) => (
  <h2
    style={{
      margin: 0,
      maxWidth: largura,
      fontFamily: 'var(--osd-font-display)',
      fontSize: tamanho,
      lineHeight: 1.08,
      fontWeight: 800,
      letterSpacing: '-0.02em',
      textWrap: 'balance',
      ...style,
    }}
  >
    {children}
  </h2>
);

// Número em destaque. O "R$" e a unidade ficam menores, para o algarismo mandar.
const Valor = ({
  children,
  prefixo,
  sufixo,
  tamanho = 'var(--osd-size-hero)',
  style,
}: {
  children: ReactNode;
  prefixo?: string;
  sufixo?: string;
  tamanho?: number | string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.1em',
      fontSize: tamanho,
      lineHeight: 1,
      fontWeight: 800,
      letterSpacing: '-0.03em',
      color: 'var(--osd-accent)',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {prefixo && <span style={{ fontSize: '0.4em', letterSpacing: 0 }}>{prefixo}</span>}
    <span>{children}</span>
    {sufixo && <span style={{ fontSize: '0.4em', letterSpacing: 0 }}>{sufixo}</span>}
  </div>
);

// O que o número mede, logo abaixo dele.
const Medida = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <p style={{ margin: 0, maxWidth: 1400, fontSize: 48, lineHeight: 1.2, fontWeight: 700, textWrap: 'balance', ...style }}>{children}</p>
);

const Destaque = ({ children }: { children: ReactNode }) => <span style={{ color: 'var(--osd-accent)' }}>{children}</span>;

// Foto de canto a canto na faixa da direita, com o crédito que a licença CC BY pede sobre ela.
const FotoLado = ({ src, alt, credito, posicao = 'center' }: { src: string; alt: string; credito: string; posicao?: string }) => (
  <div style={{ position: 'absolute', top: 0, right: 0, width: LARGURA_FOTO, height: 1080 }}>
    <img src={src} alt={alt} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: posicao }} />
    <p
      data-credito
      style={{ position: 'absolute', right: 16, bottom: 14, margin: 0, padding: '4px 12px', fontSize: 20, lineHeight: 1.3, color: '#ffffff', background: veu }}
    >
      {credito}
    </p>
  </div>
);

// ---------- Abertura ----------

const Chave = ({ children }: { children: string }) => (
  <span style={{ color: 'var(--osd-accent)', fontWeight: 300 }}>{children}</span>
);

const Abertura: Page = () => (
  <div style={{ ...fundo, padding: `120px ${LARGURA_FOTO + 100}px 120px ${MARGEM_X}px` }}>
    <h1 style={{ margin: 0, fontFamily: 'var(--osd-font-display)', fontSize: 150, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
      <Chave>{'{ '}</Chave>AgroParts<Chave>{' }'}</Chave>
    </h1>
    <p style={{ margin: '88px 0 0', fontSize: 30, lineHeight: 1.5, fontWeight: 600, color: suave }}>
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
    <FotoLado src={fotoRolamento} alt="Rolamento de esferas com tampas de metal" credito="Foto: R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0" />
  </div>
);

// ---------- Ato 1: a dor ----------

const DiaDeSafra: Page = () => (
  <Pagina direita={LARGURA_FOTO + 100}>
    <Titulo tamanho={104}>O sistema diz que a peça não existe.</Titulo>
    <Medida style={{ marginTop: 56, fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)' }}>Na prateleira, havia três.</Medida>
    <FotoLado src={fotoColheita} alt="Colheita mecanizada de cana" credito="Foto: Mariordo, Wikimedia Commons, CC BY 3.0" />
  </Pagina>
);

const ManutencaoSaoMartinho: Page = () => (
  <Pagina>
    <Titulo>Manutenção de entressafra da São Martinho, em 9 meses</Titulo>
    <Valor prefixo="R$" sufixo="mi" style={{ marginTop: 72 }}>
      183,5
    </Valor>
  </Pagina>
);

// Como um setor escreve a peça no cadastro. O código que se repete fica em menta.
const Cadastro = ({ setor, children }: { setor: string; children: ReactNode }) => (
  <div data-caixa style={{ display: 'grid', gridTemplateColumns: '300px 1fr', alignItems: 'baseline', columnGap: 40, padding: '28px 44px', background: placa }}>
    <span style={{ fontSize: 34, fontWeight: 600, color: suave }}>{setor}</span>
    <span style={{ fontSize: 50, lineHeight: 1.2, fontWeight: 800, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{children}</span>
  </div>
);

const CadaSetorCadastra: Page = () => (
  <Pagina>
    <Titulo largura={1400}>Hoje é manual. Cada setor cadastra do seu jeito.</Titulo>
    <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Cadastro setor="Almoxarifado">
        ROLAM <Destaque>6318</Destaque>ZZC3 P/ BOMBA
      </Cadastro>
      <Cadastro setor="Manutenção">
        ROL <Destaque>6318</Destaque> ZZ C3
      </Cadastro>
      <Cadastro setor="Compras">
        ROLAMENTO RIG. ESFERAS <Destaque>6318</Destaque>-2Z/C3
      </Cadastro>
    </div>
  </Pagina>
);

const AuditoriaNosEUA: Page = () => (
  <Pagina>
    {/* O "1" da Montserrat tem folga à esquerda; o recuo alinha o algarismo à margem do texto. */}
    <Valor tamanho={320} style={{ marginLeft: -36 }}>
      16%
    </Valor>
    <Titulo tamanho={72} largura={1400} style={{ marginTop: 40 }}>
      menos peças na prateleira do que o sistema dizia, numa auditoria do governo dos EUA
    </Titulo>
  </Pagina>
);

// ---------- Ato 2: a solução ----------

// As três respostas, como sinais: igual, dúvida e diferente. O traço começa na borda esquerda, alinhado ao texto.
// `estreito` corta a sobra da direita, para o sinal ficar centrado entre dois blocos.
const Sinal = ({ children, tamanho = 150, estreito = false }: { children: ReactNode; tamanho?: number; estreito?: boolean }) => (
  <svg
    width={estreito ? (tamanho * 120) / 160 : tamanho}
    height={tamanho}
    viewBox={estreito ? '0 0 120 160' : '0 0 160 160'}
    aria-hidden="true"
    style={{ display: 'block', flex: 'none' }}
  >
    <g fill="none" stroke="#05f1c7" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  </svg>
);

const SinalIgual = ({ tamanho, estreito }: { tamanho?: number; estreito?: boolean }) => (
  <Sinal tamanho={tamanho} estreito={estreito}>
    <line x1={8} y1={60} x2={112} y2={60} />
    <line x1={8} y1={100} x2={112} y2={100} />
  </Sinal>
);

const SinalDuvida = () => (
  <Sinal>
    <path d="M8 56 A32 32 0 1 1 56 84 Q40 94 40 110" />
    <circle cx={40} cy={140} r={4} fill="#05f1c7" />
  </Sinal>
);

const SinalDiferente = ({ tamanho, estreito }: { tamanho?: number; estreito?: boolean }) => (
  <Sinal tamanho={tamanho} estreito={estreito}>
    <line x1={8} y1={60} x2={112} y2={60} />
    <line x1={8} y1={100} x2={112} y2={100} />
    <line x1={84} y1={24} x2={36} y2={136} />
  </Sinal>
);

const Resposta = ({ sinal, children }: { sinal: ReactNode; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
    {sinal}
    <span style={{ fontSize: 56, lineHeight: 1.12, fontWeight: 800, textWrap: 'balance' }}>{children}</span>
  </div>
);

const Solucao: Page = () => (
  <Pagina>
    <Titulo largura={1300}>A AgroParts confere a peça e responde</Titulo>
    <div style={{ marginTop: 96, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: 96 }}>
      <Resposta sinal={<SinalIgual />}>É a mesma peça</Resposta>
      <Resposta sinal={<SinalDuvida />}>Precisa de uma pessoa</Resposta>
      <Resposta sinal={<SinalDiferente />}>Parece, mas não é</Resposta>
    </div>
  </Pagina>
);

const Ganho = ({ setor, children }: { setor: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <span style={{ fontSize: 36, fontWeight: 600, color: suave }}>{setor}</span>
    <span style={{ fontSize: 68, lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.01em', textWrap: 'balance' }}>{children}</span>
  </div>
);

const CadaSetorGanha: Page = () => (
  <Pagina>
    <Titulo>Um ganho para cada setor</Titulo>
    <div style={{ marginTop: 112, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: 96 }}>
      <Ganho setor="Almoxarifado">Acha a peça</Ganho>
      <Ganho setor="Manutenção">Sabe se já tem</Ganho>
      <Ganho setor="Compras">Não compra de novo</Ganho>
    </div>
  </Pagina>
);

// Gravação de 31 s do protótipo publicado, recortada na coluna do celular.
// Roda sozinha e em loop enquanto a página está na tela; no PDF, fica a capa, que é o resultado do código 311960.
const ALTURA_CELULAR = 820;
const BORDA_CELULAR = 14;
const DemoGravada = () => {
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
    <div
      style={{
        position: 'absolute',
        top: (1080 - ALTURA_CELULAR - 2 * BORDA_CELULAR) / 2,
        right: MARGEM_X,
        border: `${BORDA_CELULAR}px solid ${apagado}`,
        borderRadius: 44,
        overflow: 'hidden',
        background: '#f3f4ef',
      }}
    >
      <video
        ref={video}
        src={demoCelular}
        poster={demoCapa}
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Gravação do protótipo: o código 311960 é identificado como rolamento 6318, e o cadastro 311963 aparece como a mesma peça"
        style={{ display: 'block', width: ALTURA_CELULAR / 2, height: ALTURA_CELULAR }}
      />
    </div>
  );
};

// QR code que abre https://agroparts.pages.dev/. Gerado localmente; o comando está no README do deck.
// A moldura branca completa a margem clara que o leitor precisa em volta do código.
const QrCode = ({ tamanho }: { tamanho: number }) => (
  <div style={{ flex: 'none', background: '#ffffff', padding: 14, width: tamanho, height: tamanho }}>
    <img src={qrAgroparts} alt="QR code que abre agroparts.pages.dev" style={{ display: 'block', width: '100%', height: '100%' }} />
  </div>
);

const Link = ({ tamanho = 40 }: { tamanho?: number }) => (
  <a href="https://agroparts.pages.dev/" target="_blank" rel="noopener noreferrer" style={{ fontSize: tamanho, fontWeight: 700, color: 'var(--osd-text)', textDecoration: 'none' }}>
    agroparts.pages.dev
  </a>
);

const LARGURA_CELULAR = ALTURA_CELULAR / 2 + 2 * BORDA_CELULAR;

const AoVivo: Page = () => (
  <Pagina direita={MARGEM_X + LARGURA_CELULAR + 120}>
    <Titulo tamanho={104}>Escaneiem o QR e toquem Identificar</Titulo>
    <div style={{ marginTop: 64, display: 'flex', alignItems: 'flex-end', gap: 48 }}>
      <QrCode tamanho={460} />
      <Link tamanho={40} />
    </div>
    <DemoGravada />
  </Pagina>
);

// Um par do teste: os dois códigos de fabricante, como estão no catálogo, e quantos pares desse tipo a AgroParts acertou.
// Os exemplos são pares reais do gabarito v1 (CATMAT 283529 com 472657 e com 311967).
const Codigo = ({ children }: { children: ReactNode }) => (
  <span data-caixa style={{ padding: '14px 28px', background: placa, fontSize: 48, lineHeight: 1.2, fontWeight: 800, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

const Par = ({ sinal, a, b, placar, verbo, recuo = 0 }: { sinal: ReactNode; a: ReactNode; b: ReactNode; placar: string; verbo: string; recuo?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <Codigo>{a}</Codigo>
      {sinal}
      <Codigo>{b}</Codigo>
    </div>
    <span
      style={{
        marginTop: 56,
        marginLeft: recuo,
        fontSize: 140,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: 'var(--osd-accent)',
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
      }}
    >
      {placar}
    </span>
    <span style={{ marginTop: 20, fontSize: 48, fontWeight: 700 }}>{verbo}</span>
  </div>
);

const ParesTestados: Page = () => (
  <Pagina>
    <Titulo largura={1500}>Testamos 104 pares do catálogo do governo</Titulo>
    <div style={{ marginTop: 96, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 96 }}>
      <Par sinal={<SinalIgual tamanho={80} estreito />} a="6312 ZZ" b="6312-2Z" placar="14 de 14" verbo="achados" recuo={-14} />
      <Par
        sinal={<SinalDiferente tamanho={80} estreito />}
        a="6312 ZZ"
        b={
          <>
            6312ZZ <Destaque>C3</Destaque>
          </>
        }
        placar="90 de 90"
        verbo="recusados"
      />
    </div>
  </Pagina>
);

// Os 396 cadastros ativos de rolamento de esfera do CATMAT, em ordem de código. Em menta, os 33 que repetem um
// cadastro anterior (28 grupos). As posições saem do lote do protótipo:
// bun -e 'import { loteCatmat } from "./src/motor/lote.ts"; const l = loteCatmat(); const c = l.linhas.map((x) => x.original.codigo).sort((a, b) => a - b); const r = new Set(l.grupos_duplicidade.flatMap((g) => [...g.codigos].sort((a, b) => a - b).slice(1))); console.log(c.flatMap((x, i) => (r.has(x) ? [i] : [])))'
// A grade é um gráfico de dados, não uma lista de cartões: um único SVG desenha as 396 casas.
const REPETIDOS = new Set([15, 34, 48, 100, 101, 102, 103, 104, 105, 106, 112, 113, 115, 116, 117, 121, 122, 197, 199, 222, 224, 226, 227, 244, 251, 256, 258, 281, 283, 290, 303, 304, 311]);
const COLUNAS = 36;
const CASA = 36;
const VAO = 8;
const GradeDeCadastros = () => {
  const linhas = Math.ceil(396 / COLUNAS);
  const largura = COLUNAS * CASA + (COLUNAS - 1) * VAO;
  const altura = linhas * CASA + (linhas - 1) * VAO;
  return (
    <svg width={largura} height={altura} viewBox={`0 0 ${largura} ${altura}`} role="img" aria-label="396 cadastros de rolamento; 33 deles repetem outro" style={{ display: 'block' }}>
      {Array.from({ length: 396 }, (_, i) => (
        <rect
          key={i}
          x={(i % COLUNAS) * (CASA + VAO)}
          y={Math.floor(i / COLUNAS) * (CASA + VAO)}
          width={CASA}
          height={CASA}
          fill={REPETIDOS.has(i) ? '#05f1c7' : apagado}
        />
      ))}
    </svg>
  );
};

const UmEmDoze: Page = () => (
  <Pagina>
    <Titulo largura={1500}>
      No mesmo catálogo, <span style={{ color: 'var(--osd-accent)', whiteSpace: 'nowrap' }}>1 em cada 12</span> cadastros repetia outro
    </Titulo>
    <div style={{ marginTop: 80 }}>
      <GradeDeCadastros />
    </div>
  </Pagina>
);

// ---------- Ato 3: os números ----------

const LaFora: Page = () => (
  <Pagina>
    <Titulo>Nos EUA, isso já é negócio</Titulo>
    <Valor prefixo="US$" sufixo="mi" style={{ marginTop: 64 }}>
      10,5
    </Valor>
    <Medida style={{ marginTop: 28 }}>de economia verificada numa fabricante, segundo a Verusen</Medida>
  </Pagina>
);

// Lá fora e no Brasil, lado a lado: quem faz algo parecido fica em tom apagado, e a AgroParts em menta.
const Lado = ({ onde, children }: { onde: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
    <span style={{ fontSize: 64, lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.02em' }}>{onde}</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>
  </div>
);

const Empresa = ({ children, cor = suave }: { children: ReactNode; cor?: string }) => (
  <span style={{ fontSize: 88, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.02em', color: cor }}>{children}</span>
);

const Concorrencia: Page = () => (
  <Pagina>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 120 }}>
      <Lado onde="Lá fora">
        <Empresa>Verusen</Empresa>
        <Empresa>SAP</Empresa>
        <Empresa>IBM</Empresa>
      </Lado>
      <Lado onde="No Brasil, para usina">
        <Empresa cor="var(--osd-accent)">AgroParts</Empresa>
      </Lado>
    </div>
  </Pagina>
);

const QuemPaga: Page = () => (
  <Pagina>
    <Titulo>A usina paga</Titulo>
    <Valor prefixo="R$" sufixo="mil" tamanho={300} style={{ marginTop: 64 }}>
      5
    </Valor>
    <Medida style={{ marginTop: 28 }}>por mês</Medida>
  </Pagina>
);

// 4 usinas × R$ 5 mil × 9 meses = R$ 180 mil, contra R$ 183,5 mi de manutenção nos mesmos 9 meses: 0,098%.
const SePaga: Page = () => (
  <Pagina>
    <Titulo largura={1400}>
      Para se pagar na <span style={{ whiteSpace: 'nowrap' }}>São Martinho</span>, basta evitar
    </Titulo>
    <Valor tamanho={300} style={{ marginTop: 64 }}>
      0,1%
    </Valor>
    <Medida style={{ marginTop: 28 }}>do que ela já gasta com manutenção</Medida>
  </Pagina>
);

const Mercado: Page = () => (
  <Pagina>
    <Titulo>Mercado só no Centro-Sul</Titulo>
    <Valor prefixo="R$" sufixo="mi" style={{ marginTop: 64 }}>
      15
    </Valor>
    <Medida style={{ marginTop: 28 }}>por ano, nas 250 usinas que a UNICA conta</Medida>
  </Pagina>
);

// O pedido e, à direita, o QR e o contato, com o topo do QR na altura do título.
const Pedido: Page = () => (
  <Pagina>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 120 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Titulo tamanho={100} largura={1000}>
          Procuramos uma usina parceira
        </Titulo>
        <Valor sufixo="dias" tamanho={220} style={{ marginTop: 64 }}>
          90
        </Valor>
        <Medida style={{ marginTop: 24 }}>de piloto, sem custo</Medida>
      </div>
      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28, paddingTop: 14 }}>
        <QrCode tamanho={400} />
        <Link tamanho={36} />
        <span style={{ fontSize: 30, fontWeight: 600, color: suave }}>myke.matos@gmail.com</span>
      </div>
    </div>
  </Pagina>
);

// ---------- Fontes e créditos ----------

const ItemFonte = ({ children }: { children: ReactNode }) => (
  <li style={{ display: 'flex', gap: '0.6em', margin: '0 0 16px' }}>
    <span aria-hidden="true" style={{ flex: 'none', width: 10, height: 10, marginTop: '0.55em', background: 'var(--osd-accent)' }} />
    <span style={{ minWidth: 0 }}>{children}</span>
  </li>
);

const ListaFontes = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <div>
    <h3 style={{ margin: '0 0 22px', fontSize: 30, fontWeight: 800, color: 'var(--osd-accent)' }}>{titulo}</h3>
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 24, lineHeight: 1.38, fontWeight: 400 }}>{children}</ul>
  </div>
);

const Nome = ({ children }: { children: ReactNode }) => <span style={{ whiteSpace: 'nowrap' }}>{children}</span>;

const PaginaDeApoio = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <Pagina style={{ justifyContent: 'flex-start', paddingTop: 100 }}>
    <Titulo tamanho={60}>{titulo}</Titulo>
    <div style={{ marginTop: 48 }}>{children}</div>
  </Pagina>
);

const FontesDosNumeros: Page = () => (
  <PaginaDeApoio titulo="De onde vêm os números">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 72 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <ListaFontes titulo="A dor">
          <ItemFonte>A cena da página 2 e os três cadastros da página 4 são ilustrativos.</ItemFonte>
          <ItemFonte>
            São Martinho, Resultados 3T26, 09/02/2026, p. 15: <Nome>R$ 183,5 mi</Nome> em “Manutenção Entressafra/Outros” de abril a dezembro de 2025.
          </ItemFonte>
          <ItemFonte>
            16%: Departamento de Energia dos EUA, auditoria <Nome>DOE-OIG-24-30</Nome>, 24/09/2024.
          </ItemFonte>
        </ListaFontes>
        <ListaFontes titulo="A solução">
          <ItemFonte>
            104 pares, 14 da mesma peça e 90 parecidos, mas diferentes: teste da equipe no catálogo de materiais do governo federal (CATMAT, padrão 11797, Compras.gov.br), com o gabarito registrado em 05/10/2026, antes
            do teste. A AgroParts acertou os 104; os exemplos da página 9 são pares do teste. Não é cadastro de usina.
          </ItemFonte>
          <ItemFonte>1 em cada 12: 33 dos 396 cadastros ativos do mesmo padrão repetem outro, em 28 grupos.</ItemFonte>
        </ListaFontes>
      </div>
      <ListaFontes titulo="Os números">
        <ItemFonte>
          Verusen, verusen.com, 28/10/2026: <Nome>US$ 10,5 mi</Nome> de economia verificada em estoque de peças, caso de uma fabricante com 29 fábricas. Número publicado
          pela empresa. Captação: <Nome>US$ 8 mi</Nome> (série A) e <Nome>US$ 25 mi</Nome> (série B, 25/01/2022), segundo o comunicado da Verusen.
        </ItemFonte>
        <ItemFonte>SAP e IBM: learning.sap.com e ibm.com/docs, consultados em 25/08/2026.</ItemFonte>
        <ItemFonte>
          Preço proposto pela equipe: <Nome>R$ 5 mil</Nome> por usina por mês.
        </ItemFonte>
        <ItemFonte>
          0,1%: a São Martinho tem 4 usinas (saomartinho.com.br, 28/10/2026). 4 × <Nome>R$ 5 mil</Nome> × 9 meses = <Nome>R$ 180 mil</Nome>, que é 0,098% de{' '}
          <Nome>R$ 183,5 mi</Nome>.
        </ItemFonte>
        <ItemFonte>
          250 unidades operando no Centro-Sul (UNICA, 22/06/2026) × <Nome>R$ 60 mil</Nome> por ano = <Nome>R$ 15 mi</Nome> por ano.
        </ItemFonte>
        <ItemFonte>Piloto de 90 dias, sem custo: proposta da equipe para a primeira usina.</ItemFonte>
        <ItemFonte>Contas e links: github.com/shishiv/agroparts, em docs/pesquisa/numeros-do-pitch.md.</ItemFonte>
      </ListaFontes>
    </div>
  </PaginaDeApoio>
);

const Creditos: Page = () => (
  <PaginaDeApoio titulo="Créditos">
    <ListaFontes titulo="Fotos, gravação e fonte">
      <ItemFonte>Rolamento com tampas de metal: R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0. Foto recortada.</ItemFonte>
      <ItemFonte>Colheita em Piracicaba (SP): Mariordo (Mario Roberto Duran Ortiz), Wikimedia Commons, CC BY 3.0. Foto recortada.</ItemFonte>
      <ItemFonte>Gravação do protótipo: equipe AgroParts, 27/10/2026.</ItemFonte>
      <ItemFonte>Fonte Montserrat, licença SIL Open Font License.</ItemFonte>
      <ItemFonte>
        Licenças: <Nome>creativecommons.org/licenses/by/3.0</Nome> e <Nome>creativecommons.org/licenses/by/4.0</Nome>
      </ItemFonte>
    </ListaFontes>
  </PaginaDeApoio>
);

// ---------- Roteiro (modo apresentador) ----------
// Cada nota começa pelo minuto em que a página entra, numa fala calma de 125 palavras por minuto.
// A tela só mostra o título e o número; o resto está aqui, para falar.
// Colchetes são instruções para quem apresenta: não se fala.

export const notes: (string | undefined)[] = [
  `0:00 · Boa tarde. Somos a AgroParts, cinco estudantes de Sistemas de Informação da UEMG Frutal, no desafio AGR08.
Antes de comprar, a usina vai saber se a peça já está no estoque.
Em seis minutos: a dor, a solução e os números.`,
  `0:19 · Imagine a Márcia, almoxarife numa usina aqui do Triângulo. Ela é uma personagem, mas a cena é comum.
Dia de safra, a colhedora para. O mecânico pede um rolamento 6318.
A Márcia procura no sistema, e o sistema diz que a peça não existe. Compras faz um pedido urgente, e a colhedora espera.
No dia seguinte, alguém acha três rolamentos iguais na prateleira, cadastrados com outro nome.`,
  `0:51 · Quanto custa manter uma usina rodando? A São Martinho publicou: 183 milhões e meio de reais com manutenção de entressafra, em nove meses.
Cada peça comprada sem precisar sai desse dinheiro.`,
  `1:06 · Por que isso acontece? Hoje o processo é manual, no almoxarifado. Mas o cadastro é feito por cada setor.
O almoxarifado, a manutenção e compras escrevem a mesma peça de três jeitos, e o sistema enxerga três peças.`,
  `1:24 · E não é só aqui: numa auditoria do governo dos Estados Unidos, a prateleira tinha 16% menos peças do que o sistema dizia.`,
  `1:36 · A AgroParts resolve isso. A pessoa digita o código, cola a descrição ou fotografa a etiqueta.
A AgroParts procura a peça no catálogo, compara as medidas e responde uma de três coisas:
é a mesma peça; precisa de uma pessoa; ou parece, mas não é.
[Se perguntarem: "a mesma peça" é mesmo código e mesmas medidas; "precisa de uma pessoa" é quando falta informação; "parece, mas não é" é uma medida ou proteção diferente.]`,
  `1:57 · Cada setor ganha. O almoxarifado acha a peça pelo código, pela descrição ou pela foto da etiqueta.
A manutenção sabe na hora se a peça já está na prateleira. E compras vê o cadastro repetido antes de comprar de novo.
O sistema da usina continua igual, e nenhum cadastro é apagado.`,
  `2:22 · E isto não é maquete. Escaneiem o QR e toquem Identificar.
[Pausa de 10 segundos enquanto escaneiam.]
O código 311960 é o rolamento 6318 da Márcia. A AgroParts identifica a peça e, logo embaixo, mostra o 311963: o mesmo rolamento, com outro código.
É a peça que estava na prateleira.
[O vídeo do celular, à direita, roda sozinho e mostra o mesmo caminho: é o plano B sem internet. No PDF, a tela é a capa do vídeo. O vídeo inteiro, de 31 s, também está em demo.mp4.]`,
  `2:53 · Testamos com rolamentos reais do catálogo de materiais do governo federal, com as respostas certas registradas antes do teste.
Em 14 pares, era a mesma peça com outro nome, como 6312 ZZ e 6312-2Z. A AgroParts achou os 14.
Em 90 pares, a peça parecia igual, mas não era: o 6312 ZZ C3 tem outra folga. A AgroParts recusou os 90.
Na dúvida, ela não arrisca: chama uma pessoa.`,
  `3:26 · Depois, leu de uma vez os 396 cadastros de rolamento desse catálogo. Um em cada doze repetia outro.
[São 33 cadastros, em 28 grupos.]`,
  `3:34 · E lá fora, isso já é negócio. Nos Estados Unidos, a Verusen vende exatamente essa promessa: a mesma peça, muitos nomes.
Ela publicou o caso de uma fabricante com 29 fábricas: 10 milhões e meio de dólares de economia verificada em estoque de peças.
E já captou 33 milhões de dólares de investidores.`,
  `4:00 · No Brasil, não encontramos ninguém fazendo isso para usina.
A Verusen, a SAP e a IBM atendem grandes empresas lá fora. A AgroParts é feita para usina, em português, e funciona ao lado do sistema que a usina já tem.`,
  `4:19 · O modelo é simples: quem paga é a usina, pelo orçamento de suprimentos e manutenção.
São 5 mil reais por usina, por mês.`,
  `4:30 · E isso se paga. A São Martinho tem quatro usinas: nos mesmos nove meses, a AgroParts custaria 180 mil reais.
Para se pagar, basta evitar menos de um real em cada mil que ela já gasta com manutenção.
E, no catálogo do governo, um em cada doze cadastros era repetido.`,
  `4:54 · O mercado: são 250 usinas operando no Centro-Sul, segundo a UNICA. A 60 mil reais por ano cada uma, são 15 milhões de reais por ano, só no Centro-Sul.`,
  `5:08 · Por isso, o nosso pedido: uma usina parceira para um piloto de 90 dias, sem custo.
Um tipo de peça, de 10 a 50 peças reais, e uma pessoa do almoxarifado para conferir as respostas.
Vamos medir o tempo para achar a peça e as compras repetidas, antes e depois. O QR está na tela. Obrigado.
[Fim por volta de 5:35. Sobram cerca de 25 segundos do limite de 6 minutos.]`,
  `Página de apoio: não precisa falar. Mostre só se perguntarem de onde vêm os números. Nas perguntas, volte à página 16, a do pedido.

As perguntas mais difíceis, com resposta de uma frase:
1. "Quanto vocês já venderam?" Nada ainda: o produto está no ar e pronto para o primeiro piloto, e é esse piloto que pedimos hoje.
2. "Por que a Verusen ou a SAP não fazem isso aqui?" A Verusen atende grandes indústrias nos Estados Unidos, e a SAP e a IBM vendem a função dentro do próprio sistema delas; a usina precisa de algo em português, com peça de usina, que funcione com o sistema que ela já tem.
3. "Por que vocês?" O protótipo já está no ar e acertou os 104 pares do teste com dados públicos. Estudamos em Frutal, perto das usinas do Triângulo. Um de nós já criou soluções assim para clientes de móveis e de automóveis. E a Tractian, que atua aqui, cuida da saúde das máquinas e do estoque, mas não confere se duas peças são a mesma.
4. "Qual é o retorno?" Para se pagar, basta evitar 0,1% do gasto de manutenção. Se 1% desse gasto for peça que já estava na prateleira, numa usina como a Coruripe de Limeira do Oeste, com 2,5 milhões de toneladas, são 210 mil reais por safra, três vezes e meia o preço. Essa conta é estimativa nossa: o piloto mede o número real.
5. "Qual é a prova?" Hoje, a prova é com dados públicos: 14 de 14 pares iguais achados, 90 de 90 parecidos recusados e um em cada doze cadastros repetido, no catálogo do governo federal. O gabarito foi registrado pela equipe antes do teste, e a revisão por uma pessoa de fora ainda falta. Ainda não testamos numa usina: é isso que o piloto mede.
6. "Quem paga?" A usina, pelo orçamento de suprimentos e manutenção, que é onde cai a compra repetida.

Se perguntarem:
- "Qual é a meta?" Hipótese, sem base ainda: 10 usinas até 2028, ou 600 mil reais por ano.
- "A Verusen é concorrente?" Hoje, é a prova de que o mercado paga por isso: ela captou 33 milhões de dólares nos Estados Unidos.

Versão de 30 segundos, se pedirem um resumo:
Numa usina, a mesma peça tem um nome em cada setor, e o sistema não acha o que está na prateleira.
A AgroParts confere o código e as medidas e responde: é a mesma peça, não é, ou precisa de uma pessoa.
Nos Estados Unidos, a Verusen já vende isso. Aqui, para se pagar, basta evitar 0,1% do gasto de manutenção. Procuramos uma usina parceira para um piloto de 90 dias.`,
  `Página de apoio: não precisa falar.`,
];

export const meta: SlideMeta = {
  title: 'AgroParts · Pitch final do Rota Inova UEMG 2026',
  createdAt: '2026-10-22T18:50:00.123Z',
};

export default [
  Abertura,
  DiaDeSafra,
  ManutencaoSaoMartinho,
  CadaSetorCadastra,
  AuditoriaNosEUA,
  Solucao,
  CadaSetorGanha,
  AoVivo,
  ParesTestados,
  UmEmDoze,
  LaFora,
  Concorrencia,
  QuemPaga,
  SePaga,
  Mercado,
  Pedido,
  FontesDosNumeros,
  Creditos,
] satisfies Page[];
