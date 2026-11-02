# Prova do diagnóstico no navegador

Arquivo de teste: `bun scripts/arquivo-diagnostico.ts <saida.csv>` (396 itens ativos do CATMAT e 233 textos distintos de fornecedor, o campo marca das compras, com espaços das pontas cortados; separador `;`).

Jornada dirigida com `agent-browser` contra `wrangler pages dev`, conforme `.cursor/skills/verify-agroparts/SKILL.md`: abrir `/diagnostico`, escolher o arquivo, ler a tela, baixar o CSV.

| | Tela | `traduzirLote` no mesmo arquivo |
|---|---|---|
| Itens lidos | 629 | 629 |
| Na família coberta / fora | 307 / 322 | 307 / 322 |
| Grupos de duplicidade | 55 | 55 |
| Grupos que juntam código CATMAT e texto de fornecedor | 44 | 44 |
| Grupos só com códigos CATMAT | 11 | 11 |
| Precisa de uma pessoa | 84 | 84 |
| CSV baixado | idêntico byte a byte ao `loteParaCsv` | |

O pedido citava 38 grupos mistos. Neste arquivo o motor dá 44, e a tela e o `traduzirLote` concordam.
O registro de rede (`rede.txt`) tem 11 pedidos GET do próprio site e nenhum com corpo.
Largura no celular de 390 px: sem rolagem horizontal (`scrollWidth` 390).
