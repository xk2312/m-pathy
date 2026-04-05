#!/bin/bash

RUN_PATH=$1

if [ -z "$RUN_PATH" ]; then
  echo "Usage: ./run.sh runs/<run_name>"
  exit 1
fi

echo "Starting Execution Pipeline..."

run_step () {
  STEP_NAME=$1
  SCRIPT=$2

  echo ""
  echo "----------------------------------------"
  echo "STEP START: $STEP_NAME"
  START_TIME=$(date +%s)

  python $SCRIPT $RUN_PATH

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

echo ""
echo "Execution complete."