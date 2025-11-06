#!/usr/bin/env bash
# scripts/db_migrate.sh
set -euo pipefail

# --- load env (.env.payment) ---
ENV_FILE="${ENV_FILE:-.env.payment}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ ENV file not found: $ENV_FILE"
  exit 1
fi
# robust: übernimmt auch Werte mit Leerzeichen/@/Klammern/Quotes
set -a
. "$ENV_FILE"
set +a

: "${DATABASE_URL:?❌ DATABASE_URL missing in $ENV_FILE}"

# --- psql presence ---
if ! command -v psql >/dev/null 2>&1; then
  echo "❌ psql not found. macOS: brew install libpq && brew link --force libpq"
  exit 1
fi

PSQL="psql -v ON_ERROR_STOP=1 \"$DATABASE_URL\""

echo "==> connectivity check"
eval $PSQL -c "select version();"
eval $PSQL -c "select current_database() as db, current_user as usr;"

# --- run migrations (sorted) ---
MIG_DIR="${MIG_DIR:-lib/payment-core/infra/db/migrations}"
if [[ ! -d "$MIG_DIR" ]]; then
  echo "❌ migrations dir not found: $MIG_DIR"
  exit 1
fi

echo "==> applying migrations from: $MIG_DIR"
APPLIED=0
# apply *.sql in lexical order (001_*.sql, 002_*.sql, …)
for f in $(ls -1 "$MIG_DIR"/*.sql | sort); do
  echo "----> $f"
  eval $PSQL -f "$f"
  ((APPLIED+=1))
done

echo "✅ migrations applied: $APPLIED file(s)"
