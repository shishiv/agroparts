#!/bin/sh
# Recorta telas reais do protótipo publicado (https://agroparts.pages.dev) para as duas páginas dos passos.
# Um caso só, do começo ao fim: o código 283529 do catálogo do governo, o rolamento 6312 ZZ da página do teste.
# A tela é a de um celular de 360 px de largura, capturada a 3 px por px; cada recorte é a caixa de um elemento.
# Precisa de agent-browser, ImageMagick e internet.
# Uso: sh capturar-telas.sh [pasta]   (padrão: slides/rota-inova-pitch/assets/telas)
set -eu
aqui=$(cd "$(dirname "$0")" && pwd)
saida=${1:-$aqui/slides/rota-inova-pitch/assets/telas}
site=https://agroparts.pages.dev/
codigo=283529
nav="agent-browser --session ${AGENT_BROWSER_SESSION:-agroparts-deck-open-slide}"
dpr=3
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$saida"
rm -f "$saida"/passo-*.png

# Caixa, em px CSS da página inteira, que une os elementos visíveis do seletor, com uma folga em volta.
caixa() {
  $nav eval "(() => { const els = [...document.querySelectorAll('$1')].filter((e) => e.getClientRects().length); if (!els.length) return 'nada'; const rs = els.map((e) => e.getBoundingClientRect()); const f = $2; const l = Math.max(0, Math.min(...rs.map((r) => r.left)) - f), t = Math.min(...rs.map((r) => r.top)) + scrollY - f; const r = Math.min(innerWidth, Math.max(...rs.map((r) => r.right)) + f), b = Math.max(...rs.map((r) => r.bottom)) + scrollY + f; return [l, t, r - l, b - t].map(Math.round).join(' '); })()" | tr -d '"'
}
recortar() { # recortar <captura> <seletor> <folga> <arquivo>
  set -- "$1" "$2" "$3" "$4" $(caixa "$2" "$3")
  [ "$5" = nada ] && { echo "capturar-telas.sh: nenhum elemento visível em $2" >&2; exit 1; }
  magick "$1" -crop "$(($7 * dpr))x$(($8 * dpr))+$(($5 * dpr))+$(($6 * dpr))" +repage -strip "$saida/$4"
  echo "$saida/$4: $(identify -format '%wx%h' "$saida/$4")"
}

$nav set viewport 360 1600 $dpr >/dev/null
$nav open about:blank >/dev/null
$nav open "$site" >/dev/null
sleep 1.5
$nav fill "#texto" "$codigo" >/dev/null
$nav press Enter >/dev/null
sleep 3
# O deck não leva texto de apoio: some a legenda dos desenhos, a frase que explica cada grupo, a semelhança de
# texto, o link do catálogo e o traço que abre cada lista. O resto é a tela como o protótipo a mostra. Cada cadastro
# achado ganha uma marca (data-captura) para o recorte achá-lo pelo código.
$nav eval "(() => {
  document.activeElement.blur();
  document.head.insertAdjacentHTML('beforeend', '<style>.rol-legenda, .grupo-explica, .rol-figura figcaption, .rol-item figcaption, .item-alvo .etiqueta, .par .pequeno { display: none !important } .grupo .itens { border-top: 0 !important }</style>');
  document.querySelector('.ver-detalhes').open = true;
  for (const li of document.querySelectorAll('#resultado li.item')) li.dataset.captura = li.querySelector('.item-codigo').textContent.replace(/\\D/g, '');
  return 'ok';
})()" >/dev/null
sleep 0.5
$nav screenshot --full "$tmp/tela.png" >/dev/null

recortar "$tmp/tela.png" 'fieldset.modos, #texto, #form-resolver .primario' 6 passo-1-recebe.png
recortar "$tmp/tela.png" '.peca-linha' 10 passo-2-le.png
for alvo in 472657 357380 311967; do
  recortar "$tmp/tela.png" "[data-captura=\"$alvo\"] .rol-item, [data-captura=\"$alvo\"] .item-alvo" 8 "passo-3-busca-$alvo.png"
done
for alvo in 472657 311967; do
  recortar "$tmp/tela.png" "[data-captura=\"$alvo\"] .rol-item, [data-captura=\"$alvo\"] .item-alvo, [data-captura=\"$alvo\"] .ficha" 8 "passo-4-compara-$alvo.png"
done
for nivel in resolve revisa recusa; do
  recortar "$tmp/tela.png" ".grupo-$nivel .grupo-picto, .grupo-$nivel .grupo-cabeca h3" 8 "passo-5-$nivel.png"
done
recortar "$tmp/tela.png" '.ver-detalhes .par' 10 passo-6-registra.png
