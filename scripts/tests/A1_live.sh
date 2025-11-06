#!/usr/bin/env bash
set -euo pipefail
. "$(dirname "$0")/_env.sh"
curl -sS "$APP_BASE_URL/api/live" | $JQ
