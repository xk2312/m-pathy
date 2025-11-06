#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"
curl -i -sS -X POST "$APP_BASE_URL/api/buy/checkout-session" \
  -H 'Content-Type: application/json' \
  --data '{"priceId":"wrong_price"}'
