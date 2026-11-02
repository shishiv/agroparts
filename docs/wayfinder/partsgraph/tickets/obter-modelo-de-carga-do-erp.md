---
title: Obter o modelo de carga do ERP de uma usina
type: task
status: open
priority: P2
blocked_by: []
---

## Spec

[F4, arquivo de chaves que volta ao ERP](../../../../specs/f4-arquivo-de-chaves/README.md).

## Pergunta

Que modelo de carga a equipe do ERP de uma usina já usa para mapear chaves de material com aprovação humana, sem fundir registro, e em que ambiente fora da produção ela pode testar o arquivo de chaves?

## Evidência que torna a pergunta difícil

O SAP é um ERP entre vários nas usinas, ao lado da TOTVS, da Senior, da Trust e da CHB, segundo a pesquisa de ERP das usinas, que ainda não está em `docs/pesquisa/` (ticket [`ajuda-de-exportacao-por-erp`](ajuda-de-exportacao-por-erp.md)).
A pesquisa de integração confirma só importação genérica por arquivo com mapeamento de chave ([aprofundamento sobre jornada e integração](../../../pesquisa/aprofundamento-jornada-integracao.md)), e um MDG ou outro processo de dados mestres é configurado por cada empresa.
Sem ver o modelo de uma usina, qualquer formato com nome de ERP seria chute.
Um teste em produção mudaria registro, o que o [ADR 0001](../../../decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md) proíbe.

## Opções e o que pesa contra cada uma

Pedir o modelo de carga à equipe do ERP é o caminho direto, mas depende do contato e da palavra do Myke (escolha D8 do [mapa](../map.md)).
Pedir à empresa que implantou o ERP evita ocupar a usina, mas pode trazer o modelo de outra configuração.
Desenhar a partir da documentação pública do ERP não exige ninguém, mas não diz como aquela usina aprova uma mudança de cadastro.

## Teste de falha

A opção falha se o modelo exigir fusão ou reescrita de registro, se não houver ambiente fora da produção, ou se a usina não autorizar o teste por escrito.

## Artefato de fechamento

O ticket fecha com o ERP e a versão, o modelo de carga descrito sem dado da usina, o ambiente de teste combinado e a autorização guardada de forma privada.
