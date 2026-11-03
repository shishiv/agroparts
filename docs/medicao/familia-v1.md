# Medição de família v1

Este arquivo é gerado por `bun scripts/medir-familia.ts`. Não edite à mão.

- Pré-registro: [`dados/preregistro/f3-familia.json`](../../dados/preregistro/f3-familia.json), versão f3-familia-v1, em commit anterior ao benchmark e a este relatório.
- Árvore: CATMAT consultado em 2026-11-03, sha256 7f5db1e8d264.
- Toda porcentagem vem com o número absoluto. Não existe acurácia única.

## Veredito de F3

**INCONCLUSIVE**.

- o Jev não foi medido: a fatia 2 espera o ticket [`conferir-termos-e-chave-da-typesafe`](../wayfinder/partsgraph/tickets/conferir-termos-e-chave-da-typesafe.md).
- 3 de 8 estratos têm menos que 100 casos: 28 (88), 30 (44), 31 (60).

O benchmark se reproduz por hash: cada nova execução de `bun run dados` deu o mesmo sha256 nos dois arquivos.

As tabelas abaixo medem só a régua. Elas dão o número que o Jev precisa vencer em cada estrato.

## Benchmark

| Etapa | Contagem |
|---|---:|
| Grupos, classes e PDMs ativos na árvore | 8, 55 e 1078 |
| Linhas de compra lidas na janela | 107203 |
| Textos distintos gravados (PDM, campo marca) | 36538 |
| Linhas fora: codigoPdm diferente do consultado | 0 |
| Pares (texto normalizado, PDM) | 30222 |
| Pares fora: sem token | 305 |
| Pares fora: só nome de marca | 16273 |
| Pares fora: rótulo ambíguo | 2826 |
| Pares fora: acima do limite por PDM | 8287 |
| Casos | 2531, de 411 PDMs |

- Árvore: sha256 `7f5db1e8d26434bb215049ad5122b75c1c668d5290337613096bde87db9e8ab7`, consulta de 2026-11-03, conferências: 2 que bateram e 0 que não bateram.
- Compras: sha256 `66a092ce253a61628e3946cf386ef86ff80dc26c826e77c287d7f2a1390c8122`, consulta de 2026-11-03, conferências: 1 que bateram e 0 que não bateram.

## Régua por grupo do CATMAT

Régua versão 1, limiar 1: na faixa só quando todas as palavras do nome do PDM estão no texto.

| Grupo | Casos | Na faixa (cobertura) | Corretos na faixa | Erro na faixa | Limite superior de 95% do erro | Nenhum | Mudou com a ordem |
|---|---:|---:|---:|---:|---:|---:|---:|
| 25 COMPONENTES DE VEÍCULOS | 442 | 66/442 (14,9%) | 40/66 (60,6%) | 26/66 (39,4%) | 50,3% | 215/442 (48,6%) | 0/442 (0,0%) |
| 28 MOTORES, TURBINAS E SEUS COMPONENTES | 88 | 7/88 (8,0%) | 5/7 (71,4%) | 2/7 (28,6%) | 65,9% | 65/88 (73,9%) | 0/88 (0,0%) |
| 29 ACESSÓRIOS DE MOTORES | 417 | 83/417 (19,9%) | 34/83 (41,0%) | 49/83 (59,0%) | 68,2% | 243/417 (58,3%) | 0/417 (0,0%) |
| 30 EQUIPAMENTOS DE TRANSMISSÃO DE FORÇA MECÂNICA | 44 | 0/44 (0,0%) | 0/0 (não se aplica) | 0/0 (não se aplica) | não se aplica | 33/44 (75,0%) | 0/44 (0,0%) |
| 31 ROLAMENTOS E MANCAIS | 60 | 7/60 (11,7%) | 3/7 (42,9%) | 4/7 (57,1%) | 87,1% | 51/60 (85,0%) | 0/60 (0,0%) |
| 43 BOMBAS E COMPRESSORES | 211 | 47/211 (22,3%) | 18/47 (38,3%) | 29/47 (61,7%) | 73,6% | 134/211 (63,5%) | 0/211 (0,0%) |
| 47 CANOS, TUBOS, MANGUEIRAS E ACESSÓRIOS | 460 | 107/460 (23,3%) | 62/107 (57,9%) | 45/107 (42,1%) | 50,5% | 175/460 (38,0%) | 0/460 (0,0%) |
| 53 FERRAGENS E ABRASIVOS | 809 | 254/809 (31,4%) | 167/254 (65,7%) | 87/254 (34,3%) | 39,5% | 363/809 (44,9%) | 0/809 (0,0%) |

## O que o Jev precisa fazer em cada grupo

Pela regra do pré-registro: erro máximo de 5,0% pelo limite superior de 95%, margem de 5,0 pontos sobre a régua, pelo menos 100 casos por estrato e no máximo 1,0% dos casos mudando com a ordem das opções.

| Grupo | Casos suficientes | Para vencer a régua |
|---|---|---|
| 25 COMPONENTES DE VEÍCULOS | sim | erro na faixa até 5,0%, com cobertura de pelo menos 14,9% |
| 28 MOTORES, TURBINAS E SEUS COMPONENTES | não, 88 de 100 | erro na faixa até 5,0%, com cobertura de pelo menos 8,0% |
| 29 ACESSÓRIOS DE MOTORES | sim | erro na faixa até 5,0%, com cobertura de pelo menos 19,9% |
| 30 EQUIPAMENTOS DE TRANSMISSÃO DE FORÇA MECÂNICA | não, 44 de 100 | a régua não respondeu na faixa; o pré-registro não fixa a margem neste caso |
| 31 ROLAMENTOS E MANCAIS | não, 60 de 100 | erro na faixa até 5,0%, com cobertura de pelo menos 11,7% |
| 43 BOMBAS E COMPRESSORES | sim | erro na faixa até 5,0%, com cobertura de pelo menos 22,3% |
| 47 CANOS, TUBOS, MANGUEIRAS E ACESSÓRIOS | sim | erro na faixa até 5,0%, com cobertura de pelo menos 23,3% |
| 53 FERRAGENS E ABRASIVOS | sim | erro na faixa até 5,0%, com cobertura de pelo menos 31,4% |

## Limites

- O rótulo é o PDM do item em que o fornecedor cotou. Ele não vem do motor, mas o fornecedor pode ter digitado no campo marca algo que não descreve a peça cotada.
- A regra "só nome de marca" usa o vocabulário dos nomes de PDM da árvore. Ela tira textos sem dígito cujas palavras de peça são sinônimos fora desse vocabulário, que são casos em que o Jev poderia vencer a régua.
- O dígito da regra "só nome de marca" é lido no texto normalizado, onde números de um algarismo somem, como as outras palavras de uma letra.
- O limite de 10 casos por PDM dá o mesmo peso a um PDM com muitas compras e a um com poucas.
- O campo marca parece cortado em 20 caracteres na origem ([fontes](../pesquisa/fontes-do-prototipo.md)), e um texto cortado pode perder a palavra que diz a peça.
- A régua, as regras e este relatório foram escritos pela mesma origem (worker agent). A equipe ainda precisa revisar o pré-registro.
- Antes do registro, uma sondagem viu as contagens de PDMs por grupo e 10 linhas de compra de 5 PDMs, como o pré-registro declara.
