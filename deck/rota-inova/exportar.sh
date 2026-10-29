#!/bin/sh
# Exporta o deck pelo export de PDF do próprio open-slide, num navegador headless.
#   exportado/agroparts-rota-inova-pitch.pdf   PDF 16:9, uma página por slide (vai para o Git)
#   exportado/png/slide-NN.png                 uma imagem de 1920 x 1080 por slide (fora do Git)
# Antes de imprimir, confere o layout de cada página com checar-layout.js e para se houver problema.
# Precisa de agent-browser, Node, poppler (pdfinfo e pdftocairo) e do editor rodando:
#   bun run dev --host 127.0.0.1 --port 5181
# Uso: sh exportar.sh [url-do-editor] [id-do-slide]   (padrão: http://127.0.0.1:5181 e rota-inova-pitch)
# Para outro deck, o PDF e as imagens levam o id: exportado/<id>.pdf e exportado/png-<id>/.
set -eu
aqui=$(cd "$(dirname "$0")" && pwd)
base=${1:-http://127.0.0.1:5181}
slide=${2:-rota-inova-pitch}
url="$base/s/$slide"
saida="$aqui/exportado"
if [ "$slide" = rota-inova-pitch ]; then pdf="$saida/agroparts-rota-inova-pitch.pdf"; png="$saida/png"; else pdf="$saida/$slide.pdf"; png="$saida/png-$slide"; fi
nav="agent-browser --session ${AGENT_BROWSER_SESSION:-agroparts-deck-open-slide}"

curl -fsS -o /dev/null "$base/" || { echo "exportar.sh: o editor não responde em $base" >&2; exit 1; }
mkdir -p "$png"

$nav set viewport 1920 1080 >/dev/null
$nav open "$url" >/dev/null
sleep 2
# O export do open-slide monta as páginas em #os-print-root e chama window.print().
# Aqui window.print() só avisa que as páginas estão prontas; a impressão vem depois, pelo DevTools.
$nav eval "window.__osPrint=false; window.print=()=>{window.__osPrint=true}; 'ok'" >/dev/null
$nav find role button click --name "Download" >/dev/null
sleep 1
$nav find role menuitem click --name "Export as PDF" >/dev/null
pronto=false
for _ in $(seq 1 120); do
  [ "$($nav eval 'window.__osPrint')" = "true" ] && { pronto=true; break; }
  sleep 0.5
done
[ "$pronto" = true ] || { echo "exportar.sh: o export do open-slide não chegou a imprimir" >&2; exit 1; }

checagem=$($nav eval "$(cat "$aqui/checar-layout.js")")
if [ "$checagem" != '"ok"' ]; then
  echo "exportar.sh: problemas de layout:" >&2
  printf '%b\n' "$checagem" >&2
  $nav eval "window.dispatchEvent(new Event('afterprint')); 'ok'" >/dev/null
  exit 1
fi

node "$aqui/imprimir-pdf.mjs" "$($nav get cdp-url)" "$url" "$pdf" >/dev/null
$nav eval "window.dispatchEvent(new Event('afterprint')); 'ok'" >/dev/null

paginas=$(pdfinfo "$pdf" | awk '/^Pages:/ {print $2}')
tamanho=$(pdfinfo "$pdf" | awk -F': *' '/^Page size:/ {print $2}')
rm -f "$png"/slide-*.png
pdftocairo -png -scale-to-x 1920 -scale-to-y 1080 "$pdf" "$png/slide"
echo "$pdf: $paginas páginas, $tamanho"
echo "$png: $(ls "$png" | wc -l) imagens"
