#!/usr/bin/env bash
# Rebuilds the backups from the composition: one PNG per slide at its rest frame, the PDF of those
# frames, and the MP4 of the deck playing by itself, with the first slide's rest frame as frame 0.
# Usage: scripts/exportar.sh <output-dir> [--sem-mp4]
set -euo pipefail

DECK="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(mkdir -p "$1" && cd "$1" && pwd)"
HF="$DECK/node_modules/.bin/hyperframes"

# Rest frame of each slide: 0.3 s before its end (where its blur-out starts), the last one at its final frame.
REPOUSOS="$(node -e '
const html = require("fs").readFileSync(process.argv[1], "utf8");
const slides = [...html.matchAll(/<section id="(s\d+)" class="clip slide" data-hold data-start="([\d.]+)" data-duration="([\d.]+)"/g)];
const t = slides.map(([, , s, d], i) => (Number(s) + Number(d) - (i === slides.length - 1 ? 1 / 30 : 0.3)).toFixed(3));
console.log(t.join(","));
' "$DECK/index.html")"

rm -rf "$OUT/quadros"
"$HF" snapshot "$DECK" --at "$REPOUSOS" --no-end --output "$OUT/quadros" >/dev/null
mapfile -t QUADROS < <(ls "$OUT"/quadros/*.png | sort -V)
magick "${QUADROS[@]}" -quality 92 "$OUT/deck-reserva.pdf"
echo "pdf: $OUT/deck-reserva.pdf (${#QUADROS[@]} slides)"

[ "${2:-}" = "--sem-mp4" ] && exit 0

"$HF" render "$DECK" --output "$OUT/deck-cru.mp4" --fps 30 --quality high
ffmpeg -loglevel error -y -i "$OUT/deck-cru.mp4" -i "${QUADROS[0]}" \
  -filter_complex "[1:v]scale=1920:1080[p];[0:v][p]overlay=enable='eq(n\,0)'" \
  -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart -an "$OUT/deck.mp4"
rm -f "$OUT/deck-cru.mp4"
echo "mp4: $OUT/deck.mp4"
