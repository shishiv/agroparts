// Pitch final da AgroParts no Rota Inova UEMG 2026 (desafio AGR08): seis minutos, para quem não é técnico.
// Três atos, um por pessoa: 1, Gabi, o problema (a cena da safra, quanto custa a manutenção, cada setor cadastra do
// seu jeito e quanto o catálogo do governo repete); 2, Myke, a solução (as duas respostas, o ganho de cada setor, os
// cinco passos e como testou); 3, Alberto, a ideia do negócio (lá fora já é negócio, quem paga, o mercado, as etapas
// e o pedido).
// Cada página tem uma ideia, que se entende de relance: o título e o número ou a frase que a prova, em palavras
// simples. O roteiro fica no export `notes`, que o modo apresentador mostra, e diz o que a tela diz. Na tela só entra
// número publicado (com o nome de quem publicou), número que o protótipo mediu ou conta feita com eles. A fonte de
// cada número, os créditos e as perguntas da banca ficam nas notas, entre colchetes, e as contas em
// docs/pesquisa/numeros-do-pitch.md.
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
    <p style={{ margin: '72px 0 0', fontSize: 60, lineHeight: 1.15, fontWeight: 700, textWrap: 'balance' }}>
      Para a usina não comprar a peça que ela já tem.
    </p>
    <FotoLado src={fotoRolamento} alt="Rolamento de esferas com tampas de metal" credito="Foto recortada: R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0" />
  </div>
);

// ---------- Ato 1, Gabi: o problema ----------

const DiaDeSafra: Page = () => (
  <Pagina direita={LARGURA_FOTO + 100}>
    <Titulo tamanho={104}>O sistema diz que a peça não existe.</Titulo>
    <Medida style={{ marginTop: 56, fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)' }}>Na prateleira, havia três.</Medida>
    <FotoLado src={fotoColheita} alt="Colheita mecanizada de cana" credito="Foto recortada: Mariordo, Wikimedia Commons, CC BY 3.0" />
  </Pagina>
);

// A pergunta e o valor por extenso, em duas linhas, para o "milhões" ocupar a página.
const QuantoCusta: Page = () => (
  <Pagina style={{ paddingTop: 96, paddingBottom: 96 }}>
    <Titulo tamanho={72}>Quanto custa manter uma usina rodando?</Titulo>
    <Valor prefixo="R$" tamanho={250} style={{ marginTop: 48 }}>
      183,5
    </Valor>
    <Valor tamanho={250}>milhões</Valor>
    <Medida style={{ marginTop: 40, fontSize: 44, color: suave }}>São Martinho, manutenção de entressafra, em 9 meses</Medida>
  </Pagina>
);

// Como um setor escreve a peça no cadastro. O código que se repete fica em menta.
const Cadastro = ({ setor, children }: { setor: string; children: ReactNode }) => (
  <div data-caixa style={{ display: 'grid', gridTemplateColumns: '300px 1fr', alignItems: 'baseline', columnGap: 40, padding: '24px 44px', background: placa }}>
    <span style={{ fontSize: 34, fontWeight: 600, color: suave }}>{setor}</span>
    <span style={{ fontSize: 50, lineHeight: 1.2, fontWeight: 800, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{children}</span>
  </div>
);

const CadaSetorCadastra: Page = () => (
  <Pagina>
    <Titulo tamanho={80} largura={1400}>
      Hoje é manual. Cada setor cadastra do seu jeito.
    </Titulo>
    <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 16 }}>
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
    <Medida style={{ marginTop: 56, fontSize: 60, fontWeight: 800, color: 'var(--osd-accent)' }}>O sistema vê três peças, que na verdade são uma só.</Medida>
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
      dos cadastros de rolamento
      <br />
      do catálogo do governo está repetido
    </Titulo>
  </Pagina>
);

// ---------- Ato 2, Myke: a solução ----------

// As respostas, como sinais: igual e dúvida. O traço começa na borda esquerda, alinhado ao texto.
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
    <span style={{ fontSize: 72, lineHeight: 1.08, fontWeight: 800, textWrap: 'balance' }}>{children}</span>
  </div>
);

// Duas respostas: a AgroParts só junta quando é a mesma peça; o resto fica com uma pessoa.
const Solucao: Page = () => (
  <Pagina>
    <Titulo largura={1300}>A AgroParts confere a peça e responde</Titulo>
    <div style={{ marginTop: 96, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 120 }}>
      <Resposta sinal={<SinalIgual />}>É a mesma peça</Resposta>
      <Resposta sinal={<SinalDuvida />}>Precisa de uma pessoa</Resposta>
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

// Uma etapa de uma sequência: o número em menta e o texto ao lado, numa linha da lista.
const Passo = ({ numero, children }: { numero: number; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', alignItems: 'baseline', columnGap: 32 }}>
    <span style={{ fontSize: 76, lineHeight: 1, fontWeight: 800, color: 'var(--osd-accent)', fontVariantNumeric: 'tabular-nums' }}>{numero}</span>
    <span style={{ fontSize: 60, lineHeight: 1.1, fontWeight: 800 }}>{children}</span>
  </div>
);

const Lista = ({ children }: { children: ReactNode }) => (
  <div style={{ marginTop: 72, display: 'flex', flexDirection: 'column', gap: 36 }}>{children}</div>
);

const CincoPassos: Page = () => (
  <Pagina>
    <Titulo>Cinco passos, em segundos</Titulo>
    <Lista>
      <Passo numero={1}>Recebe o código, o nome ou a foto</Passo>
      <Passo numero={2}>Lê as medidas e o tipo da peça</Passo>
      <Passo numero={3}>Procura as parecidas no catálogo</Passo>
      <Passo numero={4}>Compara uma a uma</Passo>
      <Passo numero={5}>Junta os cadastros, sem apagar o original</Passo>
    </Lista>
  </Pagina>
);

// Como o teste foi feito, na ordem: os dados reais, as respostas certas registradas antes e o conserto da primeira
// rodada. O traço de cima de cada marco forma a linha do tempo. Contagens: dados/gabarito/v1 e os commits 88985c9 e
// c0689c5 do PR 4.
const Marco = ({ numero, titulo, children }: { numero: number; titulo: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 36, borderTop: '8px solid var(--osd-accent)', minWidth: 0 }}>
    <span style={{ fontSize: 80, lineHeight: 1, fontWeight: 800, color: 'var(--osd-accent)', fontVariantNumeric: 'tabular-nums' }}>{numero}</span>
    <span style={{ fontSize: 52, lineHeight: 1.08, fontWeight: 800, whiteSpace: 'nowrap' }}>{titulo}</span>
    <span style={{ fontSize: 42, lineHeight: 1.2, fontWeight: 600, textWrap: 'balance' }}>{children}</span>
  </div>
);

const ComoTestamos: Page = () => (
  <Pagina>
    <Titulo largura={1500}>Testamos com dados reais e públicos</Titulo>
    <div style={{ marginTop: 96, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: 64 }}>
      <Marco numero={1} titulo="Dados reais">
        42 cadastros de rolamento do catálogo do governo
      </Marco>
      <Marco numero={2} titulo="Antes do teste">
        guardamos as respostas certas
      </Marco>
      <Marco numero={3} titulo="1ª rodada">
        6 erros: consertamos a AgroParts, não as respostas
      </Marco>
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
    <Titulo largura={1500}>O resultado, em 104 pares de peças</Titulo>
    <div style={{ marginTop: 96, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 96 }}>
      <Par sinal={<SinalIgual tamanho={80} estreito />} a="6312 ZZ" b="6312-2Z" placar="14 de 14" verbo="iguais, achadas" recuo={-14} />
      <Par
        sinal={<SinalDiferente tamanho={80} estreito />}
        a="6312 ZZ"
        b={
          <>
            6312ZZ <Destaque>C3</Destaque>
          </>
        }
        placar="90 de 90"
        verbo="diferentes, mantidas separadas"
      />
    </div>
  </Pagina>
);

// ---------- Ato 3, Alberto: a ideia do negócio ----------

// Lá fora já se paga por isso; aqui, ninguém faz para usina. Os nomes das outras empresas ficam na fala e nas perguntas.
const LaFora: Page = () => (
  <Pagina>
    <Titulo>Lá fora, isso já é negócio</Titulo>
    <Valor prefixo="US$" sufixo="mi" style={{ marginTop: 56 }}>
      10,5
    </Valor>
    <Medida style={{ marginTop: 28 }}>de economia numa fabricante, segundo a Verusen</Medida>
    <Medida style={{ marginTop: 64, fontSize: 60, fontWeight: 800, color: 'var(--osd-accent)' }}>No Brasil, para usina, não achamos ninguém.</Medida>
  </Pagina>
);

// O modelo de negócio sem preço: quem paga, pelo quê e de que orçamento. O preço é hipótese e fica na nota de perguntas.
const ModeloDeNegocio: Page = () => (
  <Pagina>
    <Titulo>Como a AgroParts ganha dinheiro</Titulo>
    <div style={{ marginTop: 112, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: 96 }}>
      <Ganho setor="Quem paga">A usina</Ganho>
      <Ganho setor="Como">Assinatura por usina</Ganho>
      <Ganho setor="De onde sai">Manutenção e compras</Ganho>
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

// As quatro etapas do roadmap (docs/roadmap.md), cada uma só depois de a anterior provar o seu número.
const Etapas: Page = () => (
  <Pagina>
    <Titulo>O investimento, em quatro etapas</Titulo>
    <Lista>
      <Passo numero={1}>Piloto numa usina</Passo>
      <Passo numero={2}>Catálogo de um fabricante</Passo>
      <Passo numero={3}>Bombas e vedações</Passo>
      <Passo numero={4}>Ligar no sistema da usina</Passo>
    </Lista>
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

// O pedido e, à direita, o QR que abre o protótipo, com o topo do QR na altura do título.
const Pedido: Page = () => (
  <Pagina>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 120 }}>
      <Titulo tamanho={92} largura={1000}>
        Procuramos
        <br />
        investimento,
        <br />
        uma usina parceira
        <br />e quem abra portas
      </Titulo>
      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28, paddingTop: 14 }}>
        <QrCode tamanho={440} />
        <Link tamanho={40} />
      </div>
    </div>
  </Pagina>
);

// ---------- Roteiro (modo apresentador) ----------
// Cada nota começa pelo minuto em que a página entra, numa fala calma de 125 palavras por minuto.
// A fala diz o que a tela diz, com as mesmas palavras simples; o resto da nota é apoio.
// Colchetes são instruções e fontes para quem apresenta: não se fala. A primeira nota de cada ato diz quem fala.

export const notes: (string | undefined)[] = [
  `0:00 · [Fala 1, Gabi: o problema, páginas 1 a 5.]
Boa tarde. Eu sou a Gabi, e nós somos a AgroParts.
Queremos que a usina não compre a peça que ela já tem.
[Equipe: Allana Eduarda Braga Iquegami, Gabrielle Henrique Arruda Longo, Alberto Gabriel Rodrigues Bispo, Davi de Sousa Almeida e Myke Matos dos Santos, estudantes de Sistemas de Informação da UEMG Frutal, no desafio AGR08.
Créditos do deck: foto do rolamento com tampas de metal, R. Henrik Nilsson, Wikimedia Commons, CC BY 4.0 (creativecommons.org/licenses/by/4.0), recortada. Fonte Montserrat, SIL Open Font License. As contas e as fontes de todos os números estão em github.com/shishiv/agroparts, docs/pesquisa/numeros-do-pitch.md.]`,
  `0:11 · Dia de safra, a colhedora para e precisa de uma peça.
O sistema diz que a peça não existe, e compras faz um pedido urgente.
Mas, na prateleira, havia três.
[A cena é ilustrativa. Foto: colheita em Piracicaba (SP), Mariordo (Mario Roberto Duran Ortiz), Wikimedia Commons, CC BY 3.0 (creativecommons.org/licenses/by/3.0), recortada.]`,
  `0:25 · Quanto custa manter uma usina rodando? Milhões.
A São Martinho publicou: 183 milhões e meio de reais com manutenção de entressafra, em nove meses.
Cada peça comprada sem precisar sai desse dinheiro.
[Fonte: São Martinho, Resultados 3T26, 09/02/2026, p. 15: R$ 183,5 mi em "Manutenção Entressafra/Outros", de abril a dezembro de 2025. É a linha de manutenção de máquinas e da indústria; plantio e tratos culturais são outras linhas. A empresa não separa quanto é peça.]`,
  `0:40 · Por que isso acontece? Hoje é manual. Cada setor cadastra do seu jeito: o almoxarifado de um jeito, a manutenção de outro, compras de outro.
O sistema vê três peças, que na verdade são uma só.
E cada fornecedor escreve a peça de outro jeito na nota fiscal.
[Os três cadastros são ilustrativos.]`,
  `1:03 · E não é caso raro. Lemos os 396 cadastros de rolamento do catálogo do governo: um em cada doze, ou 8%, está repetido.
[Medido pelo protótipo no lote de 05/10/2026, com bun run medir: 33 dos 396 cadastros ativos do padrão 11797 (ROLAMENTO DE ESFERA) do CATMAT repetem outro, em 28 grupos; 33 ÷ 396 = 8,3% (docs/medicao/gabarito-v1.md). Se alguém contar os 61 cadastros dentro dos grupos, vai achar 15%: o original de cada grupo não conta como repetido. É catálogo do governo federal, não de usina.
Gabi termina e para. O Myke entra se apresentando.]`,
  `1:14 · [Fala 2, Myke: a solução e o teste, páginas 6 a 10.]
Eu sou o Myke. A AgroParts confere a peça e responde:
é a mesma peça, ou precisa de uma pessoa.
Quando não tem certeza, ela não junta nada: chama uma pessoa.
[O protótipo separa "precisa de uma pessoa" de "parece, mas não é" (a recusa). Na tela, as duas viram uma: nos dois casos, a AgroParts não junta os cadastros.]`,
  `1:29 · Cada setor ganha: o almoxarifado acha a peça, a manutenção sabe se já tem, e compras não compra de novo.`,
  `1:39 · Tudo isso leva segundos, em cinco passos.
Um: a pessoa digita o código que já está no sistema, ou o que vem escrito na peça e na caixa. Também pode escrever o nome da peça, ou tirar uma foto da etiqueta. Da foto, a AgroParts lê o texto da etiqueta, no próprio navegador, com software livre.
Dois: lê as medidas e o tipo da peça.
Três: procura no catálogo as peças parecidas.
Quatro: compara uma a uma.
Cinco: junta os cadastros da mesma peça, sem apagar o original. Assim, quem vai comprar sabe o que a usina já tem.
[Os cinco passos são os seis do protótipo, com "compara" e "decide" num só. O código pode ser o do cadastro (no protótipo, o código do catálogo do governo, como 283529) ou o do fabricante (como 6312 ZZ). A foto passa pela leitura de texto do próprio site (tesseract.js, Apache 2.0, ADR 0021): a câmera lê o texto, não a peça, e a pessoa confere o texto antes da resposta. O protótipo não tem etiqueta NFC nem QR na máquina. O lote dos 396 cadastros roda em milissegundos; a leitura da foto leva alguns segundos.]`,
  `2:26 · Não foi no chute. Antes de construir, estudamos o catálogo do governo e quem já faz isso lá fora.
E testamos com dados reais e públicos: 42 cadastros de rolamento do catálogo de compras do governo federal, não de usina.
Antes do teste, guardamos as respostas certas no GitHub.
Na primeira rodada, a AgroParts errou 6 vezes. Consertamos a AgroParts, não as respostas.
[Fonte: CATMAT, padrão 11797 (ROLAMENTO DE ESFERA), consulta de 05/10/2026: 42 cadastros em seis grupos (6001, 6006, 6211, 6206, 6312 e 6308). Respostas certas (o gabarito) no commit 88985c9 (09h06) e motor no commit c0689c5 (09h15), em github.com/shishiv/agroparts/pull/4/commits; no main os dois viraram o commit b0a08ec. A hora do commit vem do computador de quem commita: a prova é a ordem pública dos commits. O conserto: uma leitura do código "6206-2Z" sem o final.
Quem rotulou foi o agente de IA que escreveu o motor; a revisão da equipe ainda falta. Não diga "sem ajustar nada": houve um conserto, e só um.
Estudo: 343.880 itens de material na API do Compras.gov.br em 25/08/2026; a norma ISO 8000; SAP MDG, IBM Maximo e Verusen; os termos de uso da SKF e da Timken (docs/pesquisa/ e ADR 0010).]`,
  `2:57 · Em 14 pares, era a mesma peça com outro nome, como 6312 ZZ e 6312-2Z. A AgroParts achou todas as 14.
Em 90 pares, a peça parecia igual, mas era outra. A AgroParts não juntou nenhuma das 90.
[Fonte: gabarito v1 de 05/10/2026, dados/gabarito/v1/preregistro.json e docs/medicao/gabarito-v1.md; refaça com bun run medir. 140 pares nos seis grupos, 36 indeterminados fora da conta, sobram 104: 14 iguais e 90 diferentes. Nos 90, muda a proteção, a folga ou as duas; nunca o material. Os exemplos são pares do teste: 283529 (6312 ZZ) com 472657 (6312-2Z) e com 311967 (6312ZZ C3). Não diga "100% de acurácia": diga "todas as 14" e "nenhuma das 90". Não é cadastro de usina.
Myke termina e para. O Alberto entra se apresentando.]`,
  `3:15 · [Fala 3, Alberto: a ideia do negócio, páginas 11 a 15.]
Eu sou o Alberto. Lá fora, isso já é negócio.
A Verusen, uma empresa americana, publicou o caso de uma fabricante: 10 milhões e meio de dólares de economia em estoque de peças.
No Brasil, para usina, não achamos ninguém. A AgroParts é feita para usina e funciona ao lado do sistema que ela já tem.
[Fonte: Verusen, verusen.com, 28/10/2026: caso de uma fabricante com 29 fábricas, US$ 20,9 mi identificados e US$ 10,5 mi de economia verificada em estoque de peças, número publicado pela empresa. Captação: US$ 8 mi (série A) e US$ 25 mi (série B, 25/01/2022). SAP e IBM vendem a função dentro do próprio sistema (learning.sap.com e ibm.com/docs, 25/08/2026).]`,
  `3:42 · O modelo é simples. Quem paga é a usina, com uma assinatura.
E o dinheiro sai de manutenção e compras, onde já cai a compra repetida.
[O valor da assinatura é hipótese e fica só para as perguntas (pergunta 3, na última nota). É a oferta B2B de dados e governança do recon profundo; a comissão sobre venda ficou fora do pitch (ADR 0019).]`,
  `3:54 · E o mercado é grande: só no Centro-Sul, a UNICA conta 250 usinas operando.
[Fonte: UNICA, 22/06/2026: 250 unidades produtoras operando no Centro-Sul na 2ª quinzena de maio de 2026.]`,
  `4:01 · Não viemos vender um preço. Viemos buscar investimento, em quatro etapas.
Primeiro, o piloto numa usina, para medir o tempo e as compras que ela economiza.
Depois, o catálogo de um fabricante. Depois, bombas e vedações. E, por fim, ligar no sistema da usina.
Cada etapa só começa quando a anterior prova o seu número.
[Etapas: docs/roadmap.md e os ADRs 0001, 0004, 0010, 0012, 0014 e 0020. Custos: equipe, licença do catálogo do fabricante e servidor (docs/rota-inova/01-ideacao.html e entrega-unica.html). O sistema da usina é o SAP ou o Maximo. Sem valor e sem data, por decisão da equipe.]`,
  `4:27 · O nosso pedido: investimento, uma usina parceira e quem abra portas.
O QR abre o protótipo. Obrigado.
[Nas perguntas, fique nesta página. Cada um responde a sua parte: Gabi, o problema; Myke, a solução e o teste; Alberto, o negócio e os números de mercado.

As perguntas mais difíceis, com resposta de uma frase:
1. "O teste foi simulado?" Não: são cadastros reais e públicos do catálogo de compras do governo federal, e as respostas certas foram guardadas no GitHub antes do motor. Quem responde é o Myke.
2. "Os números não são bonitos demais?" O teste é pequeno e mostramos o número absoluto. Na primeira rodada errou 6 pares; consertamos uma leitura do código, não as respostas. Ele mede se a AgroParts aplica as regras ao texto real, não se acerta a peça física.
3. "Quanto a usina vai pagar?" A hipótese é 5 mil reais por usina por mês, e o piloto testa esse preço. Na São Martinho, com 4 usinas, seriam 180 mil reais em 9 meses: menos de 0,1% do que ela gastou com manutenção de entressafra no mesmo período (4 usinas: saomartinho.com.br, 28/10/2026).
4. "Quanto vocês pedem?" O valor de cada etapa ainda não está fechado: os custos são a equipe, a licença do catálogo do fabricante e o servidor, e o piloto é que dimensiona cada etapa. Além do dinheiro, pedimos acesso: a usina, o fabricante e quem conhece o sistema da usina.
5. "Como funciona a foto? Não dá falso positivo e gasta token?" A câmera lê o texto da etiqueta no navegador, com software livre; a foto não vai para um modelo pago. A pessoa confere o texto lido, e a resposta vem igual à do código digitado. Na dúvida, o caso vai para uma pessoa.
6. "Quanto vocês já venderam?" Nada ainda: o protótipo está no ar e pronto para o primeiro piloto, e é esse piloto que pedimos hoje.
7. "Qual é o tamanho do mercado em reais?" A 5 mil reais por mês, as 250 usinas do Centro-Sul somam 15 milhões de reais por ano. É estimativa com o preço em hipótese.
8. "Por que a Verusen ou a SAP não fazem isso aqui?" A Verusen atende grandes indústrias nos Estados Unidos, e a SAP e a IBM vendem a função dentro do próprio sistema delas; a usina precisa de algo em português, com peça de usina, que funcione com o sistema que ela já tem.
9. "Por que vocês?" O protótipo já está no ar e acertou os 104 pares do teste com dados públicos. Estudamos em Frutal, perto das usinas do Triângulo. E a Tractian, que atua aqui, cuida da saúde das máquinas e do estoque, mas não confere se duas peças são a mesma.
10. "Qual é o retorno?" Se 1% do gasto de manutenção for peça que já estava na prateleira, numa usina como a Coruripe de Limeira do Oeste, com 2,5 milhões de toneladas, são 210 mil reais por safra, três vezes e meia o preço. Essa conta é estimativa nossa: o piloto mede o número real.
11. "Vocês testaram numa usina?" Ainda não: testamos no catálogo do governo federal, e o piloto mede o valor numa usina. A conferência das respostas certas por pessoas da equipe ainda falta.
12. "E uma etiqueta NFC ou QR na máquina?" Não está no protótipo. O histórico de peças de cada máquina já está no sistema da usina, pela entrada da nota. A AgroParts não refaz esse sistema: confere se os nomes são a mesma peça.
13. "E a nota fiscal? Vão ler o XML?" Não agora. O protótipo é a primeira fase: diz se o nome que cada fornecedor escreve é a mesma peça. No teste, traduziu 29 de 29 textos livres de fornecedores, como foram digitados em compras públicas. Ligar no sistema de cada usina é a etapa 4 e pede acesso.
14. "E quando parece, mas não é?" A AgroParts não junta: os cadastros ficam separados. No teste, não juntou nenhum dos 90 pares diferentes. Quem quiser conferir chama uma pessoa.
15. "Isso já não existe dentro das usinas?" O SAP e o Maximo checam duplicidade, cada um dentro do próprio sistema. A AgroParts compara as medidas e o tipo da peça de usina, em português, ao lado do sistema que a usina já tem. Mesmo no catálogo do governo, 1 em cada 12 cadastros de rolamento está repetido.

Se perguntarem:
- "Qual é a meta?" Hipótese, sem base ainda: 10 usinas até 2028, ou 600 mil reais por ano.
- "A Verusen é concorrente?" Hoje, é a prova de que o mercado paga por isso: ela captou 33 milhões de dólares nos Estados Unidos.
- "Vocês fazem piloto de graça?" Não: o piloto tem custo de equipe e servidor, e o valor se combina com a usina.

Versão de 30 segundos, se pedirem um resumo:
Numa usina, a mesma peça tem um nome em cada setor, e o sistema não acha o que está na prateleira.
A AgroParts lê a peça, compara e responde: é a mesma peça, ou precisa de uma pessoa.
Lá fora, isso já é negócio. Buscamos investimento, uma usina parceira e quem abra portas, a começar por um piloto numa usina.]`,
];

export const meta: SlideMeta = {
  title: 'AgroParts · Pitch final do Rota Inova UEMG 2026',
  createdAt: '2026-10-22T18:50:00.123Z',
};

export default [
  Abertura,
  DiaDeSafra,
  QuantoCusta,
  CadaSetorCadastra,
  UmEmDoze,
  Solucao,
  CadaSetorGanha,
  CincoPassos,
  ComoTestamos,
  ParesTestados,
  LaFora,
  ModeloDeNegocio,
  Mercado,
  Etapas,
  Pedido,
] satisfies Page[];
