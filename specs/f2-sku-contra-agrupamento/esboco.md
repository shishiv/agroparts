# Esboço de F2: o agrupamento da usina contra a chave de identidade

Sessão de `architect` com arena, porque o modelo de SKU é porta sem volta.
Os blocos `diff` aplicam com `git apply` sobre o `main` de hoje, e cada bloco `ts` que começa com `// <caminho>` é o arquivo inteiro nesse caminho.
O conjunto compila contra o motor de hoje (`tsc` da raiz e de `web/`).
Os corpos são `throw new Error("not implemented")` com pseudocódigo onde a lógica é sutil.

## Problema

A usina já liga cada código de material do ERP a um grupo próprio, o "SKU unificado".
F2 precisa mostrar, com evidência, quais desses grupos juntam chaves de identidade diferentes e em quais atributos, e mostrar a visão por tipo com o que ela junta.
Quatro fatos do código e das decisões dão a forma:

- Hoje a identidade só existe como texto: `chaveIdentidade` monta `designacao_basica|protecao|folga|inox`, e `decidirPar` repete a mesma lista de atributos à mão. Dizer "qual atributo difere" obrigaria a abrir o texto da chave num terceiro lugar.
- `traduzirLote` já devolve `grupos_duplicidade`, que é a visão de identidade. Uma segunda via para a identidade seria duas maneiras de fazer a mesma coisa.
- O arquivo da usina não sai do navegador ([ADR 0022](../../docs/decisoes/adr-0022-diagnostico-no-navegador.md) e escolha D3), então tudo é função pura que a página chama, e nada passa por script nosso.
- O grupo da usina é registro dela e não se reescreve ([ADR 0001](../../docs/decisoes/adr-0001-camada-de-traducao-nao-destrutiva.md)). A decisão continua por regra sobre atributos ([ADR 0006](../../docs/decisoes/adr-0006-guardrails-programaticos-e-revisao-humana.md)), e SIMILAR_TO fica fora dela ([ADR 0013](../../docs/decisoes/adr-0013-modelo-de-entidades-e-relacoes-tipadas.md)).

O desenho não pode fechar a porta do código de SKU opaco com linhagem nem a da política de compra e estoque com INTERCHANGEABLE_FOR, e não constrói nenhuma das duas.

## Uso

A página `/diagnostico` ganha uma coluna opcional, "agrupamento da sua usina", com "nenhuma" como valor inicial.
Ela passa a chamar uma função só, que traduz e compara:

```ts
import { amostrar, amostraParaCsv, compararAgrupamento, visaoPorTipo } from "../src/motor/agrupamento";

function diagnosticar(t: Tabela, codigo: number, descricao: number, grupo: number | null) {
  const entradas = t.linhas
    .map((l) => ({
      original: { origem: "entrada manual" as const, codigo: l[codigo]?.trim() ? l[codigo] : undefined, texto: l[descricao] ?? "" },
      grupo_usina: grupo === null ? undefined : l[grupo],
    }))
    .filter((e) => e.original.texto.trim() !== "");
  const comparacao = compararAgrupamento(entradas); // comparacao.lote é o mesmo lote de hoje
  return { comparacao, porTipo: visaoPorTipo(comparacao.lote), semDescricao: t.linhas.length - entradas.length };
}

// Download da amostra para a pessoa da usina julgar, com a semente do pré-registro de F2:
const csv = amostraParaCsv(amostrar(comparacao, SEMENTE_DO_PREREGISTRO));
```

Os testes medem sobre dado público, sem arquivo de usina:

```ts
const lote = loteCatmat();
visaoPorTipo(lote).skus_por_tipo; // 59
visaoPorTipo(lote, ["folga", "inox"]).skus_por_tipo; // 133
visaoPorTipo(lote).skus_por_identidade; // 150

// Autoconferência: uma "usina" que agrupa pela designação básica mistura exatamente os grupos que a visão por tipo junta.
const comoUsina = compararAgrupamento(lote.linhas.map((l) => ({ original: l.original, grupo_usina: l.identidade?.designacao_basica })));
comoUsina.contagem.mistura === visaoPorTipo(lote).grupos.length;
```

O arquivo de chaves de F4 lê `lote.grupos_duplicidade` e não recebe nada deste módulo, então o SKU de tipo não tem por onde chegar ao ERP.

## Forma

### A identidade vira uma lista tipada, e a chave deriva dela

`ATRIBUTOS_IDENTIDADE` passa a ser a única lista dos atributos que fazem SAME_AS.
O tipo `Identidade`, o texto da chave, as divergências e os atributos que uma visão por tipo junta saem dela.
O texto de `chaveIdentidade` fica igual: no CATMAT de hoje, as 183 chaves e os 28 grupos de duplicidade não mudam.

```diff
--- a/src/motor/especificacao.ts
+++ b/src/motor/especificacao.ts
@@ -205,9 +205,44 @@
   };
 }
 
+/**
+ * Os atributos que definem SAME_AS, nesta ordem. Única lista: o tipo `Identidade`, a chave,
+ * as divergências e os atributos que uma visão por tipo pode juntar derivam dela.
+ */
+export const ATRIBUTOS_IDENTIDADE = ["designacao_basica", "protecao", "folga", "inox"] as const;
+export type AtributoIdentidade = (typeof ATRIBUTOS_IDENTIDADE)[number];
+
+/** A parte da especificação que decide identidade. */
+export type Identidade = Pick<EspecificacaoTecnica, AtributoIdentidade>;
+
+/** Um atributo de identidade com mais de um valor entre itens. `valores` vem sem repetição, na ordem de aparição. */
+export type Divergencia = { [A in AtributoIdentidade]: { atributo: A; valores: Identidade[A][] } }[AtributoIdentidade];
+
 /** Chave de identidade da especificação: os atributos que definem SAME_AS. */
-export function chaveIdentidade(e: Pick<EspecificacaoTecnica, "designacao_basica" | "protecao" | "folga" | "inox">): string {
-  return `${e.designacao_basica}|${e.protecao}|${e.folga}|${e.inox ? "inox" : "aco"}`;
+export function chaveIdentidade(e: Identidade): string {
+  // Mesma string de antes ("6205|blindagem_dupla|CN|aco"): a medição v1 e o CSV não mudam.
+  return ATRIBUTOS_IDENTIDADE.map((a) => (a === "inox" ? (e.inox ? "inox" : "aco") : String(e[a]))).join("|");
+}
+
+/**
+ * Atributos de identidade em que os itens discordam, na ordem de ATRIBUTOS_IDENTIDADE.
+ * Vazio quando todos têm a mesma chave. Serve ao par (decidirPar) e ao grupo (agrupamento.ts).
+ */
+export function divergencias(itens: readonly Identidade[]): Divergencia[] {
+  // TODO para cada atributo a de ATRIBUTOS_IDENTIDADE:
+  //   valores = itens.map(i => i[a]) sem repetição, na ordem de aparição
+  //   se valores.length > 1, empurra { atributo: a, valores }
+  // O mapeamento para a união exige um cast local; é o único do módulo.
+  throw new Error("not implemented");
+}
+
+/**
+ * Frase da divergência, no formato que decidirPar já emite:
+ * "designação básica 6204 x 6205", "proteção: blindagem dupla x vedação dupla",
+ * "folga radial C3 x CN", "material: inoxidável x não declarado inox".
+ */
+export function descreverDivergencia(d: Divergencia): string {
+  throw new Error("not implemented");
 }
 
 export const rotuloProtecao = (p: Protecao) => ROTULO_PROTECAO[p];
```

`decidirPar` passa a usar as mesmas funções, e as quatro comparações escritas à mão saem na mesma mudança.
Os motivos têm de sair iguais, porque `web/linguagem.ts` os traduz para linguagem simples.

```diff
--- a/src/motor/identidade.ts
+++ b/src/motor/identidade.ts
@@ -1,7 +1,7 @@
 // Decisão de SAME_AS entre dois materiais do cadastro.
 // Contradição de atributo reprova o par; concordância só soma evidência.
 // Semelhança de texto aparece como SIMILAR_TO e nunca decide identidade.
-import { rotuloProtecao, type ResultadoEspecificacao } from "./especificacao";
+import { descreverDivergencia, divergencias, rotuloProtecao, type ResultadoEspecificacao } from "./especificacao";
 import type { Decisao, Evidencia, Relacao } from "./tipos";
 
 export function tokens(texto: string): Set<string> {
@@ -42,11 +42,8 @@
     const motivo = !ea ? a.motivos[0] : b.motivos[0];
     return { decisao: "recusa", exata: false, motivos: [`um dos itens não tem especificação: ${motivo}`], semelhanca_texto: semelhanca };
   }
-  const diferencas: string[] = [];
-  if (ea.designacao_basica !== eb.designacao_basica) diferencas.push(`designação básica ${ea.designacao_basica} x ${eb.designacao_basica}`);
-  if (ea.protecao !== eb.protecao) diferencas.push(`proteção: ${rotuloProtecao(ea.protecao)} x ${rotuloProtecao(eb.protecao)}`);
-  if (ea.folga !== eb.folga) diferencas.push(`folga radial ${ea.folga} x ${eb.folga}`);
-  if (ea.inox !== eb.inox) diferencas.push(`material: ${ea.inox ? "inoxidável" : "não declarado inox"} x ${eb.inox ? "inoxidável" : "não declarado inox"}`);
+  // A lista de atributos e as frases saem de especificacao.ts; os motivos ficam iguais aos de hoje.
+  const diferencas = divergencias([ea, eb]).map(descreverDivergencia);
   if (diferencas.length) {
     return { decisao: "recusa", exata: false, motivos: diferencas.map((d) => `atributo diverge: ${d}`), semelhanca_texto: semelhanca };
   }
```

`LinhaLote` passa a levar a identidade com os tipos reais (`Protecao`, `Folga`, `boolean`), e `chave` é derivada dela no mesmo ponto.
O campo `identidade` aparece também no JSON de `/api/lote`.
O mesmo trecho exporta `celulaCsv`, o escape de célula que `loteParaCsv` já usava, para que a amostra de F2 e o arquivo de chaves de F4 não escrevam outro.

```diff
--- a/src/motor/lote.ts
+++ b/src/motor/lote.ts
@@ -2,7 +2,7 @@
 import gabCatmat from "../../dados/gabarito/v1/catmat.json";
 import gabLivre from "../../dados/gabarito/v1/textos-livres.json";
 import { ITENS_ATIVOS, itemCatmat } from "./corpus";
-import { chaveIdentidade, designacaoDaEspecificacao, especificar, VERSAO_REGRAS, type ResultadoEspecificacao } from "./especificacao";
+import { chaveIdentidade, designacaoDaEspecificacao, especificar, VERSAO_REGRAS, type Identidade, type ResultadoEspecificacao } from "./especificacao";
 import { decidirPar } from "./identidade";
 import { resolver } from "./resolucao";
 import type { Decisao, MaterialOriginal, Protecao } from "./tipos";
@@ -13,6 +13,8 @@
   decisao: Decisao;
   designacao: string | null;
   descricao_por_regra: string | null;
+  /** Atributos de identidade, só quando a decisão é resolve. `chave` é derivada deles. */
+  identidade: Identidade | null;
   chave: string | null;
   motivos: string[];
   grupo_duplicidade: number | null;
@@ -44,13 +46,16 @@
   const linhas: LinhaLote[] = entradas.map((original) => {
     const r = especificar(original.texto);
     const e = r.especificacao;
+    const identidade: Identidade | null =
+      e && r.decisao === "resolve" ? { designacao_basica: e.designacao_basica, protecao: e.protecao, folga: e.folga, inox: e.inox } : null;
     return {
       original,
       estrato: estrato(r),
       decisao: r.decisao,
       designacao: e ? designacaoDaEspecificacao(e) : null,
       descricao_por_regra: e?.descricao_por_regra ?? null,
-      chave: e && r.decisao === "resolve" ? chaveIdentidade(e) : null,
+      identidade,
+      chave: identidade ? chaveIdentidade(identidade) : null,
       motivos: r.motivos,
       grupo_duplicidade: null,
     };
@@ -79,13 +84,15 @@
   );
 }
 
+/** Uma célula de CSV entre aspas. Único escape de CSV do motor: a amostra de F2 e o arquivo de chaves de F4 usam este. */
+export const celulaCsv = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
+
 /** Mapa de códigos em CSV: o texto original vai intacto ao lado da tradução. */
 export function loteParaCsv(r: ResultadoLote): string {
-  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
   const cab = ["origem", "codigo", "texto_original", "estrato", "decisao", "designacao_canonica", "descricao_por_regra", "grupo_duplicidade", "motivos", "versao_regras"];
   const linhas = r.linhas.map((l) =>
     [l.original.origem, l.original.codigo, l.original.texto, l.estrato, l.decisao, l.designacao, l.descricao_por_regra, l.grupo_duplicidade, l.motivos.join(" | "), r.versao_regras]
-      .map(esc)
+      .map(celulaCsv)
       .join(","),
   );
   return [cab.join(","), ...linhas].join("\n") + "\n";
```

### O módulo novo

```ts
// src/motor/agrupamento.ts
// F2: o agrupamento que a usina já tem, comparado com a chave de identidade, e a visão por tipo.
// Funções puras. Nada aqui guarda estado, emite código de SKU ou cria relação:
// um grupo da usina que mistura chaves é evidência para uma pessoa, e a visão por tipo nunca é SAME_AS.
import { ATRIBUTOS_IDENTIDADE, type AtributoIdentidade, type Divergencia, type Identidade } from "./especificacao";
import { traduzirLote, type LinhaLote, type ResultadoLote } from "./lote";
import type { MaterialOriginal } from "./tipos";

type DuasOuMais<T> = [T, T, ...T[]];
type UmaOuMais<T> = [T, ...T[]];

/** Uma chave de identidade presente num grupo, com as linhas que a provam. */
export interface ChaveNoGrupo {
  chave: string;
  identidade: Identidade;
  /** Designação canônica, para a tela. */
  designacao: string;
  linhas: LinhaLote[];
}

// ---------- (1) O agrupamento da usina ----------

/** Um material como veio do cadastro, com o id do grupo que a usina deu a ele na mesma linha do arquivo. */
export interface EntradaAgrupada {
  original: MaterialOriginal;
  /** Id opaco do grupo na usina ("SKU unificado"). Copiado como veio (ADR 0001). Ausente ou em branco = sem grupo. */
  grupo_usina?: string;
}

/**
 * Um grupo da usina com dois ou mais cadastros, examinado por regra, nunca por semelhança:
 *   mistura:      duas ou mais chaves resolvidas diferentes, e `divergencias` diz quais atributos diferem;
 *   coerente:     todas as linhas resolveram e têm a mesma chave;
 *   inconclusivo: alguma linha não resolveu e as resolvidas não bastam para afirmar mistura.
 */
export type GrupoDaUsina =
  | { situacao: "mistura"; id: string; chaves: DuasOuMais<ChaveNoGrupo>; divergencias: UmaOuMais<Divergencia>; sem_chave: LinhaLote[] }
  | { situacao: "coerente"; id: string; chaves: [ChaveNoGrupo]; divergencias: []; sem_chave: [] }
  | { situacao: "inconclusivo"; id: string; chaves: [] | [ChaveNoGrupo]; divergencias: []; sem_chave: UmaOuMais<LinhaLote> };

export type SituacaoGrupo = GrupoDaUsina["situacao"];
export type GrupoEmMistura = Extract<GrupoDaUsina, { situacao: "mistura" }>;

export interface ComparacaoAgrupamento {
  /** O mesmo lote que `traduzirLote(entradas.map(e => e.original))` devolveria: a página não traduz duas vezes. */
  lote: ResultadoLote;
  /** Grupos com dois ou mais cadastros: mistura primeiro, depois inconclusivo, depois coerente; empate por id. */
  grupos: GrupoDaUsina[];
  /** Números absolutos (ADR 0014), derivados de `grupos` e das entradas na construção. */
  contagem: Record<SituacaoGrupo, number> & { grupos_unitarios: number; cadastros_com_grupo: number; cadastros_sem_grupo: number };
}

/**
 * Traduz as entradas e examina cada grupo da usina contra a chave de identidade do motor.
 * O grupo vem da mesma linha do material, então não há junção por código do ERP.
 * Não decide SAME_AS nem desfaz o grupo: diz onde o grupo junta chaves diferentes e por quê.
 * Sem nenhum `grupo_usina`, devolve o lote e `grupos` vazio: um só caminho para a página.
 */
export function compararAgrupamento(entradas: readonly EntradaAgrupada[]): ComparacaoAgrupamento {
  // TODO lote = traduzirLote(entradas.map(e => e.original))
  //   invariante: lote.linhas[i] corresponde a entradas[i] (traduzirLote preserva ordem e tamanho; um teste trava isso)
  //   porGrupo = Map<id, LinhaLote[]>, id = grupo_usina?.trim(); vazio = sem grupo
  //   grupos com 1 cadastro -> contagem.grupos_unitarios
  //   para os outros: resolvidas = linhas com identidade; sem_chave = as demais
  //     chaves = agruparPorChave(resolvidas)
  //     chaves.length >= 2  -> mistura, divergencias(chaves.map(c => c.identidade))
  //     sem_chave.length    -> inconclusivo
  //     senão               -> coerente
  throw new Error("not implemented");
}

/**
 * Amostra pré-registrada dos grupos em mistura que a pessoa da usina vai julgar.
 * Determinística: depende só da semente e dos ids, não da ordem do arquivo.
 * A semente fica no pré-registro, em commit anterior à leitura do arquivo da usina. Com menos misturas que `n`, devolve todas.
 */
export function amostrar(c: ComparacaoAgrupamento, semente: string, n = 20): GrupoEmMistura[] {
  // TODO ordenar as misturas por fnv1a(semente + "\u0000" + id) e pegar n.
  // Hash síncrono e puro: crypto.subtle é assíncrono, e o sorteio não é segredo.
  throw new Error("not implemented");
}

/**
 * CSV para a pessoa da usina julgar a amostra: uma linha por cadastro dos grupos sorteados, com o id do grupo da usina,
 * a chave, a designação, os atributos que diferem, o texto original intacto e a coluna `distincao_real` em branco.
 * Sai do navegador só como download, com o escape `celulaCsv` de lote.ts. A equipe recebe de volta só as contagens.
 */
export function amostraParaCsv(amostra: readonly GrupoEmMistura[]): string {
  throw new Error("not implemented");
}

// ---------- (2) A visão por tipo ----------

/** Atributos que uma visão por tipo pode juntar. A designação básica define o tipo e nunca se junta. */
export type AtributoJuntavel = Exclude<AtributoIdentidade, "designacao_basica">;

/** Juntar todos os atributos juntáveis: o tipo é só a designação básica. */
export const JUNTA_TUDO_MENOS_A_BASICA = ATRIBUTOS_IDENTIDADE.filter(
  (a): a is AtributoJuntavel => a !== "designacao_basica",
) as UmaOuMais<AtributoJuntavel>;

/**
 * Um grupo da visão por tipo que junta duas ou mais chaves de identidade.
 * Não é SAME_AS nem INTERCHANGEABLE_FOR (ADR 0013) e não tem código: `rotulo` é texto de tela, e nada o devolve ao ERP.
 */
export interface GrupoPorTipo {
  rotulo: string;
  chaves: DuasOuMais<ChaveNoGrupo>;
  /** Os atributos que este grupo juntou de fato, sempre contidos em `VisaoPorTipo.junta`. */
  divergencias: UmaOuMais<Divergencia>;
}

export interface VisaoPorTipo {
  /** O que a visão declara juntar. Não vazio: uma visão que não junta nada seria a identidade, que já é `lote.grupos_duplicidade`. */
  junta: UmaOuMais<AtributoJuntavel>;
  /** Linhas resolvidas consideradas (183 no CATMAT de hoje). */
  itens: number;
  skus_por_tipo: number;
  skus_por_identidade: number;
  /** Só os grupos que juntam chaves. `skus_por_identidade - skus_por_tipo` distinções somem nesta visão. */
  grupos: GrupoPorTipo[];
}

/**
 * Agrupa as linhas resolvidas por todos os atributos de identidade menos os de `junta`.
 * CATMAT de hoje: junta tudo -> 59 SKUs; junta folga e inox -> 133; a identidade dá 150.
 */
export function visaoPorTipo(lote: ResultadoLote, junta: UmaOuMais<AtributoJuntavel> = JUNTA_TUDO_MENOS_A_BASICA): VisaoPorTipo {
  // TODO mantidos = ATRIBUTOS_IDENTIDADE sem os de junta
  //   chaveDoTipo(i) = mantidos.map(a => String(i[a])).join("|"), interna, nunca sai do módulo
  //   porTipo = Map<chaveDoTipo, LinhaLote[]> sobre as linhas com identidade
  //   grupos = entradas com agruparPorChave(...).length >= 2
  throw new Error("not implemented");
}

/** Interna às duas visões: linhas resolvidas -> uma ChaveNoGrupo por chave, na ordem de aparição. */
function agruparPorChave(linhas: readonly LinhaLote[]): ChaveNoGrupo[] {
  throw new Error("not implemented");
}
```

### O que os tipos garantem

- `GrupoDaUsina` é uma união discriminada. Uma `mistura` tem duas chaves ou mais e pelo menos uma divergência, um grupo `coerente` tem uma chave e nenhuma linha pendente, e um `inconclusivo` tem pelo menos uma linha sem chave. A tela não confere tamanho de lista.
- Só linha em resolve tem chave. Uma linha em revisa ou recusa nunca sustenta uma mistura sozinha, pela assimetria do ADR 0006.
- `junta` não pode ser vazio nem conter a designação básica. A visão por tipo nunca vira uma segunda via para a identidade, que continua em `grupos_duplicidade`.
- Nenhum tipo público tem código de SKU. O id do grupo da usina é texto opaco copiado como veio, e `GrupoPorTipo.rotulo` é texto de tela.
- O dado segue por três arquivos: `especificacao.ts` (o que é identidade), `lote.ts` (cada linha) e `agrupamento.ts` (os grupos).

### Por que a política de SKU não vira tipo agora

Em F2 vira tipo só a parte da política que tem quem a use: os atributos que uma visão junta (`junta`).
Versão, aprovador, finalidade e família ficam sem tipo, porque nada em F2 os lê: não há estado de inquilino guardado, não há emissão ao ERP e não há fonte licenciada de intercâmbio.
Uma finalidade "compra e estoque" sem o tipo das condições de INTERCHANGEABLE_FOR, que o mapa ainda lista como não especificado, seria um valor que o código não sabe cumprir.
A política futura entra sem mudar nada do que existe:

- `PoliticaSku = { familia, junta: readonly AtributoJuntavel[], versao, aprovada_por, finalidade }`. Com `junta` vazio, o SKU é de identidade. Com `junta` não vazio, é de tipo. A natureza é derivada de `junta`, nunca guardada.
- A regra de compra e estoque vira `validarPolitica(politica, intercambios)`, que lê `junta` e as `Relacao` do tipo INTERCHANGEABLE_FOR que `tipos.ts` já tem.
- O código opaco com linhagem começa no id do grupo da usina, que já é opaco. Um grupo em `mistura` já tem a forma de uma divisão proposta: origem no id, destinos nas chaves. Como nenhum tipo de F2 expõe código derivado de atributos, nenhum pedido no ERP passa a depender de um.

## Decisão de síntese

Dois runners desenharam sem ver um ao outro, um no Opus 5.5 e outro no Sonnet 5.5.
A arena não teve juiz cruzado, porque os dois assentos do pool são da família Claude, a mesma do orquestrador, e a skill manda escolher a base sozinho nesse caso.

Os dois convergiram no que é porta sem volta:

- uma lista única de atributos de identidade, com a chave derivada e o mesmo texto de hoje;
- um módulo novo de funções puras, sem estado e sem relação;
- a política de SKU sem tipo agora, com o campo dos atributos juntados como o único pedaço tipado;
- nenhum código de SKU em F2, e o id da usina como texto opaco;
- três situações por grupo, com listas não vazias nos tipos.

A base é o candidato 1, porque os tipos dele são mais justos:

- `Identidade` usa os tipos reais do motor, e não um registro de textos;
- `divergencias` serve ao par e ao grupo, e tira a lista escrita à mão de `decidirPar`;
- `junta` proíbe juntar a designação básica no compilador, sem lançar erro em tempo de execução;
- a amostra e o CSV de revisão rodam no navegador, com semente pré-registrada.

Do candidato 2 vieram dois enxertos:

- A junção pela posição na entrada (`EntradaAgrupada` e `compararAgrupamento` devolvendo o `lote`). O grupo vem na mesma linha do material, então a comparação não depende de casar código do ERP, que pode repetir, faltar ou vir com zeros à esquerda.
- A contagem à parte dos grupos com um cadastro só, para que eles não inflem os grupos coerentes.

Ficaram de fora do candidato 2:

- o script que lê o CSV da usina com o `bun`, porque o arquivo sairia do navegador (escolha D3);
- o `definirTipo` com marca e erro em tempo de execução, porque o tipo de `junta` dá a mesma garantia no compilador;
- o chute automático da coluna de agrupamento, porque um chute errado produziria um relatório de misturas falso.

Do candidato 1 ficou de fora o `lerAgrupamento` com junção por código e marca de tipo, que só se paga quando o agrupamento vier num segundo arquivo.

## Tradeoffs aceitos

- Aceitamos mexer em `especificacao.ts`, `identidade.ts` e `lote.ts` em troca de uma só definição de identidade, lida por três módulos.
- Aceitamos que `LinhaLote` leve `identidade` e `chave` ao mesmo tempo, em troca de não quebrar quem lê `chave` (o CSV, a API e o F1).
- Aceitamos que um grupo com linha pendente fique `inconclusivo`, em troca de nunca afirmar mistura a partir de leitura duvidosa. A contagem de misturas pode ficar abaixo do real, e o relatório mostra os inconclusivos.
- Aceitamos a junção só pela linha do mesmo arquivo, em troca de não tratar código de ERP agora. Um agrupamento num segundo arquivo pede um leitor que case códigos, e esse leitor espera a resposta da usina.
- Aceitamos não olhar o erro inverso, a mesma chave espalhada por vários grupos da usina, em troca de medir só a hipótese de F2.
- Aceitamos um cast local em `divergencias`, para a união mapeada, em troca de tipos que a tela usa sem conferir.

## Alternativas consideradas

- **Política de SKU como tipo central agora**, com `aplicarPolitica(lote, politica)` devolvendo SKUs com código. Perdeu porque expõe campos sem consumidor, convida a preencher a finalidade de compra sem INTERCHANGEABLE_FOR e precisaria inventar um código por SKU, que ou deriva dos atributos (a porta que o plano quer fechada) ou pede estado guardado (contra a D3).
- **Comparação de partições opacas**, com uma tabela de contingência e um índice de concordância. A interface é menor, mas perde "quais atributos diferem", que é a evidência que a pessoa da usina julga, e puxa para um número único, que o [ADR 0014](../../docs/decisoes/adr-0014-benchmarks-separados-e-pre-registrados.md) proíbe.
- **O grupo da usina dentro de `MaterialOriginal`**, com a comparação dentro de `traduzirLote`. Perdeu porque `MaterialOriginal` é o registro do material, gravado em `DecisaoHumana`, e porque `POST /api/lote` passaria a aceitar agrupamento de usina num servidor.
- **Comparar por pares com `decidirPar` dentro de cada grupo.** Perdeu porque devolve motivos por par em vez dos atributos que diferem no grupo, e custa um número de pares que cresce com o quadrado do grupo.

## Perguntas abertas e riscos

- O agrupamento da usina vem como coluna do mesmo arquivo ou num arquivo separado, e é plano ou tem subníveis? Ticket [`obter-agrupamento-da-usina`](../../docs/wayfinder/partsgraph/tickets/obter-agrupamento-da-usina.md).
- `inox: false` quer dizer "não declarado inox", e não aço comum confirmado. Um grupo da usina que junta `W6205` e `6205` vira mistura por material. O pré-registro manda a pessoa julgar cada caso e o relatório separar as misturas por atributo.
- `chaveRotulo`, em `medir()`, monta a chave do gabarito v1 à mão. Migrar para a lista só vale se a medição v1 sair idêntica.
- O erro inverso (duplicidade que o agrupamento da usina perdeu) é barato nesta forma, mas fica fora da hipótese. Ele entra só se a usina pedir.

## Próximo passo

Implementar `ATRIBUTOS_IDENTIDADE`, `divergencias` e `descreverDivergencia`, migrar `decidirPar` e acrescentar `identidade` a `LinhaLote`, com `bun run test` verde e `bun run medir` sem diferença em `docs/medicao/gabarito-v1.md` ([fatia 1](slices/01-identidade-em-lista.md)).
