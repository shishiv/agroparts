---
title: Comparar CATMAT, ECLASS e esquema de fabricante por família
type: research
status: open
priority: P1
blocked_by:
  - selecionar-catalogo-de-fabricante
---

## Pergunta

Qual entre CATMAT, ECLASS e o esquema do fabricante deve orientar a ontologia principal da família escolhida?

## Evidência que torna a pergunta difícil

CATMAT oferece corpus e vocabulário brasileiro, ECLASS estrutura classes e propriedades, e o fabricante detém a evidência técnica de sua peça.
Nenhuma dessas funções autoriza escolher uma ontologia principal sem comparação por família, conforme o [recon profundo](../../../pesquisa/recon-profundo-2026-08-25.md).

## Opções e o que pesa contra cada uma

Priorizar CATMAT favorece português e corpus público, mas sua finalidade de compras não cobre toda identidade técnica.
Priorizar ECLASS favorece interoperabilidade de propriedades, mas pode não representar o recorte e o vocabulário do cadastro real.
Priorizar o esquema do fabricante preserva autoridade técnica, mas pode limitar comparação entre fontes e famílias.
Combinar esquemas amplia cobertura, mas cria mapeamentos e governança que precisam ser justificados pela amostra.

## Teste de falha

A comparação falha se extrapolar uma família, ignorar licença e versão, avaliar somente nomes de classes ou recomendar uma ontologia sem rastrear propriedades ausentes e incompatíveis.

## Artefato de fechamento

O ticket fecha com matriz por família, versões e licenças das fontes, correspondência de classes e propriedades, lacunas observadas e recomendação justificada de ontologia principal.
