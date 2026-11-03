// Gera o arquivo de teste do diagnóstico: os itens ativos do CATMAT mais os textos distintos
// de fornecedor (campo marca das compras), em CSV com ponto e vírgula.
// A coluna agrupamento_teste é SINTÉTICA: não vem de nenhuma usina. Ela repete a primeira designação
// 6[023]xx do texto (ou fica vazia), só para exercitar a tela do agrupamento. Não prova nada sobre usina.
// Uso: bun scripts/arquivo-diagnostico.ts <saida.csv>
import { ITENS_ATIVOS, LINHAS_COMPRA } from "../src/motor/corpus";

const saida = process.argv[2];
if (!saida) throw new Error("uso: bun scripts/arquivo-diagnostico.ts <saida.csv>");
const aspas = (v: string) => `"${v.replace(/"/g, '""')}"`;
const fornecedores = [...new Set(LINHAS_COMPRA.map((l) => l.marca?.trim()).filter((m): m is string => !!m))];
const agrupamentoTeste = (texto: string) => texto.match(/6[023]\d\d/)?.[0] ?? "";
const linhas = [
  ...ITENS_ATIVOS.map((i) => [String(i.codigoItem), i.descricaoItem]),
  ...fornecedores.map((texto, i) => [`FORN-${String(i + 1).padStart(3, "0")}`, texto]),
].map(([c, d]) => [c, d, agrupamentoTeste(d)]);
await Bun.write(saida, ["codigo;descricao;agrupamento_teste", ...linhas.map(([c, d, g]) => `${aspas(c)};${aspas(d)};${aspas(g)}`)].join("\n") + "\n");
console.log(`${ITENS_ATIVOS.length} itens do CATMAT e ${fornecedores.length} textos de fornecedor em ${saida}`);
