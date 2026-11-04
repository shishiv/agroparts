# Cinema: o deck da AgroParts como trailer

Uma das 5 variantes do deck de 04/11/2026. O texto de cada slide vem do texto único aprovado; esta pasta só decide a forma.

## Referência de qualidade

Os cartões de título de trailer de cinema, como o teaser de *A Rede Social* (2010): uma frase curta em letra condensada clara sobre fundo escuro, um corte seco para a próxima. O que os torna bons: a frase pousa e fica parada, o movimento está na câmera e na luz atrás dela, e cada corte faz a ideia seguinte começar do zero.

O método de tempo vem do `references/motion.md` do HyperFrames 0.9.12, medido quadro a quadro nos filmes oficiais: chegada com cauda longa (`expo.out`, `power3.out`), título parado depois de pousar, desfoque de 6 a 18 px só no movimento rápido.

## LOOK

Fundo `#15191a` (tinta) em todo slide, com uma luz radial de `#f3f4f2` a 22% no centro e vinheta até 60% de preto nas bordas. Texto em `#f3f4f2` (chapa) e a marca em `#ffffff` (papel). Barlow Semi Condensed 600 a 72 px nas frases e 700 de 290 px a 520 px nos números e na marca; Barlow 600 em nada menor que 40 px. Grão de filme parado a 7%. O azul `#154889` aparece só no que pede ação (o pedido e o QR). Verde, amarelo e vermelho só aparecem dentro das telas reais do produto, como decisão.

Fora: gradiente linear de tela cheia, cartão, sombra decorativa, texto que flutua ou respira depois de pousar, uma segunda cor de destaque.

## Linguagem de motion

- **Câmera no espaço.** Cada slide é um mundo 3D (`perspective: 1400px`). A câmera entra de `z: 520` com 7° de giro até parar em 1,6 s, `power3.out`. O fundo fica 600 px atrás, então ele anda menos que a frente.
- **Números com peso.** O número entra grande (escala 1,32), desfocado 18 px, e pousa em 0,42 s com `expo.out`. No pouso a câmera treme 9 px e assenta em 0,23 s.
- **Frases.** Cada linha acende do desfoque de 10 px em 0,24 s, uma a cada 0,2 s, sem deslizar.
- **Luz e profundidade.** Uma luz cruza da esquerda e assenta atrás do assunto durante a entrada. O desenho do rolamento do site fica no fundo, girando até parar.
- **Cortes secos.** Entre slides não há transição: a próxima ideia começa do escuro.
- **Entra rápido, depois fica.** Toda entrada termina em até 1,7 s. Depois, nada se move enquanto a pessoa fala.

## Telas reais

Capturadas em 04/11/2026 com o `agent-browser`, a 1440x900 e escala 2, em `composition/assets/telas/`:

- `inicio.png`: https://agroparts.pages.dev, "Qual é esta peça?".
- `resposta-311967.png`: o código 311967 identificado, com a placa verde "Peça identificada" e o grupo "Parece, mas não é".
- `diagnostico.png` e `diagnostico-relatorio.png`: https://agroparts.pages.dev/diagnostico antes e depois de ler um CSV de exemplo com 8 cadastros (2 grupos duplicados, 1 precisa de uma pessoa). Os códigos e textos do CSV são de exemplo, não de uma usina.
