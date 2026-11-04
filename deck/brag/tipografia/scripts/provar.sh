#!/usr/bin/env bash
# Walks the live deck (apresentar.html) at 1920x1080 and 1280x720 in agent-browser and saves the
# rest frame of every slide, then checks that → advances and ← goes back.
# Usage: scripts/provar.sh <output-dir>
set -euo pipefail

DECK="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(mkdir -p "$1" && cd "$1" && pwd)"
PORTA="${PORTA:-8093}"
export AGENT_BROWSER_SESSION="${AGENT_BROWSER_SESSION:-agroparts-brag-tipografia-prova}"

python3 -m http.server "$PORTA" --bind 127.0.0.1 --directory "$DECK" >/dev/null 2>&1 &
SERVIDOR=$!
trap 'kill "$SERVIDOR"' EXIT
sleep 1
URL="http://127.0.0.1:$PORTA/apresentar.html"
TOTAL="$(grep -c 'class="clip slide"' "$DECK/index.html")"

for TAM in 1920x1080 1280x720; do
  agent-browser set viewport "${TAM%x*}" "${TAM#*x}" 1 >/dev/null
  for ((i = 1; i <= TOTAL; i++)); do
    agent-browser open "about:blank" >/dev/null
    agent-browser open "$URL#$i" >/dev/null
    agent-browser wait 900 >/dev/null
    agent-browser screenshot "$OUT/$(printf 's%02d' "$i")-$TAM.png" >/dev/null
  done
done

agent-browser set viewport 1920 1080 1 >/dev/null
agent-browser open "about:blank" >/dev/null
agent-browser open "$URL#1" >/dev/null
agent-browser wait 900 >/dev/null
agent-browser press ArrowRight >/dev/null
agent-browser wait 400 >/dev/null
DEPOIS="$(agent-browser eval 'location.hash')"
agent-browser press ArrowLeft >/dev/null
agent-browser wait 400 >/dev/null
VOLTA="$(agent-browser eval 'location.hash')"
echo "slides: $TOTAL · → foi para $DEPOIS · ← voltou para $VOLTA"
echo "prints: $OUT"
