#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

echo "▶ E/F/K Scan: JSON-Shape & Methoden"
curl -sS -X GET  "$APP_BASE_URL/api/live"  -H 'Accept: application/json' | $JQ >/dev/null
curl -sS -X GET  "$APP_BASE_URL/api/ready" -H 'Accept: application/json' | $JQ >/dev/null
curl -sS -X GET  "$APP_BASE_URL/api/ledger/probe" -H 'Accept: application/json' | $JQ >/dev/null

# Methoden-Guard (POST only) für Checkout
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$APP_BASE_URL/api/buy/checkout-session")
test "$STATUS" -ge 400 && echo "✓ checkout-session GET blockiert (Status $STATUS)"
