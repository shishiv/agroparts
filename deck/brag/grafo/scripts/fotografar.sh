#!/usr/bin/env bash
# Fotografa o quadro final de cada slide e monta o PDF de reserva.
# Uso: deck/brag/grafo/scripts/fotografar.sh <pasta-de-saida> [largura altura]
set -euo pipefail
saida=${1:?pasta de saída}
w=${2:-1920}
h=${3:-1080}
deck=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$saida"
ab=(agent-browser --session "deck-grafo-$w")
"${ab[@]}" set viewport "$w" "$h" >/dev/null
n=$(grep -c 'data-slide$' "$deck/index.html")
for i in $(seq 1 "$n"); do
  "${ab[@]}" open "file://$deck/index.html?apresentar=1&v=$RANDOM#$i" >/dev/null
  "${ab[@]}" wait 900 >/dev/null
  "${ab[@]}" screenshot "$saida/slide-$(printf %02d "$i")-${w}x${h}.png" >/dev/null
done
"${ab[@]}" close >/dev/null || true
if [ "$w" = 1920 ]; then
  python3 - "$saida" <<'EOF'
import sys, glob
from PIL import Image
pasta = sys.argv[1]
fotos = [Image.open(f).convert("RGB") for f in sorted(glob.glob(f"{pasta}/slide-*-1920x1080.png"))]
fotos[0].save(f"{pasta}/deck-grafo.pdf", save_all=True, append_images=fotos[1:], resolution=96)
print(f"{len(fotos)} páginas em {pasta}/deck-grafo.pdf")
EOF
fi
