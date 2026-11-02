import { describe, expect, it } from "vitest";
import { adivinharColunas, decodificar, lerCsv } from "../web/csv";

describe("leitura do CSV do diagnóstico", () => {
  it("aceita ponto e vírgula, aspas com vírgula, acentos e BOM", () => {
    const bytes = new TextEncoder().encode('\uFEFFCódigo;Descrição\r\n1;"ROLAMENTO, RÍGIDO ""6205"""\r\n\r\n2;outro\r\n');
    const t = lerCsv(decodificar(bytes.buffer as ArrayBuffer));
    expect(t.separador).toBe(";");
    expect(t.cabecalho).toEqual(["Código", "Descrição"]);
    expect(t.linhas).toEqual([["1", 'ROLAMENTO, RÍGIDO "6205"'], ["2", "outro"]]);
    expect(adivinharColunas(t)).toEqual({ codigo: 0, descricao: 1 });
  });

  it("aceita vírgula e acha as colunas pelo nome, em qualquer ordem", () => {
    const t = lerCsv("texto livre,material,preço\nROLAMENTO 6205 2RS,100,3\n");
    expect(t.separador).toBe(",");
    expect(adivinharColunas(t)).toEqual({ codigo: 1, descricao: 0 });
  });
});
