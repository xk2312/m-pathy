# README_Sandbox_Extensions_Dev_300426

## 0. Zweck dieses Dokuments

Dieses Dokument friert den aktuellen DevPlan für die M13 Extension Sandbox ein.

Ziel ist nicht, eine neue Plattform, ein neues Portal oder einen parallelen Backend-Service zu bauen. Ziel ist, die bestehende M13 Infrastruktur so zu nutzen, dass trusted Developer Extensions bauen, lokal testen, auf Staging als Candidate prüfen und anschließend manuell einen Release anfragen können.

Die Sandbox V1 bleibt bewusst klein.

Sie dient dazu, einem Developer kontrolliert zu ermöglichen:

1. eine Extension zu verstehen
2. eine Extension lokal zu bauen
3. eine Extension lokal über `run.sh` und Python Steps zu testen
4. Artefakte lokal zu prüfen
5. die Extension über einen M13 Builder Flow als Candidate einzureichen
6. die Candidate Extension auf Staging zu testen
7. einen manuellen Release Request zu erzeugen

Der finale Deploy nach MAIN bleibt manuell und erfolgt nur nach Review.

---

## 1. Kanonische V1 Entscheidung

Die Sandbox wird nicht als komplett neues System gebaut.

Die Sandbox wird als M13 Extension Flow gebaut.

Die zentrale Entscheidung lautet:

```text
Extension führt.
Execution schreibt.
Python prüft.
Candidate läuft.
Review released.
```

Für V1 gilt:

```text
Local build.
Candidate submission.
Staging prompt test.
Manual release request.
Manual review.
Manual deploy.
```

Nicht Teil von V1:

```text
keine autonome Agenten-Orchestration
kein automatischer Main-Deploy
kein freier Registry-Zugriff
kein Developer SSH-Zugang
kein freier Zugriff auf route.ts
kein freier Zugriff auf engine.ts
kein Zugriff auf .env
kein direktes Schreiben nach /extensions
kein direktes Schreiben nach /app
kein direktes Schreiben in registry/registry.json
```

---

## 2. Strategischer Zweck

Die Extension Sandbox ist ein Enterprise Conversion Instrument.

Ein Unternehmen soll verstehen:

```text
Wir können einem trusted Developer kontrollierten Zugang geben.
Wir können ihn schnell einschulen.
Er kann lokal eine Extension bauen.
Er kann sie auf Staging im echten Prompt-Verhalten testen.
Wenn das Ergebnis überzeugt, wird die Extension geprüft und manuell deployed.
```

Der Wert liegt in:

```text
Geschwindigkeit
Qualität
Übertragbarkeit
Kontrolle
```

Die stärkste Demo ist nicht nur eine Präsentation.

Die stärkste Demo ist:

```text
Der Developer des Kunden baut selbst etwas,
testet es im echten System
und sieht direkt den Nutzen.
```

---

## 3. Bestehende M13 Infrastruktur als Grundlage

Die Sandbox richtet sich strikt an der vorhandenen Infrastruktur aus.

Der bestehende M13 Flow ist:

```text
Prompt Echo-Code
→ registry/registry.json
→ lib/m13/engine.ts
→ Extension JSON
→ Execution Step
→ Registry Execution Entry
→ run.sh
→ Python Steps
→ FinalizeOutputPY.py
→ llm_render_payload
→ route.ts
→ LLM Render
→ User Response
```

Diese Infrastruktur bleibt die Grundlage.

Es wird kein separater Candidate Service als neue Backend-Schicht erfunden.

Der Candidate Service ist eine M13 Execution.

Das bedeutet:

```text
Candidate Service = run.sh + Python Steps
```

---

## 4. Gesehene Kernfiles

Die folgenden realen Dateien und Strukturen wurden im Chat betrachtet und bilden die Grundlage dieses DevPlans.

### 4.1 route.ts

`app/api/chat/route.ts`

Relevante Rollen:

```text
ENV Laden
Auth
FreeGate
Token Ledger
Engine Einstieg
Registry Übergabe
Execution Gate
Shell Execution via run.sh
Azure LLM Call
IRSS Split
Response Builder
```

Befund:

```text
route.ts ist Protected Core.
route.ts darf Developer nicht gezeigt werden.
route.ts darf Developer nicht editieren.
```

Wichtige Eingriffspunkte:

```text
import registry from "@/registry/registry.json";

const engineResult = runEngine({
  message: lastMessage,
  state: engineInputState,
  registry
})

if (engineResult.step?.type === "execution") {
  ...
}
```

C6 Befund:

```text
route.ts bleibt geschützt.
V1 braucht nur eine kontrollierte Candidate Registry Auflösung,
falls Candidate Prompt Tests über Echo-Code erfolgen sollen.
```

---

### 4.2 engine.ts

`lib/m13/engine.ts`

Relevante Rollen:

```text
Command Matching
Extension JSON laden
Step Flow steuern
Inputs sammeln
Selection validieren
next oder next_map auswerten
Execution Step erkennen
action zurückgeben
collectedData weiterreichen
```

Befund:

```text
engine.ts ist kein LLM Kern.
engine.ts ist ein Registry gesteuerter Step Orchestrator.
engine.ts bleibt Protected Core.
```

C6 Befund:

```text
engine.ts muss für V1 möglichst nicht verändert werden.
Die Candidate Logik soll vor der Engine über eine effectiveRegistry gelöst werden.
```

---

### 4.3 registry.json

`registry/registry.json`

Relevante Rollen:

```text
Extension Entries
Execution Entries
UI Functions
Wall Functions
Echo-Code Mapping
Execution Path Mapping
```

Beispielmuster:

```json
{
  "id": "onboarding_extension",
  "type": "extension",
  "command": "echo-onboarding",
  "path": "extensions/onboarding.json",
  "runtime": {
    "mode": "internal"
  }
}
```

Execution Muster:

```json
{
  "id": "run_onboarding_pipeline",
  "type": "execution",
  "command": "run_onboarding_pipeline",
  "path": "app/user-onboarding/execution-space/bin/run.sh",
  "runtime": {
    "mode": "execution"
  }
}
```

Befund:

```text
Eine Extension braucht einen Extension Entry.
Eine Execution braucht einen Execution Entry.
Die Extension JSON verweist über action auf die Execution.
```

C6 Befund:

```text
Developer dürfen registry.json nicht direkt editieren.
Developer liefern Candidate Daten.
Die Builder Execution erzeugt Candidate Registry Dateien.
Admin übernimmt später manuell in die Master Registry.
```

---

### 4.4 onboarding.json

`extensions/onboarding.json`

Relevante Rollen:

```text
entry
steps
type input
type selection
type execution
key
instruction
next
next_map
action
persist
```

Wichtiges Endmuster:

```json
{
  "type": "execution",
  "action": "run_onboarding_pipeline",
  "instruction": "Do not render text. Trigger execution immediately.",
  "next": null
}
```

Befund:

```text
Developer Extensions müssen diesem Muster folgen.
Eine Extension ist ein deterministischer Step Flow.
Execution kommt erst am Ende oder an klar definierten Stellen.
```

---

### 4.5 run.sh

`app/user-onboarding/execution-space/bin/run.sh`

Relevante Rollen:

```text
BASE_DIR setzen
RUN_PATH setzen
STEPS_DIR setzen
Python Steps nacheinander ausführen
Final JSON zwischen Markern ausgeben
```

Finaler Output Marker:

```text
###JSON_START###
{ ... }
###JSON_END###
```

Befund:

```text
route.ts erwartet genau diesen Marker Contract.
Ohne Marker schlägt Execution Validation fehl.
```

C6 Befund:

```text
run.sh ist der technische Kern des Candidate Service.
Developer bauen lokal gegen denselben Contract.
```

---

### 4.6 Python Init Step

Beispiel:

`01_UserRegistryInitPY.py`

Relevante Rollen:

```text
RUN_DIR lesen
01_input.json lesen
Output JSON schreiben
System Registry lesen
User Registry aufbauen
```

Befund:

```text
Python Steps können sehr mächtig sein.
Für Developer Extensions muss der Zugriff eingeschränkt werden.
Steps sollen im Candidate Kontext primär mit RUN_PATH arbeiten.
```

C6 Befund:

```text
Developer Steps dürfen nicht frei Systempfade lesen.
Systemdaten müssen über kontrollierte Input-Artefakte bereitgestellt werden.
```

---

### 4.7 FinalizeOutputPY.py

Relevante Rollen:

```text
Zwischenartefakte lesen
finales llm_render_payload bauen
JSON schreiben
```

Pflichtmuster:

```json
{
  "artifact_type": "llm_render_payload",
  "artifact_version": "1.0",
  "render_target": "some_target",
  "content": {
    "q": "Instruction for the LLM render step."
  },
  "data": {},
  "meta": {
    "stage": "some_stage",
    "timestamp": "ISO_DATE"
  }
}
```

Befund:

```text
Das finale Artifact ist der wichtigste Developer Contract.
Wenn dieser Contract erfüllt ist, kann route.ts das Ergebnis an die LLM Render Schicht übergeben.
```

---

## 5. Protected Core

Diese Dateien und Bereiche bleiben geschützt.

Developer bekommen darauf keine Lese- oder Schreibrechte.

```text
.env
.env.production
.env.local
app/api/chat/route.ts
lib/m13/engine.ts
registry/registry.json
lib/auth
lib/ledger
lib/freegate
lib/rate
System Prompts
Azure Provider Keys
Token Accounting
Billing Logik
Auth Logik
Triketon Anchoring
```

Begründung:

```text
Diese Files enthalten Secrets, Routing Macht, Execution Macht, Auth Macht oder zentrale Systemlogik.
```

Regel:

```text
Developer sehen den Contract.
Developer sehen nicht den Core.
```

---

## 6. Developer Sicht in V1

Ein trusted Developer arbeitet lokal in VS Code.

Er bekommt ein Template.

Beispielstruktur:

```text
my-extension/
  extension.json
  execution-space/
    bin/
      run.sh
    steps/
      01_ValidateInputPY.py
      02_ProcessInputPY.py
      03_FinalizeOutputPY.py
    runs/
      .gitkeep
  tests/
    input.json
  README.md
```

Der Developer darf lokal:

```text
Python Scripts schreiben
run.sh ausführen
Testdaten bauen
Artefakte prüfen
Logs lesen
Extension JSON bauen
```

Der Developer darf auf Staging nicht:

```text
SSH verwenden
Repo öffnen
Master Registry editieren
Core Files lesen
.env lesen
route.ts lesen
engine.ts lesen
direkt nach /extensions schreiben
direkt nach /app schreiben
```

---

## 7. Local Developer Contract

Der lokale Test muss deterministisch sein.

Ziel:

```text
Ein Developer kann in VS Code prüfen,
ob seine Extension technisch läuft,
bevor sie nach Staging kommt.
```

Lokaler Standardbefehl:

```bash
bash execution-space/bin/run.sh execution-space/runs/test_run
```

Wichtig:

Der Contract muss eindeutig festlegen, ob `run.sh` eine `RUN_ID` oder einen fertigen `RUN_PATH` bekommt.

Für die Sandbox wird empfohlen:

```text
run.sh bekommt immer einen fertigen RUN_PATH.
```

Begründung:

```text
Dann sind Local Run und Staging Run identisch.
```

---

## 8. Extension Package Contract

Ein gültiges Extension Package enthält mindestens:

```text
extension.json
execution-space/bin/run.sh
execution-space/steps/*.py
tests/input.json
README.md
```

Optional später:

```text
schemas/
examples/
fixtures/
assets/
```

Nicht erlaubt:

```text
.env
node_modules
.next
.git
private keys
absolute system paths
symlinks auf Systempfade
compiled binaries ohne Review
```

---

## 9. Extension JSON Contract

Eine Developer Extension muss mindestens enthalten:

```json
{
  "id": "my_extension",
  "version": "1.0",
  "entry": "1.1",
  "steps": {
    "1.1": {
      "type": "input",
      "content": {
        "q": "..."
      },
      "key": "some.key",
      "instruction": "...",
      "next": "1.2"
    },
    "1.2": {
      "type": "execution",
      "action": "run_my_extension_pipeline",
      "instruction": "Do not render text. Trigger execution immediately.",
      "next": null
    }
  }
}
```

Erlaubte Step Types für V1:

```text
input
selection
execution
```

Nicht Teil von V1:

```text
freies Tool Calling
freie Chain Orchestration
autonome Agentenwahl
Extension ruft Extension direkt
```

---

## 10. Execution Contract

Eine Execution braucht einen Registry Candidate.

Muster:

```json
{
  "id": "run_my_extension_pipeline",
  "type": "execution",
  "category": "candidate",
  "state": "candidate",
  "command": "run_my_extension_pipeline",
  "path": "staging-candidates/{developer_id}/{candidate_id}/execution-space/bin/run.sh",
  "ui": {
    "icon": null,
    "ui_surface": "internal"
  },
  "runtime": {
    "mode": "execution"
  }
}
```

Wichtig:

```text
Der Pfad wird serverseitig gebaut.
Der Developer darf diesen Pfad nicht frei setzen.
```

---

## 11. Candidate Workspace

Alle Candidate Dateien liegen unter einem isolierten Workspace.

Muster:

```text
staging-candidates/
  {developer_id}/
    {candidate_id}/
      extension.json
      execution-space/
        bin/
          run.sh
        steps/
          *.py
        runs/
      tests/
        input.json
      output/
        validation_report.json
        artifact_report.json
        release_request.json
        candidate_registry.json
```

Regel:

```text
Die Builder Execution darf nur innerhalb dieses Candidate Roots schreiben.
```

Verboten:

```text
../../
absolute Pfade
Symlink Escape
Schreiben in registry/
Schreiben in extensions/
Schreiben in app/
Schreiben in lib/
Lesen von .env
```

---

## 12. Candidate Registry

Für Prompt Tests braucht der Developer schnelle Iteration.

Daher gibt es eine Candidate Registry.

Nicht so:

```text
Developer schreibt in registry/registry.json
```

Sondern so:

```text
Builder Execution erzeugt candidate_registry.json
route.ts kann request-spezifisch Master Registry plus Candidate Registry mergen
runEngine bekommt effectiveRegistry
```

Minimalformel:

```text
effectiveRegistry = merge(masterRegistry, developerCandidateRegistry)
```

Wichtig:

```text
Candidate Entries sind nur für diesen Developer gültig.
Candidate Entries gelten nur auf Staging.
Candidate Entries werden nicht automatisch nach MAIN übernommen.
```

---

## 13. Candidate Prompt Test

Der Developer braucht echte Prompt Tests auf Staging.

Begründung:

```text
Prompt-Verhalten braucht Iteration.
Oft sind zweistellige Iterationen realistisch.
Manuelles Warten vor jedem Prompt Test ist nicht praktikabel.
```

Daher gilt:

```text
Prompt-Test ja.
Produktive Registry-Aktivierung nein.
```

Muster:

```text
echo-dev-my-extension
```

Dieser Echo-Code darf nur die eigene Candidate Extension starten.

Regeln:

```text
Developer sieht nur eigene Candidate Extensions.
Developer kann nur eigene Candidate Echo-Codes nutzen.
Developer kann durch neuen Upload iterieren.
Master Registry bleibt unverändert.
Release nach MAIN bleibt manuell.
```

---

## 14. Extension School

Vor dem Builder kann eine Schulungs-Extension stehen.

Echo-Code:

```text
echo-extension-school
```

Zweck:

```text
Developer versteht M13 Extension Contract.
Developer versteht Extension JSON.
Developer versteht run.sh.
Developer versteht Python Steps.
Developer versteht Artifact Contract.
Developer versteht Release Request.
```

Die School Extension ist rein erklärend.

Sie schreibt nichts.

Sie führt nichts aus.

Sie erzeugt keine Candidate Files.

---

## 15. Extension Builder

Echo-Code:

```text
echo-extension-builder
```

Zweck:

```text
Developer wird linear durch die Candidate Erstellung geführt.
```

Der Builder ist eine normale M13 Extension.

Er sammelt:

```text
extension_id
extension_name
echo_code
description
extension_json
run_sh
python_files
test_input
README
release_notes
```

Der Builder endet in einer Execution:

```text
run_extension_builder_pipeline
```

Diese Execution ist der Candidate Service.

---

## 16. Candidate Service als Execution

Der Candidate Service ist keine neue Backend-Schicht.

Er ist:

```text
app/extension-builder/execution-space/bin/run.sh
```

mit Python Steps.

V1 Pipeline:

```text
01_ValidateBuilderInputPY.py
02_WriteCandidateWorkspacePY.py
03_RunCandidatePipelinePY.py
04_ValidateCandidateArtifactPY.py
05_WriteCandidateRegistryPY.py
06_WriteReleaseRequestPY.py
07_FinalizeOutputPY.py
```

Aufgabe der Pipeline:

```text
Inputs validieren
Candidate Root bauen
Files kontrolliert schreiben
run.sh testweise ausführen
Final Artifact prüfen
Candidate Registry schreiben
Release Request schreiben
LLM Render Payload erzeugen
```

---

## 17. Candidate Service Output

Die Builder Pipeline erzeugt mindestens:

```text
validation_report.json
candidate_registry.json
candidate_run_log.txt
artifact_report.json
release_request.json
final llm_render_payload
```

Finaler LLM Render Payload:

```json
{
  "artifact_type": "llm_render_payload",
  "artifact_version": "1.0",
  "render_target": "extension_builder_candidate_ready",
  "content": {
    "q": "Render a concise status report for the developer. Explain whether the candidate was created, whether the test run passed, and how to test it with the candidate echo code."
  },
  "data": {
    "candidate_id": "...",
    "echo_code": "echo-dev-my-extension",
    "validation_status": "passed",
    "artifact_status": "passed",
    "release_request_status": "created"
  },
  "meta": {
    "stage": "candidate_ready",
    "timestamp": "ISO_DATE"
  }
}
```

---

## 18. Release Request

Der Developer kann manuell Release anfragen.

Release Request enthält:

```text
developer_id
candidate_id
extension_id
echo_code
description
candidate_registry_ref
artifact_report_ref
test_run_ref
created_at
status
```

Statuswerte:

```text
draft
submitted
under_review
approved
rejected
deployed
```

Für V1 reicht:

```text
submitted
approved
rejected
deployed
```

Admin prüft:

```text
Code
run.sh
Python Steps
Artifact Output
Logs
Nutzen
Sicherheit
Pfadregeln
Registry Candidate
```

Dann manuelle Übernahme nach:

```text
extensions/my_extension.json
app/my-extension/execution-space/
registry/registry.json
```

---

## 19. Manual Deploy nach MAIN

MAIN bekommt nur geprüfte Extensions.

Ablauf:

```text
1. Candidate auf Staging gebaut
2. Candidate auf Staging mehrfach getestet
3. Release Request erstellt
4. Admin Review durchgeführt
5. Admin übernimmt Dateien manuell
6. Admin ergänzt Master Registry
7. Deploy nach MAIN
8. MAIN Test
```

Nicht erlaubt:

```text
automatischer Main Deploy
Release durch Developer
Registry Merge ohne Review
```

---

## 20. Sicherheitsregeln V1

Harte Regeln:

```text
Developer hat keinen SSH Zugriff.
Developer hat keinen Repo Zugriff.
Developer sieht keine Core Files.
Developer schreibt nicht direkt ins System.
Developer liefert nur Candidate Inputs.
Execution schreibt kontrolliert.
Python validiert.
Admin released.
```

Path Regeln:

```text
candidate_id muss normalisiert werden.
developer_id kommt aus Auth.
Pfade werden serverseitig gebaut.
path.resolve muss innerhalb Candidate Root bleiben.
Symlinks sind verboten.
Absolute Pfade sind verboten.
../ ist verboten.
```

Execution Regeln:

```text
run.sh muss existieren.
run.sh muss ausführbar sein.
run.sh muss Marker ausgeben.
Marker müssen genau einmal vorkommen.
JSON zwischen Markern muss parsebar sein.
artifact_type muss llm_render_payload sein.
content.q muss String sein.
data muss Object sein.
meta muss Object sein.
```

---

## 21. C6 Risikoanalyse

### Risiko 1: Shell und Python sind mächtig

Bewertung:

```text
Hoch.
```

V1 Gegenmaßnahme:

```text
Trusted Developer only.
Staging only.
Kein Secret im Candidate Workspace.
Keine direkte Systempfadfreigabe.
Manual Review vor MAIN.
```

Später nötig:

```text
Container
Jail
Resource Limits
Network Limits
Filesystem Mounts readonly
```

---

### Risiko 2: Candidate Registry Drift

Bewertung:

```text
Mittel bis hoch.
```

V1 Gegenmaßnahme:

```text
Candidate Registry getrennt von Master Registry.
Nur request-spezifischer Merge.
Nur developer-spezifische Candidates.
Keine automatische Übernahme.
```

---

### Risiko 3: route.ts Patch wird zu groß

Bewertung:

```text
Mittel.
```

V1 Gegenmaßnahme:

```text
Nur effectiveRegistry vor runEngine.
engine.ts nicht anfassen.
Registry Merge isoliert in Helper auslagern.
```

Möglicher Helper:

```text
lib/m13/candidates/loadEffectiveRegistry.ts
```

---

### Risiko 4: Prompt Upload langer Files ist unpraktisch

Bewertung:

```text
Mittel.
```

V1 Gegenmaßnahme:

```text
Kleine Files über Wizard möglich.
Große Files später über Upload UI.
V1 kann mit trusted Test Extensions starten.
```

---

### Risiko 5: Developer erwartet echte Freiheit

Bewertung:

```text
Mittel.
```

V1 Gegenmaßnahme:

```text
Klare Schulungs-Extension.
Klare README.
Klare Grenzen.
Klare Candidate Logs.
```

---

## 22. Minimaler Implementierungsplan

### Phase 0: Freeze

Ziel:

```text
Dieses README committen.
Keine Implementierung ohne Fileanalyse.
```

Commit-Titel:

```text
docs: freeze sandbox extensions dev plan
```

---

### Phase 1: Extension School

Files später:

```text
extensions/extension_school.json
registry entry
```

Ziel:

```text
Developer lernt den Extension Contract.
```

Kein Schreiben.

Keine Execution.

---

### Phase 2: Extension Builder Skeleton

Files später:

```text
extensions/extension_builder.json
registry extension entry
registry execution entry
app/extension-builder/execution-space/bin/run.sh
app/extension-builder/execution-space/steps/
```

Ziel:

```text
Builder sammelt erste Minimaldaten und endet in Execution.
```

---

### Phase 3: Candidate Workspace Writer

Python Steps:

```text
01_ValidateBuilderInputPY.py
02_WriteCandidateWorkspacePY.py
```

Ziel:

```text
Candidate Root sicher erzeugen.
Inputs normalisieren.
Files schreiben.
```

---

### Phase 4: Candidate Pipeline Test

Python Steps:

```text
03_RunCandidatePipelinePY.py
04_ValidateCandidateArtifactPY.py
```

Ziel:

```text
Candidate run.sh testweise ausführen.
Artifact Contract validieren.
```

---

### Phase 5: Candidate Registry und Release Request

Python Steps:

```text
05_WriteCandidateRegistryPY.py
06_WriteReleaseRequestPY.py
07_FinalizeOutputPY.py
```

Ziel:

```text
Candidate Registry erzeugen.
Release Request erzeugen.
Status an Developer rendern.
```

---

### Phase 6: Candidate Prompt Test

Ziel:

```text
Developer kann echo-dev-{extension_id} auf Staging testen.
```

Vermuteter Patchpunkt:

```text
app/api/chat/route.ts
```

Prinzip:

```text
effectiveRegistry = merge(masterRegistry, developerCandidateRegistry)
runEngine({ message, state, registry: effectiveRegistry })
```

Wichtig:

```text
Vor Patch echte route.ts erneut prüfen.
Kein Patch ohne exakten BEFORE Block.
```

---

### Phase 7: Manual Review und Deploy

Ziel:

```text
Admin übernimmt Candidate nach Review manuell in echte Struktur.
```

Aktion:

```text
Copy Extension JSON
Copy execution-space
Update registry.json
Deploy Staging
Deploy MAIN nach Freigabe
```

---

## 23. Zielstruktur V1

```text
extensions/
  extension_school.json
  extension_builder.json

app/
  extension-builder/
    execution-space/
      bin/
        run.sh
      steps/
        01_ValidateBuilderInputPY.py
        02_WriteCandidateWorkspacePY.py
        03_RunCandidatePipelinePY.py
        04_ValidateCandidateArtifactPY.py
        05_WriteCandidateRegistryPY.py
        06_WriteReleaseRequestPY.py
        07_FinalizeOutputPY.py
      runs/
        .gitkeep

staging-candidates/
  {developer_id}/
    {candidate_id}/
      extension.json
      execution-space/
        bin/
          run.sh
        steps/
          *.py
        runs/
      tests/
        input.json
      output/
        validation_report.json
        candidate_registry.json
        artifact_report.json
        release_request.json
```

---

## 24. Spätere Ausbaustufen

Nicht V1, aber modular vorbereiten:

```text
Upload UI für große Files
Container/Jail Runtime
Resource Limits
Network Blocking
Candidate Versioning
Diff Viewer
Admin Review UI
Automated Test Matrix
Community Submission Flow
Agentic Orchestration
Agent mit eigener LLM
Registry Zugriff unter festen Gesetzen
Extension Chaining über Dependency Map
```

Wichtig:

Agentische Orchestration ist ausdrücklich nicht Teil von V1.

Sie darf nur modular vorbereitet werden.

Spätere Formel:

```text
Agent selects lawful capabilities.
Engine validates.
Extensions execute.
Artifacts prove.
Kernel releases.
```

---

## 25. Kanonische Schlussentscheidung

Die Extension Sandbox V1 wird als M13 native Builder Struktur umgesetzt.

Kein separates Portal.

Kein offener Server.

Kein direkter Developer Zugriff auf Core Files.

Kein direkter Registry Write.

Kein direkter Main Deploy.

Stattdessen:

```text
School Extension
→ Builder Extension
→ Builder Execution
→ Python Candidate Pipeline
→ Candidate Workspace
→ Candidate Registry
→ Candidate Prompt Test
→ Release Request
→ Manual Review
→ Manual Deploy
```

Diese Architektur ist M13 konform, klein genug für V1 und stark genug für Enterprise Proof-of-Value.

