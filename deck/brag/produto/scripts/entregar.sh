#!/usr/bin/env bash
# Refaz as reservas do deck numa pasta fora do repositório:
#   quadros/NN-<slide>.png  o quadro final de cada slide (data-pausa)
#   deck.pdf                esses quadros, um por página
#   deck.mp4                o deck passando sozinho: cada entrada, e o quadro final parado data-segurar segundos
# Uso: scripts/entregar.sh <pasta-de-saida>
set -euo pipefail

DECK="$(cd "$(dirname "$0")/.." && pwd)"
SAIDA="$(mkdir -p "$1" && cd "$1" && pwd)"
HF="npx --yes hyperframes@0.9.12"
COMP="$DECK/composition"

mapfile -t SLIDES < <(node -e '
  const html = require("fs").readFileSync(process.argv[1], "utf8");
  for (const [tag] of html.matchAll(/<section id="[^"]*" class="slide[^"]*"[^>]*>/g)) {
    const a = (n) => (tag.match(new RegExp(`data-${n}="([^"]*)"`)) || [])[1];
    console.log([tag.match(/id="([^"]*)"/)[1], a("start"), a("pausa"), a("segurar") ?? 3].join(" "));
  }' "$COMP/index.html")

rm -rf "$SAIDA/quadros" && mkdir -p "$SAIDA/quadros"
PAUSAS=$(printf '%s\n' "${SLIDES[@]}" | awk '{print $3}' | paste -sd,)
( cd "$COMP" && $HF snapshot --at "$PAUSAS" --no-end --keep --output "$SAIDA/quadros" >/dev/null )
i=0
for s in "${SLIDES[@]}"; do
  read -r id _ pausa _ <<<"$s"
  i=$((i + 1))
  mv "$SAIDA/quadros/at-${pausa}s.png" "$SAIDA/quadros/$(printf %02d $i)-${id#s-}.png"
done
magick "$SAIDA"/quadros/*.png -quality 92 "$SAIDA/deck.pdf"

( cd "$COMP" && $HF render --quality delivery --output "$SAIDA/filme.mp4" >/dev/null )
FILTRO="" ROTULOS=""
i=0
for s in "${SLIDES[@]}"; do
  read -r _ inicio pausa segurar <<<"$s"
  FILTRO+="[0:v]trim=start=${inicio}:end=${pausa},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${segurar}[v$i];"
  ROTULOS+="[v$i]"
  i=$((i + 1))
done
# O quadro final do slide 1 vira o quadro 0, a miniatura do vídeo no celular.
ffmpeg -y -loglevel error -i "$SAIDA/filme.mp4" -i "$(ls "$SAIDA"/quadros/01-*.png)" \
  -filter_complex "${FILTRO}${ROTULOS}concat=n=${i}:v=1:a=0[c];[c][1:v]overlay=enable='eq(n,0)',format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -crf 18 -preset medium -movflags +faststart "$SAIDA/deck.mp4"
rm "$SAIDA/filme.mp4"

ls -la "$SAIDA" "$SAIDA/quadros"
