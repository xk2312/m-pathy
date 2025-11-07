#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

SECRET="${STRIPE_WEBHOOK_SECRET:-}"
if [[ -z "${SECRET:-}" ]]; then
  echo "❌ STRIPE_WEBHOOK_SECRET fehlt (.env.payment)"; exit 1
fi

PAYLOAD='{
  "id":"evt_test_unknown_1",
  "object":"event",
  "type":"foo.bar",
  "data":{"object":{"id":"obj_1","object":"foo"}}
}'

TS="$(date +%s)"
SIG="$(printf "%s.%s" "$TS" "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)"
HDR="t=$TS,v1=$SIG"

echo "→ POST type=foo.bar (Stripe-Signature: $HDR)"
RESP="$(curl -sS -w '\n%{http_code}' -X POST "$APP_BASE_URL/api/webhooks/stripe" \
  -H "Stripe-Signature: $HDR" -H 'Content-Type: application/json' --data "$PAYLOAD")"

CODE="$(printf "%s\n" "$RESP" | tail -n1)"
BODY="$(printf "%s\n" "$RESP" | sed '$d')"

echo "HTTP $CODE"
echo "$BODY"

# Erwartung: 200, status:"ignored"
echo "$BODY" | jq -e '.status=="ignored"' >/dev/null && echo "✓ ignored" || (echo "✗ unexpected"; exit 1)
