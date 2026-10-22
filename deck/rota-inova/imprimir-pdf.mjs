// Imprime em PDF a aba do open-slide aberta no navegador headless, no tamanho de página do CSS (1920 x 1080 px).
// O export de PDF do open-slide monta as páginas e chama window.print(); este script faz a impressão.
// Uso: node imprimir-pdf.mjs <ws://.../devtools/browser/...> <url-da-aba> <saida.pdf>
import { writeFileSync } from 'node:fs';

const [cdpUrl, urlDaAba, saida] = process.argv.slice(2);
if (!cdpUrl || !urlDaAba || !saida) {
  console.error('uso: node imprimir-pdf.mjs <cdp-url> <url-da-aba> <saida.pdf>');
  process.exit(2);
}

const ws = new WebSocket(cdpUrl);
let proximo = 0;
const pendentes = new Map();
const enviar = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = ++proximo;
    pendentes.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
ws.addEventListener('message', (evento) => {
  const msg = JSON.parse(String(evento.data));
  const p = msg.id && pendentes.get(msg.id);
  if (!p) return;
  pendentes.delete(msg.id);
  if (msg.error) p.reject(new Error(msg.error.message));
  else p.resolve(msg.result);
});
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', reject, { once: true });
});

const { targetInfos } = await enviar('Target.getTargets');
const aba = targetInfos.find((t) => t.type === 'page' && t.url.startsWith(urlDaAba));
if (!aba) {
  console.error(`nenhuma aba com a url ${urlDaAba}`);
  process.exit(1);
}
const { sessionId } = await enviar('Target.attachToTarget', { targetId: aba.targetId, flatten: true });
const { data } = await enviar(
  'Page.printToPDF',
  { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 },
  sessionId,
);
writeFileSync(saida, Buffer.from(data, 'base64'));
ws.close();
console.log(saida);
