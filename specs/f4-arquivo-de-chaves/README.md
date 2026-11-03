# F4: arquivo de chaves que volta ao ERP, sem integração

## Próximo agente

Você retoma F4.
A fatia 1 entrou. `src/motor/chaves.ts` tem `arquivoDeChaves` e `chavesParaCsv`, e o `/diagnostico` baixa o arquivo de chaves ao lado do CSV de resultado. A prova está em [`docs/medicao/arquivo-de-chaves/`](../../docs/medicao/arquivo-de-chaves/README.md), e o [esboço](esboco.md) descreve o que o módulo decidiu além do desenho.
A [fatia 2](slices/02-carga-fora-da-producao.md) espera o modelo de carga do ERP de uma usina (ticket [`obter-modelo-de-carga-do-erp`](../../docs/wayfinder/partsgraph/tickets/obter-modelo-de-carga-do-erp.md)), um ambiente fora da produção e a palavra do Myke para o contato. Sem esses três, não comece por ela, e não crie formato com nome de ERP.
A revisão humana da fatia 1 foi decidida pela evidência (ver o fim do spec da fatia). Se o Myke pedir mudança de rótulo ou de posição do botão, a passada é pequena e fica em `web/diagnostico.ts`.

- [x] [Fatia 1](slices/01-arquivo-generico.md): o arquivo de chaves genérico, baixado do `/diagnostico`.
- [ ] [Fatia 2](slices/02-carga-fora-da-producao.md): a equipe do ERP da usina carrega o arquivo fora da produção.

Antes de terminar a sua passada, atualize esta seção com o que mudou e com o próximo ponto de partida.

## Pergunta

Um arquivo de chaves com evidência entra no fluxo de carga do ERP da usina, seja ele SAP, TOTVS ou outro, sem reescrever nenhum registro, e a pessoa da usina aprova dentro do próprio ERP?

## Hipótese

A equipe do ERP da usina transforma o arquivo genérico no modelo de carga que já usa e o carrega num ambiente que não é o de produção.
O mapeamento ou a aprovação aparecem no ERP, e nenhum registro muda.
Só depois disso o arquivo ganha um formato com nome de ERP.

## Linha de base

O CSV de `/api/lote?formato=csv`, que o `/diagnostico` também baixa, tem 10 colunas: origem, codigo, texto_original, estrato, decisao, designacao_canonica, descricao_por_regra, grupo_duplicidade, motivos e versao_regras.
Ele tem uma linha por item, e não um código por grupo com a evidência.
Não há modelo de carga de usina no repositório.

## Fatia mínima

```
1 arquivo genérico no diagnóstico -> 2 carga fora da produção, pela equipe da usina
```

## Critérios

- **VERIFIED.** A equipe da usina carrega o arquivo fora da produção. O mapeamento ou a aprovação aparece, e ela relata por escrito que nenhum registro mudou.
- **NOT VERIFIED.** O fluxo dela só aceita fusão ou reescrita de registro. Então a decisão volta ao [ADR 0001](../../docs/decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md) antes de qualquer formato novo.
- **INCONCLUSIVE.** Não houve acesso ao modelo de carga nem a um ambiente fora da produção.

## Dependências

- **Dado de usina.** O modelo de carga da equipe do ERP e um ambiente fora da produção. O arquivo de chaves sai do navegador da usina e fica com ela.
- **Chave da TypeSafe.** Nenhuma.
- **Licença.** Nenhuma nova.

## ADRs e escopo

- [ADR 0001](../../docs/decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md): o arquivo lista códigos e evidência. Quem decide fundir, bloquear ou manter é a usina, no ERP dela.
- [ADR 0013](../../docs/decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md): só SAME_AS entra. O SKU por tipo de F2 nunca entra.
- [ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md): o arquivo nasce no navegador, como o CSV de hoje.
- [ADR 0012](../../docs/decisoes/adr-0012-erp-alvo-em-aberto.md): o arquivo é genérico, e nenhum ERP vira alvo antes do piloto.
- [ADR 0004](../../docs/decisoes/adr-0004-entrega-por-api-integrada.md) e ADR 0012: a entrega decidida é por API integrada ao ERP, e o ADR 0012 descartou limitar a entrega a arquivo de retorno. F4 não tira a API, então não bate nesses ADRs. Se a fatia 2 mostrar que o arquivo basta como entrega, um ADR novo precisaria substituir os dois nesse ponto. A pergunta está no ticket [`decidir-devolucao-por-arquivo-ou-api`](../../docs/wayfinder/partsgraph/tickets/decidir-devolucao-por-arquivo-ou-api.md).
- O mapa põe fora a integração nativa com ERP antes do piloto. O arquivo não é integração nativa.

## Fora

- Formato com nome de SAP, de MDG, de TOTVS ou de outro ERP.
- Sugestão de código preferido ou de bloqueio.
- Envio do arquivo por API ou por conector.
- O TOTVS em profundidade.
- Add-on dentro do ERP, loja de aplicativos ou certificação.

## Contratos que ficam

- O arquivo de chaves sai só de `lote.grupos_duplicidade`.
- `src/motor/chaves.ts` é o único dono das colunas do arquivo de chaves, e `loteParaCsv` continua o único dono do mapa de códigos. Os dois usam o mesmo `celulaCsv`.
