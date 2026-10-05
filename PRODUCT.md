# Product

<!-- impeccable:product-schema 1 -->

Inferred from the repository docs and the captain's brief of 05/10/2026 (no interview round ran; a worker wrote this file). Each inferred fact is marked "(inferido)".

## Platform

web

## Users

- Quem cuida de almoxarifado, manutenção e compras numa operação industrial ou agroindustrial com estoque de peças de manutenção (inferido de `docs/produto.md`). A pessoa precisa saber se dois cadastros são a mesma peça, se uma marca substitui outra e o que ainda precisa de conferência humana.
- A banca do Rota Inova UEMG 2026, que assiste ao protótipo projetado no pitch de 09/10 e na apresentação presencial de 21/10.

## Product Purpose

AgroParts lê o código, a descrição ou a etiqueta de uma peça e diz o que ela é, com que outros cadastros ela é a mesma peça e o que ainda precisa de uma pessoa. O cadastro original nunca muda. Sucesso é dar visibilidade ao cadastro e reduzir o tempo de análise, sem automatizar equivalência incerta.

## Positioning

O produto separa cinco respostas que o mercado mistura: é a mesma peça, a marca publica uma referência, substitui com condições, serve na máquina, e só parece. Cada resposta vem com a fonte e com a decisão resolve, revisa ou recusa. Parecido nunca vira igual.

## Operating Context

- O protótipo público roda em https://agroparts.pages.dev, sobre dados públicos do CATMAT e do Compras.gov.br, no recorte de rolamento rígido de esferas das séries 60, 62 e 63.
- O pitch segue cinco provas: duplicidade exata (311960), falsa semelhança (317388), referência cruzada (624270), tradução em lote, revisão humana (472447). A leitura de etiqueta por foto complementa.
- O site é projetado em sala a 1920x1080 e aberto no celular a 390-440px.

## Capabilities and Constraints

- O motor, a API, os testes e o gabarito v1 estão fixos para esta interface. A interface só traduz a saída do motor para a língua do usuário.
- O protótipo não usa catálogo de fabricante, não compra, não faz requisição e não integra ERP.
- A câmera só lê texto de etiqueta. A pessoa confere o texto lido.
- A nota de evidência do motor não está calibrada e não pode aparecer como probabilidade.

## Brand Commitments

- Nome público AgroParts. PartsGraph é codinome interno e não aparece na interface.
- Conteúdo em pt-BR, sem jargão técnico na superfície (brief do capitão, 05/10/2026).

## Evidence on Hand

- Medição contra o gabarito v1 em `dados/gabarito/v1/` e na rota `/api/medicao`.
- Imagens de exemplo em `public/exemplos/` com créditos em `CREDITOS.txt`.
- Não existe cliente, piloto, depoimento ou número de economia. A interface não pode sugerir que existam.

## Product Principles

1. Parecido não é igual: semelhança só sugere, nunca decide.
2. O original fica intacto ao lado da tradução.
3. Toda afirmação mostra de onde veio.
4. Na dúvida, a decisão volta para uma pessoa.
5. Cada número vem com o total de onde saiu.
