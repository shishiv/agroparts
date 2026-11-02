---
title: Obter uma exportação real de cadastro de materiais
type: task
status: open
priority: P0
blocked_by: []
---

## Pergunta

Qual empresa fornecerá a menor amostra útil de cadastro de materiais, com dicionário de campos, autorização clara de uso e regras acordadas de retenção e eliminação?

## Evidência que torna a pergunta difícil

O arquivo pode conter códigos, descrições e informação operacional sensível, enquanto a prova precisa somente dos campos necessários para resolver e revisar relações.
Sem uma amostra autorizada, o projeto pode provar trabalho sobre corpus público, mas não valor sobre cadastro real, conforme o [recon profundo](../../../pesquisa/recon-profundo-2026-08-25.md).

## Opções e o que pesa contra cada uma

Pedir uma exportação completa aumenta representatividade, mas também exposição e resistência do responsável.
Pedir uma amostra minimizada reduz risco, mas pode não conter relações e famílias suficientes.
Pedir dados transformados protege a empresa, mas pode remover referências necessárias ou conservar sinais operacionais sem uma regra clara.

## Teste de falha

A opção falha se não houver autorização registrada, dicionário de campos, finalidade definida, regras de retenção e eliminação ou códigos e descrições suficientes para a prova.

## Artefato de fechamento

O ticket fecha com empresa e responsável autorizadores registrados de forma privada, finalidade acordada, dicionário e esquema mínimo, campos excluídos, retenção e eliminação acordadas e arquivo recebido no canal aprovado.

## Estado depois do diagnóstico no navegador

O `/diagnostico` roda o motor no navegador da usina, e o arquivo não sai dele ([ADR 0022](../../../decisoes/adr-0022-diagnostico-no-navegador.md)), então a primeira rodada sobre cadastro real não precisa que a equipe receba o arquivo.
A fase F2 pede, além da exportação, o agrupamento que a usina já tem, no ticket [`obter-agrupamento-da-usina`](obter-agrupamento-da-usina.md).
O pedido segue as escolhas D1 e D8 do [mapa](../map.md): primeiro a demonstração sobre dado público, depois as perguntas e o pedido.
O ticket continua aberto, porque a fatia vertical ainda precisa de uma amostra recebida com autorização, retenção e eliminação acordadas.
