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

# psql Basiskommando (keine RC-Datei, bei Fehlern abbrechen)
PSQL_BASE=(psql -X -v ON_ERROR_STOP=1 -d "$DATABASE_URL")

echo "==> connectivity check"
PGCONNECT_TIMEOUT=5 "${PSQL_BASE[@]}" -qAtc 'select 1;' >/dev/null
PGCONNECT_TIMEOUT=5 "${PSQL_BASE[@]}" -qAtc 'select current_database(), current_user;' >/dev/null

# --- run migrations (sorted) ---
MIG_DIR="${MIG_DIR:-payment-core/infra/db/migrations}"
if [[ ! -d "$MIG_DIR" ]]; then
  echo "❌ migrations dir not found: $MIG_DIR"
  exit 1
fi

# Dateien sammeln & sortieren
shopt -s nullglob
files=( "$MIG_DIR"/*.sql )
shopt -u nullglob
if (( ${#files[@]} == 0 )); then
  echo "ℹ️  no *.sql found in $MIG_DIR (nothing to apply)"
  exit 0
fi
IFS=$'\n' read -r -d '' -a sorted < <(printf '%s\n' "${files[@]}" | sort && printf '\0')

echo "==> applying migrations from: $MIG_DIR"
APPLIED=0
for f in "${sorted[@]}"; do
  echo "----> $(basename "$f")"
  "${PSQL_BASE[@]}" -f "$f"
  ((APPLIED+=1))
done

echo "✅ migrations applied: $APPLIED file(s)"
