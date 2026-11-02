# Fatia 1: pré-registro, benchmark público e a régua

## Contrato que destrava

Um benchmark de família congelado, com rótulo que não vem do motor, e o número da régua que o Jev precisa vencer.

## Costura

- `dados/preregistro/f3-familia.json`, em commit próprio e antes do benchmark: a regra de seleção, a regra de exclusão, os estratos, as métricas, o limiar de cada classificador e os limites do [README](../README.md).
- `scripts/baixar-dados.ts` ganha a árvore do CATMAT nos grupos escolhidos e as linhas de compra dessas classes, gravadas em `dados/publico/catmat-arvore-manutencao.json` e `dados/publico/compras-familia.json`, com fonte, data da consulta e licença.
- `scripts/familia.ts`: os tipos, `regua` e `medirFamilia`, como no [esboço](../esboco.md). Ficam em `scripts/` porque só a medição usa.
- `scripts/medir-familia.ts`: grava `docs/medicao/familia-v1.md`.

## Regras que o pré-registro fixa

- A sugestão do plano para a seleção são os grupos 25, 28, 29, 30, 31, 43, 47 e 53 do CATMAT, de peças de máquina. Confira as classes na API pública na hora de gravar.
- O texto do caso é o campo `marca` da linha de compra. O rótulo é o PDM do item em que o fornecedor cotou.
- Ficam de fora os textos que são só nome de marca, por uma regra escrita antes de olhar os casos.
- A régua usa o mesmo `tokens` de `src/motor/identidade.ts`.

## O que a pessoa roda

`bun scripts/medir-familia.ts`, e depois abre `docs/medicao/familia-v1.md`.

## Verificação

- O `git log` mostra o pré-registro antes do benchmark e do relatório.
- Rodar `bun run dados` de novo dá o mesmo benchmark, conferido por hash. Se a API do Compras.gov.br mudar e o hash não bater, o benchmark vira INCONCLUSIVE e não se ajusta à mão.
- Um teste em `tests/familia.test.ts` roda a régua num punhado de casos do benchmark e confere o formato da medição.
- `bun run medir` continua dando as tabelas da v1 sem mudança.

## Decisões delegadas

- O limite de linhas por PDM, desde que fique no pré-registro.
- A forma da tabela do relatório, desde que cada porcentagem venha com o número absoluto.

## O que fica verde

`bun run test`, `bun run build` e a medição v1.

## O que mudaria esta fatia

Se o campo `marca` das classes escolhidas tiver poucos textos de peça, troque a seleção num pré-registro novo, sem apagar o anterior.
