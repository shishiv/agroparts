# Deck do pitch do Rota Inova (open-slide)

O pitch final da AgroParts no encerramento do Rota Inova UEMG 2026 (quinta, 29/10/2026, em Ribeirão Preto, 6 minutos), feito com [open-slide](https://open-slide.dev).
São 16 páginas em três atos (a dor, a solução e os números) e duas páginas de apoio, com as fontes e os créditos.
Cada página mostra uma ideia: o título e o número ou a imagem que a prova. O resto é falado.
Na tela só entra número publicado, com o nome de quem publicou, número que o protótipo mediu ou conta feita com eles. Estimativas e hipóteses ficam na nota de perguntas, e as fontes de todos os números ficam na página de apoio.

- O deck é [`slides/rota-inova-pitch/index.tsx`](slides/rota-inova-pitch/index.tsx). Cada página é um componente React numa tela de 1920 x 1080.
- O roteiro, de cerca de 5 minutos e meio, está no export `notes` do mesmo arquivo. O modo apresentador do open-slide mostra o roteiro ao lado do slide. A nota da página de fontes traz as perguntas mais difíceis da banca, com resposta de uma frase.
- O PDF para projetar ou enviar à organização é [`exportado/agroparts-rota-inova-pitch.pdf`](exportado/agroparts-rota-inova-pitch.pdf). O link do protótipo é clicável no PDF.
- As contas e as fontes dos números estão em [`docs/pesquisa/numeros-do-pitch.md`](../../docs/pesquisa/numeros-do-pitch.md). As regras de conteúdo são as de [`docs/rota-inova/README.md`](../../docs/rota-inova/README.md#regras-de-conteúdo).

## Como usar

Precisa de Bun, Python 3 e poppler (pdftocairo e pdfinfo).

1. `bun install` nesta pasta.
2. `bun run dev --host 127.0.0.1 --port 5181` abre o editor do open-slide em http://127.0.0.1:5181/s/rota-inova-pitch. Lá dá para clicar num elemento e mudar o texto, ou deixar um comentário para o agente aplicar.
3. Com o editor aberto, `sh exportar.sh` gera o PDF em `exportado/` e uma imagem por slide em `exportado/png/`. O script usa o export de PDF do próprio open-slide num navegador headless (agent-browser) e para se [`checar-layout.js`](checar-layout.js) achar texto fora do slide, texto vazando de uma caixa, texto sobre foto ou ilustração, ou imagem que não carrega.

O `dev` e o `build` rodam antes o [`preparar.sh`](preparar.sh), que recorta as ilustrações do modelo do Canva para `slides/rota-inova-pitch/assets/canva/`, fora do Git. O deck atual não usa nenhuma delas.
As imagens de `exportado/png/` também ficam fora do Git.

## Demonstração ao vivo e plano B

A página 8 pede à plateia que escaneie o QR e toque Identificar.
Ao lado, o celular roda sozinho, em loop, a gravação de 31 s do protótipo publicado ([`assets/video/demo-celular.mp4`](slides/rota-inova-pitch/assets/video/demo-celular.mp4)). Sem internet, ela é o plano B.
O vídeo só roda no navegador. No PDF, a página mostra a capa do vídeo, que é o resultado do código 311960.

## QR code

As páginas 8 e 16 têm um QR code que abre https://agroparts.pages.dev/. Ele foi gerado localmente com qrencode e conferido com zbarimg nas imagens de 1920 x 1080:

```sh
qrencode -t SVG -l M -m 2 --svg-path --foreground=0e073f --background=ffffff -o slides/rota-inova-pitch/assets/qr-agroparts.svg "https://agroparts.pages.dev/"
zbarimg -q -Sdisable -Sqrcode.enable exportado/png/slide-08.png exportado/png/slide-16.png
```
