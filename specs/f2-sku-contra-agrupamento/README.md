# F2: SKU contra o agrupamento que a usina já tem

## Próximo agente

Você retoma F2.
A fatia 1 entrou: `ATRIBUTOS_IDENTIDADE` é a única lista de identidade, `LinhaLote` leva `identidade`, e `celulaCsv` está exportado em `src/motor/lote.ts`. O esboço agora só traz o módulo `agrupamento.ts`.
Comece pela [fatia 2](slices/02-agrupamento-no-motor.md): `compararAgrupamento`, `amostrar`, `amostraParaCsv` e `visaoPorTipo` em `src/motor/agrupamento.ts`, sobre os mesmos 59, 133 e 150 SKUs da linha de base.
As fatias 2 e 3 rodam só sobre dado público.
A fatia 4 espera o agrupamento real de uma usina (ticket [`obter-agrupamento-da-usina`](../../docs/wayfinder/partsgraph/tickets/obter-agrupamento-da-usina.md)) e a palavra do Myke para o contato (escolhas D1 e D8 do [mapa](../../docs/wayfinder/partsgraph/map.md)).

- [x] [Fatia 1](slices/01-identidade-em-lista.md): os atributos de identidade viram uma lista só.
- [ ] [Fatia 2](slices/02-agrupamento-no-motor.md): o motor compara um agrupamento e mostra a visão por tipo.
- [ ] [Fatia 3](slices/03-agrupamento-no-diagnostico.md): o `/diagnostico` aceita a coluna do agrupamento da usina.
- [ ] [Fatia 4](slices/04-comparar-com-a-usina.md): uma usina roda no próprio cadastro e julga a amostra.

Antes de terminar a sua passada, atualize esta seção com o que mudou e com o próximo ponto de partida.

## Pergunta

O agrupamento que a usina já tem junta, num mesmo SKU, peças que a chave de identidade separa, numa parte que se pode medir, e uma pessoa da usina confirma que são distinções reais?

## Hipótese

O agrupamento da usina junta chaves de identidade diferentes, como proteção ou folga diferentes.
O diagnóstico aponta esses grupos com a evidência de cada código, e a pessoa da usina confirma que as diferenças são reais.
O valor da AgroParts aparece contra esse agrupamento, e não contra um cadastro sem agrupamento nenhum.

## Linha de base sobre dado público

Medida com o motor de hoje nos 183 itens do CATMAT que resolvem:

| Visão | SKUs |
|---|---:|
| Só a designação básica (SKU por tipo) | 59 |
| Designação básica e proteção | 133 |
| Chave de identidade | 150 |

O SKU por tipo apaga 91 distinções (150 menos 59).
Não existe agrupamento de usina no repositório.

## Fatia mínima

```
1 identidade em lista -> 2 agrupamento no motor -> 3 coluna no diagnóstico -> 4 usina julga a amostra
```

As fatias 1 e 2 são do motor e se provam por teste.
A fatia 3 é a tela, com a prova de rede e as capturas.
A fatia 4 é a medição e é a única que depende de dado de fora.

## Critérios

Os padrões abaixo entram no pré-registro da fatia 4, em commit anterior à leitura do arquivo da usina.
A amostra tem `n = min(20, misturas)` grupos em mistura, sorteados com a semente do pré-registro, e `c` é quantos a pessoa da usina confirma como distinção real.
Os critérios se leem nesta ordem, e o primeiro que vale decide:

1. **INCONCLUSIVE**, se não houve agrupamento real.
2. **NOT VERIFIED**, se `c` é zero, ou se o agrupamento inteiro tem menos de 10 grupos em mistura. Então o agrupamento dela já respeita a identidade, o valor está na cobertura e no tempo, e a mensagem de venda muda. O corte de 10 é a leitura deste spec para o "já respeitam a identidade" do plano: menos de 10 grupos em mistura no agrupamento inteiro é pouco para mudar a venda, e a amostra seria pequena demais para a metade dizer algo.
3. **VERIFIED**, se `c` é pelo menos a metade de `n`, arredondada para cima. Com 20 misturas ou mais, isso dá as 10 de 20 do plano.
4. **INCONCLUSIVE**, no resto: houve confirmações, mas menos que a metade. INCONCLUSIVE não conta como aprovado.

O relatório traz sempre os números absolutos: cadastros lidos, com grupo e sem grupo, grupos com um cadastro só, coerentes, inconclusivos, em mistura, misturas por atributo que difere e confirmados na amostra.

## Dependências

- **Dado de usina.** A autorização da usina para rodar o diagnóstico no próprio cadastro com o agrupamento dela ([`obter-agrupamento-da-usina`](../../docs/wayfinder/partsgraph/tickets/obter-agrupamento-da-usina.md)). O arquivo não sai do navegador dela, e a equipe recebe só as contagens, então F2 não espera a amostra recebida de [`obter-exportacao-real`](../../docs/wayfinder/partsgraph/tickets/obter-exportacao-real.md).
- **Chave da TypeSafe.** Nenhuma.
- **Licença.** Nenhuma nova. As fatias 1 a 3 usam o CATMAT e as compras do Compras.gov.br, já sob o Decreto 8.777/2016.

## ADRs e escopo

- [ADR 0001](../../docs/decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md): a fase só lê o agrupamento da usina, e nenhum grupo é desfeito, renomeado ou fundido.
- [ADR 0006](../../docs/decisoes/adr-0006-guardrails-programaticos-e-revisao-humana.md) e [ADR 0013](../../docs/decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md): a mistura sai de regra sobre atributos. A visão por tipo não é SAME_AS nem INTERCHANGEABLE_FOR.
- [ADR 0014](../../docs/decisoes/adr-0014-benchmarks-separados-e-pre-registrados.md): semente, tamanho da amostra e critérios ficam congelados antes do arquivo da usina.
- [ADR 0016](../../docs/decisoes/adr-0016-fronteira-de-posicionamento.md): o benefício inicial declarável é visibilidade e redução de tempo de análise. F2 mede só as misturas, que são visibilidade. O plano também media o tempo de revisão antes e depois, mas essa é outra hipótese, e o ticket [`medir-utilidade-humana`](../../docs/wayfinder/partsgraph/tickets/medir-utilidade-humana.md) já a mede. Ela sai da fatia mínima para cada fase responder uma pergunta.
- [ADR 0018](../../docs/decisoes/adr-0018-isolamento-estrito-no-piloto.md) e [ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md): a comparação roda no navegador da usina.

- [ADR 0016](../../docs/decisoes/adr-0016-fronteira-de-posicionamento.md) e o mapa rejeitam implementação ampla antes da amostra: as fatias 1 a 3 não ampliam família nem volume, e só preparam a medição da fatia 4.

Nenhuma fatia de F2 bate num ADR aceito.
Um SKU de tipo para compra e estoque, ou um código de SKU próprio que volte ao ERP, já pediria INTERCHANGEABLE_FOR com fonte e estado guardado no inquilino, e isso exigiria um ADR novo ao lado do ADR 0018 e do ADR 0022. A pergunta está no ticket [`definir-sku-de-compra-e-estoque`](../../docs/wayfinder/partsgraph/tickets/definir-sku-de-compra-e-estoque.md).

## Fora

- Código de SKU próprio, com ou sem linhagem.
- Política de SKU com tipo, versão, aprovador e finalidade.
- SKU de tipo para compra e estoque.
- Agrupamento num segundo arquivo, casado por código do ERP.
- O erro inverso: a mesma chave espalhada por vários grupos da usina.
- Outras famílias além do rolamento rígido de esferas (F3).
- Tempo de revisão antes e depois, que fica com o ticket `medir-utilidade-humana`.

## Contratos que ficam

- `ATRIBUTOS_IDENTIDADE`, em `src/motor/especificacao.ts`, é a única lista dos atributos que fazem SAME_AS. Chave, divergências e visão por tipo derivam dela.
- `lote.grupos_duplicidade` é a única via para a identidade. `src/motor/agrupamento.ts` nunca cria SAME_AS.
- O agrupamento da usina, a amostra e as respostas da pessoa ficam com a usina. A equipe recebe só contagens.
