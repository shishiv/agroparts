# ADR 0004: Entrega por API integrada ao ERP e ao CMMS

## Contexto

O cliente já executa cadastro, manutenção, aprovação, requisição, pedido e compra em sistemas próprios.
Substituir esses sistemas ampliaria escopo e reduziria a chance de adoção.

## Decisão

PartsGraph entregará resolução e tradução por API integrada ao ERP e ao CMMS.
Alerta, aprovação, requisição e compra permanecerão no sistema do cliente.
O produto não será um ERP novo nem um catálogo web isolado com login.

## Alternativas descartadas

Construir um ERP ou CMMS foi descartado por duplicar sistemas maduros e desviar da unidade de valor.
Criar um portal paralelo como destino final foi descartado por aumentar troca de contexto e divergência de dados.

## Consequências

O contrato de API precisa ser estável e rastreável.
A primeira integração nativa dependerá do ERP do piloto real.

## Status

Aceita.
