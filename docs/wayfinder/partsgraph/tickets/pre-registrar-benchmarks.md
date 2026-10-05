---
title: Pré-registrar benchmarks por tipo de relação
type: research
status: open
priority: P1
blocked_by: []
---

## Pergunta

Quais conjuntos, denominadores, famílias, positivos, negativos, limiares e métricas serão congelados antes de observar resultados?

## Evidência que torna a pergunta difícil

Identidade, referência cruzada e intercâmbio exigem evidências e negativos diferentes.
Um único gabarito ou uma acurácia geral pode ocultar casos difíceis, seleção de elegibilidade e riscos por família, conforme o [recon profundo](../../../pesquisa/recon-profundo-2026-08-25.md).

## Opções e o que pesa contra cada uma

Montar os três conjuntos apenas com corpus público favorece reprodução, mas pode não representar o cadastro do piloto.
Usar somente a amostra do cliente aumenta relevância, mas exige autorização e pode limitar comparabilidade.
Combinar fontes públicas e privadas amplia cobertura, mas exige separação de licença, acesso e proveniência.

## Teste de falha

O pré-registro falha se qualquer denominador, família, positivo, negativo ou limiar mudar depois de observar resultado, se relações forem agregadas ou se porcentagens omitirem números absolutos.

## Artefato de fechamento

O ticket fecha com três conjuntos congelados, critérios de inclusão, positivos e negativos, métricas e limiares próprios, além de um formato fixo de relatório com total bruto, elegíveis, resolvidos, enviados à revisão, recusados e precisão por família e tipo de relação.

## Estado em 05/10/2026

O gabarito v1 sobre dados públicos está em `dados/gabarito/v1/`, com regras de seleção, elegibilidade, limiares e métricas, gravado no commit anterior ao motor.
Ele cobre tradução para a forma canônica, identidade em pares e uma referência cruzada (n = 1); intercâmbio não tem positivos.
O ticket continua aberto porque o pré-registro sobre cadastro autorizado ainda não existe e porque a equipe ainda não revisou os rótulos da v1.
