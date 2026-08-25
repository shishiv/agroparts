# Arquitetura

## Unidade de valor

A resolução de item é a única função central: recebe texto sujo ou código e devolve item canônico, atributos, equivalentes, evidências e grau de confiança.
Busca interativa, tradução em lote e o futuro guardrail de requisição são vistas dessa função.

## Item canônico

O item canônico é formado por substantivo, modificador e atributos tipados.
Sua descrição é gerada por regra a partir dos atributos e nunca é a fonte primária de decisão.
Cada versão precisa preservar identidade, proveniência, evidências e estado de validação.
A política de versionamento para mudanças do item ainda está aberta no Wayfinder.

## Mapa de códigos legados

Cada código legado continua no sistema de origem e aponta para um item canônico.
O mapa aceita muitos códigos para um item, preserva a origem do código e registra a evidência e a decisão que criaram o vínculo.
Nenhum fluxo apaga, funde ou reescreve registros do ERP.

## Pipeline de normalização

A ingestão recebe exportação de arquivo, CATMAT e catálogos de fabricante cuja licença tenha sido verificada.
A preparação preserva o valor original e produz representação normalizada sem sobrescrever a fonte.
A extração converte texto em substantivo, modificador, referência de fabricante e atributos tipados.
A busca vetorial recupera candidatos e nunca decide a resolução.
A decisão é determinística sobre atributos, referências e regras explícitas.
Contradição de atributo reprova um candidato, enquanto concordância apenas soma evidência.
A assimetria entre reprovação e concordância é intencional porque uma equivalência falsa custa mais que uma revisão.
Os pesos de evidência são explícitos, versionados e auditáveis.
Semelhança de texto sozinha nunca resolve um item.
A saída contém a decisão, a nota calibrada e a trilha das evidências.

## Contrato de confiança

Existem três saídas: resolve, revisa e recusa.
A faixa automática resolve somente acima do limiar calibrado da família.
A faixa intermediária revisa em fila humana.
A faixa incompatível ou sem evidência suficiente recusa a equivalência.
A nota precisa corresponder à taxa de acerto observada, e calibração é requisito de entrega.
A métrica principal é precisão na faixa automática, não acurácia geral.
O contrato de erro é inferior a 1% na faixa automática, aceitando cobertura menor no início e crescimento somente com evidência.
Se o contrato não fechar, o sistema reduz cobertura e nunca afrouxa o limite de erro.
O gabarito inicial usa pares verdadeiros entre itens que citam a mesma referência de fabricante e pares falsos entre padrões descritivos distintos.
A fila de revisão realimenta o mapa de códigos e a calibração com decisões rastreáveis.

## Entrega e integração

O primeiro corte consome exportação de arquivo e devolve resultados por API.
O ERP alvo permanece aberto até o primeiro piloto real definir a integração nativa.
ERP e CMMS continuam responsáveis por alerta, aprovação, requisição, pedido e compra.
O funil de consulta, recomendação, requisição, pedido e compra confirmada será instrumentado desde o início, mas comissão não será ativada nem cobrada.

## Isolamento multi-inquilino

Todo registro recebido de cliente carrega um identificador de inquilino obrigatório e só pode ser lido, processado, revisado ou exportado no mesmo escopo.
Consultas e filas sem filtro de inquilino devem falhar fechadas, e testes de isolamento devem provar que dois inquilinos não enxergam registros um do outro.
A base comum recebe apenas o mapeamento anônimo de código para item canônico, sem identificador reversível do cliente.
Preço, fornecedor, condição comercial, volume e consumo nunca são gravados na base comum nem incluídos em eventos compartilhados.
Uma verificação automatizada deve rejeitar qualquer esquema, evento ou exportação comum que contenha esses campos proibidos.
Logs e trilhas de auditoria devem registrar acesso e decisão sem copiar campos comerciais proibidos.

## Escopo do pitch

A demonstração executa ao vivo o motor de resolução com calibração medida e a tradução em lote de um cadastro inteiro.
O guardrail de requisição fica declarado como próximo passo dependente do vínculo com ativo obtido no piloto.
A prova usa dados verdadeiros e números reproduzíveis, sem substituir falha por vídeo gravado ou dado fabricado.
