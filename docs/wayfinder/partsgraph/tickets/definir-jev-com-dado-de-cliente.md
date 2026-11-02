---
title: Definir quando o Jev pode ler dado de cliente
type: research
status: open
priority: P3
blocked_by:
  - conferir-termos-e-chave-da-typesafe
---

## Spec

[F3, o Jev classifica a família](../../../../specs/f3-jev-classifica-familia/README.md), seção "ADRs e escopo". Também vale para as fotos de [F5](../../../../specs/f5-foto-box-ocr/README.md).

## Pergunta

Que contrato e que mudança de ADR deixam o Jev ler texto ou foto do cadastro de uma usina durante o piloto?

## Evidência que torna a pergunta difícil

A escolha D4 do [mapa](../map.md) deixa o Jev só com dado público até um contrato.
O [ADR 0018](../../../decisoes/adr-0018-isolamento-estrito-no-piloto.md) manda dados e decisões ficarem no inquilino, e mandar o cadastro à TypeSafe cria um subprocessador.
O [ADR 0022](../../../decisoes/adr-0022-diagnostico-no-navegador.md) promete que o arquivo não sai do navegador.
O DPA da TypeSafe cobre só dado pessoal e não cobre segredo industrial, e a retenção zero é só do plano enterprise.

## Opções e o que pesa contra cada uma

Nunca mandar dado privado mantém as promessas, mas limita o Jev ao que o motor pode fazer sem ele.
Mandar dado do piloto com autorização escrita no termo do piloto ajuda a cobertura, mas pede o termo, a TypeSafe nomeada como subprocessadora e um ADR que substitua o 0022 no ponto do arquivo.
Esperar o plano enterprise com retenção zero reduz o risco, mas tem custo que ainda não foi orçado.

## Teste de falha

A opção falha se qualquer texto de cliente chegar à TypeSafe antes do termo assinado, se a tela continuar dizendo que o arquivo não sai do navegador quando ele sai, ou se a retenção não estiver acordada.

## Artefato de fechamento

O ticket fecha com o termo do piloto que nomeia a TypeSafe, a retenção acordada, o ADR novo sobre o envio e a tela do diagnóstico com a promessa nova.
