#!/usr/bin/env bash
# Sobe, confere e derruba uma instância do protótipo AgroParts para verificação.
# Uso: agroparts.sh start|doctor|stop|url
# Ambiente: AGROPARTS_VERIFY_DIR (obrigatório, absoluto, fora do repositório) e AGROPARTS_PORT (padrão 8790).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd -P)"
: "${AGROPARTS_VERIFY_DIR:?defina AGROPARTS_VERIFY_DIR com uma pasta absoluta só desta verificação}"
case "$AGROPARTS_VERIFY_DIR" in /*) ;; *) echo "AGROPARTS_VERIFY_DIR precisa ser absoluto" >&2; exit 2 ;; esac
case "$AGROPARTS_VERIFY_DIR/" in "$REPO"/*) echo "AGROPARTS_VERIFY_DIR não pode ficar dentro do repositório ($REPO)" >&2; exit 2 ;; esac
DIR="$AGROPARTS_VERIFY_DIR"
PORT="${AGROPARTS_PORT:-8790}"
INSPECT=$((PORT + 1000))
BASE="http://127.0.0.1:$PORT"
PIDFILE="$DIR/server.pid"
LOG="$DIR/server.log"

ENTRADAS=(web src functions public dados package.json bun.lock vite.config.ts wrangler.toml scripts/copiar-ocr.ts)
versao() {
  { git -C "$REPO" ls-tree -r HEAD -- "${ENTRADAS[@]}"; git -C "$REPO" diff HEAD -- "${ENTRADAS[@]}"; git -C "$REPO" ls-files --others --exclude-standard -- "${ENTRADAS[@]}"; } |
    sha256sum | cut -c1-12
}

vivo() { [[ -s "$PIDFILE" ]] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; }

dono_da_porta() { ss -ltnpH "sport = :$PORT" 2>/dev/null | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u; }

descendentes() {
  local p
  for p in $(pgrep -P "$1" 2>/dev/null); do echo "$p"; descendentes "$p"; done
}

pagina() { [[ "$(curl -fsS "$BASE/" 2>/dev/null)" == *'<title>AgroParts · Qual é esta peça?</title>'* ]]; }

motor() {
  curl -fsS -X POST -H 'content-type: application/json' -d '{"tipo":"codigo","texto":"311960"}' "$BASE/api/resolver" 2>/dev/null |
    jq -e '.decisao == "resolve" and any(.relacoes[]; .tipo == "SAME_AS" and .alvo == "CATMAT 311963")' >/dev/null
}

pronto() { pagina && motor; }

start() {
  mkdir -p "$DIR"
  if vivo; then echo "já existe uma instância desta pasta (pid $(cat "$PIDFILE")) em $BASE"; exit 0; fi
  if [[ -n "$(dono_da_porta)" ]]; then echo "a porta $PORT já tem dono (pid $(dono_da_porta | tr '\n' ' ')); escolha outra com AGROPARTS_PORT" >&2; exit 1; fi
  (cd "$REPO" && bun run build) >"$DIR/build.log" 2>&1 || { echo "o build falhou; veja $DIR/build.log" >&2; exit 1; }
  versao >"$DIR/build.txt"
  (
    cd "$REPO"
    exec nohup "$REPO/node_modules/.bin/wrangler" pages dev dist --ip 127.0.0.1 --port "$PORT" --inspector-port "$INSPECT" \
      --persist-to "$DIR/wrangler-state" --show-interactive-dev-session=false
  ) >"$LOG" 2>&1 </dev/null &
  echo $! >"$PIDFILE"
  for _ in $(seq 1 60); do
    if pronto; then echo "pronto em $BASE (pid $(cat "$PIDFILE"), log $LOG)"; return 0; fi
    vivo || { echo "o servidor saiu antes de ficar pronto; veja $LOG" >&2; tail -20 "$LOG" >&2; exit 1; }
    sleep 1
  done
  echo "o servidor não ficou pronto em 60 s; veja $LOG" >&2
  exit 1
}

doctor() {
  local falhas=0 pid donos
  ok() { echo "ok    $*"; }
  falha() { echo "FALHA $*"; falhas=$((falhas + 1)); }
  if vivo; then pid="$(cat "$PIDFILE")"; ok "processo $pid vivo"; else falha "nenhuma instância viva para $DIR"; echo "$falhas falha(s)"; exit 1; fi
  donos="$(dono_da_porta)"
  if [[ -n "$donos" ]] && grep -qxF -f <(echo "$pid"; descendentes "$pid") <<<"$donos"; then ok "a porta $PORT é desta instância"; else falha "a porta $PORT não é desta instância (dono: ${donos:-ninguém})"; fi
  if diff -q <(versao) "$DIR/build.txt" >/dev/null; then ok "o build é do código atual (versão $(cat "$DIR/build.txt"))"; else falha "o código mudou depois do build; rode stop e start de novo"; fi
  if pagina; then ok "GET / devolve o protótipo"; else falha "GET / não devolve o protótipo"; fi
  if curl -fsS "$BASE/api/fontes" | jq -e '.versao_regras' >/dev/null; then ok "GET /api/fontes responde"; else falha "GET /api/fontes não responde"; fi
  if motor; then ok "POST /api/resolver 311960 dá SAME_AS 311963"; else falha "o motor não resolve 311960"; fi
  echo "$falhas falha(s)"
  [[ $falhas -eq 0 ]]
}

stop() {
  if ! vivo; then echo "nenhuma instância viva para $DIR"; rm -f "$PIDFILE"; return 0; fi
  local pid filhos
  pid="$(cat "$PIDFILE")"
  filhos="$(descendentes "$pid")"
  kill "$pid" 2>/dev/null || true
  for _ in $(seq 1 20); do kill -0 "$pid" 2>/dev/null || break; sleep 0.5; done
  for p in $filhos; do kill "$p" 2>/dev/null || true; done
  rm -f "$PIDFILE"
  if [[ -n "$(dono_da_porta)" ]]; then echo "a porta $PORT ainda tem dono depois do stop: $(dono_da_porta)" >&2; exit 1; fi
  echo "parado; a evidência continua em $DIR"
}

case "${1:-}" in
  start) start ;;
  doctor) doctor ;;
  stop) stop ;;
  url) echo "$BASE" ;;
  *) echo "uso: $0 start|doctor|stop|url" >&2; exit 2 ;;
esac
