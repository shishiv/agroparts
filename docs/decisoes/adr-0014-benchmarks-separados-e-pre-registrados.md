# ADR 0014: Benchmarks separados e pré-registrados

## Contexto

Um gabarito único de pares não mede com honestidade identidade, referência cruzada e intercâmbio.
O [recon profundo](../pesquisa/recon-profundo-2026-08-25.md) definiu provas e riscos diferentes para cada relação e mostrou que uma métrica agregada pode esconder famílias e casos difíceis.
O [aprofundamento sobre jornada e integração](../pesquisa/aprofundamento-jornada-integracao.md) reúne a evidência sobre ground truth, limiares, precisão, recall e avaliação separada por relação.

## Decisão

Haverá três conjuntos de avaliação separados:

- identidade: positivos com mesma referência, fabricante e revisão; negativos com referências distintas e texto próximo; métricas de precisão e recall de `SAME_AS`;
- referência cruzada: positivos publicados pelo fabricante; negativos com dimensões próximas e contradição relevante; métricas de precisão da recuperação e fidelidade da proveniência;
- intercâmbio: positivos validados para aplicação e condições explícitas; negativos que falham em dimensão, carga, folga, vedação ou montagem; métrica de precisão por aplicação, com preferência por revisão humana no primeiro corte.

Denominadores, famílias, positivos, negativos e limiares serão congelados antes de observar resultados.
O relatório de cobertura sempre mostrará total bruto, elegíveis por regra pré-registrada, resolvidos, enviados à revisão, recusados e precisão por família e por tipo de relação.
Toda porcentagem terá o número absoluto correspondente.
É proibido reportar uma acurácia geral única.

## Alternativas descartadas

Um único conjunto de pares foi descartado por medir apenas parte da deduplicação exata.
Definir elegibilidade ou limiar depois de observar o resultado foi descartado por permitir seleção favorável do denominador.
Uma acurácia agregada foi descartada por ocultar relações e famílias com riscos distintos.

## Consequências

Cada tipo de relação terá gabarito, negativos e métrica próprios.
Cobertura menor continuará aceitável quando necessária para preservar a precisão da faixa automática.
Comparações só serão válidas contra a versão pré-registrada dos conjuntos e limiares.

## Status

Aceita.
