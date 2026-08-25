# ADR 0003: Forma canônica do item

## Contexto

Descrições livres misturam nome, aplicação, dimensão, material e referência sem estrutura estável.
Comparar apenas o texto não distingue concordância de contradição entre propriedades.

## Decisão

O item canônico será formado por substantivo, modificador e atributos tipados.
A descrição será gerada deterministicamente por regra a partir dos atributos.

## Alternativas descartadas

Texto livre como registro mestre foi descartado por ser ambíguo e difícil de validar.
Descrição gerada por modelo sem regra foi descartada por não garantir repetibilidade ou auditabilidade.

## Consequências

Extração e normalização precisam preservar tipo, unidade e proveniência.
Mudanças no esquema do item exigirão política de versionamento ainda aberta no Wayfinder.

## Status

Superado pelo [ADR 0013](adr-0013-modelo-de-entidades-e-relacoes-tipadas.md). O [recon profundo](../pesquisa/recon-profundo-2026-08-25.md) separou identidade, especificação, aplicabilidade e evidência; substantivo, modificador, atributos tipados e unidade permanecem válidos em `TechnicalSpecification`.
