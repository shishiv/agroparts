# agroparts

`agroparts` é o repositório da iniciativa Rota Inova AGR08.
`PartsGraph` é somente o codinome interno do produto enquanto outro nome não é escolhido.
O produto não é loja nem marketplace: é uma camada B2B de resolução e normalização não destrutiva para cadastros MRO industriais e agroindustriais.
Ela preserva o ERP e o CMMS como sistemas de registro e distingue identidade, referência cruzada, intercâmbio condicionado, compatibilidade e similaridade.
Cada resposta declara o tipo de relação resolvida e preserva evidência e decisão.

## Protótipo público

O protótipo está publicado em https://agroparts.pages.dev.
Ele resolve rolamentos rígidos de esferas das séries 60, 62 e 63 a partir de código, descrição livre ou foto de etiqueta.
Ele roda sobre dados públicos (CATMAT e compras do Compras.gov.br), não sobre cadastro de cliente.
A amostra autorizada de cadastro real continua pendente em P0 do [roadmap](docs/roadmap.md).

O roteiro do pitch mostra as cinco provas do [ADR 0020](docs/decisoes/adr-0020-prova-antes-do-pitch.md):

1. Duplicidade exata: CATMAT 311960 e 311963 são o mesmo 6318ZZ C3 (`SAME_AS`, resolve).
2. Falsa semelhança recusada: 6211ZZ e 6211 ZZC3 têm texto quase igual e folga diferente (recusa, com motivo).
3. Referência cruzada: o CATMAT 624270 publica SKF 6206 2RS1 e NSK 6206 DDU. A relação aparece com condições e fonte, e o intercâmbio fica em revisão porque o item exige aço inoxidável.
4. Tradução em lote: 396 itens ativos do CATMAT 11797, com contagens por série e mapa de códigos em CSV.
5. Revisão humana: a decisão fica registrada ao lado do original intacto, com hash do original.

Os números medidos contra o gabarito v1 estão em [docs/medicao/gabarito-v1.md](docs/medicao/gabarito-v1.md).
A pilha está no [ADR 0021](docs/decisoes/adr-0021-pilha-do-prototipo-publico.md), e as fontes e licenças em [fontes do protótipo](docs/pesquisa/fontes-do-prototipo.md).

## Como rodar

Você precisa do [Bun](https://bun.sh) 1.4 ou mais novo.

1. Instale as dependências: `bun install`.
2. Rode os testes do motor e da API: `bun run test`.
3. Suba a demo local com a API: `bun run demo`. Abra http://localhost:8788.

Outros comandos:

- `bun run medir` mede o motor contra o gabarito e regrava `docs/medicao/gabarito-v1.md`.
- `bun run dados` refaz os snapshots públicos em `dados/publico/`. Depois disso, rode `bun run medir` e confira a diferença.
- `bun run build` gera o site em `dist/`.

A API está descrita em [`public/api/openapi.json`](public/api/openapi.json) e publicada em https://agroparts.pages.dev/api/openapi.json.
Ela não tem autenticação porque só lê dados públicos e não grava nada.

## Como publicar

O site usa o projeto Cloudflare Pages `agroparts`. O arquivo [`wrangler.toml`](wrangler.toml) aponta o build para `dist/`, e as rotas da API ficam em `functions/`.

1. Exporte as credenciais da conta Cloudflare no terminal (`CLOUDFLARE_ACCOUNT_ID` e um token de API ou `CLOUDFLARE_EMAIL` com `CLOUDFLARE_API_KEY`). Não grave essas credenciais no repositório.
2. Gere o site: `bun run build`.
3. Publique: `bun run deploy`. O comando roda `wrangler pages deploy dist --project-name agroparts --branch main`.

Se a internet falhar no dia do pitch, rode `bun run demo` num notebook com o repositório já instalado.

## Navegação

[Produto](docs/produto.md) define problema, cliente, fronteira e rejeições.
[Arquitetura](docs/arquitetura.md) registra entidades, relações e contrato de confiança.
[Glossário](docs/glossario.md) fixa a linguagem ubíqua.
[Roadmap](docs/roadmap.md) organiza os portões de prova de P0 a P3.
[Decisões](docs/decisoes/) preservam e substituem decisões por ADRs.
[Recon profundo](docs/pesquisa/recon-profundo-2026-08-25.md) fundamenta a reconciliação atual.
[Pesquisa](docs/pesquisa/) preserva fontes e medições reconferidas.
[Wayfinder](docs/wayfinder/partsgraph/map.md) mantém decisões, névoa e tickets locais.
[Visão geral](docs/visao-geral.html) explica o problema, as relações tipadas e o que ainda não está provado.
[Entregas do Rota Inova](docs/rota-inova/) guardam as quatro entregas do formulário em HTML e PDF.
