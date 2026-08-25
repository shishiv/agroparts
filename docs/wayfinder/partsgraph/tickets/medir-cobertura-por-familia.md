---
title: Definir a medição de cobertura por família
type: research
status: open
blocked_by: []
---

## Pergunta

Qual denominador e qual estratificação tornam a cobertura automática por família comparável sem ocultar itens difíceis ou sem referência de fabricante?

## Evidência que torna a pergunta difícil

A precisão da faixa automática pode parecer alta quando o sistema recusa os casos difíceis.
O CATMAT mistura famílias, padrões e níveis de completude diferentes, e o contrato prioriza erro inferior a 1% sobre cobertura.

## Opções e o que pesa contra cada uma

Cobertura sobre todos os registros é simples, mas mistura entradas impossíveis com entradas resolvíveis.
Cobertura sobre registros elegíveis mede capacidade onde há evidência, mas pode inflar resultado se elegibilidade for definida depois do teste.
Cobertura estratificada por família e completude é mais honesta, mas exige tamanhos mínimos e relatório mais detalhado.

## Teste de falha

A métrica falha se mudar depois de observar resultados, se permitir excluir casos sem regra prévia ou se não mostrar quantidade absoluta junto da porcentagem.

## Fechamento

O ticket fecha com denominador pré-registrado, regra de elegibilidade, estratos, quantidade mínima, fórmula, exemplo calculado e formato único de relatório de precisão e cobertura.
