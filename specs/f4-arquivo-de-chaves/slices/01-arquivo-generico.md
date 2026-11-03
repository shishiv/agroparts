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

**Como ficou.** A fatia 3 de F2 já tinha entrado, e o botão ficou na linha dos downloads do resultado, ao lado de "Baixar CSV de resultado", e não ao lado da amostra. O botão da amostra mora na seção do agrupamento e só aparece com a coluna escolhida. O arquivo de chaves depende só de `grupos_duplicidade`, então vale sem a coluna, e colocá-lo ao lado da amostra o esconderia da pessoa que não escolheu a coluna.

## Medição

Com o arquivo de teste do F1 (`bun scripts/arquivo-diagnostico.ts`, 629 itens), o botão baixa **55 grupos**, como o spec previa. O motor dá os mesmos 55 em `lote.grupos_duplicidade`, que é também o número que a tela já mostrava em "grupos de cadastros duplicados". São 146 linhas, uma por código, e nenhum cadastro de grupo vem sem código. O arquivo baixado é idêntico, byte a byte, ao `chavesParaCsv` rodado no mesmo arquivo, no desktop e no celular, sem e com a coluna do agrupamento. A prova está em [`docs/medicao/arquivo-de-chaves/`](../../../docs/medicao/arquivo-de-chaves/README.md).

## Decisão (03/11/2026)

A fatia foi aceita pela evidência, sem a revisão do Myke, como na fatia 3 de F2. O computador era Linux, o `preview-shots` abre o Preview do macOS e o Myke não olhava a tela. A evidência: o número da tela e o do motor são 55, o arquivo baixado é idêntico ao `chavesParaCsv`, o CSV de resultado continua idêntico ao `loteParaCsv`, nenhum pedido de rede leva corpo, o celular de 390 px não rola na horizontal e a tela difere da anterior só dentro da caixa do botão novo (diferença zero fora dela). A revisão do Myke continua aberta: se ele discordar do rótulo ou da posição do botão, a correção é uma passada pequena sobre `web/diagnostico.ts`.

A crítica de um leitor sem contexto (`screenshot-critique`) achou que os rótulos "resultado", "chaves" e "amostra" não dizem o que cada arquivo contém, que o botão secundário é menor que o primário e que os três botões ficam em lugares separados. Ficou como está: o nome "Arquivo de chaves" é o do contrato, a diferença de tamanho entre botão primário e secundário é a do sistema de design do `/diagnostico` e já existia no botão da amostra, e o arquivo de chaves vive na linha dos downloads do resultado de propósito. Se uma usina não entender o nome, o ticket [`obter-modelo-de-carga-do-erp`](../../../docs/wayfinder/partsgraph/tickets/obter-modelo-de-carga-do-erp.md) é onde o rótulo deve mudar.
