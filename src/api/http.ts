// Respostas HTTP comuns às rotas da API (Cloudflare Pages Functions).
export const LIMITE_TEXTO = 2000;

export function json(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export function erro(status: number, mensagem: string): Response {
  return json({ erro: mensagem }, status);
}

export async function lerJson(request: Request): Promise<Record<string, unknown> | null> {
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return null;
  const texto = await request.text();
  if (texto.length > 200_000) return null;
  try {
    const v = JSON.parse(texto);
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
}

export function lerEntrada(corpo: Record<string, unknown>): { tipo: "codigo" | "descricao" | "ocr"; texto: string } | string {
  const tipo = String(corpo.tipo ?? "descricao");
  if (!["codigo", "descricao", "ocr"].includes(tipo)) return "tipo deve ser codigo, descricao ou ocr";
  const texto = String(corpo.texto ?? "").trim();
  if (!texto) return "texto obrigatório";
  if (texto.length > LIMITE_TEXTO) return `texto acima de ${LIMITE_TEXTO} caracteres`;
  return { tipo: tipo as "codigo" | "descricao" | "ocr", texto };
}
