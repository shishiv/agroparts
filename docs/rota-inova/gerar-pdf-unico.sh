#!/usr/bin/env bash
# Gera os PDFs únicos das quatro entregas do Rota Inova, a partir de entrega-unica.html:
#   entregas/agroparts-rota-inova-curto.pdf  versão curta, para enviar (slides marcados com data-curto)
#   entregas/agroparts-rota-inova.pdf        versão completa
# Cada PDF junta as páginas 1 e 2 do modelo do Canva (capa e canvas de ideação, sem redesenho)
# com os slides, nesta ordem:
#   página 1 do modelo, slide 1 (divisória da ideação), página 2 do modelo, slides 2 em diante.
# Requisitos: Chromium ou Google Chrome, qpdf, pdfinfo e pdftocairo (poppler) e Python 3.
# Uso: ./gerar-pdf-unico.sh
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
modelo="$here/modelo/modelo-canva.pdf"

browser="${CHROME:-}"
if [ -z "$browser" ]; then
  for candidate in chromium chromium-browser google-chrome google-chrome-stable; do
    if command -v "$candidate" >/dev/null 2>&1; then browser="$candidate"; break; fi
  done
fi
if [ -z "$browser" ]; then
  echo "Chromium ou Chrome não encontrado. Defina CHROME=/caminho/do/navegador." >&2
  exit 1
fi
for tool in qpdf pdfinfo pdftocairo python3; do
  command -v "$tool" >/dev/null 2>&1 || { echo "Falta o programa $tool." >&2; exit 1; }
done

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Recorta as ilustrações do modelo. Elas ficam fora do Git: são elementos do Canva,
# e o repositório guarda só o PDF exportado pela equipe.
python3 -B "$here/modelo/extrair-ilustracoes.py" >/dev/null

gerar() { # $1 = versão (completa ou curta), $2 = nome do PDF sem extensão
  local pagina="file://$here/entrega-unica.html?versao=$1"
  local destino="$here/entregas/$2.pdf"
  local slides="$tmp/$1.pdf"

  # 1. Confere o layout: texto fora do slide, texto vazando de painel, texto sobre ilustração ou foto,
  #    crédito fora da foto, imagem quebrada.
  "$browser" --headless --disable-gpu --no-sandbox --window-size=1920,1080 --virtual-time-budget=8000 \
    --dump-dom "$pagina&checar=1" 2>/dev/null >"$tmp/dom-$1.html"
  local checagem
  checagem="$(python3 - "$tmp/dom-$1.html" <<'PY'
import html, re, sys
achados = re.findall(r'<pre id="checagem">(.*?)</pre>', open(sys.argv[1], encoding="utf-8").read(), re.S)
print(html.unescape(achados[-1]) if achados else "a checagem não rodou")
PY
)"
  if [ "$checagem" != "ok" ]; then
    echo "Problemas de layout na versão $1 de entrega-unica.html:" >&2
    echo "$checagem" >&2
    exit 1
  fi

  # 2. Imprime os slides em PDF, com o mesmo método do gerar-pdfs.sh.
  "$browser" --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
    --run-all-compositor-stages-before-draw --virtual-time-budget=8000 \
    --print-to-pdf="$slides" "$pagina" >/dev/null 2>&1

  # 3. Junta as páginas do modelo com os slides. As páginas do modelo entram como estão.
  qpdf "$slides" --pages "$modelo" 1 "$slides" 1 "$modelo" 2 "$slides" 2-z -- "$destino"

  local paginas total_slides
  paginas="$(pdfinfo "$destino" | awk '/^Pages:/ {print $2}')"
  total_slides="$(pdfinfo "$slides" | awk '/^Pages:/ {print $2}')"
  if [ "$paginas" -ne $((total_slides + 2)) ]; then
    echo "Contagem de páginas errada em $2.pdf: $paginas páginas, $total_slides slides + 2 páginas do modelo." >&2
    exit 1
  fi
  if pdfinfo -l -1 "$destino" | awk '/^Page.*size:/ && !/1440 x 810 pts/ {bad=1} END {exit !bad}'; then
    echo "Alguma página de $2.pdf não mede 1440 x 810 pt." >&2
    exit 1
  fi
  echo "gerado: entregas/$2.pdf ($paginas páginas)"

  # Miniaturas de todas as páginas, para revisão rápida. Precisa de pdftoppm e ImageMagick.
  if command -v pdftoppm >/dev/null 2>&1 && command -v magick >/dev/null 2>&1; then
    rm -f "$tmp"/mini-*.png
    pdftoppm -r 18 -png "$destino" "$tmp/mini" 2>/dev/null
    magick montage "$tmp"/mini-*.png -tile 8x -geometry 360x203+6+6 -background "#e6e7f5" \
      -quality 82 "$here/entregas/$2-miniaturas.jpg"
    echo "gerado: entregas/$2-miniaturas.jpg"
  fi

  # O formulário aceita até 10 MB por arquivo.
  local size
  size=$(stat -c %s "$destino")
  if [ "$size" -gt 10485760 ]; then echo "ATENÇÃO: $2.pdf passa de 10 MB ($size bytes)" >&2; fi
}

gerar curta agroparts-rota-inova-curto
gerar completa agroparts-rota-inova
