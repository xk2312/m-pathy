#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"

TMP="$(mktemp -d)"
COOK="$TMP/c.jar"

# 9 erfolgreiche Free-Calls
for i in $(seq 1 9); do
  curl -sS -X POST "$APP_BASE_URL/api/chat" \
    -c "$COOK" -b "$COOK" \
    -H 'Content-Type: application/json' \
    --data '{"messages":[{"role":"user","content":"ping"}]}' >/dev/null
done

# 10. Call -> 402 + Header X-Free-Used/Limit + checkout_url
curl -i -sS -X POST "$APP_BASE_URL/api/chat" \
  -c "$COOK" -b "$COOK" \
  -H 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"ping"}]}'
