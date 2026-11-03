# Esboço de F4: o arquivo de chaves que volta ao ERP

Esboço direto de `architect`, sem arena: o arquivo é uma projeção do lote que já existe, e trocar as colunas não tem custo antes de uma usina carregar.
O bloco `ts` é um arquivo novo inteiro. Ele compila contra o motor de hoje, onde `src/motor/lote.ts` já exporta o escape `celulaCsv` (fatia 1 de [F2](../f2-sku-contra-agrupamento/README.md)).

## Problema

O `/diagnostico` já devolve o mapa de códigos em CSV, uma linha por item, com 10 colunas.
Esse arquivo serve à análise, mas a equipe do ERP precisa de outra coisa: só os grupos de mesma peça, um código por linha, com a chave e a evidência.
O SAP é um ERP entre vários, então o primeiro arquivo é genérico, e um formato próprio só vem depois de ver o modelo de carga de uma usina.

## Uso

```ts
import { arquivoDeChaves, chavesParaCsv } from "../src/motor/chaves";

const arquivo = arquivoDeChaves(lote); // o mesmo lote que a página já mostra
if (arquivo.linhas.length) baixar("arquivo-de-chaves.csv", chavesParaCsv(arquivo));
// arquivo.sem_codigo vai para a tela como contagem.
```

## Forma

```ts
// src/motor/chaves.ts
// F4: o arquivo de chaves que a equipe do ERP da usina carrega, qualquer que seja o ERP.
// Só entra o que já é SAME_AS em `lote.grupos_duplicidade`. Nenhum campo apaga, funde ou reescreve registro (ADR 0001).
import { especificar } from "./especificacao";
import { celulaCsv, type ResultadoLote } from "./lote";
import type { Evidencia, TipoRelacao } from "./tipos";

/** Uma linha por código legado de cada grupo de duplicidade, com a evidência que sustenta a chave. */
export interface LinhaChave {
  grupo: number;
  codigo: string;
  texto_original: string;
  relacao: Extract<TipoRelacao, "SAME_AS">;
  chave: string;
  designacao: string;
  descricao_por_regra: string;
  evidencias: Evidencia[];
  motivos: string[];
  versao_regras: string;
}

export interface ArquivoDeChaves {
  linhas: LinhaChave[];
  grupos: number;
  /** Cadastros de algum grupo que vieram sem código. Ficam fora do arquivo, porque o ERP não tem como achá-los. */
  sem_codigo: number;
}

/**
 * Lê os grupos de duplicidade do lote e monta uma linha por código.
 * A evidência vem de `especificar` sobre o mesmo texto, então não existe segunda regra de identidade.
 * Recebe o lote inteiro: a visão por tipo de F2 não tem por onde entrar.
 */
export function arquivoDeChaves(lote: ResultadoLote): ArquivoDeChaves {
  // TODO para cada linha com grupo_duplicidade:
  //   sem original.codigo -> sem_codigo++
  //   senão r = especificar(original.texto); evidencias = r.evidencias; descricao_por_regra e designacao da linha
  //   ordem: grupo, depois código, para o arquivo sair igual a cada execução
  throw new Error("not implemented");
}

/**
 * CSV genérico, com cabeçalho e separador vírgula, que qualquer ERP importa.
 * O texto original vai intacto. As evidências vão como "fonte (url)", separadas por " | ".
 * Formato próprio de SAP, de TOTVS ou de outro ERP só depois de ver o modelo de carga de uma usina.
 */
export function chavesParaCsv(a: ArquivoDeChaves): string {
  // TODO cabeçalho + uma linha por LinhaChave, cada célula por celulaCsv, o mesmo escape do mapa de códigos
  throw new Error("not implemented");
}
```

### O que os tipos garantem

- `relacao` só pode ser `SAME_AS`. Uma visão por tipo, uma referência cruzada ou um intercâmbio não entram no arquivo.
- `arquivoDeChaves` recebe o lote, e não grupos soltos, então só `grupos_duplicidade` alimenta o arquivo.
- Não há campo de ação, fusão ou apagamento.

## Tradeoffs aceitos

- Aceitamos rodar `especificar` de novo nos itens dos grupos, em troca de não pôr as evidências em cada linha do lote e na resposta de `/api/lote`.
- Aceitamos deixar fora do arquivo os cadastros sem código, em troca de cada linha poder ser achada no ERP.
- Aceitamos um CSV genérico, em troca de não otimizar para um ERP antes de ver o fluxo de uma usina.

## Alternativas consideradas

- **Acrescentar colunas ao CSV de hoje.** Perdeu porque o CSV de hoje é o mesmo de `/api/lote?formato=csv` ([ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md)), e quem integra pela API passaria a receber colunas de outro público.
- **Sugerir o código preferido e os candidatos a bloqueio.** Perdeu porque sem dado de uso (pedidos, saldo, data) qualquer escolha seria uma regra inventada. O modelo de carga da usina diz que coluna de decisão ela precisa.

## Perguntas abertas e riscos

- Que modelo de carga a equipe do ERP usa, e ele aceita mapeamento sem fusão? Ticket [`obter-modelo-de-carga-do-erp`](../../docs/wayfinder/partsgraph/tickets/obter-modelo-de-carga-do-erp.md).
- O arquivo fica como a entrega ao ERP, ou a entrega passa a ser por API? Ticket [`decidir-devolucao-por-arquivo-ou-api`](../../docs/wayfinder/partsgraph/tickets/decidir-devolucao-por-arquivo-ou-api.md).

## Próximo passo

Implementar `arquivoDeChaves` e `chavesParaCsv`, com teste sobre o arquivo de teste do F1 ([fatia 1](slices/01-arquivo-generico.md)).
