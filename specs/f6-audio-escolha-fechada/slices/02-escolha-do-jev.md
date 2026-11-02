# Fatia 2: o Jev escolhe entre as chaves do cadastro

## Contrato que destrava

O veredito próprio da fatia 2: o que a escolha fechada do Jev acrescenta à regra. Ele não muda o veredito da fase, que é o da fatia 1.

## Costura

- `scripts/fala/cadeias.ts`: `escolhaDoJev`, com o modelo fixado, como no [esboço](../esboco.md). O pedido e o cache passam pelo cliente da TypeSafe que F3 criou em `scripts/jev/`.
- A lista fechada vem de `candidatosDoCadastro(loteCatmat())`, as chaves do CATMAT que resolvem, cortada pela designação básica que aparece no texto.
- O cache em `dados/local/`, que o git ignora.

## O que a pessoa roda

O script da fatia 1 com a escolha do Jev ligada e a chave no ambiente.

## Verificação

- O relatório mostra a regra e a regra com o Jev lado a lado, por ruído, com números absolutos e o veredito pela regra do pré-registro.
- Uma resposta que muda com a ordem das opções conta como "nenhum".
- Rodar de novo com o cache cheio não faz pedido à API.
- `grep -r TYPESAFE dist web functions` não acha nada depois de `bun run build`.

## Decisões delegadas

- O texto da pergunta ao Jev.

## O que fica verde

A fatia 1, `bun run test` e `bun run build`.

## O que mudaria esta fatia

Se a regra da fatia 1 passou do corte pré-registrado, esta fatia não roda. Não monte a fatia 2 só para usar o Jev.
