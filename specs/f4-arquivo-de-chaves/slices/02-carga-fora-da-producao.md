# Fatia 2: a equipe do ERP da usina carrega o arquivo fora da produção

## Contrato que destrava

O veredito de F4 e, se ele for VERIFIED, o formato próprio do ERP dessa usina.

## O que acontece

1. Com a palavra do Myke, a equipe do ERP da usina recebe o arquivo genérico que ela mesma baixou do `/diagnostico`.
2. Ela mostra o modelo de carga que já usa para mapeamento de chave com aprovação humana (ticket [`obter-modelo-de-carga-do-erp`](../../../docs/wayfinder/partsgraph/tickets/obter-modelo-de-carga-do-erp.md)).
3. Ela transforma o arquivo nesse modelo e carrega num ambiente que não é o de produção.
4. Ela relata por escrito o que apareceu no ERP e que nenhum registro mudou.

## Costura

- `docs/medicao/f4-carga.md`: o relato da equipe da usina, sem código nem texto do cadastro, com o ERP e a versão, o modelo de carga usado e o veredito.
- Só se o veredito for VERIFIED: um formato próprio em `src/motor/chaves.ts`, com o nome do ERP e o modelo de carga como fonte, ao lado do genérico.

## Verificação

- O relato escrito da equipe da usina existe e diz que nenhum registro mudou.
- O formato próprio, se entrar, tem teste que confere as colunas contra o modelo de carga recebido.

## Decisões delegadas

- O nome do formato próprio, desde que seja o nome que a equipe da usina usa.

## O que fica verde

A fatia 1 e o arquivo genérico.

## O que mudaria esta fatia

Se o fluxo da usina só aceitar fusão ou reescrita, pare. O veredito é NOT VERIFIED, e a decisão volta ao [ADR 0001](../../../docs/decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md).
