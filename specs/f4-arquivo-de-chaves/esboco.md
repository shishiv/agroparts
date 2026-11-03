# Esboço de F4: o arquivo de chaves que volta ao ERP

Esboço direto de `architect`, sem arena: o arquivo é uma projeção do lote que já existe, e trocar as colunas não tem custo antes de uma usina carregar.
A [fatia 1](slices/01-arquivo-generico.md) já entrou no código. `src/motor/chaves.ts` saiu deste esboço e usa o `celulaCsv` que `src/motor/lote.ts` exporta (fatia 1 de [F2](../f2-sku-contra-agrupamento/README.md)). O código é a fonte dos tipos, e o bloco de uso abaixo é a ilustração que `web/diagnostico.ts` seguiu.

## Problema

O `/diagnostico` já devolve o mapa de códigos em CSV, uma linha por item, com 10 colunas.
Esse arquivo serve à análise, mas a equipe do ERP precisa de outra coisa: só os grupos de mesma peça, um código por linha, com a chave e a evidência.
O SAP é um ERP entre vários, então o primeiro arquivo é genérico, e um formato próprio só vem depois de ver o modelo de carga de uma usina.

## Uso

```ts
import { arquivoDeChaves, chavesParaCsv } from "../src/motor/chaves";

const arquivo = arquivoDeChaves(lote); // o mesmo lote que a página já mostra
if (arquivo.linhas.length) baixar("chaves-agroparts-cadastro.csv", chavesParaCsv(arquivo));
// arquivo.sem_codigo vai para a tela como contagem.
```

## Forma

`src/motor/chaves.ts` exporta `LinhaChave`, `ArquivoDeChaves`, `arquivoDeChaves(lote)` e `chavesParaCsv(arquivo)`. Uma `LinhaChave` tem grupo, código, texto original, `relacao` (só `SAME_AS`), chave, designação, descrição por regra, evidências, motivos e versão das regras. Um `ArquivoDeChaves` tem as linhas, o número de grupos e `sem_codigo`.

O que o código decidiu além do esboço:

- As colunas do CSV seguem a ordem dos campos de `LinhaChave`: `grupo`, `codigo`, `texto_original`, `relacao`, `chave`, `designacao`, `descricao_por_regra`, `evidencias`, `motivos`, `versao_regras`. O arquivo baixado se chama `chaves-agroparts-<nome do CSV escolhido>.csv`.
- A chave, a designação, a descrição por regra e os motivos vêm da `LinhaLote`. Só as evidências vêm de `especificar` sobre o texto original, porque o lote não as guarda.
- As evidências vão como `fonte (url)` e os motivos como texto, uns e outros separados por ` | `, como a coluna de motivos do mapa de códigos.
- A ordem é o grupo, depois o código comparado como texto, sem regra de localidade. Códigos numéricos saem como "10", "11", "9", e o arquivo é o mesmo em qualquer navegador.
- O botão só aparece quando `linhas` tem pelo menos uma linha. Um grupo cujos cadastros vieram todos sem código não gera botão, e a contagem de `sem_codigo` fica na tela.
- O botão fica na linha dos downloads do resultado, ao lado do "Baixar CSV de resultado", e não na seção do agrupamento. O arquivo depende só de `grupos_duplicidade`, então vale também quando a pessoa não escolheu a coluna do agrupamento.

### O que os tipos garantem

- `relacao` só pode ser `SAME_AS`. Uma visão por tipo, uma referência cruzada ou um intercâmbio não entram no arquivo.
- `arquivoDeChaves` recebe o lote, e não grupos soltos, então só `grupos_duplicidade` alimenta o arquivo.
- Não há campo de ação, fusão ou apagamento.

## Tradeoffs aceitos

- Aceitamos rodar `especificar` de novo nos itens dos grupos, em troca de não pôr as evidências em cada linha do lote e na resposta de `/api/lote`.
- Aceitamos deixar fora do arquivo os cadastros sem código, em troca de cada linha poder ser achada no ERP.
- Aceitamos um CSV genérico, em troca de não otimizar para um ERP antes de ver o fluxo de uma usina.

## Alternativas consideradas

- **Acrescentar colunas ao CSV de hoje.** Perdeu porque o CSV de hoje é o mesmo de `/api/lote?formato=csv` ([ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md)), e quem integra pela API passaria a receber colunas de outro público.
- **Sugerir o código preferido e os candidatos a bloqueio.** Perdeu porque sem dado de uso (pedidos, saldo, data) qualquer escolha seria uma regra inventada. O modelo de carga da usina diz que coluna de decisão ela precisa.

## Perguntas abertas e riscos

- Que modelo de carga a equipe do ERP usa, e ele aceita mapeamento sem fusão? Ticket [`obter-modelo-de-carga-do-erp`](../../docs/wayfinder/partsgraph/tickets/obter-modelo-de-carga-do-erp.md).
- O arquivo fica como a entrega ao ERP, ou a entrega passa a ser por API? Ticket [`decidir-devolucao-por-arquivo-ou-api`](../../docs/wayfinder/partsgraph/tickets/decidir-devolucao-por-arquivo-ou-api.md).

## Próximo passo

A [fatia 2](slices/02-carga-fora-da-producao.md): a equipe do ERP da usina carrega o arquivo fora da produção. Ela espera o modelo de carga de uma usina e um ambiente fora da produção.
