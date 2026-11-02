# Esboço de F7: o consumo por equipamento e a plaquinha

Esboço direto de `architect`, sem arena: a fase vem depois do piloto, e o formato das ordens só se conhece com elas.
Cada bloco `ts` que começa com `// <caminho>` é um arquivo novo inteiro, e o conjunto compila contra o motor de hoje.

## Problema

A plaquinha só vale se a página que ela abre mostrar algo que o ERP não mostra rápido: o consumo da máquina com os códigos da mesma peça somados.
Três fatos dão a forma:

- O consumo vem das ordens da usina, que são dado do inquilino ([ADR 0018](../../docs/decisoes/adr-0018-isolamento-estrito-no-piloto.md)), e o site da AgroParts só serve dado aberto ([ADR 0021](../../docs/decisoes/adr-0021-pilha-do-prototipo-publico.md)).
- O alerta fica no ERP da usina (escolha D5), então a página só lê.
- Consumo não é aplicabilidade ([ADR 0013](../../docs/decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md)).

## Uso

```ts
const consumo = consumoPorEquipamento(baixas, cadastro); // os dois arquivos, lidos no navegador da usina
baixar("consumo-por-equipamento.html", paginaDaUsina(consumo));
baixar("plaquinhas.html", folhaDeQr("https://intranet.usina/consumo.html", consumo.equipamentos.map((e) => e.equipamento)));
```

## Forma

A soma por chave de identidade fica no motor.

```ts
// src/motor/consumo.ts
// F7: o consumo de peças por equipamento, traduzido para a chave de identidade. Só leitura.
// Consumo não é aplicabilidade: uma peça baixada numa ordem de um equipamento não vira COMPATIBLE_WITH (ADR 0013).
import { traduzirLote } from "./lote";
import type { MaterialOriginal } from "./tipos";

/** Uma baixa de material numa ordem de manutenção, como veio da exportação do ERP ou do CMMS da usina, já lida na borda. */
export interface BaixaDeMaterial {
  /** Id opaco do equipamento na usina, copiado como veio. */
  equipamento: string;
  /** Data da baixa no formato AAAA-MM-DD. */
  data: string;
  codigo_material: string;
  quantidade: number;
  ordem?: string;
}

interface Uso {
  /** Data da baixa mais recente. */
  ultima_troca: string;
  baixas: number;
  quantidade: number;
}

/**
 * Uma peça consumida no equipamento.
 *   identidade: o cadastro resolve, e os códigos da mesma chave somam juntos;
 *   codigo:     o cadastro não resolve ou não traz o código, e a peça fica pelo código, com o motivo.
 */
export type PecaConsumida =
  | ({ tipo: "identidade"; chave: string; designacao: string; codigos: string[] } & Uso)
  | ({ tipo: "codigo"; codigo: string; texto: string | null; motivo: string } & Uso);

export interface ConsumoDoEquipamento {
  equipamento: string;
  /** Da troca mais recente para a mais antiga. */
  pecas: PecaConsumida[];
}

export interface Consumo {
  versao_regras: string;
  equipamentos: ConsumoDoEquipamento[];
  /** Baixas cujo código não está no cadastro exportado. Contagem, não conteúdo. */
  baixas_sem_cadastro: number;
}

/**
 * Junta as baixas ao cadastro pelo código do material, que vem do mesmo ERP nos dois arquivos,
 * traduz o cadastro com `traduzirLote` e soma o uso por chave de identidade em cada equipamento.
 * Não calcula próxima troca nem alerta: isso fica no ERP da usina (escolha D5).
 */
export function consumoPorEquipamento(baixas: readonly BaixaDeMaterial[], cadastro: readonly MaterialOriginal[]): Consumo {
  // TODO lote = traduzirLote([...cadastro]); porCodigo = Map<codigo, LinhaLote>
  //   por baixa: linha = porCodigo.get(codigo_material); sem linha -> baixas_sem_cadastro++
  //   linha.chave -> PecaConsumida identidade, somando os códigos da mesma chave; senão -> PecaConsumida codigo
  //   ultima_troca = maior data; ordenar as peças por ultima_troca decrescente
  throw new Error("not implemented");
}
```

A página autônoma e a folha de QR ficam em `web/`.

```ts
// web/plaquinha.ts
// F7: a página só de leitura que a usina hospeda, e a folha de QR para colar nos equipamentos.
// A página é um arquivo HTML autônomo, com o consumo dentro dele. Ela não faz pedido de rede e não guarda histórico.
import type { Consumo } from "../src/motor/consumo";

/** O endereço que o QR de um equipamento abre: a página que a usina hospeda, com o equipamento no fragmento. */
export function urlDoEquipamento(base: string, equipamento: string): string {
  return `${base}#${encodeURIComponent(equipamento)}`;
}

/** Um arquivo HTML só, com o consumo de todos os equipamentos e a busca pelo fragmento da URL. */
export function paginaDaUsina(consumo: Consumo): string {
  // TODO montar o HTML com estilo embutido e o JSON do consumo; ler location.hash e mostrar o equipamento
  //   cada peça mostra a designação, os códigos, a última troca e quantas baixas, sob o título "consumido neste equipamento"
  throw new Error("not implemented");
}

/** A folha de QR para imprimir: um QR por equipamento, com o id escrito embaixo. A usina imprime e cola (ADR 0009). */
export function folhaDeQr(base: string, equipamentos: readonly string[]): string {
  // TODO gerar o QR de urlDoEquipamento(base, e) com uma biblioteca de licença conferida (ADR 0010)
  throw new Error("not implemented");
}
```

### O que os tipos garantem

- `PecaConsumida` separa a peça somada por chave da peça que ficou pelo código, e a segunda sempre traz o motivo.
- Nenhum tipo daqui carrega `COMPATIBLE_WITH` nem data de próxima troca.
- A página recebe o `Consumo` pronto e não lê arquivo, então ela não tem como guardar histórico.

## Tradeoffs aceitos

- Aceitamos uma página autônoma que a usina hospeda, em troca de não pôr ordens de usina no site da AgroParts.
- Aceitamos que a página desatualize até a usina gerar de novo, em troca de não ter servidor nem sincronização.

## Alternativas consideradas

- **Hospedar o consumo no site da AgroParts, com login.** Perdeu agora porque pede autenticação, inquilino e retenção, e um ADR que substitua o 0021.
- **Gravar o histórico na própria etiqueta NFC.** Perdeu porque a etiqueta guarda só uma URL, e o histórico já mora no ERP.

## Perguntas abertas e riscos

- De que sistema saem as ordens, e a baixa chega ao equipamento? Ticket [`obter-ordens-de-manutencao-do-piloto`](../../docs/wayfinder/partsgraph/tickets/obter-ordens-de-manutencao-do-piloto.md).
- A usina consegue hospedar a página, e o celular do mecânico a alcança? Ticket [`hospedar-visao-por-equipamento`](../../docs/wayfinder/partsgraph/tickets/hospedar-visao-por-equipamento.md).
- A plaquinha de metal pede etiqueta NFC própria para metal? Fica para quando a usina pedir NFC (escolha D6).

## Próximo passo

Com as ordens do piloto em mãos, implementar `consumoPorEquipamento` com testes sobre ordens sintéticas marcadas como sintéticas ([fatia 1](slices/01-consumo-por-equipamento.md)).
