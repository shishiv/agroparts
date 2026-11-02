# Fatia 2: o motor compara um agrupamento e mostra a visão por tipo

## Contrato que destrava

Funções puras que dizem quais grupos de um agrupamento misturam chaves de identidade, com evidência, e o que um SKU por tipo junta.
A tela da fatia 3 só chama estas funções.

## Costura

`src/motor/agrupamento.ts`, como no [esboço](../esboco.md):

- `compararAgrupamento(entradas: readonly EntradaAgrupada[]): ComparacaoAgrupamento`, que traduz as entradas e devolve o lote junto;
- `visaoPorTipo(lote, junta?)`;
- `amostrar(comparacao, semente, n = 20)`;
- `amostraParaCsv(amostra)`, com o `celulaCsv` que a fatia 1 exportou.

## O que a pessoa roda

- `bun run test`.
- `bun run medir`, que ganha, na seção do lote sem gabarito, uma tabela com os SKUs por tipo, por designação básica e proteção e por identidade.

## Verificação

Testes em `tests/agrupamento.test.ts`, chamando o módulo como a página chama:

- `visaoPorTipo(loteCatmat())` dá 59 SKUs por tipo e 150 por identidade, e `visaoPorTipo(loteCatmat(), ["folga", "inox"])` dá 133.
- A autoconferência do esboço: um agrupamento pela designação básica tem tantas misturas quanto a visão por tipo tem grupos.
- `compararAgrupamento` preserva a ordem: `lote.linhas[i].original` é o `original` da entrada `i`.
- Os textos `ROLAMENTO 6004-2Z`, `6004 ZZ`, `ROL 6004 2RS` e `FILTRO DE OLEO MOTOR` num mesmo grupo dão uma mistura por proteção, com o filtro em `sem_chave`.
- Um grupo com uma linha só conta em `grupos_unitarios` e não aparece em `grupos`.
- `amostrar` devolve os mesmos grupos com as entradas embaralhadas e muda com outra semente.
- `amostraParaCsv` leva o texto original intacto e a coluna `distincao_real` vazia.
- O módulo não importa nada de rede nem de `web/`.

## Decisões delegadas

- A função de hash da amostra, desde que seja síncrona, pura e documentada no pré-registro.
- A ordem das colunas de `amostraParaCsv`, desde que `distincao_real` fique por último.

## O que fica verde

`bun run test`, `bun run build` e a medição v1.

## O que mudaria esta fatia

Se a usina disser que o agrupamento vem num arquivo separado, acrescente um leitor que case códigos do ERP antes de montar `EntradaAgrupada`, sem mudar `compararAgrupamento`.
