#!/usr/bin/env bash
set -euo pipefail

# Repo-Root ermitteln
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.."; pwd)"

# .env laden (lokal: .env.payment; Fallback: env.txt falls du sie so benannt hast)
if [ -f "$ROOT_DIR/.env.payment" ]; then
  set -a; . "$ROOT_DIR/.env.payment"; set +a
elif [ -f "$ROOT_DIR/env.txt" ]; then
  set -a; . "$ROOT_DIR/env.txt"; set +a
else
  echo "❌ Keine .env.payment oder env.txt im Repo-Root gefunden." >&2
  exit 1
fi

# Defaults
APP_BASE_URL="${APP_BASE_URL:-http://localhost:3000}"
STAGING_BASE_URL="${STAGING_BASE_URL:-$APP_BASE_URL}"

# Helper
jq_bin() { command -v jq >/dev/null 2>&1 && echo jq || echo cat; }
JQ="$(jq_bin)"
