# ADR 0013: Modelo de entidades e relações tipadas

## Contexto

Um item canônico único aproxima identidade, especificação, aplicabilidade e equivalência mais do que a evidência permite.
O [recon profundo](../pesquisa/recon-profundo-2026-08-25.md) mostrou que identidade, referência cruzada, intercâmbio condicionado, compatibilidade e similaridade exigem semânticas e provas distintas.
O [aprofundamento sobre identidade e equivalência](../pesquisa/aprofundamento-identidade-equivalencia.md) detalha a evidência normativa e de fabricantes para preservar identificadores, condições e proveniência sem converter similaridade em identidade.

## Decisão

O modelo terá as entidades `CustomerMaterial`, `ManufacturerPart`, `TechnicalSpecification`, `ProductFamily`, `AssetConfiguration`, `Evidence` e `ResolutionDecision`.
`TechnicalSpecification` preservará substantivo, modificador, atributos tipados e unidade.

As relações serão:

- `SAME_AS`: mesma identidade;
- `CROSS_REFERENCE`: referência cruzada publicada;
- `INTERCHANGEABLE_FOR`: substituição condicionada a uma aplicação, com escopo, condições, fonte e versão;
- `COMPATIBLE_WITH`: aplicabilidade a um ativo ou a uma configuração;
- `SIMILAR_TO`: semelhança usada apenas para recuperação.

`SIMILAR_TO` nunca será promovida automaticamente para `SAME_AS`.
`CROSS_REFERENCE` não implicará `INTERCHANGEABLE_FOR` sem condições técnicas e fonte.
Aplicabilidade a ativo não será inferida de código nem de descrição.

O serviço central de resolução permanecerá único, mas cada resposta declarará o tipo de relação resolvida.
Identidade, aplicabilidade, procedência e condição serão preservadas separadamente.
Preço, disponibilidade, garantia e compra permanecerão nos sistemas transacionais e fora do núcleo.

## Alternativas descartadas

Uma entidade canônica que absorve todas as relações foi descartada por apagar diferenças entre identidade e uso condicionado.
Tratar semelhança ou referência cruzada como equivalência foi descartado porque essas relações não provam substituição técnica.
Inferir aplicabilidade apenas de código ou descrição foi descartado porque configuração e histórico do ativo podem alterar a conclusão.

## Consequências

Cada decisão precisará registrar relação, evidência, fonte, versão e, quando aplicável, escopo e condições.
Recuperação continuará separada da decisão, e a saída continuará em resolve, revisa ou recusa.
Mapas e respostas deixarão explícito o que foi resolvido sem ampliar o núcleo para fatos transacionais.

## Status

Aceita. Substitui o [ADR 0003](adr-0003-forma-canonica-do-item.md) quanto à entidade única e reafirma a estrutura válida da especificação técnica.
