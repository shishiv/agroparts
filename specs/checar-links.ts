// Confere que todo link interno de Markdown aponta para um arquivo que existe.
// Uso, na raiz do repositório: bun specs/checar-links.ts . [pasta ou arquivo relativos à raiz...]
// Sem pastas, confere README.md, docs/ e specs/. Sai com 1 se algum link quebrar.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const raiz = resolve(process.argv[2]);
const alvos = process.argv.slice(3).length ? process.argv.slice(3) : ["README.md", "docs", "specs"];

function arquivosMd(p: string): string[] {
  if (!existsSync(p)) return [];
  if (statSync(p).isFile()) return p.endsWith(".md") ? [p] : [];
  return readdirSync(p).flatMap((n) => arquivosMd(join(p, n)));
}

const arquivos = alvos.flatMap((a) => arquivosMd(join(raiz, a)));
const quebrados: string[] = [];
let links = 0;
for (const arq of arquivos) {
  const texto = readFileSync(arq, "utf8").replace(/```[\s\S]*?```/g, "");
  for (const m of texto.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const alvo = m[1];
    if (/^(https?:|mailto:|#)/.test(alvo)) continue;
    links++;
    const caminho = resolve(dirname(arq), decodeURI(alvo.split("#")[0]));
    if (!existsSync(caminho)) quebrados.push(`${relative(raiz, arq)} -> ${alvo}`);
  }
}
console.log(`${arquivos.length} arquivos, ${links} links internos, ${quebrados.length} quebrados`);
for (const q of quebrados) console.log(`QUEBRADO ${q}`);
process.exit(quebrados.length ? 1 : 0);
