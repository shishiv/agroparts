# ADR 0006: Guardrails programáticos e revisão humana

## Contexto

Modelos podem extrair sinais úteis, mas não oferecem garantia suficiente para equivalência de peças.
O custo de resolver incorretamente é maior que o custo de enviar um caso à revisão.
A referência pública da Merit Data relata automação com acurácia total em 85% dos registros, deixando um limite prático para revisão humana.
A evidência consultada está registrada em [pesquisa de mercado](../pesquisa/mercado.md).

## Decisão

A decisão será verificada por regras programáticas sobre atributos e evidências, não pela confiança declarada pelo modelo.
Cada resultado terminará em resolve, revisa ou recusa conforme faixa de confiança calibrada.
A faixa automática terá erro inferior a 1%, com cobertura reduzida quando necessário.

## Alternativas descartadas

Automação total foi descartada por exceder a evidência pública e ignorar custos assimétricos.
Um único limiar global sem calibração foi descartado porque famílias apresentam sinais e riscos diferentes.

## Consequências

A fila humana é parte permanente do produto e realimenta mapa e calibração.
O pitch precisa mostrar precisão e cobertura medidas, não uma promessa geral de acurácia.

## Status

Aceita.
