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
    aberto=$SECONDS
    "$nav" --kiosk --no-first-run --user-data-dir="$(mktemp -d)" "$url" >/dev/null 2>&1 || true
    # Fechar o navegador encerra o deck. Se ele nem abriu, o servidor continua para abrir à mão.
    [ $((SECONDS - aberto)) -gt 5 ] && exit 0
    break
  fi
done
echo "Abra no navegador e aperte F: $url"
wait "$servidor"
