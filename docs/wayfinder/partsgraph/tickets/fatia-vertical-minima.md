---
title: Provar uma fatia vertical mínima
type: prototype
status: open
priority: P2
blocked_by:
  - obter-exportacao-real
  - pre-registrar-benchmarks
  - selecionar-catalogo-de-fabricante
---

## Pergunta

Como fazer de dez a cinquenta itens reais atravessarem importação, extração, candidatos, regras, decisão ternária, revisão e exportação sem ampliar o escopo?

## Evidência que torna a pergunta difícil

O repositório ainda não contém motor, dataset, API, interface nem teste executável.
O [recon profundo](../../../pesquisa/recon-profundo-2026-08-25.md) recomenda provar o fluxo mínimo sobre amostra autorizada antes de implementação ampla ou pitch.

## Opções e o que pesa contra cada uma

Usar o menor número de itens reduz esforço, mas pode não conter todos os casos necessários para a prova.
Usar o limite maior amplia variedade, mas pode antecipar trabalho sem evidência.
Restringir a uma família facilita regras e auditoria, mas limita qualquer conclusão a esse recorte.

## Teste de falha

A fatia falha se usar dado sem autorização, omitir uma etapa, sobrescrever o original, ocultar o tipo de relação, dispensar revisão ou produzir saída sem evidência rastreável.

## Artefato de fechamento

O ticket fecha com dez a cinquenta itens autorizados atravessando as sete etapas, originais preservados, decisões resolve, revisa e recusa registradas e exportação auditável com relações e evidências.
