#!/usr/bin/env bash
# FILE: scripts/unfreeze-prisma.sh
# Usage:
#   bash scripts/unfreeze-prisma.sh
#   bash scripts/unfreeze-prisma.sh --deploy   # só gerar/validar, sem db push/seed

set -euo pipefail

ROOT="${ROOT:-$(pwd)}"
cd "$ROOT"

echo "🔎 Checking environment…"
if ! command -v npx >/dev/null 2>&1; then
  echo "❌ npx not found"; exit 1
fi

if [ ! -f .env ]; then
  cat > .env <<'ENV'
# ---- REQUIRED (Neon) ----
# Example: postgresql://USER:PASSWORD@HOST/DB?sslmode=require
DATABASE_URL=
# Optional: for migrate dev shadow db
# SHADOW_DATABASE_URL=
# ---- App Secrets ----
JWT_SECRET=change-me
NEON_HTTP=true
NEXT_PUBLIC_APP_NAME="Bright & Shine OS"
NEXT_PUBLIC_SHOW_DEMO=false
NEXT_PUBLIC_DEMO_PWD=demo123
ENV
  echo "⚠️  .env created placeholder. Fill DATABASE_URL with sslmode=require."
fi

# Ensure sslmode=require is present
if grep -q '^DATABASE_URL=' .env; then
  VAL="$(grep '^DATABASE_URL=' .env | sed 's/^DATABASE_URL=//')"
  if [ -n "$VAL" ] && ! echo "$VAL" | grep -qi 'sslmode=require'; then
    echo "🔧 Adding sslmode=require to DATABASE_URL"
    NEW="$(printf "%s%s" "$VAL" "$(echo "$VAL" | grep -q '?' && echo '&sslmode=require' || echo '?sslmode=require')")"
    sed -i.bak "s|^DATABASE_URL=.*$|DATABASE_URL=$NEW|g" .env
  fi
fi

echo "🧹 Cleaning prisma state & caches…"
rm -rf node_modules/.cache || true
rm -rf prisma/migrations/_tmp* || true

# If migrate dev got stuck previously
rm -f prisma/dev.db-journal prisma/dev.db || true
# Optional lockfile cleanup (only if exists)
[ -f prisma/migrations/migration_lock.toml ] && rm -f prisma/migrations/migration_lock.toml || true

echo "🧰 Prisma format/validate"
npx --yes prisma format
npx --yes prisma validate

echo "🧪 Quick connection check (non-fatal)"
set +e
CONN_OK=1
node -e 'const { Client } = require("pg"); (async () => {
  const url = require("dotenv").config().parsed?.DATABASE_URL;
  if(!url){ console.log("no DATABASE_URL"); process.exit(2); }
  const c = new Client({ connectionString: url });
  try { await c.connect(); console.log("pg: ok"); await c.end(); process.exit(0); } catch(e){ console.log("pg: fail"); process.exit(1); }
})();'
code=$?
set -e
if [ $code -ne 0 ]; then
  echo "⚠️  DB connection not available now. Proceeding with OFFLINE migration (diff)…"
fi

echo "📝 Creating OFFLINE migration from current schema (no DB required)…"
mkdir -p prisma/migrations
MIG_NAME="init_entities_$(date +%Y%m%d_%H%M%S)"
mkdir -p "prisma/migrations/${MIG_NAME}"
npx --yes prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > "prisma/migrations/${MIG_NAME}/migration.sql"

echo "📦 Generate Prisma Client"
npx --yes prisma generate

if [ "${1:-}" = "--deploy" ]; then
  echo "✅ Offline migration ready at prisma/migrations/${MIG_NAME}"
  echo "   Use 'npx prisma migrate deploy' in Vercel/CI."
  exit 0
fi

if [ $code -eq 0 ]; then
  echo "🚀 Applying schema to DEV via db push (fast, no migrations history)…"
  npx --yes prisma db push
else
  echo "⏭️  Skipping db push (no DB). You can apply later with 'prisma migrate deploy' on Vercel."
fi

if [ $code -eq 0 ]; then
  echo "🌱 Seeding demo data (optional)…"
  npm run db:seed 2>/dev/null || echo "⚠️  seed skipped/failed (ok for now)"
fi

echo "🔍 Health check (if dev server running later): GET /api/health"
echo "✅ Done. Next steps:"
echo "   • Commit prisma/migrations/${MIG_NAME}/*"
echo "   • Locally: npm run dev"
echo "   • Vercel: prisma migrate deploy  (build step) && NEON_HTTP=true"
