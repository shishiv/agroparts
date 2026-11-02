# F6: áudio que vira texto, com o Jev escolhendo numa lista fechada

## Próximo agente

Você retoma F6.
O spec e o [esboço](esboco.md) estão prontos, e nada foi implementado.
F6 vem depois do piloto, pela ordem do plano.
A [fatia 1](slices/01-transcricao-e-regra.md) espera o transcritor com licença conferida (ticket [`escolher-transcritor-local`](../../docs/wayfinder/partsgraph/tickets/escolher-transcritor-local.md)) e as gravações da equipe.
A fatia 2 espera uma chave da TypeSafe que funcione (ticket [`conferir-termos-e-chave-da-typesafe`](../../docs/wayfinder/partsgraph/tickets/conferir-termos-e-chave-da-typesafe.md)).

- [ ] [Fatia 1](slices/01-transcricao-e-regra.md): gravações pré-registradas, transcrição local e a regra do motor.
- [ ] [Fatia 2](slices/02-escolha-do-jev.md): o Jev escolhe entre as chaves do cadastro quando a regra não basta.

Antes de terminar a sua passada, atualize esta seção com o que mudou e com o próximo ponto de partida.

## Pergunta

Uma transcrição local em português de falas como "troquei o rolamento seis dois zero seis dois RS" resolve a chave certa numa parte pré-registrada das gravações, e a escolha do Jev numa lista fechada resolve mais do que a regra sozinha?

## Hipótese

Uma tabela de palavras em código troca os números e sufixos falados pela escrita da designação, e o motor resolve o texto como resolve qualquer descrição.
O texto "troquei o rolamento 6206 2RS" já resolve hoje a chave `6206|vedacao_dupla|CN|aco`.
Quando a regra não basta, o Jev escolhe entre as chaves do cadastro, e não gera texto.

## Linha de base

Não existe caminho de áudio no repositório.
O Jev não aceita áudio, segundo a [página de modelos da TypeSafe](https://docs.typesafe.ai/models.md), e por isso o áudio entra como transcrição de outro modelo.

## Fatia mínima

```
1 gravações, transcrição local e regra -> 2 escolha do Jev entre as chaves do cadastro
```

A fatia 1 sozinha já responde se o áudio vira texto que resolve.
A fatia 2 só mede o que o Jev acrescenta.

## Critérios

A taxa, o corte acima do qual a fatia 2 não roda e a margem do Jev entram no pré-registro da fatia 1.
O veredito da fase é o da fatia 1, como no plano. A fatia 2 tem veredito próprio e não muda o da fase.

- **VERIFIED.** A taxa de chave certa passa o limite pré-registrado nas gravações da equipe com ruído de oficina, com números absolutos.
- **NOT VERIFIED.** As designações faladas saem erradas acima do limite.
- **INCONCLUSIVE.** Faltam gravações, ou o transcritor não tem licença conferida.

Na fatia 2, o Jev passa se somar a margem pré-registrada sem errar mais que a regra. Se a regra já passar do corte, a fatia 2 não roda.

## Dependências

- **Dado de usina.** Nenhum. Voz é dado pessoal pela LGPD: as gravações da equipe ficam fora do repositório público, e gravação de mecânico só entra com consentimento e termo de piloto.
- **Chave da TypeSafe.** Só para a fatia 2.
- **Licença.** O código, os pesos e o runtime do transcritor. O plano viu o Whisper descrito como MIT numa discussão da própria OpenAI, mas o arquivo LICENSE e o runtime ainda não foram conferidos ([ADR 0010](../../docs/decisoes/adr-0010-licencas-de-terceiros.md)).

## ADRs e escopo

- [ADR 0008](../../docs/decisoes/adr-0008-camera-para-leitura-de-codigo.md), por analogia: a entrada traz texto, e a pessoa confere o texto antes de resolver. A transcrição não decide.
- [ADR 0013](../../docs/decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md): a lista fechada é o cadastro. Usar as peças de uma máquina como lista pede o consumo real de F7, e o consumo não vira COMPATIBLE_WITH.
- [ADR 0018](../../docs/decisoes/adr-0018-isolamento-estrito-no-piloto.md): a voz de quem trabalha na usina é dado pessoal e dado do inquilino.
- [ADR 0021](../../docs/decisoes/adr-0021-pilha-do-prototipo-publico.md) e [ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md): o ADR 0022 abre a exceção do motor no navegador só para o `/diagnostico`. Levar a transcrição ao site, mesmo rodando no navegador, pediria um ADR que estenda essa exceção. Mandar o áudio ou a transcrição de um usuário à TypeSafe bate na escolha D4 e no ticket [`definir-jev-com-dado-de-cliente`](../../docs/wayfinder/partsgraph/tickets/definir-jev-com-dado-de-cliente.md).

## Fora

- Áudio no site.
- Gravação de mecânico ou de usina.
- Gravação no repositório público.
- As peças da máquina como lista fechada, antes de F7.
- Modelo que gere texto para decidir.

## Contratos que ficam

- O texto falado passa por `especificar`, pelo mesmo `julgarTexto` de F5. Não existe regra de identidade só para áudio.
- O código do Jev fica em `scripts/`.
