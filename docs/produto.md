# Produto

`PartsGraph` é o codinome interno do produto até a escolha de outro nome conforme o [ADR 0015](decisoes/adr-0015-partsgraph-como-codinome-interno.md).

## Problema

Cadastros de materiais acumulam descrições livres, códigos locais, sinônimos, abreviações e duplicidades históricas entre plantas e sistemas.
A ausência de relações técnicas verificáveis reduz a visibilidade de estoque e torna a análise manual lenta.
Apagar ou fundir registros não resolve o problema porque códigos antigos permanecem ligados a pedidos, contratos, notas, garantias e ordens de manutenção.

## Cliente-alvo

O cliente-alvo inicial é uma operação industrial ou agroindustrial com estoque de manutenção, múltiplos códigos de materiais e ERP ou CMMS estabelecido.
O primeiro piloto precisa fornecer uma exportação real, autorizada e acompanhada de dicionário de campos e regras de retenção e eliminação.

## Fronteira do produto

O produto resolve códigos e descrições de materiais agroindustriais em português contra evidência técnica de fabricante, sem apagar o ERP e sem automatizar equivalência incerta.
Um único serviço devolve entidades, atributos, evidências, decisão ternária e o tipo de relação resolvida.
Identidade, referência cruzada, intercâmbio condicionado, compatibilidade com ativo e similaridade permanecem distintos.

O benefício inicial declarável é visibilidade e redução de tempo de análise.
Economia, compra evitada e redução de parada só podem ser afirmadas com dados de piloto.
Essa fronteira decorre do [recon profundo](pesquisa/recon-profundo-2026-08-25.md) e está fixada no [ADR 0016](decisoes/adr-0016-fronteira-de-posicionamento.md).

## Capacidades do AGR08

### Identificação automática

Texto, código lido e contexto do ativo geram candidatos.
Regras tipadas decidem entre resolve, revisa e recusa, e a resposta declara a relação encontrada.
A câmera serve para OCR e contexto, não como prova visual de equivalência.

### Integração com catálogo dos fabricantes

Referências, especificações, condições e evidências vêm de catálogo com licença verificada.
O CATMAT serve como corpus e vocabulário brasileiro, enquanto a ontologia principal permanece aberta à comparação por família com ECLASS e o esquema do fabricante.

### Requisições

A resolução fornece informação que ERP ou CMMS poderão usar em fluxos próprios.
Guardrail de requisição só será considerado depois de existir vínculo real entre peça e ativo.

### Correlação e classificação

A decisão compara atributos tipados, reprova contradições e automatiza somente a faixa que atende ao contrato de precisão da família e do tipo de relação.
O mapa preserva códigos e descrições originais junto de evidência e decisão rastreável.

## Rejeições explícitas

O produto não é loja, e-commerce nem marketplace.
Não será usado número de máquinas como mercado endereçável de software.
Não será prometido catálogo universal.
Similaridade não será chamada de equivalência.
Preço público não será tratado como preço justo.
Guardrail de requisição não será implementado antes do vínculo real entre peça e ativo.
Implementação ampla não começará antes da amostra e dos benchmarks.

O produto também não é ERP, CMMS, catálogo web isolado, operação de compra, empresa de campo ou fabricante de sensores.
Preço, disponibilidade, garantia e compra permanecem nos sistemas transacionais.
Comissão sobre venda fica fora do pitch e do caminho crítico até existirem canal transacional, atribuição e demanda comprovadas.
