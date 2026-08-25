# ADR 0017: CATMAT como corpus, não ontologia principal

## Contexto

O CATMAT oferece códigos, descrições, padrões descritivos e vocabulário brasileiro reproduzível, mas é um catálogo de compras públicas.
O [recon profundo](../pesquisa/recon-profundo-2026-08-25.md) mostrou que ele não é autoridade de identidade de fabricante nem de intercambialidade técnica e deve ser comparado com ECLASS e com esquemas de fabricante.

## Decisão

O CATMAT permanecerá como corpus público e vocabulário brasileiro para famílias iniciais, extração e formação de negativos.
Ele não será tratado como espinha taxonômica.
A ontologia principal ficará em aberto até uma comparação por família entre CATMAT, ECLASS e o esquema do fabricante.

## Alternativas descartadas

Adotar CATMAT como ontologia principal foi descartado porque sua finalidade não cobre identidade e intercambialidade de fabricante.
Adotar ECLASS ou um esquema de fabricante sem comparação por família foi descartado por antecipar uma escolha sem evidência do recorte real.

## Consequências

O corpus público continua útil sem receber autoridade técnica que não possui.
A escolha de ontologia dependerá de uma comparação documentada por família e poderá variar conforme a evidência.

## Status

Aceita. Substitui o [ADR 0002](adr-0002-catmat-como-espinha-taxonomica.md).
