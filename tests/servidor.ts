// Serve o site construído (dist/) com as mesmas rotas /api/* do Cloudflare Pages, para o
// teste do passo a passo e para gerar capturas sem depender do wrangler.
import { existsSync, readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { extname, join, resolve } from "node:path";
import * as fontes from "../functions/api/fontes";
import * as lote from "../functions/api/lote";
import * as medicao from "../functions/api/medicao";
import * as resolver from "../functions/api/resolver";
import * as revisoes from "../functions/api/revisoes";
const DIST = resolve(import.meta.dirname, "../dist");
const ROTAS: Record<string, Record<string, PagesFunction>> = {
  "/api/fontes": { GET: fontes.onRequestGet },
  "/api/lote": { GET: lote.onRequestGet, POST: lote.onRequestPost },
  "/api/medicao": { GET: medicao.onRequestGet },
  "/api/resolver": { POST: resolver.onRequestPost },
  "/api/revisoes": { POST: revisoes.onRequestPost },
};
const TIPOS: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".woff": "font/woff", ".wasm": "application/wasm", ".gz": "application/gzip",
};

export async function servir(): Promise<{ base: string; servidor: Server }> {
  const servidor = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const rota = ROTAS[url.pathname]?.[req.method ?? "GET"];
    if (rota) {
      const corpo = await new Promise<string>((ok) => {
        let t = "";
        req.on("data", (c) => (t += c));
        req.on("end", () => ok(t));
      });
      const request = new Request(url, { method: req.method, headers: req.headers as Record<string, string>, body: req.method === "POST" ? corpo : undefined });
      const r = (await rota({ request } as any)) as unknown as globalThis.Response;
      res.writeHead(r.status, Object.fromEntries(r.headers));
      res.end(Buffer.from(await r.arrayBuffer()));
      return;
    }
    const arquivo = join(DIST, url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname));
    if (!arquivo.startsWith(DIST) || !existsSync(arquivo)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": TIPOS[extname(arquivo)] ?? "application/octet-stream" });
    res.end(readFileSync(arquivo));
  });
  await new Promise<void>((ok) => servidor.listen(Number(process.env.PORTA ?? 0), "127.0.0.1", ok));
  const endereco = servidor.address();
  return { base: `http://127.0.0.1:${typeof endereco === "object" && endereco ? endereco.port : 0}`, servidor };
}
