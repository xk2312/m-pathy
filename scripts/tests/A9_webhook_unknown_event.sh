#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

SECRET="${STRIPE_WEBHOOK_SECRET:-}"
if [[ -z "${SECRET:-}" ]]; then
  echo "❌ STRIPE_WEBHOOK_SECRET fehlt (.env.payment)"; exit 1
fi

# 1) Frische Event-ID pro Run
TS="$(date +%s)"
EVENT_ID="evt_test_unknown_${TS}"

# 2) Payload
PAYLOAD=$(cat <<JSON
{
  "id":"${EVENT_ID}",
  "object":"event",
  "type":"foo.bar",
  "data":{"object":{"id":"obj_${TS}","object":"foo"}}
}
JSON
)

# 3) Signatur
SIG="$(printf "%s.%s" "$TS" "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)"
HDR="t=$TS,v1=$SIG"

# 4) Request senden
echo "→ POST type=foo.bar (Stripe-Signature: $HDR)"
RESP="$(curl -sS -w '\n%{http_code}' -X POST "$APP_BASE_URL/api/webhooks/stripe" \
  -H "Stripe-Signature: $HDR" \
  -H 'Content-Type: application/json' \
  --data "$PAYLOAD")"

CODE="$(printf "%s\n" "$RESP" | tail -n1)"
BODY="$(printf "%s\n" "$RESP" | sed '$d')"

echo "HTTP $CODE"
echo "$BODY"

# 5) Erfolg, wenn status == ignored ODER duplicate
STATUS="$(echo "$BODY" | jq -r '.status // empty')"
if [[ "$CODE" == "200" && ( "$STATUS" == "ignored" || "$STATUS" == "duplicate" ) ]]; then
  echo "✓ $STATUS"
  exit 0
else
  echo "✗ unexpected ($STATUS)"
  exit 1
fi
