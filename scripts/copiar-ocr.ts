// Copia o worker e o núcleo WebAssembly do tesseract.js para dist/ocr/, para o OCR rodar
// no navegador sem CDN de terceiros. O modelo eng.traineddata.gz vem de public/ocr/.
import { copyFile, mkdir, readdir } from "node:fs/promises";

const raiz = new URL("../", import.meta.url);
const destino = new URL("dist/ocr/core/", raiz);
await mkdir(destino, { recursive: true });
await copyFile(new URL("node_modules/tesseract.js/dist/worker.min.js", raiz), new URL("dist/ocr/worker.min.js", raiz));
const core = new URL("node_modules/tesseract.js-core/", raiz);
for (const nome of await readdir(core)) {
  if (/^tesseract-core.*lstm\.(wasm\.js|js|wasm)$/.test(nome) || nome === "LICENSE") {
    await copyFile(new URL(nome, core), new URL(nome, destino));
  }
}
console.log("OCR copiado para dist/ocr/");
