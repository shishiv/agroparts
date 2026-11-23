#!/usr/bin/env bash
# Confere um deck animado antes da exportação. Se achar um problema, diz o que corrigir e sai 1.
#   contador: tl.seek(t) e tl.pause(t) do GSAP num deck que tem contador (onUpdate fora da casca do apresentador)
#   créditos: toda foto de fotos/ tem uma linha no arquivo de créditos do deck
#   texto e palavras: no quadro de repouso de cada slide, num Chromium a 1920x1080 (checar-slides.js e texto-cabe.js)
# Uso: deck/checar.sh <pasta do deck>   Precisa de agent-browser.
set -euo pipefail
aqui="$(cd "$(dirname "$0")" && pwd)"
deck="$(cd "${1:?uso: deck/checar.sh <pasta do deck>}" && pwd)"
html="$deck/index.html"
[ -f "$deck/composition/index.html" ] && html="$deck/composition/index.html"
nome="${deck#"$(dirname "$aqui")/"}"
problemas=0
avisa() { problemas=$((problemas + 1)); printf '%s\n' "$@"; }

js=(--include='*.html' --include='*.js' --exclude='*.min.js' --exclude-dir=vendor --exclude-dir=node_modules --exclude-dir=.hyperframes)
if grep -rqE 'onUpdate' "${js[@]}" --exclude='apresentar*' --exclude='apresentador*' "$deck"; then
  while IFS= read -r achado; do
    avisa "${achado#"$deck/"}" \
      "  erro: seek(t) e pause(t) do GSAP pulam o onUpdate; ao voltar ou abrir num slide o contador fica com o número velho." \
      "  use tl.pause(); tl.seek(t, false). Exemplo: deck/brag/tipografia/apresentar.html, função ir()."
  done < <(grep -rnE '\btl(\.pause\(\))?\.seek\(([^(),]|\([^()]*\))+\)|\btl\.pause\(([^(),]|\([^()]*\))+\)' "${js[@]}" "$deck" | grep -vE '\.seek\(0\)' || true)
fi

creditos="$(find "$deck" -iname 'creditos*' -not -path '*/node_modules/*' | head -1)"
while IFS= read -r foto; do
  arquivo="${foto##*/}"
  [ -n "$creditos" ] && grep -qF "$arquivo" "$creditos" && continue
  avisa "${foto#"$deck/"}" \
    "  erro: foto sem crédito. Foto CC BY sem autor e licença viola a licença (AGENTS.md: \"Não implemente sobre código ou dados de terceiro sem licença compatível verificada\")." \
    "  ponha uma linha com \"$arquivo\", o autor, a licença e o link no CREDITOS.md do deck; foto do próprio projeto diz \"do projeto\". Modelo: deck/brag/cinema/CREDITOS.md."
done < <(find "$deck" -path '*/fotos/*' -regextype posix-extended -iregex '.*\.(jpe?g|png|webp)' -not -path '*/node_modules/*' -not -path '*/.hyperframes/*' | sort)

ab=(agent-browser --session "checar-$(basename "$deck")")
"${ab[@]}" set viewport 1920 1080 1 >/dev/null
"${ab[@]}" open "file://$html" >/dev/null
slides="$("${ab[@]}" eval "($(cat "$aqui/checar-slides.js"))($(cat "$aqui/texto-cabe.js"))")"
"${ab[@]}" close >/dev/null || true
while IFS= read -r linha; do
  case "$linha" in
    ok) ;;
    *palavras\ na\ tela*) avisa "$linha" "  corte texto de apoio. Se o trecho é a cópia de uma tela do site, marque-o com data-tela-do-site." ;;
    *texto\ *) avisa "$linha" "  encurte o texto ou aumente a caixa. Se o elemento esconde texto de propósito (máscara, odômetro), marque-o com data-layout-allow-overflow." ;;
    *) avisa "$linha" ;;
  esac
done < <(python3 -c 'import json, sys; print(json.loads(sys.stdin.read()))' <<<"$slides")

if [ "$problemas" -gt 0 ]; then
  echo "deck/checar.sh: $problemas problema(s) em $nome; corrija antes de exportar." >&2
  exit 1
fi
echo "deck/checar.sh: $nome ok"
