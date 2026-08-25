# Produto

## Problema

Cadastros de materiais acumulam descrições livres, códigos locais, sinônimos, abreviações e duplicidades históricas entre plantas e sistemas.
A ausência de uma identidade comum da peça reduz a visibilidade de estoque, dificulta equivalências e permite requisições indevidas.
Apagar ou fundir registros não resolve o problema porque códigos antigos permanecem ligados a pedidos, contratos, notas, garantias e ordens de manutenção.

## Cliente-alvo

O cliente-alvo inicial é a operação industrial ou agroindustrial com estoque de manutenção, múltiplos códigos de materiais e ERP ou CMMS já estabelecido.
O primeiro piloto precisa fornecer uma exportação real do cadastro de materiais, não comprar um projeto de substituição de sistema.

## Dores

A mesma peça pode estar registrada sob nomes diferentes e ser recomprada apesar de existir em estoque.
Peças distintas podem parecer iguais no texto ou na imagem e exigir atributos dimensionais para evitar uma equivalência falsa.
A fragmentação entre plantas e ERPs impede consultar equivalentes e comparar o histórico sem destruir rastreabilidade.
A revisão manual consome tempo, mas uma automação sem recusa cria erros mais caros do que a demora que pretende remover.

## Os quatro pilares do AGR08

### Identificação automática

PartsGraph lê texto sujo, código gravado ou contexto do ativo e devolve candidatos, item canônico e confiança.
A câmera é usada para leitura do código e do contexto, não para prometer classificação visual de peças dimensionalmente diferentes.

### Integração com catálogo dos fabricantes

O item canônico preserva referências de fabricante e equivalências validadas, começando por rolamentos e por catálogos cuja licença e forma de uso sejam verificadas.
O CATMAT fornece a espinha taxonômica pública, mas não substitui o catálogo do fabricante.

### Geração automática de requisições

A resolução produz a informação que o ERP ou o CMMS pode usar para alertar, aprovar e requisitar.
O guardrail de requisição é o próximo passo após o piloto porque depende do vínculo entre peça e ativo.

### Correlação e classificação para evitar solicitações indevidas

A decisão compara atributos tipados, reprova contradições e só automatiza a faixa cuja precisão medida atende ao contrato.
O mapa não destrutivo liga todos os códigos legados ao item canônico e expõe equivalentes antes de uma nova solicitação.

## Unidade de valor

A unidade de valor do primeiro corte é a resolução de item: entra texto sujo ou código e sai item canônico com atributos, equivalentes e grau de confiança.
Busca, guardrail e tradução em lote são vistas da mesma resolução.
A receita de entrada é a normalização, enquanto eventual comissão sobre venda permanece latente e sem cobrança.

## O que o produto não é

PartsGraph não é ERP, CMMS, marketplace transacional, catálogo web isolado, operação de compra, empresa de campo ou fabricante de sensores.
PartsGraph não reescreve o cadastro do cliente, não define preço justo com preço público e não promete automação total.
PartsGraph não compartilha preço, fornecedor, condição comercial, volume ou consumo entre clientes.
