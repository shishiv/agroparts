// POST /api/resolver {tipo, texto} -> Resposta (forma canônica, relações tipadas e evidências).
import { resolver } from "../../src/motor/resolucao";
import { erro, json, lerEntrada, lerJson } from "../../src/api/http";

export const onRequestPost: PagesFunction = async ({ request }) => {
  const corpo = await lerJson(request);
  if (!corpo) return erro(400, "envie JSON com content-type application/json");
  const entrada = lerEntrada(corpo);
  if (typeof entrada === "string") return erro(400, entrada);
  return json(resolver(entrada.tipo, entrada.texto));
};
