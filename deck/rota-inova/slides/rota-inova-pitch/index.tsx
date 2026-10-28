// Pitch final da AgroParts no Rota Inova UEMG 2026 (desafio AGR08): seis minutos, tom de Shark Tank.
// Três atos: a dor (a cena da safra e o que a manutenção já custa), a solução (o que ela responde, os seis passos
// por trás da resposta, o que a equipe estudou e o teste com dados reais) e os números (quem já ganha com isso lá
// fora, o mercado, o investimento por etapa e o pedido).
// Cada página tem uma ideia: o título e o número ou a imagem que a prova. O resto é falado: o roteiro fica no
// export `notes`, que o modo apresentador mostra. Na tela só entra número publicado (com o nome de quem publicou),
// número que o protótipo mediu ou conta feita com eles. A fonte de cada número, os créditos e as perguntas da
// banca ficam nas notas, entre colchetes, e as contas em docs/pesquisa/numeros-do-pitch.md.
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

import fotoColheita from './assets/fotos/colheita-piracicaba.jpg';
import fotoRolamento from './assets/fotos/rolamento-com-tampa-6007.jpg';
import qrAgroparts from './assets/qr-agroparts.svg';
import fonteBold from './assets/fontes/Montserrat-Bold.ttf';
import fonteExtraBold from './assets/fontes/Montserrat-ExtraBold.ttf';
import fonteLight from './assets/fontes/Montserrat-Light.ttf';
import fonteRegular from './assets/fontes/Montserrat-Regular.ttf';
import fonteSemiBold from './assets/fontes/Montserrat-SemiBold.ttf';
import telaRecebe from './assets/telas/passo-1-recebe.png';
import telaLe from './assets/telas/passo-2-le.png';
import telaBuscaMesma from './assets/telas/passo-3-busca-472657.png';
import telaBuscaPessoa from './assets/telas/passo-3-busca-357380.png';
import telaBuscaNaoE from './assets/telas/passo-3-busca-311967.png';
import telaComparaMesma from './assets/telas/passo-4-compara-472657.png';
import telaComparaNaoE from './assets/telas/passo-4-compara-311967.png';
import telaMesma from './assets/telas/passo-5-resolve.png';
import telaPessoa from './assets/telas/passo-5-revisa.png';
import telaNaoE from './assets/telas/passo-5-recusa.png';
import telaRegistra from './assets/telas/passo-6-registra.png';

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
const placa = '#1c1456'; // fundo das linhas de cadastro e das etapas
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
    <p style={{ margin: '72px 0 0', fontSize: 52, lineHeight: 1.2, fontWeight: 700 }}>
      Antes de comprar,
      <br />a usina vai saber se a peça
      <br />
      já está na prateleira.
    </p>
    <FotoLado src={fotoRolamento} alt="Rolamento de esferas com tampas de metal" credito="Foto recortada: R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0" />
  </div>
);

// ---------- Ato 1: a dor ----------

const DiaDeSafra: Page = () => (
  <Pagina direita={LARGURA_FOTO + 100}>
    <Titulo tamanho={104}>O sistema diz que a peça não existe.</Titulo>
    <Medida style={{ marginTop: 56, fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)' }}>Na prateleira, havia três.</Medida>
    <FotoLado src={fotoColheita} alt="Colheita mecanizada de cana" credito="Foto recortada: Mariordo, Wikimedia Commons, CC BY 3.0" />
  </Pagina>
);

const ManutencaoSaoMartinho: Page = () => (
  <Pagina>
    <Titulo>
      Manutenção de entressafra
      <br />
      e outros na São Martinho,
      <br />
      em 9 meses
    </Titulo>
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
      menos peças na prateleira
      <br />
      do que o sistema dizia,
      <br />
      numa auditoria do governo dos EUA
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

// Os seis passos por trás da resposta, num caso só: o código 283529 (6312 ZZ) do catálogo do governo, o mesmo
// rolamento do teste. Cada passo traz o recorte da tela real do protótipo que o mostra. As telas vêm de
// capturar-telas.sh: um celular de 360 px, capturado a 3 px por px. Cada tela ocupa a largura da coluna.
const Tela = ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} style={{ display: 'block', width: '100%', height: 'auto' }} />;

// O título de cada passo reserva as linhas do título mais longo da página, para as telas das três colunas
// começarem na mesma altura.
const ALTURA_LINHA_PASSO = 45;
const Passo = ({ numero, titulo, linhas, children }: { numero: number; titulo: ReactNode; linhas: number; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, minHeight: 34 + linhas * ALTURA_LINHA_PASSO }}>
      <span style={{ flex: 'none', fontSize: 80, lineHeight: 1, fontWeight: 800, color: 'var(--osd-accent)', fontVariantNumeric: 'tabular-nums' }}>{numero}</span>
      <span style={{ fontSize: 40, lineHeight: `${ALTURA_LINHA_PASSO}px`, fontWeight: 800, textWrap: 'balance' }}>{titulo}</span>
    </div>
    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const Passos = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <Pagina style={{ justifyContent: 'flex-start', paddingTop: 88 }}>
    <Titulo tamanho={64}>{titulo}</Titulo>
    <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: 80 }}>{children}</div>
  </Pagina>
);

const PassosLer: Page = () => (
  <Passos titulo="Primeiro, lê a peça e busca no catálogo">
    <Passo numero={1} linhas={3} titulo="Recebe o código, a descrição ou a foto">
      <Tela src={telaRecebe} alt="Protótipo: Código escolhido entre Código, Descrição e Foto da etiqueta, com o código 283529 no campo" />
    </Passo>
    <Passo numero={2} linhas={3} titulo="Lê tamanho, proteção e folga">
      <Tela src={telaLe} alt="Protótipo: rolamento de esferas 6312, furo de 60 mm, blindagem metálica nos dois lados, folga normal" />
    </Passo>
    <Passo numero={3} linhas={3} titulo="Acha os outros 6312 do catálogo">
      <Tela src={telaBuscaMesma} alt="Protótipo: cadastro 472657 achado no catálogo" />
      <Tela src={telaBuscaPessoa} alt="Protótipo: cadastro 357380 achado no catálogo" />
      <Tela src={telaBuscaNaoE} alt="Protótipo: cadastro 311967 achado no catálogo" />
    </Passo>
  </Passos>
);

const PassosDecidir: Page = () => (
  <Passos titulo="Depois, compara e decide">
    <Passo numero={4} linhas={2} titulo="Compara cada um">
      <Tela src={telaComparaMesma} alt="Protótipo: o cadastro 472657 tem o mesmo tamanho, a mesma proteção, a mesma folga e o mesmo material" />
      <Tela src={telaComparaNaoE} alt="Protótipo: o cadastro 311967 tem folga C3; a peça procurada tem folga normal" />
    </Passo>
    <Passo numero={5} linhas={2} titulo="Decide">
      <Tela src={telaMesma} alt="Protótipo: É a mesma peça, 2 cadastros" />
      <Tela src={telaPessoa} alt="Protótipo: Pode ser a mesma peça, precisa de uma pessoa, 1 cadastro" />
      <Tela src={telaNaoE} alt="Protótipo: Parece, mas não é, 5 cadastros" />
    </Passo>
    <Passo numero={6} linhas={2} titulo="Padroniza sem apagar o original">
      <Tela src={telaRegistra} alt="Protótipo: o cadastro original 283529 sem alteração, ao lado da descrição padronizada" />
    </Passo>
  </Passos>
);

// O que a equipe estudou antes de construir. A fonte de cada linha está na nota da página; como testou está na
// página seguinte, e as etapas, na do investimento.
const Linha = ({ children }: { children: ReactNode }) => (
  <span style={{ fontSize: 60, lineHeight: 1.1, fontWeight: 800, textWrap: 'balance' }}>{children}</span>
);

const Estudo: Page = () => (
  <Pagina>
    <Titulo>Estudamos antes de construir</Titulo>
    <div style={{ marginTop: 96, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 120, rowGap: 64 }}>
      <Linha>O catálogo do governo</Linha>
      <Linha>A norma ISO 8000</Linha>
      <Linha>SAP, IBM e Verusen</Linha>
      <Linha>O que a SKF e a Timken deixam usar</Linha>
    </div>
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
    <Titulo largura={1500}>Testamos 104 pares, com o gabarito fechado antes</Titulo>
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

// 33 dos 396 cadastros ativos do padrão 11797 repetem outro, em 28 grupos: 1 em cada 12.
const UmEmDoze: Page = () => (
  <Pagina>
    {/* O "1" da Montserrat tem folga à esquerda; o recuo alinha o algarismo à margem do texto. */}
    <Valor tamanho={260} style={{ marginLeft: -30 }}>
      1 em 12
    </Valor>
    <Titulo tamanho={72} largura={1400} style={{ marginTop: 48 }}>
      cadastros de rolamento de esfera
      <br />
      do catálogo do governo repetia outro
    </Titulo>
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

// Quem atende qualquer indústria e quem atende usina, em português, lado a lado: quem faz algo parecido fica em tom
// apagado, e a AgroParts em menta. O título de cada lado cabe numa linha, para os nomes começarem na mesma altura.
const Lado = ({ onde, children }: { onde: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
    <span style={{ fontSize: 60, lineHeight: 1.08, fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{onde}</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>
  </div>
);

const Empresa = ({ children, cor = suave }: { children: ReactNode; cor?: string }) => (
  <span style={{ fontSize: 88, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.02em', color: cor }}>{children}</span>
);

const Concorrencia: Page = () => (
  <Pagina>
    <Titulo>Quem faz isso e para quem</Titulo>
    <div style={{ marginTop: 88, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 120 }}>
      <Lado onde="Qualquer indústria">
        <Empresa>Verusen</Empresa>
        <Empresa>SAP</Empresa>
        <Empresa>IBM</Empresa>
      </Lado>
      <Lado onde="Usina, em português">
        <Empresa cor="var(--osd-accent)">AgroParts</Empresa>
      </Lado>
    </div>
  </Pagina>
);

const Mercado: Page = () => (
  <Pagina>
    <Titulo>O mercado, só no Centro-Sul</Titulo>
    <Valor style={{ marginTop: 64 }}>250</Valor>
    <Medida style={{ marginTop: 28 }}>usinas operando, segundo a UNICA</Medida>
  </Pagina>
);

// O investimento por etapa, como numa campanha de financiamento coletivo: cada etapa prova um número e pede dois
// tipos de apoio, dinheiro e acesso. A ordem e os números vêm do roadmap (docs/roadmap.md); os custos, das
// categorias de docs/rota-inova (equipe, licença do catálogo do fabricante e servidor). Sem valor e sem data.
const COLUNAS_ETAPA = '56px 300px 440px 250px 1fr';
const VAO_ETAPA = 44;

const Cabecalho = ({ children }: { children?: ReactNode }) => (
  <span style={{ fontSize: 34, lineHeight: 1.2, fontWeight: 800, color: 'var(--osd-accent)' }}>{children}</span>
);

const Celula = ({ children }: { children: ReactNode }) => (
  <span style={{ fontSize: 34, lineHeight: 1.2, fontWeight: 600, textWrap: 'balance' }}>{children}</span>
);

const Etapa = ({ numero, nome, prova, dinheiro, acesso }: { numero: number; nome: string; prova: string; dinheiro: string; acesso: string }) => (
  <div
    data-caixa
    style={{ display: 'grid', gridTemplateColumns: COLUNAS_ETAPA, alignItems: 'start', columnGap: VAO_ETAPA, padding: '24px 36px', background: placa }}
  >
    <span style={{ fontSize: 56, lineHeight: 0.9, fontWeight: 800, color: 'var(--osd-accent)', fontVariantNumeric: 'tabular-nums' }}>{numero}</span>
    <span style={{ fontSize: 40, lineHeight: 1.05, fontWeight: 800, textWrap: 'balance' }}>{nome}</span>
    <Celula>{prova}</Celula>
    <Celula>{dinheiro}</Celula>
    <Celula>{acesso}</Celula>
  </div>
);

const Investimento: Page = () => (
  <Pagina>
    <Titulo>O que pedimos, etapa por etapa</Titulo>
    <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: COLUNAS_ETAPA, columnGap: VAO_ETAPA, padding: '0 36px 16px' }}>
      <Cabecalho />
      <Cabecalho />
      <Cabecalho>Prova</Cabecalho>
      <Cabecalho>Dinheiro</Cabecalho>
      <Cabecalho>Acesso</Cabecalho>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Etapa numero={1} nome="Piloto numa usina" prova="quanto tempo e quantas compras a usina economiza" dinheiro="equipe e servidor" acesso="uma usina e uma pessoa do almoxarifado" />
      <Etapa numero={2} nome="Catálogo do fabricante" prova="que as medidas batem na família inteira" dinheiro="licença do catálogo" acesso="um fabricante" />
      <Etapa numero={3} nome="Bombas e vedações" prova="quanto acerta em cada família nova" dinheiro="equipe" acesso="os cadastros da usina" />
      <Etapa numero={4} nome="Sistema da usina" prova="que a resposta chega sem mudar cadastro" dinheiro="equipe" acesso="quem conhece o SAP ou o Maximo da usina" />
    </div>
  </Pagina>
);

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

// O pedido e, à direita, o QR e o contato, com o topo do QR na altura do título.
const Pedido: Page = () => (
  <Pagina>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 120 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Titulo tamanho={80} largura={1000}>
          Procuramos
          <br />
          investimento,
          <br />
          uma usina parceira
          <br />e quem abra portas
        </Titulo>
        <Valor sufixo="dias" tamanho={200} style={{ marginTop: 64 }}>
          90
        </Valor>
        <Medida style={{ marginTop: 24 }}>de piloto, sem custo para a usina</Medida>
      </div>
      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28, paddingTop: 14 }}>
        <QrCode tamanho={400} />
        <Link tamanho={36} />
        <span style={{ fontSize: 30, fontWeight: 600, color: suave }}>myke.matos@gmail.com</span>
      </div>
    </div>
  </Pagina>
);

// ---------- Roteiro (modo apresentador) ----------
// Cada nota começa pelo minuto em que a página entra, numa fala calma de 125 palavras por minuto.
// A tela só mostra o título e o número; o resto está aqui, para falar.
// Colchetes são instruções e fontes para quem apresenta: não se fala.

export const notes: (string | undefined)[] = [
  `0:00 · Boa tarde. Somos a AgroParts, cinco estudantes de Sistemas de Informação da UEMG Frutal, no desafio AGR08.
Antes de comprar, a usina vai saber se a peça já está na prateleira.
[Equipe: Allana Eduarda Braga Iquegami, Gabrielle Henrique Arruda Longo, Alberto Gabriel Rodrigues Bispo, Davi de Sousa Almeida e Myke Matos dos Santos.
Créditos do deck: foto do rolamento com tampas de metal, R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0 (creativecommons.org/licenses/by/4.0), recortada. Fonte Montserrat, SIL Open Font License. As contas e as fontes de todos os números estão em github.com/shishiv/agroparts, docs/pesquisa/numeros-do-pitch.md.]`,
  `0:14 · Imagine a Márcia, almoxarife numa usina aqui do Triângulo. Ela é uma personagem, mas a cena é comum.
Dia de safra, a colhedora para. O mecânico pede um rolamento 6318.
A Márcia procura no sistema, e o sistema diz que a peça não existe. Compras faz um pedido urgente, e a colhedora espera.
No dia seguinte, alguém acha três rolamentos iguais na prateleira, cadastrados com outro nome.
[A cena é ilustrativa. Foto: colheita em Piracicaba (SP), Mariordo (Mario Roberto Duran Ortiz), Wikimedia Commons, CC BY 3.0 (creativecommons.org/licenses/by/3.0), recortada.]`,
  `0:47 · Quanto custa manter uma usina rodando? A São Martinho publicou: 183 milhões e meio de reais com manutenção de entressafra e outros, em nove meses.
Cada peça comprada sem precisar sai desse dinheiro.
[Fonte: São Martinho, Resultados 3T26, 09/02/2026, p. 15: R$ 183,5 mi em "Manutenção Entressafra/Outros", de abril a dezembro de 2025.]`,
  `1:02 · Por que isso acontece? Hoje o processo é manual, no almoxarifado. Mas o cadastro é feito por cada setor.
O almoxarifado, a manutenção e compras escrevem a mesma peça de três jeitos, e o sistema enxerga três peças.
[Os três cadastros são ilustrativos.]`,
  `1:21 · E não é só aqui: numa auditoria do governo dos Estados Unidos, a prateleira tinha 16% menos peças do que o sistema dizia.
[Fonte: Departamento de Energia dos EUA, auditoria DOE-OIG-24-30, 24/09/2024.]`,
  `1:32 · A AgroParts resolve isso. Ela confere a peça e responde uma de três coisas:
é a mesma peça; precisa de uma pessoa; ou parece, mas não é.`,
  `1:45 · Cada setor ganha. O almoxarifado acha a peça.
A manutenção sabe na hora se ela já está na prateleira. E compras vê o cadastro repetido antes de comprar de novo.`,
  `1:59 · Por trás da resposta, são seis passos, com um rolamento real do catálogo: o 6312 ZZ.
Um: a pessoa dá o que tem: o código, a descrição ou a foto da etiqueta. Aqui, o código.
Dois: a AgroParts lê a peça: rolamento 6312, furo de 60 milímetros, blindagem nos dois lados, folga normal.
Três: acha no catálogo os outros oito 6312.
[Telas reais do protótipo em agroparts.pages.dev, código 283529 (6312 ZZ) do CATMAT, capturadas em 28/10/2026 com capturar-telas.sh. Os oito cadastros achados são 292852, 472657, 357380, 311967, 317412, 346385, 346386 e 472656; a tela mostra três deles.]`,
  `2:28 · Quatro: compara o que muda a peça: tamanho, proteção e folga. O 472657 é igual em tudo, só o texto muda. O 311967 parece igual, mas tem outra folga.
Cinco: decide. Dois são a mesma peça, um precisa de uma pessoa e cinco parecem, mas não são.
Seis: padroniza a descrição sem apagar o original. Cada resposta guarda o porquê, como o da folga.
[Contagens do protótipo para o código 283529, 28/10/2026: 2 iguais (292852 e 472657), 1 para uma pessoa (357380, "6312 2ZR": o final "R" não está nas regras) e 5 diferentes. Texto parecido nunca decide: só os dados da peça.]`,
  `2:59 · E não foi no chute. Estudamos o catálogo de materiais do governo, com 343 mil itens, a norma de dados de material, a ISO 8000, como a SAP, a IBM e a Verusen tratam isso, e o que a SKF e a Timken deixam usar.
[Fontes, todas em docs/pesquisa/ do repositório: 343.880 itens de material na API do Compras.gov.br em 25/08/2026 (catmat-pncp.md); as partes 110 a 140 da ISO 8000 (aprofundamento-identidade-equivalencia.md); SAP MDG, SAP EAM e IBM Maximo (aprofundamento-jornada-integracao.md); Verusen (mercado.md); termos de uso da SKF e da Timken conferidos em 05/10/2026 (fontes-do-prototipo.md e ADR 0010). As 21 decisões de projeto estão em docs/decisoes/.]`,
  `3:21 · E testamos com rolamentos reais do catálogo, com o gabarito fechado antes.
Em 14 pares, era a mesma peça com outro nome, como 6312 ZZ e 6312-2Z. A AgroParts achou os 14.
Em 90 pares, a peça parecia igual, mas tinha outra proteção, folga ou material. A AgroParts recusou os 90.
Na dúvida, ela não arrisca: chama uma pessoa.
[Fonte: teste da equipe no catálogo de materiais do governo federal (CATMAT, padrão 11797, Compras.gov.br): 104 pares, 14 da mesma peça e 90 parecidos, mas diferentes, com o gabarito registrado em 05/10/2026, antes do teste (dados/gabarito/v1/preregistro.json e docs/medicao/gabarito-v1.md). Os exemplos são pares do teste: 283529 (6312 ZZ) com 472657 (6312-2Z) e com 311967 (6312ZZ C3). Não é cadastro de usina.]`,
  `3:49 · E, lendo todos os cadastros de rolamento de esfera de uma vez, um em cada doze repetia outro.
[Medido pelo protótipo no lote de 05/10/2026, com bun run medir: 33 dos 396 cadastros ativos do padrão 11797 (ROLAMENTO DE ESFERA) do CATMAT repetem outro, em 28 grupos (docs/medicao/gabarito-v1.md). Um deles é o 6318 da Márcia: 311960 e 311963.]`,
  `3:58 · Lá fora, isso já é negócio. Nos Estados Unidos, a Verusen vende exatamente essa promessa: a mesma peça, muitos nomes.
Ela publicou o caso de uma fabricante com 29 fábricas: 10 milhões e meio de dólares de economia verificada em estoque de peças.
E já captou 33 milhões de dólares de investidores.
[Fonte: Verusen, verusen.com, 28/10/2026: caso de uma fabricante com 29 fábricas, US$ 10,5 mi de economia verificada em estoque de peças, número publicado pela empresa. Captação: US$ 8 mi (série A) e US$ 25 mi (série B, 25/01/2022), segundo o comunicado da Verusen.]`,
  `4:23 · No Brasil, não encontramos ninguém fazendo isso para usina.
A Verusen, a SAP e a IBM atendem qualquer indústria. A AgroParts é feita para usina, em português, e funciona ao lado do sistema que a usina já tem.
[SAP e IBM: learning.sap.com e ibm.com/docs, consultados em 25/08/2026.]`,
  `4:41 · E o mercado é grande: só no Centro-Sul, a UNICA conta 250 usinas operando.
[Fonte: UNICA, 22/06/2026: 250 unidades produtoras operando no Centro-Sul na 2ª quinzena de maio de 2026.]`,
  `4:48 · Não viemos vender um preço. Viemos buscar investimento para construir em etapas.
Cada etapa prova um número antes da próxima e pede dinheiro e uma porta aberta.
Primeiro, o piloto: uma usina e uma pessoa do almoxarifado, para medir o tempo para achar a peça e as compras repetidas.
Depois, um fabricante, para licenciar o catálogo. Depois, bombas e vedações. E, por fim, quem conhece o SAP ou o Maximo da usina, para a resposta chegar no sistema dela.
[Etapas: docs/roadmap.md, que só avança uma fase quando a anterior prova o seu número, e os ADRs 0001, 0004, 0010, 0012, 0014 e 0020. Custos: equipe, licença do catálogo do fabricante e servidor (docs/rota-inova/01-ideacao.html e entrega-unica.html). Hoje, a tabela aberta de medidas só cobre os rolamentos 6000 a 6007, 6200 a 6206 e 6300 a 6305 (docs/medicao/gabarito-v1.md). Sem valor e sem data, por decisão da equipe.]`,
  `5:25 · O nosso pedido: investimento, uma usina parceira e quem abra portas, para um piloto de 90 dias, sem custo para a usina.
Um tipo de peça e 10 a 50 peças reais. O QR abre o protótipo. Obrigado.
[Fim por volta de 5:45. Sobram 15 segundos do limite de 6 minutos. Nas perguntas, fique nesta página.

As perguntas mais difíceis, com resposta de uma frase:
1. "Quanto vocês já venderam?" Nada ainda: o protótipo está no ar e pronto para o primeiro piloto, e é esse piloto que pedimos hoje.
2. "Quanto vocês pedem?" O valor de cada etapa ainda não está fechado: os custos são a equipe, a licença do catálogo do fabricante e o servidor, e o piloto é que dimensiona cada etapa. Além do dinheiro, pedimos acesso: a usina, o fabricante e quem conhece o sistema da usina.
3. "Quanto a usina vai pagar?" A hipótese é 5 mil reais por usina por mês, e o piloto testa esse preço. Na São Martinho, com 4 usinas, seriam 180 mil reais em 9 meses: menos de 0,1% do que ela gastou com manutenção de entressafra no mesmo período (4 usinas: saomartinho.com.br, 28/10/2026).
4. "Qual é o tamanho do mercado em reais?" A 5 mil reais por mês, as 250 usinas do Centro-Sul somam 15 milhões de reais por ano. É estimativa com o preço em hipótese.
5. "Por que a Verusen ou a SAP não fazem isso aqui?" A Verusen atende grandes indústrias nos Estados Unidos, e a SAP e a IBM vendem a função dentro do próprio sistema delas; a usina precisa de algo em português, com peça de usina, que funcione com o sistema que ela já tem.
6. "Por que vocês?" O protótipo já está no ar e acertou os 104 pares do teste com dados públicos. Estudamos em Frutal, perto das usinas do Triângulo. Um de nós já criou soluções assim para clientes de móveis e de automóveis. E a Tractian, que atua aqui, cuida da saúde das máquinas e do estoque, mas não confere se duas peças são a mesma.
7. "Qual é o retorno?" Se 1% do gasto de manutenção for peça que já estava na prateleira, numa usina como a Coruripe de Limeira do Oeste, com 2,5 milhões de toneladas, são 210 mil reais por safra, três vezes e meia o preço. Essa conta é estimativa nossa: o piloto mede o número real.
8. "Qual é a prova?" Hoje, a prova é com dados públicos: 14 de 14 pares iguais achados, 90 de 90 parecidos recusados e um em cada doze cadastros repetido, no catálogo do governo federal. As respostas certas foram registradas antes do teste, com as mesmas regras de leitura do motor, e a conferência delas por pessoas da equipe ainda falta. Ainda não testamos numa usina: é isso que o piloto mede.
9. "Quem paga?" A usina, pelo orçamento de suprimentos e manutenção, que é onde cai a compra repetida.

Se perguntarem:
- "Qual é a meta?" Hipótese, sem base ainda: 10 usinas até 2028, ou 600 mil reais por ano.
- "A Verusen é concorrente?" Hoje, é a prova de que o mercado paga por isso: ela captou 33 milhões de dólares nos Estados Unidos.

Versão de 30 segundos, se pedirem um resumo:
Numa usina, a mesma peça tem um nome em cada setor, e o sistema não acha o que está na prateleira.
A AgroParts lê a peça, compara o que importa e responde: é a mesma peça, não é, ou precisa de uma pessoa.
Nos Estados Unidos, a Verusen já vende isso. Buscamos investimento, uma usina parceira e quem abra portas, a começar por um piloto de 90 dias.]`,
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
  PassosLer,
  PassosDecidir,
  Estudo,
  ParesTestados,
  UmEmDoze,
  LaFora,
  Concorrencia,
  Mercado,
  Investimento,
  Pedido,
] satisfies Page[];
