// Mede a régua contra o benchmark de família de F3 e grava docs/medicao/familia-v1.md.
// Uso: bun scripts/medir-familia.ts
import { writeFile } from "node:fs/promises";
import { carregarBenchmarkFamilia, type Reproducao } from "./benchmark-familia";
import { medirFamilia, regua, type MedicaoFamilia } from "./familia";

const b = await carregarBenchmarkFamilia();
const linhas = await medirFamilia(b.casos, regua(b.arvore), b.pre);

const virgula = (x: number) => x.toFixed(1).replace(".", ",");
const pct = (n: number, d: number) => (d ? `${n}/${d} (${virgula((100 * n) / d)}%)` : `${n}/${d} (não se aplica)`);

/** Limite superior unilateral de 95% de Clopper-Pearson para a taxa de erro, com `erros` em `n`. */
function limiteSuperior(erros: number, n: number): number {
  if (!n || erros >= n) return 1;
  const acumulada = (p: number) => {
    let soma = 0;
    let log = n * Math.log1p(-p);
    for (let i = 0; i <= erros; i++) {
      soma += Math.exp(log);
      log += Math.log(n - i) - Math.log(i + 1) + Math.log(p) - Math.log1p(-p);
    }
    return soma;
  };
  let [baixo, alto] = [0, 1];
  for (let i = 0; i < 60; i++) {
    const meio = (baixo + alto) / 2;
    if (acumulada(meio) > 0.05) baixo = meio;
    else alto = meio;
  }
  return alto;
}

const nomeDoGrupo = new Map(b.arvore.grupos.map((g) => [String(g.codigo), g.nome]));
const vazia = (estrato: string): MedicaoFamilia => ({ classificador: "regua", versao: "1", estrato, casos: 0, na_faixa: 0, corretos_na_faixa: 0, nenhum: 0, mudou_com_a_ordem: 0 });
const porEstrato = b.grupos.map(String).map((e) => linhas.find((l) => l.estrato === e) ?? vazia(e));
const rotulo = (e: string) => `${e} ${nomeDoGrupo.get(e) ?? "(sem PDM ativo)"}`;
const abaixoDoMinimo = porEstrato.filter((l) => l.casos < b.pre.minimo_por_estrato);
const { erro_maximo, margem_sobre_a_regua: margem, minimo_por_estrato } = b.pre;

const motivoDaReproducao: Record<Reproducao, string | null> = {
  reproduzido: null,
  nao_conferido: "o benchmark ainda não foi conferido por uma segunda execução de `bun run dados`",
  nao_bate: "uma nova execução de `bun run dados` deu outro sha256, ou um arquivo do benchmark foi editado à mão",
};
const motivos = [
  "o Jev não foi medido: a fatia 2 espera o ticket [`conferir-termos-e-chave-da-typesafe`](../wayfinder/partsgraph/tickets/conferir-termos-e-chave-da-typesafe.md)",
  abaixoDoMinimo.length && `${abaixoDoMinimo.length} de ${porEstrato.length} estratos têm menos que ${minimo_por_estrato} casos: ${abaixoDoMinimo.map((l) => `${l.estrato} (${l.casos})`).join(", ")}`,
  motivoDaReproducao[b.reproducao],
].filter(Boolean);

function aVencer(l: MedicaoFamilia): string {
  const cobertura = l.casos ? l.na_faixa / l.casos : 0;
  if (!l.na_faixa) return "a régua não respondeu na faixa; o pré-registro não fixa a margem neste caso";
  const erro = (l.na_faixa - l.corretos_na_faixa) / l.na_faixa;
  const teto = (x: number) => `${virgula(100 * Math.min(erro_maximo, x))}%`;
  return erro >= margem
    ? `erro na faixa até ${teto(erro - margem)}, com cobertura de pelo menos ${virgula(100 * cobertura)}%`
    : `erro na faixa até ${teto(erro)}, com cobertura de pelo menos ${virgula(100 * Math.min(1, cobertura + margem))}%`;
}

const e = b.exclusoes;
const conferencias = (f: { conferencias: { bate: boolean }[] }) =>
  `${f.conferencias.filter((c) => c.bate).length} que bateram e ${f.conferencias.filter((c) => !c.bate).length} que não bateram`;
const pdms = b.arvore.grupos.flatMap((g) => g.classes.flatMap((c) => c.pdms));

const md = `# Medição de família v1

Este arquivo é gerado por \`bun scripts/medir-familia.ts\`. Não edite à mão.

- Pré-registro: [\`dados/preregistro/f3-familia.json\`](../../dados/preregistro/f3-familia.json), versão ${b.pre.versao}, em commit anterior ao benchmark e a este relatório.
- Árvore: ${b.arvore.versao}.
- Toda porcentagem vem com o número absoluto. Não existe acurácia única.

## Veredito de F3

**INCONCLUSIVE**.

${motivos.map((m) => `- ${m}.`).join("\n")}
${b.reproducao === "reproduzido" ? "\nO benchmark se reproduz por hash: cada nova execução de `bun run dados` deu o mesmo sha256 nos dois arquivos.\n" : ""}
As tabelas abaixo medem só a régua. Elas dão o número que o Jev precisa vencer em cada estrato.

## Benchmark

| Etapa | Contagem |
|---|---:|
| Grupos, classes e PDMs ativos na árvore | ${b.arvore.grupos.length}, ${b.arvore.grupos.reduce((s, g) => s + g.classes.length, 0)} e ${pdms.length} |
| Linhas de compra lidas na janela | ${b.linhas_lidas} |
| Textos distintos gravados (PDM, campo marca) | ${b.textos_gravados} |
| Linhas fora: codigoPdm diferente do consultado | ${e.linhas_com_pdm_diferente} |
| Pares (texto normalizado, PDM) | ${b.pares} |
| Pares fora: sem token | ${e.sem_token} |
| Pares fora: só nome de marca | ${e.so_nome_de_marca} |
| Pares fora: rótulo ambíguo | ${e.rotulo_ambiguo} |
| Pares fora: acima do limite por PDM | ${e.acima_do_limite_por_pdm} |
| Casos | ${b.casos.length}, de ${new Set(b.casos.map((c) => c.rotulo.pdm)).size} PDMs |

- Árvore: sha256 \`${b.fontes.arvore.sha256}\`, consulta de ${b.fontes.arvore.consultado_em.slice(0, 10)}, conferências: ${conferencias(b.fontes.arvore)}.
- Compras: sha256 \`${b.fontes.compras.sha256}\`, consulta de ${b.fontes.compras.consultado_em.slice(0, 10)}, conferências: ${conferencias(b.fontes.compras)}.

## Régua por grupo do CATMAT

Régua versão 1, limiar ${b.pre.limiar_por_classificador.regua}: na faixa só quando todas as palavras do nome do PDM estão no texto.

| Grupo | Casos | Na faixa (cobertura) | Corretos na faixa | Erro na faixa | Limite superior de 95% do erro | Nenhum | Mudou com a ordem |
|---|---:|---:|---:|---:|---:|---:|---:|
${porEstrato
  .map((l) => {
    const erros = l.na_faixa - l.corretos_na_faixa;
    const limite = l.na_faixa ? `${virgula(100 * limiteSuperior(erros, l.na_faixa))}%` : "não se aplica";
    return `| ${rotulo(l.estrato)} | ${l.casos} | ${pct(l.na_faixa, l.casos)} | ${pct(l.corretos_na_faixa, l.na_faixa)} | ${pct(erros, l.na_faixa)} | ${limite} | ${pct(l.nenhum, l.casos)} | ${pct(l.mudou_com_a_ordem, l.casos)} |`;
  })
  .join("\n")}

## O que o Jev precisa fazer em cada grupo

Pela regra do pré-registro: erro máximo de ${virgula(100 * erro_maximo)}% pelo limite superior de 95%, margem de ${virgula(100 * margem)} pontos sobre a régua, pelo menos ${minimo_por_estrato} casos por estrato e no máximo ${virgula(100 * b.limite_mudou_com_a_ordem)}% dos casos mudando com a ordem das opções.

| Grupo | Casos suficientes | Para vencer a régua |
|---|---|---|
${porEstrato.map((l) => `| ${rotulo(l.estrato)} | ${l.casos >= minimo_por_estrato ? "sim" : `não, ${l.casos} de ${minimo_por_estrato}`} | ${aVencer(l)} |`).join("\n")}

## Limites

- O rótulo é o PDM do item em que o fornecedor cotou. Ele não vem do motor, mas o fornecedor pode ter digitado no campo marca algo que não descreve a peça cotada.
- A regra "só nome de marca" usa o vocabulário dos nomes de PDM da árvore. Ela tira textos sem dígito cujas palavras de peça são sinônimos fora desse vocabulário, que são casos em que o Jev poderia vencer a régua.
- O dígito da regra "só nome de marca" é lido no texto normalizado, onde números de um algarismo somem, como as outras palavras de uma letra.
- O limite de ${b.limite_por_pdm} casos por PDM dá o mesmo peso a um PDM com muitas compras e a um com poucas.
- O campo marca parece cortado em 20 caracteres na origem ([fontes](../pesquisa/fontes-do-prototipo.md)), e um texto cortado pode perder a palavra que diz a peça.
- A régua, as regras e este relatório foram escritos pela mesma origem (worker agent). A equipe ainda precisa revisar o pré-registro.
- Antes do registro, uma sondagem viu as contagens de PDMs por grupo e 10 linhas de compra de 5 PDMs, como o pré-registro declara.
`;

await writeFile(new URL("../docs/medicao/familia-v1.md", import.meta.url), md);
console.log(md);
