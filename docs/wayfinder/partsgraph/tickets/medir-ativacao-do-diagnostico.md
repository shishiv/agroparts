---
title: Medir a ativação do diagnóstico grátis
type: research
status: open
priority: P1
blocked_by: []
---

## Spec

[F1, diagnóstico no navegador](../../../../specs/done/f1-diagnostico-navegador.md).

## Pergunta

Das usinas convidadas por link, quantas terminam o diagnóstico no próprio cadastro, acham pelo menos um grupo verdadeiro e pedem o passo seguinte?

## Evidência que torna a pergunta difícil

A parte técnica do diagnóstico está provada, mas nenhuma usina o rodou ainda.
O convite é só por link, com o escopo exato (escolha D2 do [mapa](../map.md)), e o arquivo não sai do navegador (escolha D3 e [ADR 0022](../../../decisoes/adr-0022-diagnostico-no-navegador.md)).
Por isso a equipe não vê o resultado de quem roda, e a página não conta uso.
O plano propôs VERIFIED quando 3 das 5 primeiras usinas terminam e pelo menos 1 pede o passo seguinte, mas esse limiar ainda não foi pré-registrado.

## Opções e o que pesa contra cada uma

Perguntar a cada usina por mensagem não exige código, mas depende do relato dela e pode perder quem desistiu calado.
Contar na página só números (aberturas, arquivos lidos, grupos achados) mede quem desistiu, mas muda a promessa da tela e pede um ADR que substitua o 0022 no ponto "não há contagem de uso".
Combinar as duas dá o melhor retrato, mas soma o custo das duas sobre poucas usinas.

## Teste de falha

A medição falha se o limiar mudar depois de ver resultados, se qualquer contagem levar conteúdo do arquivo, se um convite sair sem a palavra do Myke (escolha D8) ou se o relatório der porcentagem sem o número absoluto.

## Artefato de fechamento

O ticket fecha com o limiar pré-registrado, a lista de convites guardada de forma privada e o relatório com convidadas, que terminaram, que acharam um grupo verdadeiro e que pediram o passo seguinte, em números absolutos.
