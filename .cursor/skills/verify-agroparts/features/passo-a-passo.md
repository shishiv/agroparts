# Explicação passo a passo

O botão `Como funciona` abre um menu com os exemplos da apresentação e oito explicações guiadas: a visão geral do site e uma por caso. Cada explicação roda o exemplo no protótipo e destaca, passo a passo, a parte da resposta que prova o caso. A primeira visita abre direto no campo, sem explicação por cima.

## Sub-features

- `tour-menu` abre o menu `Explicação passo a passo`.
- `tour-inicio` percorre a visão geral do site.
- `tour-caso` roda o exemplo de um caso e destaca cada prova.
- `tour-teclado` avança e volta pelas setas, sai com Esc e devolve o foco a `Como funciona`.

## How to get to it (user POV)

- O botão `Como funciona` no topo de qualquer tela da página inicial.

## Driving it with agent-browser

Preconditions:

- O doctor passou e a página `$B/` está aberta. `agent-browser get count ".driver-popover"` é `0` na primeira visita.

- **Menu.** Rode `agent-browser find role button click --name "Como funciona"`. `snapshot -s "#menu-tours" -i` mostra `Visão geral do site` e os botões de `1 Dois cadastros, a mesma peça` a `7 A foto serve para ler a etiqueta`.
- **Abrir um tour.** Rode `agent-browser click '#menu-tours [data-tour="<nome>"]'` e `agent-browser wait ".driver-popover"`. Os nomes são `inicio` e as chaves dos casos.
- **Percorrer.** A cada passo, leia `get text ".driver-popover-title"` e `get text ".driver-popover-progress-text"` (`1 de N`), capture a tela e avance com `agent-browser press ArrowRight` ou `agent-browser click ".driver-popover-next-btn"`. Os títulos batem com `passos` do tour em `web/tour.ts`. Depois do último passo, `get count ".driver-popover"` é `0`.
- **Teclado.** Com um tour aberto, `press ArrowLeft` volta um passo e `press Escape` fecha. `eval 'document.activeElement.id'` é `como-funciona`.
- **Proof.** Uma captura por passo, com o popover e o elemento destacado visíveis, e o par título e progresso de cada passo no `evidencia.md`.

## Gotchas

- Espere o texto de progresso mudar antes de ler o passo seguinte. O tour do caso `foto` espera o OCR antes de avançar.
- Com animação, o driver.js ignora teclas durante a transição de 0,4 s entre passos. Com movimento reduzido, a página tem a classe `driver-simple` e não anima.
- O teste `tests/tour.test.ts` mede se o popover cobre o elemento destacado e se cabe na tela. Para essa prova no celular, rode o teste ou meça os retângulos com `eval`.
