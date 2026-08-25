# Aprofundamento: identidade, equivalência e catálogos de peças

## Data, objetivo e método

**Data de consulta das fontes:** 2026-08-25.

Esta pesquisa fecha o vocabulário e os guardrails para resolver a identidade de peças MRO sem apagar códigos do ERP. O foco é a fronteira entre identidade, equivalência, substituição, compatibilidade e semelhança, usando fontes primárias atuais da ISO, ECLASS, SKF e Timken.

A ISO 8000 é tratada aqui como referência de qualidade, identificação, proveniência, precisão e completude de dados mestres. ECLASS é tratado como padrão de classificação e descrição de produto, incluindo propriedades, tipos de dados, unidades e interfaces de catálogo. SKF e Timken são tratados como evidência de como fabricantes publicam designações, referências, dados de produto, relações de substituição e guias de intercâmbio. Nenhuma das fontes consultadas define sozinha o contrato de negócio do PartsGraph para as palavras "equivalente" ou "substituta".

## Conclusão executiva

1. **Identidade não é similaridade textual.** Um código, uma descrição ou uma imagem pode gerar candidato, mas a resolução precisa apontar para um identificador pertencente a um fabricante ou proprietário e para o conjunto de dados que esse identificador representa. A ISO 8000-115 exige que identificadores de qualidade permitam identificar sem ambiguidade o proprietário e as restrições de uso, além de estabelecer princípios para resolvê-los a um conjunto de dados.[2]
2. **Equivalência não é consequência automática de dimensões iguais.** A SKF separa designação básica, prefixos e sufixos, e informa que os sufixos identificam projetos ou variantes. A Timken mostra em seu catálogo que há variações de geometria interna, aço, gaiola, vedação, furos, rasgos e dimensões que podem ser não intercambiáveis.[10][16]
3. **Interchange é uma evidência qualificada, não uma prova de igualdade.** O guia de intercâmbio da Timken é expressamente apenas para referência: mostra intercambiabilidade básica, mas nem todas as dimensões e especificações são necessariamente idênticas. A consulta ao catálogo específico e à aplicação continua obrigatória.[14][17]
4. **Catálogo de fabricante e taxonomia pública cumprem funções diferentes.** CATMAT pode sustentar classe, atributo e vocabulário de compra pública, mas a decisão de equivalência deve usar evidência do fabricante, engenharia ou regra aprovada da aplicação.
5. **A decisão deve ser não destrutiva e auditável.** O código legado permanece como registro de origem. A resolução acrescenta identidade canônica, relações entre referências, atributos tipados, unidades, proveniência, versão da fonte e estado da decisão.
6. **Sem evidência suficiente, o resultado é revisão ou recusa.** A automação deve poder devolver candidato semelhante sem apresentá-lo como peça comprável.

## O que as fontes normativas sustentam

### ISO 8000-110: dados característicos trocáveis

A ISO 8000-110:2021 especifica requisitos para mensagens que carregam dados mestres formados por dados característicos, com sintaxe formal, codificação semântica, conformidade a especificações de dados e acesso aos dicionários necessários para decodificação.[1]

A mesma página deixa explícito que a parte não cobre o registro da proveniência, a precisão dos dados, a gestão interna de dados mestres no ERP ou a qualidade dos dicionários. A norma considera seus requisitos necessários, mas não suficientes, e remete proveniência e precisão a outras partes da série.[1]

**Implicação para o PartsGraph:** o item canônico precisa ser uma estrutura de propriedades tipadas e decodificáveis, mas a estrutura de intercâmbio não deve ser confundida com garantia de que os valores estejam corretos ou completos. O pipeline deve carregar metadados de proveniência, precisão e completude como camadas próprias.

### ISO 8000-115: identificadores de qualidade

A ISO 8000-115:2024 complementa a ISO 8000-110 e trata da sintaxe e semântica de identificadores de qualidade, da identificação não ambígua do proprietário e das restrições de uso, dos princípios de resolução para o conjunto de dados representado e das características dos identificadores.[2]

A parte não especifica como o identificador é criado, a sintaxe da consulta ou resposta, nem o método de resolução.[2]

**Implicação para o PartsGraph:** a plataforma deve guardar o identificador exatamente como recebido, o proprietário ou namespace, o alvo resolvido e as restrições de uso. A norma dá o contrato para identidade e resolução, mas deixa aberta a implementação do resolvedor. Um código interno de ERP é um identificador de origem do cliente, não deve ser promovido silenciosamente a identificador global de fabricante.

### ISO 8000-120: proveniência

A ISO 8000-120:2016, confirmada como vigente pela página da ISO, especifica a representação e o intercâmbio de informações de proveniência de dados mestres formados por dados característicos. Ela inclui cenários, requisitos de captura e intercâmbio e um modelo de dados de proveniência.[3]

A parte não define um formato de intercâmbio de proveniência, um esquema de registro e resolução de organizações ou pessoas, sintaxe ou resolução de identificadores, configuração ou controle de mudanças.[3]

**Implicação para o PartsGraph:** o produto precisa manter uma trilha própria por valor e por relação. A trilha deve registrar de onde veio a afirmação, quando foi obtida, qual release ou catálogo foi usado, qual referência e qual transformação foi aplicada. Proveniência não é apenas um URL no registro final.

### ISO 8000-130: precisão como afirmação verificável

A ISO 8000-130:2016 especifica requisitos para representar e trocar informações sobre precisão de dados mestres, incluindo afirmações e asserções de precisão e um modelo conceitual para essas informações.[4]

Ela não especifica requisitos universais de precisão nem um formato de intercâmbio para a informação de precisão.[4]

**Implicação para o PartsGraph:** uma pontuação interna não deve ser apresentada como verdade física. O sistema deve separar o fato extraído, a evidência que o sustenta e a avaliação de precisão do próprio PartsGraph. A política de automação precisa declarar qual precisão foi medida para cada família e relação.

### ISO 8000-140: completude depende do uso

A ISO 8000-140:2016 especifica informações sobre completude na forma de afirmações e asserções, mas não define requisitos gerais de completude. A própria página ressalta que o que é completo depende do tipo de dado, do uso, do setor e dos parceiros que trocam a informação.[5]

**Implicação para o PartsGraph:** não existe um percentual universal de campos obrigatórios que prove equivalência. Para um rolamento, por exemplo, o conjunto crítico pode incluir tipo, furo, diâmetro externo, largura, vedação, folga, gaiola, classe de precisão e capacidade. Para uma correia, retentor ou componente hidráulico, o conjunto será diferente. A completude deve ser avaliada por família e por decisão de uso.

## O que ECLASS acrescenta ao modelo de catálogo

ECLASS descreve seu modelo como um sistema de classificação e descrição de produtos. Uma propriedade representa uma característica; classes agrupam produtos; application classes reúnem propriedades; e valores podem ser organizados em listas de valores. Cada propriedade tem IRDI, nome preferido, definição e tipo de dado.[6]

O IRDI é apresentado pelo ECLASS como identificador oficial, internacionalmente único e chave primária, composto por fornecedor, tipo de elemento, identificador e número de versão. A documentação diz que, a partir do Release 8.0, o IRDI é a única chave primária válida para propriedades, sem a necessidade de exportar separadamente os componentes que já estão contidos nele.[6]

A documentação de propriedade diferencia, entre outros, `STRING`, `STRING_TRANSLATABLE`, contagens, medidas inteiras ou reais, moeda, racional, data, timestamp e URL. Para medidas, a propriedade deve ser ligada a uma unidade; unidades que medem o mesmo fenômeno podem ser comparadas e convertidas quando há uma conversão definida. O ECLASS também informa que a notação decimal usa ponto, não vírgula.[6]

O ECLASS informa ainda que, em geral, propriedades são multivalentes, com exceção de propriedades booleanas e polimórficas. Isso é relevante para peças que possuem mais de uma referência, norma, aplicação ou condição associada, mas não autoriza o sistema a descartar o valor original em favor de uma única string.[6]

O Webservice do ECLASS permite recuperar subconjuntos da estrutura, inclusive em JSON ou XML, diretamente em PIM, PDM, PLM, ERP ou loja. A cobrança descrita é por IRDI, e os termos de uso informam que o uso do padrão ou de partes dele requer licença, conforme o caso.[7][8]

A especificação técnica 48, versão 2.0 publicada em 2024-08-30, descreve uma proposta de API REST para recuperação de dados de itens. O escopo inclui JSON, conteúdo mínimo com classificação, conteúdo ECLASS/Advanced e descrição completa multilíngue; a proposta espera que fabricantes ou portais de dados forneçam os dados.[9]

**Implicação para o PartsGraph:** ECLASS pode fornecer a forma de transportar propriedades, unidades, identificadores e classificação, mas não deve ser usado como uma afirmação automática de que dois itens são equivalentes. Classificação de produtos similares é uma camada de descoberta; equivalência requer relação e evidência adicionais.

## O que os catálogos oficiais mostram

### SKF: designação completa, API de referência e exportação de catálogo

A SKF informa que a designação completa de muitos rolamentos combina uma designação básica com prefixos e sufixos. A designação básica identifica tipo, projeto básico e dimensões de contorno; prefixos e sufixos identificam componentes, características e variantes.[10]

No sistema básico descrito pela SKF, a designação costuma ter três a cinco dígitos. Em rolamentos métricos comuns, os dois últimos dígitos codificam o tamanho do furo, normalmente multiplicado por cinco para obter o furo em milímetros, mas há exceções para furos de 10, 12, 15, 17, menores que 10, iguais ou maiores que 500 e alguns tamanhos fora da série.[10]

A SKF alerta que insert bearings, needle roller bearings, tapered roller bearings, rolamentos customizados e outras famílias podem seguir sistemas diferentes. Em rolamentos feitos para requisito específico, o drawing number normalmente não informa as características do rolamento.[10]

A página de APIs da SKF descreve APIs de produto para dados como dimensões, tolerâncias e desempenho, além de API de product cross-reference para buscar uma designação SKF a partir de uma designação não SKF. A página de cross-reference apresenta essa função como busca e validação do sortimento, não como uma autorização universal para instalar qualquer resultado em qualquer aplicação.[11][12]

A documentação de exportação para distribuidores autorizados descreve arquivos em Excel e XML, origem no PIM da SKF, atualização diária no armazenamento e possíveis lacunas de dados. Ela também lista abas de referências compatíveis e de produtos substituídos por novas designações.[13]

**Implicação para o PartsGraph:**

- O parser deve preservar a designação completa, incluindo separadores, prefixos, sufixos, caixa e ordem dos componentes.
- O sistema deve separar `basic_designation`, `prefixes`, `suffixes`, fabricante, referência e revisão, sem inferir que a parte numérica isolada é o item completo.
- A relação vinda de cross-reference deve registrar direção e fonte: referência de origem não SKF para alvo SKF, com data, versão e escopo.
- `compatible_product` e `replaced_product` devem ser relações diferentes. Um produto substituído pode exigir validação de aplicação; uma referência compatível não é necessariamente a mesma peça.
- Exportações de distribuidores e APIs precisam ter licença, credencial, política de atualização e tratamento de lacunas documentados.

### Timken: intercâmbio explicitamente limitado e catálogos por família

O portal de catálogos da Timken lista catálogos separados para famílias como angular contact, ball bearings, cylindrical roller, deep groove, metric tapered, spherical roller, housed units, thrust e outras.[15] Isso reforça que a fonte correta depende da família e que um catálogo genérico não deve ser tratado como dicionário universal de peças.

O guia de intercâmbio da Timken para unidades alojadas de rolos esféricos declara que é apenas para referência. Ele diz que os alojamentos são fabricados para serem dimensionalmente comparáveis com muitos concorrentes, mostra opções por fabricante e estilo de travamento, mas adverte que nem todas as dimensões e especificações são exatamente iguais. Para dimensões específicas, a orientação é consultar a seção correspondente do catálogo de unidades alojadas.[14]

O guia de intercâmbio de unidades alojadas com rolamento cilíndrico dividido repete a limitação: o guia é para referência e mostra intercambiabilidade básica, sem assegurar igualdade de todas as dimensões e especificações.[17]

O catálogo de dimensões da Timken traz componentes em unidades métricas e imperiais e apresenta, por número de peça, dimensões como furo, diâmetro externo, largura total, largura do cone, largura do copo, raios máximos e peso. O próprio catálogo diz que é uma referência para identificação de número e dimensões externas, não um manual de projeto, e recomenda validar a viabilidade da aplicação com o cliente ou engenharia.[16]

O catálogo também mostra que conjuntos espaçadores são ajustados a um conjunto específico de componentes e não devem ser misturados com outros componentes, mesmo quando os números de peça aparentam ser iguais. A tabela de prefixos e sufixos inclui marcas explícitas de peças não intercambiáveis, diferenças de geometria interna, aço especial, gaiola, vedação, furos, rasgos, dimensões e outras características.[16]

**Implicação para o PartsGraph:** uma linha de interchange deve ser armazenada como evidência de intercâmbio em um escopo definido, nunca como `same_as`. O motor deve comparar a referência completa, a família, as unidades, as dimensões críticas, o estilo de travamento, a montagem e os parâmetros de aplicação antes de propor uma substituição.

## Taxonomia operacional para o PartsGraph

Os rótulos abaixo são **contratos de produto recomendados**, não definições normativas da ISO, ECLASS, SKF ou Timken.

| Relação | Significado operacional | Evidência mínima recomendada | Resultado padrão |
| --- | --- | --- | --- |
| **Mesma peça** | O mesmo item físico ou a mesma variante canônica, com fabricante e referência completa correspondentes. Códigos de ERP diferentes podem apontar para ele sem serem apagados. | Identidade do fabricante ou proprietário, referência completa, revisão ou variante quando aplicável, e ausência de contradição nos atributos críticos. | `resolve` somente quando a identidade está estabelecida. |
| **Equivalente** | Referências diferentes que atendem ao mesmo contrato técnico e funcional no escopo declarado. Não significa que sejam a mesma peça ou que tenham a mesma construção. | Relação explícita de fabricante ou engenharia, ou comparação completa dos atributos críticos com contexto de aplicação e tolerâncias. | `resolve` apenas para escopo aprovado; caso contrário `revisa`. |
| **Substituta** | Peça autorizada para ocupar o lugar da referência de origem em uma aplicação, compra ou manutenção concreta. Pode exigir aprovação, adaptação ou condição adicional. | Relação de substituição, histórico de uso ou aprovação de engenharia, além de requisitos de aplicação, estoque e fornecimento. | `revisa` por padrão até a política da planta aprovar. |
| **Compatível** | Atende a uma interface ou subconjunto de requisitos, como dimensões de montagem ou estilo de travamento. Não afirma igualdade de desempenho, vida, material ou aplicação. | Evidência de interface e lista clara do que foi e não foi validado. | Candidato condicionado, nunca compra automática isolada. |
| **Parecida** | Compartilha classe, texto, imagem, geometria parcial ou atributos incompletos. É uma hipótese de busca. | Similaridade ou classificação com lacunas e sem contradição conhecida. | `revisa` ou apenas exibição de descoberta. |
| **Substituída por** | Relação temporal ou comercial publicada pelo fabricante entre uma referência anterior e uma nova designação. | Catálogo ou exportação oficial que declare a substituição, com vigência e versão. | Relação informativa; não promover automaticamente a equivalente. |

### Regras de interpretação

- `same_as`, `equivalent_to`, `substitute_for`, `compatible_with`, `similar_to` e `replaced_by` devem ser relações distintas. Não usar uma tabela genérica de sinônimos que apague a semântica.
- A direção da afirmação deve ser preservada. A API de cross-reference da SKF é documentada como busca de uma designação não SKF para uma designação SKF; uma relação inversa exige evidência própria.[12]
- A relação deve guardar o escopo: família, aplicação, estilo de travamento, unidade, faixa dimensional, condição operacional, planta, país, catálogo e release.
- A ausência de uma referência em um catálogo não prova que ela não existe. Deve resultar em `não resolvido` ou `fonte insuficiente`, não em inexistência.
- Um catálogo de fabricante é evidência de produto daquele fabricante. Uma relação entre fabricantes é evidência de relação no escopo do documento, não autorização geral para todos os equipamentos.

## Modelo mínimo de evidência e proveniência

Cada atributo e cada relação devem poder apontar para uma observação de fonte. O conjunto mínimo recomendado é:

| Campo | Regra |
| --- | --- |
| `source_owner` | Organização que publicou ou controla a fonte. Separar fabricante, órgão, distribuidor autorizado e cliente. |
| `source_url` | URL exata do catálogo, API, página ou documento. |
| `accessed_at` | Data e hora da captura. |
| `source_type` | `standard`, `manufacturer_catalog`, `manufacturer_api`, `interchange_guide`, `customer_erp`, `engineering_approval`, `manual_review`. |
| `source_version` | Edição, release, número do catálogo, data de publicação ou versão da API quando disponível. |
| `manufacturer` | Fabricante ou marca da peça, preservando o valor recebido e a normalização separadamente. |
| `reference_raw` | Referência exatamente como publicada ou importada, incluindo caixa, espaços, barras, hífens, prefixos e sufixos. |
| `attribute_raw` | Valor textual original, antes de parsing ou conversão. |
| `attribute_normalized` | Valor tipado usado na comparação. |
| `unit_original` e `unit_normalized` | Unidade informada e unidade usada para comparação. Nunca descartar a original. |
| `relation_type` | Um dos rótulos operacionais, sem transformar automaticamente `compatible` em `equivalent`. |
| `claim` | Texto curto da afirmação suportada pela fonte. |
| `scope` | Família, aplicação, montagem, estilo de travamento, faixa ou condição em que a afirmação vale. |
| `valid_from`, `valid_to` | Vigência quando o catálogo declarar substituição, obsolescência ou release. |
| `evidence_state` | `direct`, `structured_match`, `qualified_interchange`, `inferred_similarity` ou `manual_approved`. |
| `decision_state` | `resolve`, `revisa` ou `recusa`. |
| `reviewer` e `reviewed_at` | Obrigatórios para aprovação manual ou exceção. |

A separação entre `attribute_raw`, valor normalizado e unidade é coerente com a exigência de dados característicos decodificáveis, com o tratamento de proveniência e com a distinção de unidades e tipos de dados do ECLASS.[1][3][6]

### Unidades e conversões

1. Guardar sempre valor, unidade, sistema de medida, texto original, precisão e tolerância, quando disponíveis.
2. Converter apenas quando a conversão entre unidades do mesmo fenômeno estiver definida. O ECLASS explicita que unidades comparáveis podem ser convertidas quando existe uma conversão definida.[6]
3. Aplicar parsing decimal conforme a origem. O ECLASS documenta ponto como separador decimal; uma vírgula de ERP brasileiro não deve ser confundida com separador de milhares ou rejeitada sem uma regra de origem.[6]
4. Não comparar valor métrico e imperial somente por texto. O catálogo Timken publica os dois sistemas e a SKF possui exceções de furo codificado, o que exige um parser por família e não uma fórmula universal.[10][16]
5. Preservar intervalos, limites, tolerâncias e valores nominais. `25 mm`, `25 +0/-0,02 mm` e `25 mm nominal` não são o mesmo dado.
6. Não comparar dimensões de uma peça avulsa com dimensões de um conjunto, kit, cup, cone, alojamento ou montagem sem declarar a unidade física comparada.

## Guardrails contra falso positivo

### Contradições que devem bloquear a resolução automática

Os seguintes sinais devem bloquear `same_as` e, salvo regra de engenharia explícita, bloquear também `equivalent_to`:

- fabricante ou referência completa contraditórios;
- família, tipo de rolamento, número de carreiras ou configuração incompatíveis;
- furo, diâmetro externo, largura, raio ou sistema de unidade incompatíveis;
- vedação, blindagem, folga, pré-carga, tolerância, gaiola, material ou tratamento incompatíveis;
- peça avulsa comparada com conjunto, kit, cup, cone, spacer, housing ou unidade montada;
- estilo de travamento ou tipo de montagem incompatível;
- capacidade, velocidade, temperatura, lubrificação ou ambiente de aplicação incompatíveis;
- referência parcial, drawing number customizado ou texto OCR sem confirmação em fonte do proprietário;
- catálogo antigo usado para justificar uma relação atual sem verificar release ou substituição.

A necessidade desses bloqueios não é apenas heurística. A SKF documenta que prefixos e sufixos carregam variantes e que determinados sistemas mudam por família.[10] A Timken documenta características que tornam componentes não intercambiáveis e alerta para não misturar componentes de conjuntos ajustados.[16]

### Hierarquia de evidência

1. **Direta:** fabricante declara a identidade, substituição ou relação para a referência completa e o escopo aplicável.
2. **Estruturada:** catálogo do fabricante fornece atributos completos e não há contradição nos campos críticos, com aplicação coberta.
3. **Intercâmbio qualificado:** guia oficial informa intercâmbio básico ou comparabilidade dimensional, com ressalvas e consulta ao catálogo específico.
4. **Inferida:** similaridade de texto, imagem, taxonomia ou atributos parciais. Serve para ranking e revisão, não para compra.

A hierarquia é uma política do PartsGraph. A Timken fornece o motivo para não tratar a terceira classe como identidade: seu guia de interchange diz que dimensões e especificações podem não ser exatamente iguais.[14][17]

## Pipeline de catálogos recomendado

1. **Registrar a fonte antes de ingerir:** proprietário, URL, tipo, licença, edição, release, data de publicação, data de acesso e política de atualização.
2. **Preferir fonte estruturada de primeira parte:** API oficial, exportação oficial, XML, JSON ou tabela do catálogo. A SKF oferece APIs de produto e o ECLASS oferece serviço e especificação de API.[7][9][11]
   As exportações da SKF são descritas em Excel/XML e a Timken mantém portal e catálogos separados por família.[13][15]
3. **Preservar o snapshot lógico:** manter referência à versão consultada, hash ou identificador de captura e os valores originais. A atualização de uma fonte não deve alterar silenciosamente uma decisão histórica.
4. **Separar adaptadores por fabricante e família:** designações SKF, referências Timken, ECLASS e CATMAT não compartilham parser universal.
5. **Ingerir relações com direção e ressalvas:** `compatible`, `replaced_by` e `interchange` entram como relações específicas, com escopo e caveats.
6. **Validar licença antes de copiar corpus:** a documentação ECLASS informa que o uso do padrão ou de partes requer licença conforme o caso; a exportação SKF é descrita para distribuidores autorizados e deve seguir seus termos.[8][13]
7. **Medir lacunas e cobertura:** uma fonte pode ter produto sem imagem, descrição curta ou atributo preenchido. A própria documentação de exportação SKF informa que há lacunas de dados.[13]
8. **Expirar ou revalidar relações:** toda relação baseada em catálogo deve ter release e data de revisão. Mudança de designação não apaga o histórico nem reescreve o ERP.

## Decisão de integração com CATMAT

CATMAT continua sendo espinha taxonômica e fonte pública de padrões descritivos e características, conforme a pesquisa já registrada no repositório. Ele não deve ser usado como prova de que duas referências comerciais de fabricantes diferentes são equivalentes.

O modelo recomendado mantém três camadas:

- **Origem:** código, descrição, unidade e contexto exatamente como vieram do ERP, CATMAT ou outra fonte.
- **Identidade canônica:** fabricante, referência completa, família, atributos tipados, unidades e versão da fonte.
- **Grafo de relações:** mesma peça, equivalente, substituta, compatível, parecida e substituída por, cada uma com evidência, escopo e estado de decisão.

Assim, o PartsGraph pode mostrar que vários códigos de ERP resolvem para o mesmo item canônico sem fundi-los, e pode mostrar candidatos de outros fabricantes sem apresentá-los como compra segura.

## Critérios de aceite para o primeiro catálogo de rolamentos

Antes de liberar resolução automática em uma família, o conjunto de testes deve comprovar:

- identidade exata de referências completas, com prefixos e sufixos;
- distinção entre designação básica e variante;
- distinção entre peça, componente e conjunto;
- conversão rastreável entre métrico e imperial;
- preservação de unidade, tolerância, folga e precisão;
- recusa de relações com contradições em campos críticos;
- tratamento separado de `replaced_by`, `compatible_with` e `interchange`;
- bloqueio de mistura de componentes de conjuntos ajustados;
- proveniência por atributo e por relação;
- resultado `revisa` quando a evidência for apenas textual, visual ou dimensional parcial;
- reprodução da decisão usando o mesmo release e snapshot de catálogo;
- auditoria que mantenha todos os códigos legados e suas origens.

A faixa automática deve ser liberada por família e por relação, com precisão medida e cobertura conhecida. Os demais casos permanecem na fila humana, em linha com a decisão do produto de usar guardrails programáticos e revisão humana.

## Pontos ainda abertos

- Licença e modalidade de acesso para cada corpus ECLASS, SKF e Timken que o piloto pretende armazenar, consultar ou redistribuir.
- Lista de atributos críticos por família além de rolamentos.
- Política de engenharia para promover `interchange` ou `compatible` a `substitute_for` em uma planta específica.
- Retenção de snapshots e prazo de revalidação depois que um catálogo muda.
- Conjunto rotulado de falsos positivos e falsos negativos para calibrar `resolve`, `revisa` e `recusa`.

## Sources

[1] https://www.iso.org/standard/78501.html - ISO 8000-110:2021 - characteristic data exchange
[2] https://www.iso.org/standard/88847.html - ISO 8000-115:2024 - quality identifiers
[3] https://www.iso.org/standard/62393.html - ISO 8000-120:2016 - provenance
[4] https://www.iso.org/standard/62394.html - ISO 8000-130:2016 - accuracy
[5] https://www.iso.org/standard/62395.html - ISO 8000-140:2016 - completeness
[6] https://www.eclass.eu/support/technical-specification/structure-and-elements/property - ECLASS property technical support
[7] https://eclass.eu/en/eclass-standard/eclass-webservice - ECLASS Webservice
[8] https://eclass.eu/en/eclass-standard/terms-of-use - ECLASS Terms of Use
[9] https://eclass.eu/fileadmin/Redaktion/pdf-Dateien/Wiki/ECLASS-Technica-Specification_ItemDataRetrieval-by-RESTful_Web_API_-_V2.0.pdf - ECLASS Technical Specification 48 - Item Data Retrieval by RESTful Web API v2.0
[10] https://www.skf.com/us/products/rolling-bearings/principles-of-rolling-bearing-selection/general-bearing-knowledge/bearing-basics/basic-bearing-designation-system - SKF basic bearing designation system
[11] https://www.skf.com/group/support/apis - SKF APIs
[12] https://www.skf.com/us/support/apis/product-cross-reference - SKF product cross-reference API
[13] https://cdn.skfmediahub.skf.com/api/public/094023a0ba8bcad3/pdf_preview_medium/SKF_Product_Data_Exports_for_Authorized_Distributors_pdf_preview_medium.pdf - SKF product data exports for authorized distributors
[14] https://www.timken.com/resources/spherical-roller-bearing-solid-block-housed-unit-interchange-catalog - Timken spherical roller bearing solid-block housed units interchange guide
[15] https://catalog.timken.com - Timken catalog portal
[16] https://engineering.timken.com/wp-content/uploads/2023/07/Timken-Bearing-Dimension-Catalog.pdf - Timken bearing dimension catalog
[17] https://www.timken.com/resources/timken-split-cylindrical-roller-bearing-housed-unit-interchange-guide_11213 - Timken split cylindrical roller bearing housed unit interchange guide
