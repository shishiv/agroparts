# Esboço de F5: foto com Box, OCR e conferência do Jev

Esboço direto de `architect`, sem arena: tudo é medição em `scripts/`, e o site não muda nesta fase.
Cada bloco `ts` que começa com `// <caminho>` é um arquivo novo inteiro, e o conjunto compila contra o motor de hoje.

## Problema

O site já lê a foto com tesseract.js no navegador, e a pessoa confere o texto antes de resolver ([ADR 0021](../../docs/decisoes/adr-0021-pilha-do-prototipo-publico.md) e [ADR 0008](../../docs/decisoes/adr-0008-camera-para-leitura-de-codigo.md)).
Na foto do anel gravado, o Tesseract devolveu lixo com confiança de 31% ([fontes do protótipo](../../docs/pesquisa/fontes-do-prototipo.md)).
F5 pergunta se achar a região do código antes de ler, e conferir o que foi lido, melhora a leitura.
A medida tem de ser a mesma para as duas cadeias: o que o motor faz com o texto lido.

## Uso

```ts
const casos = await carregarFotos(); // dados/publico/fotos-etiqueta/, com a licença de cada foto
const base = await medirLeitura(casos, tesseractNaFotoInteira());
const box = await medirLeitura(casos, boxRecorteConferencia({ chave, modelo: "jev-1.14.0", cache: "dados/local/cache-jev" }));
```

## Forma

O julgamento fica em `scripts/leitura.ts`, porque só a medição usa, e serve a F5 e a F6.

```ts
// scripts/leitura.ts
// F5: o que uma cadeia de leitura devolve de uma foto, e como a medição julga essa leitura.
// A foto nunca decide a peça (ADR 0008). O texto lido passa por `especificar`, como qualquer descrição.
// Fica em scripts/ porque só a medição de F5 e de F6 usa.
import { chaveIdentidade, especificar } from "../src/motor/especificacao";

/** Região da imagem em pixels, na imagem já em pé (a API da TypeSafe ignora o EXIF). */
export interface Recorte {
  x: number;
  y: number;
  largura: number;
  altura: number;
}

export type LeituraDeFoto =
  | { tipo: "lida"; texto: string; confianca_ocr: number; recorte: Recorte | null; conferencia: "confirmada" | "recusada" | "nao_conferida" }
  | { tipo: "sem_texto"; motivo: string };

/** Uma foto do benchmark, com a designação que a etiqueta ou o anel mostram e a licença da imagem. */
export interface CasoFoto {
  id: string;
  /** Caminho dentro de `dados/publico/fotos-etiqueta/`. */
  arquivo: string;
  /** Chave de identidade esperada, no formato de `chaveIdentidade`. */
  chave_esperada: string;
  fonte: string;
  licenca: string;
}

/** O que o motor faz com um texto lido de foto ou de fala, contra a chave esperada. F6 usa o mesmo julgamento. */
export type JulgamentoDeTexto = "chave_certa" | "designacao_basica_certa" | "errada" | "sem_designacao";
export type JulgamentoDeLeitura = JulgamentoDeTexto | "sem_texto";

/**
 * Julga um texto pelo que o motor faz com ele, sem pessoa no meio.
 * No produto, a pessoa confere o texto antes de resolver. A medição mede só a leitura.
 */
export function julgarTexto(texto: string, chaveEsperada: string): JulgamentoDeTexto {
  const r = especificar(texto);
  if (r.especificacao && r.decisao === "resolve" && chaveIdentidade(r.especificacao) === chaveEsperada) return "chave_certa";
  // TODO designacao_basica_certa quando r.especificacao?.designacao_basica é a primeira parte de chaveEsperada;
  //   sem_designacao quando não há especificação; errada no resto
  throw new Error("not implemented");
}

export function julgarLeitura(leitura: LeituraDeFoto, caso: CasoFoto): JulgamentoDeLeitura {
  return leitura.tipo === "sem_texto" ? "sem_texto" : julgarTexto(leitura.texto, caso.chave_esperada);
}

/** Uma linha por cadeia. Números absolutos (ADR 0014). */
export interface MedicaoLeitura {
  cadeia: string;
  versao: string;
  fotos: number;
  contagem: Record<JulgamentoDeLeitura, number>;
  /** Leituras que a conferência do Jev recusou. Zero para a cadeia sem Jev. */
  recusadas_na_conferencia: number;
}
```

As cadeias ficam em `scripts/`, longe do site.

```ts
// scripts/fotos/cadeias.ts
// As duas cadeias de leitura que F5 compara. Ficam em scripts/: a segunda precisa de chave e fala com a TypeSafe.
import type { CasoFoto, LeituraDeFoto, MedicaoLeitura } from "../leitura";

export interface CadeiaDeLeitura {
  nome: string;
  versao: string;
  ler(caso: CasoFoto): Promise<LeituraDeFoto>;
}

/** A linha de base: o mesmo tesseract.js 7 e o mesmo modelo `eng` que o site usa, na foto inteira. */
export function tesseractNaFotoInteira(): CadeiaDeLeitura {
  // TODO createWorker com public/ocr/eng.traineddata.gz; recognize(foto inteira); conferencia = "nao_conferida"
  throw new Error("not implemented");
}

export interface OpcoesBox {
  chave: string;
  /** Modelo fixo que aceita imagem, por exemplo `jev-1.14.0`. */
  modelo: string;
  cache: string;
}

/**
 * Box do Jev acha a região do código, o Tesseract lê só o recorte, e o Jev confere o valor lido contra o recorte.
 * As imagens do Jev ainda não são de produção: o pedido leva o cabeçalho que a TypeSafe exige para imagem.
 */
export function boxRecorteConferencia(opcoes: OpcoesBox): CadeiaDeLeitura {
  // TODO 1. Box: a região onde está a designação, com a confiança; sem região -> sem_texto
  //   2. recortar com margem e ler com o mesmo Tesseract da linha de base
  //   3. conferir: o Jev julga se o recorte mostra o texto lido; "recusada" não vira leitura certa
  //   cache por sha256(modelo + etapa + bytes da imagem + texto), em dados/local/
  throw new Error("not implemented");
}

/** Roda uma cadeia em todas as fotos do benchmark e conta os julgamentos. */
export async function medirLeitura(casos: readonly CasoFoto[], cadeia: CadeiaDeLeitura): Promise<MedicaoLeitura> {
  // TODO julgarLeitura(await cadeia.ler(caso), caso) para cada caso
  throw new Error("not implemented");
}
```

### O que os tipos garantem

- Uma leitura `recusada` pela conferência existe como estado próprio e não se confunde com texto lido certo.
- `julgarTexto` passa o texto por `especificar`, então não existe regra de identidade só para foto. F6 usa o mesmo `julgarTexto` para a fala.
- Nenhum tipo daqui carrega `Decisao` de resolução: a foto não resolve.

## Tradeoffs aceitos

- Aceitamos medir pelo resultado do motor, e não pela igualdade de caracteres, em troca de medir o que importa para a pessoa.
- Aceitamos que o site não mude em F5, em troca de não mandar foto de usuário à TypeSafe antes do ticket do dado de cliente.

## Alternativas consideradas

- **Ler a foto direto com o Jev, sem Tesseract.** Perdeu porque o Jev escolhe e julga, e não gera texto. O OCR continua sendo o Tesseract.
- **Classificar a peça pela imagem.** Perdeu pelo ADR 0008: peças iguais por fora se distinguem por dimensão e especificação.

## Perguntas abertas e riscos

- Que fotos, com designação conhecida e licença conferida, formam o benchmark? Ticket [`montar-fotos-de-etiqueta-com-licenca`](../../docs/wayfinder/partsgraph/tickets/montar-fotos-de-etiqueta-com-licenca.md).
- A TypeSafe pode mudar o formato das imagens, que ainda não é de produção. Uma mudança no meio da medição dá INCONCLUSIVE.

## Próximo passo

Montar o benchmark de fotos com o pré-registro e medir a linha de base do Tesseract na foto inteira ([fatia 1](slices/01-fotos-e-linha-de-base.md)).
