# Entregas do Rota Inova UEMG 2026

Esta pasta guarda as quatro entregas da equipe AgroParts para o formulário do Rota Inova, uma por workshop.
O formulário aceita um arquivo de até 10 MB por envio, e o prazo é 16/10/2026.

| Workshop | Fonte editável | PDF para enviar |
| --- | --- | --- |
| Ideação (25/08/2026) | [`01-ideacao.html`](01-ideacao.html) | [`entregas/01-ideacao.pdf`](entregas/01-ideacao.pdf) |
| MVP (10/09/2026) | [`02-mvp.html`](02-mvp.html) | [`entregas/02-mvp.pdf`](entregas/02-mvp.pdf) |
| Prototipagem (21/09/2026) | [`03-prototipagem.html`](03-prototipagem.html) | [`entregas/03-prototipagem.pdf`](entregas/03-prototipagem.pdf) |
| Pitch (09/10/2026) | [`04-pitch.html`](04-pitch.html) | [`entregas/04-pitch.pdf`](entregas/04-pitch.pdf) |

O PDF do pitch traz o deck de 10 slides em 16:9, o roteiro de 4 minutos e meio e a versão de 60 segundos.
O arquivo [`entregas/04-pitch-deck-para-projetar.pdf`](entregas/04-pitch-deck-para-projetar.pdf) traz só os slides, para o projetor do encontro de 09/10 e da apresentação presencial de 21/10.

## Como editar e gerar os PDFs

1. Edite o arquivo HTML da entrega. O estilo comum fica em [`estilo.css`](estilo.css).
2. Rode `./gerar-pdfs.sh` nesta pasta. O script precisa de Chromium ou Google Chrome.
3. Para gerar uma entrega só, passe o arquivo: `./gerar-pdfs.sh 02-mvp.html`.
4. Confira o PDF em `entregas/` antes de enviar.

O script avisa quando um PDF passa de 10 MB.

## Regras de conteúdo

- A fonte da verdade é a documentação do repositório: [produto](../produto.md), [arquitetura](../arquitetura.md), [roadmap](../roadmap.md), [decisões](../decisoes/) e [pesquisa](../pesquisa/).
- Todo número de mercado cita a fonte. Nenhum cliente, depoimento ou resultado é inventado.
- As entregas usam o nome público AgroParts. PartsGraph é codinome interno e não aparece nas entregas.
- As entregas mostram os nomes dos integrantes e nenhum outro dado pessoal.
