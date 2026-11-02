# Deck do pitch do Rota Inova (open-slide)

O pitch final da AgroParts no encerramento do Rota Inova UEMG 2026 (quinta, 29/10/2026, em Ribeirão Preto, 6 minutos), feito com [open-slide](https://open-slide.dev).
São 19 páginas em três atos, um por pessoa: o problema e um case (Gabi), a solução (Myke) e a ideia do negócio (Alberto).
Cada página mostra uma ideia: o título e o número ou a imagem que a prova. O resto é falado.
Na tela só entra número publicado, com o nome de quem publicou, número que o protótipo mediu ou conta feita com eles.
O deck não tem página de fontes nem de créditos: as fontes, os créditos e as estimativas ficam nas notas, entre colchetes.

- O deck é [`slides/rota-inova-pitch/index.tsx`](slides/rota-inova-pitch/index.tsx). Cada página é um componente React numa tela de 1920 x 1080.
- O roteiro, de 5 minutos e 38 segundos, está no export `notes` do mesmo arquivo. O modo apresentador do open-slide mostra o roteiro ao lado do slide. A nota da última página traz as perguntas mais difíceis da banca, com resposta de uma frase.
- O PDF para projetar ou enviar à organização é [`exportado/agroparts-rota-inova-pitch.pdf`](exportado/agroparts-rota-inova-pitch.pdf). O link do protótipo é clicável no PDF.
- As contas, as fontes e os créditos estão em [`docs/pesquisa/numeros-do-pitch.md`](../../docs/pesquisa/numeros-do-pitch.md). As regras de conteúdo são as de [`docs/rota-inova/README.md`](../../docs/rota-inova/README.md#regras-de-conteúdo).

## Versão final, em três variações

Para o Rota Inova Day de 29/10/2026 há três decks, que só mudam quais páginas entram: [`agroparts-vfinal-a`](slides/agroparts-vfinal-a/index.tsx) (enxuta, 11 páginas), [`agroparts-vfinal-b`](slides/agroparts-vfinal-b/index.tsx) (com mais prova, 13) e [`agroparts-vfinal-c`](slides/agroparts-vfinal-c/index.tsx) (curta, 8).
As páginas ficam em [`vfinal/pecas.tsx`](vfinal/pecas.tsx). O texto de cada variação, com o que está na tela, a fala de cada pessoa e o tempo, está em [`vfinal/texto/`](vfinal/texto/); o `notas.ts` de cada deck é gerado desse texto por [`vfinal/texto.py`](vfinal/texto.py).
Para exportar uma variação: `sh exportar.sh http://127.0.0.1:5181 agroparts-vfinal-a`, que grava `exportado/agroparts-vfinal-a.pdf`.

## Como usar

Precisa de Bun, Python 3 e poppler (pdftocairo e pdfinfo).

1. `bun install` nesta pasta.
2. `bun run dev --host 127.0.0.1 --port 5181` abre o editor do open-slide em http://127.0.0.1:5181/s/rota-inova-pitch. Lá dá para clicar num elemento e mudar o texto, ou deixar um comentário para o agente aplicar.
3. Com o editor aberto, `sh exportar.sh` gera o PDF em `exportado/` e uma imagem por slide em `exportado/png/`. O script usa o export de PDF do próprio open-slide num navegador headless (agent-browser) e para se [`checar-layout.js`](checar-layout.js) achar texto fora do slide, texto vazando de uma caixa, texto sobre foto ou ilustração, ou imagem que não carrega.

O `dev` e o `build` rodam antes o [`preparar.sh`](preparar.sh), que recorta as ilustrações do modelo do Canva para `slides/rota-inova-pitch/assets/canva/`, fora do Git. O deck atual não usa nenhuma delas.
As imagens de `exportado/png/` também ficam fora do Git.

## Telas do protótipo

As páginas 8 e 9 mostram os seis passos do motor com telas reais do protótipo publicado, para o código 283529 do catálogo do governo.
[`capturar-telas.sh`](capturar-telas.sh) refaz os recortes em `slides/rota-inova-pitch/assets/telas/` a partir de https://agroparts.pages.dev. Ele precisa de agent-browser, ImageMagick e internet.
Rode de novo depois de mudar a interface do protótipo.

## QR code

Só a página 19, a do pedido, tem QR code. Ele abre https://agroparts.pages.dev/ e foi gerado localmente com qrencode. Para conferir nas imagens de 1920 x 1080 que ele é lido e que nenhuma outra página tem QR:

```sh
qrencode -t SVG -l M -m 2 --svg-path --foreground=0e073f --background=ffffff -o slides/rota-inova-pitch/assets/qr-agroparts.svg "https://agroparts.pages.dev/"
zbarimg -q -Sdisable -Sqrcode.enable exportado/png/slide-*.png
```
