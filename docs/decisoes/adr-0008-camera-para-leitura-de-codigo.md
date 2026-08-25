# ADR 0008: Câmera para leitura de código

## Contexto

Peças do mesmo padrão podem ser visualmente idênticas e se distinguir apenas por dimensão ou especificação.
Classificação visual isolada criaria uma falsa segurança de identificação.

## Decisão

A câmera será usada para ler código gravado, etiqueta e contexto do ativo.
A imagem não decidirá sozinha a classificação da peça.

## Alternativas descartadas

Classificação visual ponta a ponta foi descartada porque aparência não prova equivalência dimensional.
Excluir imagem por completo foi descartado porque código e contexto visual reduzem fricção de entrada.

## Consequências

OCR e captura de contexto podem fornecer evidências, mas a decisão continua baseada em atributos verificáveis.
A demonstração não deve representar fotografia como reconhecimento infalível da peça.

## Status

Aceita.
