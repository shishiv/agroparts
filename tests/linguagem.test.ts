import { describe, expect, test } from "vitest";
import livre from "../dados/gabarito/v1/textos-livres.json";
import { ITENS_ATIVOS } from "../src/motor/corpus";
import { loteCatmat } from "../src/motor/lote";
import { resolver } from "../src/motor/resolucao";
import type { Resposta } from "../src/motor/tipos";
import { agrupar, descreverPeca, explicar, frases, semelhancaEmPalavras, veredito } from "../web/linguagem";

// Toda resposta que o protótipo pode mostrar: o cadastro inteiro, o gabarito de texto livre e entradas de borda.
const respostas: Resposta[] = [
  ...ITENS_ATIVOS.map((i) => resolver("codigo", String(i.codigoItem))),
  ...(livre as { rotulos: { texto: string }[] }).rotulos.map((l) => resolver("descricao", l.texto)),
  ...["BLK Modelo 6205-2rs", "rolamento 25 x 52 x 15 mm", "rolamento 6 x 19 x 6 mm", "parafuso m8", "rolamento 1/2 pol", "6204/6ZZ", "6205 6206"].map((t) =>
    resolver("descricao", t),
  ),
];

const JARGAO = /SAME_AS|CROSS_REFERENCE|INTERCHANGEABLE_FOR|COMPATIBLE_WITH|SIMILAR_TO|ADR|DIN 625-1|não calibrada|decodificad|designação/;

function textosDaSuperficie(r: Resposta): string[] {
  const v = veredito(r);
  const grupos = agrupar(r.relacoes);
  return [
    v.titulo,
    v.frase,
    ...frases(r.motivos),
    ...(r.especificacao ? [descreverPeca(r.especificacao)] : []),
    ...grupos.flatMap((g) => [g.titulo, g.explicacao, ...g.relacoes.flatMap((x) => [...frases(x.motivos), ...frases(x.condicoes ?? [])])]),
  ];
}

describe("linguagem da interface", () => {
  test("toda forma de motivo e condição do motor tem tradução", () => {
    const sem = new Set<string>();
    const motivos = [...respostas.flatMap((r) => [...r.motivos, ...r.relacoes.flatMap((x) => [...x.motivos, ...(x.condicoes ?? [])])]), ...loteCatmat().linhas.flatMap((l) => l.motivos)];
    for (const m of motivos) if (explicar(m) === null) sem.add(m);
    expect([...sem]).toEqual([]);
  });

  test("a superfície não mostra código de relação, ADR, norma crua nem nota", () => {
    const vazados = respostas.flatMap(textosDaSuperficie).filter((t) => JARGAO.test(t));
    expect([...new Set(vazados)]).toEqual([]);
  });

  test("toda relação do motor cai em um grupo", () => {
    for (const r of respostas) expect(agrupar(r.relacoes).reduce((s, g) => s + g.relacoes.length, 0)).toBe(r.relacoes.length);
  });

  test("as cinco provas do roteiro dizem a resposta em palavras", () => {
    const prova = (c: string) => resolver("codigo", c);
    expect(veredito(prova("311960")).titulo).toBe("Peça identificada");
    expect(agrupar(prova("311960").relacoes).map((g) => g.titulo)).toEqual(["É a mesma peça"]);
    expect(agrupar(prova("317388").relacoes).map((g) => g.titulo)).toEqual(["É a mesma peça", "Parece, mas não é"]);
    expect(agrupar(prova("624270").relacoes).map((g) => g.titulo).slice(0, 2)).toEqual([
      "Equivale na medida, com condições",
      "Trocar uma marca pela outra precisa de uma pessoa",
    ]);
    expect(veredito(prova("624270")).titulo).toBe("Precisa de uma pessoa");
    expect(veredito(prova("472447")).titulo).toBe("O cadastro se contradiz");
    expect(frases(prova("472447").motivos)).toEqual(["A descrição diz furo de 60 mm, mas o código 6013 tem furo de 65 mm."]);
  });

  test("semelhança de texto vira palavra", () => {
    expect(semelhancaEmPalavras(1)).toBe("Textos iguais");
    expect(semelhancaEmPalavras(0.86)).toBe("Textos quase iguais");
    expect(semelhancaEmPalavras(0.5)).toBe("Textos parecidos");
    expect(semelhancaEmPalavras(0.2)).toBe("Textos diferentes");
  });

  test("a peça aparece em uma linha clara", () => {
    expect(descreverPeca(resolver("descricao", "BLK Modelo 6205-2rs").especificacao!)).toBe(
      "Rolamento de esferas 6205 · 25 × 52 × 15 mm · vedação de borracha nos dois lados · folga normal",
    );
  });
});
