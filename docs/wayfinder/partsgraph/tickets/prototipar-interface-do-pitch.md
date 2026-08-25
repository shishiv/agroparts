---
title: Prototipar a interface mínima do pitch
type: prototype
status: open
blocked_by:
  - medir-cobertura-por-familia
---

## Pergunta

Qual interface mínima prova ao vivo uma resolução individual, sua trilha de evidência, a calibração medida e a tradução em lote sem simular integrações ainda inexistentes?

## Evidência que torna a pergunta difícil

O pitch precisa ser compreensível e verificável, mas uma interface ampla pode consumir o tempo reservado ao motor.
Uma tela que mostra apenas o resultado pode esconder contradições, recusas e cobertura.

## Opções e o que pesa contra cada uma

Uma interface web local é legível, mas adiciona superfície de implementação.
Uma interface de linha de comando é barata e auditável, mas pode dificultar a narrativa para o comitê.
Um notebook mostra cálculo e gráficos, mas pode parecer análise preparada em vez de produto ao vivo.

## Teste de falha

O protótipo falha se depender de vídeo, rede externa instável, dado falso, edição manual durante a prova ou uma métrica sem denominador visível.

## Fechamento

O ticket fecha com protótipo descartável testado por roteiro, tempo total medido, entradas congeladas e verdadeiras, estados resolve, revisa e recusa visíveis e plano de recuperação que não falsifique o resultado.
