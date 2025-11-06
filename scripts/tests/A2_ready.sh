#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"
# Erwartung aktuell: ready=false, db.ok=true, smtp.ok=false (bewusst Platzhalter)
curl -sS "$APP_BASE_URL/api/ready?timeout_ms=2000" | $JQ
