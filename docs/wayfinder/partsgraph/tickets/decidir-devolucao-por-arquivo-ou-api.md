---
title: Decidir se a devolução ao ERP é por arquivo ou por API
type: research
status: open
priority: P3
blocked_by:
  - obter-modelo-de-carga-do-erp
---

## Spec

[F4, arquivo de chaves que volta ao ERP](../../../../specs/f4-arquivo-de-chaves/README.md), seção "ADRs e escopo".

## Pergunta

Depois da primeira carga fora da produção, a AgroParts devolve o resultado ao ERP da usina só por arquivo, ou a API integrada continua sendo a entrega?

## Evidência que torna a pergunta difícil

O [ADR 0004](../../../decisoes/adr-0004-entrega-por-api-integrada.md) decide a entrega por API integrada ao ERP e ao CMMS.
O [ADR 0012](../../../decisoes/adr-0012-erp-alvo-em-aberto.md) descartou limitar a entrega a arquivo de retorno, porque a API preserva um contrato reutilizável.
O diagnóstico roda no navegador e devolve arquivo ([ADR 0022](../../../decisoes/adr-0022-diagnostico-no-navegador.md)), e a AgroParts passou a se ver como SaaS ao lado de vários ERPs, com o SAP como um deles.
Uma API que recebe cadastro de usina deixa de ser só leitura de corpus público, e o [ADR 0021](../../../decisoes/adr-0021-pilha-do-prototipo-publico.md) só aceita a API sem autenticação por isso.

## Opções e o que pesa contra cada uma

Ficar só com o arquivo serve a qualquer ERP e mantém o dado com a usina, mas exige um ADR que substitua o 0004 e o 0012 nesse ponto.
Manter a API como entrega preserva o contrato reutilizável, mas pede autenticação, inquilino e retenção acordada antes do primeiro cliente.
Oferecer os dois mantém as portas abertas, mas são dois caminhos para manter com dois estudantes.

## Teste de falha

A decisão falha se reescrever um ADR aceito em vez de substituí-lo por um novo, se puser cadastro de usina numa API sem autenticação, ou se for tomada antes de uma carga real.

## Artefato de fechamento

O ticket fecha com o relato da carga de F4, a escolha justificada e, se ela mudar a entrega, o ADR novo que substitui o 0004 e o 0012 no ponto da entrega.
