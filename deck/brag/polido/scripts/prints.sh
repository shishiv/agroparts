#!/usr/bin/env bash
# Passa pela casca e tira a print do quadro final de cada slide, a 1920x1080 e a 1280x720.
# Uso: scripts/prints.sh <pasta-de-saida>   (precisa do agent-browser; serve a pasta na porta 8731)
set -euo pipefail
pasta="$(cd "$(dirname "$0")/.." && pwd)"
saida="$(mkdir -p "$1" && cd "$1" && pwd)"
s=(agent-browser --session deck-polido-prints)

python3 -m http.server 8731 --bind 127.0.0.1 --directory "$pasta" >/dev/null 2>&1 &
servidor=$!
trap 'kill "$servidor" 2>/dev/null; "${s[@]}" close >/dev/null 2>&1 || true' EXIT
sleep 0.5

for tam in 1920x1080 1280x720; do
  "${s[@]}" set viewport "${tam%x*}" "${tam#*x}" >/dev/null
  "${s[@]}" open "http://127.0.0.1:8731/apresentar.html?p=$RANDOM" >/dev/null
  "${s[@]}" wait 1500 >/dev/null
  finais="$("${s[@]}" eval 'slides.map(s => paradas.filter(p => p.slide === s).at(-1)).map(p => paradas.indexOf(p)).join(" ")' | tr -d '"')"
  n=1
  for i in $finais; do
    "${s[@]}" eval "irPara($i)" >/dev/null
    "${s[@]}" wait 300 >/dev/null
    "${s[@]}" screenshot "$saida/$tam-slide-$(printf %02d $n).png" >/dev/null
    n=$((n + 1))
  done
done
ls "$saida"
