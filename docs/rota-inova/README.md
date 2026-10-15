# Entregas do Rota Inova UEMG 2026

Esta pasta guarda as entregas da equipe AgroParts para o formulário do Rota Inova.
O formulário aceita um arquivo de até 10 MB por envio, e o prazo é 16/10/2026.

## Arquivos para enviar

O formulário pede uma entrega por vez. Envie um PDF para cada entrega:

| Entrega | Arquivo | Páginas |
| --- | --- | --- |
| Ideação (25/08/2026) | [`entregas/agroparts-rota-inova-1-ideacao.pdf`](entregas/agroparts-rota-inova-1-ideacao.pdf) | 15 |
| MVP (10/09/2026) | [`entregas/agroparts-rota-inova-2-mvp.pdf`](entregas/agroparts-rota-inova-2-mvp.pdf) | 8 |
| Prototipagem (21/09/2026) | [`entregas/agroparts-rota-inova-3-prototipagem.pdf`](entregas/agroparts-rota-inova-3-prototipagem.pdf) | 14 |
| Pitch (09/10/2026) | [`entregas/agroparts-rota-inova-4-pitch.pdf`](entregas/agroparts-rota-inova-4-pitch.pdf) | 22 |

Cada PDF começa com a capa do modelo do Canva e a divisória da entrega, e termina com as fontes e os créditos do que aparece nele.
O PDF da ideação traz também o canvas de ideação do modelo, logo depois da divisória.
O PDF do MVP não tem o slide de fontes, porque não cita números de fontes externas.

Se o formulário aceitar um arquivo só para as quatro entregas, envie [`entregas/agroparts-rota-inova-curto.pdf`](entregas/agroparts-rota-inova-curto.pdf), a versão curta, com 23 páginas.
A versão completa, com 51 páginas, é [`entregas/agroparts-rota-inova.pdf`](entregas/agroparts-rota-inova.pdf).
Os PDFs das quatro entregas têm os mesmos slides da versão completa.

Os PDFs usam slides 16:9, no visual do modelo do Canva da equipe.
As versões curta e completa juntam as quatro entregas nesta ordem: capa, ideação, MVP, prototipagem e pitch.
Cada entrega começa com uma divisória.

- A capa e o canvas de ideação são as páginas 1 e 2 do modelo do Canva, sem redesenho.
- Os outros slides vêm de [`entrega-unica.html`](entrega-unica.html), com o estilo de [`estilo-slides.css`](estilo-slides.css). A versão curta usa só os slides marcados com `data-curto`.
- O público não é técnico. Cada slide tem uma ideia, frases curtas e uma foto, captura ou ilustração.
- As fotos do cenário (usina, colheita, estoque, rolamentos) estão em [`img/cenario/`](img/cenario/), com autor e licença em [`img/cenario/CREDITOS.md`](img/cenario/CREDITOS.md). O último slide de cada PDF repete os créditos.
- O link do MVP, https://agroparts.pages.dev/, é clicável em todos os PDFs que mostram o site: MVP, prototipagem, pitch, curto e completo.

O pitch tem 13 slides, um roteiro de cerca de 4 minutos e meio e uma versão de 30 segundos.
Para projetar o pitch no encontro presencial de 21/10, use as páginas 3 a 15 de [`entregas/agroparts-rota-inova-4-pitch.pdf`](entregas/agroparts-rota-inova-4-pitch.pdf).
A versão completa traz também quem sente o problema, os números das fontes, os cinco casos do protótipo, os 13 slides do pitch e o roteiro.
A versão curta traz do pitch só a abertura, a confiança, o que já funciona e o que vem depois, e o pedido.
Os detalhes técnicos, as tabelas de medição e as fontes completas ficam nas entregas antigas, abaixo.

Cada PDF tem uma imagem com as páginas em miniatura, com o mesmo nome e o final `-miniaturas.jpg`, em [`entregas/`](entregas/).

## Como gerar os PDFs

1. Edite [`entrega-unica.html`](entrega-unica.html).
2. Rode `./gerar-pdf-unico.sh` nesta pasta. O script gera os seis PDFs (curto, completo e um por entrega) e precisa de Chromium ou Google Chrome, qpdf, poppler (pdfinfo e pdftocairo) e Python 3.
3. Se o script listar problemas de layout, corrija o slide da página indicada e rode de novo.
4. Confira os PDFs em `entregas/` antes de enviar.

Cada divisória de `entrega-unica.html` abre uma entrega. O atributo `data-entregas` deixa um slide ou trecho só em alguns PDFs; as fontes e os créditos usam esse atributo para citar só o que aparece em cada PDF.

O script recorta as ilustrações do modelo para `modelo/ilustracoes/` a cada execução, com [`modelo/extrair-ilustracoes.py`](modelo/extrair-ilustracoes.py).
Essa pasta fica fora do Git, porque as ilustrações são elementos do Canva.
Antes de imprimir, o script confere cada slide: texto fora do slide, texto vazando de um painel, conteúdo maior que o espaço abaixo do título, texto ou painel sobre uma ilustração ou foto, crédito fora da foto e imagem que não carrega.
O modelo usa a fonte Agrandir, que não tem licença livre. Os slides novos usam Montserrat, que o modelo também usa e que tem licença livre ([`fontes/OFL.txt`](fontes/OFL.txt)).

## Entregas antigas

As quatro entregas antigas, no estilo anterior, continuam aqui como referência. Elas não têm os slides novos do pitch.

| Workshop | Fonte editável | PDF |
| --- | --- | --- |
| Ideação (25/08/2026) | [`01-ideacao.html`](01-ideacao.html) | [`entregas/01-ideacao.pdf`](entregas/01-ideacao.pdf) |
| MVP (10/09/2026) | [`02-mvp.html`](02-mvp.html) | [`entregas/02-mvp.pdf`](entregas/02-mvp.pdf) |
| Prototipagem (21/09/2026) | [`03-prototipagem.html`](03-prototipagem.html) | [`entregas/03-prototipagem.pdf`](entregas/03-prototipagem.pdf) |
| Pitch (09/10/2026) | [`04-pitch.html`](04-pitch.html) | [`entregas/04-pitch.pdf`](entregas/04-pitch.pdf) |

O PDF antigo do pitch traz o deck de 10 slides em 16:9, o roteiro de 4 minutos e meio e a versão de 60 segundos.
O arquivo [`entregas/04-pitch-deck-para-projetar.pdf`](entregas/04-pitch-deck-para-projetar.pdf) traz só esses 10 slides. Ele serviu ao projetor do encontro de 09/10.

Para gerar as entregas antigas:

1. Edite o arquivo HTML da entrega. O estilo comum fica em [`estilo.css`](estilo.css).
2. Rode `./gerar-pdfs.sh` nesta pasta. O script precisa de Chromium ou Google Chrome.
3. Para gerar uma entrega só, passe o arquivo: `./gerar-pdfs.sh 02-mvp.html`.

O script avisa quando um PDF passa de 10 MB.

## Regras de conteúdo

- A fonte da verdade é a documentação do repositório: [produto](../produto.md), [arquitetura](../arquitetura.md), [roadmap](../roadmap.md), [decisões](../decisoes/) e [pesquisa](../pesquisa/).
- Todo número de mercado cita a fonte. Nenhum cliente, depoimento ou resultado é inventado.
- As entregas usam o nome público AgroParts. PartsGraph é codinome interno e não aparece nas entregas.
- As entregas mostram os nomes dos integrantes e nenhum outro dado pessoal.
