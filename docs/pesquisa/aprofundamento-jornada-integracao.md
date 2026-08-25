# Aprofundamento: jornada, confiança e integração MRO

Data da pesquisa: 2026-08-25

## Resumo executivo

O AGR08 do Rota Inova descreve uma aplicação que identifica peças, integra catálogo de fabricante, gera requisições, correlaciona peças, classifica materiais e evita solicitações indevidas.[1] O site oficial apresenta a jornada do programa como conexão entre dores reais de grandes empresas, startups, universidades e empresas de tecnologia, seguida de matching, plano de validação e prova de conceito.[1] Para o PartsGraph, isso desloca a pergunta de "qual modelo encontra duplicatas?" para "qual decisão de material pode ser confiada em cada ponto do fluxo de manutenção e compras, com reversibilidade e prova de resultado?"

A pesquisa fecha cinco decisões de produto:

1. O sistema deve ser uma camada de resolução e tradução não destrutiva. O ERP ou CMMS continua sendo o sistema de registro, aprovação, requisição, pedido, consumo e compra.
2. A jornada precisa separar ingestão, recuperação de candidatos, decisão, revisão humana, gravação da tradução e consulta operacional. Candidato não é equivalência.
3. Confiança não deve ser um número solto. A saída precisa indicar relação, evidências, versão do modelo ou regra, faixa operacional e ação permitida: `resolve`, `revisa` ou `recusa`.
4. O caminho MRO precisa carregar contexto de ativo, planta, localização funcional, equipamento, BOM, ordem e tipo de material. A mesma descrição pode ser segura em um cadastro e insuficiente em outro.
5. A integração inicial deve ser por arquivo e API. Adaptadores nativos para SAP, Maximo ou outro ERP/CMMS só entram depois que o piloto definir o sistema, os identificadores, o fluxo de autorização e o contrato de retorno.

A conclusão não é que o PartsGraph deva copiar SAP, IBM, OpenRefine, Splink ou dedupe. Essas fontes mostram padrões de governança, revisão, identificadores, limiares e integração que tornam a decisão auditável. A implementação deve continuar independente e compatível com o contrato local do projeto.

## 1. Escopo e evidência do desafio

### 1.1 O que o Rota Inova realmente pede

A página oficial do Rota Inova define o programa como uma forma de conectar grandes players da bioenergia que trazem dores e desafios ao ecossistema de inovação, com uma jornada para identificar startups, universidades, fomento e empresas de tecnologia capazes de melhorar a eficiência operacional.[1] O desafio AGR08 é específico: identificação automática de peças, integração com catálogo de fabricantes, geração automática de requisições, correlação e classificação de materiais e prevenção de solicitações indevidas.[1]

A página também separa etapas de inscrição, seleção, pitch, seleção final, bootcamp, matching, plano de validação e prova de conceito a partir de 03/09/2026.[1] A implicação para o PartsGraph é importante: o artefato de fechamento não é uma tela de busca nem uma demonstração de similaridade. É uma prova de conceito que acompanha uma decisão desde um cadastro importado até uma consulta operacional, registrando onde houve automação, onde houve revisão e qual foi o efeito mensurável.

O Rota Inova não transforma seleção em contrato. O regulamento informa que estar entre as finalistas não garante contrato ou investimento, pois a decisão fica com as comissões das empresas cotistas.[1] Portanto, o PartsGraph não deve apresentar integração, economia, redução de paradas ou requisições evitadas como resultado realizado antes de um piloto autorizado. Deve apresentar hipóteses, critérios de aceite e métricas observadas.

### 1.2 Leitura do problema como MRO

MRO significa manutenção, reparo e operação. Neste contexto, o objeto não é somente um item de catálogo: é um material que aparece em uma ordem, uma lista de componentes, uma BOM de manutenção, uma reserva, uma requisição ou um pedido associado a um ativo.

O repositório já define a resolução de item como a unidade de valor, com item canônico, atributos, equivalentes, evidências e confiança. Também define que o produto não deve apagar ou reescrever o ERP, que a fila humana é permanente e que a primeira entrega permanece agnóstica de ERP. Esta pesquisa reforça essas decisões e acrescenta o contexto operacional que precisa estar no contrato de API.

## 2. O que as fontes mostram sobre a jornada real

### 2.1 SAP MDG Material: governar antes de ativar

A documentação SAP para MDG Material descreve a ativação do modelo de dados MM, a definição do escopo de governança, a atribuição de chave interna, a carga, a pesquisa, a checagem de duplicidade e os tipos de change request para criar, alterar, marcar para exclusão, processar múltiplos materiais e importar materiais.[2]

O escopo de governança controla quais campos podem ser editados pelo MDG. Um campo retirado do escopo fica somente leitura na interface, sem alteração no dicionário ou na tabela do banco.[2] Para o PartsGraph, isso corresponde a separar campos de origem, campos derivados e campos que podem ser aceitos pela revisão. O sistema pode propor uma tradução sem assumir autoridade para reescrever a fonte.

A documentação SAP distingue o dado ativo do dado em processamento: os conectores `MATERIAL` e `MDG_MATERIAL` representam, respectivamente, dados ativos e dados inativos ligados a change requests.[2] O desenho local deve manter essa mesma distinção:

- `source_snapshot`: cópia imutável do registro importado;
- `staging_resolution`: atributos extraídos, candidatos e proposta ainda não aplicada;
- `approved_translation`: vínculo aprovado no mapa de códigos;
- `revoked_translation`: vínculo desativado por revisão posterior, sem apagar o histórico.

A SAP entrega o perfil de correspondência `MATCH_MM_MATERIAL` e permite definir campos próprios para calcular duplicidades e valores correspondentes.[2] A fonte também informa que, nessa configuração de duplicate check para o modo de busca ES, thresholds não são considerados.[2] A consequência para o PartsGraph é não importar uma ideia de "score SAP" como se fosse a confiança do produto. A busca pode indicar possíveis duplicatas, mas o contrato local continua precisando de limiar calibrado, relação explícita e decisão segura.

### 2.2 SAP EAM: o material aparece dentro de uma estrutura de manutenção

O Feature Scope Description do SAP S/4HANA 2023 descreve localização funcional como uma área dentro de um sistema ou planta onde um objeto pode ser instalado. Equipamentos individuais são instalados em localizações funcionais e seus tempos de uso são registrados ao longo do tempo.[3] A mesma fonte descreve BOM de manutenção como uma lista de materiais, quantidades, números de objetos, unidade de medida e vínculo ao objeto técnico ou material.[3]

Na execução, a ordem de manutenção reúne o objeto técnico, datas, materiais planejados, serviços externos, ferramentas, disponibilidade e custos.[3] Isso estabelece o contexto mínimo que uma consulta MRO deve aceitar quando existir:

| Contexto | Por que importa para resolução |
|---|---|
| Planta | Pode alterar disponibilidade, extensão do material, unidade e fonte de estoque. |
| Localização funcional | Delimita onde o objeto está instalado e qual estrutura técnica está em manutenção. |
| Equipamento | Identifica o objeto físico, seu histórico e sua relação com a localização. |
| Número de série ou modelo | Pode limitar a aplicabilidade de um material. |
| BOM de manutenção | Lista componentes e quantidades esperados para um objeto ou conjunto. |
| Ordem ou notificação | Dá o motivo, a operação, a urgência e o consumo planejado. |
| Tipo de material | Diferencia, entre outras possibilidades, item de estoque, não estocado, conjunto ou serviço. |

A documentação de BOM do SAP descreve dois caminhos: vincular diretamente uma BOM a equipamento ou localização funcional, ou usar uma BOM de material compartilhada por objetos de mesma construção.[4] Para materiais em ordem de manutenção, o fluxo também distingue material de estoque, que pode gerar reserva, e material não estocado, cuja seleção pode gerar requisição de compra.[4]

O PartsGraph não deve decidir sozinho se uma peça será reservada, requisitada ou comprada. Deve resolver o material e retornar evidência suficiente para que o ERP ou CMMS execute suas próprias regras. A resposta precisa preservar o contexto que originou a consulta, para evitar que uma equivalência válida em uma planta seja reutilizada como se fosse universal.

### 2.3 SAP MDG EAM: importar, revisar, aprovar, ativar e replicar

A documentação de EAM 2024 publicada no SAP Help Portal é uma documentação do add-on da Prometheus Group, não uma descrição genérica do núcleo SAP. Ela é útil como fonte primária do fluxo do produto documentado pelo fornecedor. O guia lista equipamentos, localizações funcionais, BOMs de material, equipamento, localização funcional e WBS, pontos de medição, centros de trabalho, listas de tarefas, planos de manutenção, vínculos e redes como objetos de governança.[5]

O guia descreve o padrão de change request: criar a solicitação, submetê-la à aprovação, executar a mudança e replicar o resultado. Também lista Data Import Framework, Key Mapping, Data Replication Framework e adaptação de interface como capacidades do processo.[5] Para equipamentos, o guia do produto descreve dados na área de staging, encaminhamento automático a especialista para revisão e gravação nas tabelas ERP depois da aprovação.[6]

O mesmo padrão aparece para localização funcional e BOM: o dado fica temporariamente em staging, o especialista revisa, a aprovação ativa o dado e a replicação o leva aos sistemas conectados.[6] O guia também menciona importação por arquivos XML e CSV, com ou sem key mapping, e opções de processamento manual ou governado para múltiplos registros.[5]

O desenho do PartsGraph deve adotar a parte estrutural do padrão, sem fingir que é MDG:

1. importar o lote com um identificador de execução;
2. registrar o esquema, a origem, a versão e o hash do arquivo;
3. processar em staging privado do inquilino;
4. enviar casos ambíguos para revisão;
5. gravar o mapa aprovado com evidências e versão;
6. exportar somente o resultado autorizado;
7. tornar a publicação idempotente e rastreável;
8. permitir revogação do vínculo sem remover o registro de origem.

O EAM 2024 documenta replicação manual, `DRFOUT` e automática para sistemas SAP de destino, além de status de exclusão ou inatividade replicados por IDoc.[5] Isso confirma que integração de master data não é um simples `POST` sem estado. O PartsGraph precisa representar destino, operação, versão, chave externa, tentativa, resposta e estado de sincronização.

A documentação também descreve dependência entre material e BOM: em uma opção de integração MDG-M, materiais ausentes podem ser criados a partir do change request da BOM, os change requests de material precisam ser aprovados e ativados antes da BOM, e a BOM só pode ser ativada depois das dependências.[5] No PartsGraph, uma tradução de componente nunca deve ser considerada pronta para uso em BOM apenas porque o texto parece correto. O retorno deve indicar dependências ainda não resolvidas.

## 3. Duplicidade, identificadores e revisão humana

### 3.1 IBM Maximo Inventory Optimization: duplicata como part number mais contexto

A documentação IBM do relatório **Find duplicate items** define o objetivo como identificar múltiplos stock codes que referenciam a mesma peça. O relatório parte de itens de inventário e part numbers, organiza possíveis duplicatas e permite navegar por tabela de correspondência, material, código, localização e equipamento.[7]

A presença de equipamento, número de BOM, último issue e equipamento relacionado no detalhamento é um sinal de domínio importante.[7] Duplicidade MRO não deve ser avaliada apenas em duas descrições. A revisão deve mostrar onde o item é usado, qual BOM o referencia, qual histórico de issue existe e em qual planta ou localização ele aparece, quando esses campos forem fornecidos pelo cliente.

A fonte IBM também mostra o risco de escopo: o mesmo part number pode aparecer em mais de um material, item key, divisão ou empresa.[7] Para o PartsGraph, `same_as` precisa ser limitado pelo inquilino e pela origem, enquanto `manufacturer_reference` pode ser uma evidência comum somente quando a licença e a proveniência permitirem. Um mesmo texto não autoriza compartilhar estoque, consumo, fornecedor ou histórico entre clientes.

### 3.2 IBM MDM: a fila de revisão tem estados e efeitos

A documentação IBM de remediação de potenciais matches exige configurar a faixa de revisão clerical e os thresholds de revisão e autolink antes de gerar tarefas.[8] As tarefas podem ser criadas para todo o conjunto ou para resultados filtrados, evitando sobrecarregar a fila do steward.[8]

A jornada descrita é concreta:

1. gerar tarefas para potenciais matches;
2. atribuí-las a uma caixa de tarefas;
3. o steward reivindicar a tarefa;
4. comparar registros lado a lado;
5. visualizar o efeito antes de decidir;
6. escolher link, unlink ou skip;
7. submeter a alteração explicitamente;
8. consultar as tarefas concluídas.

Ao reivindicar a tarefa, o sistema impede que outra pessoa trabalhe nela ao mesmo tempo.[8] Se o dado muda durante o processo de matching, a tarefa pode ser invalidada e removida, devendo ser recriada se o problema persistir.[8] Isso fecha dois requisitos que normalmente ficam esquecidos no MVP: concorrência da revisão e invalidação por dado obsoleto.

O PartsGraph deve ter uma máquina de estados mínima para revisão:

| Estado | Significado | Próxima ação |
|---|---|---|
| `pending` | Candidato pronto para revisão. | `claim`, `skip` ou abertura. |
| `claimed` | Um revisor possui a tarefa por lease. | Comparar e decidir. |
| `stale` | O snapshot, candidato ou regra mudou. | Recalcular e gerar nova tarefa. |
| `accepted` | O vínculo foi aceito. | Gravar tradução versionada. |
| `rejected` | O vínculo foi negado. | Registrar negativo e impedir automação equivalente. |
| `deferred` | Faltam evidências ou autorização. | Retornar à fila com motivo. |
| `revoked` | Decisão anterior deixou de valer. | Reprocessar dependências sem apagar histórico. |

O resultado da revisão não deve alterar a fonte importada. Deve alterar o mapa de tradução e o conjunto de evidências e negativos que alimentará a próxima calibração.

### 3.3 IBM Product Master: identificador primário e alternativos

A documentação IBM Product Master exige um identificador primário para facilitar troca de dados e resolução de duplicidades. Identificadores alternativos servem para busca e referência, como GTIN, UPC, SKU ou uma combinação de fornecedor e modelo.[9] Os identificadores alternativos devem ser pesquisáveis e as restrições de unicidade precisam ser declaradas ou validadas conforme a regra de negócio.[9]

A aplicação para PartsGraph é direta:

- `canonical_id` é estável dentro do domínio do PartsGraph;
- `source_system` e `source_record_id` preservam a identidade externa;
- `legacy_code` é um identificador alternativo pesquisável, nunca substituído;
- `manufacturer` e `manufacturer_part_number` formam uma chave de evidência, não necessariamente uma chave global;
- planta, almoxarifado, localização e inquilino ficam no escopo privado;
- combinações de campos precisam declarar se são únicas, não únicas ou condicionais.

Não se deve usar o código legado como identidade canônica porque isso transforma uma origem local em autoridade universal. Também não se deve gerar um novo código ERP silenciosamente. A criação ou alteração de identificador externo precisa permanecer no fluxo autorizado do cliente.

### 3.4 IBM Suspect Duplicate Processing: workflow separado do catálogo

A documentação IBM Product Master 14.0 mostra que o suspect duplicate processing pode ser colocado em workflows existentes ou novos, com uma área de colaboração que usa catálogo mestre ou operacional.[10] O material suspeito pode aparecer em uma aba de processamento, mas decisões de match ou no-match podem exigir navegação ao item pela chave primária.[10]

A conclusão de UX é que "mostrar candidatos" e "permitir decidir" são capacidades distintas. O PartsGraph deve tornar a decisão uma ação de primeira classe, com contexto, escopo, autorização, revisão e confirmação. Um painel que só exibe score não é uma fila de governança.

## 4. OpenRefine: um contrato útil para reconciliação, não para decisão automática

OpenRefine define reconciliação como a correspondência de um dataset com uma fonte externa. O processo é semiautomático: o sistema sugere matches, mas o julgamento humano revisa e aprova resultados.[12] A documentação recomenda limpar ou agrupar os dados antes da reconciliação e trabalhar iterativamente com diferentes configurações e subgrupos.[12]

Há três padrões úteis:

1. **Valor original preservado:** em uma célula reconciliada, o valor original continua armazenado junto da entidade vinculada.[12]
2. **Candidato e julgamento separados:** um candidato melhor ranqueado pode ser aceito, recusado ou deixado sem decisão; score maior não significa automaticamente verdade universal, pois cada serviço calcula seus scores de forma diferente.[12]
3. **Reconciliar por lotes e propriedades:** tipo, fabricante, dimensão, unidade ou outro campo pode reduzir ambiguidade, e identificadores podem ser exportados depois da decisão.[12]

A Reconciliation API do OpenRefine define um serviço que recebe texto, tipo e propriedades opcionais e retorna uma lista ranqueada de entidades candidatas. O protocolo também prevê recursos para revisar e corrigir a correspondência, como preview e autocomplete.[13] O PartsGraph pode oferecer um adaptador compatível com a versão estável 0.2 como conveniência para ferramentas de saneamento, sem adotar o score do serviço como contrato de confiança.

A recomendação de projeto é:

- manter `/reconciliation` para recuperação de candidatos;
- incluir `tenant_id`, `source_snapshot_id`, `query_context` e `relation_types` na API própria;
- retornar `candidate_id`, `rank`, `score_raw`, `confidence_calibrated`, evidências e contradições;
- retornar o original sempre que uma tradução for exibida;
- exigir endpoint separado ou ação explícita para aceitar ou rejeitar;
- registrar `judgment`, `judgment_actor`, `judgment_at` e `judgment_version`.

## 5. Confiança, thresholds e métricas

### 5.1 O que Splink e dedupe fecham

Splink recomenda ground truth rotulado por revisão humana para produzir métricas de linkage, spot check de casos reais e análise de erros.[14] A ferramenta de seleção de threshold compara score com rótulos, mostra matriz de confusão e explicita a troca entre precisão e recall: aumentar o limiar tende a reduzir falsos positivos, enquanto diminuir o limiar tende a reduzir falsos negativos.[15]

Splink também alerta que links não são necessariamente a saída final: quando os pares formam clusters, os clusters precisam ser avaliados separadamente.[14] Isso é especialmente relevante para o PartsGraph. Um mapa com três códigos apontando para um item pode ser correto, enquanto uma cadeia de similaridades pode gerar uma fusão indevida. A avaliação precisa medir tanto o par quanto o grupo e a relação.

A documentação de métricas do Splink exige ground truth e recomenda não resumir um modelo por uma única medida.[16] Precisão, recall, especificidade, valor preditivo negativo, F-score e métricas compostas respondem a riscos diferentes.[16]

Dedupe descreve o mesmo trade-off entre precisão e recall e alerta que o threshold só é bom quando os exemplos rotulados representam os dados que serão classificados.[17] A biblioteca usa active learning para pedir rótulos em pares onde regras de blocking e classificador discordam, reaprendendo pesos e regras depois da decisão humana.[18]

### 5.2 Contrato de confiança proposto

O PartsGraph deve tratar score bruto, confiança calibrada e ação operacional como campos diferentes.

| Camada | Pergunta | Exemplo de saída |
|---|---|---|
| Similaridade | O candidato parece próximo? | `score_raw = 0.91` |
| Evidência | Quais sinais sustentam ou contradizem? | referência exata, unidade compatível, dimensão conflitante |
| Calibração | Qual taxa observada corresponde à faixa? | faixa `0.98-0.99` em uma família e relação específicas |
| Política | O que o sistema pode fazer? | `resolve`, `revisa` ou `recusa` |
| Autorização | A ação está permitida neste fluxo? | somente sugerir, gravar tradução ou publicar no adaptador |

A política inicial deve ser conservadora:

- `resolve`: somente quando a família e a relação possuem gabarito suficiente, não há contradição crítica e a precisão observada na faixa automática atende ao contrato local de erro inferior a 1%;
- `revisa`: quando há candidatos plausíveis, mas a cobertura, a margem, a evidência ou o contexto não sustentam automação;
- `recusa`: quando há contradição de atributo, relação não suportada, identificador conflitante ou evidência mínima ausente.

Não há threshold global. O limiar deve ser versionado por família, relação e talvez por contexto de uso. `SAME_AS` entre códigos com referência de fabricante pode ter regra diferente de `INTERCHANGEABLE_FOR` entre fabricantes, e uma relação de aplicabilidade a equipamento deve exigir dados do ativo.

O sistema deve manter uma margem entre o primeiro e o segundo candidato. Um primeiro candidato com score alto, mas quase empatado com outro, deve ir para revisão. Um primeiro candidato com evidência exata e sem contradição pode ser automático mesmo que a similaridade textual não seja a maior evidência.

### 5.3 Gabaritos separados

O gabarito atual do repositório, baseado em referências iguais e padrões distintos, é adequado para iniciar identidade, mas não fecha todo o risco MRO. A avaliação deve separar:

1. **Identidade:** mesma referência de fabricante, fabricante e revisão, sem contradição.
2. **Especificação:** mesma combinação normalizada de propriedades, unidades, tolerâncias e versão.
3. **Referência cruzada:** relação publicada entre códigos, com fonte e escopo.
4. **Intercambiabilidade:** substituição válida para uma aplicação e condições explícitas.
5. **Aplicabilidade:** material compatível com ativo, modelo, série, planta ou BOM.
6. **Não correspondência:** descrições próximas que divergem em dimensão, material, rosca, vedação, carga, montagem ou unidade.

Cada conjunto deve reportar positivos, negativos, origem do rótulo, data, revisor e cobertura das famílias. Não misturar todos os tipos em uma "acurácia geral".

### 5.4 Métricas para o primeiro piloto

**Qualidade da resolução**

- precisão automática por família e relação;
- cobertura automática por família e relação;
- taxa de revisão e taxa de recusa;
- falso positivo automático em número absoluto e percentual;
- taxa de aceitação da fila humana;
- divergência entre revisores;
- taxa de revogação ou correção de traduções;
- precisão de clusters, quando houver agrupamento;
- calibração por faixa de confiança.

**Operação da fila**

- tarefas abertas, reivindicadas, stale e concluídas;
- idade da tarefa e tempo até primeira ação;
- tempo até decisão;
- quantidade de tarefas por família e por inquilino;
- percentual de tarefas invalidado por mudança de snapshot;
- motivos de `skip`, `rejected`, `deferred` e `revoked`.

**Integração MRO**

- consultas com contexto de ativo que retornaram um material aceito;
- linhas de BOM ou ordem que exigiram revisão;
- tempo entre entrada da descrição e retorno de candidato;
- quantidade de requisições que receberam uma tradução já aprovada;
- falhas de idempotência, validação ou chave externa;
- eventos publicados, confirmados, rejeitados e reprocessados;
- número de escritas automáticas no sistema do cliente, que deve ser zero no MVP de arquivo e somente ocorrer em adaptador explicitamente aprovado.

Economia, redução de estoque, redução de compras ou redução de parada são métricas possíveis do piloto, mas não são resultados disponíveis na pesquisa. Devem ser medidas com baseline e atribuição acordada com a empresa.

## 6. Jornada de produto fechada

### Etapa 0: autorização e contrato do lote

O cliente fornece um CSV ou XLSX com o menor conjunto útil, dicionário de campos, origem autorizada, escopo de plantas e objetivo do piloto. O sistema cria `import_run_id`, registra o inquilino, o sistema de origem, o usuário, o hash do arquivo, a versão do esquema e a política de retenção.

O lote deve falhar fechado quando faltar `tenant_id`, quando o esquema não for compatível ou quando houver colunas comerciais não permitidas no escopo comum. Nenhuma consulta, fila ou exportação pode omitir o escopo do inquilino.

### Etapa 1: ingestão sem alteração da origem

O PartsGraph grava uma cópia do valor original e uma representação normalizada separada. A ingestão valida encoding, cabeçalho, tipos, unidades declaradas, duplicidade de chave de origem, colunas obrigatórias e referências cruzadas presentes.

Saída mínima por registro:

```text
source_record_id
source_system
source_snapshot_id
tenant_id
source_plant
source_storage_location
legacy_code
original_description
original_manufacturer
original_manufacturer_part_number
original_unit
original_quantity
asset_context
raw_payload_hash
```

O produto não envia alteração ao ERP ou CMMS nesta etapa.

### Etapa 2: extração e normalização

O pipeline extrai substantivo, modificador, fabricante, referência, família, atributos, unidades, tolerâncias, planta, equipamento e contexto de uso quando disponíveis. O valor original continua intacto. Cada campo derivado precisa registrar origem, método, versão e eventual transformação.

A normalização deve ser capaz de dizer "não extraído". Campo vazio não pode ser interpretado como concordância. Unidade ausente, referência parcial e fabricante presumido devem reduzir a confiança ou enviar o caso para revisão.

### Etapa 3: recuperação de candidatos

A recuperação combina, conforme a família:

- correspondência exata de código e referência;
- aliases e sinônimos controlados;
- busca por atributos tipados;
- busca textual ou vetorial;
- catálogo de fabricante autorizado;
- relações já aprovadas no mapa do inquilino;
- relações comuns anonimizadas somente quando a política permitir.

A busca retorna vários candidatos e evidências. Ela não grava `same_as`, não escolhe silenciosamente o primeiro resultado e não trata similaridade como autorização de compra.

### Etapa 4: decisão por relação

O motor aplica primeiro contradições e depois concordâncias. Uma dimensão incompatível, unidade incompatível ou referência conflitante reprova o candidato. Concordâncias somam evidência, mas não eliminam a necessidade de contexto.

A saída deve conter:

```text
resolution_id
source_snapshot_id
candidate_id
relation_type
score_raw
confidence_calibrated
confidence_band
decision
blocking_reasons
supporting_evidence
model_version
ruleset_version
created_at
```

### Etapa 5: fila humana

Casos `revisa` entram em fila com candidato principal, alternativas, comparação lado a lado, evidências, contradições, origem, contexto MRO e histórico de decisões semelhantes. O revisor reivindica a tarefa, decide ou adia, e a confirmação explícita é necessária para aplicar o vínculo.

A fila não deve mostrar somente uma porcentagem. Deve explicar por que o candidato foi sugerido e o que ainda falta para resolver. Um botão de aceitar precisa deixar claro qual relação está sendo criada: mesma identidade, referência cruzada, intercambiável sob condição, compatível com ativo ou apenas alias de busca.

### Etapa 6: gravação da tradução

Uma decisão aceita cria ou atualiza um vínculo versionado:

```text
translation_id
tenant_id
source_system
source_record_id
legacy_code
canonical_id
relation_type
state
review_decision
reviewer_id
evidence_ids
ruleset_version
supersedes_translation_id
valid_from
valid_to
created_at
```

`state=active` permite consulta. `state=revoked` impede nova automação, mas conserva a decisão e seu motivo. Correções criam uma nova versão que aponta para a anterior. O registro de origem nunca é apagado.

### Etapa 7: consulta no fluxo de manutenção

Uma ordem, notificação, BOM ou tela do CMMS consulta o PartsGraph com texto, código e contexto de ativo. Quando houver tradução aprovada, a API retorna o material canônico, os identificadores de origem, a relação, a evidência resumida e a validade. Quando não houver segurança, retorna candidatos e revisão pendente, sem simular uma escolha.

O fluxo de manutenção precisa permitir pelo menos:

1. localizar a planta e o objeto técnico;
2. informar código ou descrição da peça;
3. receber material aceito, candidatos ou recusa;
4. exibir estoque, BOM ou histórico somente do sistema do cliente;
5. registrar que a resolução foi usada na ordem ou notificação;
6. coletar o resultado da decisão humana ou do consumo posterior.

O PartsGraph não deve criar reserva, baixar estoque, concluir ordem ou alterar BOM no MVP. Essas ações pertencem ao ERP ou CMMS.

### Etapa 8: consulta no fluxo de compras

Em compras, a resolução pode ser chamada antes da requisição para identificar se existe material já cadastrado, se o candidato é um item de estoque ou não estoque e se há dependência de aprovação. O retorno deve ser uma recomendação com chave externa e evidência, não um pedido automático.

Quando o material for não estocado ou não existir, o ERP pode seguir seu fluxo de requisição. A documentação SAP diferencia esses caminhos e pode gerar uma purchase requisition para material não estocado.[4] O PartsGraph apenas registra a decisão de identidade e o evento de uso, deixando a política de compra e aprovação no sistema do cliente.

### Etapa 9: feedback e reprocessamento

A confirmação, rejeição, skip, revogação e uso posterior alimentam o conjunto de rótulos. Um dado alterado invalida resoluções pendentes que dependem dele. Uma nova versão de regra não deve reescrever decisões antigas sem gerar um novo evento de reprocessamento.

O ciclo fechado é:

```text
importar -> normalizar -> candidatos -> decidir -> revisar
   -> gravar tradução -> consultar MRO -> registrar uso
   -> rotular resultado -> recalibrar -> reprocessar somente o necessário
```

## 7. Contrato de integração

### 7.1 MVP por arquivo e API

O primeiro corte deve aceitar CSV/XLSX, produzir um mapa de códigos e expor resolução individual por API. O formato precisa ser documentado e idempotente. Reprocessar o mesmo `source_snapshot_id` não pode criar dois vínculos ativos para a mesma chave sem uma decisão explícita.

Endpoints conceituais:

| Endpoint | Finalidade | Efeito |
|---|---|---|
| `POST /imports` | Registrar lote autorizado. | Cria execução privada. |
| `GET /imports/{id}` | Acompanhar validação e processamento. | Somente leitura. |
| `POST /resolutions` | Buscar candidatos para um registro. | Não altera origem. |
| `GET /review-tasks` | Listar fila do inquilino. | Somente tarefas autorizadas. |
| `POST /review-tasks/{id}/claim` | Reivindicar tarefa. | Cria lease e auditoria. |
| `POST /review-tasks/{id}/decision` | Aceitar, rejeitar, adiar ou recusar. | Cria decisão versionada. |
| `GET /translations` | Consultar mapa aprovado. | Filtrado por inquilino e origem. |
| `POST /exports` | Produzir retorno para o cliente. | Registra snapshot exportado. |
| `POST /integration-events` | Registrar publicação em adaptador. | Idempotência e estado de entrega. |

A API pode expor um modo de reconciliação compatível com OpenRefine, mas o contrato nativo deve carregar tenant, snapshot, contexto MRO, relação e confiança calibrada. Compatibilidade de protocolo não substitui governança.

### 7.2 Adaptador SAP

Depois de o piloto definir o landscape, o adaptador SAP pode consumir exportação, apoiar cargas de material e usar mecanismos aprovados pelo cliente, como change request, key mapping, IDoc ou Data Replication Framework. A documentação MDG Material descreve pesquisa de dados ativos e inativos, tipos de request e conectores de busca.[2] A documentação MDG EAM descreve importação, staging, aprovação, ativação e replicação por IDoc para objetos EAM.[5][6]

O adaptador precisa declarar:

- sistema lógico e cliente SAP;
- objeto e versão do contrato;
- chave externa e regra de key mapping;
- operação permitida: consultar, propor, criar change request ou publicar;
- usuário ou credencial técnica autorizada pelo cliente;
- idempotency key;
- resposta externa e correlação com `translation_id`;
- tratamento de erro e reprocessamento;
- limite explícito de campos comerciais e pessoais.

No MVP, a opção padrão é consultar e exportar. Publicação automática fica desabilitada até haver autorização e teste de reversão.

### 7.3 Adaptador Maximo ou CMMS

A documentação do conector IBM para SAP descreve carga em lote de material master e atualização em tempo real por IDoc, com impactos em ITEM, INVENTORY, planta e storage location.[11] Ela também registra um campo de efetividade para indicar se o item ainda existe no SAP e uma interface de item para integração.[11]

O PartsGraph deve tratar essa evidência como desenho de adaptador, não como autorização para escrever em Maximo. A implementação futura deve mapear:

- código e descrição de item;
- fabricante e referência;
- organização, site e storeroom;
- estoque ou não estoque, quando o cliente fornecer;
- ativo, BOM e lista de spare parts;
- status ativo, obsoleto ou revogado;
- correlação entre evento PartsGraph e registro externo.

A consulta de manutenção deve retornar a chave que o CMMS entende. O registro de decisão e evidência continua no PartsGraph, enquanto transação, saldo, reserva, ordem e consumo continuam no CMMS.

### 7.4 Isolamento por tenant

Todo registro privado, evento, tarefa, tradução, exportação e integração precisa carregar `tenant_id`. O serviço deve falhar fechado quando esse campo faltar. Índices, políticas de acesso, filas e logs devem impedir leitura cruzada.

A base comum, quando existir, deve conter apenas relações anonimizadas permitidas pela política. Nunca devem subir preço, fornecedor, condição comercial, volume, consumo, localização específica, ordem, número de contrato ou histórico de estoque. O mesmo fabricante ou part number em dois clientes não autoriza compartilhar a decisão comercial.

## 8. Reversibilidade e governança

A reversibilidade não é um botão de desfazer depois de apagar dados. É uma propriedade do modelo:

- valores de origem são imutáveis;
- decisões são append-only;
- traduções têm estado e validade;
- toda nova decisão aponta para a anterior;
- publicação externa tem idempotency key e resposta;
- revogação interrompe automação futura;
- reprocessamento é associado a uma versão de regra ou fonte;
- exportações são snapshots reproduzíveis;
- o motivo de rejeição alimenta negativos e revisão de regras.

Uma revisão não deve transformar um `same_as` em `interchangeable_for` sem criar uma nova relação. O catálogo pode continuar sugerindo similaridade, mas `similar_to` não concede autorização de uso. Relações de referência cruzada, intercambiabilidade e aplicabilidade precisam guardar fonte, condições, versão e escopo.

A auditoria deve responder, para qualquer material usado em uma ordem ou requisição:

1. qual era o valor original;
2. de qual sistema e lote veio;
3. quais candidatos foram considerados;
4. quais evidências e contradições existiam;
5. qual regra e modelo produziram a proposta;
6. quem aceitou, rejeitou ou adiou;
7. quando a tradução foi usada;
8. se estava ativa naquele momento;
9. qual exportação ou evento externo a consumiu;
10. se a decisão foi posteriormente revogada.

## 9. Gates de aceite do piloto

### Gate A: ingestão confiável

- arquivo autorizado e versionado;
- schema validado;
- original preservado;
- tenant obrigatório;
- zero escrita no ERP ou CMMS;
- relatório de aceitos, rejeitados e motivos.

### Gate B: resolução explicável

- candidatos rankeados;
- evidências e contradições visíveis;
- relação explícita;
- saída `resolve`, `revisa` ou `recusa`;
- score bruto separado da confiança calibrada;
- nenhum texto sozinho decide uma equivalência.

### Gate C: revisão governada

- claim ou lease de tarefa;
- comparação lado a lado;
- accept, reject, skip e defer;
- confirmação antes de gravar;
- invalidação por snapshot ou regra obsoleta;
- auditoria de todas as decisões.

### Gate D: confiança medida

- gabarito separado por identidade, referência, intercambiabilidade e aplicabilidade;
- precisão automática por família e relação;
- cobertura e recusa reportadas;
- erro automático abaixo de 1% no escopo prometido;
- redução de cobertura quando o contrato não fecha;
- nenhum número agregado que esconda famílias difíceis.

### Gate E: uso em MRO sem ação indevida

- consulta com planta, ativo, localização, equipamento e BOM quando disponíveis;
- retorno com chave externa do cliente;
- registro do uso na ordem, notificação ou requisição;
- reserva, baixa, pedido e compra continuam no sistema do cliente;
- caso ambíguo não vira requisição automática.

### Gate F: integração autorizada

- adaptador escolhido pelo piloto;
- contrato de campos e chaves documentado;
- idempotência testada;
- erro e reprocessamento testados;
- permissão de escrita explicitamente aprovada;
- teste de revogação e recuperação concluído.

## 10. O que está fechado e o que permanece aberto

### Fechado pela pesquisa

- AGR08 é uma demanda de eficiência de gestão de peças com identificação, catálogo, correlação, classificação e requisição.[1]
- MRO depende de objeto técnico, localização, equipamento, BOM, material e ordem, não somente de descrição.[3][4]
- Governança madura separa staging, revisão, aprovação, ativação e replicação.[2][5][6]
- Duplicidade MRO precisa mostrar part number, códigos, localização, BOM e equipamento quando os dados existirem.[7]
- Revisão humana precisa ter fila, claim, comparação, decisão e submissão explícita.[8]
- Identificadores primários e alternativos devem ter restrições claras e busca indexada.[9]
- Reconciliação e matching precisam de ground truth, thresholds por objetivo e avaliação de erros.[12][14][15][17]
- Precisão, recall ou acurácia isolados não bastam para governar o fluxo.[16]
- Integração SAP e Maximo envolve cargas, chaves, status, plantas, locais, IDocs ou interfaces, e não apenas uma chamada de classificação.[5][6][11]

### Em aberto para o piloto

- Qual ERP ou CMMS será o primeiro destino.
- Qual objeto chega primeiro: material master, item de estoque, spare part de ativo, BOM ou requisição.
- Quais campos e identificadores o cliente autoriza compartilhar com o PartsGraph.
- Quais catálogos de fabricante podem ser usados e sob qual licença.
- Quem é o revisor responsável por cada família de material.
- Qual relação pode ser automática e qual sempre exige revisão.
- Qual SLA de fila é aceitável para manutenção corretiva e preventiva.
- Se o primeiro adaptador deverá apenas consultar, propor change request ou publicar uma mudança aprovada.
- Qual baseline operacional permitirá medir tempo, cobertura e resultado sem inventar economia.

## 11. Recomendação final para o próximo corte

Implementar primeiro o fluxo privado de importação, resolução, revisão e tradução versionada, com uma API de consulta que receba código ou descrição e contexto MRO. A demonstração deve usar três casos contrastantes:

1. dois códigos locais com a mesma referência de fabricante e evidência suficiente para `resolve`;
2. uma descrição parecida, mas com dimensão ou unidade contraditória, que termina em `recusa`;
3. um candidato plausível sem contexto de ativo ou com relação entre fabricantes, que termina em `revisa`.

Em seguida, executar uma consulta de manutenção com material de estoque e outra com material não estocado, retornando a resolução para o sistema do cliente sem criar reserva ou requisição. O mapa exportado deve mostrar original, canônico, relação, confiança, evidência, revisor e estado.

Esse corte prova a tese do PartsGraph sem prometer o que ainda não foi medido: integração responsável com MRO, confiança calibrada, revisão humana e tradução reversível. A integração nativa com SAP, Maximo ou outro sistema deve ser o próximo experimento, não uma suposição embutida no produto.

## Referências locais consultadas

- `docs/produto.md`
- `docs/arquitetura.md`
- `docs/glossario.md`
- `docs/decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md`
- `docs/decisoes/adr-0004-entrega-por-api-integrada.md`
- `docs/decisoes/adr-0005-isolamento-de-dados-por-inquilino.md`
- `docs/decisoes/adr-0006-guardrails-programaticos-e-revisao-humana.md`
- `docs/decisoes/adr-0012-erp-alvo-em-aberto.md`

## Sources

[1] https://rotainovarural.com.br - Rota Inova - página oficial e desafio AGR08
    > "AGR08 - Eficiência na Gestão de Peças: Aplicação que realiza identificação automática de peças, integrando com catálogo dos fabricantes, para geração automática de requisições, correlacionar peças e classificando os materiais, evitando solicitações indevidas."
    > "A partir de 03/09/2026"
[2] https://help.sap.com/doc/saphelp_slc200/2.0/en-US/5b/362c74ba324597ace35c6422370afe/content.htm?no_cache=true - SAP - Configuring Master Data Governance for Material
    > "You can select the governance scope at any point after you activate the Data Model."
    > "The pre-delivered Match Profile for the MM data model is MATCH_MM_MATERIAL."
[3] https://help.sap.com/doc/e2048712f0ab45e791e6d15ba5e20c68/2023/en-US/FSD_OP2023_latest.pdf - SAP S/4HANA 2023 - Feature Scope Description
    > "A functional location represents an area within a system or plant where an object can be installed."
    > "In the maintenance order, you provide all the information needed to plan and execute the maintenance work."
[4] https://learning.sap.com/courses/configuring-organizational-and-master-data-in-sap-s-4hana-service/configuring-and-creating-bills-of-material - SAP Learning - Configuring and Creating Bills of Material
    > "The process flow is different if you schedule non-stock materials. In this case, ordering is initiated using item category, which results in the automatic creation of a purchase requisition."
[5] https://help.sap.com/doc/949d0053e9dc4e8c87d253e4d82ef6c1/MDG%20EAM_2024%20S_4HANA/en-US/UGI_EAM_2024_UserHelpGuide_S4H.pdf - SAP Help - MDG EAM 2024 User Help Guide
    > "EAM 2024 Solutions by Prometheus Group can be used to request, approve, and execute changes to"
    > "Data Import functionality is available to create multiple records using XML and CSV files with"
    > "The replication of the status happens through IDocs and the status are accordingly adjusted in the backend SAP system, thus maintaining synchronization of the status."
[6] https://help.sap.com/doc/91d29b6b47ca449ba17dc749a3407812/MDG%20EAM_2024%20S_4HANA/en-US/UGI_UGI1_EAM_2024_MasterUpgradeGuide.pdf - SAP Help - MDG EAM 2024 Master Upgrade Guide
    > "While the equipment data is stored temporarily in the staging area, the Change Requests are forwarded automatically to a master data specialist for any revisions."
    > "As soon as the Change Request is approved the new equipment master data is stored in the existing ERP master data tables."
[7] https://www.ibm.com/docs/en/mio?topic=reports-find-duplicate-items - IBM - Find duplicate items
    > "The Find duplicate items report is used to identify multiple stock codes that reference the same part."
    > "If any equipment is linked to the item, you are able to view information such as:"
[8] https://www.ibm.com/docs/en/ws-and-kc?topic=data-remediating-potential-matches-improve-quality - IBM - Remediating potential matches
    > "When you claim a task, the system prevents it from being worked on by other users."
    > "For each decision in the task, you can choose which action to take: manually link (Link), manually unlink (Unlink), or skip issue (Skip)."
[9] https://www.ibm.com/docs/en/product-master/12.0.0?topic=model-item-identifiers - IBM Product Master - Item identifiers
    > "Alternate identifiers are alternative values that you can use to facilitate searching and identifying the products."
[10] https://www.ibm.com/docs/en/product-master/14.0.0?topic=sdp-configuring-in-custom-workflows - IBM Product Master - Configuring suspect duplicate processing
    > "If you want to change any data in the Suspect Duplicate Processing tab, click the Primary key to navigate to the item."
[11] https://www.ibm.com/docs/en/maximo-sap-con/8.1.0?topic=applications-item-integration - IBM Maximo Connector for SAP - Item integration
    > "You can also send IDOC material master inserts and updates to Maximo Manage."
[12] https://openrefine.org/docs/manual/reconciling - OpenRefine - Reconciling
    > "Reconciliation is semi-automated: OpenRefine matches your cell values to the reconciliation information as best it can, but human judgment is required to review and approve the results."
    > "For matched values (those appearing as dark blue links), the underlying cell value has not been altered - the cell is storing both the original string and the matched entity link at the same time."
[13] https://openrefine.org/docs/technical-reference/reconciliation-api - OpenRefine - Reconciliation API
    > "In a sense, the reconciliation protocol is a standardized search API tailored to the specific needs of data matching."
[14] https://moj-analytical-services.github.io/splink/topic_guides/evaluation/edge_overview.html - Splink - Edge evaluation overview
    > "To produce Edge Metrics you will require a "ground truth" to compare your linkage results against"
    > "In this instance, evaluating the links themselves is not sufficient, you have to evaluate the resulting clusters as well."
[15] https://moj-analytical-services.github.io/splink/charts/threshold_selection_tool_from_labels_table.html - Splink - Threshold selection tool
    > "Precision can be maximised by increasing the match threshold (reducing false positives)."
    > "Recall can be maximised by decreasing the match threshold (reducing false negatives)."
[16] https://moj-analytical-services.github.io/splink/topic_guides/evaluation/edge_metrics.html - Splink - Edge metrics
    > "A model cannot be meaningfully summarised by just one of these performance measures."
[17] https://docs.dedupe.io/en/latest/how-it-works/Choosing-a-good-threshold.html - dedupe - Choosing a Good Threshold
    > "There’s always a trade-off between precision and recall."
    > "However, we will only get a good threshold if the labeled examples are representative of the data we are trying to classify."
[18] https://docs.dedupe.io/en/latest/how-it-works/Matching-records.html - dedupe - Matching Records
    > "Dedupe picks, at random from this disagreement set, a pair of records and asks the user to decide."
