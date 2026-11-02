# Esboço de F3: o Jev classifica a família

Esboço direto de `architect`, sem arena: a decisão se desfaz sem custo, porque nada daqui entra no site nem no ERP.
Cada bloco `ts` que começa com `// <caminho>` é um arquivo novo inteiro, e o conjunto compila contra o motor de hoje.

## Problema

O motor cobre uma família só, e fora dela a resposta é recusa.
F3 pergunta se o Jev amplia a cobertura escolhendo a família de um texto de fornecedor, sem gerar texto.
Três fatos dão a forma:

- A chave da TypeSafe não pode ir ao navegador nem ao repositório, e o Jev só lê dado público até um contrato (escolha D4). O braço do Jev fica em `scripts/`.
- O texto do item do CATMAT começa pelo nome do PDM e vaza o rótulo. O benchmark usa o campo `marca` das compras, que o fornecedor digitou, rotulado pelo PDM do item cotado.
- O Jev pende para a primeira opção. A medição roda cada caso nas duas ordens.

## Uso

```ts
// O teste da régua, sem chave:
const medicao = await medirFamilia(casos, regua(arvore), pre);

// A medição do Jev, com chave, só sobre o benchmark público:
await medirFamilia(casos, classificadorJev({ chave, arvore, cache: "dados/local/cache-jev" }), pre);

// Não compila: texto de cliente não é TextoPublico.
classificadorJev(opcoes).classificar(linhaDoCadastro.texto, "direta");
```

## Forma

O tipo comum, a régua e a medição ficam em `scripts/`, porque só a medição usa.

```ts
// scripts/familia.ts
// F3: classificar a família (grupo, classe e PDM do CATMAT) de um texto de fornecedor, e medir o classificador.
// Fica em scripts/ porque só a medição usa. Entra em src/motor/ só quando o site ou a API precisarem.
// A família é visibilidade e cobertura. Ela não decide identidade nem relação (ADR 0006 e ADR 0013).

/** Árvore pública do CATMAT nos grupos do benchmark. O PDM é a folha. */
export interface ArvoreCatmat {
  versao: string;
  grupos: { codigo: number; nome: string; classes: { codigo: number; nome: string; pdms: { codigo: number; nome: string }[] }[] }[];
}

export type Nivel = "grupo" | "classe" | "pdm";

/** "nenhum" é resposta válida em qualquer nível, e `ate` guarda o caminho escolhido antes dele. */
export type ClassificacaoFamilia =
  | { tipo: "pdm"; grupo: number; classe: number; pdm: number; confianca: number }
  | { tipo: "nenhum"; nivel: Nivel; ate: { grupo?: number; classe?: number }; confianca: number };

/** A régua não depende da ordem das opções. O Jev depende, e a medição roda as duas ordens. */
export type OrdemDasOpcoes = "direta" | "inversa";

declare const publico: unique symbol;

/**
 * Texto de dado público, já lido do benchmark. Só `carregarBenchmarkFamilia` cria este tipo.
 * O classificador do Jev só aceita `TextoPublico`: cadastro de cliente não chega à TypeSafe (escolha D4, ADR 0018).
 */
export type TextoPublico = string & { readonly [publico]: true };

export interface ClassificadorFamilia<T extends string = string> {
  /** Nome e versão fixa, gravados em cada linha da medição. O Jev vai fixado por versão, nunca por alias. */
  nome: string;
  versao: string;
  classificar(texto: T, ordem: OrdemDasOpcoes): Promise<ClassificacaoFamilia>;
}

/** Um caso do benchmark: o texto que o fornecedor digitou, rotulado pelo PDM do item em que ele cotou. */
export interface CasoFamilia {
  id: string;
  texto: TextoPublico;
  rotulo: { grupo: number; classe: number; pdm: number };
}

/** O que o pré-registro congela antes de qualquer medição. */
export interface PreregistroFamilia {
  versao: string;
  /**
   * Confiança mínima de cada classificador, pelo `nome`, para a resposta entrar na faixa medida.
   * A régua e o Jev dão confiança em escalas diferentes, então cada um tem o seu limiar.
   * O relatório compara o erro com a cobertura da faixa ao lado, e o Jev não vence com uma faixa mais estreita que a da régua.
   */
  limiar_por_classificador: Record<string, number>;
  /** Erro máximo na faixa, por estrato, e a margem que o Jev precisa abrir sobre a régua. */
  erro_maximo: number;
  margem_sobre_a_regua: number;
  /** Estratos com menos casos que isto dão INCONCLUSIVE. */
  minimo_por_estrato: number;
}

/** Uma linha por classificador e por grupo do CATMAT. Números absolutos (ADR 0014). */
export interface MedicaoFamilia {
  classificador: string;
  versao: string;
  estrato: string;
  casos: number;
  na_faixa: number;
  corretos_na_faixa: number;
  nenhum: number;
  /** Casos em que a ordem inversa das opções mudou a resposta. Zero para a régua. */
  mudou_com_a_ordem: number;
}

/**
 * A régua em código: compara as palavras do texto com o nome de cada PDM e escolhe o de maior cobertura.
 * Sem nenhuma palavra em comum com um PDM, responde "nenhum" no nível PDM. É o número que o Jev precisa vencer.
 */
export function regua(arvore: ArvoreCatmat): ClassificadorFamilia {
  // TODO tokens(texto) de identidade.ts; para cada PDM, confianca = palavras do nome do PDM presentes no texto / palavras do nome.
  //   empate: menor código de PDM, para a resposta ser determinística.
  throw new Error("not implemented");
}

/** Mede um classificador contra o benchmark, por grupo. Roda cada caso nas duas ordens e compara as respostas. */
export async function medirFamilia<T extends string>(
  casos: readonly (CasoFamilia & { texto: T })[],
  classificador: ClassificadorFamilia<T>,
  pre: PreregistroFamilia,
): Promise<MedicaoFamilia[]> {
  // TODO por caso: a = classificar(texto, "direta"); b = classificar(texto, "inversa")
  //   na_faixa quando a.tipo === "pdm" e a.confianca >= pre.limiar_por_classificador[classificador.nome]; correto quando a.pdm === rotulo.pdm
  //   mudou_com_a_ordem quando a e b diferem em tipo ou em pdm
  throw new Error("not implemented");
}
```

O braço do Jev fica em `scripts/`, longe do site.

```ts
// scripts/jev/familia.ts
// O braço do Jev em F3. Fica em scripts/ e nunca entra no site: precisa de chave e fala com a TypeSafe.
import type { ArvoreCatmat, ClassificadorFamilia, TextoPublico } from "../familia";

/** Versão fixa. O alias `jev-latest` muda sozinho e quebraria a comparação com o pré-registro. */
export const MODELO_JEV = "jev-1.14.0";

export interface OpcoesJev {
  /** Lida do ambiente pelo script. Nunca vai ao repositório nem ao log. */
  chave: string;
  arvore: ArvoreCatmat;
  /** Pasta do cache, uma resposta JSON por pedido. Fica em `dados/local/`, ignorada pelo git, até o ticket dos termos decidir. */
  cache: string;
}

/**
 * Choice em árvore: grupo, depois classe, depois PDM, com "nenhum" em cada nível.
 * O Jev só escolhe entre opções fechadas. Ele não gera texto, e a confiança dele não decide relação (ADR 0006).
 */
export function classificadorJev(opcoes: OpcoesJev): ClassificadorFamilia<TextoPublico> {
  // TODO por nível: opções = filhos do nó escolhido + "nenhum", na ordem pedida (direta ou inversa)
  //   chave do cache = sha256(modelo + nível + texto + opções na ordem); com acerto no cache, não chama a API
  //   "nenhum" num nível encerra a descida com { tipo: "nenhum", nivel, ate }
  //   confianca final = a menor confiança entre os níveis descidos
  //   custo: somar os tokens de entrada de cada pedido e gravar no relatório
  throw new Error("not implemented");
}
```

O script de medição é o único ponto que cria `TextoPublico`.

```ts
// scripts/medir-familia.ts
// Mede a régua e, quando houver chave, o Jev contra o benchmark de família. Grava docs/medicao/familia-v1.md.
// Uso: bun scripts/medir-familia.ts            (só a régua)
//      TYPESAFE_API_KEY=... bun scripts/medir-familia.ts --jev
import { medirFamilia, regua, type ArvoreCatmat, type CasoFamilia, type PreregistroFamilia, type TextoPublico } from "./familia";
import { classificadorJev } from "./jev/familia";

/** O único ponto que cria `TextoPublico`: os casos vêm de dados/publico/, nunca de arquivo de cliente. */
async function carregarBenchmarkFamilia(): Promise<{ arvore: ArvoreCatmat; casos: CasoFamilia[]; pre: PreregistroFamilia }> {
  // TODO ler dados/preregistro/f3-familia.json, dados/publico/catmat-arvore-manutencao.json e dados/publico/compras-familia.json
  //   texto = campo marca da linha de compra; rótulo = PDM do item cotado; aplicar a regra de exclusão do pré-registro
  //   casos.map(c => ({ ...c, texto: c.texto as TextoPublico }))
  throw new Error("not implemented");
}

const { arvore, casos, pre } = await carregarBenchmarkFamilia();
const linhas = [...(await medirFamilia(casos, regua(arvore), pre))];
const chave = process.env.TYPESAFE_API_KEY;
if (process.argv.includes("--jev")) {
  if (!chave) throw new Error("--jev precisa de TYPESAFE_API_KEY");
  linhas.push(...(await medirFamilia(casos, classificadorJev({ chave, arvore, cache: "dados/local/cache-jev" }), pre)));
}
// TODO gravar docs/medicao/familia-v1.md: uma tabela por estrato, com números absolutos e o veredito pela regra do pré-registro
console.log(linhas.length);
```

### O que os tipos garantem

- `ClassificacaoFamilia` não deixa um PDM sem grupo e classe, e "nenhum" guarda o nível em que parou.
- Cada classificador tem o seu limiar, porque a confiança da régua e a do Jev estão em escalas diferentes. O relatório mostra a cobertura da faixa ao lado do erro.
- `classificadorJev` só aceita `TextoPublico`, então passar um texto do cadastro de uma usina não compila.
- Nenhum tipo daqui carrega `Relacao` ou `Decisao`: a família não resolve SAME_AS.

## Tradeoffs aceitos

- Aceitamos tudo em `scripts/`, em troca de não pôr no motor código que o site não usa. Se a régua um dia servir ao diagnóstico, ela muda para `src/motor/` nesse dia.
- Aceitamos o cache fora do git até o ticket dos termos decidir, em troca de não publicar resposta do Jev sem saber se pode.
- Aceitamos medir só o braço de árvore, em troca de responder uma pergunta por fase.

## Alternativas consideradas

- **O Jev como mais uma regra dentro de `especificar`.** Perdeu porque traria rede e chave para o motor, que roda no navegador, e misturaria família com identidade.
- **Um limiar só para os dois classificadores.** Perdeu porque, com escalas diferentes, o Jev poderia errar menos só por responder numa faixa mais estreita.
- **Classificar direto entre todos os PDMs, numa escolha só.** Perdeu porque a lista de opções fica longa demais e o padrão de classificação em árvore, com "nenhum" por nível, corta pela confiança de cada nível.

## Perguntas abertas e riscos

- Os termos da TypeSafe deixam guardar e publicar as respostas? Ticket [`conferir-termos-e-chave-da-typesafe`](../../docs/wayfinder/partsgraph/tickets/conferir-termos-e-chave-da-typesafe.md).
- O campo `marca` de outras classes traz muita linha que é só o nome da marca. A regra de exclusão vai no pré-registro, e um estrato pequeno dá INCONCLUSIVE.

## Próximo passo

Gravar o pré-registro de F3 e o benchmark público, e só então implementar `regua` e `medirFamilia` ([fatia 1](slices/01-benchmark-e-regua.md)).
