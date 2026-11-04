#!/usr/bin/env bash
# Refaz as reservas do deck do zero: checa a composição, grava o MP4 que passa sozinho,
# tira o quadro final de cada slide e junta os quadros num PDF.
# Uso: scripts/exportar.sh [pasta-de-saida]   (padrão: saida/)
set -euo pipefail
pasta="$(cd "$(dirname "$0")/.." && pwd)"
saida="$(mkdir -p "${1:-$pasta/saida}" && cd "${1:-$pasta/saida}" && pwd)"
hf=(npx --yes hyperframes@0.9.12)
export HYPERFRAMES_NO_UPDATE_CHECK=1

cd "$pasta"
"${hf[@]}" check

# Quadro final de cada slide: a última parada de cada section.slide.
finais="$(python3 - "$pasta/index.html" <<'PY'
import re, sys
html = open(sys.argv[1], encoding="utf-8").read()
tempos = []
for tag in re.findall(r'<section\b[^>]*class="slide[^"]*"[^>]*>', html, re.S):
    inicio = float(re.search(r'data-start="([\d.]+)"', tag).group(1))
    paradas = re.search(r'data-paradas="([^"]+)"', tag).group(1)
    ultima = float(paradas.split(",")[-1].split("-")[1])
    tempos.append(f"{inicio + ultima + 0.05:.2f}")
print(",".join(tempos))
PY
)"

rm -rf "$saida/quadros"
"${hf[@]}" snapshot --at "$finais" --no-end --output "$saida/quadros"
mapfile -t pngs < <(ls "$saida"/quadros/*.png | sort -V)
magick "${pngs[@]}" -background "#f3f4f2" -alpha remove -units PixelsPerInch -density 144 "$saida/agroparts-deck-polido.pdf"

"${hf[@]}" render --quality delivery --output "$saida/agroparts-deck-polido.mp4"
echo "Pronto: $saida/agroparts-deck-polido.mp4, $saida/agroparts-deck-polido.pdf e $saida/quadros/"
