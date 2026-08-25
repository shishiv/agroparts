---
title: Prototipar a interface mínima do pitch
type: prototype
status: open
priority: P3
blocked_by:
  - fatia-vertical-minima
---

## Pergunta

Qual interface mínima apresenta a fatia vertical já medida e prova as cinco capacidades do ADR 0020 sem simular integração ou compra?

## Evidência que torna a pergunta difícil

A interface precisa tornar evidência, condições, recusas e denominadores legíveis sem consumir o esforço reservado à prova.
Construí-la antes da fatia vertical inverteria a ordem definida pelo [recon profundo](../../../pesquisa/recon-profundo-2026-08-25.md).

## Opções e o que pesa contra cada uma

Uma interface web local é legível, mas adiciona superfície de implementação.
Uma interface de linha de comando é pequena e auditável, mas pode dificultar a narrativa.
Um notebook mostra cálculo e gráficos, mas pode parecer análise preparada em vez de fluxo reproduzível.

## Teste de falha

O protótipo falha se não mostrar uma duplicidade exata, uma falsa semelhança recusada, uma referência cruzada com condições e fonte, tradução em lote com cobertura e precisão estratificadas e revisão humana que preserve o original e registre a decisão.
Também falha se depender de vídeo, dado falso, métrica sem denominador visível ou compra automática.

## Artefato de fechamento

O ticket fecha com protótipo descartável testado por roteiro sobre a fatia vertical, tempo total medido, entradas congeladas e verdadeiras, as cinco provas visíveis e plano de recuperação que não falsifique o resultado.
