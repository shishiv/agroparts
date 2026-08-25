# Glossário

## Nomes

**agroparts:** nome do repositório e da iniciativa inscrita no Rota Inova AGR08.
**PartsGraph:** nome do produto construído pela iniciativa agroparts.
**AGR08:** desafio Eficiência na Gestão de Peças do Rota Inova.

## Domínio

**Item canônico:** identidade estável de uma peça descrita por substantivo, modificador e atributos tipados.
**Código legado:** identificador existente no ERP, CMMS, planta, fornecedor ou histórico do cliente.
**Mapa de códigos:** relação não destrutiva entre códigos legados e itens canônicos.
**Resolução de item:** função que transforma texto sujo ou código em item canônico, atributos, equivalentes e confiança.
**Equivalente:** código de outra origem que representa a mesma peça segundo atributos e evidência validados.
**Substantivo:** nome principal da família material do item.
**Modificador:** qualificador que especializa o substantivo.
**Atributo tipado:** propriedade com nome, tipo, unidade e valor normalizados.
**Descrição por regra:** texto derivado de campos canônicos em ordem determinística.
**Referência de fabricante:** código atribuído pelo fabricante a uma peça.
**Padrão descritivo:** estrutura CATMAT que agrupa itens por uma forma comum de descrição e atributos.
**CATMAT:** Catálogo de Materiais do Compras.gov.br usado como taxonomia e corpus público inicial.
**PNCP:** Portal Nacional de Contratações Públicas usado como fonte complementar de contexto de contratação.
**CATMAS:** Catálogo de Materiais e Serviços de Minas Gerais mantido no SIAD e acessado pelo Portal de Compras MG.
**ERP:** sistema corporativo no qual permanecem cadastro, pedido, contrato e compra.
**CMMS:** sistema de gestão da manutenção no qual permanecem ativo, ordem de serviço e consumo.
**Inquilino:** fronteira lógica e operacional de dados de um cliente.
**Base comum:** conjunto compartilhado limitado a mapeamentos anônimos de código para item canônico.
**Busca vetorial:** recuperação de candidatos por proximidade sem autoridade para decidir equivalência.
**Evidência:** sinal auditável usado na decisão, como referência, dimensão, material ou tipo.
**Contradição:** conflito entre atributos que reprova um candidato.
**Nota calibrada:** pontuação cuja faixa corresponde à taxa de acerto observada.
**Calibração:** medição que alinha a nota à taxa de acerto observada.
**Limiar:** fronteira de nota que separa as saídas de uma família.
**Faixa automática:** conjunto de casos que o sistema pode resolver dentro do contrato de erro.
**Precisão automática:** proporção de resoluções corretas entre as resoluções automáticas.
**Cobertura automática:** proporção de entradas resolvidas automaticamente.
**Resolve:** saída para equivalência aceita dentro do contrato de erro.
**Revisa:** saída para decisão humana por evidência insuficiente ou limítrofe.
**Recusa:** saída para incompatibilidade ou ausência de evidência mínima.
**Fila de revisão:** conjunto de casos humanos que realimenta mapa e calibração.
**Gabarito:** conjunto rotulado de pares verdadeiros e falsos usado para medir resolução.
**Portão de prova:** evidência numérica obrigatória para avançar à fase seguinte.
**Proveniência:** registro da origem de um dado, atributo ou decisão.
**Névoa:** pergunta ainda insuficientemente definida para virar ticket executável.
**Tradução em lote:** aplicação da resolução a uma exportação inteira para produzir o mapa de códigos.
**Guardrail de requisição:** verificação futura de compatibilidade e equivalência antes da solicitação no sistema do cliente.
**Comissão latente:** possibilidade não ativada de receita por compra atribuída e conciliada.
