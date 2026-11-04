# Deck Grafo

Variante "data-viz documentary" do deck da AgroParts: os cadastros são pontos, as comparações são ligações, e o catálogo vira um mapa de peças iguais e parecidas.

## Referência

[The Fallen of World War II](http://www.fallen.io/ww2/), de Neil Halloran (2015).
É boa porque cada unidade do dado é uma marca visível na tela, o número só aparece depois que o público viu as marcas, e um único mundo de dados atravessa o filme inteiro.
O deck usa o método, não o código: o site não publica licença.

## LOOK

Chapa `#f3f4f2` de fundo, tinta `#15191a` nos pontos, nas ligações e no texto, tinta 2 `#3b4447` nas frases de apoio, linha `#c7cccd` no campo de pontos ao fundo.
Barlow Semi Condensed 700 nas frases, de 64 a 112 px a 1920x1080; Barlow 400 e 600 nos números e rótulos, sempre tabulares.
Verde, amarelo e vermelho só aparecem numa ligação quando ela diz uma decisão (mesma peça, precisa de uma pessoa, parece mas não é).
O azul `#154889` aparece uma vez, no pedido e no QR do último slide.
Sem gradiente, sombra, vidro ou cartão.

## Linguagem de motion

- Um palco só: o campo de 42 pontos, um por cadastro público do gabarito, fica ao fundo desde o primeiro quadro.
- Ponto chega com `expo.out` em 0,5 s; ligação se desenha em 0,6 s `power2.inOut`; o que se junta viaja pela ligação em `power3.in` e bate como carimbo (1,18 para 1, `expo.out`, 0,45 s), como a placa do site.
- Frase entra palavra por palavra, desfoque de 6 px para 0, 0,067 s entre palavras, e depois fica parada.
- Cada slide toca a entrada uma vez e para no quadro final. Nada respira, flutua ou pulsa depois que pousa.

## Como abrir

Abra `index.html` no Chrome. → , espaço, Page Down ou clique avançam; ← , Page Up ou clique direito voltam; F alterna a tela cheia; N abre as notas numa janela à parte.
`#3` no fim do endereço abre o slide 3 já no quadro final.
O mesmo `index.html` é a composição do Hyperframes: `npm run check` e `npm run render`.
