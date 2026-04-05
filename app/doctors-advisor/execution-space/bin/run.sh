#!/bin/bash

set -e

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ -z "$1" ]; then
  echo "Usage: ./run.sh runs/<run_name>"
  exit 1
fi

RUN_PATH="$BASE_DIR/$1"

echo "Starting Execution Pipeline..."

run_step () {
  STEP_NAME=$1
  SCRIPT=$2

  echo ""
  echo "----------------------------------------"
  echo "STEP START: $STEP_NAME"
  START_TIME=$(date +%s)

  if ! python3 "$BASE_DIR/$SCRIPT" "$RUN_PATH"; then
    echo "[ERROR] Step failed: $STEP_NAME"
    exit 1
  fi

  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))

  echo "STEP END: $STEP_NAME"
  echo "DURATION: ${DURATION}s"
  echo "----------------------------------------"
}

run_step "ValidateInput" "steps/ValidateInputPY.py"
run_step "Geocode" "steps/GeocodePY.py"
run_step "ReverseGeocode" "steps/ReverseGeocodePY.py"
run_step "Regionalatlas" "steps/RegionalatlasPY.py"
run_step "BasePrompt" "steps/BasePromptPY.py"
run_step "FirstCall" "steps/FirstCallPY.py"
run_step "C6Challenge1" "steps/C6Challenge1PY.py"
run_step "FinalizeOutput" "steps/FinalizeOutputPY.py"

FINAL_JSON="$RUN_PATH/10_finalize_output.json"

if [ ! -f "$FINAL_JSON" ]; then
  echo "[ERROR] Final output missing"
  exit 1
fi

echo "###JSON_START###"
cat "$FINAL_JSON"
echo "###JSON_END###"