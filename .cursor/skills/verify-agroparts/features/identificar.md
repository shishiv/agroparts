# Identificar uma peça

A pessoa informa um código, uma descrição ou a foto de uma etiqueta e toca em `Identificar`. A resposta mostra o que foi procurado, uma placa com o veredito (`Peça identificada`, `Precisa de uma pessoa` ou uma recusa) e os cadastros encontrados, agrupados por relação: `É a mesma peça`, `Parece, mas não é` e outras.

## Sub-features

- `ident-codigo` identifica um código do CATMAT ou da peça.
- `ident-descricao` identifica uma descrição livre.
- `ident-vazio` identifica o exemplo que o campo vazio mostra.
- `ident-foto` lê o texto de uma foto no navegador e identifica o texto conferido.
- `ident-detalhes` mostra o texto original sem alteração, a descrição padronizada e as fontes.

## How to get to it (user POV)

- A tela inicial `$B/` (ou `$B/#resolver`), com o modo `Código` marcado.
- O link `Identificar uma peça` no topo de qualquer outra tela.
- Tocar num código na tela `Cadastro inteiro`.
- Tecla Enter no campo de código.

## Driving it with agent-browser

Preconditions:

- O doctor passou e a página `$B/` está aberta.

- **Código.** Digite e identifique. Rode `agent-browser find label "Código do cadastro ou da peça" fill "317388"` e `agent-browser find role button click --name "Identificar"`, depois `agent-browser wait "#placa-titulo"`. `get text "#placa-titulo"` é `Peça identificada`, `get text "#resultado .busca"` é `Código 317388`, e os grupos (`#resultado .grupo-cabeca h3`) começam por `É a mesma peça` e `Parece, mas não é`.
- **Descrição.** Rode `agent-browser find role radio click --name "Descrição"`, preencha `find label "Descrição, do jeito que está no cadastro" fill "BLK Modelo 6205-2rs"` e identifique. O resultado bate com o caso `fornecedor` de `web/casos.ts`.
- **Campo vazio.** Esvazie o campo e toque em `Identificar` em cada modo de texto. O campo passa a ter o exemplo que o placeholder mostra (`311960` no modo Código, `ROLAMENTO RIGIDO DE ESFERAS 6205 2RS C3` no modo Descrição), e a placa é `Peça identificada`.
- **Foto.** Rode `agent-browser find role radio click --name "Foto da etiqueta"` e toque no exemplo `agent-browser find role button click --name "Etiqueta impressa"`. Espere `agent-browser wait --fn 'document.querySelector("#texto-ocr").value.includes("311960")' --timeout 90000`. `#ocr-estado` diz `Leitura boa`. Toque em `Identificar`; a placa é `Peça identificada`.
- **Detalhes.** Abra `agent-browser find text "Ver detalhes da resposta" click`. O bloco mostra `sem alteração` ao lado da `Descrição padronizada`, e a tabela `Como lemos a peça` cita o trecho de onde veio cada dado.
- **Celular.** Repita um passo com `set viewport 390 844 2`. `eval 'document.documentElement.scrollWidth > document.documentElement.clientWidth'` é `false`.
- **Proof.** `agent-browser screenshot "$AGROPARTS_VERIFY_DIR/identificar-<entrada>.png"` com a busca e a placa visíveis, mais o texto de `#placa-titulo` e dos grupos no `evidencia.md`.

## Gotchas

- Sem movimento reduzido, a página rola suave até a resposta, e um clique logo depois cai fora do alvo sem erro.
- O OCR roda no navegador com o Tesseract. Na primeira leitura de uma sessão ele baixa o modelo de `/ocr/` e leva alguns segundos. O exemplo `Anel gravado no metal` falha de propósito e pede para digitar o código.
- `#texto` serve aos modos Código e Descrição; o modo Foto usa `#texto-ocr`.
- A resposta nunca diz em que máquina a peça serve. Uma prova que espere `COMPATIBLE_WITH` está errada.
