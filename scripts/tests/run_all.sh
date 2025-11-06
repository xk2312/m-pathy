#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")"; pwd)"

echo "== Acceptance (A1–A6) =="
bash "$DIR/A1_live.sh"
bash "$DIR/A2_ready.sh"
bash "$DIR/A3_ledger_probe.sh"
bash "$DIR/A4_chat_freegate.sh"
bash "$DIR/A5_checkout_400.sh"
bash "$DIR/A6_checkout_200.sh"

echo
echo "== Risk/Edge/Fault/Security =="
bash "$DIR/RP_run.sh"
bash "$DIR/EFK_scan.sh"

echo
echo "✅ Fertig."
