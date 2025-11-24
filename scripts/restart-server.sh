#!/usr/bin/env bash
set -euo pipefail
P="${PORT:-3020}"
echo "[restart] killing next on ${P}…"
lsof -ti:"$P" | xargs -r kill -9 2>/dev/null || true
pkill -f "next dev|next-server" 2>/dev/null || true
echo "[restart] clearing cache…"
rm -rf .next .turbo node_modules/.cache || true
echo "[restart] starting dev with fallback (Turbopack if TURBOPACK=1)…"
TURBOPACK="${TURBOPACK:-}" node scripts/dev-with-fallback.mjs
