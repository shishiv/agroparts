import { describe, expect, test } from "vitest";
import * as lote from "../functions/api/lote";
import * as medicao from "../functions/api/medicao";
import * as resolver from "../functions/api/resolver";
import * as revisoes from "../functions/api/revisoes";

const ctx = (request: Request) => ({ request }) as any;
const post = (url: string, corpo: unknown) =>
  new Request(`https://agroparts.test${url}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) });

describe("POST /api/resolver", () => {
  test("resolve código CATMAT e devolve a forma canônica", async () => {
    const r = await resolver.onRequestPost(ctx(post("/api/resolver", { tipo: "codigo", texto: "311960" })));
    expect(r.status).toBe(200);
    const corpo: any = await r.json();
    expect(corpo.original.codigo).toBe("311960");
    expect(corpo.decisao).toBe("resolve");
    expect(corpo.especificacao.designacao_basica).toBe("6318");
    expect(corpo.aplicabilidade).toContain("COMPATIBLE_WITH não é inferida");
  });
  test("rejeita tipo inválido com 400", async () => {
    const r = await resolver.onRequestPost(ctx(post("/api/resolver", { tipo: "foto", texto: "6205" })));
    expect(r.status).toBe(400);
    expect(await r.json()).toEqual({ erro: "tipo deve ser codigo, descricao ou ocr" });
  });
  test("rejeita corpo que não é JSON", async () => {
    const req = new Request("https://agroparts.test/api/resolver", { method: "POST", body: "6205" });
    expect((await resolver.onRequestPost(ctx(req))).status).toBe(400);
  });
});

describe("/api/lote", () => {
  test("GET devolve o cadastro inteiro com contagens por estrato", async () => {
    const r = await lote.onRequestGet(ctx(new Request("https://agroparts.test/api/lote")));
    const corpo: any = await r.json();
    expect(corpo.linhas.length).toBe(396);
  });
  test("GET ?formato=csv devolve o mapa de códigos", async () => {
    const r = await lote.onRequestGet(ctx(new Request("https://agroparts.test/api/lote?formato=csv")));
    expect(r.headers.get("content-type")).toContain("text/csv");
    expect((await r.text()).split("\n")[0]).toBe(
      "origem,codigo,texto_original,estrato,decisao,designacao_canonica,descricao_por_regra,grupo_duplicidade,motivos,versao_regras",
    );
  });
  test("POST traduz um lote enviado e agrupa duplicidades", async () => {
    const r = await lote.onRequestPost(ctx(post("/api/lote", { itens: [{ codigo: "A1", texto: "6205 ZZ" }, { codigo: "B7", texto: "rolamento 6205-2Z" }] })));
    const corpo: any = await r.json();
    expect(corpo.grupos_duplicidade).toEqual([{ grupo: 1, chave: "6205|blindagem_dupla|CN|aco", designacao: "6205-2Z", codigos: ["A1", "B7"] }]);
  });
  test("POST recusa lote acima de 500 itens", async () => {
    const itens = Array.from({ length: 501 }, () => ({ texto: "6205" }));
    expect((await lote.onRequestPost(ctx(post("/api/lote", { itens })))).status).toBe(400);
  });
});

describe("GET /api/medicao", () => {
  test("publica denominadores por estrato e nenhuma acurácia geral", async () => {
    const corpo: any = await (await medicao.onRequestGet(ctx(new Request("https://agroparts.test/api/medicao")))).json();
    expect(corpo.versao_gabarito).toBe("v1");
    expect(Object.keys(corpo)).not.toContain("acuracia");
    expect(corpo.traducao_catmat[0]).toHaveProperty("elegiveis");
  });
});

describe("POST /api/revisoes", () => {
  test("registra a decisão humana e devolve o original intacto", async () => {
    const r = await revisoes.onRequestPost(
      ctx(post("/api/revisoes", { tipo: "codigo", texto: "472447", revisor: "equipe AgroParts", decisao: "recusa", justificativa: "furo 60 mm não é 6013" })),
    );
    expect(r.status).toBe(201);
    const corpo: any = await r.json();
    expect(corpo.original.codigo).toBe("472447");
    expect(corpo.original.texto).toContain("DIÂMETRO INTERNO: 60 MM");
    expect([corpo.decisao_motor, corpo.decisao_humana]).toEqual(["recusa", "recusa"]);
  });
  test("exige revisor e justificativa", async () => {
    const r = await revisoes.onRequestPost(ctx(post("/api/revisoes", { tipo: "codigo", texto: "472447", decisao: "resolve" })));
    expect(r.status).toBe(400);
  });
});
