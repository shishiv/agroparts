# ADR 0022: Diagnóstico de duplicidade roda no navegador

## Contexto

O diagnóstico grátis de duplicidade é o primeiro contato com uma usina: a pessoa envia o cadastro de material e vê quais códigos são a mesma peça.
O arquivo é dado de cliente. O [ADR 0018](adr-0018-isolamento-estrito-no-piloto.md) isola esse dado no inquilino, e uma promessa de que o arquivo não sai da máquina da pessoa tira a retenção da conversa.
O [ADR 0021](adr-0021-pilha-do-prototipo-publico.md) descartou o motor só no navegador porque a interface precisava usar uma API HTTP documentada. Isso valia para o protótipo do pitch, que lê só corpora públicos.
O `POST /api/lote` também limita o lote a 500 itens, e um cadastro de usina tem muito mais.

## Decisão

A página `/diagnostico` roda o motor no navegador: o mesmo `traduzirLote` de `src/motor/lote.ts`, empacotado pelo Vite junto com os corpora públicos.
O CSV é lido no navegador, sem limite de itens, e o CSV de resultado sai de `loteParaCsv`, com as mesmas colunas de `/api/lote?formato=csv`.
A página não faz nenhum pedido de rede com o conteúdo do arquivo.
O acesso é só por link: a página não aparece na navegação do site e leva `noindex`.

Este ADR substitui o ADR 0021 só no ponto "motor só no navegador foi descartado" e no de que toda resolução passa pela API, e só para esta página.
O restante do ADR 0021 continua valendo: o protótipo em `/` segue chamando a API, e a API segue pública, sem estado e sobre dados abertos.
O motor não muda. O isolamento do dado do cliente em um piloto continua regido pelo ADR 0018.

## Alternativas descartadas

Enviar o arquivo à API foi descartado porque exigiria guardar ou, no mínimo, receber dado de cliente, e porque o limite de 500 itens não serve a um cadastro inteiro.
Subir o limite da API foi descartado pelo mesmo motivo de recebimento do dado e por empurrar o custo para o Pages Functions.
Aceitar XLSX foi deixado para depois: o primeiro passo é só CSV.

## Consequências

O arquivo não sai do navegador, e isso pode ser provado pelo registro de rede.
O pacote da página carrega os corpora públicos (cerca de 40 kB comprimidos). O motor passa a existir em dois lugares de execução, as funções e o navegador, sobre o mesmo código.
O desempenho depende do aparelho da pessoa. Arquivos muito grandes em celular não foram medidos.
Não há contagem de uso nesta página.

## Status

Aceita. Substitui o ADR 0021 no ponto acima.
