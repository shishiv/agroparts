# Fatia 1: o consumo por equipamento e o gerador, no navegador

## Contrato que destrava

Dado o cadastro e as baixas de material do mesmo ERP, uma página só de leitura com o consumo de cada equipamento e uma folha de QR, gerados no navegador da usina.

## Costura

- `src/motor/consumo.ts`: `consumoPorEquipamento(baixas, cadastro)`, como no [esboço](../esboco.md).
- `web/plaquinha.ts`: `paginaDaUsina(consumo)`, `urlDoEquipamento(base, equipamento)` e `folhaDeQr(base, equipamentos)`, como no esboço.
- Uma tela que gera os dois arquivos: a pessoa escolhe o arquivo do cadastro e o das ordens, as colunas de cada um e o endereço onde a usina vai hospedar a página. Antes de construir, decida pelo ticket [`hospedar-visao-por-equipamento`](../../../docs/wayfinder/partsgraph/tickets/hospedar-visao-por-equipamento.md) se ela vira uma seção do `/diagnostico` ou uma página nova com um ADR que estenda o [ADR 0022](../../../docs/decisoes/adr-0022-diagnostico-no-navegador.md).
- A leitura das datas e das quantidades fica na borda, no leitor de CSV, e o motor recebe `BaixaDeMaterial` já tipada.

## O que a pessoa vê

Na página gerada, para o equipamento do fragmento da URL, as peças consumidas da troca mais recente para a mais antiga, cada uma com a designação, os códigos, a última troca e quantas baixas.
As peças que o cadastro não resolve aparecem pelo código, com o motivo.

## Verificação

- Testes em `tests/consumo.test.ts`, com ordens sintéticas sobre códigos do CATMAT, marcadas como sintéticas no próprio teste:
  - dois códigos da mesma chave somam numa peça só, com a data mais recente;
  - um código que não resolve fica como peça por código;
  - uma baixa sem código no cadastro conta em `baixas_sem_cadastro`.
- Pela skill [`verify-agroparts`](../../../.cursor/skills/verify-agroparts/SKILL.md), a tela que gera não faz pedido com corpo, e a página gerada mostra o mesmo que `consumoPorEquipamento` no mesmo arquivo.
- A página gerada abre no `agent-browser` com a rede cortada e mostra o equipamento do fragmento.
- Como última conferência antes de aceitar, rode a skill `screenshot-critique` sobre as capturas da página gerada e da folha de QR, com um leitor sem contexto.

## Decisões delegadas

- O texto dos títulos, dentro do `DESIGN.md` e sem texto de apoio.
- A biblioteca de QR, desde que a licença esteja conferida e registrada antes de entrar ([ADR 0010](../../../docs/decisoes/adr-0010-licencas-de-terceiros.md)).

## O que fica verde

`bun run test`, `bun run build` e a prova de rede do `/diagnostico`.

## Revisão humana

Abra as capturas para o Myke com a skill `preview-shots` e espere uns 5 minutos.
Se ele não responder, decida pela evidência, registre a decisão e o motivo neste spec, feche as capturas e siga.

## O que mudaria esta fatia

Se as ordens do piloto ligarem a baixa à ordem e não ao equipamento, o leitor junta os dois pela ordem antes de montar `BaixaDeMaterial`, sem mudar o motor.
