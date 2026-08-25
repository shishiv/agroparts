# ADR 0012: ERP alvo em aberto

## Contexto

Nenhum piloto real definiu ainda o ERP prioritário.
Escolher uma integração nativa agora consumiria capacidade e poderia otimizar para o sistema errado.

## Decisão

O primeiro corte consumirá exportação em arquivo e devolverá a resolução por API, mantendo-se agnóstico de ERP.
O primeiro piloto real definirá qual integração nativa será construída.

## Alternativas descartadas

Escolher antecipadamente SAP, Oracle ou outro ERP foi descartado por falta de evidência de demanda.
Limitar a entrega a arquivo de retorno foi descartado porque a API preserva um contrato reutilizável.

## Consequências

O formato de ingestão inicial precisa ser simples e documentado.
A integração nativa só entra no roadmap após o piloto identificar sistema, fluxo e autorização.

## Status

Aceita.
