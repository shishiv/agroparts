import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: "web",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    // Três páginas: o protótipo em /, o contato em /contato e o diagnóstico em /diagnostico (só por link).
    rolldownOptions: {
      input: {
        index: fileURLToPath(new URL("web/index.html", import.meta.url)),
        contato: fileURLToPath(new URL("web/contato.html", import.meta.url)),
        diagnostico: fileURLToPath(new URL("web/diagnostico.html", import.meta.url)),
      },
    },
  },
  test: { root: ".", include: ["tests/**/*.test.ts"] },
} as any);
