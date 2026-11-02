// Confere que cada esboco.md de specs/ compila contra o motor de hoje.
// Para cada esboço: copia o repositório para uma pasta temporária, aplica os blocos ```diff com `git apply`,
// grava cada bloco ```ts cuja primeira linha é `// <caminho>` nesse caminho e roda o tsc da raiz e o de web/.
// Blocos ```ts sem esse cabeçalho são ilustração e ficam de fora. Cada esboço é conferido contra o HEAD,
// depois dos esboços que ele declara numa linha `<!-- depende: <pasta-do-spec> -->`.
// Uso, na raiz do repositório: bun specs/checar-esbocos.ts .
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const raiz = resolve(process.argv[2]);
const tsc = join(raiz, "node_modules/.bin/tsc");
const esbocos = readdirSync(join(raiz, "specs"))
  .map((d) => join(raiz, "specs", d, "esboco.md"))
  .filter((p) => existsSync(p));

let falhas = 0;
for (const esboco of esbocos) {
  const tc = mkdtempSync(join(tmpdir(), "esboco-"));
  for (const p of ["src", "dados", "web", "scripts", "functions", "tests", "tsconfig.json", "vite.config.ts", "package.json"]) {
    cpSync(join(raiz, p), join(tc, p), { recursive: true });
  }
  symlinkSync(join(raiz, "node_modules"), join(tc, "node_modules"));
  spawnSync("git", ["init", "-q"], { cwd: tc });
  const md = readFileSync(esboco, "utf8");
  const deps = [...md.matchAll(/<!-- depende: ([\w-]+) -->/g)].map((m) => readFileSync(join(raiz, "specs", m[1], "esboco.md"), "utf8"));
  const blocos = [...deps, md].flatMap((t) => [...t.matchAll(/```(diff|ts)\n([\s\S]*?)```/g)]);
  let aplicados = 0;
  for (const [, tipo, corpo] of blocos) {
    if (tipo === "diff") {
      const r = spawnSync("git", ["apply", "-"], { cwd: tc, input: corpo, encoding: "utf8" });
      if (r.status !== 0) throw new Error(`${esboco}: diff não aplica: ${r.stderr}`);
      aplicados++;
    } else {
      const cab = /^\/\/ ([\w./-]+\.ts)\n/.exec(corpo);
      if (!cab) continue;
      mkdirSync(dirname(join(tc, cab[1])), { recursive: true });
      writeFileSync(join(tc, cab[1]), corpo);
      aplicados++;
    }
  }
  const saidas = ["tsconfig.json", "web/tsconfig.json"].map((p) => spawnSync(tsc, ["--noEmit", "-p", join(tc, p)], { encoding: "utf8" }));
  const ok = saidas.every((s) => s.status === 0);
  if (!ok) falhas++;
  console.log(`${ok ? "OK    " : "FALHOU"} ${esboco.slice(raiz.length + 1)} (${aplicados} blocos aplicados)`);
  for (const s of saidas) if (s.status !== 0) console.log(s.stdout);
  rmSync(tc, { recursive: true, force: true });
}
console.log(`${esbocos.length} esboços, ${falhas} com erro de tipo`);
process.exit(falhas ? 1 : 0);
