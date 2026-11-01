# Cadastro inteiro

A pessoa lê de uma vez todos os rolamentos de esferas ativos do CATMAT 11797. A tela mostra o resumo, o resultado por grupo, os grupos de cadastros duplicados e a planilha de-para, com o texto original intacto ao lado do código padronizado. A planilha inteira sai em CSV.

## Sub-features

- `lote-ler` lê o cadastro inteiro e mostra o resumo.
- `lote-filtro` filtra a planilha por resultado e por busca.
- `lote-mais` mostra mais 50 linhas.
- `lote-codigo` abre a resposta completa de um código.
- `lote-csv` baixa a planilha de-para em CSV.

## How to get to it (user POV)

- O link `Cadastro inteiro` no rodapé (`$B/#lote`).
- O caso `lote` dos exemplos da apresentação.

## Driving it with agent-browser

Preconditions:

- O doctor passou e a página `$B/` está aberta.

- **Abrir.** Rode `agent-browser find role link click --name "Cadastro inteiro"` e espere `--fn '!document.querySelector("#aba-lote").hidden'`. O título é `O cadastro inteiro de uma vez`.
- **Ler.** Rode `agent-browser find role button click --name "Ler o cadastro inteiro"` e `agent-browser wait ".resumo-lote" --timeout 60000`. `get text ".resumo-lote"` traz os números do caso `lote` de `web/casos.ts`, e `get text "#lote-resultado .contador"` é o total de linhas.
- **Filtrar.** Rode `agent-browser select "#filtro-lote" "revisa"`. O contador cai para o número `para uma pessoa` do resumo, e toda linha visível tem o selo de revisão.
- **Abrir um código.** Toque num código da planilha (`agent-browser click "#lote-resultado .link-codigo"`). A tela volta para Identificar com o código no campo e a placa da resposta.
- **CSV.** O link `Baixar planilha de-para (CSV)` aponta para `/api/lote?formato=csv`. Rode `curl -sD "$AGROPARTS_VERIFY_DIR/lote.csv.headers" -o "$AGROPARTS_VERIFY_DIR/lote.csv" "$B/api/lote?formato=csv"`. O cabeçalho tem `content-disposition: attachment; filename="mapa-de-codigos-catmat-11797.csv"`, e o arquivo tem uma linha de cabeçalho mais uma por cadastro lido.
- **Proof.** Uma captura do resumo, o texto do resumo e o CSV salvo na pasta da verificação.

## Gotchas

- Clicar em `Ler o cadastro inteiro` logo depois do link do rodapé, antes da troca de tela, não acha o botão.
- O resumo conta o que o sistema decidiu, não se acertou. O acerto fica em `Quanto acerta`.
- `bun run dados` refaz os snapshots e muda os números. Depois dele, os números esperados vêm do `web/casos.ts` atualizado.
