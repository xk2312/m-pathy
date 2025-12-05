#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

SECRET="${STRIPE_WEBHOOK_SECRET:-}"
if [[ -z "${SECRET:-}" ]]; then
  echo "❌ STRIPE_WEBHOOK_SECRET fehlt (.env.payment)"; exit 1
fi

# Minimaler Event-Payload für checkout.session.completed
# metadata.user_id und amount_tokens werden gesetzt, damit Credit greift.
TIMESTAMP="$(date +%s)"
PAYLOAD="$(cat <<'JSON'
{
  "id": "evt_test_1234567890",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_1234567890",
      "object": "checkout.session",
      "metadata": {
        "user_id": "1",
        "amount_tokens": "15.000",
        "price_id": ""
      }
    }
  }
}
JSON
)"

# v1-Signatur bauen: hex(hmac_sha256(secret, "$ts.$payload"))
SIG_RAW="$(printf "%s.%s" "$TIMESTAMP" "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)"
SIG_HEADER="t=$TIMESTAMP,v1=$SIG_RAW"

echo "▶ Sende signierten Webhook (X-Signature: $SIG_HEADER)"
RESP="$(curl -sS -w '\n%{http_code}' -X POST "$APP_BASE_URL/api/webhooks/stripe" \
  -H "Stripe-Signature: $SIG_HEADER" \
  -H "Content-Type: application/json" \
  --data "$PAYLOAD")"

CODE="$(printf "%s\n" "$RESP" | tail -n1)"
BODY="$(printf "%s\n" "$RESP" | sed '$d')"

echo "HTTP $CODE"
echo "$BODY"

# Duplikat senden (Idempotenz)
RESP2="$(curl -sS -w '\n%{http_code}' -X POST "$APP_BASE_URL/api/webhooks/stripe" \
  -H "Stripe-Signature: $SIG_HEADER" \
  -H "Content-Type: application/json" \
  --data "$PAYLOAD")"
CODE2="$(printf "%s\n" "$RESP2" | tail -n1)"
BODY2="$(printf "%s\n" "$RESP2" | sed '$d')"

echo "HTTP $CODE2 (duplicate)"
echo "$BODY2"
