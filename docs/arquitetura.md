# Arquitetura

## Unidade de valor

A resolução é o único serviço central: recebe texto sujo ou código e devolve entidades, atributos, evidências, grau de confiança e o tipo de relação resolvida.
Busca interativa e tradução em lote são vistas desse serviço.
O futuro guardrail de requisição só entra depois de existir vínculo real entre peça e ativo.

## Entidades e relações

O modelo separa `CustomerMaterial`, `ManufacturerPart`, `TechnicalSpecification`, `ProductFamily`, `AssetConfiguration`, `Evidence` e `ResolutionDecision`.
`TechnicalSpecification` contém substantivo, modificador, atributos tipados, unidades e tolerâncias.

As relações são `SAME_AS` para mesma identidade, `CROSS_REFERENCE` para referência cruzada publicada, `INTERCHANGEABLE_FOR` para substituição condicionada a uma aplicação, `COMPATIBLE_WITH` para aplicabilidade a ativo ou configuração e `SIMILAR_TO` somente para recuperação.
`SIMILAR_TO` nunca promove automaticamente para `SAME_AS`.
`CROSS_REFERENCE` não implica `INTERCHANGEABLE_FOR` sem condições técnicas e fonte.
Aplicabilidade a ativo não é inferida de código nem de descrição.

Identidade, aplicabilidade, procedência e condição permanecem separadas.
Preço, disponibilidade, garantia e compra permanecem nos sistemas transacionais e fora do núcleo.
O contrato completo está no [ADR 0013](decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md), baseado no [recon profundo](pesquisa/recon-profundo-2026-08-25.md).

## Mapa não destrutivo

Cada código legado continua no sistema de origem e participa de relações tipadas sem perder valor original.
O mapa preserva origem, evidência e a decisão que criou cada vínculo.
Nenhum fluxo apaga, funde ou reescreve registros do ERP.

## Pipeline de normalização

A ingestão recebe exportação autorizada, CATMAT e catálogos de fabricante cuja licença tenha sido verificada.
A preparação preserva o valor original e produz representação normalizada sem sobrescrever a fonte.
A extração identifica referência, fabricante, família, substantivo, modificador, atributos e unidades.
A busca textual ou vetorial recupera candidatos e nunca decide a relação.
A decisão usa regras explícitas sobre atributos, referências e evidências.
Contradição de atributo reprova um candidato, enquanto concordância apenas soma evidência.
A assimetria é intencional porque uma resolução falsa custa mais que uma revisão.
Pesos, regras e evidências são explícitos, versionados e auditáveis.
Semelhança de texto sozinha nunca resolve identidade, referência cruzada, intercâmbio ou aplicabilidade.
A saída contém decisão ternária, nota calibrada, tipo de relação e trilha das evidências.

## Contrato de confiança

Existem três saídas: resolve, revisa e recusa.
A faixa automática resolve somente acima do limiar pré-registrado da família e do tipo de relação.
A faixa intermediária revisa em fila humana.
A faixa incompatível ou sem evidência suficiente recusa.
A nota precisa corresponder à taxa de acerto observada, e a calibração é requisito de entrega.
O contrato de erro permanece inferior a 1% na faixa automática, medido separadamente por família e tipo de relação, com cobertura reduzida quando necessário.

Os benchmarks de identidade, referência cruzada e intercâmbio têm positivos, negativos e métricas próprios.
Denominadores, famílias, positivos, negativos e limiares são congelados antes dos resultados.
O relatório mostra total bruto, elegíveis, resolvidos, enviados à revisão, recusados e precisão por família e tipo de relação, sempre com números absolutos junto das porcentagens.
Uma acurácia geral única é proibida.
O contrato de medição está no [ADR 0014](decisoes/adr-0014-benchmarks-separados-e-pre-registrados.md).

## Entrega e integração

O primeiro corte consome exportação de arquivo e devolve resultados por API.
O ERP alvo permanece aberto até o primeiro piloto real definir a integração nativa.
ERP e CMMS continuam responsáveis por alerta, aprovação, requisição, pedido e compra.

## Isolamento no piloto

O piloto tem zero aprendizagem entre clientes.
Dados e decisões permanecem no inquilino, e somente corpus público e licenciado ocupa a base comum.
Promover uma relação privada exige fonte pública independente ou autorização explícita do cliente.
Logs evitam descrição completa quando identificador e hash bastam.
Retenção e eliminação são definidas no contrato do piloto.
O contrato completo está no [ADR 0018](decisoes/adr-0018-isolamento-estrito-no-piloto.md).

## Escopo da prova

A fatia vertical usa de dez a cinquenta itens reais e atravessa importação, extração, candidatos, regras, decisão ternária, revisão e exportação.
Ela só começa depois de amostra autorizada, modelo de relações corrigido, benchmarks pré-registrados e família estreita com catálogo licenciado.
A medição precede a interface e o pitch, conforme o [ADR 0020](decisoes/adr-0020-prova-antes-do-pitch.md).
