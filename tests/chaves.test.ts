import { describe, expect, test } from "vitest";
import { arquivoDeChaves, chavesParaCsv } from "../src/motor/chaves";
import { loteCatmat, loteParaCsv, traduzirLote } from "../src/motor/lote";
import type { MaterialOriginal } from "../src/motor/tipos";

const item = (codigo: string | undefined, texto: string): MaterialOriginal => ({ origem: "entrada manual", codigo, texto });

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

const ENTRADA = [
  item("20", "ROLAMENTO RIGIDO ESFERAS 6004-2Z"),
  item("10", "ROLAMENTO, RIGIDO DE ESFERAS, 6004 ZZ"),
  item(undefined, "ROLAMENTO 6004 2Z"),
  item("30", "ROL 6004 2RS"),
  item("40", "FILTRO DE OLEO MOTOR"),
  item("50", "ROLAMENTO 6205-2RS"),
  item("60", "6205 2RS"),
];

describe("arquivo de chaves", () => {
  const lote = traduzirLote(ENTRADA);
  const arquivo = arquivoDeChaves(lote);

  test("tem uma linha por código de cada grupo, e nada de fora dos grupos", () => {
    const dosGrupos = lote.grupos_duplicidade.flatMap((g) => g.codigos);
    expect(arquivo.grupos).toBe(lote.grupos_duplicidade.length);
    expect(arquivo.grupos).toBe(2);
    expect(arquivo.linhas.map((l) => l.codigo).sort()).toEqual(["10", "20", "50", "60"]);
    for (const l of arquivo.linhas) expect(dosGrupos).toContain(l.codigo);
    expect(arquivo.linhas.map((l) => l.codigo)).not.toContain("30");
    expect(arquivo.linhas.map((l) => l.codigo)).not.toContain("40");
  });

  test("conta os cadastros do grupo sem código e os deixa fora do arquivo", () => {
    expect(arquivo.sem_codigo).toBe(1);
    expect(arquivo.linhas.some((l) => l.texto_original === "ROLAMENTO 6004 2Z")).toBe(false);
  });

  test("sai em ordem de grupo e depois de código", () => {
    expect(arquivo.linhas.map((l) => [l.grupo, l.codigo])).toEqual([
      [1, "10"],
      [1, "20"],
      [2, "50"],
      [2, "60"],
    ]);
  });

  test("a chave é a que traduzirLote deu, e códigos do mesmo grupo têm a mesma", () => {
    for (const l of arquivo.linhas) {
      const g = lote.grupos_duplicidade.find((x) => x.grupo === l.grupo)!;
      expect(l.chave).toBe(g.chave);
      expect(l.designacao).toBe(g.designacao);
    }
  });
});

describe("CSV do arquivo de chaves", () => {
  const lote = traduzirLote(ENTRADA);
  const csv = chavesParaCsv(arquivoDeChaves(lote));
  const tabela = lerCsv(csv);
  const [cabecalho, ...linhas] = tabela;
  const col = (nome: string) => cabecalho.indexOf(nome);

  test("tem cabeçalho e uma linha de CSV por linha do arquivo", () => {
    expect(cabecalho).toHaveLength(10);
    expect(linhas).toHaveLength(4);
    for (const l of linhas) expect(l).toHaveLength(cabecalho.length);
  });

  test("toda linha é SAME_AS, com chave e pelo menos uma evidência com URL", () => {
    for (const l of linhas) {
      expect(l[col("relacao")]).toBe("SAME_AS");
      expect(l[col("chave")]).not.toBe("");
      expect(l[col("evidencias")]).toMatch(/\(https?:\/\/[^)]+\)/);
    }
  });

  test("o texto original sai intacto, com vírgula dentro", () => {
    const linha = linhas.find((l) => l[col("codigo")] === "10")!;
    expect(linha[col("texto_original")]).toBe("ROLAMENTO, RIGIDO DE ESFERAS, 6004 ZZ");
  });

  test("rodar duas vezes dá o mesmo arquivo, byte a byte", () => {
    expect(chavesParaCsv(arquivoDeChaves(traduzirLote(ENTRADA)))).toBe(csv);
  });

  test("lote sem grupo dá só o cabeçalho", () => {
    const a = arquivoDeChaves(traduzirLote([item("1", "FILTRO DE OLEO")]));
    expect(a).toEqual({ linhas: [], grupos: 0, sem_codigo: 0 });
    expect(lerCsv(chavesParaCsv(a))).toHaveLength(1);
  });

  test("o mapa de códigos continua com as suas 10 colunas", () => {
    expect(lerCsv(loteParaCsv(lote))[0]).toHaveLength(10);
  });
});

describe("arquivo de chaves do CATMAT", () => {
  test("cobre todos os grupos do lote, e cada código do grupo aparece uma vez", () => {
    const lote = loteCatmat();
    const a = arquivoDeChaves(lote);
    expect(a.grupos).toBe(lote.grupos_duplicidade.length);
    expect(a.linhas.length + a.sem_codigo).toBe(lote.linhas.filter((l) => l.grupo_duplicidade !== null).length);
    for (const l of a.linhas) expect(l.evidencias.length).toBeGreaterThan(0);
  });
});
