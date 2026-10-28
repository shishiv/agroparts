# Números do pitch final do Rota Inova

Consulta das fontes: 28/10/2026.
Este arquivo guarda as contas e as fontes dos números do [deck do pitch final](../../deck/rota-inova/slides/rota-inova-pitch/index.tsx), apresentado em 29/10/2026.
Na tela do deck só entra número publicado (com o nome de quem publicou), número que o protótipo mediu em dados públicos ou conta feita com eles.
O deck não tem página de fontes nem de créditos: a fonte de cada número fica na nota da página, entre colchetes, e aqui.
As estimativas e hipóteses abaixo ficam na nota de perguntas do deck, marcadas como tal.
Nenhum número foi medido numa usina. O piloto é que mede o valor real ([ADR 0016](../decisoes/adr-0016-fronteira-de-posicionamento.md)).

## Na tela, página por página

| Página | Na tela | Fonte |
| --- | --- | --- |
| 2 e 4 | A cena da safra e os três cadastros | Ilustrativos, criados pela equipe |
| 3 | R$ 183,5 mi de manutenção de entressafra e outros, em 9 meses | São Martinho, Resultados 3T26, 09/02/2026, p. 15, linha "Manutenção Entressafra/Outros" (abaixo) |
| 5 | 16% menos peças na prateleira | Departamento de Energia dos EUA, auditoria [DOE-OIG-24-30](https://www.energy.gov/sites/default/files/2024-09/DOE-OIG-24-30.pdf), 24/09/2024 |
| 8 e 9 | Os seis passos, com telas do protótipo | Código 283529 em https://agroparts.pages.dev, 28/10/2026 (abaixo) |
| 10 | Catálogo do governo, ISO 8000, SAP, IBM e Verusen; respostas registradas antes; na dúvida, uma pessoa; uma família por vez | [CATMAT](catmat-pncp.md), [identidade e equivalência](aprofundamento-identidade-equivalencia.md), [jornada e integração](aprofundamento-jornada-integracao.md), [mercado](mercado.md), [gabarito v1](../medicao/gabarito-v1.md), [roadmap](../roadmap.md) e [ADR 0020](../decisoes/adr-0020-prova-antes-do-pitch.md) |
| 11 | 104 pares, 14 de 14 achados, 90 de 90 recusados | Teste com dados públicos (abaixo) |
| 12 | 1 em 12 cadastros repetia outro | Lote do protótipo (abaixo) |
| 13 | US$ 10,5 mi de economia verificada | Caso publicado pela Verusen (abaixo) |
| 14 | Verusen, SAP e IBM | [mercado](mercado.md); learning.sap.com e ibm.com/docs, consultados em 25/08/2026 |
| 15 | 250 usinas operando no Centro-Sul | UNICA (abaixo) |
| 16 | As quatro etapas, o resultado de cada uma e o que pedimos | [Roadmap](../roadmap.md); custos em [`01-ideacao.html`](../rota-inova/01-ideacao.html) e [`entrega-unica.html`](../rota-inova/entrega-unica.html) (equipe, licença do catálogo do fabricante e servidor) |
| 17 | Piloto de 90 dias, sem custo para a usina | Proposta da equipe |

O pedido não tem valor em reais nem data, por decisão da equipe em 28/10/2026: o repositório só registra as categorias de custo, e o piloto é que dimensiona cada etapa.

## Os seis passos (páginas 8 e 9)

As telas são recortes do protótipo publicado, num celular de 360 px, para o código 283529 do CATMAT (`6312 ZZ`).
O deck não leva texto de apoio, então os recortes escondem a legenda dos desenhos, a frase que explica cada grupo, a semelhança de texto, o link do catálogo e o traço que abre cada lista.
O motor acha 8 cadastros com a mesma designação básica: 2 são a mesma peça (292852 e 472657), 1 precisa de uma pessoa (357380, `6312 2ZR`, cujo final `R` não está nas regras) e 5 parecem, mas não são (311967, 317412, 346385, 346386 e 472656).

```bash
sh deck/rota-inova/capturar-telas.sh
bun -e 'import { resolver } from "./src/motor/resolucao.ts"; for (const x of resolver("codigo", "283529").relacoes) console.log(x.decisao, x.alvo)'
```

## Créditos

- Rolamento com tampas de metal, na abertura: R. Henrik Nilsson, Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0), foto recortada.
- Colheita em Piracicaba (SP), na cena da safra: Mariordo (Mario Roberto Duran Ortiz), Wikimedia Commons, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0), foto recortada.
- Telas do protótipo: equipe AgroParts, 28/10/2026.
- Fonte Montserrat, licença SIL Open Font License ([`OFL.txt`](../../deck/rota-inova/slides/rota-inova-pitch/assets/fontes/OFL.txt)).

O crédito de cada foto também fica sobre a própria foto, como a licença CC BY pede.

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

Estes números saíram da tela e ficam só para as perguntas.
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

## Teste com dados públicos

O protótipo foi medido contra o [gabarito v1](../medicao/gabarito-v1.md), registrado em 05/10/2026 antes do motor, no padrão 11797 (rolamento de esfera) do CATMAT.
O rótulo foi feito pelo agente que escreve o motor; a revisão humana da equipe está pendente.

- 104 pares de cadastros com a mesma designação básica e os dois itens elegíveis: 14 são a mesma peça e 90 são peças parecidas, mas diferentes (outra proteção ou folga).
- A AgroParts achou 14 de 14 e recusou 90 de 90. Os exemplos do deck são pares reais do gabarito: CATMAT 283529 (6312 ZZ) com 472657 (6312-2Z), a mesma peça, e com 311967 (6312ZZ C3), outra folga.
- No lote dos 396 cadastros ativos do padrão, 33 repetem outro, em 28 grupos (23 com 2 cadastros e 5 com 3): 33 ÷ 396 = 8,3%, ou 1 em cada 12.

```bash
bun run medir
```

## Retorno

O preço saiu da tela em 28/10/2026: o pitch pede investimento, não vende um preço.
A conta do que basta para a AgroParts se pagar fica na nota de perguntas, feita só com dado publicado e o preço proposto em hipótese:

- A São Martinho tem 4 usinas ([site da empresa](https://www.saomartinho.com.br/show.aspx?idCanal=jVGUPH0WvMeYYUV%20LdgEcQ%3D%3D&linguagem=pt), 28/10/2026).
- Nos mesmos 9 meses do gasto publicado: 4 usinas × R$ 5 mil × 9 meses = R$ 180 mil.
- R$ 180 mil ÷ R$ 183,5 mi = **0,098%**, que o deck arredonda para 0,1%.

```bash
curl -fsSL -A 'Mozilla/5.0' 'https://www.saomartinho.com.br/show.aspx?idCanal=jVGUPH0WvMeYYUV%20LdgEcQ%3D%3D&linguagem=pt' | grep -o '4 USINAS'
```

A conta do retorno estimado abaixo saiu da tela e fica na nota de perguntas.

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
Na tela fica só esse número.
Na nota de perguntas: 250 × R$ 60 mil = **R$ 15 mi por ano**, só no Centro-Sul (estimativa com o preço em hipótese).
A conta conta compradores, não máquinas, como pede o [ADR 0016](../decisoes/adr-0016-fronteira-de-posicionamento.md).

Para comparação, Minas Gerais moeu 74,7 mi t na safra 2025/26, segundo a SIAMIG ([Itatiaia, 24/04/2026](https://www.itatiaia.com.br/economia/negocios/eloos/safra-mineira-de-cana-pode-ultrapassar-83-milhoes-de-toneladas-diz-siamig/)).

## Lá fora

Números publicados pela própria Verusen, não validação independente ([pesquisa de mercado](mercado.md)):

- Caso de uma fabricante industrial com 29 fábricas: US$ 20,9 mi de economia identificada e **US$ 10,5 mi de economia verificada** em estoque de peças ([caso Verusen](https://verusen.com/use_case/use-case-fortune-500-industrial-equipment-manufacturer/)).
- A frase da página inicial da Verusen para o problema é "Same part, many names: one bearing, four SKUs, six storerooms" ([verusen.com](https://verusen.com/)).
- Captação: US$ 8 mi na série A e US$ 25 mi na série B, em 25/01/2022, que somam US$ 33 mi ([comunicado da Verusen](https://verusen.com/news/supply-chain-innovator-verusen-secures-25-million-in-series-b-funding/)).

```bash
curl -fsSL 'https://r.jina.ai/https://verusen.com/use_case/use-case-fortune-500-industrial-equipment-manufacturer/' | grep -nE '29 Plants|10\.5M'
curl -fsSL 'https://r.jina.ai/https://verusen.com/' | grep -n 'Same part, many names'
curl -fsSL 'https://r.jina.ai/https://verusen.com/news/supply-chain-innovator-verusen-secures-25-million-in-series-b-funding/' | grep -nE '\$25 million|\$8 million'
```
