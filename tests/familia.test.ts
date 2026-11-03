// A régua de F3 e as regras do pré-registro de família. O último teste usa o benchmark público real;
// os outros usam uma árvore e linhas de compra sintéticas, que existem só neste teste.
import { describe, expect, test } from "vitest";
import { carregarBenchmarkFamilia, montarCasos, type TextoDeCompra } from "../scripts/benchmark-familia";
import { medirFamilia, regua, type ArvoreCatmat, type PreregistroFamilia } from "../scripts/familia";

const SINTETICA: ArvoreCatmat = {
  versao: "árvore sintética, só para teste",
  grupos: [
    {
      codigo: 53,
      nome: "FERRAGENS",
      classes: [
        { codigo: 5305, nome: "PARAFUSOS", pdms: [{ codigo: 2, nome: "PARAFUSO" }, { codigo: 5, nome: "PARAFUSO SEXTAVADO" }] },
        { codigo: 5310, nome: "PORCAS", pdms: [{ codigo: 9, nome: "PORCA" }] },
      ],
    },
    { codigo: 31, nome: "ROLAMENTOS", classes: [{ codigo: 3110, nome: "ROLAMENTOS", pdms: [{ codigo: 11797, nome: "ROLAMENTO ESFERA" }] }] },
  ],
};
const PRE: PreregistroFamilia = { versao: "sintético", limiar_por_classificador: { regua: 1 }, erro_maximo: 0.05, margem_sobre_a_regua: 0.05, minimo_por_estrato: 100 };

describe("régua", () => {
  const r = regua(SINTETICA);

  test("o texto com todas as palavras do PDM recebe esse PDM com confiança 1, e o mais específico ganha o empate", async () => {
    expect(await r.classificar("Parafuso sextavado inox M8", "direta")).toEqual({ tipo: "pdm", grupo: 53, classe: 5305, pdm: 5, confianca: 1 });
    expect(await r.classificar("rolamento de esfera 6205", "direta")).toEqual({ tipo: "pdm", grupo: 31, classe: 3110, pdm: 11797, confianca: 1 });
  });

  test("sem palavra em comum, a resposta é nenhum no nível PDM", async () => {
    expect(await r.classificar("SKF", "direta")).toEqual({ tipo: "nenhum", nivel: "pdm", ate: {}, confianca: 0 });
  });

  test("na medição, a ordem das opções não muda a resposta e só a faixa conta como acerto", async () => {
    const casos = [
      { id: "a", texto: "parafuso sextavado", rotulo: { grupo: 53, classe: 5305, pdm: 5 } },
      { id: "b", texto: "parafuso sextavado", rotulo: { grupo: 53, classe: 5305, pdm: 2 } },
      { id: "c", texto: "rolamento 6205", rotulo: { grupo: 31, classe: 3110, pdm: 11797 } },
      { id: "d", texto: "BOSCH", rotulo: { grupo: 31, classe: 3110, pdm: 11797 } },
    ] as never;
    expect(await medirFamilia(casos, r, PRE)).toEqual([
      { classificador: "regua", versao: "1", estrato: "31", casos: 2, na_faixa: 0, corretos_na_faixa: 0, nenhum: 1, mudou_com_a_ordem: 0 },
      { classificador: "regua", versao: "1", estrato: "53", casos: 2, na_faixa: 2, corretos_na_faixa: 1, nenhum: 0, mudou_com_a_ordem: 0 },
    ]);
  });

  test("um classificador sem limiar no pré-registro não é medido", async () => {
    await expect(medirFamilia([], { ...r, nome: "outro" }, PRE)).rejects.toThrow("não tem limiar");
  });
});

describe("regras do pré-registro", () => {
  const linha = (pdm: number, marca: string, id: string, codigoPdm = pdm): TextoDeCompra => ({ pdm_consultado: pdm, codigoPdm: String(codigoPdm), marca, linhas: 1, idCompraItem: id, codigoItemCatalogo: 0 });

  test("tiram o texto vazio, o que é só nome de marca, o rótulo ambíguo e a linha de outro PDM", () => {
    const { casos, exclusoes } = montarCasos(
      [
        linha(2, "...", "01"),
        linha(2, "SKF", "02"),
        linha(2, "Bosch original", "03"),
        linha(2, "3514", "04"),
        linha(2, "Parafuso madeira", "05"),
        linha(2, "PARAFUSO  madeira", "06"),
        linha(9, "Ciser", "07"),
        linha(9, "porca ciser", "08"),
        linha(11797, "porca ciser", "09"),
        linha(9, "porca M8", "10", 2),
      ],
      SINTETICA,
      10,
    );
    expect(casos.map((c) => [c.id, c.texto]).sort()).toEqual([
      ["2:04", "3514"],
      ["2:05", "Parafuso madeira"],
    ]);
    expect(exclusoes).toEqual({ linhas_com_pdm_diferente: 1, sem_token: 1, so_nome_de_marca: 3, rotulo_ambiguo: 2, acima_do_limite_por_pdm: 0 });
  });

  test("o limite por PDM guarda os casos de menor sha256 do texto normalizado, sem depender da ordem de entrada", () => {
    const linhas = Array.from({ length: 6 }, (_, i) => linha(2, `parafuso ${100 + i}`, String(i).padStart(2, "0")));
    const ida = montarCasos(linhas, SINTETICA, 3);
    const volta = montarCasos([...linhas].reverse(), SINTETICA, 3);
    expect(ida.casos).toHaveLength(3);
    expect(ida.exclusoes.acima_do_limite_por_pdm).toBe(3);
    expect(volta.casos.map((c) => c.id).sort()).toEqual(ida.casos.map((c) => c.id).sort());
  });
});

test("a régua roda num punhado de casos do benchmark público, e cada resposta na faixa fica dentro da árvore", async () => {
  const b = await carregarBenchmarkFamilia();
  const r = regua(b.arvore);
  const punhado = b.grupos.flatMap((g) => b.casos.filter((c) => c.rotulo.grupo === g).slice(0, 2));
  const medicao = await medirFamilia(punhado, r, b.pre);
  expect(medicao.reduce((s, l) => s + l.casos, 0)).toBe(punhado.length);
  for (const l of medicao) {
    expect(b.grupos.map(String)).toContain(l.estrato);
    expect(l.corretos_na_faixa).toBeLessThanOrEqual(l.na_faixa);
    expect(l.na_faixa + l.nenhum).toBeLessThanOrEqual(l.casos);
    expect(l.mudou_com_a_ordem).toBe(0);
  }
  const caminho = new Set(b.arvore.grupos.flatMap((g) => g.classes.flatMap((c) => c.pdms.map((p) => `${g.codigo}/${c.codigo}/${p.codigo}`))));
  for (const c of punhado) {
    const resposta = await r.classificar(c.texto, "direta");
    if (resposta.tipo === "pdm") expect(caminho).toContain(`${resposta.grupo}/${resposta.classe}/${resposta.pdm}`);
  }
});
