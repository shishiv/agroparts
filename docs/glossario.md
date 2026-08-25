# Glossário

## Nomes

**agroparts:** nome do repositório e da iniciativa inscrita no Rota Inova AGR08.
**PartsGraph:** codinome interno do produto da iniciativa agroparts; outro nome será escolhido antes de qualquer identidade pública.
**AGR08:** desafio Eficiência na Gestão de Peças do Rota Inova.

## Entidades

**`CustomerMaterial`:** código, descrição e demais valores preservados do cadastro do cliente.
**`ManufacturerPart`:** referência identificada por fabricante, designação, revisão e fonte.
**`TechnicalSpecification`:** substantivo, modificador, propriedades tipadas, unidades e tolerâncias normalizadas.
**`ProductFamily`:** classe usada para organizar regras, atributos e medição por família.
**`AssetConfiguration`:** ativo, modelo, série ou PIN e mudanças conhecidas que condicionam aplicabilidade.
**`Evidence`:** fonte auditável com URL ou documento, página, trecho, hash, data, versão e licença quando aplicável.
**`ResolutionDecision`:** registro versionado da saída resolve, revisa ou recusa, com relação pretendida, regra e evidências.

## Relações

**`SAME_AS`:** relação de mesma identidade sustentada por evidência.
**`CROSS_REFERENCE`:** referência cruzada publicada, sem implicar intercâmbio técnico.
**`INTERCHANGEABLE_FOR`:** substituição condicionada a aplicação, escopo, condições, fonte e versão.
**`COMPATIBLE_WITH`:** aplicabilidade de uma peça a um ativo ou configuração.
**`SIMILAR_TO`:** semelhança útil apenas para recuperação de candidatos, sem autoridade para decidir identidade.

## Domínio

**Código legado:** identificador existente no ERP, CMMS, planta, fornecedor ou histórico do cliente.
**Mapa de códigos:** representação não destrutiva que preserva códigos legados e as relações tipadas sustentadas por evidência.
**Resolução:** serviço que transforma texto sujo ou código em entidades, atributos, evidências, decisão e tipo de relação.
**Substantivo:** nome principal da família material na especificação técnica.
**Modificador:** qualificador que especializa o substantivo na especificação técnica.
**Atributo tipado:** propriedade com nome, tipo, unidade e valor normalizados.
**Descrição por regra:** texto derivado de propriedades em ordem determinística.
**Referência de fabricante:** código atribuído pelo fabricante a uma peça.
**Padrão descritivo:** estrutura CATMAT que agrupa itens por uma forma comum de descrição e atributos.
**CATMAT:** Catálogo de Materiais do Compras.gov.br usado como corpus público e vocabulário brasileiro inicial, não como ontologia principal presumida.
**ECLASS:** sistema de classificação e descrição comparado por família com CATMAT e o esquema do fabricante.
**PNCP:** Portal Nacional de Contratações Públicas usado como fonte complementar de contexto de contratação.
**CATMAS:** Catálogo de Materiais e Serviços de Minas Gerais mantido no SIAD e acessado pelo Portal de Compras MG.
**ERP:** sistema corporativo no qual permanecem cadastro, pedido, contrato e compra.
**CMMS:** sistema de gestão da manutenção no qual permanecem ativo, ordem de serviço e consumo.
**Inquilino:** fronteira lógica, operacional e contratual dos dados e decisões de um cliente.
**Base comum:** conjunto compartilhado limitado a corpus público e licenciado, salvo promoção com fonte pública independente ou autorização explícita.
**Busca vetorial:** recuperação de candidatos por proximidade sem autoridade para decidir relações.
**Evidência técnica:** sinal auditável usado na decisão, como referência, dimensão, material, condição ou aplicação.
**Contradição:** conflito entre propriedades que reprova um candidato.
**Nota calibrada:** pontuação cuja faixa corresponde à taxa de acerto observada no tipo de relação e na família.
**Calibração:** medição que alinha a nota à taxa de acerto observada.
**Limiar:** fronteira pré-registrada que separa as saídas de uma família e de um tipo de relação.
**Faixa automática:** conjunto de casos que o serviço pode resolver dentro do contrato de erro.
**Precisão automática:** proporção de resoluções corretas entre as resoluções automáticas, estratificada por família e relação.
**Cobertura automática:** proporção de entradas resolvidas automaticamente dentro do denominador pré-registrado.
**Resolve:** saída para uma relação aceita dentro do contrato de erro.
**Revisa:** saída para decisão humana por evidência insuficiente ou limítrofe.
**Recusa:** saída para incompatibilidade ou ausência de evidência mínima.
**Fila de revisão:** conjunto de casos humanos que registra decisões rastreáveis.
**Benchmark de identidade:** conjunto próprio de positivos e negativos para medir `SAME_AS`.
**Benchmark de referência cruzada:** conjunto próprio de relações publicadas e contradições para medir recuperação e proveniência.
**Benchmark de intercâmbio:** conjunto próprio de substituições condicionadas e negativos técnicos para medir precisão por aplicação.
**Portão de prova:** evidência obrigatória para avançar à fase seguinte.
**Proveniência:** registro da origem e versão de dado, atributo, relação ou decisão.
**Névoa:** pergunta ainda insuficientemente definida para virar ticket executável.
**Tradução em lote:** aplicação da resolução a uma exportação para produzir um mapa auditável.
**Guardrail de requisição:** verificação futura, posterior ao vínculo real entre peça e ativo, antes da solicitação no sistema do cliente.
