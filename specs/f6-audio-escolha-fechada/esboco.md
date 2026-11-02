# Esboço de F6: áudio que vira texto, com escolha fechada

<!-- depende: f5-foto-box-ocr -->

Esboço direto de `architect`, sem arena: tudo é medição em `scripts/`, e o site não muda nesta fase.
Cada bloco `ts` que começa com `// <caminho>` é um arquivo novo inteiro. O conjunto compila contra o motor de hoje somado ao [esboço de F5](../f5-foto-box-ocr/esboco.md), de onde vem `julgarTexto`.

## Problema

O Jev não aceita áudio, então a fala entra como transcrição de um modelo local.
A transcrição devolve palavras ("seis dois zero seis"), e o motor lê designações escritas ("6206").
O texto "troquei o rolamento 6206 2RS" já resolve hoje, então o passo que falta é uma tabela de palavras em código.
O Jev entra só se a regra não bastar, e só escolhe numa lista fechada.

## Uso

```ts
const transcritor = transcritorEscolhido(); // o do ticket escolher-transcritor-local
const regra = await medirFala(casos, transcritor);
const comJev = await medirFala(casos, transcritor, escolhaDoJev({ chave, modelo: "jev-1.14.0", cache: "dados/local/cache-jev" }));
```

## Forma

A tabela de palavras e a lista fechada ficam em `scripts/fala/`, porque só a medição usa. O julgamento é o `julgarTexto` de F5.

```ts
// scripts/fala/fala.ts
// F6: da transcrição de uma fala ao texto que o motor lê. O julgamento é o `julgarTexto` de F5.
// O áudio não decide nada. A pessoa confere o texto, como confere o OCR (ADR 0008).
import type { ResultadoLote } from "../../src/motor/lote";

/** O que o transcritor local devolveu, com o nome e a versão fixa dele. */
export interface Transcricao {
  texto: string;
  transcritor: string;
  versao: string;
}

/**
 * Troca números e sufixos falados pela escrita da designação: "seis dois zero seis dois RS" vira "6206 2RS",
 * "zê zê" vira "ZZ" e "cê três" vira "C3". É uma tabela de palavras em código. Palavra fora da tabela fica como veio.
 */
export function textoFalado(t: Transcricao): string {
  // TODO tabela de dígitos falados (zero a nove, e as formas "meia" e "dez" se o pré-registro as incluir),
  //   juntar dígitos seguidos num número só e as letras de sufixo soletradas (zê, erre, esse, cê)
  throw new Error("not implemented");
}

/** Uma gravação do benchmark: da equipe, com consentimento registrado. */
export interface CasoFala {
  id: string;
  /** Caminho dentro de `dados/local/falas/`, que o git ignora: voz é dado pessoal e não vai ao repositório público. */
  arquivo: string;
  chave_esperada: string;
  ruido: "oficina" | "silencio";
}

/** Uma opção fechada para a escolha: uma chave de identidade do cadastro. */
export interface Candidato {
  chave: string;
  designacao: string;
  descricao_por_regra: string;
}

/**
 * As chaves de identidade do cadastro, uma por chave. No dado público, são as 150 chaves do CATMAT que resolvem.
 * As peças de uma máquina só entram como opções depois de F7, com consumo real, e mesmo assim não viram COMPATIBLE_WITH (ADR 0013).
 */
export function candidatosDoCadastro(lote: ResultadoLote): Candidato[] {
  // TODO uma entrada por lote.linhas[i].chave distinta, com a designação e a descrição por regra da primeira linha
  throw new Error("not implemented");
}
```

O transcritor e a escolha do Jev ficam em `scripts/`.

```ts
// scripts/fala/cadeias.ts
// As duas cadeias que F6 compara. Ficam em scripts/: a transcrição roda local, e a escolha do Jev precisa de chave.
import type { Candidato, CasoFala, Transcricao } from "./fala";
import type { JulgamentoDeTexto } from "../leitura";

/** O transcritor local, com licença do código, dos pesos e do runtime conferidas antes de entrar. */
export interface Transcritor {
  nome: string;
  versao: string;
  transcrever(caso: CasoFala): Promise<Transcricao>;
}

export type EscolhaFechada = { tipo: "escolhido"; chave: string; confianca: number } | { tipo: "nenhum"; confianca: number };

export interface OpcoesEscolha {
  chave: string;
  /** Modelo fixo, por exemplo `jev-1.14.0`. */
  modelo: string;
  cache: string;
}

/**
 * O Jev escolhe uma chave numa lista fechada, com "nenhum" como opção, nas duas ordens.
 * O código corta a lista antes: só entram candidatos cuja designação básica aparece no texto falado.
 * Sem designação no texto, a resposta é "nenhum", sem chamar a API.
 */
export function escolhaDoJev(opcoes: OpcoesEscolha): (texto: string, candidatos: readonly Candidato[]) => Promise<EscolhaFechada> {
  // TODO filtrar candidatos por designação básica; perguntar com a ordem direta e a inversa; respostas diferentes = "nenhum"
  //   cache por sha256(modelo + texto + candidatos na ordem), em dados/local/
  throw new Error("not implemented");
}

/** Uma linha por cadeia: só a regra do motor, ou a regra mais a escolha do Jev. Números absolutos (ADR 0014). */
export interface MedicaoFala {
  cadeia: "regra" | "regra_e_jev";
  transcritor: string;
  gravacoes: number;
  por_ruido: Record<CasoFala["ruido"], Record<JulgamentoDeTexto, number>>;
}

export async function medirFala(casos: readonly CasoFala[], transcritor: Transcritor, escolha?: ReturnType<typeof escolhaDoJev>): Promise<MedicaoFala> {
  // TODO texto = textoFalado(await transcritor.transcrever(caso)); julgarTexto(texto, caso.chave_esperada)
  //   com escolha: quando a regra não dá chave_certa, a chave escolhida pelo Jev é julgada contra caso.chave_esperada
  throw new Error("not implemented");
}
```

### O que os tipos garantem

- A escolha do Jev só devolve uma chave da lista ou "nenhum".
- Fala e foto passam pelo mesmo `julgarTexto`, então as duas fases medem igual e não existe regra de identidade só para áudio.
- `candidatosDoCadastro` lê o lote, então a lista fechada são chaves de identidade, e não peças de uma máquina.

## Tradeoffs aceitos

- Aceitamos uma tabela de palavras simples, em troca de uma regra que se lê e se testa.
- Aceitamos tratar como "nenhum" a resposta do Jev que muda com a ordem, em troca de não contar como acerto uma escolha instável.

## Alternativas consideradas

- **Mandar a transcrição inteira ao Jev sem regra antes.** Perdeu porque a regra em código já resolve o caso comum, e o Jev passaria a decidir o que o código decide.
- **Usar as peças da máquina como lista fechada já agora.** Perdeu porque essa lista só existe com o consumo real de F7.

## Perguntas abertas e riscos

- Qual transcritor tem licença conferida e roda onde precisamos? Ticket [`escolher-transcritor-local`](../../docs/wayfinder/partsgraph/tickets/escolher-transcritor-local.md).
- Formas faladas como "sessenta e dois zero seis" pedem mais palavras na tabela. O pré-registro lista as frases antes de gravar.

## Próximo passo

Gravar o pré-registro e as frases da equipe, e implementar `textoFalado` com os testes de frases escritas à mão ([fatia 1](slices/01-transcricao-e-regra.md)).
