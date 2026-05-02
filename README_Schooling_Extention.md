README SCHOOLING EXTENSION V1
ZIEL: VS CODE READY + ERSTE M13 EXTENSION LOKAL BAUEN

============================================================
0. GRUNDENTSCHEIDUNG
============================================================

Die Schooling Extension ist ein Hybrid aus Setup und Schulung.

Sie soll dem Developer nicht das ganze System erklären.
Sie soll ihn arbeitsfähig machen.

Zielzustand nach Abschluss:

1. VS Code Workspace existiert.
2. Python ist geprüft.
3. Bash ist geprüft.
4. Lokale Extension Struktur existiert.
5. extension.json existiert.
6. run.sh existiert.
7. Drei Python Scripts existieren.
8. Testinput existiert.
9. Lokaler Run funktioniert.
10. Finales llm_render_payload existiert.
11. JSON Marker erscheinen korrekt.
12. Developer versteht den LLM Einstiegspunkt.
13. Developer versteht den C6 Challenge Output.
14. Registry Candidate ist als Lernobjekt vorhanden.

============================================================
1. ARCHITEKTUR, DIE DER DEVELOPER VERSTEHEN MUSS
============================================================

Der Developer bekommt keinen Zugriff auf route.ts.

Er muss route.ts nicht sehen.

Er muss nur diesen Contract verstehen:

Input
→ Python Step 01
→ Python Step 02
→ Python Step 03
→ run.sh
→ ###JSON_START###
→ llm_render_payload
→ ###JSON_END###
→ route.ts übernimmt
→ LLM rendert Antwort

Der LLM Einstiegspunkt ist also nicht ein direkter API Call.

Der LLM Einstiegspunkt ist:

artifact_type = llm_render_payload

Pflichtform:

{
  "artifact_type": "llm_render_payload",
  "artifact_version": "1.0",
  "render_target": "...",
  "content": {
    "q": "..."
  },
  "data": {},
  "meta": {}
}

============================================================
2. BEISPIEL EXTENSION
============================================================

Name:

llm-c6-demo

Zweck:

Der Developer gibt eine Aufgabe ein.
Die lokale Pipeline normalisiert den Input.
Die Pipeline baut eine LLM Aufgabe.
Die Pipeline fordert eine C6 Challenge an.
Die Pipeline erzeugt ein finales llm_render_payload.

Die echte LLM Antwort entsteht später im M13 Prompt über route.ts.

============================================================
3. BLOCK 1, WORKSPACE ANLEGEN
============================================================

Befehl:

mkdir -p m13-extension-school
cd m13-extension-school
code .

Erwartung:

VS Code öffnet den Ordner m13-extension-school.

Wenn code . nicht funktioniert:

VS Code öffnen.
Ordner m13-extension-school manuell öffnen.
Terminal in VS Code öffnen.

============================================================
4. BLOCK 2, PYTHON PRÜFEN
============================================================

Befehl:

python3 --version

Erwartete Ausgabe:

Python 3.x.x

Abbruchbedingung:

Wenn Python nicht gefunden wird, wird nicht weitergebaut.

============================================================
5. BLOCK 3, BASH PRÜFEN
============================================================

Befehl:

bash --version

Erwartete Ausgabe:

GNU bash ...
oder eine Bash Versionsausgabe.

Abbruchbedingung:

Wenn Bash nicht verfügbar ist, wird nicht weitergebaut.

============================================================
6. BLOCK 4, EXTENSION STRUKTUR ANLEGEN
============================================================

Befehl:

mkdir -p llm-c6-demo/execution-space/bin
mkdir -p llm-c6-demo/execution-space/steps
mkdir -p llm-c6-demo/execution-space/runs
mkdir -p llm-c6-demo/tests
cd llm-c6-demo

Erwartete Struktur:

llm-c6-demo/
  execution-space/
    bin/
    steps/
    runs/
  tests/

============================================================
7. BLOCK 5, EXTENSION.JSON ERSTELLEN
============================================================

Befehl:

cat > extension.json <<'JSON'
{
  "id": "llm_c6_demo",
  "version": "1.0",
  "entry": "1.1",
  "steps": {
    "1.1": {
      "type": "input",
      "content": {
        "q": "Enter a short task. The extension will prepare it for an LLM response and a C6 challenge."
      },
      "key": "demo.task",
      "instruction": "Render the question. Wait for user input. Store the input exactly.",
      "next": "1.2"
    },
    "1.2": {
      "type": "execution",
      "action": "run_llm_c6_demo_pipeline",
      "instruction": "Do not render text. Trigger execution immediately.",
      "next": null
    }
  }
}
JSON

Erklärung:

input sammelt den Prompt Input.
execution startet später run.sh.
action verbindet zur Registry Execution.

============================================================
8. BLOCK 6, TEST INPUT ERSTELLEN
============================================================

Befehl:

cat > tests/input.json <<'JSON'
{
  "demo": {
    "task": "Explain why a controlled extension pipeline is safer than direct access to core system files."
  }
}
JSON

Erklärung:

Lokal simuliert diese Datei den Input, den M13 später aus dem Prompt Flow sammelt.

============================================================
9. BLOCK 7, SCRIPT 01 ERSTELLEN
============================================================

Datei:

execution-space/steps/01_InputPY.py

Befehl:

cat > execution-space/steps/01_InputPY.py <<'PY'
import json
import os
import sys

if len(sys.argv) < 2:
    print("Missing run_path")
    sys.exit(1)

run_path = sys.argv[1]

input_path = os.path.join(run_path, "01_input.json")
output_path = os.path.join(run_path, "01_prepared_input.json")

if not os.path.exists(input_path):
    raise Exception(f"Missing input file: {input_path}")

with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

task = data.get("demo", {}).get("task")

if not isinstance(task, str) or not task.strip():
    raise Exception("demo.task must be a non-empty string")

output = {
    "status": "prepared",
    "task": task.strip()
}

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("STEP 01 COMPLETE: input prepared")
PY

Einzeln testen:

RUN_PATH="execution-space/runs/test_run_001"
mkdir -p "$RUN_PATH"
cp tests/input.json "$RUN_PATH/01_input.json"
python3 execution-space/steps/01_InputPY.py "$RUN_PATH"

Erwartete Ausgabe:

STEP 01 COMPLETE: input prepared

Prüfen:

cat execution-space/runs/test_run_001/01_prepared_input.json

============================================================
10. BLOCK 8, SCRIPT 02 ERSTELLEN
============================================================

Datei:

execution-space/steps/02_LLMPayloadPY.py

Befehl:

cat > execution-space/steps/02_LLMPayloadPY.py <<'PY'
import json
import os
import sys

if len(sys.argv) < 2:
    print("Missing run_path")
    sys.exit(1)

run_path = sys.argv[1]

input_path = os.path.join(run_path, "01_prepared_input.json")
output_path = os.path.join(run_path, "02_llm_task.json")

if not os.path.exists(input_path):
    raise Exception(f"Missing prepared input: {input_path}")

with open(input_path, "r", encoding="utf-8") as f:
    prepared = json.load(f)

task = prepared["task"]

llm_instruction = (
    "Answer the following developer task clearly and practically. "
    "Then challenge your own answer using C6 compression. "
    "The C6 challenge must test assumptions, structure, validity, risk, and missing boundaries. "
    "After the challenge, provide a final improved answer.\n\n"
    f"Developer task: {task}"
)

output = {
    "status": "llm_task_ready",
    "original_task": task,
    "llm_instruction": llm_instruction
}

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("STEP 02 COMPLETE: LLM payload prepared")
PY

Einzeln testen:

python3 execution-space/steps/02_LLMPayloadPY.py execution-space/runs/test_run_001

Erwartete Ausgabe:

STEP 02 COMPLETE: LLM payload prepared

Prüfen:

cat execution-space/runs/test_run_001/02_llm_task.json

============================================================
11. BLOCK 9, SCRIPT 03 ERSTELLEN
============================================================

Datei:

execution-space/steps/03_OutputPY.py

Befehl:

cat > execution-space/steps/03_OutputPY.py <<'PY'
import json
import os
import sys
from datetime import datetime, UTC

if len(sys.argv) < 2:
    print("Missing run_path")
    sys.exit(1)

run_path = sys.argv[1]

input_path = os.path.join(run_path, "02_llm_task.json")
output_path = os.path.join(run_path, "03_finalize_output.json")

if not os.path.exists(input_path):
    raise Exception(f"Missing LLM task artifact: {input_path}")

with open(input_path, "r", encoding="utf-8") as f:
    llm_task = json.load(f)

output = {
    "artifact_type": "llm_render_payload",
    "artifact_version": "1.0",
    "render_target": "llm_c6_demo_output",
    "content": {
        "q": llm_task["llm_instruction"]
    },
    "data": {
        "original_task": llm_task["original_task"],
        "schooling_goal": "Demonstrate the M13 pattern: input, LLM payload, C6 challenge, final output.",
        "developer_learning": [
            "The developer does not call the LLM directly.",
            "The developer creates a valid llm_render_payload.",
            "route.ts receives the artifact and performs the LLM render step.",
            "C6 is requested as part of content.q."
        ]
    },
    "meta": {
        "stage": "llm_c6_demo_complete",
        "timestamp": datetime.now(UTC).isoformat()
    }
}

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("STEP 03 COMPLETE: final LLM render payload written")
PY

Einzeln testen:

python3 execution-space/steps/03_OutputPY.py execution-space/runs/test_run_001

Erwartete Ausgabe:

STEP 03 COMPLETE: final LLM render payload written

Prüfen:

cat execution-space/runs/test_run_001/03_finalize_output.json

Pflichtprüfung:

artifact_type muss llm_render_payload sein.
content.q muss vorhanden sein.
data muss vorhanden sein.
meta muss vorhanden sein.

============================================================
12. BLOCK 10, RUN.SH ERSTELLEN
============================================================

Datei:

execution-space/bin/run.sh

Befehl:

cat > execution-space/bin/run.sh <<'SH'
#!/bin/bash

set -e

RUN_PATH="$1"

if [ -z "$RUN_PATH" ]; then
  echo "Missing RUN_PATH"
  exit 1
fi

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STEPS_DIR="$BASE_DIR/steps"

mkdir -p "$RUN_PATH"

run_step () {
  STEP_NAME="$1"
  SCRIPT_NAME="$2"

  echo "--------------------------------------"
  echo "STEP START: $STEP_NAME"

  python3 "$STEPS_DIR/$SCRIPT_NAME" "$RUN_PATH"

  echo "STEP END: $STEP_NAME"
  echo "--------------------------------------"
}

run_step "Input" "01_InputPY.py"
run_step "LLM Payload" "02_LLMPayloadPY.py"
run_step "Output" "03_OutputPY.py"

FINAL_JSON="$RUN_PATH/03_finalize_output.json"

if [ -f "$FINAL_JSON" ]; then
  echo "###JSON_START###"
  cat "$FINAL_JSON"
  echo "###JSON_END###"
else
  echo "ERROR: Final output not found"
  exit 1
fi
SH

chmod +x execution-space/bin/run.sh

Erklärung:

run.sh führt genau drei Python Scripts aus.
run.sh gibt am Ende genau einen JSON Block zwischen Markern aus.
Diese Marker sind der Contract für route.ts.

============================================================
13. BLOCK 11, KOMPLETTEN RUN STARTEN
============================================================

Befehl:

rm -rf execution-space/runs/test_run_001
RUN_PATH="execution-space/runs/test_run_001"
mkdir -p "$RUN_PATH"
cp tests/input.json "$RUN_PATH/01_input.json"
bash execution-space/bin/run.sh "$RUN_PATH"

Erwartete Ausgabe:

STEP START: Input
STEP 01 COMPLETE: input prepared
STEP END: Input

STEP START: LLM Payload
STEP 02 COMPLETE: LLM payload prepared
STEP END: LLM Payload

STEP START: Output
STEP 03 COMPLETE: final LLM render payload written
STEP END: Output

###JSON_START###
{
  "artifact_type": "llm_render_payload",
  ...
}
###JSON_END###

============================================================
14. BLOCK 12, ARTEFAKTE PRÜFEN
============================================================

Befehle:

cat execution-space/runs/test_run_001/01_prepared_input.json
cat execution-space/runs/test_run_001/02_llm_task.json
cat execution-space/runs/test_run_001/03_finalize_output.json

Der Developer soll sehen:

01_prepared_input.json
= normalisierter Input

02_llm_task.json
= fertige LLM Aufgabe inklusive C6 Anweisung

03_finalize_output.json
= finales M13 Artifact für route.ts

============================================================
15. BLOCK 13, REGISTRY CANDIDATE ALS LERNOBJEKT
============================================================

Datei:

registry_candidate.json

Befehl:

cat > registry_candidate.json <<'JSON'
{
  "extension_entry": {
    "id": "llm_c6_demo",
    "type": "extension",
    "category": "candidate",
    "state": "candidate",
    "command": "echo-dev-llm-c6-demo",
    "path": "staging-candidates/{developer_id}/{candidate_id}/extension.json",
    "ui": {
      "icon": null,
      "ui_surface": "internal"
    },
    "runtime": {
      "mode": "internal"
    }
  },
  "execution_entry": {
    "id": "run_llm_c6_demo_pipeline",
    "type": "execution",
    "category": "candidate",
    "state": "candidate",
    "command": "run_llm_c6_demo_pipeline",
    "path": "staging-candidates/{developer_id}/{candidate_id}/execution-space/bin/run.sh",
    "ui": {
      "icon": null,
      "ui_surface": "internal"
    },
    "runtime": {
      "mode": "execution"
    }
  }
}
JSON

Erklärung:

Diese Datei wird lokal nur gezeigt.
Sie wird nicht automatisch deployed.
Sie erklärt dem Developer, wie Extension Entry und Execution Entry zusammengehören.

============================================================
16. BLOCK 14, FINALER CHECK
============================================================

Befehl:

find . -maxdepth 4 -type f | sort

Erwartete wichtige Dateien:

./extension.json
./execution-space/bin/run.sh
./execution-space/steps/01_InputPY.py
./execution-space/steps/02_LLMPayloadPY.py
./execution-space/steps/03_OutputPY.py
./execution-space/runs/test_run_001/01_input.json
./execution-space/runs/test_run_001/01_prepared_input.json
./execution-space/runs/test_run_001/02_llm_task.json
./execution-space/runs/test_run_001/03_finalize_output.json
./registry_candidate.json
./tests/input.json

============================================================
17. ABSCHLUSSERKLÄRUNG FÜR DEN DEVELOPER
============================================================

Du hast jetzt eine lokale M13 Beispiel Extension gebaut.

Du hast gelernt:

1. extension.json definiert den Prompt Flow.
2. execution action verbindet zur Pipeline.
3. run.sh orchestriert die Pipeline.
4. Python Scripts erzeugen Artefakte.
5. RUN_PATH ist der Arbeitsraum des Runs.
6. llm_render_payload ist der LLM Einstiegspunkt.
7. route.ts bleibt geschützt, aber verarbeitet diesen Payload.
8. C6 wird nicht als freier Agent gestartet, sondern als klare Anweisung in content.q.
9. Registry Candidate erklärt, wie die Extension später auf Staging eingebunden wird.

============================================================
18. C6 FINALURTEIL
============================================================

Der Weg ist vollständig genug, um die Beispiel Extension zu bauen.

Es fehlt für den lokalen Test nichts Wesentliches.

Noch nicht enthalten und bewusst nicht Teil dieser Schooling Extension:

1. echter Staging Upload
2. Candidate Registry Merge in route.ts
3. Auth gebundener Developer Workspace
4. Release Request Pipeline
5. Admin Review
6. MAIN Deploy

Diese Punkte gehören zur späteren Builder Extension.

Schooling Ziel erfüllt:

VS Code ready.
Extension Struktur ready.
run.sh ready.
Drei Python Scripts ready.
Lokaler Run ready.
Artifact ready.
LLM Einstiegspunkt verstanden.
C6 Challenge verstanden.