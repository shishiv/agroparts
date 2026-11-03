# F3: o Jev classifica a família, para cobrir além do rolamento

## Próximo agente

Você retoma F3.
A [fatia 1](slices/01-benchmark-e-regua.md) entrou: o pré-registro em [`dados/preregistro/f3-familia.json`](../../dados/preregistro/f3-familia.json), o benchmark público em `dados/publico/` e a régua em `scripts/familia.ts`.
O número que o Jev precisa vencer, grupo por grupo, está em [`docs/medicao/familia-v1.md`](../../docs/medicao/familia-v1.md), que `bun scripts/medir-familia.ts` refaz.
A próxima é a [fatia 2](slices/02-jev-em-arvore.md), bloqueada pelo ticket [`conferir-termos-e-chave-da-typesafe`](../../docs/wayfinder/partsgraph/tickets/conferir-termos-e-chave-da-typesafe.md): ela espera uma chave da TypeSafe que funcione e a leitura dos termos.
Não chame a API da TypeSafe antes disso.
O classificador do Jev precisa se chamar `jev`, com a versão `jev-1.14.0`, para casar com o limiar do pré-registro.
Os grupos 28, 30 e 31 ficaram abaixo do mínimo de 100 casos, e pela regra dos critérios a v1 dá INCONCLUSIVE mesmo com o Jev medido.
Para chegar a um veredito, abra um pré-registro f3-familia-v2 antes de medir o Jev, sem apagar a v1, como diz a fatia 1 em "O que mudaria esta fatia".

- [x] [Fatia 1](slices/01-benchmark-e-regua.md): pré-registro, benchmark público e a régua em código.
- [ ] [Fatia 2](slices/02-jev-em-arvore.md): o Jev escolhe grupo, classe e PDM, nas duas ordens.

Antes de terminar a sua passada, atualize esta seção com o que mudou e com o próximo ponto de partida.

## Pergunta

O Jev escolhe a classe e o PDM do CATMAT para um texto de fornecedor em português errando menos que uma régua em código, numa faixa de confiança pré-registrada, em cada grupo do CATMAT?

## Hipótese

O Jev só escolhe entre opções fechadas e não gera texto.
Numa faixa de confiança pré-registrada, ele erra menos que a régua por uma margem pré-registrada, e a resposta não muda com a ordem das opções.
Se der certo, o Jev vira a ponte para mais famílias, e a equipe sabe qual família atacar depois do rolamento.
Levar a família ao diagnóstico de uma usina pede antes o contrato do ticket [`definir-jev-com-dado-de-cliente`](../../docs/wayfinder/partsgraph/tickets/definir-jev-com-dado-de-cliente.md).

## Linha de base

Não há classificador de família no repositório.
No lote do CATMAT de hoje, 60 dos 396 itens ficam fora da família e 121 ficam sem designação da família.
A régua da fatia 1 dá o número que o Jev precisa vencer.

## Fatia mínima

```
1 pré-registro, benchmark e régua -> 2 Jev em árvore, nas duas ordens
```

## Critérios

Os limites numéricos (o limiar de confiança de cada classificador, o erro máximo na faixa, a margem sobre a régua e o mínimo de casos por estrato) entram no pré-registro da fatia 1, antes de qualquer medição.
A régua e o Jev dão confiança em escalas diferentes, então cada um tem o seu limiar, e o relatório mostra a cobertura da faixa ao lado do erro.

- **VERIFIED.** Na faixa de confiança pré-registrada, o erro do Jev fica abaixo do limite em cada estrato, com os números absolutos. O Jev vence a régua pela margem pré-registrada sem responder numa faixa mais estreita que a dela, e a resposta não muda com a ordem das opções.
- **NOT VERIFIED.** O Jev perde para a régua ou falha em português. Então a cobertura cresce família por família, com regra em código, e a mensagem de venda muda antes de qualquer trabalho de ERP.
- **INCONCLUSIVE.** A chave ainda não funciona, ou algum estrato fica abaixo do mínimo de casos.

Com zero erros em n casos, o limite superior de 95% do erro fica perto de 3/n. Afirmar erro abaixo de 1% pede uns 300 acertos sem erro por estrato. Abaixo disso, o relatório diz o limite.

## Dependências

- **Dado de usina.** Nenhum. O Jev só lê dado público até um contrato (escolha D4).
- **Chave da TypeSafe.** Uma chave que funcione, só para a fatia 2. O modelo vai fixado como `jev-1.14.0`.
- **Licença.** O CATMAT e as compras do Compras.gov.br, sob o Decreto 8.777/2016. Os termos da TypeSafe sobre guardar e publicar as respostas ainda não foram lidos ([ADR 0010](../../docs/decisoes/adr-0010-licencas-de-terceiros.md)).

## ADRs e escopo

- [ADR 0006](../../docs/decisoes/adr-0006-guardrails-programaticos-e-revisao-humana.md): o Jev escolhe a família, que é visibilidade. Ele não resolve SAME_AS, e a confiança dele não vira decisão.
- [ADR 0017](../../docs/decisoes/adr-0017-catmat-como-corpus.md): o PDM do CATMAT é o vocabulário das opções, não a ontologia do produto. Se o produto passar a guardar o PDM como índice de família, o ADR 0017 precisaria mudar, e a pergunta já está no ticket [`comparar-catmat-eclass-por-familia`](../../docs/wayfinder/partsgraph/tickets/comparar-catmat-eclass-por-familia.md).
- [ADR 0018](../../docs/decisoes/adr-0018-isolamento-estrito-no-piloto.md) e [ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md): mostrar no diagnóstico a família que o Jev dá ao cadastro de uma usina mandaria o texto dela à TypeSafe. Isso pediria um ADR que substitua o 0022 no ponto "o arquivo não sai do navegador" e um contrato que nomeie a TypeSafe como subprocessadora. A pergunta está no ticket [`definir-jev-com-dado-de-cliente`](../../docs/wayfinder/partsgraph/tickets/definir-jev-com-dado-de-cliente.md).

## Fora

- O braço B do plano: um Score "mesma peça" para ordenar a fila de revisão. É outra pergunta, e nunca resolveria SAME_AS.
- A escolha entre candidatos de atributo já achados por expressão regular.
- O Jev sobre cadastro de cliente.
- A família no `/diagnostico`.
- Qualquer modelo que gere texto.
- O ECLASS, que pede licença.

## Contratos que ficam

- A chave da TypeSafe só existe em `scripts/` e no ambiente de quem roda. Nada do Jev entra em `web/`, `functions/` ou `dist/`.
- `TextoPublico` só nasce em `carregarBenchmarkFamilia`.
- O pré-registro de F3 vem em commit anterior a qualquer número de família.
