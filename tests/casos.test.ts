// A página de casos é texto escrito à mão. Este teste roda cada caso no motor e falha quando
// a resposta, os códigos ou os números escritos na página deixam de bater com o que o protótipo mostra.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { loteCatmat } from "../src/motor/lote";
import { resolver } from "../src/motor/resolucao";
import { CASOS, miniatura, type Caso, type Foto } from "../web/casos";
import { agrupar, alvosTexto, veredito } from "../web/linguagem";
import { TOURS } from "../web/tour";

const PUBLICO = resolve(import.meta.dirname, "../public");
const CREDITOS = readFileSync(resolve(PUBLICO, "exemplos/CREDITOS.txt"), "utf8");
// O texto impresso na etiqueta de exemplo (public/exemplos/etiqueta-impressa-catmat-311960.png).
const TEXTO_DA_ETIQUETA = "ROLAMENTO RIGIDO DE ESFERAS\n6318ZZ C3\n90 X 190 X 43 MM\nCATMAT 311960";

function entradaDoMotor(c: Caso): [tipo: "codigo" | "descricao" | "ocr", texto: string] | null {
  const r = c.rodar;
  if (r.tipo === "lote") return null;
  return r.tipo === "foto" ? ["ocr", TEXTO_DA_ETIQUETA] : [r.tipo, r.texto];
}

describe.each(CASOS.map((c) => [c.chave, c] as const))("caso %s", (_chave, c) => {
  test("a resposta escrita é a que o protótipo mostra", () => {
    const entrada = entradaDoMotor(c);
    if (!entrada) {
      const lote = loteCatmat();
      const soma = Object.values(lote.por_estrato).reduce((s, e) => ({ total: s.total + e.total, resolve: s.resolve + e.resolve, revisa: s.revisa + e.revisa }), {
        total: 0,
        resolve: 0,
        revisa: 0,
      });
      expect("numeros" in c.resposta && c.resposta.numeros.map((n) => n.numero)).toEqual([soma.total, soma.resolve, soma.revisa, lote.grupos_duplicidade.length].map(String));
      expect(c.figura.numeros?.map((n) => n.numero)).toEqual([String(soma.total), String(lote.grupos_duplicidade.length)]);
      return;
    }
    const r = resolver(...entrada);
    const v = veredito(r);
    expect("nivel" in c.resposta && { nivel: c.resposta.nivel, titulo: c.resposta.titulo, frase: c.resposta.frase }).toEqual({ nivel: v.nivel, titulo: v.titulo, frase: v.frase });
    expect("grupos" in c.resposta && c.resposta.grupos).toEqual(agrupar(r.relacoes).map((g) => ({ nivel: g.nivel, titulo: g.titulo, alvos: alvosTexto(g.relacoes) })));
  });

  test("os cadastros mostrados são o texto original, sem mudança", () => {
    for (const e of c.figura.etiquetas ?? []) {
      const codigo = /^Código (\d+)/.exec(e.rotulo)?.[1];
      if (codigo) expect(e.texto).toBe(resolver("codigo", codigo).original.texto.trim());
      for (const m of e.marcas ?? []) expect(e.texto).toContain(m);
    }
  });

  test("toda imagem existe, tem texto alternativo e crédito", () => {
    const fotos: Foto[] = [c.situacao.foto, ...(c.figura.fotos ?? []), c.entrada.imagem].filter((f): f is Foto => !!f);
    for (const f of fotos) {
      expect(existsSync(resolve(PUBLICO, `.${f.src}`)), f.src).toBe(true);
      expect(f.alt.length, `alt de ${f.src}`).toBeGreaterThan(10);
      expect(CREDITOS, `crédito de ${f.src}`).toContain(f.src.split("/").at(-1)!);
    }
    if (c.miniatura) expect(existsSync(resolve(PUBLICO, `.${miniatura(c.miniatura)}`)), miniatura(c.miniatura)).toBe(true);
  });

  test("tem a explicação passo a passo com a mesma chave", () => {
    expect(TOURS[c.chave]?.titulo).toBe(`Caso ${c.numero}: ${c.titulo.charAt(0).toLowerCase()}${c.titulo.slice(1)}`);
  });

  test("as frases são curtas e sem jargão", () => {
    const textos = [c.titulo, c.resumo, c.leitura, c.entrada.nota, ...c.situacao.frases, ...c.figura.frases, ...c.porque];
    for (const t of textos) {
      for (const frase of t.split(/(?<=[.?!])\s+/)) expect(frase.split(/\s+/).length, frase).toBeLessThanOrEqual(25);
      expect(t, t).not.toMatch(/SAME_AS|CROSS_REFERENCE|INTERCHANGEABLE_FOR|SIMILAR_TO|ADR|DIN 625-1|CATMAT/);
    }
  });
});

test("os casos vêm na ordem da apresentação, numerados de 1 a 7", () => {
  expect(CASOS.map((c) => `${c.numero} ${c.chave}`)).toEqual(["1 duplicado", "2 parece", "3 marca", "4 lote", "5 pessoa", "6 fornecedor", "7 foto"]);
});
