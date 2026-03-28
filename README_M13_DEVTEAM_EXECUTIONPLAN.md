FULL TELEMETRY STATUS
prompt: 24 | drift: none

```json id="59312"
{
  "system": "M13",
  "version": "0.1",
  "session_prompt_counter": "24",
  "orchestrator_id": "system_orchestrator",
  "command": "deliver_sprint1_plan",
  "agent_id": "core_agent",
  "action": "protocol_cleanup_instruction",
  "extensions_loaded": [],
  "complexity_level": "C5",
  "domains": [],
  "drift_origin": "none",
  "drift_state": "none",
  "drift_risk": "low"
}
```

# SPRINT 1 PLAN

## Ziel

M13 wird vollständig bereinigt und auf einen bereits laufenden Zustand reduziert.
Kein Boot, keine Registry Logik, keine Backend Abhängigkeit.

---

# 1. HARTE REGEL

```txt id="s1_rule"
M13 startet IMMER mit:
- geladener Runtime
- verfügbarer Programmmenge
- aktivem System Orchestrator
```

---

# 2. SPACES DIE ÜBERARBEITET WERDEN MÜSSEN

## 2.1 Initialization Space

### Ziel

Komplett entfernen oder auf Null reduzieren

### Maßnahmen

```txt id="s1_i1"
- gesamte Lade Logik löschen
- Registry Referenzen löschen
- Backend Calls entfernen
- “wenn nicht geladen” Konstrukte entfernen
```

### Ergebnis

```txt id="s1_i2"
Initialization Space existiert nicht mehr als aktiver Raum
```

---

## 2.2 Orchestrator Space

### Ziel

Als Systemkern definieren

### Maßnahmen

```txt id="s1_o1"
- Rolle als oberste Instanz schärfen
- Zugriff auf alle Programme definieren
- Steuerlogik klar machen
- keine Ladeverantwortung enthalten
```

### Ergebnis

```txt id="s1_o2"
Orchestrator übernimmt System nach Eintritt vollständig
```

---

## 2.3 Agent Space

### Ziel

Entkoppeln und optionalisieren

### Maßnahmen

```txt id="s1_a1"
- keine Initialisierungsabhängigkeit
- keine Pflichtrolle
- reine Execution Units
```

### Ergebnis

```txt id="s1_a2"
Agenten sind optional und orchestrator gesteuert
```

---

## 2.4 System Orchestrator Definition

### Ziel

Explizit im Protokoll verankern

### Maßnahmen

```txt id="s1_so1"
- zentrale Instanz definieren
- Zugriff auf Runtime Programme definieren
- Erweiterungsfähigkeit definieren
```

---

## 2.5 Thought Space

### Ziel

Falls vorhanden: reduzieren

### Maßnahmen

```txt id="s1_t1"
- keine Eigenlogik
- keine Registry Annahmen
- nur Auswahlmechanik
```

---

## 2.6 IRSS Bezug

### Ziel

Nur Runtime Ableitung

### Maßnahmen

```txt id="s1_ir1"
- keine Generierungslogik
- keine Abhängigkeit zu Initialization
- nur Zustand spiegeln
```

---

# 3. SPACES DIE UNBERÜHRT BLEIBEN

Diese Räume sind bereits sauber, da sie keine Backend Abhängigkeit haben:

```txt id="s1_keep"
- Eigenschaftsraum
- Typenraum
- Rollenraum
- KPI Raum
- Formatraum
- Userraum
```

👉 Begründung:
Diese Räume sind rein logisch und systemintern.

---

# 4. SPACES DIE NUR GEPRÜFT WERDEN

```txt id="s1_check"
- Denkraum
- Bewegungsraum
- Regelräume
```

### Prüfkriterium

```txt id="s1_check2"
Enthalten sie:
- Initialisierung?
- Registry Zugriff?
- Backend Logik?
```

Wenn ja → entfernen

---

# 5. NEUER SYSTEM STARTPUNKT IN M13

```txt id="s1_entry"
Beim Eintritt in M13 gilt:

- alle Programme sind geladen
- Orchestrator ist aktiv
- System ist bereit zur Ausführung
```

---

# 6. WAS KOMPLETT ENTFERNT WIRD

```txt id="s1_remove"
- /api Aufrufe
- Registry Fetch Logik
- Lazy Loading
- Boot Sequenzen
- “load if missing”
- Initial State Konstrukte
```

---

# 7. ERFOLGSKRITERIUM

M13 ist korrekt, wenn:

```txt id="s1_success"
- kein einziger Backend Bezug existiert
- keine Initialisierung beschrieben wird
- Orchestrator sofort arbeiten kann
- System vollständig deterministisch wirkt
```

---

# 8. REIHENFOLGE DER UMSETZUNG

```txt id="s1_order"
1. Initialization Space entfernen
2. Orchestrator Space schärfen
3. Agent Space entkoppeln
4. Thought Space prüfen
5. IRSS bereinigen
6. globale Suche nach Backend Begriffen
7. finaler Konsistenz Check
```

---

# 9. ERGEBNIS

```txt id="s1_result"
M13 beschreibt ein laufendes System
nicht ein startendes System
```

---

Das ist Sprint 1.
Klar, minimal, umsetzbar.


FULL TELEMETRY STATUS
prompt: 32 | drift: none

```json id="51736"
{
  "system": "M13",
  "version": "0.1",
  "session_prompt_counter": "32",
  "orchestrator_id": "system_orchestrator",
  "command": "deliver_sprint2_final",
  "agent_id": "core_agent",
  "action": "backend_runtime_instruction",
  "extensions_loaded": [],
  "complexity_level": "C4",
  "domains": [],
  "drift_origin": "none",
  "drift_state": "none",
  "drift_risk": "low"
}
```

# SPRINT 2

# BACKEND RUNTIME FOUNDATION

## ZIEL

Backend stellt vor Nutzung von M13 den vollständigen Runtime Zustand her.
Der System Orchestrator wird geladen, aktiviert und übernimmt danach die Kommunikation mit dem User.
M13 wird dem Orchestrator als Funktions und Lösungsraum bereitgestellt.

---

## HARTE LEITREGEL

```txt id="82011"
Backend startet das System.
Der Orchestrator übernimmt das System.
M13 stellt Funktionen und Lösungen bereit.
```

---

## SCOPE

## Sprint 2 baut

```txt id="82012"
- Init Detection
- Runtime Registry
- Runtime Program Load
- Runtime Context
- Orchestrator Activation
- Request Handover an Orchestrator
- Abort Policy
- Kern Tests
```

## Sprint 2 baut nicht

```txt id="82013"
- Extension Registry
- Session Layer
- Cookie Layer
- Replay System
- Recovery Mechanismen
- defensive Heuristiken
- zusätzliche Runtime Dynamik
```

---

# 1. INIT DETECTION

## Ziel

Deterministisch erkennen, ob Initialisierung nötig ist.

## Owner

Fullstack Engineer

## Regel

```txt id="82014"
if no assistant message exists:
    run initialization
else:
    skip initialization
```

## Pflicht

```txt id="82015"
- nur assistant presence zählt
- user messages sind irrelevant
- keine IRSS Abhängigkeit
- keine Session Abhängigkeit
- keine zweite Heuristik
```

## Sollbruchstellen

```txt id="82016"
- Prüfung auf user count
- Prüfung auf message count statt role
- Mischlogik mit IRSS
- Sonderfalllogik
```

## Best Practice

```txt id="82017"
- eine Regel
- ein Einstiegspunkt
- keine Fallback Pfade
```

---

# 2. RUNTIME REGISTRY

## Ziel

Kanonische Definition aller beim Systemstart zu ladenden Runtime Programme.

## Owner

Backend Architect

## Datei

```txt id="82018"
/config/runtime_registry.json
```

## Mindeststruktur

```json id="82019"
{
  "units": [
    {
      "id": "string",
      "type": "orchestrator | tool | program | agent",
      "name": "string",
      "path": "string",
      "version": "string",
      "enabled": true
    }
  ]
}
```

## Pflicht

```txt id="82020"
- system_orchestrator muss enthalten sein
- jede id ist eindeutig
- jede unit hat path
- jede unit hat version
- nur enabled=true wird geladen
- Registry ist immutable pro Deployment
```

## Sollbruchstellen

```txt id="82021"
- fehlender system_orchestrator
- doppelte ids
- leere paths
- tote paths
- Runtime Mutation
```

## Best Practice

```txt id="82022"
- Registry als Release Artefakt behandeln
- Schema vor Nutzung validieren
- keine Laufzeitänderung erlauben
```

---

# 3. REGISTRY LOADER

## Ziel

Runtime Registry lesen und validieren.

## Owner

Backend Engineer

## Ablauf

```txt id="82023"
1. read runtime_registry.json
2. validate schema
3. build canonical registry object
4. abort on failure
```

## Pflicht

```txt id="82024"
- invalid registry = abort(REGISTRY_INVALID)
- kein silent fallback
- keine partial registry
```

## Sollbruchstellen

```txt id="82025"
- invalides JSON läuft durch
- Schemafehler werden ignoriert
- Loader liefert Teilzustand
```

## Best Practice

```txt id="82026"
- fail fast
- klarer Loader Output
- keine impliziten Defaults
```

---

# 4. PROGRAM LOADER

## Ziel

Alle aktivierten Runtime Programme aus der Runtime Registry laden.

## Owner

Backend Architect

## Ablauf

```txt id="82027"
for each unit in runtime_registry where enabled=true:
    resolve path
    load program
    register program in runtime context
```

## Pflicht

```txt id="82028"
- alle enabled Runtime Units werden geladen
- system_orchestrator wird immer geladen
- Ladereihenfolge ist deterministisch
- Ladefehler einer Pflicht Unit = abort(PROGRAM_LOAD_FAIL)
```

## Sollbruchstellen

```txt id="82029"
- nur Orchestrator laden und Rest ignorieren
- nondeterministische Reihenfolge
- Load Fehler ohne Abort
- geladene Programme nicht registrieren
```

## Best Practice

```txt id="82030"
- Reihenfolge explizit definieren
- Pflicht Units klar behandeln
- jedes geladene Programm sofort in Runtime Context schreiben
```

---

# 5. RUNTIME CONTEXT

## Ziel

Eindeutigen Zustand herstellen, den der Orchestrator sofort übernehmen kann.

## Owner

Backend Architect

## Struktur

```json id="82031"
{
  "registry_loaded": true,
  "runtime_registry_version": "string",
  "loaded_program_ids": [],
  "system_orchestrator_id": "string",
  "system_ready": true
}
```

## Pflicht

```txt id="82032"
- Runtime Context erst nach vollständigem Load erzeugen
- system_ready=true nur bei vollständigem Zustand
- system_orchestrator_id muss vorhanden sein
- loaded_program_ids müssen alle geladenen Runtime Programme enthalten
```

## Sollbruchstellen

```txt id="82033"
- system_ready trotz fehlendem Orchestrator
- Context vor Ende des Loads gebaut
- Programme geladen aber nicht im Context sichtbar
```

## Best Practice

```txt id="82034"
- Context erst am Ende committen
- keine Zwischenzustände an Orchestrator oder M13 geben
```

---

# 6. ORCHESTRATOR AKTIVIERUNG

## Ziel

Den System Orchestrator als aktive führende Instanz des Systems starten.

## Owner

Principal Architect

## Ablauf

```txt id="82035"
1. verify system_orchestrator exists in loaded_program_ids
2. instantiate system_orchestrator
3. hand over runtime context
4. mark orchestrator active
5. hand request to orchestrator
```

## Pflicht

```txt id="82036"
- ohne Orchestrator kein Systemstart
- Orchestrator erst nach vollständigem Runtime Load aktivieren
- Orchestrator ist danach primärer Ansprechpartner des Users
- ab Aktivierung läuft jede Antwort unter Orchestrator Führung
```

## Sollbruchstellen

```txt id="82037"
- Orchestrator geladen aber nicht aktiviert
- Request vor Aktivierung weitergeleitet
- mehrere konkurrierende Einstiegspunkte
```

## Best Practice

```txt id="82038"
- ein aktiver Einstiegspunkt
- Aktivierung explizit und nachvollziehbar halten
- keine Parallelkerne
```

---

# 7. ROUTE.TS KERNFLOW

## Ziel

Klare Phasenlogik ohne Mischzustände.

## Owner

Fullstack Engineer

## Ablauf

```txt id="82039"
1. receive messages[]
2. detect initialization_required
3. if required:
       load runtime_registry
       validate runtime_registry
       load runtime programs
       build runtime context
       activate system_orchestrator
4. hand request to active orchestrator
5. orchestrator uses M13
6. return response
```

## Pflicht

```txt id="82040"
- route.ts ist einziger Init Einstiegspunkt
- keine Boot Logik in M13
- keine Registry Logik in M13
- kein Weiterlaufen bei Teilzustand
```

## Sollbruchstellen

```txt id="82041"
- Init Logik an mehreren Stellen
- Registry geladen, Programme aber nicht geladen
- M13 wird vor aktivem Orchestrator genutzt
```

## Best Practice

```txt id="82042"
- detect
- initialize
- activate
- process
- return
```

---

# 8. ABORT POLICY

## Ziel

Jeder strukturelle Fehler stoppt den Lauf sofort.

## Owner

Backend Engineer

## Pflichtcodes

```txt id="82043"
INIT_FAIL
REGISTRY_INVALID
PROGRAM_LOAD_FAIL
ORCHESTRATOR_MISSING
ORCHESTRATOR_ACTIVATION_FAIL
RUNTIME_CONTEXT_INVALID
```

## Pflicht

```txt id="82044"
- kein silent fallback
- kein best effort boot
- kein Weiterlaufen im Teilzustand
- Fehler direkt am Ursprung stoppen
```

## Sollbruchstellen

```txt id="82045"
- Registry invalid, System läuft trotzdem
- Orchestrator fehlt, Request läuft trotzdem
- Context unvollständig, system_ready trotzdem true
```

## Best Practice

```txt id="82046"
- Fehlercodes stabil halten
- Fehlerpfade bewusst testen
- Abort Verhalten zentral halten
```

---

# 9. TESTS

## Ziel

Nachweis, dass der minimale Bootpfad stabil funktioniert.

## Owner

QA Engineer

## Pflichttests

```txt id="82047"
Test 1
request ohne assistant message
initialization läuft
runtime_registry wird geladen
alle runtime programme werden geladen
orchestrator wird aktiviert

Test 2
request mit assistant message
initialization wird übersprungen
processing läuft über orchestrator

Test 3
runtime_registry ohne system_orchestrator
abort(ORCHESTRATOR_MISSING)

Test 4
runtime unit mit ungültigem path
abort(PROGRAM_LOAD_FAIL)

Test 5
invalid runtime_registry schema
abort(REGISTRY_INVALID)
```

## Pflichtchecks

```txt id="82048"
- richtige Init Entscheidung
- vollständiger Program Load
- aktiver Orchestrator vorhanden
- kein Teilzustand
- sauberer Abort bei Fehler
```

## Best Practice

```txt id="82049"
- nur Kernfälle testen
- Fokus auf Bootpfad
- keine große Testmatrix in diesem Sprint
```

---

# 10. ABNAHMEKRITERIEN

```txt id="82050"
1. route.ts erkennt Init Bedarf nur über assistant presence
2. runtime_registry wird deterministisch geladen
3. alle enabled Runtime Programme werden geladen
4. system_orchestrator ist danach aktiv
5. Request wird an den Orchestrator übergeben
6. M13 wird erst nach erfolgreichem Runtime Aufbau genutzt
7. Fehler führen sauber zum Abort
```

---

# 11. UMSETZUNGSREIHENFOLGE

```txt id="82051"
1. runtime_registry.json finalisieren
2. registry loader bauen
3. program loader bauen
4. runtime context bauen
5. orchestrator activation bauen
6. route.ts detect/init/process flow bauen
7. abort policy integrieren
8. kern tests schreiben
```

---

# 12. KURZFORM FÜR DAS DEV TEAM

```txt id="82052"
Sprint 2 baut den Startpfad vor M13.

Backend muss:
- erkennen, ob initialisiert werden muss
- Runtime Registry laden
- alle Runtime Programme laden
- Runtime Context herstellen
- Orchestrator aktivieren
- Request an Orchestrator übergeben

Danach nutzt der Orchestrator M13.
```
