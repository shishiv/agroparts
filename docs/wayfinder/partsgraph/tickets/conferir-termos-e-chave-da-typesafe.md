---
title: Conferir os termos e a chave da TypeSafe para medir o Jev
type: research
status: open
priority: P1
blocked_by: []
---

## Spec

[F3, o Jev classifica a família](../../../../specs/f3-jev-classifica-familia/README.md). Também serve a [F5](../../../../specs/f5-foto-box-ocr/README.md) e a [F6](../../../../specs/f6-audio-escolha-fechada/README.md).

## Pergunta

Que chave da TypeSafe funciona para a equipe, e o que os termos deixam fazer com as respostas do Jev sobre dado público: guardar em cache, publicar no repositório e citar no relatório?

## Evidência que torna a pergunta difícil

A API da TypeSafe respondeu 401 na máquina de trabalho, segundo o pedido do plano, e ninguém a chamou de novo.
O [ADR 0010](../../../decisoes/adr-0010-licencas-de-terceiros.md) exige licença compatível verificada antes de qualquer terceiro entrar no produto.
O plano leu a página de modelos, a de imagens, a de limites do Jev 1.13 e o DPA, mas não leu os termos de uso das respostas.
O DPA cobre só dado pessoal, e a retenção zero é só do plano enterprise.

## Opções e o que pesa contra cada uma

Guardar o cache das respostas no repositório deixa a medição reproduzível por qualquer revisor, mas só vale se os termos deixarem publicar as respostas.
Guardar o cache fora do git e publicar só as contagens respeita termos restritivos, mas um revisor sem chave não refaz o número.
Pedir à TypeSafe uma permissão escrita resolve a dúvida, mas depende de resposta de fora.

## Teste de falha

A opção falha se a medição chamar a API com uma chave que não é da equipe, se o cache for publicado sem os termos lidos, ou se a chave aparecer no repositório, no log ou no site.

## Artefato de fechamento

O ticket fecha com a chave funcionando no ambiente de quem mede, a URL e a data dos termos lidos, a decisão registrada sobre o cache e uma chamada de teste que deu certo com o modelo fixado.
