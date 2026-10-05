---
version: 1
slug: "web-index-html"
primary_target: "web/index.html"
related_targets: []
---

# Surface brief: protótipo AgroParts (web/index.html)

Scope: o site inteiro do protótipo (Identificar, Cadastro inteiro, Quanto acerta, Decisões, Fontes). Visitor mode: Operate.
Audience: quem cuida de almoxarifado, manutenção e compras; a banca do Rota Inova vendo o site projetado a 1920x1080; o celular a 390-440px.
Task: digitar um código, colar uma descrição ou fotografar uma etiqueta, e entender em segundos se é a mesma peça, se parece mas não é, ou se precisa de uma pessoa.
Proof/content: as cinco provas do roteiro (311960, 317388, 624270, lote, 472447) e a leitura da foto. Dados vêm só da API.
Constraints: motor, API, testes do motor e gabarito ficam como estão. Nada de código de relação, ADR ou nota crua na superfície; o detalhe técnico fica atrás de "ver detalhes".
Unattended run: no interview or decision page ran (worker under firstmate, captain not reachable). The assigned direction was built as rolled; assumptions are labeled in PRODUCT.md.

## Direction contract

THESIS: A resposta é uma placa de sinalização industrial: verde quando é a mesma peça, amarelo quando precisa de uma pessoa, vermelho quando parece mas não é. Recusa o painel SaaS de cards, badges e scores que a categoria entrega.

OWN-WORLD: Chapa de alumínio clara (#F3F4F2) e tinta quase preta. As três cores de segurança (verde RAL 6032, amarelo RAL 1003, vermelho RAL 3001) preenchem placas inteiras, nunca filetes. O azul de sinal obrigatório (RAL 5005) fica só no que se pode apertar. Placas com canto de 4px, borda de tinta de 2px e um quadrado de pictograma à esquerda. Tipo Barlow, letra de placa de estrada, com números tabulares.

STORY: A pessoa vê a placa e sabe a resposta sem ler mais nada. Depois lê uma frase simples do porquê. Só abre "ver detalhes" quando quer conferir a fonte.

FIRST VIEWPORT: Faixa de marca fina em tinta. Abaixo, a pergunta "Qual é esta peça?" grande à esquerda. O campo de entrada ocupa a coluna principal com o botão azul "Identificar". O roteiro das cinco provas fica numa régua de placas pequenas numeradas acima do campo. Ao resolver, a placa de resultado ocupa a largura toda.

FORM: Sinalização de segurança industrial (NR-26 e ISO 7010), posição 4 da lista ordenada, seed c5394e59. Raises: azul só para ação (do app de consumo); a decisão do sistema riscada, não apagada, quando a pessoa discorda (do léxico); estado carimbado, nada some (da carteira de bilhetes); tabela de lote densa sem desculpa (do catálogo de evento).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

A placa de resultado: pictograma grande no quadrado colorido, a frase "É a mesma peça" ou "Parece, mas não é" em letra de placa, legível do fundo da sala.
