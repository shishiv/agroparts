# Dispersão de preço no CATMAT

## Método

A verificação foi executada em 25/08/2026 no endpoint público de pesquisa de preço.
O método baixa todas as compras de um padrão descritivo e compara preço unitário somente dentro do mesmo código de item.
Comparar itens diferentes dentro do mesmo padrão seria inválido porque dimensões, materiais e referências podem mudar.
A amostra usa o padrão descritivo 11797 na janela de 01/01/2024 a 01/08/2026.

```bash
base='https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/1_consultarMaterial?tipo=codigoPdm&codigo=11797&dataCompraInicio=2024-01-01&dataCompraFim=2026-08-01&tamanhoPagina=500'
tmp=$(mktemp -d)
curl -fsSL "$base&pagina=1" -o "$tmp/pagina-1.json"
for p in $(seq 2 "$(jq -r .totalPaginas "$tmp/pagina-1.json")"); do curl -fsSL "$base&pagina=$p" -o "$tmp/pagina-$p.json"; done
jq -s '[.[].resultado[]]' "$tmp"/pagina-*.json > "$tmp/precos.json"
jq '{registros:length,itens_distintos:(map(.codigoItemCatalogo)|unique|length),com_referencia:(map(select((.descricaoItem // "")|test("REFERÊNCIA FABRICANTE";"i")))|length)}' "$tmp/precos.json"
for code in 614042 633501 626492; do jq --argjson c "$code" '[.[]|select(.codigoItemCatalogo==$c)|.precoUnitario|tonumber] | {item:$c,compras:length,min:min,max:max}' "$tmp/precos.json"; done
```

## Resultado reproduzido

A API retornou 876 registros e 187 códigos de item distintos.
O item 614042 teve 25 compras, com preço unitário mínimo de R$ 8,00 e máximo de R$ 8.786,79.
O item 633501 teve 13 compras, com preço unitário mínimo de R$ 18,15 e máximo de R$ 13.588,80.
O item 626492 teve 70 compras, com preço unitário mínimo de R$ 6,12 e máximo de R$ 1.400,00.
As 876 descrições, equivalentes a 100% da amostra, contêm `REFERÊNCIA FABRICANTE`.

## Limites de interpretação

Dispersão não prova sobrepreço porque unidade de fornecimento, kit contra peça avulsa, frete, urgência e quantidade podem explicar diferenças legítimas.
O endpoint também contém contexto de compra que precisa ser considerado antes de rotular uma observação como anômala.
Preço público não serve como referência automática de preço justo.
Preço público serve como evidência de que o problema existe e como base de treino e avaliação para detecção de anomalia.

## Fonte

- [API de Dados Abertos do Compras.gov.br](https://dadosabertos.compras.gov.br/)
- [Especificação OpenAPI](https://dadosabertos.compras.gov.br/v3/api-docs)
