#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

echo "▶ E/F/K Scan: JSON-Shape & Methoden"

check_json () {
  local path="$1"
  local resp code body
  resp="$(curl -sS -w '\n%{http_code}' -X GET "$APP_BASE_URL$path" -H 'Accept: application/json')"
  code="$(printf "%s\n" "$resp" | tail -n1)"
  body="$(printf "%s\n" "$resp" | sed '$d')"
  echo "GET $path → HTTP $code"
  if command -v jq >/dev/null 2>&1; then
    printf "%s" "$body" | jq . >/dev/null 2>&1 || echo "(non-JSON body; skipping jq)"
  fi
}

check_json "/api/live"
check_json "/api/ready"
check_json "/api/ledger/probe"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$APP_BASE_URL/api/buy/checkout-session")
test "$STATUS" -ge 400 && echo "✓ checkout-session GET blockiert (Status $STATUS)"
