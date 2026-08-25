# ADR 0018: Isolamento estrito no piloto

## Contexto

Código interno e relação entre peça e ativo podem revelar prática operacional mesmo sem preço ou nome do cliente.
O [recon profundo](../pesquisa/recon-profundo-2026-08-25.md) mostrou que anonimização não basta para justificar aprendizagem compartilhada e que LGPD não responde sozinha pela confidencialidade industrial.

## Decisão

O piloto terá zero aprendizagem entre clientes.
Dados e decisões permanecerão no inquilino.
Somente corpus público e licenciado ficará na base comum.
Uma relação privada só poderá ser promovida para a base comum com fonte pública independente ou autorização explícita do cliente.
Logs não copiarão a descrição completa quando identificador e hash bastarem.
Retenção e eliminação serão acordadas no contrato do piloto.

A LGPD protege pessoa natural e não será apresentada como resposta completa para confidencialidade industrial, obrigações contratuais, segredo comercial e segurança.

## Alternativas descartadas

Compartilhar mapeamentos privados anonimizados foi descartado porque códigos e relações ainda podem revelar operação do cliente.
Usar filtros opcionais sobre uma base compartilhada foi descartado porque não estabelece isolamento estrito.
Tratar conformidade com LGPD como garantia suficiente foi descartado porque o risco inclui dados empresariais e deveres contratuais.

## Consequências

Toda leitura, decisão, revisão e exportação privada permanecerá no mesmo inquilino.
A base comum terá somente fontes públicas ou licenciadas, salvo promoção explicitamente autorizada.
O piloto precisará registrar regras contratuais de retenção e eliminação.

## Status

Aceita. Substitui o [ADR 0005](adr-0005-isolamento-de-dados-por-inquilino.md).
