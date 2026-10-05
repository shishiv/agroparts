// Revisão humana: registra a decisão ao lado do original, sem alterar o original.
import type { Decisao, DecisaoHumana, Resposta } from "./tipos";

export interface PedidoRevisao {
  revisor: string;
  decisao: Decisao;
  justificativa: string;
  especificacao_aceita?: string | null;
}

export async function sha256(texto: string): Promise<string> {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function validarPedido(p: unknown): PedidoRevisao {
  const x = p as Record<string, unknown>;
  if (!x || typeof x !== "object") throw new Error("pedido de revisão ausente");
  if (!["resolve", "revisa", "recusa"].includes(String(x.decisao))) throw new Error("decisao deve ser resolve, revisa ou recusa");
  const revisor = String(x.revisor ?? "").trim();
  const justificativa = String(x.justificativa ?? "").trim();
  if (!revisor || revisor.length > 80) throw new Error("revisor obrigatório (até 80 caracteres)");
  if (!justificativa || justificativa.length > 500) throw new Error("justificativa obrigatória (até 500 caracteres)");
  return {
    revisor,
    decisao: x.decisao as Decisao,
    justificativa,
    especificacao_aceita: x.especificacao_aceita ? String(x.especificacao_aceita).slice(0, 300) : null,
  };
}

export async function criarDecisaoHumana(resposta: Resposta, pedido: PedidoRevisao): Promise<DecisaoHumana> {
  const original = structuredClone(resposta.original);
  return {
    id: crypto.randomUUID(),
    registrado_em: new Date().toISOString(),
    revisor: pedido.revisor,
    original,
    sha256_original: await sha256(JSON.stringify(original)),
    decisao_motor: resposta.decisao,
    motivos_motor: resposta.motivos,
    decisao_humana: pedido.decisao,
    especificacao_aceita: pedido.especificacao_aceita ?? resposta.especificacao?.descricao_por_regra ?? null,
    justificativa: pedido.justificativa,
    versao_regras: resposta.versao_regras,
  };
}
