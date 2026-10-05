// GET /api/lote[?formato=csv] -> tradução do cadastro CATMAT inteiro (itens ativos do PDM 11797).
// POST /api/lote {itens: [{codigo?, texto}]} -> tradução de um lote enviado (até 500 itens).
import { loteCatmat, loteParaCsv, traduzirLote } from "../../src/motor/lote";
import { erro, json, LIMITE_TEXTO, lerJson } from "../../src/api/http";

export const onRequestGet: PagesFunction = async ({ request }) => {
  const lote = loteCatmat();
  if (new URL(request.url).searchParams.get("formato") === "csv") {
    return new Response(loteParaCsv(lote), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="mapa-de-codigos-catmat-11797.csv"',
      },
    });
  }
  return json(lote);
};

export const onRequestPost: PagesFunction = async ({ request }) => {
  const corpo = await lerJson(request);
  const itens = corpo?.itens;
  if (!Array.isArray(itens) || itens.length === 0) return erro(400, "envie {itens: [{codigo?, texto}]}");
  if (itens.length > 500) return erro(400, "lote acima de 500 itens");
  const entradas = [];
  for (const [i, it] of itens.entries()) {
    const texto = String(it?.texto ?? "").trim();
    if (!texto || texto.length > LIMITE_TEXTO) return erro(400, `item ${i}: texto vazio ou acima de ${LIMITE_TEXTO} caracteres`);
    entradas.push({ origem: "entrada manual" as const, codigo: it?.codigo ? String(it.codigo).slice(0, 40) : undefined, texto });
  }
  return json(traduzirLote(entradas));
};
