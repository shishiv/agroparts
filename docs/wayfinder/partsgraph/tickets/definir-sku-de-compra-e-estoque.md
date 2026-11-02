---
title: Definir quando um SKU de tipo pode servir a compra e estoque
type: research
status: open
priority: P3
blocked_by:
  - selecionar-catalogo-de-fabricante
---

## Spec

[F2, SKU contra o agrupamento da usina](../../../../specs/f2-sku-contra-agrupamento/README.md), seções "Por que a política de SKU não vira tipo agora" e "Fora" do [esboço](../../../../specs/f2-sku-contra-agrupamento/esboco.md).

## Pergunta

Que fonte de INTERCHANGEABLE_FOR permite que um SKU que junta atributos de identidade sirva a compra e estoque, e quem guarda o código opaco desse SKU com a linhagem de divisões e fusões?

## Evidência que torna a pergunta difícil

Um SKU por tipo junta peças que a chave de identidade separa: nos 183 itens do CATMAT que resolvem, ele apaga 91 distinções.
Para análise isso é visibilidade, mas para compra e estoque é dizer que uma peça substitui a outra, e isso é INTERCHANGEABLE_FOR, que exige escopo, condições, fonte e versão ([ADR 0013](../../../decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md)).
Hoje não existe fonte licenciada de intercâmbio ([ADR 0010](../../../decisoes/adr-0010-licencas-de-terceiros.md)), e o mapa ainda não define como representar essas condições.
Um código de SKU derivado dos atributos mudaria quando a política mudasse e quebraria pedidos que já usam o código no ERP.
Um código opaco com linhagem é estado do inquilino, e hoje o diagnóstico não guarda estado nenhum ([ADR 0022](../../../decisoes/adr-0022-diagnostico-no-navegador.md)).

## Opções e o que pesa contra cada uma

Nunca emitir SKU de tipo para compra mantém o produto dentro da evidência, mas deixa a usina sem resposta para o pedido que mais aparece.
Emitir só com INTERCHANGEABLE_FOR de catálogo licenciado, atributo por atributo, é honesto, mas depende de um catálogo que ainda não existe.
Deixar a usina aprovar a junção por conta própria, com registro de quem aprovou, põe a decisão no dono do risco, mas cria uma política que a AgroParts guarda e precisa de um ADR sobre estado no inquilino.

## Teste de falha

A opção falha se um SKU de tipo chegar ao ERP sem INTERCHANGEABLE_FOR com fonte para cada atributo juntado, se o código mudar quando a política mudar, ou se a política ficar guardada fora do inquilino.

## Artefato de fechamento

O ticket fecha com a fonte de intercâmbio escolhida e licenciada, a regra que valida a política por atributo juntado, o lugar onde o código opaco e a linhagem ficam guardados e o ADR novo que trata esse estado.
