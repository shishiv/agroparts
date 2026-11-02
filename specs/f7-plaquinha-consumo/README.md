# F7: plaquinha com visão só de leitura do consumo por máquina

## Próximo agente

Você retoma F7.
O spec e o [esboço](esboco.md) estão prontos, e nada foi implementado.
F7 vem depois do piloto: as duas fatias esperam as ordens de manutenção de uma usina (ticket [`obter-ordens-de-manutencao-do-piloto`](../../docs/wayfinder/partsgraph/tickets/obter-ordens-de-manutencao-do-piloto.md)).
A fatia 2 espera também a decisão sobre onde a página fica (ticket [`hospedar-visao-por-equipamento`](../../docs/wayfinder/partsgraph/tickets/hospedar-visao-por-equipamento.md)).
Não construa nada com ordens inventadas. Uma ordem sintética só serve de teste e diz que é sintética.

- [ ] [Fatia 1](slices/01-consumo-por-equipamento.md): o consumo por equipamento e o gerador da página e da folha de QR, no navegador.
- [ ] [Fatia 2](slices/02-qr-e-tempo-de-busca.md): a usina hospeda a página, cola os QR, e os mecânicos medem o tempo de busca.

Antes de terminar a sua passada, atualize esta seção com o que mudou e com o próximo ponto de partida.

## Pergunta

Com as ordens de manutenção do piloto, uma página por equipamento que lista as peças consumidas, já traduzidas para a chave de identidade, faz a equipe de manutenção achar a última troca de uma peça mais rápido que no ERP?

## Hipótese

A plaquinha guarda só uma URL com o número do equipamento.
A página mostra o consumo daquele equipamento somando os códigos legados da mesma peça.
A equipe acha a última troca mais rápido que no ERP, e a página não guarda histórico próprio.

## Linha de base

Não há dado de ativo no repositório.
O módulo de manutenção do SAP já guarda o histórico das ordens e o plano por contador, segundo a pesquisa do plano.
Numa conversa interna, sem registro no repositório, a equipe disse que o histórico de peças fica gravado na entrada da nota fiscal, no sistema da usina.

## Fatia mínima

```
1 consumo e gerador no navegador -> 2 página hospedada pela usina, QR colado e tempo de busca
```

O QR vem primeiro, e o NFC só quando a usina pedir (escolha D6).

## Critérios

A margem de queda do tempo e o número de buscas entram no pré-registro da fatia 2.

- **VERIFIED.** O tempo mediano para achar a última troca de uma peça cai pela margem pré-registrada, com mecânicos da usina, e a página não guarda histórico próprio.
- **NOT VERIFIED.** O tempo não cai, ou o ERP já mostra a mesma coisa no mesmo tempo.
- **INCONCLUSIVE.** Não há ordens do piloto.

## Dependências

- **Dado de usina.** A exportação das ordens de manutenção com equipamento e baixa de material, e o cadastro do mesmo ERP, com autorização. Os dois ficam com a usina.
- **Chave da TypeSafe.** Nenhuma.
- **Licença.** A biblioteca que gera o QR, conferida antes de entrar ([ADR 0010](../../docs/decisoes/adr-0010-licencas-de-terceiros.md)).

## ADRs e escopo

- [ADR 0004](../../docs/decisoes/adr-0004-entrega-por-api-integrada.md): alerta, aprovação, requisição e compra ficam no sistema da usina, e a escolha D5 deixa o alerta no ERP dela. A página só lê. Se ela passar a registrar troca, pedido ou alerta, vira o portal paralelo que o ADR 0004 descartou, e um ADR novo precisaria mudar isso.
- [ADR 0009](../../docs/decisoes/adr-0009-etiqueta-em-ativo-e-endereco.md): a etiqueta fica no ativo, a AgroParts gera a folha de QR, e a usina imprime e cola.
- [ADR 0013](../../docs/decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md): consumo não é aplicabilidade. A página diz "consumido neste equipamento" e nunca "compatível".
- [ADR 0016](../../docs/decisoes/adr-0016-fronteira-de-posicionamento.md): nada de guardrail de requisição.
- [ADR 0018](../../docs/decisoes/adr-0018-isolamento-estrito-no-piloto.md) e [ADR 0021](../../docs/decisoes/adr-0021-pilha-do-prototipo-publico.md): ordens de manutenção são dado do inquilino, e o site público só serve dado aberto. O esboço gera uma página que a própria usina hospeda. Hospedar as ordens no site da AgroParts pediria um ADR que substitua o 0021 nesse ponto.
- [ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md): a tela que gera a página roda o motor no navegador, e o ADR 0022 abre essa exceção só para o `/diagnostico`. Ela precisaria de um ADR que estenda a exceção, ou vira uma seção do próprio `/diagnostico`. As duas perguntas estão no ticket [`hospedar-visao-por-equipamento`](../../docs/wayfinder/partsgraph/tickets/hospedar-visao-por-equipamento.md).
- O mapa põe hardware e sensor fora do escopo. Um QR impresso ou uma etiqueta NFC que a usina compra e grava não é hardware da AgroParts. Vender etiqueta ou kit NFC bateria nessa linha e na escolha D6.

## Fora

- Alerta de manutenção e próxima troca (escolha D5).
- NFC antes de a usina pedir.
- Venda de etiqueta.
- Vida útil por peça, que espera histórico com volume.
- Registro de troca pela página.
- Aplicabilidade a máquina inferida do consumo.

## Contratos que ficam

- A página não faz pedido de rede e não guarda histórico.
- `consumoPorEquipamento` soma por chave de identidade de `traduzirLote`. Não existe outra regra de identidade para consumo.
