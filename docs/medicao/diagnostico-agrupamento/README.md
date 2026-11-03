# Prova do agrupamento no diagnóstico (F2, fatia 3)

Arquivo de teste: `bun scripts/arquivo-diagnostico.ts <saida.csv>`, o mesmo do [F1](../diagnostico-navegador/README.md) com a coluna `agrupamento_teste`. A coluna é sintética: repete a primeira designação `6[023]\d\d` do texto, e o cabeçalho do script diz isso. Ela não vem de nenhuma usina.

Jornada dirigida com `agent-browser` contra `wrangler pages dev`, conforme `.cursor/skills/verify-agroparts/SKILL.md`: abrir `/diagnostico`, escolher o arquivo, escolher a coluna `agrupamento_teste`, baixar a amostra e o CSV de resultado. As capturas `01` a `05` são de 1280 px e `06` a `09` de 390 px.

| | Tela | `compararAgrupamento` e `visaoPorTipo` no mesmo arquivo |
|---|---|---|
| Itens lidos | 629 | 629 |
| Grupos que misturam peças | 44 | 44 |
| Grupos sem mistura | 2 | 2 |
| Grupos com cadastro em dúvida (inconclusivos) | 2 | 2 |
| Grupos de um cadastro só | 17 | 17 |
| SKUs por tipo | 60 | 60 |
| SKUs por identidade | 176 | 176 |
| CSV de resultado baixado | idêntico byte a byte ao `loteParaCsv` | |
| Amostra baixada (`n = 20` misturas, 101 cadastros) | idêntica byte a byte ao `amostraParaCsv(amostrar(...))` | |

Esta coluna agrupa pela designação básica, então as 44 misturas são os 44 grupos que a visão por tipo junta, como prevê a autoconferência do [esboço](../../../specs/f2-sku-contra-agrupamento/esboco.md).

## Rede

`rede.txt` tem 11 pedidos GET no desktop e 12 no celular, todos do próprio site, e nenhum com corpo. O arquivo não sai do navegador.

## Tela do F1

- `01-primeira-tela.png` é idêntica, pixel a pixel, à `01-primeira-tela.png` do F1 (diferença média 0).
- `02-sem-coluna.png`, com o seletor em "Nenhuma", é idêntica, pixel a pixel, à `02-resultado-resumo.png` do F1 (diferença média 0), no mesmo recorte.
- `06-celular-sem-coluna.png` tem as mesmas quebras de linha e os mesmos cartões que a `03-celular-390.png` do F1. Pixel a pixel há diferença média de 3,4 em 255, de linhas de texto deslocadas em 1 pixel do aparelho, porque a rolagem do F1 não foi guardada.
- Em 390 px a página não rola na horizontal (`scrollWidth` 390), sem e com a coluna.

## Leitor sem contexto

Duas rodadas de `screenshot-critique` com um leitor que viu só as nove capturas. Entraram quatro ajustes: o botão da amostra encostava nos números, o título da seção contradizia os números ("misturam peças" sobre um quadro que traz também os grupos sem mistura), "precisam de uma pessoa" aparecia em dois números diferentes, e os cadastros de uma seção nova não tinham divisória entre as chaves. Ficaram como estavam os pontos que já são do F1 (os cinco números em quatro colunas, a barra verde dos duplicados, o "x" da frase do motor).
