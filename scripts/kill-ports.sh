#!/usr/bin/env bash
set -euo pipefail
P="${PORT:-3020}"

# tenta matar next dev / next-server
pkill -9 -f "next dev" 2>/dev/null || true
pkill -9 -f "next-server" 2>/dev/null || true

# mata quem escuta na porta P
if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -t -iTCP:${P} -sTCP:LISTEN 2>/dev/null || true)"
  if [ -n "${PIDS}" ]; then kill -9 ${PIDS} 2>/dev/null || true; fi
fi

# tenta fuser (se existir)
if command -v fuser >/dev/null 2>&1; then
  fuser -k -n tcp ${P} 2>/dev/null || true
fi

# confirma
if command -v ss >/dev/null 2>&1; then
  if ss -ltn "sport = :${P}" | awk 'NR>1{exit 0} END{exit 1}'; then
    echo "[kill-ports] AVISO: porta ${P} ainda ocupada, dev usará fallback." >&2
  else
    echo "[kill-ports] Porta ${P} liberada."
  fi
else
  echo "[kill-ports] ss indisponível; prosseguindo."
fi
