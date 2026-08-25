# ADR 0001: Camada de tradução não destrutiva

## Contexto

Duplicidades em ERP podem ser intencionais e históricas porque cada registro pode estar ligado a pedido, contrato, nota, garantia ou ordem de manutenção.
Apagar, fundir ou reescrever esses registros quebraria rastreabilidade e poderia alterar processos fora do PartsGraph.

## Decisão

PartsGraph manterá um mapa externo em que os códigos legados participam das relações tipadas definidas no [ADR 0013](adr-0013-modelo-de-entidades-e-relacoes-tipadas.md).
Nenhum registro do cliente será apagado, fundido ou reescrito.

## Alternativas descartadas

A limpeza direta no ERP foi descartada por destruir vínculos e exigir autoridade operacional que o produto não deve assumir.
A eleição de um código legado como mestre foi descartada porque transfere a inconsistência de uma origem para todas as outras.

## Consequências

O produto precisa preservar origem, evidência e histórico de cada relação.
A integração fica reversível e compatível com múltiplos sistemas.

## Status

Aceita.
