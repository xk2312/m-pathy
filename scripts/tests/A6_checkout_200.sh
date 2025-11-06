#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

PID="${NEXT_PUBLIC_STRIPE_PRICE_1M:-${STRIPE_PRICE_1M:-}}"
if [[ -z "${PID:-}" ]]; then
  echo "❌ NEXT_PUBLIC_STRIPE_PRICE_1M/STRIPE_PRICE_1M fehlt" >&2
  exit 1
fi

curl -sS -X POST "$APP_BASE_URL/api/buy/checkout-session" \
  -H 'Content-Type: application/json' \
  --data "{\"priceId\":\"$PID\"}" | $JQ
