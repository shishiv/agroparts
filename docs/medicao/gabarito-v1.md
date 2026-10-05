# Medição do gabarito v1

Este arquivo é gerado por `bun run medir`. Não edite à mão.

- Regras: regras-v1 (gabarito v1, 2026-10-05).
- Gabarito: [`dados/gabarito/v1/`](../../dados/gabarito/v1/), pré-registrado no commit que precede o motor.
- Corpus: CATMAT PDM 11797, consulta de 2026-10-05.
- Precisão automática = resolvidos corretos / resolvidos. Cobertura automática = elegíveis resolvidos / elegíveis.
- Não existe acurácia geral única. As linhas de soma só somam contagens.

## Tradução de itens do CATMAT para a forma canônica

| Estrato | Itens | Elegíveis | Resolve | Revisa | Recusa | Precisão automática | Cobertura automática |
|---|---:|---:|---:|---:|---:|---:|---:|
| série 60 | 8 | 7 | 7 | 1 | 0 | 7/7 (100,0%) | 7/7 (100,0%) |
| série 62 | 17 | 14 | 14 | 2 | 1 | 14/14 (100,0%) | 14/14 (100,0%) |
| série 63 | 17 | 15 | 15 | 1 | 1 | 15/15 (100,0%) | 15/15 (100,0%) |

## Tradução de texto livre de fornecedores

Textos do campo `marca` de linhas de compra pública, como o fornecedor os digitou.

| Estrato | Itens | Elegíveis | Resolve | Revisa | Recusa | Precisão automática | Cobertura automática |
|---|---:|---:|---:|---:|---:|---:|---:|
| série 60 | 2 | 2 | 2 | 0 | 0 | 2/2 (100,0%) | 2/2 (100,0%) |
| série 62 | 17 | 16 | 16 | 1 | 0 | 16/16 (100,0%) | 16/16 (100,0%) |
| série 63 | 12 | 11 | 11 | 0 | 1 | 11/11 (100,0%) | 11/11 (100,0%) |

## Identidade entre códigos (SAME_AS)

| Estrato | Pares | Verdadeiros | Falsos | Indeterminados | Precisão | Recall | Falsos recusados |
|---|---:|---:|---:|---:|---:|---:|---:|
| série 60 | 12 | 0 | 9 | 3 | 0/0 (não se aplica) | 0/0 (não se aplica) | 9/9 (100,0%) |
| série 62 | 64 | 7 | 39 | 18 | 7/7 (100,0%) | 7/7 (100,0%) | 39/39 (100,0%) |
| série 63 | 64 | 7 | 42 | 15 | 7/7 (100,0%) | 7/7 (100,0%) | 42/42 (100,0%) |

Indeterminado: um dos dois itens não é elegível no gabarito. O par fica fora de precisão e recall.

## Referência cruzada

- Referências cruzadas recuperadas com fonte: 1/1 (100,0%).
- Intercâmbio resolvido automaticamente: 0 (o contrato exige 0).
- Só o item CATMAT 624270 publica referências de duas marcas nesta família. Com n = 1, o número não sustenta taxa.

## Erros contra o gabarito

Nenhum erro na v1.

## Lote do cadastro inteiro (sem gabarito)

Itens ativos do PDM 11797: 396. Grupos de duplicidade resolvidos: 28. Tempo do lote nesta máquina: 6 ms.

| Estrato | Total | Resolve | Revisa | Recusa |
|---|---:|---:|---:|---:|
| fora da família | 60 | 0/60 (0,0%) | 0/60 (0,0%) | 60/60 (100,0%) |
| sem designação da família | 121 | 0/121 (0,0%) | 56/121 (46,3%) | 65/121 (53,7%) |
| série 60 | 48 | 41/48 (85,4%) | 3/48 (6,3%) | 4/48 (8,3%) |
| série 62 | 89 | 72/89 (80,9%) | 11/89 (12,4%) | 6/89 (6,7%) |
| série 63 | 78 | 70/78 (89,7%) | 4/78 (5,1%) | 4/78 (5,1%) |

Estas contagens não medem precisão: só o gabarito tem rótulo.

## Limites

- A elegibilidade usa as mesmas fontes de regra que o motor. Os 100% medem se o motor aplica as regras sem errar nos textos reais; não medem se as regras acertam a peça física.
- Na primeira execução em desenvolvimento, o motor errou 6 pares de identidade: um defeito lia "6206-2Z" sem o sufixo. O defeito foi corrigido; rótulos e limiares da v1 não mudaram.
- O rotulador do gabarito é a mesma origem que escreveu o motor (worker agent). A equipe ainda precisa revisar os rótulos.
- O gabarito é pequeno (42 itens do CATMAT, 31 textos livres, 140 pares). A nota de evidência não está calibrada.
- Os dados são públicos e não substituem a amostra autorizada de cadastro de cliente que o roadmap exige em P0.
- A tabela dimensional aberta (DIN 625-1 da BOLTS) cobre só 6000 a 6007, 6200 a 6206 e 6300 a 6305; fora disso, diâmetro externo e largura não são conferidos.
