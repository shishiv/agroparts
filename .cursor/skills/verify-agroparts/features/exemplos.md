# Exemplos da apresentação

Os sete casos do pitch ficam a um toque da tela inicial. Cada caso conta a situação em cinco etapas, com fotos, e tem o botão `Rodar no protótipo`, que roda o caso pelos mesmos caminhos que a pessoa usaria. A resposta oferece `Voltar ao caso`.

## Sub-features

- `casos-indice` lista os sete casos em `#casos`.
- `casos-caso` abre um caso em `#casos/<chave>` com cinco etapas.
- `casos-rodar` roda o caso: código, descrição, foto ou o cadastro inteiro.
- `casos-voltar` volta da resposta para o caso.

As chaves são `duplicado`, `parece`, `marca`, `lote`, `pessoa`, `fornecedor` e `foto`.

## How to get to it (user POV)

- O link `Exemplos da apresentação` na tela inicial (`.exemplos-link`).
- `Como funciona` e depois `Exemplos da apresentação, com fotos`.
- A URL `$B/#casos/<chave>`.

## Driving it with agent-browser

Preconditions:

- O doctor passou, a sessão tem movimento reduzido e a página `$B/` está aberta.

- **Índice.** Rode `agent-browser click ".exemplos-link"` e `agent-browser wait --fn 'document.querySelector("#t-casos")?.textContent === "Exemplos da apresentação"'`. `snapshot -s "#aba-casos" -i` lista sete links, de `Caso 1 de 7` a `Caso 7 de 7`.
- **Caso.** Rode `agent-browser click 'a[href="#casos/<chave>"]'` e `agent-browser wait '[data-rodar="<chave>"]'`. `get text "#t-casos"` é o `titulo` do caso em `web/casos.ts`, e `get count ".etapa"` é `5`.
- **Rodar.** Rode `agent-browser click '[data-rodar="<chave>"]'`. Para um caso de código, descrição ou foto, espere `#placa-titulo` (até 90 s no caso `foto`): o título e os grupos batem com `resposta` do caso. Para o caso `lote`, espere `#lote-resultado .resumo-lote`: os números batem com `resposta.numeros`.
- **Voltar.** Rode `agent-browser click "#resultado .voltar-caso"` (no caso `lote`, `#lote-voltar`) e espere `--fn 'location.hash === "#casos/<chave>"'`. O título do caso volta.
- **Proof.** Uma captura do caso e outra da resposta ao vivo, com `agent-browser errors` vazio no fim.

## Gotchas

- Sem movimento reduzido, o clique em `Voltar ao caso` logo depois da resposta erra o alvo enquanto a página rola, e a URL fica em `#resolver`.
- O caso `foto` roda o OCR no navegador. Ele leva mais tempo na primeira vez da sessão.
- O caso `pessoa` termina numa recusa (`O cadastro se contradiz`) de propósito.
- Imagens dos casos carregam com `loading=lazy`. Para provar que nenhuma quebrou, role até elas ou conte só as visíveis.
