# Fatia 2: o Jev escolhe grupo, classe e PDM

## Contrato que destrava

O veredito de F3: o Jev contra a régua, no benchmark congelado da fatia 1.

## Costura

- `scripts/jev/familia.ts`: `classificadorJev`, com o modelo fixado em `jev-1.14.0`, como no [esboço](../esboco.md).
- `scripts/medir-familia.ts --jev`, com a chave em `TYPESAFE_API_KEY`.
- O cache em `dados/local/cache-jev/`, que o git ignora, até o ticket [`conferir-termos-e-chave-da-typesafe`](../../../docs/wayfinder/partsgraph/tickets/conferir-termos-e-chave-da-typesafe.md) dizer se as respostas podem ir ao repositório.

## Como o Jev entra

- A pergunta desce por grupo, classe e PDM, com "nenhum" em cada nível, como no [cookbook de classificação hierárquica](https://docs.typesafe.ai/cookbooks/hierarchical_classification.md) da TypeSafe.
- Cada caso roda nas duas ordens das opções.
- A contagem e a comparação de números ficam no código.
- O custo vem dos tokens de entrada de cada pedido e vai no relatório.

## O que a pessoa roda

`TYPESAFE_API_KEY=... bun scripts/medir-familia.ts --jev`, e depois abre `docs/medicao/familia-v1.md`.

## Verificação

- O relatório mostra a régua e o Jev lado a lado, por estrato, com números absolutos, as mudanças com a ordem e o veredito pela regra do pré-registro.
- Rodar de novo com o cache cheio não faz nenhum pedido à API e dá os mesmos números.
- `grep -r TYPESAFE dist web functions` não acha nada depois de `bun run build`.

## Decisões delegadas

- O formato do pedido à API, conforme a documentação da TypeSafe na hora de implementar.
- O nome dos arquivos do cache.

## O que fica verde

A fatia 1, `bun run test` e `bun run build`.

## O que mudaria esta fatia

Se a chave continuar recusada, registre INCONCLUSIVE no relatório e pare. Não troque o modelo fixado para fazer a medição passar.
