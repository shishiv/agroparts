#!/usr/bin/env bash
# Roda o check do HyperFrames e imprime só o placar e os erros e avisos. Sai 1 se houver erro.
set -euo pipefail
aqui="$(cd "$(dirname "$0")" && pwd)"
saida="$(mktemp)"
( cd "$aqui/composition" && npx --yes hyperframes@0.9.12 check --json >"$saida" 2>&1 ) || true
python3 - "$saida" <<'EOF'
import json, sys
texto = open(sys.argv[1]).read()
r = json.loads(texto[texto.index("{"):])
erros = 0
for nome, parte in r.items():
    if isinstance(parte, dict) and "ok" in parte:
        print(f"{nome}: ok={parte['ok']} erros={parte.get('errorCount', 0)} avisos={parte.get('warningCount', 0)}")
        erros += parte.get("errorCount", 0)
        for f in parte.get("findings", []):
            if f.get("severity") in ("error", "warning"):
                print(f"  {f['severity']} {f['code']} {f.get('selector')} t={f.get('time')}: {f['message'][:200]}")
sys.exit(1 if erros else 0)
EOF
