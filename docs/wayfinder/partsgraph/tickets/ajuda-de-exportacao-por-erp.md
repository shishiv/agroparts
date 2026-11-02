---
title: Ajuda de exportação por ERP dentro do diagnóstico
type: research
status: open
priority: P1
blocked_by: []
---

## Spec

[F1, diagnóstico no navegador](../../../../specs/done/f1-diagnostico-navegador.md).

## Pergunta

Que ajuda de exportação por ERP a página `/diagnostico` precisa mostrar para que a pessoa da usina chegue sozinha ao CSV com código e descrição?

## Evidência que torna a pergunta difícil

A página lê só CSV, com uma coluna de código e uma de descrição ([ADR 0022](../../../decisoes/adr-0022-diagnostico-no-navegador.md)).
A pesquisa de ERP das usinas, guardada fora do repositório com as fontes de cada ERP, achou o SAP, a TOTVS, a Senior, a Trust e a CHB entre as usinas com fonte pública.
Ela achou caminho documentado de exportação para quatro deles. Os nomes de telas, tabelas e campos abaixo vêm dessa pesquisa e só se conferem nas fontes dela quando ela entrar em `docs/pesquisa/`:

- SAP: a transação SE16N na tabela MAKT, com o código em MATNR e a descrição em MAKTX, e a lista exportada por List > Export > Spreadsheet.
- TOTVS Protheus: a rotina MATA010, com B1_COD e B1_DESC, exportada por Outras Ações > Exp.Excel.
- TOTVS Datasul: o programa CD0204, com a lista do botão Pesquisa mandada à planilha por Ctrl+Alt+E.
- Senior: a tela F075PRO, com CodPro e DesPro, exportada pela aba Exportação.

Para o Trust SGI e para a CHB, ela não achou documentação pública, e o caminho é pedir à TI um CSV com o código e a descrição de cada material ativo.
Todos os caminhos terminam numa planilha que a pessoa salva como CSV no Excel, e nenhuma fonte lida descreve esse passo.
Uma usina pode ter dois sistemas, e o cadastro de peças fica no ERP do almoxarifado.

## Opções e o que pesa contra cada uma

Um texto genérico ("exporte código e descrição em CSV") é barato, mas deixa a pessoa sem saber qual tela abrir.
Um guia por ERP para SAP e TOTVS, com um guia genérico para o resto, cobre a maior parte das usinas achadas, mas cada passo precisa de fonte e envelhece com a versão do ERP.
Uma escolha "qual é o seu ERP?" na página mostra só o guia certo, mas acrescenta tela a uma página que hoje tem um passo só.
Aceitar XLSX corta o último passo, mas pede biblioteca com licença conferida ([ADR 0010](../../../decisoes/adr-0010-licencas-de-terceiros.md)) e reabre o ponto que o ADR 0022 deixou para depois.

## Teste de falha

A ajuda falha se uma pessoa que a segue não chega a um CSV que a página lê, se um passo cita tela, tabela ou campo sem fonte, se pede mais campos que código e descrição, ou se sugere que o arquivo vai a algum servidor.

## Artefato de fechamento

O ticket fecha com a pesquisa de exportação guardada em `docs/pesquisa/` com as fontes, a ajuda escolhida na página com fonte por passo e o relato de pelo menos uma pessoa de usina que seguiu um guia e gerou o CSV.
