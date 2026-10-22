import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: "web",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    // Duas páginas: o protótipo em / e o contato em /contato.
    rolldownOptions: {
      input: {
        index: fileURLToPath(new URL("web/index.html", import.meta.url)),
        contato: fileURLToPath(new URL("web/contato.html", import.meta.url)),
      },
    },
  },
  test: { root: ".", include: ["tests/**/*.test.ts"] },
} as any);
