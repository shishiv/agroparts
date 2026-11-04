# Deck AgroParts, variante Produto

A tela real do `/diagnostico` no centro: o CSV entra, o relatório sai.

```sh
python3 deck/brag/produto/servir.py
chromium --app=http://127.0.0.1:8931/ --start-fullscreen
```

→, espaço, PageDown ou clique avançam; ← volta; F põe a tela cheia; N abre as notas de quem apresenta.
Cada slide toca a entrada e para no quadro final. `#3` na URL abre o slide 3 parado.

- `composition/index.html` é a composição HyperFrames: um `<section class="slide">` por slide, com `data-pausa` (o quadro final) e `data-notas` (a fala).
- `apresentador.js` lê os slides dessa composição e toca cada um no `<hyperframes-player>`.
- `npm run check` roda o `hyperframes check`.
