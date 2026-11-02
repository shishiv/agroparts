# F1: diagnóstico grátis de duplicidade no navegador (fechado)

Entregue no [PR 27](https://github.com/shishiv/agroparts/pull/27), sob o [ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md).
Este spec foi escrito depois da entrega, como registro.
As fases seguintes estão no [índice dos specs](../README.md).

## Pergunta

Uma usina consegue soltar a planilha exportada do ERP numa página e ver quais códigos são a mesma peça, sem que o arquivo saia do navegador dela?

## O que entrou

- A página `/diagnostico` (`web/diagnostico.html` e `web/diagnostico.ts`) lê um CSV no navegador com `web/csv.ts` e roda o mesmo `traduzirLote` de `src/motor/lote.ts`.
- O CSV de resultado sai de `loteParaCsv`, com as mesmas colunas de `/api/lote?formato=csv`.
- A página só abre por link: ela não aparece na navegação do site e leva `noindex`.
- O arquivo de teste sai de `bun scripts/arquivo-diagnostico.ts <saida.csv>`, com os 396 itens ativos do CATMAT e os 233 textos distintos de fornecedor.

## Veredito técnico: VERIFIED

O critério é o do plano enxuto: os números de hoje não mudam, o arquivo não sai do navegador e o resultado bate com o motor.
A prova está em [`docs/medicao/diagnostico-navegador/`](../../docs/medicao/diagnostico-navegador/README.md).

- A tela e o `traduzirLote` concordam no mesmo arquivo: 629 itens lidos, 307 na família e 322 fora, 55 grupos, 44 deles juntando código do CATMAT e texto de fornecedor, e 84 para uma pessoa.
- O CSV baixado é idêntico byte a byte ao `loteParaCsv`.
- O registro de rede tem 11 pedidos GET do próprio site e nenhum com corpo.
- No celular de 390 px, a página não rola na horizontal.

## O que ficou de fora, e por quê

- O arquivo de 30 mil linhas no celular, o XLSX e a contagem de uso saíram do primeiro passo pelo plano enxuto, para não construir antes de uma usina usar.
- O ADR 0022 registra que arquivo muito grande em celular não foi medido e que a página não conta uso.

## O que continua aberto

- A ativação: quantas usinas convidadas terminam o diagnóstico e acham um grupo verdadeiro. O veredito é INCONCLUSIVE até a primeira usina rodar. Ticket [`medir-ativacao-do-diagnostico`](../../docs/wayfinder/partsgraph/tickets/medir-ativacao-do-diagnostico.md).
- A ajuda de exportação por ERP dentro da página. Ticket [`ajuda-de-exportacao-por-erp`](../../docs/wayfinder/partsgraph/tickets/ajuda-de-exportacao-por-erp.md).

## Invariantes que as fases seguintes herdam

- O arquivo da usina não sai do navegador. Nenhuma fase manda o conteúdo dele a um servidor sem um ADR novo que substitua o 0022 nesse ponto.
- A página e a API rodam o mesmo motor. Uma regra nova entra em `src/motor/` e vale para as duas.
- A página diz o que lê: rolamento rígido de esferas das séries 60, 62 e 63, e quantos itens ficaram fora dessa família.
