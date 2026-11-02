---
title: Obter as ordens de manutenção do piloto
type: task
status: open
priority: P2
blocked_by: []
---

## Spec

[F7, plaquinha com visão do consumo por máquina](../../../../specs/f7-plaquinha-consumo/README.md).

## Pergunta

Que exportação de ordens de manutenção, com equipamento, data e baixa de material, a usina do piloto autoriza, e de qual sistema ela sai?

## Evidência que torna a pergunta difícil

A lista de peças de uma máquina só existe com dado real de ordens, porque aplicabilidade não se infere de código nem de descrição ([ADR 0013](../../../decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md)).
O histórico pode estar nas ordens do módulo de manutenção do ERP, num CMMS à parte, ou na entrada da nota fiscal, como a equipe registrou numa conversa interna.
A baixa pode estar ligada à ordem e não ao equipamento, e o código do material tem de casar com o cadastro do mesmo ERP.
Ordens revelam a operação da usina, e o [ADR 0018](../../../decisoes/adr-0018-isolamento-estrito-no-piloto.md) manda esse dado ficar no inquilino.
O consumo é calculado no navegador da usina, então este ticket não espera a amostra recebida de [`obter-exportacao-real`](obter-exportacao-real.md), só a autorização para rodar.

## Opções e o que pesa contra cada uma

Pedir as ordens de poucos equipamentos reduz exposição, mas pode não ter trocas suficientes para medir a busca.
Pedir um período inteiro dá volume, mas expõe mais operação e pede retenção acordada.
Usar a entrada de nota fiscal no lugar das ordens pode ser mais fácil de exportar, mas nem sempre liga a peça ao equipamento.

## Teste de falha

A opção falha se não houver autorização registrada, se a baixa não chegar ao equipamento, se o código do material não casar com o cadastro ou se o arquivo precisar sair da usina.

## Artefato de fechamento

O ticket fecha com o sistema de origem e a forma da exportação registrados sem dado da usina, a autorização guardada de forma privada e a fatia 1 de F7 rodando no navegador da usina.
