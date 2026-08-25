# Recon profundo do projeto Agroparts

Data da pesquisa: 2026-08-25

## Resumo executivo

Agroparts não é uma loja de peças. O projeto documentado é uma camada de resolução de materiais MRO chamada provisoriamente PartsGraph. Ela recebe descrições e códigos legados, encontra candidatos, preserva os registros do ERP e devolve identidade, atributos, relações e evidências.

A dor é real e bem sustentada: operações intensivas em ativos acumulam cadastros inconsistentes, duplicidade, estoque excessivo e falta de visibilidade entre plantas. O Rota Inova Rural também declara que a operação sucroenergética trabalha com frotas robustas, prazos críticos, manutenção de colhedoras e tratores, peças críticas e janelas sazonais nas quais uma parada inesperada custa operação.

A tese atual, porém, está mais larga que a prova disponível. A categoria já possui fornecedores maduros, como Verusen, SAP MDG/EAM, IBM Maximo e ecossistemas ECLASS. O diferencial não pode ser apenas “IA que encontra peças duplicadas sem trocar o ERP”. Isso já existe. A oportunidade defensável está em uma resolução brasileira, auditável e conservadora para materiais agroindustriais, com evidência de fabricante, regras por família, português sujo e recusas explícitas.

O maior risco imediato não é técnico: não existe ainda uma exportação real, um gabarito representativo ou um motor executável no repositório. Existe somente a fundação documental. O segundo risco imediato é de nome: `partsgraph.ai` já opera publicamente no mesmo campo semântico de dados industriais e grafo canônico de peças.

## O que o projeto já acertou

### Camada não destrutiva

Preservar códigos legados e construir um mapa externo é consistente com o funcionamento de ambientes industriais. A SAP oferece key mapping para sistemas com identificadores heterogêneos; a Verusen se posiciona como overlay de ERPs; o próprio OpenRefine preserva o valor original junto da entidade reconciliada.

A decisão local de não apagar nem fundir automaticamente registros do ERP deve permanecer.

Fontes:

- `docs/decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md`
- https://learning.sap.com/courses/sap-master-data-governance-on-sap-s-4hana/exploring-the-functions-of-sap-master-data-governance-for-material
- https://openrefine.org/docs/manual/reconciling
- https://verusen.com/faq/

### Recuperação separada da decisão

Busca textual ou vetorial deve gerar candidatos, não equivalência. A documentação do OpenRefine distingue clustering sintático de reconciliação semântica e exige julgamento humano em casos incertos. Dedupe e Splink mostram que limiar é uma escolha entre precisão e recall, não uma propriedade universal do modelo.

A arquitetura local que usa busca para recuperar e regras tipadas para decidir deve permanecer.

Fontes:

- `docs/arquitetura.md`
- https://openrefine.org/docs/technical-reference/clustering-in-depth
- https://docs.dedupe.io/en/latest/how-it-works/Choosing-a-good-threshold.html
- https://moj-analytical-services.github.io/splink/charts/threshold_selection_tool_from_labels_table.html

### Resolve, revisa e recusa

A saída ternária é melhor que um score nu. Ela permite reduzir cobertura quando a evidência não sustenta automação. Isso combina com a recomendação do OpenRefine de revisão humana e com o fato de guias de intercâmbio de fabricantes declararem limites de aplicabilidade.

O contrato de erro inferior a 1% na faixa automática é um bom princípio de segurança, desde que seja medido separadamente por tipo de relação e família.

### Proveniência e atributos tipados

ISO 8000 trata qualidade de master data a partir de valores de propriedades e na interface entre sistemas. Partes da série tratam especificamente proveniência, acurácia e identificadores de qualidade. ECLASS estrutura classes, propriedades, valores e unidades para intercâmbio de dados de produto.

A decisão local de preservar fonte, versão, atributo e evidência está alinhada a padrões reais.

Fontes:

- https://www.iso.org/standard/62392.html
- https://www.iso.org/standard/62393.html
- https://www.iso.org/standard/62394.html
- https://www.iso.org/standard/88847.html
- https://eclass.eu/support/technical-specification/data-model/conceptual-data-model

### Câmera como entrada, não como oráculo

A decisão de usar imagem para OCR de código, etiqueta e contexto, sem classificar a peça apenas pela aparência, é correta. Peças visualmente parecidas podem divergir em dimensão, folga, vedação, material, montagem e aplicação.

Fonte local: `docs/decisoes/adr-0008-camera-para-leitura-de-codigo.md`.

## O erro conceitual que precisa ser corrigido

A arquitetura trata “item canônico” e “equivalentes” perto demais. O domínio precisa distinguir pelo menos quatro relações.

### 1. Mesmo registro físico ou comercial

Dois códigos locais apontam para a mesma referência de fabricante e revisão. Esse é o caso mais forte para deduplicação automática.

Exemplo de evidência: fabricante + referência exata + atributos sem contradição.

### 2. Mesma especificação normalizada

Dois registros descrevem a mesma combinação de propriedades técnicas, mas podem vir de fontes diferentes. Ainda exige verificar unidade, tolerância, versão e escopo.

### 3. Intercambiável sob condições

Peças de fabricantes diferentes podem ser comparáveis para uma aplicação específica, mas não idênticas em todas as propriedades. A Timken declara em seus guias que a intercambialidade mostrada é básica e que nem todas as dimensões e especificações são exatamente iguais; para decisão, manda consultar o catálogo correspondente.

Isso precisa ser uma aresta com escopo, condições, fonte e versão, nunca uma fusão de identidade.

Fonte: https://www.timken.com/resources/spherical-roller-bearing-solid-block-housed-unit-interchange-catalog/

### 4. Aplicável a um ativo/configuração

A John Deere filtra catálogo, seção ou peça por PIN. A própria documentação informa que a lista reflete o planejado na fabricação e não inclui alterações feitas no concessionário nem peças de substituição instaladas posteriormente.

Portanto, aplicabilidade ao ativo depende de configuração e histórico. Não pode ser inferida apenas do código ou da descrição.

Fonte: https://www.deere.com.br/pt/pe%C3%A7as-e-servi%C3%A7os/pe%C3%A7as/pesquisa-de-pe%C3%A7as-perguntas-frequentes/

## Modelo de domínio recomendado

Em vez de uma entidade canônica que absorve tudo, usar entidades e relações explícitas:

- `CustomerMaterial`: código e texto preservados do cliente;
- `ManufacturerPart`: fabricante, designação, revisão e fonte;
- `TechnicalSpecification`: propriedades tipadas, unidades e tolerâncias;
- `ProductFamily`: classe taxonômica;
- `AssetConfiguration`: ativo, modelo, série/PIN e mudanças conhecidas;
- `Evidence`: URL/documento, página, trecho, hash, data e licença;
- `ResolutionDecision`: resolve, revisa ou recusa, com versão da regra;
- `SAME_AS`: mesma identidade sustentada;
- `CROSS_REFERENCE`: referência declarada entre fabricantes;
- `INTERCHANGEABLE_FOR`: substituição condicionada a aplicação;
- `COMPATIBLE_WITH`: compatibilidade com ativo ou conjunto;
- `SIMILAR_TO`: semelhança útil para busca, sem autorização de uso.

A regra crítica é simples: `SIMILAR_TO` nunca vira automaticamente `SAME_AS`, e `CROSS_REFERENCE` não implica `INTERCHANGEABLE_FOR` sem condições técnicas.

## CATMAT: útil, mas não deve ser declarado suficiente

CATMAT/PNCP oferece corpus público, códigos, descrições, PDM e uma taxonomia brasileira reproduzível. É útil para:

- iniciar famílias e vocabulário em português;
- testar extração de substantivo, modificador e atributos;
- formar negativos entre padrões distintos;
- construir uma prova pública sem dados privados.

Mas CATMAT é catálogo de compras públicas, não autoridade de identidade de fabricante nem de intercambialidade técnica. ECLASS foi projetado para descrição de produtos por classes, propriedades, valores e unidades, com casos publicados de gestão de sobressalentes. Fabricantes continuam sendo a autoridade para designação e especificação.

Recomendação: manter CATMAT como corpus inicial e vocabulário brasileiro, mas rebaixar “espinha taxonômica” de decisão aceita para hipótese a ser comparada por família com ECLASS e com o esquema do fabricante.

Fontes:

- `docs/pesquisa/catmat-pncp.md`
- https://www.gov.br/pncp/pt-br/catalogo-eletronico-de-padronizacao
- https://siads.fazenda.gov.br/tutorial/html/demo_93.html
- https://eclass.eu/support/technical-specification/structure-and-elements/classification-class

## O mercado confirma a dor, mas também confirma concorrência

### Dor operacional

O Rota Inova Rural descreve:

- grandes áreas, frotas robustas e prazos críticos;
- manutenção de colhedoras e tratores;
- estoque, distribuição e reposição de peças críticas;
- gestão de peças e componentes críticos;
- janelas específicas de plantio, colheita e transporte;
- necessidade de logística ágil de peças e mão de obra para evitar paradas.

Fontes:

- https://rotainovarural.com.br/
- `docs/pesquisa/mercado.md`

O SENAR organiza manutenção de tratores por intervalos de 10, 50, 250, 500 e 1.000 horas e exige diagnóstico e ferramentas específicas. Isso reforça que a demanda de peças nasce do contexto de manutenção e do ativo, não de uma busca genérica de catálogo.

Fonte: https://ead.senar.org.br/cursos/manutencao-de-tratores-agricolas

### Concorrentes e substitutos

- SAP MDG Material oferece busca fuzzy, checagem de duplicidade, classificação, workflow, histórico, key mapping e replicação.
- SAP MDG/EAM vende master data consistente, validação, autorização e redução de custo de peças.
- IBM possui relatório específico para múltiplos stock codes ligados ao mesmo part number e mostra BOM, equipamento e local.
- Verusen ingere material master, uso e compras; harmoniza múltiplos ERPs; detecta duplicidade; recomenda ações; integra por API, arquivo, middleware e SFTP.
- ECLASS publica casos de B. Braun, AVL, AT&S e Fraport com classificação, deduplicação e busca de peças.

Isso prova mercado, mas elimina como diferencial qualquer frase genérica do tipo “IA encontra peças duplicadas sem trocar o ERP”.

Fontes:

- https://learning.sap.com/courses/sap-master-data-governance-on-sap-s-4hana/exploring-the-functions-of-sap-master-data-governance-for-material
- https://www.sap.com/products/data-cloud/master-data-governance-eam.html
- https://www.ibm.com/docs/en/mio?topic=reports-find-duplicate-items
- https://verusen.com/faq/
- https://eclass.eu/en/application/best-practice/detail/bbraun
- https://eclass.eu/en/application/best-practice/detail/avl-list-gmbh

## Posicionamento que ainda pode vencer

O pitch deve evitar “plataforma completa de gestão inteligente de peças”. Isso abre comparação direta com fornecedores maduros.

Uma fronteira mais defensável:

> Resolvemos códigos e descrições de materiais agroindustriais em português contra evidência técnica de fabricante, sem apagar o ERP e sem automatizar equivalência incerta.

A demonstração deve provar:

1. uma duplicidade exata entre códigos locais;
2. uma falsa semelhança corretamente recusada;
3. uma referência cruzada entre fabricantes apresentada com condições e fonte;
4. tradução em lote com cobertura e precisão estratificadas;
5. revisão humana que preserva o original e registra a decisão.

O benefício inicial deve ser declarado como visibilidade e redução de tempo de análise. Economia, compras evitadas e redução de parada só podem ser afirmadas quando houver dados do piloto.

## Métricas: o gabarito atual mede pouco

O gabarito descrito no projeto usa pares positivos com a mesma referência de fabricante e negativos entre PDMs distintos. Isso mede parte da deduplicação exata, mas não mede equivalência entre fabricantes nem aplicabilidade ao ativo.

Separar conjuntos de avaliação:

### Identity benchmark

- positivo: mesma referência, fabricante e revisão;
- negativo: referências distintas com aparência textual próxima;
- métrica: precisão e recall de `SAME_AS`.

### Cross-reference benchmark

- positivo: relação publicada pelo fabricante;
- negativo: dimensões próximas com contradição relevante;
- métrica: precisão da recuperação da referência e fidelidade da proveniência.

### Interchange benchmark

- positivo: substituição validada para uma aplicação e condições explícitas;
- negativo: cross-reference básica que falha em dimensão, carga, folga, vedação ou montagem;
- métrica: precisão por aplicação; no MVP, preferir revisão humana.

### Coverage report

Sempre reportar:

- total bruto;
- elegíveis por regra pré-registrada;
- resolvidos automaticamente;
- enviados à revisão;
- recusados;
- precisão por família e tipo de relação;
- número absoluto junto da porcentagem.

Não usar uma única “acurácia geral”.

## Jornada recomendada para o primeiro piloto

1. Cliente fornece CSV/XLSX com menor conjunto útil e dicionário de campos.
2. Sistema importa sem alterar origem e valida esquema.
3. Pipeline extrai referência, fabricante, família, atributos e unidades.
4. Recuperador apresenta candidatos.
5. Regras eliminam contradições e classificam a relação pretendida.
6. Casos fortes resolvem; limítrofes entram em revisão; fracos recusam.
7. Revisor vê original, candidato, diferenças, fonte e motivo da regra.
8. Decisão gera mapa versionado e auditável.
9. Cliente recebe arquivo de tradução e API consultável.
10. Somente depois de validação surgem integração nativa, guardrail de requisição e efeito financeiro.

Essa ordem combina o ADR de ERP aberto com os padrões encontrados em SAP, IBM, OpenRefine e Verusen.

## ICP e compra

O ICP não é “o agro” nem produtor rural individual. É uma organização agroindustrial intensiva em ativos com:

- mais de uma planta, almoxarifado ou sistema;
- catálogo histórico e descrições livres;
- equipe de manutenção/PCM e suprimentos;
- custo real de busca, revisão e recompra;
- autoridade para exportar uma amostra e validar relações;
- patrocinador de negócio em manutenção, suprimentos ou confiabilidade;
- apoio de TI/dados para integração posterior.

O comitê do Rota Inova é canal para um piloto, não prova de TAM. A pesquisa não encontrou base defensável para calcular mercado em reais. Não usar números amplos de máquinas agrícolas como TAM do PartsGraph: o comprador e a unidade econômica são diferentes.

### Contexto estrutural útil, sem transformar frota em TAM

O Censo Agropecuário 2017 mantém tabelas SIDRA específicas para estabelecimentos e máquinas agrícolas, segmentadas por localização, atividade, área e potência. Um estudo do Ipea estimou idade média de 25,5 anos para a frota brasileira de tratores em 2019, com 49% acima de 35 anos. Esses dados sustentam heterogeneidade de gerações, referências e documentação, mas não dimensionam diretamente o mercado de software de dados mestres.

A ANFAVEA registrou 48,9 mil máquinas agrícolas vendidas no atacado em 2024, quase 20% abaixo de 2023, e vinculou a oscilação a safra, commodities e financiamento. Isso reforça a natureza cíclica da renovação de máquinas e a permanência de frotas antigas. Ainda assim, quantidade de máquinas ou vendas anuais não revela número de cadastros problemáticos, orçamento de master data ou disposição a pagar pelo produto.

Fontes:

- https://sidra.ibge.gov.br/pesquisa/censo-agropecuario/censo-agropecuario-2017/resultados-definitivos
- https://repositorio.ipea.gov.br/bitstreams/817a07c3-8fd5-4058-b2bd-7fdb95e30a39/download
- https://anfavea.com.br/site/wp-content/uploads/2025/01/Release_JAN25_Maquinas.pdf

### O que o benchmark de pós-venda acrescenta ao produto

A pesquisa de sites de fabricantes e revendas não sustenta transformar Agroparts em e-commerce. Ela é útil apenas para observar quais dados o ecossistema usa para reduzir ambiguidade:

- John Deere aceita modelo, catálogo, PIN, número e ilustração;
- a filtragem por PIN possui níveis diferentes de cobertura;
- preço e disponibilidade dependem do revendedor e são fatos separados de identidade;
- linhas genuína, econômica, remanufaturada e independente possuem procedência e garantia distintas;
- páginas multimarcas frequentemente afirmam compatibilidade por forma ou dimensão sem demonstrar configuração, ano ou série.

Implicação: o produto precisa preservar separadamente `identidade`, `aplicabilidade`, `procedência`, `condição`, `garantia`, `preço` e `disponibilidade`. Somente os quatro primeiros pertencem ao núcleo de resolução técnica; preço, estoque e compra permanecem nos sistemas transacionais.

## Segurança e propriedade dos dados

O isolamento por cliente é necessário, mas o ADR atual permite subir para a base comum “mapeamento anônimo de código para item canônico”. Isso merece reabertura. Um código interno ou uma relação peça-ativo pode revelar prática operacional mesmo sem preço ou nome do cliente.

Default mais seguro para o piloto:

- nenhuma aprendizagem entre clientes;
- dados e decisões ficam no tenant;
- corpus público e licenciado fica na base comum;
- promoção de uma relação privada para a base comum exige fonte pública independente ou autorização explícita;
- logs não copiam descrição completa quando identificador e hash bastarem;
- retenção e eliminação entram no contrato do piloto.

LGPD protege dados de pessoas naturais; dados empresariais não ficam automaticamente fora de obrigações contratuais, segredo comercial e segurança. Não vender “LGPD” como resposta completa para confidencialidade industrial.

Fontes:

- `docs/decisoes/adr-0005-isolamento-de-dados-por-inquilino.md`
- https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm

## Risco crítico de nome

`partsgraph.ai` está ativo e descreve seu produto como “the agent-ready parts data layer”. Ele ingere datasheets, parâmetros e documentos de conformidade em um grafo canônico de peças e serve dados a agentes por MCP, páginas legíveis e feeds. A sobreposição não é apenas lexical; é de domínio, vocabulário e arquitetura conceitual.

Fontes:

- https://partsgraph.ai/
- https://partsgraph.ai/research/ai-visibility-benchmark-2026

A busca web não substitui busca de anterioridade no INPI, nem prova registro ou conflito jurídico. O fato operacional já basta: apresentar publicamente outro produto chamado PartsGraph no setor de dados industriais cria confusão e torna domínio, SEO e narrativa mais difíceis.

Recomendação: tratar `PartsGraph` como codinome interno e escolher outro nome antes do pitch público. Fazer busca oficial no INPI por nome, radical e classes relevantes antes de investir em identidade.

Busca oficial: https://servicos.busca.inpi.gov.br/

## Hipóteses que devem ser reabertas

### CATMAT como espinha taxonômica

Manter como corpus e vocabulário inicial. Não assumir como ontologia principal sem comparação por família.

### Base comum de mapeamentos privados

Suspender no piloto. Exigir fonte pública ou autorização explícita para promoção.

### Unidade de valor “resolução de item”

Dividir em tipo de relação. Um único endpoint pode permanecer, mas a resposta precisa dizer se encontrou identidade, referência cruzada, intercâmbio condicionado ou apenas similaridade.

### Comissão futura sobre venda

Retirar do pitch. Não há prova de canal transacional, atribuição ou demanda. Ela distrai de uma oferta B2B de dados e governança.

## Decisões que devem permanecer fechadas

- não substituir ERP ou CMMS;
- não apagar registros legados;
- não decidir por semelhança textual isolada;
- não usar imagem como prova de equivalência;
- preservar evidência e versão;
- manter resolve, revisa e recusa;
- deixar ERP nativo para o piloto;
- não demonstrar compra automática no pitch;
- não inventar economia, cobertura ou cliente.

## Próximos testes em ordem

### P0. Conseguir dados reais

Obter uma amostra mínima de cadastro real com autorização, dicionário de campos e regras de retenção. Sem isso, o projeto prova engenharia sobre corpus público, não valor para cliente.

### P0. Renomear

Escolher um nome provisório distinto e executar busca oficial de marca/domínio. Não construir identidade pública em `PartsGraph`.

### P1. Corrigir o modelo de relações

Registrar ADR separando identidade, cross-reference, intercambialidade, compatibilidade e similaridade.

### P1. Pré-registrar os benchmarks

Congelar denominadores, famílias, positivos, negativos, thresholds e métricas antes de observar resultados.

### P1. Selecionar uma família estreita

Rolamentos continuam adequados por terem designações e dimensões estruturadas, APIs e guias oficiais. Começar por um único subtipo e um fabricante; adicionar outro somente quando licença e fonte estiverem claras.

### P2. Construir uma fatia vertical

Um arquivo real entra; dez a cinquenta itens são analisados; cada resultado mostra diferenças e evidência; revisão grava decisão; export e API devolvem o mapa.

### P2. Medir utilidade humana

Além de precisão e cobertura, medir:

- tempo mediano para localizar/revisar material antes e depois;
- concordância entre revisores;
- quantidade de candidatos por item;
- recusas corretas;
- decisões revertidas;
- itens cuja ausência de atributo bloqueou resolução.

### P3. Só então montar o pitch

Mostrar execução real, uma recusa útil e um resultado corrigido por revisão. O pitch deve vender confiança operacional, não autonomia total.

## Conclusão

O projeto encontrou uma dor valiosa e escolheu bons guardrails, mas ainda não provou produto. A oportunidade não está em “inventar um cadastro universal de peças”. Está em tornar uma decisão difícil verificável: dizer que dois códigos representam a mesma coisa, que uma substituição é válida sob condições, ou que a evidência não permite decidir.

A tese fica mais forte quando assume essa fronteira. Ela fica mais fraca quando promete equivalência, requisição automática, catálogo universal e comissão futura antes de possuir um único cadastro real.