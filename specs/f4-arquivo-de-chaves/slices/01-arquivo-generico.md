# Fatia 1: o arquivo de chaves genérico

## Contrato que destrava

Um CSV que qualquer ERP importa, com um código por linha de cada grupo de mesma peça, a chave e a evidência.

## Costura

- `src/motor/chaves.ts`: `arquivoDeChaves(lote)` e `chavesParaCsv(arquivo)`, como no [esboço](../esboco.md). `chavesParaCsv` usa o `celulaCsv` que a fatia 1 de F2 exporta de `src/motor/lote.ts`.
- `web/diagnostico.ts`: um segundo botão de download, "Arquivo de chaves", que só aparece quando há grupo de duplicidade, e a contagem dos cadastros de grupo sem código.

## O que a pessoa vê

Em `/diagnostico`, com o arquivo de teste do F1 (`bun scripts/arquivo-diagnostico.ts`), o botão baixa um CSV com os 55 grupos.

## Verificação

- Testes em `tests/chaves.test.ts`:
  - o arquivo tem uma linha por código de cada grupo, e nada de fora dos grupos;
  - toda linha tem `relacao` igual a `SAME_AS`, chave e pelo menos uma evidência com URL;
  - o texto original sai intacto;
  - rodar duas vezes dá o mesmo arquivo, byte a byte.
- Pela skill [`verify-agroparts`](../../../.cursor/skills/verify-agroparts/SKILL.md), o arquivo baixado é idêntico ao `chavesParaCsv` rodado no mesmo arquivo, e o registro de rede não tem pedido com corpo.
- Use a skill `compare-screenshots` contra as capturas do F1 em `docs/medicao/diagnostico-navegador/`.
- Como última conferência antes de aceitar, rode a skill `screenshot-critique` sobre as capturas novas, com um leitor sem contexto.

## Decisões delegadas

- A ordem das colunas e o nome do arquivo baixado.
- O separador das evidências dentro da célula, desde que fique documentado no cabeçalho do módulo.

## O que fica verde

`bun run test`, `bun run build`, o CSV do mapa de códigos sem mudança e a prova de rede do F1.

## Revisão humana

Abra as capturas para o Myke com a skill `preview-shots` e espere uns 5 minutos.
Se ele não responder, decida pela evidência, registre a decisão e o motivo neste spec, feche as capturas e siga.

## O que mudaria esta fatia

Se a fatia 3 de F2 já tiver entrado, o botão fica ao lado do botão da amostra de F2.
