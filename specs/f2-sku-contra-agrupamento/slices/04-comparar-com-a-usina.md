# Fatia 4: uma usina roda no próprio cadastro e julga a amostra

## Contrato que destrava

O veredito de F2, sobre o agrupamento real de uma usina, com o número de misturas que uma pessoa dela confirmou.

## Costura

- `dados/preregistro/f2-agrupamento.json`, em commit próprio, antes de qualquer arquivo de usina: a semente, `n = min(20, misturas)`, os critérios do [README](../README.md) na mesma ordem de leitura, a separação das misturas por atributo que difere e a lista das contagens que voltam à equipe. O arquivo não tem nenhum dado de usina.
- A página da fatia 3 lê a semente desse arquivo, e um teste confere que as duas são iguais.
- `docs/medicao/f2-agrupamento.md`: o relatório, só com contagens e sem código nem texto da usina.

## O que acontece

1. Com a palavra do Myke (escolhas D1 e D8 do [mapa](../../../docs/wayfinder/partsgraph/map.md)), a usina recebe o link do `/diagnostico`.
2. A pessoa da usina escolhe o arquivo, as colunas de código, descrição e agrupamento, e baixa a amostra.
3. Ela preenche `distincao_real` com sim ou não em cada grupo e devolve só as contagens.
4. O agente grava o relatório e o veredito.

## Verificação

- O `git log` mostra o commit do pré-registro antes do commit do relatório.
- O relatório traz os números absolutos que o README lista e o veredito pela regra pré-registrada.
- Nenhum código, texto ou id de grupo da usina entra no repositório ([ADR 0018](../../../docs/decisoes/adr-0018-isolamento-estrito-no-piloto.md)).

## Decisões delegadas

- O formato do relatório, desde que cada porcentagem venha com o número absoluto.

## O que fica verde

As fatias 1 a 3 e a prova de rede do diagnóstico.

## O que mudaria esta fatia

Se a usina não puder rodar o diagnóstico ela mesma, o veredito fica INCONCLUSIVE. Não traga o arquivo para uma máquina da equipe sem um termo de piloto que cubra retenção e eliminação.
