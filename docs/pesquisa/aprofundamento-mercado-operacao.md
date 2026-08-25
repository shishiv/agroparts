# Aprofundamento de mercado e operação do PartsGraph

**Consulta das fontes:** 25/08/2026, America/Sao_Paulo (UTC-03)

## Objetivo e regra de leitura

Este documento fecha a pesquisa externa sobre o valor operacional do PartsGraph e a urgência de resolver materiais MRO em operações agroindustriais, com foco no setor sucroenergético. O PartsGraph é tratado aqui como a camada não destrutiva de resolução e normalização de materiais do desafio Rota Inova Rural: preserva o cadastro de origem, liga códigos legados a um item canônico e separa `resolve`, `revisa` e `recusa`.

A pesquisa usou somente fontes primárias: órgãos públicos, organizações que mantêm padrões ou dados, associação setorial e divulgações das próprias companhias. Uma divulgação corporativa prova o que a empresa informou sobre sua própria operação, mas não prova que o mesmo resultado ocorrerá em todo o mercado. Uma auditoria de outro setor é evidência de um padrão operacional transferível, não prova de que uma usina sucroenergética tenha exatamente o mesmo problema.

Em cada seção:

- **Prova externa**: fato diretamente sustentado por uma fonte primária.
- **Hipótese do projeto**: implicação para o PartsGraph que ainda precisa ser medida ou validada com dados de cliente.
- **Limite**: o que a evidência não autoriza afirmar.

## Síntese executiva

1. **O valor operacional é mensurável, não apenas conceitual.** A ISO 55000:2024 liga gestão de ativos a valor realizado ao longo do ciclo de vida, desempenho financeiro, risco e eficiência [S1]. No setor sucroenergético, a São Martinho reportou R$ 1,249 bilhão de capex de manutenção acumulado em 9M26, além de reposição de frota e maquinário [S3]. A base econômica para melhorar a informação de peças é, portanto, material.
2. **A sazonalidade comprime a janela de decisão.** A Conab mantém acompanhamento quadrimestral da cana e publicou calendário com levantamentos da safra 2026/27 em 28/04, 20/08 e 22/12 [S4]. Nos dados da UNICA, a safra 2026/27 saiu de 195 unidades produtoras ativas na primeira quinzena de abril para 250 na segunda quinzena de maio [S5]. Isso sustenta uma janela de preparação e ramp-up, mas não permite inferir um calendário único de manutenção para todas as usinas.
3. **Estoque crítico precisa de identidade, vínculo e localização.** Auditoria do Departamento de Energia dos Estados Unidos encontrou, em uma organização que já possuía gestão de ativos e EAM, ausência de lista de peças críticas por ativo, níveis de estoque, pontos de reposição e localização estratégica; também registrou dependência de conhecimento local e divergência entre estoque físico e sistema [S6]. A auditoria é de transmissão elétrica, não de açúcar e etanol, mas documenta o risco operacional de tratar cadastro e sobressalentes como assuntos separados.
4. **Dados mestres e resolução de identificadores são uma disciplina reconhecida.** A ISO 8000-115:2024 especifica identificadores de qualidade, dono do identificador, restrições de uso e princípios para resolver o identificador até o conjunto de dados representado [S7]. A API oficial do Compras.gov.br, em sua versão 2.0 de fevereiro de 2026, afirma que CATMAT e CATSER identificam materiais e serviços usados nas contratações federais, e expõe grupos, classes, PDMs, itens e características [S9].
5. **Existe demanda observável por saneamento e padronização.** A Secretaria de Estado da Administração de Santa Catarina descreve uma contratação para sanear, padronizar e catalogar cerca de 49,7 mil itens, eliminar duplicidades e melhorar planejamento, compras centralizadas e rastreabilidade [S12]. Isso prova a existência de um problema comprador em dados de materiais, não um tamanho de mercado nem a disposição de uma usina a comprar PartsGraph.

**Conclusão:** há prova suficiente para posicionar o PartsGraph como infraestrutura de decisão para materiais MRO em operações com ativos críticos e cadastros fragmentados. Ainda não há prova externa para prometer economia, redução de paradas, automação total ou erro automático inferior a 1%. Esses resultados permanecem hipóteses e devem ser demonstrados em um piloto com exportação real, linha de base e revisão humana.

## 1. Valor operacional e oportunidade de mercado

### Prova externa

A página oficial da ISO sobre a ISO 55000:2024 descreve a gestão de ativos como uma abordagem para realizar valor dos ativos ao longo de seus ciclos de vida. A própria ISO lista como benefícios melhor desempenho financeiro, redução de custos, gestão de riscos e maior eficiência [S1]. A fonte não prescreve um produto de dados mestres nem fala de MRO, mas estabelece o resultado operacional que a informação de ativos deve apoiar: valor, risco e desempenho.

A nota técnica da EPE sobre biocombustíveis apresenta premissas e estimativas de CAPEX e OPEX para 2025-2034, incluindo etanol de cana, etanol de milho e biometano do setor sucroenergético [S2]. No cenário publicado, a produção nacional de etanol alcança 48,5 bilhões de litros em 2034, com 384,2 milhões de toneladas de cana destinadas ao biocombustível. A nota estima R$ 5,4 bilhões de investimentos em capacidade industrial de etanol de cana de primeira geração e R$ 22,3 bilhões para formação do canavial no período analisado. São projeções de planejamento energético, não desembolsos já realizados, mas confirmam a intensidade de capital e a persistência do problema operacional no horizonte relevante.

A divulgação de resultados da São Martinho de 09/02/2026 informa que a companhia processou aproximadamente 21,7 milhões de toneladas de cana na safra 2025/26. No mesmo documento, o capex de manutenção alcançou R$ 510,6 milhões no 3T26 e R$ 1,249 bilhão no acumulado de 9M26, alta de 5,3% sobre 9M25. A companhia atribui parte do desembolso à normalização do cronograma de entressafra e registra R$ 129,8 milhões em melhoria operacional, associados ao cronograma de projetos e à reposição de frotas e maquinários [S3]. É uma divulgação da própria companhia, portanto evidencia escala de operação e investimento de uma empresa líder, não uma média setorial independente.

Há também um caso público explícito de compra de saneamento de dados. A SEA/SC relata contratação de empresa especializada para revisar aproximadamente 49,7 mil itens do catálogo corporativo, corrigir inconsistências, eliminar duplicidades, atualizar o cadastro, migrar dados e treinar usuários em até 12 meses. A justificativa oficial conecta a padronização a planejamento de compras, compras centralizadas, prevenção de desperdícios, pesquisas de preço, eficiência e rastreabilidade [S12]. O caso não é agroindustrial, mas é uma prova primária de que saneamento de cadastro pode ser tratado como iniciativa de governança e eficiência, com orçamento e escopo próprios.

### Hipótese do projeto

O valor inicial do PartsGraph deve ser definido como **resolução confiável de um item**, e não como uma promessa genérica de inteligência artificial. Para cada entrada, o produto pode retornar:

- identidade de origem e descrição original;
- candidato ou item canônico;
- atributos que sustentam ou contradizem a equivalência;
- códigos de fabricante, fornecedor ou sistema relacionados;
- vínculo com ativo, planta, estoque ou ordem quando essa evidência existir;
- confiança, estado `resolve`, `revisa` ou `recusa` e trilha de decisão.

A hipótese é que essa camada melhore decisões que já têm custo operacional: localizar estoque existente, evitar nova solicitação de item já disponível, preparar uma lista de sobressalentes para manutenção, comparar materiais entre plantas e reduzir o tempo de revisão de requisições. A hipótese é coerente com as fontes, mas nenhuma fonte consultada prova a magnitude do ganho do PartsGraph.

A linha de base do piloto deve medir pelo menos:

- taxa de itens que possuem identidade técnica suficiente para decisão;
- duplicidades ou quase duplicidades confirmadas por família;
- tempo de busca e revisão antes e depois da resolução;
- requisições que apontam para item já existente em estoque;
- cobertura de peças críticas vinculadas a ativos;
- erro de `resolve` auditado por amostra independente.

### Limite

Não há fonte primária que autorize afirmar um TAM, uma economia percentual, redução de downtime ou retorno financeiro específico do PartsGraph. Os números da Verusen, Merit ou outras empresas que aparecem na pesquisa anterior do repositório são alegações comerciais próprias e não devem ser usados como prova independente nesta tese. O piloto precisa produzir sua própria evidência.

## 2. Urgência e sazonalidade da operação sucroenergética

### Prova externa

A Conab afirma que o acompanhamento da safra de cana serve para apoiar políticas públicas e a tomada de decisão dos agentes de mercado, por causa da importância estratégica e econômica do setor. A página oficial informa que o acompanhamento é feito em parceria permanente entre setor público e privado e divulgado em quatro boletins anuais [S4]. No calendário de 2026, a Conab marcou o 4º levantamento da safra 2025/26 para 17/04 e os levantamentos da safra 2026/27 para 28/04, 20/08 e 22/12 [S4]. O calendário prova a cadência pública de acompanhamento, não a data de parada ou partida de cada planta.

A UNICA reportou que o Centro-Sul encerrou a safra 2025/26 com 611,15 milhões de toneladas processadas. Na primeira quinzena de abril de 2026, já na abertura da safra 2026/27, 195 unidades produtoras estavam em operação, depois da entrada de 126 unidades nos primeiros quinze dias de abril [S5]. Em publicação de 24/06/2026 sobre a segunda quinzena de maio, a entidade reportou 250 unidades produtoras operando, 231 com processamento de cana, e moagem acumulada de 144,71 milhões de toneladas até 01/06 [S5]. A sequência evidencia uma aceleração operacional concentrada no início do ciclo.

A São Martinho reportou no 2T26 que o capex de manutenção seguia o cronograma atualizado e incluía manutenções industriais programadas. No 3T26, a companhia disse que o maior desembolso de manutenção do trimestre e do acumulado vinha da normalização do cronograma de entressafra [S3b, S3]. Essa evidência corporativa liga explicitamente o calendário de entressafra ao planejamento de manutenção, embora não revele a duração ou a lista de peças de cada unidade.

### Hipótese do projeto

A urgência do PartsGraph não deve ser apresentada como uma emergência contínua. O enquadramento mais defensável é **urgência de janela**:

1. antes da entressafra ou da manutenção programada, a planta pode organizar cadastro, ativos, sobressalentes e equivalências;
2. durante o ramp-up da moagem, a operação precisa priorizar respostas de alta confiança e encaminhar casos ambíguos para revisão;
3. durante a safra, o sistema deve preservar rastreabilidade e capturar novos vínculos sem introduzir equivalências arriscadas.

Isso sugere uma entrada comercial e operacional em torno de uma planta, uma exportação e uma família crítica, com entrega antes da janela de manutenção. É uma hipótese de desenho do piloto, não um fato sobre o calendário de todas as usinas.

A apresentação deve dizer que a sazonalidade torna o custo do atraso assimétrico: uma decisão de cadastro pode ser preparada em período planejado, enquanto uma equivalência errada durante a operação pode gerar compra indevida, atraso de manutenção ou risco técnico. A decisão de automatizar deve continuar subordinada ao limiar medido de precisão e à recusa explícita.

### Limite

As fontes não demonstram que toda usina opera com o mesmo calendário, ERP, CMMS, política de estoque ou lead time de fabricante. Não se deve prometer que resolver materiais antes de abril, agosto ou dezembro evitará uma parada. A data da intervenção e a criticidade devem vir do cliente, do plano de manutenção e do ativo real.

## 3. Gestão de sobressalentes e risco de disponibilidade

### Prova externa

O relatório de auditoria DOE-OIG-24-30, publicado em setembro de 2024, avaliou a Western Area Power Administration, que opera uma rede de transmissão de alta tensão e já possuía programa de gestão de ativos e sistema EAM. Mesmo assim, a auditoria encontrou que a organização não conseguia demonstrar quatro controles: peças críticas necessárias para cada ativo crítico, identificação das peças críticas no inventário, níveis e pontos de reposição, e posicionamento em locais estratégicos [S6].

A mesma auditoria registrou dependência do conhecimento e da experiência dos empregados de cada região para saber quais peças existiam e onde estavam. Também informou que revisões de inventário encontraram 16% menos itens disponíveis fisicamente do que os registrados no EAM em 13 locais de armazenagem. O relatório associa a falta de um programa documentado ao aumento do risco de interrupções prolongadas [S6]. O setor auditado é elétrico e o achado não pode ser transplantado como estatística para usinas, mas o mecanismo de risco é diretamente relevante para MRO: cadastro incompleto, vínculo ausente, estoque divergente e conhecimento tácito dificultam a resposta à falha.

A DLA descreve o WebFLIS 4.0 como um sistema de informação logística com mais de 16 milhões de itens de suprimento, dos quais 7,4 milhões ativos, histórico de itens ativos e inativos e atualização várias vezes ao dia [S8]. A busca estruturada pode usar NSN, nome, FSC, CAGE, FIIG ou part number. O produto também é descrito como base para sistemas logísticos e para dados de identificação de itens. Esse é um exemplo institucional de escala e disciplina de identificação, não uma autorização para copiar dados restritos nem uma prova de equivalência técnica entre peças agrícolas.

A publicação de resultados da São Martinho fornece o contexto sucroenergético para esse risco: a empresa reporta manutenção industrial programada, reposição de frotas e maquinários e capex de manutenção na casa de bilhões de reais [S3]. Uma operação com esse volume de ativos não elimina o problema de identidade de peças; ela torna mais importante distinguir material crítico, consumível, componente, conjunto e equivalente validado.

### Hipótese do projeto

O PartsGraph deve resolver identidade antes de sugerir ação de estoque ou compra. O modelo mínimo recomendado é:

`código legado -> evidência de origem -> item canônico -> referências de fabricante -> ativo/planta/local -> estado da decisão`

As regras do produto devem preservar a distinção entre:

- **mesmo item**: identidade técnica sustentada por atributos, fabricante ou referência confiável;
- **substituto ou intercambiável**: decisão técnica que exige evidência específica, não apenas similaridade textual;
- **relacionado**: item da mesma família, sem autorização para substituição;
- **desconhecido**: caso que deve ser recusado ou revisado.

O PartsGraph pode apoiar a classificação de criticidade e a busca de peças, mas não deve inventar níveis de estoque, pontos de reposição ou autorização de substituição. Esses campos precisam vir da política do cliente, do plano de manutenção, do fabricante ou da engenharia responsável [S6].

Métricas de prova para um primeiro piloto:

- percentual de peças críticas com vínculo completo ao ativo e localização;
- divergências entre cadastro, estoque físico e histórico de ordens;
- tempo para encontrar uma peça já disponível;
- número de solicitações criadas para itens já existentes;
- taxa de recusa correta em casos tecnicamente ambíguos;
- evidência de cada equivalência aceita por um revisor autorizado.

### Limite

A auditoria DOE demonstra um padrão de falha em uma organização específica. Ela não fornece percentual de duplicidade em usinas, valor de parada ou retorno sobre normalização. A DLA demonstra uma arquitetura de catalogação logística em escala, mas não substitui catálogos de fabricantes, normas de engenharia nem validação de campo.

## 4. Dados mestres, identificadores e CATMAT

### Prova externa

A ISO 8000-115:2024 especifica requisitos para identificadores de qualidade em trocas de dados mestres. O escopo inclui sintaxe e semântica para identificar sem ambiguidade o dono do identificador e restrições de uso, além dos princípios de resolver o identificador até o conjunto de dados que ele representa [S7]. Isso é diretamente compatível com uma camada que preserva o código local, registra sua origem e resolve sua referência sem apagar o identificador legado.

A ISO 8000-110:2021 cobre sintaxe, codificação semântica, conformidade a especificações e acesso aos dicionários de dados para mensagens de dados mestres [S7]. A própria página ressalta que conformidade de troca não é suficiente para qualidade total: precisão e proveniência precisam ser tratadas em estratégia mais ampla. Portanto, um catálogo que apenas padroniza texto ou código não prova equivalência física.

O manual oficial da API de Dados Abertos do Compras.gov.br está na versão 2.0, com histórico de fevereiro de 2026. O manual afirma que CATMAT e CATSER são as bases que identificam materiais e serviços licitados e adquiridos pela Administração Federal e que as operações do SIASG/Compras.gov.br usam esses catálogos para definir objetos. O módulo material documenta consultas por grupo, classe, PDM, item, natureza da despesa, unidade de fornecimento e características [S9]. O manual também afirma que a organização dos catálogos impacta a qualidade da informação e o cruzamento de dados de gasto público.

Em verificação direta feita em 25/08/2026, os endpoints públicos de grupo e item do CATMAT responderam HTTP 200 em JSON. A resposta de item expôs, entre outros campos, `codigoItem`, grupo, classe, PDM, `descricaoItem`, status e `dataHoraAtualizacao` [S9]. A página oficial do Ministério da Saúde descreve o CATMAT como base de codificação e descrição padronizada e como mecanismo para manter uma linguagem única, adotada também pelo Portal de Compras e pelo Banco de Preços em Saúde [S10].

A página do Catálogo Eletrônico de Padronização do PNCP descreve um processo que inclui escolha de itens, códigos CATMAT/CATSER, especificações técnicas e de desempenho, histórico de contratações, custos, manutenção e garantia [S11]. Isso mostra que a padronização útil precisa estar ligada a uso, manutenção e contexto de aquisição, não somente a um nome canônico.

### Hipótese do projeto

O CATMAT pode funcionar como **espinha taxonômica pública** do PartsGraph, ajudando a organizar famílias e vocabulário, mas não deve ser tratado como verdade suficiente para equivalência de sobressalentes industriais. O item canônico do PartsGraph precisa preservar:

- código e descrição de cada origem;
- CATMAT, quando houver correspondência útil;
- fabricante, part number e catálogo consultado;
- atributos técnicos e unidade de fornecimento;
- proveniência, data, evidência e responsável pela validação;
- relação com ativo, planta, local e uso observado;
- estado de resolução e motivo de revisão ou recusa.

A arquitetura não destrutiva deixa o cliente recuperar a origem e desfazer uma decisão. Isso é uma hipótese de segurança e governança alinhada aos princípios de identificadores e proveniência da ISO, mas precisa ser testada com uma exportação real e com a política de retenção do ERP ou CMMS.

### Limite

CATMAT é um catálogo público de materiais para compras governamentais. A existência de um código ou PDM não prova que um rolamento, válvula, selo ou componente industrial seja intercambiável. Também não há evidência externa consultada que valide o uso do CATMAT como taxonomia completa de MRO sucroenergético. A cobertura por família deve ser medida, e os vazios devem permanecer explícitos.

## 5. Posicionamento de mercado e próximos testes

### O que a pesquisa sustenta

- Existe uma categoria de problema comprador: saneamento, padronização, catalogação, eliminação de duplicidades, migração e governança de materiais [S9, S10, S12].
- O setor sucroenergético combina ativos intensivos, capex de manutenção elevado e ciclos operacionais que exigem preparação e retomada coordenadas [S2, S3, S4, S5].
- Gestão de ativos não garante, sozinha, que sobressalentes estejam identificados, disponíveis, corretamente registrados e localizados [S6].
- Identificadores, dicionários, referências cruzadas, atributos e proveniência são elementos reconhecidos em padrões e sistemas logísticos [S7, S8, S9].

### O que continua sendo hipótese do PartsGraph

- Uma operação sucroenergética pagará por resolução não destrutiva em vez de executar saneamento como projeto pontual.
- A melhor entrada é manutenção, almoxarifado, suprimentos, engenharia ou dados mestres. A função compradora precisa ser descoberta em entrevistas.
- Uma primeira família, como rolamentos, bombas, vedações ou componentes de transporte, produzirá sinal suficiente para um piloto.
- O estado `resolve` pode atingir erro inferior a 1% em uma faixa mensurável sem aumentar risco técnico. O limiar de erro automático é contrato interno do projeto, não benchmark externo.
- Resolver o item reduzirá compras duplicadas, tempo de busca ou risco de parada. Cada efeito precisa de linha de base e auditoria.

### Desenho de validação recomendado

1. Selecionar uma planta e uma exportação real de materiais, com origem, unidade, estoque, fabricante, part number e vínculos disponíveis.
2. Escolher uma família crítica e separar itens consumíveis, componentes, conjuntos e possíveis substitutos.
3. Congelar uma amostra de avaliação, rotulada por revisores de manutenção ou almoxarifado, antes de ajustar o resolvedor.
4. Medir cobertura, precisão, taxa de revisão, taxa de recusa, tempo de análise e itens já existentes em estoque.
5. Rodar o PartsGraph em modo não destrutivo, sem reescrever o ERP ou CMMS, e devolver o mapa de origem para auditoria.
6. Reavaliar depois de uma janela operacional real, comparando decisões e não apenas similaridade textual.

### Falsificadores

A hipótese perde força se o cliente não consegue fornecer uma exportação utilizável, se não existe dor mensurável de duplicidade ou busca, se as decisões já são completamente cobertas por referências confiáveis, se revisores não concordam sobre a amostra, ou se o limiar de erro seguro não é atingido. Nesses casos, o produto deve reduzir escopo ou mudar a unidade de valor, não transformar uma demonstração de similaridade em promessa de disponibilidade.

## 6. Fontes primárias consultadas

Todas as fontes abaixo foram consultadas em **25/08/2026**, salvo quando a data de publicação é indicada para contextualização.

- **[S1] ISO, ISO 55000:2024 - Asset management: vocabulary, overview and principles.** Publicação: 07/2024. A página descreve valor ao longo do ciclo de vida, desempenho financeiro, gestão de riscos e eficiência como benefícios da gestão de ativos. https://www.iso.org/standard/83053.html
- **[S2] Empresa de Pesquisa Energética, Nota Técnica EPE/DPG/SDB/2024/07 - Investimentos e Custos Operacionais e de Manutenção no Setor de Biocombustíveis: 2025-2034.** Publicação: 28/11/2024. A nota apresenta projeções de CAPEX/OPEX e produção para etanol, incluindo cana, milho e biometano sucroenergético. https://www.epe.gov.br/sites-pt/publicacoes-dados-abertos/publicacoes/PublicacoesArquivos/publicacao-343/topico-729/NT-EPE-DPG-SDB-2023-07_Investimentos_Custos_O_e_M_Bios_2025-2034.pdf
- **[S3] São Martinho, Resultados 3º Trimestre - Safra 2025/26.** Publicação: 09/02/2026. O documento informa o capex de manutenção de R$ 510,6 milhões no 3T26 e R$ 1,249 bilhão no 9M26. https://ri.saomartinho.com.br/Download.aspx?Arquivo=FffpTlTHiXfalqpltN7BuA%3D%3D&linguagem=pt
- **[S3b] São Martinho, Resultados 2º Trimestre - Safra 2025/26.** Publicação: 10/11/2025. O documento registra manutenção industrial programada e capex de manutenção de R$ 738,0 milhões no 6M26. https://ri.saomartinho.com.br/Download.aspx?Arquivo=5TkD6AB3Uolf%2FzganzWeZg%3D%3D&linguagem=pt
- **[S4] Conab, Safra de Cana-de-Açúcar e calendário de divulgação 2026.** Página consultada em 25/08/2026. A página informa acompanhamento quadrimestral e lista as datas de divulgação dos levantamentos 2025/26 e 2026/27. https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/safras/safra-de-cana-de-acucar e https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/safras/calendario-de-safras-e-prohort-2026
- **[S4b] Conab, 1º Levantamento - Safra 2026/27.** Publicação: 28/04/2026. Página do levantamento consultada em 25/08/2026. https://www.gov.br/conab/pt-br/atuacao/informacoes-agropecuarias/safras/safra-de-cana-de-acucar/arquivos-boletins/1o-levantamento-safra-2026-27/1o-levantamento-safra-2026-27
- **[S5] UNICA, Centro-Sul fecha safra com 611 mi t de cana e foco no etanol.** Publicação: 30/04/2026. A publicação informa o fechamento da safra 2025/26 e o início da safra 2026/27 com 195 unidades produtoras em operação na primeira quinzena de abril. https://unica.com.br/noticias/centro-sul-fecha-safra-com-611-mi-t-de-cana-e-foco-no-etanol/
- **[S5b] UNICA, Safra 2026/2027 - 2ª Quinzena de maio.** Publicação: 24/06/2026. A publicação informa 250 unidades produtoras em operação e moagem acumulada de 144,71 milhões de toneladas até 01/06. https://unica.com.br/noticias/safra-2026-2027-2a-quinzena-de-maio/
- **[S6] U.S. Department of Energy, Office of Inspector General, DOE-OIG-24-30 - Western Area Power Administration Would Benefit From Improvements to Its Management of Critical Spare Parts.** Publicação: 24/09/2024. O relatório registra ausência de identificação de peças críticas, níveis e pontos de reposição e localização estratégica. https://www.energy.gov/sites/default/files/2024-09/DOE-OIG-24-30.pdf
- **[S6b] U.S. Department of Energy, página do audit DOE-OIG-24-30.** Publicação: 27/09/2024. https://www.energy.gov/ig/articles/audit-doe-oig-24-30
- **[S7] ISO, ISO 8000-115:2024 - Data quality: master data, quality identifiers.** Publicação: 06/2024. A norma trata de identificadores, dono, restrições de uso e princípios de resolução. https://www.iso.org/standard/88847.html
- **[S7b] ISO, ISO 8000-110:2021 - Data quality: master data, syntax, semantic encoding and conformance.** Publicação: 11/2021. A norma trata de sintaxe, codificação semântica, especificações e dicionários para troca de dados mestres. https://www.iso.org/standard/78501.html
- **[S8] Defense Logistics Agency, WebFLIS 4.0.** Página atualizada: 13/07/2026. A página informa mais de 16 milhões de itens de suprimento, 7,4 milhões ativos, histórico e busca estruturada por campos logísticos. https://www.dla.mil/Customer-Support/Brochures/Details/Article/2893109/federal-logistics-information-system-web-inquiry-webflis/
- **[S9] Ministério da Gestão e da Inovação em Serviços Públicos, Manual da API de Dados Abertos Compras.gov.br, versão 2.0.** Versão: 02/2026. O manual identifica CATMAT/CATSER como bases usadas para materiais, serviços e objetos de contratação, e documenta o módulo material. https://www.gov.br/compras/pt-br/acesso-a-informacao/manuais/manual-dados-abertos/manual-api-compras.pdf
- **[S9b] Compras Públicas em Dados Abertos, Swagger da API CATMAT/CATSER.** Endpoint consultado diretamente em 25/08/2026: https://dadosabertos.compras.gov.br/modulo-material/1_consultarGrupoMaterial?pagina=1 e https://dadosabertos.compras.gov.br/modulo-material/4_consultarItemMaterial?pagina=1
- **[S10] Ministério da Saúde, Catálogo de Materiais - CATMAT.** Página institucional consultada em 25/08/2026. A página descreve codificação, descrição padronizada e linguagem única para materiais do catálogo. https://www.gov.br/saude/pt-br/se/desid/catmat/catalogo-de-materiais
- **[S11] Portal Nacional de Contratações Públicas, Catálogo Eletrônico de Padronização.** Página institucional consultada em 25/08/2026. A página descreve o uso de CATMAT/CATSER, especificações, custos, manutenção e garantia no processo de padronização. https://www.gov.br/pncp/pt-br/catalogo-eletronico-de-padronizacao
- **[S12] Secretaria de Estado da Administração de Santa Catarina, padronização do cadastro de materiais e serviços.** Página institucional consultada em 25/08/2026. A publicação informa escopo de cerca de 49,7 mil itens, correção de inconsistências, eliminação de duplicidades, migração e treinamento. https://www.sea.sc.gov.br/blog/sea-no-profisco-ii-sc-dglc-envia-processo-de-contratacao-para-padronizacao-do-cadastro-de-materiais-e-servicos/

## Nota de atualização

A pesquisa é um retrato das fontes públicas acessíveis em 25/08/2026. Dados de safra, capex, calendários e páginas corporativas podem ser revisados pelas próprias entidades. Antes de transformar qualquer número em argumento comercial, o PartsGraph deve registrar a data da fonte, preservar o texto original e marcar se o número é projeção, divulgação corporativa, auditoria externa ou medição própria do piloto.
