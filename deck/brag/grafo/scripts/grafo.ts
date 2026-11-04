// Gera assets/grafo.js: os 42 cadastros do gabarito v1, as 104 comparações e onde cada ponto fica na tela.
// Uso, da raiz do repositório: bun deck/brag/grafo/scripts/grafo.ts
import { writeFile } from "node:fs/promises";
import gab from "../../../../dados/gabarito/v1/catmat.json";
import { itemCatmat } from "../../../../src/motor/corpus";
import { especificar } from "../../../../src/motor/especificacao";
import { decidirPar } from "../../../../src/motor/identidade";

type Rotulo = { codigoItem: number; elegivel: boolean; designacao_basica?: string; protecao?: string; folga?: string; inox?: boolean };

const rotulos = gab.rotulos as Rotulo[];
const chave = (r: Rotulo) => (r.elegivel ? `${r.designacao_basica}|${r.protecao}|${r.folga}|${r.inox}` : `fora|${r.codigoItem}`);
// O defeito da primeira rodada, descrito em docs/medicao/gabarito-v1.md: "6206-2Z" lido sem o sufixo.
const comDefeito = (t: string) => t.replace(/(6[023]\d\d)\s*-\s*2Z\b/g, "$1");

const itens = rotulos.map((r) => {
  const texto = itemCatmat(r.codigoItem)!.descricaoItem;
  return { r, texto, grupo: (/6[023]\d\d/.exec(texto) ?? [""])[0] };
});
const grupos = [...new Set(itens.map((i) => i.grupo))];

const comparacoes: { a: number; b: number; mesma: boolean; errouNaPrimeira: boolean }[] = [];
for (const g of grupos) {
  const its = itens.filter((i) => i.grupo === g && i.r.elegivel);
  for (let i = 0; i < its.length; i++)
    for (let j = i + 1; j < its.length; j++) {
      const [a, b] = [its[i], its[j]];
      const mesma = chave(a.r) === chave(b.r);
      const agora = decidirPar(especificar(a.texto), especificar(b.texto)).decisao === "resolve";
      const antes = decidirPar(especificar(comDefeito(a.texto)), especificar(comDefeito(b.texto))).decisao === "resolve";
      if (agora !== mesma) throw new Error(`o motor de hoje erra ${a.r.codigoItem} x ${b.r.codigoItem}`);
      comparacoes.push({ a: a.r.codigoItem, b: b.r.codigoItem, mesma, errouNaPrimeira: antes !== mesma });
    }
}

// Mapa: um círculo por designação, em duas fileiras de três, num quadro de 1600 x 760.
const ordem = [...grupos].sort((x, y) => x.localeCompare(y));
const pontos = ordem.flatMap((g, k) => {
  const cx = 270 + (k % 3) * 530;
  const cy = 200 + Math.floor(k / 3) * 380;
  const its = itens.filter((i) => i.grupo === g).sort((x, y) => chave(x.r).localeCompare(chave(y.r)));
  const raio = 70 + 11 * its.length;
  const pos = its.map((it, i) => {
    const ang = -Math.PI / 2 + (2 * Math.PI * i) / its.length;
    return { it, x: cx + raio * Math.cos(ang), y: cy + raio * Math.sin(ang) };
  });
  return pos.map(({ it, x, y }) => {
    const iguais = pos.filter((p) => chave(p.it.r) === chave(it.r));
    return {
      codigo: it.r.codigoItem,
      grupo: g,
      elegivel: it.r.elegivel,
      x: Math.round(x),
      y: Math.round(y),
      jx: Math.round(iguais.reduce((s, p) => s + p.x, 0) / iguais.length),
      jy: Math.round(iguais.reduce((s, p) => s + p.y, 0) / iguais.length),
      peca: chave(it.r),
    };
  });
});

const total = { cadastros: pontos.length, comparacoes: comparacoes.length, mesma: comparacoes.filter((c) => c.mesma).length, errosNaPrimeira: comparacoes.filter((c) => c.errouNaPrimeira).length };
if (total.cadastros !== 42 || total.comparacoes !== 104 || total.mesma !== 14 || total.errosNaPrimeira !== 6) throw new Error(`os números não batem com o pitch: ${JSON.stringify(total)}`);
const centros = ordem.map((g, k) => ({ grupo: g, x: 270 + (k % 3) * 530, y: 200 + Math.floor(k / 3) * 380 }));

await writeFile(
  new URL("../assets/grafo.js", import.meta.url),
  `// Gerado por scripts/grafo.ts a partir de dados/gabarito/v1/catmat.json. Não edite à mão.\nwindow.GRAFO = ${JSON.stringify({ total, centros, pontos, comparacoes })};\n`,
);
console.log(total);
