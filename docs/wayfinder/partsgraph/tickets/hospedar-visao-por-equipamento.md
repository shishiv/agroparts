---
title: Decidir onde roda e onde fica a página de consumo por equipamento
type: research
status: open
priority: P3
blocked_by:
  - obter-ordens-de-manutencao-do-piloto
---

## Spec

[F7, plaquinha com visão do consumo por máquina](../../../../specs/f7-plaquinha-consumo/README.md), seção "ADRs e escopo".

## Pergunta

Onde roda a tela que gera a página de consumo, e onde fica a página que o QR de um equipamento abre, se ela mostra dado da usina?

## Evidência que torna a pergunta difícil

O QR no equipamento precisa abrir uma página que já tem o consumo, sem a pessoa escolher arquivo.
O site da AgroParts serve só dado aberto, e a API sem autenticação só é aceitável porque lê corpus público ([ADR 0021](../../../decisoes/adr-0021-pilha-do-prototipo-publico.md)).
Dados e decisões da usina ficam no inquilino ([ADR 0018](../../../decisoes/adr-0018-isolamento-estrito-no-piloto.md)).
O esboço de F7 gera, no navegador, um arquivo HTML autônomo que a própria usina hospeda, mas não se sabe se a TI dela aceita isso nem se o celular do mecânico alcança a rede interna.
A tela que gera o arquivo roda o motor no navegador, e o [ADR 0022](../../../decisoes/adr-0022-diagnostico-no-navegador.md) abre essa exceção só para o `/diagnostico`.

## Opções e o que pesa contra cada uma

A usina hospedar o arquivo na rede interna mantém o dado com ela, mas depende da TI e do acesso do celular no campo.
A AgroParts hospedar com login por usina resolve o acesso, mas pede autenticação, inquilino, retenção acordada e um ADR que substitua o 0021 nesse ponto.
Guardar o arquivo no próprio celular do mecânico funciona sem rede, mas desatualiza e espalha o dado da usina.
Para a tela que gera, uma seção do `/diagnostico` cabe no ADR 0022 como ele está, mas mistura duas tarefas na mesma página. Uma página nova fica mais clara, mas pede um ADR que estenda a exceção a ela.

## Teste de falha

A opção falha se dado da usina ficar no site público, se a página guardar histórico próprio, ou se o QR não abrir a página no celular comum da equipe.

## Artefato de fechamento

O ticket fecha com o lugar da tela que gera, o lugar da página, a autorização da TI da usina e os ADRs novos que essas escolhas pedirem.
