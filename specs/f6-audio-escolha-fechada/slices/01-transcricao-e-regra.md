# Fatia 1: gravações, transcrição local e a regra do motor

## Contrato que destrava

A taxa de chave certa quando a fala passa só pela transcrição local, pela tabela de palavras e pelo motor.

## Costura

- `dados/preregistro/f6-falas.json`, em commit próprio, antes de qualquer transcrição: as frases com a chave esperada de cada uma, o número de gravações por ruído, o limite de VERIFIED da fatia 1, o corte acima do qual a fatia 2 não roda e a margem da fatia 2.
- `dados/local/falas/`, que o git ignora: as gravações da equipe e o manifesto com `id`, `arquivo`, `chave_esperada` e `ruido`. Voz é dado pessoal, e publicar não tem volta, então as gravações e o consentimento de quem falou ficam fora do repositório público. O repositório recebe só o pré-registro e as contagens.
- `scripts/fala/fala.ts`: `textoFalado` e `candidatosDoCadastro`, como no [esboço](../esboco.md).
- `julgarTexto`, de `scripts/leitura.ts`, julga a fala como julga a foto. Se F5 ainda não entrou, implemente `julgarTexto` como no [esboço de F5](../../f5-foto-box-ocr/esboco.md), no mesmo arquivo.
- `scripts/fala/cadeias.ts`: o `Transcritor` escolhido no ticket [`escolher-transcritor-local`](../../../docs/wayfinder/partsgraph/tickets/escolher-transcritor-local.md) e `medirFala`.
- `docs/medicao/f6-falas.md`, gravado pelo script.

## O que a pessoa roda

O script de medição, e depois abre `docs/medicao/f6-falas.md`.

## Verificação

- O `git log` mostra o pré-registro antes do relatório, e o manifesto local é anterior à primeira transcrição.
- Testes em `tests/fala.test.ts` conferem `textoFalado` em frases escritas à mão, como "seis dois zero seis dois RS", "seis zero zero quatro zê zê" e "seis três um oito zê zê cê três".
- O relatório separa oficina e silêncio, com números absolutos.

## Decisões delegadas

- As palavras da tabela além dos dígitos e das letras de sufixo, desde que entrem no pré-registro.
- O formato de áudio das gravações.

## O que fica verde

`bun run test` e `bun run build`.

## O que mudaria esta fatia

Se nenhum transcritor tiver licença conferida, o veredito fica INCONCLUSIVE, e a fatia 2 não começa.
Se a regra passar do corte pré-registrado, a fatia 2 não roda, e o relatório diz que o Jev não tem o que acrescentar.
