# ADR 0007: Normalização como receita e comissão latente

## Contexto

A normalização entrega valor antes de qualquer transação e pode ser contratada sem alterar o processo de compra.
Preço é acordo comercial privado, e comissão exige atribuição da influência e conciliação da compra confirmada.

## Decisão

A receita de entrada será a normalização.
O funil de consulta, recomendação, requisição, pedido e compra confirmada será instrumentado desde o início.
Comissão sobre venda permanecerá latente, sem cobrança ou ativação.

## Alternativas descartadas

Cobrar comissão desde o primeiro corte foi descartado por falta de atribuição e conciliação confiáveis.
Monetizar dados comerciais compartilhados foi descartado por violar o isolamento do cliente.

## Consequências

A arquitetura preserva eventos do funil no inquilino sem prometer receita transacional.
Ativar comissão exigirá decisão posterior sobre atribuição, conciliação, contrato e privacidade.

## Status

Superado pelo [ADR 0019](adr-0019-comissao-fora-do-caminho-critico.md). O [recon profundo](../pesquisa/recon-profundo-2026-08-25.md) retirou a comissão do pitch e do caminho crítico até haver canal transacional, atribuição e demanda comprovadas.
