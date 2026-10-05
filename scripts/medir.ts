// Mede o motor contra o gabarito v1 e o lote do CATMAT e grava docs/medicao/gabarito-v1.md.
// Uso: bun run medir
import { mkdir, writeFile } from "node:fs/promises";
import { FONTE_CATMAT } from "../src/motor/corpus";
import { loteCatmat, medir, type MedicaoTraducao } from "../src/motor/lote";

const pct = (n: number, d: number) => (d ? `${n}/${d} (${((100 * n) / d).toFixed(1).replace(".", ",")}%)` : `${n}/${d} (não se aplica)`);
const m = medir();
const inicio = performance.now();
const lote = loteCatmat();
const msLote = Math.round(performance.now() - inicio);

function traducao(linhas: MedicaoTraducao[]): string {
  const cab = "| Estrato | Itens | Elegíveis | Resolve | Revisa | Recusa | Precisão automática | Cobertura automática |\n|---|---:|---:|---:|---:|---:|---:|---:|";
  return [
    cab,
    ...linhas.map(
      (l) =>
        `| ${l.estrato} | ${l.total} | ${l.elegiveis} | ${l.resolvidos} | ${l.revisados} | ${l.recusados} | ${pct(l.resolvidos_corretos, l.resolvidos)} | ${pct(l.resolvidos - l.resolvidos_nao_elegiveis, l.elegiveis)} |`,
    ),
  ].join("\n");
}

const md = `# Medição do gabarito v1

Este arquivo é gerado por \`bun run medir\`. Não edite à mão.

- Regras: ${m.versao_regras}.
- Gabarito: [\`dados/gabarito/v1/\`](../../dados/gabarito/v1/), pré-registrado no commit que precede o motor.
- Corpus: CATMAT PDM 11797, consulta de ${FONTE_CATMAT.consultado_em.slice(0, 10)}.
- Precisão automática = resolvidos corretos / resolvidos. Cobertura automática = elegíveis resolvidos / elegíveis.
- Não existe acurácia geral única. As linhas de soma só somam contagens.

## Tradução de itens do CATMAT para a forma canônica

${traducao(m.traducao_catmat)}

## Tradução de texto livre de fornecedores

Textos do campo \`marca\` de linhas de compra pública, como o fornecedor os digitou.

${traducao(m.traducao_texto_livre)}

## Identidade entre códigos (SAME_AS)

| Estrato | Pares | Verdadeiros | Falsos | Indeterminados | Precisão | Recall | Falsos recusados |
|---|---:|---:|---:|---:|---:|---:|---:|
${m.identidade
  .map((l) => `| ${l.estrato} | ${l.pares} | ${l.verdadeiros} | ${l.falsos} | ${l.indeterminados} | ${pct(l.verdadeiros_resolvidos, l.resolvidos)} | ${pct(l.verdadeiros_resolvidos, l.verdadeiros)} | ${pct(l.falsos_recusados, l.falsos)} |`)
  .join("\n")}

Indeterminado: um dos dois itens não é elegível no gabarito. O par fica fora de precisão e recall.

## Referência cruzada

- Referências cruzadas recuperadas com fonte: ${pct(m.referencia_cruzada.com_fonte, m.referencia_cruzada.total)}.
- Intercâmbio resolvido automaticamente: ${m.referencia_cruzada.intercambio_resolvido_automaticamente} (o contrato exige 0).
- Só o item CATMAT 624270 publica referências de duas marcas nesta família. Com n = 1, o número não sustenta taxa.

## Erros contra o gabarito

${m.erros.length ? m.erros.map((e) => `- ${e.conjunto}, ${e.item}: esperado ${e.esperado}, obtido ${e.obtido}.`).join("\n") : "Nenhum erro na v1."}

## Lote do cadastro inteiro (sem gabarito)

Itens ativos do PDM 11797: ${lote.linhas.length}. Grupos de duplicidade resolvidos: ${lote.grupos_duplicidade.length}. Tempo do lote nesta máquina: ${msLote} ms.

| Estrato | Total | Resolve | Revisa | Recusa |
|---|---:|---:|---:|---:|
${Object.entries(lote.por_estrato)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([e, c]) => `| ${e} | ${c.total} | ${pct(c.resolve, c.total)} | ${pct(c.revisa, c.total)} | ${pct(c.recusa, c.total)} |`)
  .join("\n")}

Estas contagens não medem precisão: só o gabarito tem rótulo.

## Limites

- A elegibilidade usa as mesmas fontes de regra que o motor. Os 100% medem se o motor aplica as regras sem errar nos textos reais; não medem se as regras acertam a peça física.
- Na primeira execução em desenvolvimento, o motor errou 6 pares de identidade: um defeito lia "6206-2Z" sem o sufixo. O defeito foi corrigido; rótulos e limiares da v1 não mudaram.
- O rotulador do gabarito é a mesma origem que escreveu o motor (worker agent). A equipe ainda precisa revisar os rótulos.
- O gabarito é pequeno (42 itens do CATMAT, 31 textos livres, 140 pares). A nota de evidência não está calibrada.
- Os dados são públicos e não substituem a amostra autorizada de cadastro de cliente que o roadmap exige em P0.
- A tabela dimensional aberta (DIN 625-1 da BOLTS) cobre só 6000 a 6007, 6200 a 6206 e 6300 a 6305; fora disso, diâmetro externo e largura não são conferidos.
`;

await mkdir(new URL("../docs/medicao/", import.meta.url), { recursive: true });
await writeFile(new URL("../docs/medicao/gabarito-v1.md", import.meta.url), md);
console.log(md);
