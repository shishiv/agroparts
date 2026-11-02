# Specs das fases da AgroParts

A AgroParts roda como SaaS ao lado do ERP que cada usina já tem, e o SAP é um ERP entre vários.
Cada fase tem aqui um spec escrito com a skill `write-spec` antes de qualquer código de produto, e um esboço de tipos feito com a skill `architect`.
Só o esboço de F2 passou pela arena, porque o modelo de SKU é porta sem volta.
As escolhas D1 a D8, as decisões e os tickets de cada fase estão no [mapa do Wayfinder](../docs/wayfinder/partsgraph/map.md).

## Próximo agente

Você vai produzir uma fase.
Leia o [`AGENTS.md`](../AGENTS.md), o mapa e o README da fase antes de mudar código.
A ordem é F2, F3 e F4, e depois do piloto F5, F6 e F7.
Se as primeiras usinas acharem pouco no diagnóstico por causa da cobertura, F3 passa à frente de F2.
As primeiras fatias de F2, F3 e F4 rodam só sobre dado público.
F3 anda em paralelo com as outras duas, no próprio branch.
F2 e F4 andam em sequência, porque as duas mexem em `src/motor/lote.ts` e em `web/diagnostico.ts`, e o arquivo de chaves de F4 usa o escape `celulaCsv` que a fatia 1 de F2 exporta.

- [x] [F1](done/f1-diagnostico-navegador.md): diagnóstico grátis no navegador. Fechado.
- [ ] [F2](f2-sku-contra-agrupamento/README.md): SKU contra o agrupamento que a usina já tem.
- [ ] [F3](f3-jev-classifica-familia/README.md): o Jev classifica a família.
- [ ] [F4](f4-arquivo-de-chaves/README.md): arquivo de chaves que volta ao ERP.
- [ ] [F5](f5-foto-box-ocr/README.md): foto da etiqueta com Box, OCR e conferência do Jev.
- [ ] [F6](f6-audio-escolha-fechada/README.md): áudio que vira texto, com escolha fechada.
- [ ] [F7](f7-plaquinha-consumo/README.md): plaquinha com visão só de leitura do consumo por máquina.

Ao fechar uma fase, mova o spec para `done/` com a skill `close-spec` e marque a linha acima.

## O que cada fase espera de fora

| Fase | Dado de usina | Chave da TypeSafe | Licença a conferir |
|---|---|---|---|
| F2 | exportação e agrupamento, na fatia 4 | não | não |
| F3 | não | na fatia 2 | termos das respostas do Jev |
| F4 | modelo de carga e ambiente fora da produção, na fatia 2 | não | não |
| F5 | não | na fatia 2 | cada foto |
| F6 | não | na fatia 2 | transcritor, pesos e runtime |
| F7 | ordens de manutenção, nas duas fatias | não | biblioteca de QR |

O F0 do plano, um harness de medição só para ele, não existe como fase.
Cada fase pré-registra só o que ela mesma mede.

## Regras que toda fase herda

- O veredito é VERIFIED, NOT VERIFIED ou INCONCLUSIVE. INCONCLUSIVE não conta como aprovado, e um resultado negativo vai para o relatório.
- O pré-registro vem em commit próprio, em `dados/preregistro/`, antes de medir. Mudar regra, rótulo ou limiar depois abre versão nova, e a anterior continua publicada ([ADR 0014](../docs/decisoes/adr-0014-benchmarks-separados-e-pre-registrados.md)).
- Toda porcentagem vem com o número absoluto, e não existe acurácia única.
- Com zero erros em n casos, o limite superior de 95% do erro fica perto de 3/n. Afirmar erro abaixo de 1% pede uns 300 casos sem erro por família.
- O rótulo vem de fora do motor: o PDM que o governo deu ao item, a designação conferida por uma pessoa ou o julgamento de quem é da usina.
- O arquivo da usina não sai do navegador dela (escolha D3 e [ADR 0022](../docs/decisoes/adr-0022-diagnostico-no-navegador.md)). A equipe recebe só contagens.
- O Jev só lê dado público até um contrato (escolha D4). O código que fala com a TypeSafe fica em `scripts/`, com o modelo fixado por versão, e ninguém chama a API antes do ticket [`conferir-termos-e-chave-da-typesafe`](../docs/wayfinder/partsgraph/tickets/conferir-termos-e-chave-da-typesafe.md).
- Terceiro só entra com licença compatível verificada ([ADR 0010](../docs/decisoes/adr-0010-licencas-de-terceiros.md)).
- Nenhum número, cliente ou resultado é inventado. Dado sintético só existe em teste e diz que é sintético.
- Nenhum ADR aceito é reescrito. Quando uma fase bate num, o spec diz qual ADR precisaria mudar, e um ticket guarda a pergunta.
- Uma fatia que muda a tela prova o caminho da pessoa com a skill [`verify-agroparts`](../.cursor/skills/verify-agroparts/SKILL.md), compara com a tela anterior pela skill `compare-screenshots` e termina com a skill `screenshot-critique`.

## Donos únicos entre as fases

- `ATRIBUTOS_IDENTIDADE`, em `src/motor/especificacao.ts`, é a única lista dos atributos que fazem SAME_AS, a partir de F2.
- `traduzirLote` é a única via para a chave de identidade. O agrupamento de F2, o arquivo de chaves de F4, a lista fechada de F6 e o consumo de F7 leem a chave do lote.
- `julgarTexto`, em `scripts/leitura.ts` a partir de F5, julga o texto lido de foto e de fala.
- O que só a medição usa fica em `scripts/`. Um módulo passa para `src/motor/` quando o site ou a API precisarem dele.
- O escape de célula CSV tem um dono, `celulaCsv` em `src/motor/lote.ts`, que a fatia 1 de F2 exporta de dentro de `loteParaCsv`. A amostra de F2 e o arquivo de chaves de F4 o usam em vez de escrever outro.
- O pedido à TypeSafe, com a chave, o modelo fixado e o cache, tem um dono em `scripts/jev/`, criado em F3. F5 e F6 o reaproveitam.
- A chave da TypeSafe só existe em `scripts/` e no ambiente de quem roda. Nada do Jev entra em `web/`, `functions/` ou `dist/`.

## Como os specs se conferem

Cada `esboco.md` traz blocos `diff`, que aplicam com `git apply` sobre o `main`, e blocos `ts` que começam com `// <caminho>`, que são arquivos inteiros.
Um esboço que depende de outro declara isso numa linha `<!-- depende: <pasta-do-spec> -->`.
Na raiz do repositório:

- `bun specs/checar-esbocos.ts .` aplica cada esboço numa cópia temporária e roda o `tsc` da raiz e o de `web/`.
- `bun specs/checar-links.ts .` confere que todo link interno do `README.md`, de `docs/` e de `specs/` aponta para um arquivo que existe.

Rode os dois depois de mudar um spec, um esboço ou um ticket.
