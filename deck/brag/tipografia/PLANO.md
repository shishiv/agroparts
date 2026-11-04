# Deck AgroParts · variante tipografia cinética

As palavras da tela são o visual. Cada slide é uma cena que toca a sua entrada e para no quadro final.

## Referência de qualidade

Os cartazes de Josef Müller-Brockmann para a Tonhalle de Zurique (1950 a 1970): uma grade rígida, texto alinhado à esquerda e um bloco de letra enorme que faz o papel da imagem. O que os torna bons é que a hierarquia vem só do tamanho, do peso e do espaço, sem ornamento.

O método vem de duas fontes com licença que deixa usar. A primeira é o preset `broadside` do HyperFrames (Apache-2.0), que trata a Barlow gigante como forma: uma frase por quadro, fios de 1px como estrutura e a cromia suprimida nos quadros de declaração. A segunda são as medidas de movimento de `references/motion.md` do HyperFrames.

## LOOK

- Fundo: chapa `#f3f4f2` em toda a tela, sem corte entre slides.
- Tinta: `#15191a`. Registro baixo: suave `#4f585b`. Fio: tinta, de 4px.
- Destaque: azul de ação `#154889`, só no que pede ação (o pedido e o QR). As cores de segurança aparecem só como a placa da decisão, como no site.
- Letra: Barlow Semi Condensed 700 para a palavra que importa e 600 para o resto. Barlow 400 só em texto da interface real.
- Escala, a 1920x1080: palavra-herói de 300px (cerca de 28% da altura), frase de 108px, linha de apoio de 56px. Nada abaixo de 40px.
- Grade: margens de 120px nos lados e 96px em cima e embaixo, 12 colunas, tudo alinhado à esquerda pela margem.
- Proibido: gradiente, sombra, vidro, cartão, caixa alta espaçada, Inter, a mesma entrada em todo elemento, qualquer laço de respiração ou flutuação.

## Linguagem de movimento

- **Palavra que pousa**: cada palavra sai de 6px de desfoque para nítida em 0,16 s, uma a cada 67 ms, sem deslocamento. É a frase falada.
- **Palavra que se encaixa**: a palavra-chave sobe de dentro da própria linha de base, de 112% para 0, em 0,7 s, `expo.out`. Numa marca, letra a letra, a cada 35 ms.
- **Palavra que se troca**: uma palavra roda como um contador mecânico, 0,1 s por volta, até parar na certa.
- **Número que conta**: de 0 até o valor em 1,2 a 1,6 s, com números tabulares, e para.
- **Fio que corre**: o fio cresce da esquerda em 0,55 s, `power2.inOut`, e separa o que muda de assunto.
- Pousou, parou. Nada se mexe depois que a entrada termina. Cada slide termina a entrada em até uns 6 s e espera o próximo clique.
- Entre slides, o fundo nunca corta: o texto sai com 8px de desfoque em 0,25 s, e o próximo entra na mesma chapa.

## Mais fundo, sem crescer (be-ambitious)

Campo: design de movimento para palestra ao vivo.

1. O profissional amarra cada entrada ao ritmo da fala: a palavra aparece quando a pessoa a diz, e não antes. Ele desenha para o projetor do lugar, que lava o contraste e reduz a tela, e leva uma reserva que não depende de nada.
2. O material bruto é a fala aprovada com o tempo de cada trecho, os arquivos da fonte Barlow do próprio projeto, a tela real do site e a fonte de cada número em `docs/pesquisa/`.
3. Os métodos são a grade suíça de 12 colunas, a escala de tipos medida em pixels, a máscara por linha de base, o contador com números tabulares, `hyperframes check` e um quadro de repouso por slide.
4. A prova vem de fora: `hyperframes check` sem erro; o contraste WCAG AA de cada texto; a menor letra medida acima de 40px a 1080; o quadro final de cada slide a 1920x1080 e a 1280x720; e um leitor sem contexto que diz numa frase o que cada quadro diz.

## Arquivos

- `index.html`: a composição HyperFrames. Cada slide é um `<section class="clip slide">` com `data-start` e `data-duration`.
- `apresentar.html`: a casca do apresentador. Lê os tempos dos próprios slides, então o MP4 e o deck ao vivo nunca discordam.
- `falas.js`: a fala de cada slide, para a janela de notas.
- `assets/`: as fontes (OFL), o GSAP e as telas reais do site.
