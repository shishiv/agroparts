# Fatia 2: Box, recorte e conferência do Jev

## Contrato que destrava

O veredito de F5: a cadeia com o Jev contra a linha de base, nas mesmas fotos e na mesma medida.

## Costura

- `scripts/fotos/cadeias.ts`: `boxRecorteConferencia`, com o modelo fixado, como no [esboço](../esboco.md), seguindo o [cookbook de OCR com caixas](https://docs.typesafe.ai/cookbooks/ocr_confidence_bounding_boxes.md) da TypeSafe. O pedido e o cache passam pelo cliente da TypeSafe que F3 criou em `scripts/jev/`.
- O cache das respostas em `dados/local/`, que o git ignora.
- `docs/medicao/f5-fotos.md`, com as duas cadeias lado a lado.

## O que a pessoa roda

O script de medição da fatia 1 com a cadeia do Jev ligada e a chave no ambiente.

## Verificação

- O relatório mostra, por cadeia, chave certa, designação básica certa, errada, sem texto e recusadas na conferência, com números absolutos, e o veredito pela regra do pré-registro.
- Rodar de novo com o cache cheio não faz pedido à API e dá os mesmos números.
- `grep -r TYPESAFE dist web functions` não acha nada depois de `bun run build`.

## Decisões delegadas

- A margem do recorte em volta da caixa.
- O texto da pergunta de conferência ao Jev.

## O que fica verde

A fatia 1, `bun run test` e `bun run build`.

## O que mudaria esta fatia

Se a TypeSafe mudar o formato das imagens no meio da medição, pare e registre INCONCLUSIVE. Não misture respostas de formatos diferentes no mesmo relatório.
