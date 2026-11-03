import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { amostraParaCsv, amostrar, compararAgrupamento, fnv1a32, visaoPorTipo, type EntradaAgrupada } from "../src/motor/agrupamento";
import { loteCatmat, traduzirLote } from "../src/motor/lote";

const entrada = (texto: string, grupo_usina?: string): EntradaAgrupada => ({ original: { origem: "entrada manual", texto }, grupo_usina });

/** Leitor de CSV de teste: células entre aspas, `""` como aspa literal. */
function lerCsv(csv: string): string[][] {
  const linhas: string[][] = [];
  let linha: string[] = [];
  let celula = "";
  let aspas = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (aspas) {
      if (c === '"' && csv[i + 1] === '"') (celula += '"'), i++;
      else if (c === '"') aspas = false;
      else celula += c;
    } else if (c === '"') aspas = true;
    else if (c === ",") (linha.push(celula), (celula = ""));
    else if (c === "\n") (linha.push(celula), linhas.push(linha), (linha = []), (celula = ""));
    else celula += c;
  }
  return linhas;
}

const MISTURA = ["ROLAMENTO 6004-2Z", "6004 ZZ", "ROL 6004 2RS", "FILTRO DE OLEO MOTOR"];

describe("visão por tipo", () => {
  test("o CATMAT dá 59 SKUs por tipo, 133 juntando só folga e material e 150 por identidade", () => {
    const lote = loteCatmat();
    expect(visaoPorTipo(lote).skus_por_tipo).toBe(59);
    expect(visaoPorTipo(lote).skus_por_identidade).toBe(150);
    expect(visaoPorTipo(lote).itens).toBe(183);
    expect(visaoPorTipo(lote, ["folga", "inox"]).skus_por_tipo).toBe(133);
  });

  test("os grupos juntam só os atributos que a visão declara juntar", () => {
    const lote = loteCatmat();
    for (const g of visaoPorTipo(lote, ["folga", "inox"]).grupos) {
      for (const d of g.divergencias) expect(["folga", "inox"]).toContain(d.atributo);
    }
    for (const g of visaoPorTipo(lote).grupos) {
      for (const d of g.divergencias) expect(d.atributo).not.toBe("designacao_basica");
    }
  });

  test("os SKUs de tipo somem com as distinções: grupos com 2+ chaves explicam a diferença 150 - 59", () => {
    const v = visaoPorTipo(loteCatmat());
    const somem = v.grupos.reduce((soma, g) => soma + g.chaves.length - 1, 0);
    expect(somem).toBe(v.skus_por_identidade - v.skus_por_tipo);
  });
});

describe("compararAgrupamento", () => {
  test("autoconferência: agrupar pela designação básica mistura tantos grupos quanto a visão por tipo junta", () => {
    const lote = loteCatmat();
    const comoUsina = compararAgrupamento(lote.linhas.map((l) => ({ original: l.original, grupo_usina: l.identidade?.designacao_basica })));
    expect(comoUsina.contagem.mistura).toBe(visaoPorTipo(lote).grupos.length);
  });

  test("preserva a ordem e o tamanho das entradas, e o lote é o da tradução direta", () => {
    const entradas = [entrada("6205 2RS C3", "A"), entrada("FILTRO DE OLEO MOTOR"), entrada("6004 ZZ", "B"), entrada("6205 ZZ", "A")];
    const { lote } = compararAgrupamento(entradas);
    expect(lote.linhas.map((l) => l.original)).toEqual(entradas.map((e) => e.original));
    expect(lote).toEqual(traduzirLote(entradas.map((e) => e.original)));
  });

  test("proteção diferente é mistura, e o filtro sem chave fica à parte", () => {
    const { grupos, contagem } = compararAgrupamento(MISTURA.map((t) => entrada(t, "G1")));
    expect(contagem).toMatchObject({ mistura: 1, coerente: 0, inconclusivo: 0 });
    const [g] = grupos;
    if (g.situacao !== "mistura") throw new Error("esperava mistura");
    expect(g.divergencias.map((d) => d.atributo)).toEqual(["protecao"]);
    expect(g.chaves.map((k) => k.linhas.length)).toEqual([2, 1]);
    expect(g.sem_chave.map((l) => l.original.texto)).toEqual(["FILTRO DE OLEO MOTOR"]);
  });

  test("grupo cujas linhas resolvem para a mesma chave é coerente", () => {
    const { grupos } = compararAgrupamento([entrada("6205 2RS C3", "A"), entrada("ROLAMENTO 6205-2RS1/C3", "A")]);
    expect(grupos.map((g) => [g.id, g.situacao])).toEqual([["A", "coerente"]]);
  });

  test("grupo com linha ilegível e sem duas chaves é inconclusivo", () => {
    const { grupos, contagem } = compararAgrupamento([entrada("6205 2RS C3", "A"), entrada("FILTRO DE OLEO MOTOR", "A"), entrada("FILTRO DE AR", "B"), entrada("PARAFUSO M8", "B")]);
    expect(contagem.inconclusivo).toBe(2);
    expect(grupos.every((g) => g.situacao === "inconclusivo")).toBe(true);
    expect(grupos.find((g) => g.id === "A")!.chaves).toHaveLength(1);
    expect(grupos.find((g) => g.id === "B")!.chaves).toHaveLength(0);
  });

  test("grupo com uma linha só conta em grupos_unitarios e não aparece em grupos", () => {
    const { grupos, contagem } = compararAgrupamento([entrada("6205 2RS C3", "SOZINHO"), entrada("6004 ZZ", "A"), entrada("6004 2RS", "A"), entrada("6205 ZZ"), entrada("6205 ZZ", "   ")]);
    expect(contagem.grupos_unitarios).toBe(1);
    expect(grupos.map((g) => g.id)).toEqual(["A"]);
    expect(contagem).toMatchObject({ cadastros_com_grupo: 3, cadastros_sem_grupo: 2 });
  });

  test("o id da usina vale sem espaços nas pontas, e a lista põe mistura antes de coerente, com empate por id", () => {
    const { grupos } = compararAgrupamento([
      entrada("6205 2RS C3", "z"),
      entrada("6205 ZZ", " z "),
      entrada("6004 ZZ", "b"),
      entrada("6004 ZZ", "b"),
      entrada("6004 ZZ", "a"),
      entrada("6004 2RS", "a"),
    ]);
    expect(grupos.map((g) => [g.id, g.situacao])).toEqual([
      ["a", "mistura"],
      ["z", "mistura"],
      ["b", "coerente"],
    ]);
  });

  test("sem nenhum grupo da usina devolve o lote e nenhum grupo", () => {
    const { grupos, contagem, lote } = compararAgrupamento(MISTURA.map((t) => entrada(t)));
    expect(grupos).toEqual([]);
    expect(lote.linhas).toHaveLength(4);
    expect(contagem).toMatchObject({ cadastros_com_grupo: 0, cadastros_sem_grupo: 4, grupos_unitarios: 0 });
  });
});

describe("amostra", () => {
  const lote = loteCatmat();
  const entradas = lote.linhas.map((l) => ({ original: l.original, grupo_usina: l.identidade?.designacao_basica }));
  const comparacao = compararAgrupamento(entradas);
  const ids = (a: { id: string }[]) => a.map((g) => g.id);

  test("com n maior que as misturas devolve os mesmos grupos, embaralhados, e outra semente muda a ordem", () => {
    const todos = amostrar(comparacao, "semente-a", 1000);
    const misturas = comparacao.grupos.filter((g) => g.situacao === "mistura");
    expect(ids(todos).sort()).toEqual(ids(misturas).sort());
    expect(ids(todos)).not.toEqual(ids(misturas));
    expect(ids(amostrar(comparacao, "semente-b", 1000))).not.toEqual(ids(todos));
  });

  test("o tamanho padrão é 20 e a mesma semente repete a amostra", () => {
    expect(amostrar(comparacao, "s")).toHaveLength(20);
    expect(ids(amostrar(comparacao, "s"))).toEqual(ids(amostrar(comparacao, "s")));
  });

  test("não depende da ordem do arquivo", () => {
    const invertida = compararAgrupamento([...entradas].reverse());
    expect(ids(amostrar(invertida, "s"))).toEqual(ids(amostrar(comparacao, "s")));
  });

  test("a amostra tem só misturas", () => {
    expect(amostrar(comparacao, "s").every((g) => g.situacao === "mistura")).toBe(true);
  });

  test("o hash é FNV-1a de 32 bits sobre UTF-8 (vetores publicados)", () => {
    expect(fnv1a32("")).toBe(0x811c9dc5);
    expect(fnv1a32("a")).toBe(0xe40c292c);
    expect(fnv1a32("foobar")).toBe(0xbf9cf968);
  });
});

describe("amostraParaCsv", () => {
  test("leva o texto original intacto, escapa as aspas e deixa distincao_real vazia, por último", () => {
    const textos = ['ROLAMENTO 6004-2Z, "LOTE 2"', "6004 ZZ", "ROL 6004 2RS", "FILTRO DE OLEO MOTOR"];
    const c = compararAgrupamento(textos.map((t) => entrada(t, "G1")));
    const [cab, ...linhas] = lerCsv(amostraParaCsv(amostrar(c, "s")));
    expect(cab.at(-1)).toBe("distincao_real");
    expect(cab).toContain("texto_original");
    expect(linhas).toHaveLength(4);
    const original = cab.indexOf("texto_original");
    expect(linhas.map((l) => l[original]).sort()).toEqual([...textos].sort());
    expect(linhas.every((l) => l.length === cab.length && l.at(-1) === "" && l[0] === "G1")).toBe(true);
  });

  test("sem misturas na amostra sai só o cabeçalho", () => {
    expect(lerCsv(amostraParaCsv([]))).toHaveLength(1);
  });
});

describe("o módulo é puro", () => {
  test("não importa rede nem web/ e não chama fetch", () => {
    const fonte = readFileSync(new URL("../src/motor/agrupamento.ts", import.meta.url), "utf8");
    const origens = [...fonte.matchAll(/^import[^;]*?from "([^"]+)"/gms)].map((m) => m[1]);
    expect(origens.length).toBeGreaterThan(0);
    for (const o of origens) expect(o).toMatch(/^\.\/(especificacao|lote|tipos)$/);
    expect(fonte).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket/);
  });
});
