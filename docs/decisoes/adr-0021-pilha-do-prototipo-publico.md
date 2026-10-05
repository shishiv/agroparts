# ADR 0021: Pilha do protótipo público

## Contexto

O pitch do Rota Inova acontece em 09/10/2026, e a apresentação presencial em 21/10/2026.
A equipe pediu um protótipo navegável, publicado na web, que outras pessoas abram sem instalar nada.
A equipe não tem servidor próprio, banco de dados nem verba.
O primeiro plano previa uma demo local em Python com FastAPI. Ele foi trocado antes do primeiro commit, quando chegou o pedido de site publicável.
O [ticket do protótipo](../wayfinder/partsgraph/tickets/prototipar-interface-do-pitch.md) exige as cinco provas do [ADR 0020](adr-0020-prova-antes-do-pitch.md) sem dado falso nem fluxo simulado.

## Decisão

O protótipo é um site estático com API serverless no Cloudflare Pages:

- o motor é TypeScript em `src/motor/` e roda nas rotas Pages Functions de `functions/api/`;
- os corpora públicos ficam versionados como JSON em `dados/publico/` e entram no pacote das funções;
- a interface é HTML, CSS e TypeScript sem framework, compilada pelo Vite a partir de `web/`, e toda resolução passa pela API;
- o OCR da foto de etiqueta roda no navegador com tesseract.js, servido pelo próprio site, e a pessoa confere o texto lido antes de resolver;
- a API não guarda estado; a revisão humana volta como registro com o hash do original, e o navegador guarda o registro e o exporta em JSON;
- os testes usam Vitest e chamam o motor e as rotas como os clientes chamam;
- `bun run demo` compila e sobe o site com as funções em `wrangler pages dev`; `bun run deploy` publica no projeto Pages `agroparts`.

O site público usa só dados abertos e licenciados, conforme o [ADR 0010](adr-0010-licencas-de-terceiros.md): CATMAT, linhas de compra do Compras.gov.br e a tabela DIN 625-1 da BOLTS.
A SKF entra só como link para a regra de designação.
O nome público do site é AgroParts, o nome da equipe inscrita; `PartsGraph` não aparece no site, conforme o [ADR 0015](adr-0015-partsgraph-como-codinome-interno.md).

## Alternativas descartadas

Python com FastAPI numa máquina local foi descartado porque o site precisa ser público e a equipe não tem servidor.
Motor só no navegador foi descartado porque a interface precisa usar uma API HTTP documentada, que também serve a integrações futuras.
Banco de dados para as revisões foi descartado porque exigiria conta, custo e política de retenção antes de existir cliente.
OCR em servidor foi descartado porque o Pages Functions não roda o binário do Tesseract.

## Consequências

Qualquer pessoa com o link usa o protótipo, inclusive no celular.
A API é pública e sem autenticação. Isso é aceitável porque ela só lê corpora públicos e não grava nada.
As revisões ficam no navegador de quem revisa. Elas não são compartilhadas entre pessoas.
Um catálogo de fabricante só entra no site quando sua licença permitir redistribuição.

## Status

Aceita.
