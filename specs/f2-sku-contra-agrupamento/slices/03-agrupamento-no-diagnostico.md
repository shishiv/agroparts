# Fatia 3: o diagnóstico aceita a coluna do agrupamento da usina

## Contrato que destrava

A pessoa da usina escolhe, no mesmo CSV, a coluna com o agrupamento que já tem e vê, no navegador, os grupos dela que misturam peças diferentes.
O arquivo continua sem sair do navegador.

## Costura

- `web/diagnostico.html`: um terceiro seletor, "Coluna do agrupamento da usina", com "Nenhuma" como valor inicial. A página não chuta essa coluna, porque um chute errado produziria misturas falsas.
- `web/diagnostico.ts`: `diagnosticar` monta `EntradaAgrupada` e chama `compararAgrupamento` e `visaoPorTipo`, como no uso do [esboço](../esboco.md).
- Duas seções novas. A primeira mostra os grupos da usina em mistura, cada um com o id do grupo, os atributos que diferem e os códigos de cada chave. A segunda mostra quantos SKUs por tipo e por identidade o arquivo dá, e o que cada grupo por tipo junta.
- Um botão baixa a amostra em CSV, só quando há mistura.
- `scripts/arquivo-diagnostico.ts` ganha a coluna `agrupamento_teste`, com a primeira designação `6[023]\d\d` do texto, ou vazia. O cabeçalho do arquivo diz que a coluna é sintética.

## O que a pessoa vê

Em `/diagnostico`, com o arquivo de teste e a coluna `agrupamento_teste` escolhida, as contagens de grupos em mistura, coerentes e inconclusivos aparecem acima dos cartões de mistura.

## Verificação

- Siga a skill [`verify-agroparts`](../../../.cursor/skills/verify-agroparts/SKILL.md): suba, rode o `doctor` e dirija a página pelo caminho da pessoa com o `agent-browser`.
- Os números da tela batem com `compararAgrupamento` rodado no mesmo arquivo.
- O registro de rede não tem nenhum pedido com corpo, como na prova do F1 em `docs/medicao/diagnostico-navegador/`.
- Sem a coluna escolhida, a tela é a mesma do F1.
- No celular de 390 px, a página não rola na horizontal.
- Use a skill `compare-screenshots` contra as capturas do F1 em `docs/medicao/diagnostico-navegador/`, para julgar o que a fatia mudou na tela.
- Como última conferência antes de aceitar, rode a skill `screenshot-critique` sobre as capturas novas, com um leitor sem contexto.

## Decisões delegadas

- O texto exato dos títulos e das contagens, dentro das regras do `DESIGN.md` e sem texto de apoio.
- A ordem dos cartões dentro da seção de misturas, desde que siga a ordem de `compararAgrupamento`.

## O que fica verde

`bun run test`, `bun run build`, a prova de rede do F1 e a tela do F1 quando nenhuma coluna de agrupamento é escolhida.

## Revisão humana

Abra as capturas para o Myke com a skill `preview-shots` e espere uns 5 minutos.
Se ele não responder, decida pela evidência, registre a decisão e o motivo neste spec, feche as capturas e siga.
A revisão não bloqueia a fatia.

**Decisão (03/11/2026).** A fatia foi aceita pela evidência, sem a revisão do Myke. O computador era Linux, o `preview-shots` abre o Preview do macOS e o Myke não olhava a tela. A evidência está em [`docs/medicao/diagnostico-agrupamento/`](../../../docs/medicao/diagnostico-agrupamento/README.md): os números da tela batem com `compararAgrupamento` e `visaoPorTipo` no mesmo arquivo, a tela sem coluna é idêntica à do F1, nenhum pedido de rede leva corpo, o celular de 390 px não rola na horizontal e duas rodadas de `screenshot-critique` com um leitor sem contexto levaram a quatro ajustes. A revisão do Myke continua aberta: se ele discordar do texto ou da ordem das seções, a correção é uma passada pequena sobre `web/diagnostico.ts`.

## Como ficou

- O seletor "Coluna do agrupamento da usina" fica ao lado das colunas de código e de descrição, só aparece depois de escolher o arquivo e começa em "Nenhuma". Sem a coluna, a tela é a do F1.
- Com a coluna, a seção "Agrupamento da sua usina" mostra quatro contagens (misturam peças, sem mistura, com cadastro em dúvida, de um cadastro só), o botão da amostra e um cartão por grupo em mistura, na ordem de `compararAgrupamento`. Cada cartão traz o id do grupo, os atributos que diferem e os códigos de cada chave. Os cartões vêm de 10 em 10.
- A seção "SKUs por tipo e por identidade" mostra os dois totais de `visaoPorTipo` e o que cada grupo por tipo junta.
- A semente da amostra é `SEMENTE_DA_AMOSTRA`, em `src/motor/agrupamento.ts`. Ela é provisória: a fatia 4 a congela no pré-registro e confere com um teste.

## O que mudaria esta fatia

Se a pessoa da usina não souber qual coluna é o agrupamento, a tela precisa nomear o que procura, e isso volta ao ticket [`obter-agrupamento-da-usina`](../../../docs/wayfinder/partsgraph/tickets/obter-agrupamento-da-usina.md).
