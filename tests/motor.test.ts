import { describe, expect, test } from "vitest";
import { lerDesignacao } from "../src/motor/designacao";
import { descreverDivergencia, divergencias, especificar } from "../src/motor/especificacao";
import { decidirPar } from "../src/motor/identidade";
import { celulaCsv, loteCatmat, loteParaCsv, medir, traduzirLote } from "../src/motor/lote";
import { resolver } from "../src/motor/resolucao";
import { criarDecisaoHumana } from "../src/motor/revisao";

describe("designação", () => {
  test("lê base, furo, proteção e folga", () => {
    const d = lerDesignacao("6318ZZ C3")!;
    expect([d.basica, d.furo_mm, d.protecao, d.folga]).toEqual(["6318", 90, "blindagem_dupla", "C3"]);
  });
  test("o hífen não cola o sufixo na base", () => {
    expect(lerDesignacao("6206-2Z")!.protecao).toBe("blindagem_dupla");
    expect(lerDesignacao("6206-2RZ/C3")!.protecao).toBe("vedacao_sem_contato_dupla");
  });
  test("códigos de furo especiais 00 a 03", () => {
    expect(["6200", "6201", "6202", "6203"].map((c) => lerDesignacao(c)!.furo_mm)).toEqual([10, 12, 15, 17]);
  });
  test("sufixo desconhecido fica não decodificado", () => {
    expect(lerDesignacao("6206 DDU")!.nao_decodificado).toEqual(["DDU"]);
  });
  test("fora das séries 60, 62 e 63 não é lido", () => {
    expect(lerDesignacao("608 ZZ")).toBeNull();
    expect(lerDesignacao("16003-2Z")).toBeNull();
    expect(lerDesignacao("1205EKTN9")).toBeNull();
  });
});

describe("especificação de texto livre", () => {
  test("resolve texto de fornecedor e gera a descrição por regra", () => {
    const r = especificar("BLK Modelo 6205-2rs");
    expect(r.decisao).toBe("resolve");
    expect(r.especificacao!.descricao_por_regra).toBe(
      "ROLAMENTO RIGIDO DE ESFERAS, UMA CARREIRA, 6205-2RS1, 25 X 52 X 15 MM, VEDAÇÃO DE CONTATO NOS DOIS LADOS, FOLGA CN",
    );
  });
  test("recusa furo que contradiz o código da designação", () => {
    const r = especificar("ROLAMENTO 6013 ZZ, DIÂMETRO INTERNO: 60 MM");
    expect(r.decisao).toBe("recusa");
    expect(r.motivos[0]).toContain("contradiz o código 6013 (furo 65 mm)");
  });
  test("recusa largura que contradiz a tabela DIN 625-1", () => {
    expect(especificar("6302 ZZ, LARGURA: 14 MM").decisao).toBe("recusa");
  });
  test("manda para revisão quando só há dimensões", () => {
    const r = especificar("ROLAMENTO 25X52X15 MM");
    expect(r.decisao).toBe("revisa");
    expect(r.candidatos_por_dimensao).toEqual(["6205"]);
  });
  test("recusa fora da família", () => {
    expect(especificar("ROLAMENTO AUTOCOMPENSADOR 1205 EKTN9").decisao).toBe("recusa");
  });
  test("não confunde carga axial com rolamento axial", () => {
    expect(especificar("FIXO UMA CARREIRA, CARGA AXIAL E RADIAL, REFERÊNCIA FABRICANTE 1: 6206 2RS").decisao).toBe("resolve");
  });
  test("leitura ambígua vai para revisão", () => {
    expect(especificar("6204/6zz").decisao).toBe("revisa");
  });
});

describe("as cinco provas do roteiro", () => {
  test("1. duplicidade exata entre códigos do CATMAT", () => {
    const r = resolver("codigo", "311960");
    const dup = r.relacoes.find((x) => x.alvo === "CATMAT 311963")!;
    expect([dup.tipo, dup.decisao, dup.condicoes]).toEqual(["SAME_AS", "resolve", ["duplicidade exata"]]);
  });
  test("2. falsa semelhança recusada com motivo", () => {
    const r = resolver("codigo", "317388");
    const falsa = r.relacoes.find((x) => x.alvo === "CATMAT 472509")!;
    expect(falsa.decisao).toBe("recusa");
    expect(falsa.motivos[0]).toBe("atributo diverge: folga radial CN x C3");
  });
  test("3. referência cruzada com condições e fonte, sem virar intercâmbio", () => {
    const r = resolver("codigo", "624270");
    const cruzada = r.relacoes.find((x) => x.tipo === "CROSS_REFERENCE")!;
    expect(cruzada.alvo_texto).toBe("SKF 6206 2RS1 -> NSK 6206 DDU");
    expect(cruzada.evidencias[0].url).toContain("codigoItem=624270");
    expect(cruzada.condicoes!.length).toBe(4);
    const troca = r.relacoes.find((x) => x.tipo === "INTERCHANGEABLE_FOR")!;
    expect(troca.decisao).toBe("revisa");
    expect(troca.motivos.some((m) => m.includes("INOXIDAVEL"))).toBe(true);
  });
  test("4. tradução em lote estratificada com denominadores", () => {
    const lote = loteCatmat();
    const total = Object.values(lote.por_estrato).reduce((s, c) => s + c.total, 0);
    expect(total).toBe(396);
    for (const c of Object.values(lote.por_estrato)) expect(c.resolve + c.revisa + c.recusa).toBe(c.total);
    expect(lote.grupos_duplicidade.some((g) => g.codigos.includes("311960") && g.codigos.includes("311963"))).toBe(true);
  });
  test("5. revisão humana preserva o original e registra a decisão", async () => {
    const r = resolver("codigo", "472447");
    const antes = JSON.stringify(r.original);
    const d = await criarDecisaoHumana(r, { revisor: "equipe", decisao: "revisa", justificativa: "conferir etiqueta física" });
    expect(JSON.stringify(d.original)).toBe(antes);
    expect(d.decisao_motor).toBe("recusa");
    expect(d.decisao_humana).toBe("revisa");
    expect(d.sha256_original).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("identidade em lista", () => {
  const entrada = (texto: string) => ({ origem: "entrada manual" as const, texto });

  test("a chave de cada uma das 183 linhas resolvidas do CATMAT sai igual à fórmula anterior", () => {
    const lote = loteCatmat();
    const resolvidas = lote.linhas.filter((l) => l.decisao === "resolve");
    expect(resolvidas.length).toBe(183);
    for (const l of resolvidas) {
      const i = l.identidade!;
      expect(l.chave).toBe(`${i.designacao_basica}|${i.protecao}|${i.folga}|${i.inox ? "inox" : "aco"}`);
    }
    expect(lote.linhas.filter((l) => l.decisao !== "resolve").every((l) => l.identidade === null && l.chave === null)).toBe(true);
    expect(new Set(resolvidas.map((l) => l.chave)).size).toBe(150);
    expect(lote.grupos_duplicidade.length).toBe(28);
  });

  test("a linha traz os atributos de identidade e a chave deriva deles", () => {
    const [l] = traduzirLote([entrada("ROLAMENTO RIGIDO DE ESFERAS 6205 2RS C3")]).linhas;
    expect(l.identidade).toEqual({ designacao_basica: "6205", protecao: "vedacao_dupla", folga: "C3", inox: false });
    expect(l.chave).toBe("6205|vedacao_dupla|C3|aco");
  });

  test("divergencias lista só os atributos que discordam, na ordem da lista, sem repetir valores", () => {
    const base = { designacao_basica: "6205", protecao: "aberto", folga: "CN", inox: false } as const;
    expect(divergencias([base, base])).toEqual([]);
    expect(divergencias([base, { ...base, folga: "C3" }, { ...base, folga: "C3" }, { ...base, inox: true }])).toEqual([
      { atributo: "folga", valores: ["CN", "C3"] },
      { atributo: "inox", valores: [false, true] },
    ]);
    expect(descreverDivergencia({ atributo: "inox", valores: [true, false] })).toBe("material: inoxidável x não declarado inox");
  });

  test("decidirPar mantém os motivos de cada atributo que diverge", () => {
    const motivos = (a: string, b: string) => decidirPar(especificar(a), especificar(b)).motivos;
    expect(motivos("6204", "6205")).toEqual(["atributo diverge: designação básica 6204 x 6205"]);
    expect(motivos("6205 2RS", "6205 ZZ")).toEqual([
      "atributo diverge: proteção: vedação de contato nos dois lados x blindagem metálica nos dois lados",
    ]);
    expect(motivos("6205 C3", "6205")).toEqual(["atributo diverge: folga radial C3 x CN"]);
    expect(motivos("6205 INOX", "6205")).toEqual(["atributo diverge: material: inoxidável x não declarado inox"]);
    expect(motivos("6204 2RS C3 INOX", "6205 ZZ")).toEqual([
      "atributo diverge: designação básica 6204 x 6205",
      "atributo diverge: proteção: vedação de contato nos dois lados x blindagem metálica nos dois lados",
      "atributo diverge: folga radial C3 x CN",
      "atributo diverge: material: inoxidável x não declarado inox",
    ]);
  });
});

describe("lote e medição", () => {
  test("celulaCsv fecha em aspas e dobra as aspas internas", () => {
    expect(celulaCsv('ROLAMENTO "6205"')).toBe('"ROLAMENTO ""6205"""');
    expect(celulaCsv(undefined)).toBe('""');
    expect(celulaCsv(null)).toBe('""');
    expect(celulaCsv(7)).toBe('"7"');
  });
  test("CSV preserva o texto original com aspas escapadas", () => {
    const csv = loteParaCsv(traduzirLote([{ origem: "entrada manual", texto: 'ROLAMENTO "6205" 2RS' }]));
    expect(csv.split("\n")[1]).toContain('"ROLAMENTO ""6205"" 2RS"');
  });
  test("a medição do gabarito v1 reporta denominadores por estrato", () => {
    const m = medir();
    expect(m.traducao_catmat.map((x) => x.total)).toEqual([8, 17, 17]);
    expect(m.traducao_texto_livre.reduce((s, x) => s + x.total, 0)).toBe(31);
    expect(m.identidade.reduce((s, x) => s + x.pares, 0)).toBe(140);
    expect(m.referencia_cruzada).toEqual({ total: 1, recuperadas: 1, com_fonte: 1, intercambio_resolvido_automaticamente: 0 });
  });
});
