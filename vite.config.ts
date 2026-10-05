import { defineConfig } from "vite";

export default defineConfig({
  root: "web",
  publicDir: "../public",
  build: { outDir: "../dist", emptyOutDir: true },
  test: { root: ".", include: ["tests/**/*.test.ts"] },
} as any);
