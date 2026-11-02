# Fatia 1: fotos pré-registradas e a linha de base

## Contrato que destrava

Um benchmark de fotos congelado, com a chave esperada de cada uma, e a taxa de leitura do Tesseract na foto inteira.

## Costura

- `dados/preregistro/f5-fotos.json`, em commit próprio, antes de qualquer leitura: o número de fotos, a regra de inclusão, a margem que a fatia 2 precisa abrir e o critério de leitura certa do [README](../README.md).
- `dados/publico/fotos-etiqueta/`: as fotos e um manifesto com `id`, `arquivo`, `chave_esperada`, `fonte` e `licenca` de cada uma.
- `scripts/leitura.ts` (`julgarTexto` e `julgarLeitura`) e `scripts/fotos/cadeias.ts` (`tesseractNaFotoInteira` e `medirLeitura`), como no [esboço](../esboco.md). Ficam em `scripts/` porque só a medição usa.
- `docs/medicao/f5-fotos.md`, gravado pelo script de medição.

## O que a pessoa roda

O script de medição da fatia, e depois abre `docs/medicao/f5-fotos.md`.

## Verificação

- O `git log` mostra o pré-registro antes das fotos e do relatório.
- Toda foto do manifesto tem licença e fonte, e tem de 280 a 1568 pixels de lado.
- O Tesseract do script é o mesmo pacote e o mesmo modelo que o site usa. Se ele não rodar fora do navegador, rode a medição num Chromium com o `playwright-core` que o repositório já tem.
- Um teste confere `julgarTexto` e `julgarLeitura` com um texto lido certo, um com sufixo errado e um sem texto.

## Decisões delegadas

- O formato do manifesto, desde que traga os cinco campos.
- O comando do script de medição.

## O que fica verde

`bun run test`, `bun run build` e o OCR do site.

## O que mudaria esta fatia

Se não houver fotos com licença em número suficiente, o veredito fica INCONCLUSIVE, e a fatia 2 não começa.
