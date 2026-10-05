# Fontes do protótipo público

Consulta e verificação em 05/10/2026.
Os snapshots ficam em `dados/publico/` e são refeitos com `bun run dados` ([script](../../scripts/baixar-dados.ts)).
Cada snapshot grava URL, data de consulta, licença e hash SHA-256 do conteúdo.

## Corpora no site

| Arquivo | Fonte | Conteúdo | Licença |
|---|---|---|---|
| `catmat-pdm-11797.json` | API de Dados Abertos do Compras.gov.br, `modulo-material/4_consultarItemMaterial?codigoPdm=11797` | 397 itens do padrão descritivo 11797 ROLAMENTO DE ESFERA; 396 ativos | Decreto 8.777/2016, art. 4: dados do Poder Executivo federal são de livre utilização |
| `compras-pdm-11797.json` | Mesma API, `modulo-pesquisa-preco/1_consultarMaterial?tipo=codigoPdm&codigo=11797`, compras de 01/01/2025 a 01/09/2026 | 651 linhas de compra pública | Decreto 8.777/2016, art. 4 |
| `bolts-din625-1.json` | [BOLTS, `bearings.blt`](https://github.com/boltsparts/BOLTS_archive/blob/master/data/bearings.blt), classe `singlerowradialbearing` | Dimensões d, D e B da DIN 625-1 para 40 designações | LGPL 2.1 ou posterior, com atribuição aos autores |

O arquivo de compras não guarda CNPJ, nome do fornecedor nem preço.
Alguns fornecedores são MEI com nome de pessoa no nome empresarial, e esses campos não servem à resolução.
Uma busca por padrões de CPF, CNPJ, telefone e e-mail nos campos gravados retornou zero ocorrências.

O texto livre do campo `marca` é o que o fornecedor digitou ao cotar.
Ele serve como cadastro sujo real, por exemplo `BLK Modelo 6205-2rs`, `6206 ZZC3` e `KE/6311H52MRE5C4E01P`.

## Regras de designação

| Regra | Fonte | Uso |
|---|---|---|
| Código de furo, sufixos `-Z`, `-2Z`, `-RS1`, `-2RS1`, `-RSH`, `-2RSH`, `-RZ`, `-2RZ`, folgas `C2` a `C5`, prefixo `W` para inoxidável | [Sistema de designação SKF para rolamentos rígidos de esferas](https://www.skf.com/group/products/rolling-bearings/ball-bearings/deep-groove-ball-bearings/designation-system) | Regra lida e reimplementada; nenhum texto ou dado da SKF é copiado |
| Sufixos genéricos `Z`, `ZZ`, `RS`, `2RS` | BOLTS, `bearings.blt`, tabela `type` | Convenção de mercado sem marca |

Sufixos que essas fontes não definem ficam como "não decodificados" e mandam o item para revisão.
Exemplos reais do CATMAT: `DDU` e `LLU` (NSK e NTN, vedação), `2ZR` (FAG, blindagem) e `VV`.

## Catálogos de fabricante avaliados

| Fabricante | Dados acessíveis | Termos de uso | Resultado |
|---|---|---|---|
| SKF | Página e API de busca por designação com d, D, B, vedação, folga e código ECLASS (por exemplo 6013-2Z: 65 x 100 x 18 mm, folga CN, blindagem nos dois lados, ECLASS 23-05-08-01) | [Termos](https://www.skf.com/group/footer/terms-and-conditions): uso individual permitido; uso comercial exige aprovação escrita; "under no circumstances may this information or software be supplied to third parties" | Fora do site público. A API não libera CORS, e um proxy da equipe redistribuiria os dados |
| Timken | Catálogos em PDF por família | [Termos](https://www.timken.com/terms-of-use/): "You may not copy, modify, distribute, transmit, display, publish ... or use any information on this Site without written permission" | Fora |

A decisão está no [ADR 0010](../decisoes/adr-0010-licencas-de-terceiros.md).

## OCR e imagens

| Arquivo | Fonte | Licença |
|---|---|---|
| tesseract.js 7.0.0 e tesseract.js-core | npm | Apache 2.0 |
| driver.js 1.9.0, passo a passo "Como funciona" | npm | MIT |
| `public/ocr/eng.traineddata.gz` | [tessdata_fast](https://github.com/tesseract-ocr/tessdata_fast), modelo `eng`, comprimido com gzip | Apache 2.0 |
| `public/exemplos/foto-rolamento-6203-c3-rkw.jpg` | [R. Henrik Nilsson, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Second_half_of_20th_century_ball_bearing_6203_C3_M7_by_RKW.jpg), reduzida para 800 px | CC BY 4.0 |
| `public/exemplos/etiqueta-impressa-catmat-311960.png` | Gerada pela equipe com ImageMagick a partir do texto do item CATMAT 311960 | Própria; não é foto de campo |

O Tesseract leu a etiqueta impressa sem erro e devolveu lixo com confiança de 31% na foto do anel gravado.
Isso confirma o [ADR 0008](../decisoes/adr-0008-camera-para-leitura-de-codigo.md): a câmera lê texto de etiqueta, e a pessoa confere o que foi lido.

## Comandos

```bash
bun run dados   # refaz os snapshots públicos
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-material/4_consultarItemMaterial?pagina=1&codigoPdm=11797' | jq '{totalRegistros,totalPaginas}'
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-material/4_consultarItemMaterial?codigoItem=624270' | jq -r '.resultado[0].descricaoItem'
```
