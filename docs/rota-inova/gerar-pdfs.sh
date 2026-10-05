#!/usr/bin/env bash
# Gera os PDFs das entregas do Rota Inova a partir dos arquivos HTML desta pasta.
# Requisito: Chromium ou Google Chrome instalado. Uso: ./gerar-pdfs.sh [arquivo.html ...]
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
out="$here/entregas"
mkdir -p "$out"

browser="${CHROME:-}"
if [ -z "$browser" ]; then
  for candidate in chromium chromium-browser google-chrome google-chrome-stable; do
    if command -v "$candidate" >/dev/null 2>&1; then browser="$candidate"; break; fi
  done
fi
if [ -z "$browser" ]; then
  echo "Chromium ou Chrome não encontrado. Defina CHROME=/caminho/do/navegador." >&2
  exit 1
fi

print_pdf() { # $1 = URL de origem, $2 = PDF de destino
  "$browser" --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
    --run-all-compositor-stages-before-draw --virtual-time-budget=5000 \
    --print-to-pdf="$2" "$1" >/dev/null 2>&1
  echo "gerado: ${2#"$here"/}"
}

if [ "$#" -gt 0 ]; then sources=("$@"); else sources=("$here"/0[1-4]-*.html); fi

for src in "${sources[@]}"; do
  name="$(basename "$src" .html)"
  print_pdf "file://$here/$name.html" "$out/$name.pdf"
  # O pitch também sai só com os slides, para projetar.
  if [ "$name" = "04-pitch" ]; then
    print_pdf "file://$here/$name.html?somente=deck" "$out/04-pitch-deck-para-projetar.pdf"
  fi
done

# Cada arquivo do formulário aceita até 10 MB.
for pdf in "$out"/*.pdf; do
  size=$(stat -c %s "$pdf")
  if [ "$size" -gt 10485760 ]; then echo "ATENÇÃO: $(basename "$pdf") passa de 10 MB ($size bytes)" >&2; fi
done
