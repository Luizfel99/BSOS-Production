#!/usr/bin/env bash
set -euo pipefail
P="${PORT:-3020}"
pkill -9 -f "next dev" 2>/dev/null || true
pkill -9 -f "next-server" 2>/dev/null || true
if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -t -iTCP:${P} -sTCP:LISTEN 2>/dev/null || true)"
  [ -n "${PIDS:-}" ] && kill -9 $PIDS || true
fi
if command -v fuser >/dev/null 2>&1; then
  fuser -k -n tcp ${P} 2>/dev/null || true
fi
