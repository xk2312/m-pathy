#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

RESP="$(curl -sS -w '\n%{http_code}' "$APP_BASE_URL/api/live")"
CODE="$(printf "%s\n" "$RESP" | tail -n1)"
BODY="$(printf "%s\n" "$RESP" | sed '$d')"

echo "GET /api/live  → HTTP $CODE"
if command -v jq >/dev/null 2>&1; then
  printf "%s" "$BODY" | jq . 2>/dev/null || printf "%s\n" "$BODY"
else
  printf "%s\n" "$BODY"
fi

exit 0
