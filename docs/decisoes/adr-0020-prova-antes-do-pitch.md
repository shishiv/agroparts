# ADR 0020: Prova antes do pitch

## Contexto

O pitch vinha organizando o trabalho antes de existir exportação real, benchmark representativo ou prova vertical.
O [recon profundo](../pesquisa/recon-profundo-2026-08-25.md) mostrou que a apresentação só será defensável depois de medir o comportamento sobre cadastro autorizado e relações corretamente separadas.

## Decisão

A ordem será:

1. obter uma amostra real autorizada;
2. corrigir o modelo de relações;
3. pré-registrar os benchmarks;
4. escolher uma família estreita com catálogo licenciado;
5. atravessar uma fatia vertical de dez a cinquenta itens reais;
6. medir os resultados;
7. preparar o pitch.

A demonstração provará cinco coisas:

1. uma duplicidade exata entre códigos locais;
2. uma falsa semelhança corretamente recusada;
3. uma referência cruzada apresentada com condições e fonte;
4. tradução em lote com cobertura e precisão estratificadas;
5. revisão humana que preserva o original e registra a decisão.

Compra automática não será demonstrada.
O pitch será consequência da prova, não o destino que organiza o trabalho.

## Alternativas descartadas

Construir a apresentação antes da amostra e do benchmark foi descartado porque favorece narrativa sem validação.
Demonstrar compra automática foi descartado porque depende de vínculo real entre peça e ativo e de sistemas transacionais.
Ampliar famílias ou volume antes da fatia vertical foi descartado porque aumentaria implementação sem provar o fluxo mínimo.

## Consequências

A fatia vertical provada passa a ser o marco de entrega.
Interface e narrativa dependem da medição e não podem substituir falhas por dados fabricados ou fluxos simulados.
Os portões de prova avançam da autorização e pré-registro para execução, medição e somente então apresentação.

## Status

Aceita. Substitui o [ADR 0011](adr-0011-escopo-do-dia-do-pitch.md).
