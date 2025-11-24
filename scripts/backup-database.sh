#!/bin/bash
# backup-database.sh - Backup do banco de dados Postgres (Neon)

PG_URL="$DATABASE_URL"
BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).sql"

pg_dump "$PG_URL" > "$BACKUP_FILE"
echo "Backup salvo em $BACKUP_FILE"
