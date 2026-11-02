---
title: Obter o agrupamento que a usina já tem
type: task
status: open
priority: P1
blocked_by: []
---

## Spec

[F2, SKU contra o agrupamento da usina](../../../../specs/f2-sku-contra-agrupamento/README.md).

## Pergunta

Onde a usina guarda o agrupamento que já fez dos códigos de material, em que forma ele sai, e ela autoriza rodar o diagnóstico com ele no próprio navegador?

## Evidência que torna a pergunta difícil

O valor da AgroParts tem de aparecer contra esse agrupamento, e não contra um cadastro sem agrupamento nenhum.
A comparação roda no navegador da usina, então este ticket não espera a amostra recebida de [`obter-exportacao-real`](obter-exportacao-real.md), só a autorização para rodar.
O agrupamento pode estar no próprio ERP, como classificação ou campo do material, ou fora dele, numa planilha ou num BI.
O [esboço de F2](../../../../specs/f2-sku-contra-agrupamento/esboco.md) compara o agrupamento quando ele vem como coluna do mesmo arquivo do cadastro.
Um agrupamento num arquivo separado pede casar o código do ERP, que pode repetir, faltar ou vir com zeros à esquerda.
Um agrupamento com subníveis pede escolher o nível que se compara.

## Opções e o que pesa contra cada uma

Pedir o agrupamento como coluna da mesma exportação dispensa casar códigos, mas só funciona se ele mora no ERP ou se a usina já o junta ao cadastro.
Aceitar um segundo arquivo de código e grupo atende o agrupamento feito fora do ERP, mas acrescenta um leitor que casa códigos e mais uma escolha na tela.
Pedir à usina que junte os dois antes não exige código, mas põe trabalho na pessoa antes de ela ver qualquer valor.

## Teste de falha

A opção falha se o arquivo precisar sair do navegador da usina, se faltar autorização registrada, se o agrupamento não ligar cada código a um grupo ou se o nível comparado não estiver no pré-registro.

## Artefato de fechamento

O ticket fecha com a forma do agrupamento registrada (coluna, arquivo separado, plano ou com subníveis), a autorização guardada de forma privada e a fatia 4 de F2 pronta para rodar no navegador da usina.
