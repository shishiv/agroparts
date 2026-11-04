# Deck AgroParts, variante Polido

Uma das cinco variantes do deck de 04/11/2026. O texto de cada slide vem do texto único aprovado; esta pasta só decide a forma e o movimento.

## Referência

Os slides de título das keynotes da Apple (WWDC): uma frase por tela, em letra grande sobre um fundo quieto. Cada linha sobe de um recorte e depois fica parada, e quem se move é quem fala.
O movimento de decisão vem do próprio site: a placa sobe 10px e o pictograma bate como carimbo, de 1,18 para 1 (DESIGN.md, "Placa de resultado").

## LOOK

Fundo chapa `#f3f4f2`, texto tinta `#15191a`, apoio suave `#4f585b`.
Barlow Semi Condensed 700 nos títulos (72px) e nos números e na marca (160 a 280px), Barlow 400 a 600 nas linhas de apoio (48 a 52px), nada abaixo de 40px, fora o crédito das fotos (18px), que a licença pede.
Tudo alinhado à esquerda numa margem de 200px, com pelo menos metade da tela vazia.
Régua de tinta de 3px como único ornamento.
Azul `#154889` só no que pede ação (o QR do último slide).
Verde, amarelo e vermelho só nas placas de decisão.
Proibido: gradiente, sombra (fora do carimbo de 0,45s da placa), cartão, bloco centralizado, flutuação em loop, letra fora da Barlow.

## Movimento

- Linha de texto: sobe de dentro do próprio recorte, de 105% para 0 em 0,9s, `expo.out`. Linhas seguidas começam 0,12s uma depois da outra.
- Linha de apoio que já foi dita: passa de tinta para suave em 0,6s quando a frase principal chega.
- Régua: cresce da esquerda em 1,0s, `power3.inOut`.
- Print do produto: abre por máscara de baixo para cima em 1,0s, `expo.inOut`, com a imagem assentando de 1,04 para 1.
- Placa de decisão: o carimbo do site.
- Saída do slide: tudo sobe 24px e some em 0,4s, `power2.in`. O próximo slide entra sobre a chapa vazia.
- Depois de pousar, nada se move.
- Cada entrada dura até 1,2s, para quem fala nunca esperar a tela.

## Como funciona

- `index.html` é a composição do Hyperframes: uma linha do tempo só, com um `section.slide` por slide.
- Cada slide diz em `data-paradas` os trechos que a seta toca ("entra-para", em segundos desde o início do slide) e em `data-saida` quando a saída começa. Um slide tem mais de uma parada quando a fala revela a tela em partes; as notas marcam com ▶ onde apertar.
- `scripts/texto.py <report.md>` põe a fala nas notas e confere que cada tela tem só as palavras do texto aprovado.
- `scripts/prints.sh <pasta>` tira o quadro final de cada slide a 1920x1080 e a 1280x720. `scripts/exportar.sh` refaz o PDF de reserva e o MP4.
- `apresentar.html` é a casca: toca o trecho até a próxima parada e para no quadro final. ← volta na hora, sem animação. P abre a janela do apresentador, com a fala de cada slide (`#falas` em `index.html`).
- O vídeo passa a mesma linha do tempo inteira, com cada quadro final parado o tempo da fala.
