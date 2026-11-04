#!/usr/bin/env bash
# Refaz as reservas do deck a partir da pasta: a print do quadro final de cada slide a 1920x1080 e 1280x720
# (pelo modo apresentador, no agent-browser), o PDF com as prints de 1920 e o MP4 do deck passando sozinho.
# Uso: deck/brag/cinema/exportar.sh <pasta de saída>
set -euo pipefail
aqui="$(cd "$(dirname "$0")" && pwd)"
saida="$(mkdir -p "${1:?uso: exportar.sh <pasta de saída>}" && cd "$1" && pwd)"
export AGENT_BROWSER_SESSION="${AGENT_BROWSER_SESSION:-agroparts-brag-cinema}"
url="file://$aqui/composition/index.html?apresentar"

for tamanho in 1920x1080 1280x720; do
  mkdir -p "$saida/prints-$tamanho"
  agent-browser set viewport "${tamanho%x*}" "${tamanho#*x}" 1 >/dev/null
  agent-browser open "$url#1" >/dev/null
  total="$(agent-browser eval 'document.querySelectorAll("#root > .slide").length' | tr -dc 0-9)"
  for i in $(seq 1 "$total"); do
    agent-browser open "about:blank" >/dev/null
    agent-browser open "$url#$i" >/dev/null
    agent-browser wait 2600 >/dev/null
    agent-browser screenshot "$saida/prints-$tamanho/slide-$(printf %02d "$i").png" >/dev/null
  done
  echo "$total prints em $saida/prints-$tamanho"
done

magick "$saida"/prints-1920x1080/slide-*.png -quality 92 "$saida/agroparts-cinema.pdf"
echo "PDF: $saida/agroparts-cinema.pdf"

( cd "$aqui/composition" && npx --yes hyperframes@0.9.12 render --quiet --output "$saida/agroparts-cinema.mp4" )
echo "MP4: $saida/agroparts-cinema.mp4"
