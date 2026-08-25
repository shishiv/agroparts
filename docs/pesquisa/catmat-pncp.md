# CATMAT, pesquisa de preços e CATMAS

## Consulta

A verificação foi executada em 25/08/2026 contra a API pública sem autenticação em `https://dadosabertos.compras.gov.br` e sua especificação OpenAPI em `https://dadosabertos.compras.gov.br/v3/api-docs`.
Os comandos retornaram 343.880 itens de material, 20.419 padrões descritivos e 79 grupos.
A classificação de suprimentos define o grupo 31 como `ROLAMENTOS E MANCAIS` e contém as classes 3110 `ROLAMENTOS ANTIFRICÇÃO NÃO MONTADOS`, 3120 `MANCAIS NÃO MONTADOS` e 3130 `ROLAMENTOS E MANCAIS MONTADOS`.

```bash
curl -fsSL https://dadosabertos.compras.gov.br/v3/api-docs -o /tmp/compras-api.json
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-material/4_consultarItemMaterial?pagina=1' | jq '{totalRegistros,totalPaginas}'
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-material/3_consultarPdmMaterial?pagina=1' | jq '{totalRegistros,totalPaginas}'
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-material/1_consultarGrupoMaterial?pagina=1' | jq '{totalRegistros,totalPaginas}'
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-material/1_consultarGrupoMaterial?codigoGrupo=31' | jq -r '.resultado[] | [.codigoGrupo,.nomeGrupo] | @tsv'
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-material/2_consultarClasseMaterial?codigoGrupo=31&pagina=1' | jq -r '.resultado[] | [.codigoClasse,.nomeClasse] | @tsv'
```

## Atributos estruturados

O item 311960 retorna seis características estruturadas no endpoint de características.
Entre elas está `REFERÊNCIA FABRICANTE` com o valor `6318ZZ C3`, além de tipo de uso, características adicionais e dimensões.

```bash
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-material/7_consultarMaterialCaracteristicas?codigoItem=311960' | jq '{totalRegistros,resultado}'
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-material/7_consultarMaterialCaracteristicas?codigoItem=311960' | jq -r '.resultado[] | [.nomeCaracteristica,.nomeValorCaracteristica] | @tsv'
```

## Histórico de preço

O endpoint `/modulo-pesquisa-preco/1_consultarMaterial` aceita `tipo=codigoItemCatalogo` ou `tipo=codigoPdm`, conforme o enum da especificação.
O limite observado para `tamanhoPagina` é de 10 a 500 porque 10 e 500 retornaram HTTP 200, enquanto 9 e 501 retornaram HTTP 400 na verificação de 25/08/2026.

```bash
jq '.paths["/modulo-pesquisa-preco/1_consultarMaterial"].get.parameters[] | select(.name=="tipo" or .name=="tamanhoPagina")' /tmp/compras-api.json
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/1_consultarMaterial?tipo=codigoItemCatalogo&codigo=311960&tamanhoPagina=10&pagina=1' | jq '{totalRegistros,totalPaginas}'
curl -fsSL 'https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/1_consultarMaterial?tipo=codigoPdm&codigo=11797&dataCompraInicio=2024-01-01&dataCompraFim=2026-08-01&tamanhoPagina=500&pagina=1' | jq '{totalRegistros,totalPaginas}'
for n in 9 10 500 501; do curl -sS -o "/tmp/t${n}.json" -w "${n}\t%{http_code}\n" "https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/1_consultarMaterial?tipo=codigoPdm&codigo=11797&dataCompraInicio=2024-01-01&dataCompraFim=2026-08-01&tamanhoPagina=${n}&pagina=1"; done
```

## PNCP

O PNCP é o Portal Nacional de Contratações Públicas e expõe uma API REST pública separada da API de Dados Abertos do Compras.gov.br.
A especificação consultada em 25/08/2026 se identifica como `API PNCP CONSULTA` e lista consultas de contratações, contratos e compras por órgão.
O primeiro gabarito do PartsGraph usa CATMAT e pesquisa de preços porque fornecem item, padrão descritivo, características e preço no recorte necessário, enquanto o PNCP permanece fonte complementar de contexto de contratação.

```bash
curl -fsSL 'https://pncp.gov.br/api/consulta/v3/api-docs' -o /tmp/pncp-api.json
jq -r '.info.title,.info.version,.info.description,(.paths|keys[]|select(test("contrat|compra|item";"i")))' /tmp/pncp-api.json
```

## CATMAS

O CATMAS é o Catálogo de Materiais e Serviços do Estado de Minas Gerais, mantido no SIAD e usado pelo Portal de Compras MG.
Na consulta de 25/08/2026, o estado oferecia consultas no Portal de Compras e uma visualização estática publicada no GitHub Pages, mas não foi localizada uma API aberta equivalente à API do Compras.gov.br.
Essa constatação descreve o que foi publicamente localizado na data, não prova que uma interface restrita ou não documentada inexista.

```bash
curl -fsSL 'https://compras.mg.gov.br/agente-publico/catalogo-de-materiais-e-servicos-catmas/' -o /tmp/portal-catmas.html
curl -fsSL 'https://compras-mg.github.io/catmas/' -o /tmp/catmas-publicado.html
grep -Eio 'https?://[^" ]+(swagger|openapi|api-docs)[^" ]*' /tmp/portal-catmas.html /tmp/catmas-publicado.html || true
gh-axi api repos/compras-mg/catmas --jq '[.full_name,.description,.homepage,.license.spdx_id,.pushed_at] | @tsv'
```

## Uso no PartsGraph

O CATMAT fornece a espinha taxonômica e o corpus inicial, mas reflete compra pública e não substitui catálogo de fabricante.
A fonte sustenta classificação, gabarito inicial e atributos, enquanto equivalência entre fabricantes exige evidência própria.

## Fontes

- [API de Dados Abertos do Compras.gov.br](https://dadosabertos.compras.gov.br/)
- [Especificação OpenAPI](https://dadosabertos.compras.gov.br/v3/api-docs)
- [API de consulta do PNCP](https://pncp.gov.br/api/consulta/swagger-ui/index.html)
- [CATMAS no Portal de Compras MG](https://compras.mg.gov.br/agente-publico/catalogo-de-materiais-e-servicos-catmas/)
- [Consulta pública estática do CATMAS](https://compras-mg.github.io/catmas/)
