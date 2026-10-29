// Páginas e peças de layout do pitch final da AgroParts no Rota Inova Day (29/10/2026), para as três variações:
// slides/agroparts-vfinal-a (enxuta), -b (com mais prova) e -c (curta). Cada variação só escolhe as páginas e a ordem;
// o texto de cada página vem de data/agroparts-vfinal/texto-<A|B|C>.md, e as notas são geradas desse mesmo texto.
// Na tela só entra número publicado (com o nome de quem publicou) ou número que o protótipo mediu.
import type { DesignSystem, Page } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

import fotoColheita from '../slides/rota-inova-pitch/assets/fotos/colheita-piracicaba.jpg';
import fotoRolamento from '../slides/rota-inova-pitch/assets/fotos/rolamento-com-tampa-6007.jpg';
import qrAgroparts from '../slides/rota-inova-pitch/assets/qr-agroparts.svg';
import fonteBold from '../slides/rota-inova-pitch/assets/fontes/Montserrat-Bold.ttf';
import fonteExtraBold from '../slides/rota-inova-pitch/assets/fontes/Montserrat-ExtraBold.ttf';
import fonteLight from '../slides/rota-inova-pitch/assets/fontes/Montserrat-Light.ttf';
import fonteRegular from '../slides/rota-inova-pitch/assets/fontes/Montserrat-Regular.ttf';
import fonteSemiBold from '../slides/rota-inova-pitch/assets/fontes/Montserrat-SemiBold.ttf';

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
const FONTES_ID = 'osd-webfont-agroparts-vfinal';
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

export const Abertura: Page = () => (
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

export const DiaDeSafra: Page = () => (
  <Pagina direita={LARGURA_FOTO + 100}>
    <Titulo tamanho={104}>O sistema diz que a peça não existe.</Titulo>
    <Medida style={{ marginTop: 56, fontSize: 64, fontWeight: 800, color: 'var(--osd-accent)' }}>Na prateleira, havia três.</Medida>
    <FotoLado src={fotoColheita} alt="Colheita mecanizada de cana" credito="Foto recortada: Mariordo, Wikimedia Commons, CC BY 3.0" />
  </Pagina>
);

// A pergunta e o valor por extenso, em duas linhas, para o "milhões" ocupar a página.
export const QuantoCusta: Page = () => (
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

export const CadaSetorCadastra: Page = () => (
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
export const UmEmDoze: Page = () => (
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

const SinalDuvida = ({ tamanho }: { tamanho?: number }) => (
  <Sinal tamanho={tamanho}>
    <path d="M8 56 A32 32 0 1 1 56 84 Q40 94 40 110" />
    <circle cx={40} cy={140} r={4} fill="#05f1c7" />
  </Sinal>
);

const SinalDuvidaPequeno = () => <SinalDuvida tamanho={110} />;

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
export const Solucao: Page = () => (
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

export const CadaSetorGanha: Page = () => (
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

export const CincoPassos: Page = () => (
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

// O teste numa página: os cadastros públicos do governo e o número de erros antes e depois de um ajuste.
// Contagens: docs/medicao/gabarito-v1.md (104 comparações de 42 cadastros do CATMAT; 6 erros na primeira execução,
// por um defeito que lia "6206-2Z" sem o final; 0 depois do conserto). Refaça com `bun run medir`.
const Rodada = ({ quando, erros }: { quando: string; erros: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 36, borderTop: '8px solid var(--osd-accent)' }}>
    <span style={{ fontSize: 56, lineHeight: 1.08, fontWeight: 800 }}>{quando}</span>
    <span style={{ fontSize: 200, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--osd-accent)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
      {erros}
    </span>
  </div>
);

export const OTeste: Page = () => (
  <Pagina>
    <Titulo tamanho={80} largura={1500}>
      Testamos com cadastros reais e públicos do governo
    </Titulo>
    <div style={{ marginTop: 80, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 120 }}>
      <Rodada quando="1ª rodada" erros="6 erros" />
      <Rodada quando="Depois de um ajuste" erros="0 erros" />
    </div>
    <Medida style={{ marginTop: 72, color: suave }}>Qualquer pessoa pode refazer o teste.</Medida>
  </Pagina>
);

// O resultado do teste em palavras: as comparações que eram a mesma peça e as que só pareciam.
// Os exemplos são cadastros reais do teste: CATMAT 283529 (6312 ZZ) com 472657 (6312-2Z) e com 311967 (6312ZZ C3).
const Codigo = ({ children }: { children: ReactNode }) => (
  <span data-caixa style={{ padding: '12px 24px', background: placa, fontSize: 44, lineHeight: 1.2, fontWeight: 800, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

const Grupo = ({ titulo, sinal, a, b, placar, verbo }: { titulo: string; sinal: ReactNode; a: ReactNode; b: ReactNode; placar: string; verbo: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
    {/* Duas linhas nos dois grupos, para os códigos e os números ficarem na mesma altura. */}
    <span style={{ minHeight: 110, fontSize: 50, lineHeight: 1.1, fontWeight: 800, textWrap: 'balance' }}>{titulo}</span>
    <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 16 }}>
      <Codigo>{a}</Codigo>
      {sinal}
      <Codigo>{b}</Codigo>
    </div>
    <span style={{ marginTop: 48, fontSize: 140, lineHeight: 1, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--osd-accent)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
      {placar}
    </span>
    <span style={{ marginTop: 16, fontSize: 48, fontWeight: 700 }}>{verbo}</span>
  </div>
);

export const OResultado: Page = () => (
  <Pagina>
    <Titulo largura={1500}>Em 104 comparações</Titulo>
    <div style={{ marginTop: 80, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 96 }}>
      <Grupo titulo="A mesma peça, escrita de outro jeito" sinal={<SinalIgual tamanho={72} estreito />} a="6312 ZZ" b="6312-2Z" placar="14 de 14" verbo="achadas" />
      <Grupo
        titulo="Parecidas, mas diferentes"
        sinal={<SinalDiferente tamanho={72} estreito />}
        a="6312 ZZ"
        b={
          <>
            6312ZZ <Destaque>C3</Destaque>
          </>
        }
        placar="0 de 90"
        verbo="juntadas"
      />
    </div>
  </Pagina>
);

// ---------- Ato 3, Alberto: o negócio e o pedido ----------

// Lá fora já se paga por isso; aqui, ninguém faz para usina.
export const LaFora: Page = () => (
  <Pagina>
    <Titulo>Lá fora, isso já é negócio</Titulo>
    <Valor prefixo="US$" sufixo="mi" style={{ marginTop: 56 }}>
      10,5
    </Valor>
    <Medida style={{ marginTop: 28 }}>de economia numa fabricante, segundo a Verusen</Medida>
    <Medida style={{ marginTop: 64, fontSize: 60, fontWeight: 800, color: 'var(--osd-accent)' }}>No Brasil, para usina, não achamos ninguém.</Medida>
  </Pagina>
);

// Quem paga e quantos podem pagar, sem preço. UNICA, 22/06/2026: 250 unidades operando no Centro-Sul.
export const QuemPaga: Page = () => (
  <Pagina>
    <Titulo>A usina paga uma assinatura</Titulo>
    <Valor style={{ marginTop: 64 }}>250</Valor>
    <Medida style={{ marginTop: 28 }}>usinas operando no Centro-Sul, segundo a UNICA</Medida>
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

// O pedido, nas palavras do Myke: investimento em dinheiro e em conhecimento, e acesso a uma usina e a quem conhece
// o sistema dela. Sem preço e sem etapas. À direita, o QR que abre o protótipo.
const Item = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', alignItems: 'baseline', columnGap: 28 }}>
    <span style={{ width: 24, height: 24, background: 'var(--osd-accent)', display: 'block' }} />
    <span style={{ fontSize: 60, lineHeight: 1.1, fontWeight: 800, textWrap: 'balance' }}>{children}</span>
  </div>
);

export const Pedido: Page = () => (
  <Pagina>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 100 }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Titulo tamanho={80} largura={1000}>
          Queremos investimento para construir a AgroParts
        </Titulo>
        <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Item>Dinheiro</Item>
          <Item>Conhecimento</Item>
          <Item>Acesso a uma usina e a quem conhece o sistema dela</Item>
        </div>
      </div>
      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28, paddingTop: 14 }}>
        <QrCode tamanho={420} />
        <Link tamanho={40} />
      </div>
    </div>
  </Pagina>
);

// ---------- Só na variação curta (C) ----------

// As duas respostas e o ganho de cada setor numa página só.
const GanhoCurto = ({ setor, children }: { setor: string; children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <span style={{ fontSize: 32, fontWeight: 600, color: suave }}>{setor}</span>
    <span style={{ fontSize: 50, lineHeight: 1.08, fontWeight: 800, textWrap: 'balance' }}>{children}</span>
  </div>
);

export const RespostaEGanho: Page = () => (
  <Pagina>
    <Titulo tamanho={80} largura={1300}>
      A AgroParts confere a peça e responde
    </Titulo>
    <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <SinalIgual tamanho={110} />
        <span style={{ fontSize: 64, lineHeight: 1.08, fontWeight: 800 }}>É a mesma peça</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <SinalDuvidaPequeno />
        <span style={{ fontSize: 64, lineHeight: 1.08, fontWeight: 800 }}>Precisa de uma pessoa</span>
      </div>
    </div>
    <div style={{ marginTop: 96, paddingTop: 48, borderTop: `4px solid ${placa}`, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', columnGap: 80 }}>
      <GanhoCurto setor="Almoxarifado">Acha a peça</GanhoCurto>
      <GanhoCurto setor="Manutenção">Sabe se já tem</GanhoCurto>
      <GanhoCurto setor="Compras">Não compra de novo</GanhoCurto>
    </div>
  </Pagina>
);
