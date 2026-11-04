#!/usr/bin/env bash
# Abre o deck em tela cheia, sem internet: serve esta pasta e abre o navegador em modo quiosque.
set -euo pipefail
pasta="$(cd "$(dirname "$0")/.." && pwd)"
porta="${PORTA:-8731}"
url="http://127.0.0.1:${porta}/apresentar.html"

python3 -m http.server "$porta" --bind 127.0.0.1 --directory "$pasta" >/dev/null 2>&1 &
servidor=$!
trap 'kill "$servidor" 2>/dev/null' EXIT
sleep 0.5

for nav in google-chrome google-chrome-stable chromium chromium-browser brave-browser microsoft-edge; do
  if command -v "$nav" >/dev/null; then
    "$nav" --kiosk --no-first-run --user-data-dir="$(mktemp -d)" "$url"
    exit 0
  fi
done
echo "Abra no navegador e aperte F: $url"
wait "$servidor"
