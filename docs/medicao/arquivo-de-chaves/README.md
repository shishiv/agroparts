# Prova do arquivo de chaves no diagnóstico (F4, fatia 1)

Arquivo de teste: `bun scripts/arquivo-diagnostico.ts <saida.csv>`, o mesmo do [F2](../diagnostico-agrupamento/README.md), com a coluna sintética `agrupamento_teste`.

Jornada dirigida com `agent-browser` contra `wrangler pages dev`, conforme `.cursor/skills/verify-agroparts/SKILL.md`: abrir `/diagnostico`, escolher o arquivo, baixar o CSV de resultado e o arquivo de chaves, escolher a coluna `agrupamento_teste` e baixar de novo. As capturas `01` a `03` são de 1280 px e `04` e `05` de 390 px.

| | Tela | Motor no mesmo arquivo |
|---|---|---|
| Itens lidos | 629 | 629 |
| Grupos de cadastros duplicados | 55 | 55 (`lote.grupos_duplicidade`) |
| Linhas do arquivo de chaves | 146 | 146 (`arquivoDeChaves`) |
| Cadastros de grupo sem código | 0 (a nota não aparece) | 0 |
| Arquivo de chaves baixado | idêntico byte a byte ao `chavesParaCsv` | |
| CSV de resultado baixado | idêntico byte a byte ao `loteParaCsv` | |

O arquivo de chaves baixado é o mesmo no desktop e no celular, e sem e com a coluna do agrupamento.

Casos de borda dirigidos na página:

- Com três cadastros e nenhum grupo de duplicidade, o botão não aparece, e o CSV de resultado continua lá.
- Com cinco cadastros, dois deles sem código e do mesmo grupo, o botão aparece, o arquivo leva as 3 linhas com código e a tela diz "2 cadastros de grupo sem código ficam fora do arquivo de chaves."

## Rede

`rede.txt` tem 11 pedidos GET no desktop e 12 no celular, todos do próprio site, e nenhum com corpo. O arquivo não sai do navegador. Os downloads são `blob:` criados no navegador e não aparecem no registro de rede.

## Tela do F2

- `01-primeira-tela.png` é idêntica, pixel a pixel, à `01-primeira-tela.png` do F2 (diferença média 0).
- `02-sem-coluna.png` difere da `02-sem-coluna.png` do F2 só dentro da caixa do botão novo (x 113 a 679, y 307 a 358; média 0,4 em 255). Fora dela a diferença é zero.
- `03-com-coluna.png` fica 29 px acima da `03-com-coluna.png` do F2 por causa da rolagem. Deslocada essa altura, ela difere só dentro da caixa do botão novo (x 424 a 679, y 538 a 585).
- Em 390 px a página não rola na horizontal (`scrollWidth` 390), sem e com a coluna. O botão novo ocupa 241 px de largura e 48 px de altura, abaixo do botão de resultado.

## Leitor sem contexto

Uma rodada de `screenshot-critique` com um leitor que viu só as cinco capturas. Os pontos que tocam o botão novo e como ficaram estão no fim do [spec da fatia](../../../specs/f4-arquivo-de-chaves/slices/01-arquivo-generico.md). O leitor não confundiu o arquivo de chaves com outro botão pelo lugar, mas disse que o rótulo sozinho não explica o conteúdo. Os outros pontos (jargão "família", cinco números em quatro colunas, barra verde dos duplicados) já eram do F1 e do F2.
