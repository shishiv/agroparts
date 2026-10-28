# Números do pitch final do Rota Inova

Consulta das fontes: 28/10/2026.
Este arquivo guarda as contas e as fontes dos números do [deck do pitch final](../../deck/rota-inova/slides/rota-inova-pitch/index.tsx), apresentado em 29/10/2026.
Cada número é marcado como dado publicado, estimativa ou hipótese, como no deck.
Nenhum número foi medido numa usina. O piloto é que mede o valor real ([ADR 0016](../decisoes/adr-0016-fronteira-de-posicionamento.md)).

## Gasto de manutenção por tonelada

A São Martinho publicou R$ 1.248,6 milhões de capex de manutenção em 9 meses da safra 2025/26 (abril a dezembro de 2025).
Esse total soma plantio de cana (R$ 364,3 mi), tratos culturais (R$ 700,8 mi) e "Manutenção Entressafra/Outros" (R$ 183,5 mi).
Só a última linha é manutenção de máquinas e da indústria, e é a que o deck usa.
No mesmo documento, a empresa moeu cerca de 21,7 milhões de toneladas de cana na safra.

R$ 183,5 mi ÷ 21,7 mi t = **R$ 8,46 por tonelada** (estimativa).

São 9 meses de gasto contra a safra inteira de moagem, e o 4º trimestre (janeiro a março) concentra a entressafra. Por isso o valor fica abaixo do gasto de um ano.

```bash
curl -fsSL -A 'Mozilla/5.0' -o /tmp/sm-3t26.pdf 'https://ri.saomartinho.com.br/Download.aspx?Arquivo=FffpTlTHiXfalqpltN7BuA%3D%3D&linguagem=pt'
pdftotext -f 2 -l 2 -layout /tmp/sm-3t26.pdf - | grep -n '21,7 milhões'
pdftocairo -png -r 110 -f 15 -l 15 /tmp/sm-3t26.pdf /tmp/sm-capex   # a tabela "Detalhamento do CAPEX" é imagem
```

## Usinas da região de Frutal e do Triângulo Mineiro

Conta de cada usina: R$ 8,46 × as toneladas dela (estimativa).

| Usina | Toneladas | O que é | Fonte | Manutenção de entressafra por safra |
| --- | --- | --- | --- | --- |
| Cerradão (Frutal) | 6,3 mi t | moagem atual | [Rabobank, 2025](https://www.rabobank.com/about-us/impact/article/011497337/usina-cerradao-powering-sustainable-growth-in-brazils-sugar-and-ethanol-sector) | R$ 53 mi |
| CMAA (Uberaba, Limeira do Oeste e Canápolis) | 10 mi t por ano | capacidade das 3 usinas | [Globo Rural, 25/04/2025](https://globorural.globo.com/agricultura/cana/noticia/2025/04/cmaa-anuncia-investimentos-de-r-35-bilhoes-ate-2033.ghtml) | R$ 85 mi |
| Usina Uberaba | 3,2 mi t por safra | capacidade | [site da empresa](https://www.canaverde.com.br/uberaba-usina-uberaba/) | R$ 27 mi |
| Coruripe, Limeira do Oeste | 2,5 mi t por ano | capacidade | [Broadcast Agro, em Mercado & Consumo, 20/03/2024](https://mercadoeconsumo.com.br/20/03/2024/economia/usina-coruripe-inaugura-linha-de-producao-de-acucar-vhp-no-triangulo-mineiro/) | R$ 21 mi |

As usinas da BP Bunge na região (Frutal, Itapagipe, Ituiutaba e Santa Juliana) não entram com número: só há o total da empresa, 11 usinas e 32 mi t de capacidade ([Canal Energia, 22/07/2019](https://www.canalenergia.com.br/noticias/53105913/bp-e-bunge-se-unem-para-investir-em-bioenergia)).
A Delta Sucroenergia também fica fora, porque o último número público achado é de 2012.
Três números são capacidade, não moagem, e a moagem real pode ser menor.

## Retorno estimado

- Hipótese: 1% do gasto de manutenção vai para peça que já estava na prateleira. Não há fonte para usina. Como referência, no catálogo público que o protótipo leu, 33 de 396 cadastros (8%) repetiam outro: são 28 grupos, 23 com 2 cadastros e 5 com 3. Na auditoria [DOE-OIG-24-30](https://www.energy.gov/sites/default/files/2024-09/DOE-OIG-24-30.pdf), a prateleira tinha 16% menos itens do que o sistema dizia.
- Hipótese: o preço é R$ 5 mil por usina por mês, ou R$ 60 mil por ano.
- Cenário conservador, a menor usina da tabela: R$ 21 mi × 1% = R$ 210 mil por safra; R$ 210 mil ÷ R$ 60 mil = **3,5 vezes o preço**. A conta empata com R$ 60 mil ÷ R$ 21 mi = 0,3%.
- Teto da região, uma usina como a Cerradão: R$ 53 mi × 1% = R$ 530 mil; R$ 530 mil ÷ R$ 60 mil = **8,8 vezes o preço**.

Os 33 de 396 saem do lote do protótipo:

```bash
bun -e 'import { loteCatmat } from "./src/motor/lote.ts"; const g = loteCatmat().grupos_duplicidade; console.log(g.length, g.reduce((s, x) => s + x.codigos.length - 1, 0))'
```

## Mercado

A UNICA contou 250 unidades produtoras operando no Centro-Sul na 2ª quinzena de maio de 2026: 231 de cana, 10 de milho e 9 flex ([UNICA, 22/06/2026](https://unica.com.br/noticias/safra-2026-2027-2a-quinzena-de-maio/)).
250 × R$ 60 mil = **R$ 15 mi por ano**, só no Centro-Sul (estimativa com o preço em hipótese).
A conta conta compradores, não máquinas, como pede o [ADR 0016](../decisoes/adr-0016-fronteira-de-posicionamento.md).

Para comparação, Minas Gerais moeu 74,7 mi t na safra 2025/26, segundo a SIAMIG ([Itatiaia, 24/04/2026](https://www.itatiaia.com.br/economia/negocios/eloos/safra-mineira-de-cana-pode-ultrapassar-83-milhoes-de-toneladas-diz-siamig/)).
