#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

SECRET="${STRIPE_WEBHOOK_SECRET:-}"
if [[ -z "${SECRET:-}" ]]; then
  echo "❌ STRIPE_WEBHOOK_SECRET fehlt (.env.payment)"; exit 1
fi

sign_send () {
  local json="$1"
  local ts="$(date +%s)"
  local sig="$(printf "%s.%s" "$ts" "$json" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)"
  local hdr="t=$ts,v1=$sig"
  echo "→ POST type=$(echo "$json" | jq -r .type)  (Stripe-Signature: $hdr)"
  curl -sS -w '\n%{http_code}' -X POST "$APP_BASE_URL/api/webhooks/stripe" \
    -H "Stripe-Signature: $hdr" -H 'Content-Type: application/json' --data "$json" | tee /dev/stderr
  echo
}

# 1) payment_failed (nur dokumentieren)
E1='{
  "id":"evt_test_fail_1",
  "object":"event",
  "type":"invoice.payment_failed",
  "data":{"object":{"id":"in_test_1","object":"invoice"}}
}'
sign_send "$E1"

# 2) charge.refunded mit Token-Metadaten → debit
E2='{
  "id":"evt_test_refund_1",
  "object":"event",
  "type":"charge.refunded",
  "data":{"object":{
    "id":"ch_test_1",
    "object":"charge",
    "metadata":{"user_id":"1","amount_tokens_refund":"500000"}
  }}
}'
sign_send "$E2"

# 3) subscription.deleted (nur dokumentieren)
E3='{
  "id":"evt_test_sub_del_1",
  "object":"event",
  "type":"customer.subscription.deleted",
  "data":{"object":{"id":"sub_test_1","object":"subscription","status":"canceled"}}
}'
sign_send "$E3"
