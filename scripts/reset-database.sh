#!/bin/bash
# reset-database.sh - Reseta o banco de dados Prisma/Postgres (desenvolvimento)

set -e

npx prisma migrate reset --force --skip-seed
