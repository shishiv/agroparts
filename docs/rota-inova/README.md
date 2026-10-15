# Entregas do Rota Inova UEMG 2026

Esta pasta guarda as entregas da equipe AgroParts para o formulário do Rota Inova.
O formulário aceita um arquivo de até 10 MB por envio, e o prazo é 16/10/2026.

## Arquivo para enviar

Envie [`entregas/agroparts-rota-inova.pdf`](entregas/agroparts-rota-inova.pdf).
É um PDF só, em slides 16:9, no visual do modelo do Canva da equipe.
Ele junta as quatro entregas nesta ordem: capa, ideação, MVP, prototipagem e pitch.
Cada entrega começa com uma divisória.

- A capa e o canvas de ideação são as páginas 1 e 2 do modelo do Canva, sem redesenho.
- Os outros slides vêm de [`entrega-unica.html`](entrega-unica.html), com o estilo de [`estilo-slides.css`](estilo-slides.css).
- O link do MVP, https://agroparts.pages.dev/, é clicável no PDF.

[`entregas/agroparts-rota-inova-miniaturas.jpg`](entregas/agroparts-rota-inova-miniaturas.jpg) mostra todas as páginas em miniatura.

## Como gerar o PDF único

1. Edite [`entrega-unica.html`](entrega-unica.html).
2. Rode `./gerar-pdf-unico.sh` nesta pasta. O script precisa de Chromium ou Google Chrome, qpdf, poppler (pdfinfo e pdftocairo) e Python 3.
3. Se o script listar problemas de layout, corrija o slide da página indicada e rode de novo.
4. Confira o PDF em `entregas/` antes de enviar.

O script recorta as ilustrações do modelo para `modelo/ilustracoes/` a cada execução, com [`modelo/extrair-ilustracoes.py`](modelo/extrair-ilustracoes.py).
Essa pasta fica fora do Git, porque as ilustrações são elementos do Canva.
Antes de imprimir, o script confere cada slide: texto fora do slide, texto vazando de um painel, texto ou painel sobre uma ilustração e imagem que não carrega.
O modelo usa a fonte Agrandir, que não tem licença livre. Os slides novos usam Montserrat, que o modelo também usa e que tem licença livre ([`fontes/OFL.txt`](fontes/OFL.txt)).

## Entregas separadas

As quatro entregas separadas continuam aqui como referência.

| Workshop | Fonte editável | PDF |
| --- | --- | --- |
| Ideação (25/08/2026) | [`01-ideacao.html`](01-ideacao.html) | [`entregas/01-ideacao.pdf`](entregas/01-ideacao.pdf) |
| MVP (10/09/2026) | [`02-mvp.html`](02-mvp.html) | [`entregas/02-mvp.pdf`](entregas/02-mvp.pdf) |
| Prototipagem (21/09/2026) | [`03-prototipagem.html`](03-prototipagem.html) | [`entregas/03-prototipagem.pdf`](entregas/03-prototipagem.pdf) |
| Pitch (09/10/2026) | [`04-pitch.html`](04-pitch.html) | [`entregas/04-pitch.pdf`](entregas/04-pitch.pdf) |

O PDF do pitch traz o deck de 10 slides em 16:9, o roteiro de 4 minutos e meio e a versão de 60 segundos.
O arquivo [`entregas/04-pitch-deck-para-projetar.pdf`](entregas/04-pitch-deck-para-projetar.pdf) traz só os slides, para o projetor do encontro de 09/10 e da apresentação presencial de 21/10.

Para gerar as entregas separadas:

1. Edite o arquivo HTML da entrega. O estilo comum fica em [`estilo.css`](estilo.css).
2. Rode `./gerar-pdfs.sh` nesta pasta. O script precisa de Chromium ou Google Chrome.
3. Para gerar uma entrega só, passe o arquivo: `./gerar-pdfs.sh 02-mvp.html`.

O script avisa quando um PDF passa de 10 MB.

## Regras de conteúdo

- A fonte da verdade é a documentação do repositório: [produto](../produto.md), [arquitetura](../arquitetura.md), [roadmap](../roadmap.md), [decisões](../decisoes/) e [pesquisa](../pesquisa/).
- Todo número de mercado cita a fonte. Nenhum cliente, depoimento ou resultado é inventado.
- As entregas usam o nome público AgroParts. PartsGraph é codinome interno e não aparece nas entregas.
- As entregas mostram os nomes dos integrantes e nenhum outro dado pessoal.
