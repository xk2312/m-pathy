#!/bin/bash

set -e

# ----------------------------
# CONFIG
# ----------------------------

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_ID=${1:-"run_$(date +%s)"}
RUN_PATH="$BASE_DIR/runs/$RUN_ID"
STEPS_DIR="$BASE_DIR/steps"

mkdir -p "$RUN_PATH"

echo "RUN_ID: $RUN_ID"
echo "RUN_PATH: $RUN_PATH"

# ----------------------------
# STEP EXECUTOR
# ----------------------------

run_step () {
  STEP_NAME=$1
  SCRIPT_NAME=$2

  echo "--------------------------------------"
  echo "STEP START: $STEP_NAME"
  START_TIME=$(date +%s)

  python3 "$STEPS_DIR/$SCRIPT_NAME" "$RUN_PATH"

  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))

  echo "STEP END: $STEP_NAME"
  echo "DURATION: ${DURATION}s"
  echo "--------------------------------------"
}

# ----------------------------
# PIPELINE
# ----------------------------

run_step "Validate Input" "ValidateInputPY.py"
run_step "Prepare Source" "PrepareSourcePY.py"
run_step "Chunk Document" "ChunkDocumentPY.py"
run_step "Summarize Chunks" "SummarizeChunkPY.py"
run_step "Challenge Chunks" "ChallengeChunkPY.py"
run_step "Freeze Chunks" "FreezeChunkPY.py"
run_step "Build Chunk Registry" "BuildChunkRegistryPY.py"
run_step "Merge Document View" "MergeDocumentViewPY.py"
run_step "Build Reasoning Surface" "BuildReasoningSurfacePY.py"
run_step "Write Project Registry" "WriteProjectRegistryPY.py"
run_step "Create Wall Artifact" "CreateWallArtifactPY.py"
run_step "Finalize Output" "FinalizeOutputPY.py"

# ----------------------------
# FINAL OUTPUT CONTRACT
# ----------------------------

FINAL_JSON="$RUN_PATH/10_finalize_output.json"

echo "--------------------------------------"
echo "FINAL OUTPUT"
echo "--------------------------------------"

if [ -f "$FINAL_JSON" ]; then
  echo "###JSON_START###"
  cat "$FINAL_JSON"
  echo "###JSON_END###"
else
  echo "ERROR: Final output not found"
  exit 1
fi