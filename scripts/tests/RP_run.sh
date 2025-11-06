#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

# psql-Aufruf via DATABASE_URL aus .env
if ! command -v psql >/dev/null 2>&1; then
  echo "❌ psql fehlt lokal. Installiere psql (PostgreSQL Client)." >&2
  exit 1
fi

echo "▶ RP1: SQL-Invarianten"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$(dirname "$0")/RP1_sql_invariants.sql"
