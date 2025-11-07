#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")"; pwd)"

run() {
  local name="$1"; shift
  echo "---- $name ----"
  set +e
  "$@"
  local rc=$?
  set -e
  echo "[$name] exit=$rc"
  echo
}

echo "== Acceptance (A1–A6) =="
run "A1_live"            bash "$DIR/A1_live.sh"
run "A2_ready"           bash "$DIR/A2_ready.sh"
run "A3_ledger_probe"    bash "$DIR/A3_ledger_probe.sh"
run "A4_chat_freegate"   bash "$DIR/A4_chat_freegate.sh"
run "A5_checkout_400"    bash "$DIR/A5_checkout_400.sh"
run "A6_checkout_200"    bash "$DIR/A6_checkout_200.sh"

echo
echo "== Risk/Edge/Fault/Security =="
run "RP_run"             bash "$DIR/RP_run.sh"
run "EFK_scan"           bash "$DIR/EFK_scan.sh"

echo "== Webhook =="
run "A7_webhook_verify"  bash "$DIR/A7_webhook_verify.sh"
run "A8_webhook_multi"   bash "$DIR/A8_webhook_multi_event.sh"

echo
echo "✅ Fertig."
