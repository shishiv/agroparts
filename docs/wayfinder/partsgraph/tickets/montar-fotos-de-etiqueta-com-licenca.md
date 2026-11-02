---
title: Montar o conjunto de fotos de etiqueta com licença
type: task
status: open
priority: P3
blocked_by: []
---

## Spec

[F5, foto com Box, OCR e conferência do Jev](../../../../specs/f5-foto-box-ocr/README.md).

## Pergunta

Que conjunto de fotos de rolamento, com a designação conhecida e a licença conferida, mede a leitura de etiqueta e de anel gravado sem depender de foto de usina?

## Evidência que torna a pergunta difícil

O site tem só duas imagens de leitura: uma etiqueta gerada pela equipe e uma foto de anel gravado da Wikimedia Commons sob CC BY 4.0 ([fontes do protótipo](../../../pesquisa/fontes-do-prototipo.md)).
Com n = 2, nenhuma taxa de leitura se sustenta.
Foto de usina é dado de cliente, e o Jev só lê dado público até um contrato (escolha D4 do [mapa](../map.md)).
A TypeSafe pede imagens de 280 a 1568 pixels de lado, em pé nos pixels.
Uma foto pública não vem com licença por estar publicada ([ADR 0010](../../../decisoes/adr-0010-licencas-de-terceiros.md)).

## Opções e o que pesa contra cada uma

Fotografar peças que a equipe tem dá licença própria e designação conferida na mão, mas cobre poucas designações e pouco desgaste.
Buscar fotos em Creative Commons amplia a variedade, mas cada uma pede licença e designação conferidas uma a uma.
Gerar etiquetas impressas a partir do CATMAT é barato, mas mede só o caso fácil, que o Tesseract já lê.

## Teste de falha

O conjunto falha se alguma foto entrar sem licença registrada, se a designação esperada não for conferida por uma pessoa, se alguma foto vier de usina, ou se o número de fotos mudar depois de ver uma leitura.

## Artefato de fechamento

O ticket fecha com as fotos em `dados/publico/fotos-etiqueta/`, o manifesto com fonte, licença e chave esperada de cada uma, e o pré-registro de F5 gravado antes da primeira leitura.
