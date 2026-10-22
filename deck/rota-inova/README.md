# Deck do pitch do Rota Inova (open-slide)

O pitch da AgroParts para a apresentação final do Rota Inova UEMG 2026 (sexta, 23/10/2026, de 5 a 7 minutos), feito com [open-slide](https://open-slide.dev).
São os 13 slides do pitch de [`docs/rota-inova/entrega-unica.html`](../../docs/rota-inova/entrega-unica.html), na mesma ordem, mais uma página de fontes e créditos, no visual do modelo do Canva da equipe.

- O deck é [`slides/rota-inova-pitch/index.tsx`](slides/rota-inova-pitch/index.tsx). Cada página é um componente React numa tela de 1920 x 1080.
- O roteiro de cerca de 6 minutos está no export `notes` do mesmo arquivo. O modo apresentador do open-slide mostra o roteiro ao lado do slide.
- O PDF para projetar ou enviar à organização é [`exportado/agroparts-rota-inova-pitch.pdf`](exportado/agroparts-rota-inova-pitch.pdf). O link do protótipo é clicável no PDF.
- As regras de conteúdo são as de [`docs/rota-inova/README.md`](../../docs/rota-inova/README.md#regras-de-conteúdo).

## Como usar

Precisa de Bun, Python 3 e poppler (pdftocairo e pdfinfo).

1. `bun install` nesta pasta.
2. `bun run dev --host 127.0.0.1 --port 5181` abre o editor do open-slide em http://127.0.0.1:5181/s/rota-inova-pitch. Lá dá para clicar num elemento e mudar o texto, ou deixar um comentário para o agente aplicar.
3. Com o editor aberto, `sh exportar.sh` gera o PDF em `exportado/` e uma imagem por slide em `exportado/png/`. O script usa o export de PDF do próprio open-slide num navegador headless (agent-browser) e para se [`checar-layout.js`](checar-layout.js) achar texto fora do slide, texto vazando de uma caixa, texto sobre foto ou ilustração, ou imagem que não carrega.

O `dev` e o `build` rodam antes o [`preparar.sh`](preparar.sh), que recorta as ilustrações do modelo do Canva para `slides/rota-inova-pitch/assets/canva/`.
Essa pasta fica fora do Git, como em `docs/rota-inova/`, porque as ilustrações são elementos do Canva.
As imagens de `exportado/png/` também ficam fora do Git.

## Agentes

As skills do open-slide ficam em [`.agents/skills/`](.agents/skills/): `create-slide`, `slide-authoring` e `apply-comments`, entre outras. Leia [`AGENTS.md`](AGENTS.md) antes de editar o deck.

## QR code

Os slides 7 e 13 têm um QR code que abre https://agroparts.pages.dev/. Ele foi gerado localmente com qrencode e conferido com zbarimg nas imagens de 1920 x 1080:

```sh
qrencode -t SVG -l M -m 2 --svg-path --foreground=0e073f --background=ffffff -o slides/rota-inova-pitch/assets/qr-agroparts.svg "https://agroparts.pages.dev/"
zbarimg -q exportado/png/slide-07.png exportado/png/slide-13.png
```
