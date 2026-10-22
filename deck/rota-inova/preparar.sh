#!/bin/sh
# Recorta as ilustrações do modelo do Canva para a pasta do deck.
# As ilustrações são elementos do Canva e ficam fora do Git, como em docs/rota-inova/.
# Precisa de Python 3 e pdftocairo (poppler). Sem eles, o deck abre sem as ilustrações.
set -eu
aqui=$(cd "$(dirname "$0")" && pwd)
modelo="$aqui/../../docs/rota-inova/modelo"
destino="$aqui/slides/rota-inova-pitch/assets/canva"

if ! python3 -B "$modelo/extrair-ilustracoes.py" >/dev/null; then
  echo "preparar.sh: não consegui recortar as ilustrações do modelo; o deck abre sem elas." >&2
  exit 0
fi
mkdir -p "$destino"
for nome in aviao busca celular chave-branca-canto janelas lampada livro notebook notebook-grande pessoa-no-computador tomada; do
  cp "$modelo/ilustracoes/$nome.svg" "$destino/$nome.svg"
done
