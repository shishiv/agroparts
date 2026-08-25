---
title: Definir a medição de cobertura por família
type: research
status: closed
priority: P1
blocked_by: []
---

## Pergunta

Qual denominador e qual estratificação tornam a cobertura automática por família comparável sem ocultar itens difíceis ou sem referência de fabricante?

## Evidência que torna a pergunta difícil

A precisão da faixa automática pode parecer alta quando casos difíceis são recusados.
O [recon profundo](../../../pesquisa/recon-profundo-2026-08-25.md) mostrou que cobertura isolada não resolve a medição de identidade, referência cruzada e intercâmbio.

## Opções e o que pesa contra cada uma

Cobertura sobre todos os registros é simples, mas mistura entradas impossíveis com entradas elegíveis.
Cobertura sobre elegíveis mede capacidade onde há evidência, mas pode inflar o resultado se a regra surgir depois do teste.
Cobertura estratificada é mais honesta, mas precisa fazer parte de benchmarks separados e pré-registrados.

## Teste de falha

A medição falha se mudar depois de observar resultados, excluir casos sem regra prévia, omitir números absolutos ou agregar tipos de relação em uma única acurácia.

## Artefato de fechamento

Encerrado como superado porque a pergunta foi absorvida por [`pre-registrar-benchmarks`](pre-registrar-benchmarks.md), que reúne os três conjuntos e o relatório de cobertura exigidos pelo [ADR 0014](../../../decisoes/adr-0014-benchmarks-separados-e-pre-registrados.md).
Nenhum denominador foi decidido neste ticket encerrado.
