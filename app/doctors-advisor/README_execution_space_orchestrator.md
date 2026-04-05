# Execution Space README
Version: v2.0
Status: Implemented execution baseline

## Purpose

This document defines the implemented execution path for `doctors-advisor/execution-space`.

It is not a concept note anymore.
It is the current operational reference for the tested shell workflow.

Goal:
A deterministic server side execution pipeline that runs from input JSON to final persisted result JSON inside a run folder.

Important boundary:
The execution pipeline computes and persists results.
It does not present results to the user.
User presentation belongs later to extension, engine, and chat integration.

## Final status of the execution pipeline

The execution pipeline has been built and tested step by step.

Implemented and working:

1. `ValidateInputPY`
2. `GeocodePY`
3. `ReverseGeocodePY`
4. `RegionalatlasPY`
5. `BasePromptPY`
6. `FirstCallPY`
7. `C6Challenge1PY`
8. `run.sh`

Removed from the active pipeline:

1. `C6Challenge2PY`
2. `FinalizeOutputPY` as execution step

Reason:
- `C6Challenge2PY` produced overoptimization with too little added value
- `FinalizeOutputPY` does not belong to the execution pipeline because it shifts from computation to presentation
- presentation belongs after the execution path, inside extension and engine integration

## Core principle

The shell workflow is not the source of truth.

The source of truth is the run folder.

Each productive step:
- reads defined input files only
- writes exactly one defined output file
- stops with a defined error contract if validation fails

Nothing important may exist only in RAM.

## Folder anchor

```text
/app/doctors-advisor/execution-space/
  /bin
  /runs
  /schemas
  /steps
  run.sh
```

## Execution philosophy

Correct order:

1. Define the invisible orchestrator
2. Fix file names and JSON contracts
3. Build each step script independently
4. Test each step with real files
5. Build the shell orchestrator
6. Verify the full shell run end to end
7. Only then connect execution output to extension and engine

Why this order:
- step quality matters more than early orchestration
- orchestration becomes simple once contracts are stable
- this reduces drift, mock logic, and refactor waste

## Final active run sequence

```text
01_input.json
02_validated_input.json
03_geocode.json
04_reverse_geocode.json
05_regionalatlas.json
06_base_prompt.json
07_first_call_output.json
08_c6_challenge1.json
error.json
```

Rules:
- no dynamic filenames
- no skipped numbers inside the active pipeline
- one linear path
- no presentation step inside execution

## Global rules

### 1. Single Source Rule
Each step reads only the files explicitly assigned to it.
Each step writes exactly one productive output file.

### 2. No Memory Rule
No productive state may live only in variables or temporary memory.
The filesystem is the workflow memory.

### 3. Deterministic Naming Rule
All filenames are fixed in advance.
No timestamped step outputs.
No custom output names.

### 4. Hard Stop Rule
If a required input file is missing, invalid, or empty, the step must stop and write an error file.

### 5. No Silent Mutation Rule
A step may enrich context, but it may not silently reinterpret previous outputs.
A step may never overwrite a previous productive file.
A step may only create its own defined output file.
Any transformation must be visible in that new output file.

### 6. No Overengineering Rule
Only the minimum fields required for the next step and for traceability may be stored.

## Run folder contract

Each run gets a dedicated folder:

```text
/runs/<run_id>/
```

Example content:

```text
/runs/<run_id>/
  01_input.json
  02_validated_input.json
  03_geocode.json
  04_reverse_geocode.json
  05_regionalatlas.json
  06_base_prompt.json
  07_first_call_output.json
  08_c6_challenge1.json
  error.json
```

## Error contract

Errors are currently written to:

```text
error.json
```

Structure:

```json
{
  "status": "error",
  "stage": "string",
  "errors": [
    {
      "code": "input_invalid | api_unreachable | api_empty | processing_failed | llm_failed | output_invalid",
      "message": "string"
    }
  ]
}
```

Rules:
- the first productive error aborts the run immediately
- only fixed error codes are allowed
- no free form taxonomy

## Implemented step contracts

## Step 01
Script: `ValidateInputPY`

Input:
```text
01_input.json
```

Output:
```text
02_validated_input.json
```

Contract:
- validates required fields
- validates postal code
- validates country equals `Deutschland`
- writes clean validated JSON

## Step 02
Script: `GeocodePY`

Input:
```text
02_validated_input.json
```

Output:
```text
03_geocode.json
```

Contract:
- performs geocoding call
- persists coordinates and selected response fields
- stops on API failure or empty response

## Step 03
Script: `ReverseGeocodePY`

Input:
```text
03_geocode.json
```

Output:
```text
04_reverse_geocode.json
```

Contract:
- performs reverse geocoding call
- persists location context for downstream use

## Step 04
Script: `RegionalatlasPY`

Input:
```text
04_reverse_geocode.json
```

Output:
```text
05_regionalatlas.json
```

Contract:
- enriches the location with regional context used by the prompt layer
- current implementation follows the tested working path

## Step 05
Script: `BasePromptPY`

Inputs:
```text
01_input.json
03_geocode.json
04_reverse_geocode.json
05_regionalatlas.json
```

Output:
```text
06_base_prompt.json
```

Contract:
- compiles the structured data block
- compiles the fixed domain instruction
- produces the prompt for the first LLM call
- this step prepares the call but does not execute it

## Step 06
Script: `FirstCallPY`

Input:
```text
06_base_prompt.json
```

Output:
```text
07_first_call_output.json
```

Contract:
- performs the first real Azure OpenAI call
- stores both prompt and model response
- this is the first live probabilistic step in the pipeline

## Step 07
Script: `C6Challenge1PY`

Input:
```text
07_first_call_output.json
```

Output:
```text
08_c6_challenge1.json
```

Contract:
- performs one strong C6 refinement pass on the first call output
- preserves structure and viewpoint
- improves data discipline and phrasing
- this is the final execution output currently used

## Shell orchestrator

File:
```text
run.sh
```

Current role:
- executes the active steps in fixed order
- prints step start
- prints step end
- prints step duration
- aborts on step failure

Important rule:
The shell orchestrator controls execution only.
It does not interpret domain content.

## What the execution pipeline now does

The execution pipeline now:
- accepts a run folder with `01_input.json`
- executes every active step in order
- persists every intermediate result as JSON
- produces a final execution result in `08_c6_challenge1.json`
- can be run end to end from terminal through `run.sh`

## What the execution pipeline does not do

The execution pipeline does not:
- present the result to the user
- write assistant chat output
- inject IRSS
- call the Next.js route
- decide extension logic
- decide engine routing

Those responsibilities belong later to:
- extension
- engine
- route integration
- chat presentation layer

## Current boundary of completion

The execution path is complete when judged as an execution system.

This means:
- shell run works
- step sequence works
- JSON persistence works
- one final execution result is produced
- challenge two has been intentionally removed
- finalize presentation logic has been intentionally removed

## What is next and not yet done

The next phase is not more execution work.

The next phase is:
1. inspect the extension
2. adapt the engine
3. create the bridge from execution result JSON back into the chat response
4. decide exactly how the extension triggers the shell workflow
5. decide exactly which persisted JSON field is surfaced to the user

Important:
Do not move presentation back into the execution pipeline.
Do not reintroduce `FinalizeOutputPY` into the shell path.
Do not reintroduce `C6Challenge2PY` as a required default step.

## Active build order achieved

Implemented in this order:

1. `ValidateInputPY`
2. `GeocodePY`
3. `ReverseGeocodePY`
4. `RegionalatlasPY`
5. `BasePromptPY`
6. `FirstCallPY`
7. `C6Challenge1PY`
8. `run.sh`

## Final judgment

Clarity first.
Contracts first.
Execution first.
Presentation later.

The execution pipeline is finished as a compute layer.
The next work belongs to extension and engine integration.
