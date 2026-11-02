# Fatia 1: os atributos de identidade viram uma lista só

## Contrato que destrava

Uma só definição dos atributos que fazem SAME_AS, com a chave e as divergências derivadas dela.
A fatia 2 lê os atributos que diferem sem abrir o texto da chave.

## Costura

- `src/motor/especificacao.ts`: `ATRIBUTOS_IDENTIDADE`, `AtributoIdentidade`, `Identidade`, `Divergencia`, `chaveIdentidade(e: Identidade)`, `divergencias(itens)` e `descreverDivergencia(d)`.
- `src/motor/identidade.ts`: `decidirPar` passa a usar `divergencias` e `descreverDivergencia`, e as quatro comparações escritas à mão saem.
- `src/motor/lote.ts`: `LinhaLote` ganha `identidade: Identidade | null`, e `chave` passa a derivar dela. O escape de célula de `loteParaCsv` sai como `celulaCsv`, exportado, para a amostra de F2 e o arquivo de chaves de F4.
- `public/api/openapi.json`: o esquema da linha do lote ganha o campo `identidade`.

Os tipos e os trechos estão no [esboço](../esboco.md).

## O que a pessoa roda

- `bun run test`.
- `bun run medir`, e depois `git diff docs/medicao/gabarito-v1.md`.

## Verificação

- `bun run test` continua verde.
- O `git diff` de `docs/medicao/gabarito-v1.md` mostra no máximo a linha "Tempo do lote nesta máquina".
- Um teste novo em `tests/motor.test.ts` confere que `chaveIdentidade` dá o mesmo texto de antes para as 183 linhas do CATMAT que resolvem, e que os grupos de duplicidade continuam 28.
- Um teste confere que os motivos de `decidirPar` saem iguais aos de hoje nos quatro atributos, porque `web/linguagem.ts` os traduz.

## Decisões delegadas

- A ordem interna das funções e os nomes de variáveis locais.
- Migrar `chaveRotulo`, de `medir()`, para a lista. Só vale se a medição v1 sair idêntica.

## O que fica verde

`bun run test`, `bun run build` e as tabelas da medição v1.

## O que mudaria esta fatia

Se um motivo de `decidirPar` não puder sair igual, pare e registre no spec antes de mudar `web/linguagem.ts`.
