---
title: Escolher o transcritor local de fala em português
type: research
status: open
priority: P3
blocked_by: []
---

## Spec

[F6, áudio que vira texto com escolha fechada](../../../../specs/f6-audio-escolha-fechada/README.md).

## Pergunta

Que transcritor de fala em português roda local, sem mandar o áudio a terceiro, com licença conferida do código, dos pesos e do runtime?

## Evidência que torna a pergunta difícil

O Jev não aceita áudio, então a fala entra como transcrição de outro modelo.
O plano viu o Whisper descrito como MIT numa discussão da própria OpenAI no GitHub, mas não conferiu o arquivo LICENSE nem o runtime (por exemplo whisper.cpp ou uma versão para navegador).
O [ADR 0010](../../../decisoes/adr-0010-licencas-de-terceiros.md) exige licença verificada e registrada antes de qualquer terceiro entrar.
Voz é dado pessoal, e o diagnóstico promete que o dado não sai da máquina de quem usa ([ADR 0022](../../../decisoes/adr-0022-diagnostico-no-navegador.md)).

## Opções e o que pesa contra cada uma

Um transcritor que roda no script resolve a medição de F6, mas não diz se o mesmo modelo cabe num celular.
Um transcritor que roda no navegador serve ao produto depois, mas pode ser pesado demais para baixar e lento no aparelho.
Um serviço de transcrição na nuvem é o mais fácil, mas manda voz a terceiro e cria um subprocessador.

## Teste de falha

A opção falha se a licença do código, dos pesos ou do runtime não estiver conferida e registrada, se o áudio sair da máquina, ou se o modelo escolhido mudar depois de ver uma transcrição.

## Artefato de fechamento

O ticket fecha com o transcritor e a versão fixa, os arquivos de licença lidos com URL e data, onde ele roda e uma transcrição de teste de uma frase da equipe.
