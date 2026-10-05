// POST /api/revisoes {tipo, texto, revisor, decisao, justificativa, especificacao_aceita?}
// -> registro da decisão humana ao lado do original intacto. A API não guarda estado:
// o navegador mantém o registro (localStorage) e o exporta em JSON.
import { resolver } from "../../src/motor/resolucao";
import { criarDecisaoHumana, validarPedido } from "../../src/motor/revisao";
import { erro, json, lerEntrada, lerJson } from "../../src/api/http";

export const onRequestPost: PagesFunction = async ({ request }) => {
  const corpo = await lerJson(request);
  if (!corpo) return erro(400, "envie JSON com content-type application/json");
  const entrada = lerEntrada(corpo);
  if (typeof entrada === "string") return erro(400, entrada);
  let pedido;
  try {
    pedido = validarPedido(corpo);
  } catch (e) {
    return erro(400, (e as Error).message);
  }
  const resposta = resolver(entrada.tipo, entrada.texto);
  return json(await criarDecisaoHumana(resposta, pedido), 201);
};
