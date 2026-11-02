# Fatia 2: a usina hospeda a página, cola os QR e mede o tempo de busca

## Contrato que destrava

O veredito de F7: o tempo para achar a última troca de uma peça, antes e depois da página.

## Costura

- `dados/preregistro/f7-busca.json`, em commit próprio: as peças que os mecânicos vão buscar, o número de buscas, a margem de queda do tempo mediano e como o tempo se mede.
- `docs/medicao/f7-busca.md`: o tempo mediano antes e depois, com números absolutos e sem dado da usina.

## O que acontece

1. A usina gera a página e a folha de QR na tela da fatia 1, hospeda a página onde o ticket [`hospedar-visao-por-equipamento`](../../../docs/wayfinder/partsgraph/tickets/hospedar-visao-por-equipamento.md) decidiu e cola os QR nos equipamentos do teste.
2. Os mecânicos buscam a última troca das peças pré-registradas, primeiro no ERP, depois pelo QR.
3. O agente grava o relatório e o veredito.

## Verificação

- O `git log` mostra o pré-registro antes do relatório.
- O QR impresso abre a URL do equipamento num celular comum da equipe da usina.
- O relatório traz o tempo mediano antes e depois, o número de buscas e o veredito pela regra do pré-registro.

## Decisões delegadas

- O tamanho do QR na folha.

## O que fica verde

A fatia 1, `bun run test` e `bun run build`.

## O que mudaria esta fatia

Se a usina não puder hospedar a página, pare. Hospedar as ordens no site da AgroParts pede antes o ADR do ticket de hospedagem.
