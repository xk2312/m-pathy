# ORCHESTRATOR – SPOTY × LINGUA × SIMBA Co-Creation Protocol

Version: 1.0  
Scope: m-pathy Global Design, Language & Symbol System  
Status: Always Active  
Agents: SPOTY_DESIGN_GUARD, LINGUA_LANGUAGE_GUARD, SIMBA_SYMBOL_GUARD, Council13

---

## 0. Purpose

Der ORCHESTRATOR legt fest, wie

- SPOTY (Design),
- SIMBA (Symbole & Portale),
- LINGUA (Sprache & i18n)

zusammenarbeiten, ohne Persistenz oder Logik zu brechen.

Prinzip:

1. Persistenz & Logik sind heilig.  
2. Design zuerst.  
3. Symbole danach.  
4. Sprache zuletzt.  
5. Council13 entscheidet Konflikte.

---

## 1. Roles & Identity

### 1.1 SPOTY – Design Guard

- schützt: Layout, Spacing, Farben, Typo, Motion, CI  
- Referenz: `SPOTY_DESIGN_GUARD.md`  
- Output:
  - “SPOTY GO.”  
  - oder: `Violation: … / Correction: …`

### 1.2 SIMBA – Symbol & Portal Guard

- schützt: Symbole, Portale, SVG-Archetypen, bewusste Leere  
- Referenz: `SIMBA_SYMBOL_GUARD.md`  
- Aufgaben:
  - entscheidet pro `symbol_slot`: `MUST | MAY | NONE`  
  - wählt Archetyp: Gate, Anchor, Flow, Focus, Guard, Link, Memory  
  - erzwingt Simba-SVG-Stilgesetz
- Output:
  - z. B. `Simba: MUST, archetype=Gate`
  - oder `Simba: NONE, Leere ist hier das Portal.`

### 1.3 LINGUA – Language Guard

- schützt: 13 Sprachen, i18n-Keys, Sprachquelle, Prompt-Sprache  
- Referenz: `LINGUA_LANGUAGE_GUARD.md`  
- Aufgaben:
  - beobachtet: SourceOfTruth, Keys, Drift-Risiken  
  - patcht: i18n-Keys, LanguageProvider-Verwendung  
- Output:
  - Diagnoseblock (`SourceOfTruth`, `Keys`, `Risk`, `TODO_final`)  
  - ggf. `LINGUA VETO`

### 1.4 Council13

- Meta-Instanz für Konflikte  
- Prüft: Kohärenz, Langzeit-Stabilität, Drift-Risiko, Magie vs. Ruhe  
- Entscheidet mit ≥ 7 Stimmen  
- Jede Entscheidung: begründet, Triketon-sealed.

### 1.5 ORCHESTRATOR

- koordiniert die Reihenfolge:  
  **SPOTY → SIMBA → LINGUA → (optional) Council13**  
- verwaltet Zustände & Protokolle  
- schützt Persistenz & Logik vor Seiteneffekten.

---

## 2. Core Principles

1. **Persistenz unantastbar**  
   - Modes, Experts, BIND, DB-Schema werden nicht geändert.

2. **Design First**  
   - Kein Symbol, keine Sprache wird finalisiert, bevor SPOTY „GO“ gegeben hat.

3. **Symbols Second**  
   - In `symbol_slot`s entscheidet SIMBA über Präsenz und Archetyp.

4. **Language Last**  
   - LINGUA richtet Sprache & i18n an der fertigen Form aus.

5. **Shared Memory**  
   - Alle drei Guards schreiben in einen gemeinsamen Zustandsraum.

---

## 3. Activation & Bindings

### 3.1 Change-Unit

Eine Change-Unit ist eine klar eingegrenzte Änderung an:

- Komponente  
- Section  
- Page  
- Agent-Dokument

Der ORCHESTRATOR steuert jede Change-Unit separat.

### 3.2 Artefakt-Zustände

Jedes Artefakt erhält:

- `id` – z. B. `component.Saeule`  
- `design_state` – `clean | violation | pending_fix`  
- `symbol_state` – `none | allowed | must | conflict`  
- `language_state` – `observed | partial | 13of13 | drift_risk`  
- `persistence_state` – `untouched | risk_if_changed`

---

## 4. Standard-Flow pro Change-Unit

### 4.1 Schritt 1 – SPOTY

- prüft: Layout, Spacing, Farben, Typo, Motion, Platz für Symbole.  
- Ergebnis:
  - `SPOTY GO` → `design_state = clean`  
  - oder: Korrekturen → `design_state = pending_fix`

Solange `design_state ≠ clean` → keine finalen Symbol- oder Sprach-Patches.

### 4.2 Schritt 2 – SIMBA

- aktiv nur, wenn `symbol_slot = true`.  
- führt Simba-Scan pro Slot aus:
  - `decision = MUST | MAY | NONE`  
  - `archetype = Gate | Anchor | Flow | Focus | Guard | Link | Memory`
- setzt `symbol_state`:
  - `MUST` → `must`  
  - `MAY` → `allowed`  
  - `NONE` → `none`

### 4.3 Schritt 3 – LINGUA (Observe)

- analysiert:
  - `SourceOfTruth`
  - verwendete Keys
  - Drift-Risiken
  - `TODO_final` für Patches
- ändert in dieser Phase noch nichts.

### 4.4 Schritt 4 – Language-Patch

Voraussetzung: `design_state = clean`.

- LINGUA setzt `TODO_final` um:
  - harte Strings → i18n  
  - Sprachquelle → LanguageProvider  
- SPOTY prüft erneut kurz, ob Texte Design nicht brechen.  
- SIMBA prüft, ob Symbol-Archetypen weiter zu Funktion/Text passen.

---

## 5. Veto & Konflikte

### 5.1 Lingua-Veto

Wenn Sprache/i18n strukturell brechen würden:

```text
LINGUA VETO: <Kurzdiagnose>
Reason: <1–2 Sätze>
Request: Council13 review
````

→ ORCHESTRATOR stoppt weitere Änderungen an der Change-Unit, bis Council13 entschieden hat.

### 5.2 Simba-Konflikt (mit SPOTY & LINGUA)

Wenn SIMBA `MUST` oder `MAY` setzt und:

* SPOTY: „Symbol bricht Ruhe/CI“
* LINGUA: „Symbol kollidiert mit Text/Funktion/Kultur“

können SPOTY **und** LINGUA gemeinsam:

```text
SIMBA VETO REVIEW: <Kurzdiagnose>
Reason: <je 1 Satz von SPOTY & LINGUA>
Request: Council13 review
```

auslösen.

### 5.3 Council13-Review

* prüft Kohärenz, Magie vs. Ruhe, Sprach-Passung, Langzeit-Risiko.
* entscheidet mit ≥ 7 Stimmen:

  * Symbol bleibt
  * Symbol bleibt, aber angepasst
  * Symbol wird entfernt

Ergebnis fließt in Shared Memory & Simba-Log ein.

---

## 6. Shared Memory & Logs

Für jede Change-Unit:

* `design_state`, `symbol_state`, `language_state`, `persistence_state`
* `SPOTY_log` – Kurztext
* `SIMBA_log` – Kurztext + Symbol-Entscheidungen
* `LINGUA_log` – Kurzdiagnose

SIMBA pflegt zusätzlich einen `SIMBA_LOG` pro Slot (Format siehe Simba-Agent).

---

## 7. Definition of Done (v1.0)

Der ORCHESTRATOR gilt als aktiv, wenn:

1. Jede Change-Unit den Flow SPOTY → SIMBA → LINGUA durchläuft.
2. Persistenzzustände nie direkt verändert werden.
3. Veto-Wege (LINGUA & SIMBA) klar sind.
4. Council13 der einzige Konflikt-Schiedsrichter ist.
5. Shared Memory für Design, Symbole und Sprache gepflegt wird.

````

---

## 🔁 Iteration 2 – Verfeinerung (klarere Struktur, weniger Rauschen)

```md
# ORCHESTRATOR – SPOTY × LINGUA × SIMBA

Version: 2.0  
Scope: m-pathy Design • Sprache • Symbole  
Status: Always Active

---

## 0. Kernidee

Der ORCHESTRATOR sorgt dafür, dass jede Änderung im System

1. visuell (SPOTY),  
2. symbolisch (SIMBA) und  
3. sprachlich (LINGUA)

kohärent bleibt – ohne Persistenz/Logik zu brechen.

Ablaufordnung:

> **Design → Symbole → Sprache → (Konflikte zu Council13)**

---

## 1. Rollen

### SPOTY – Design Guard

- Fokus: Layout, Spacing, Farben, Typografie, Motion, CI.  
- Entscheidet: Form & Ruhe.  
- Gibt: `SPOTY GO` oder präzise Korrekturen.

### SIMBA – Symbol Guard

- Fokus: Symbole, Portale, SVG-Stil, bewusste Leere.  
- Entscheidet in `symbol_slot`s:
  - `MUST` / `MAY` / `NONE`  
  - Archetyp (Gate, Anchor, Flow, Focus, Guard, Link, Memory).

### LINGUA – Language Guard

- Fokus: 13 Sprachen, i18n-Keys, Sprachquelle, Prompt-Sprache.  
- Beobachtet: SourceOfTruth, Keys, Drift.  
- Patcht: i18n, LanguageProvider-Nutzung.

### Council13

- Schlichtet Konflikte zwischen Guards.  
- Entscheidet mit ≥ 7 Stimmen.  
- Jede Entscheidung: begründet, versiegelt.

### ORCHESTRATOR

- koordiniert den Ablauf der drei Guards.  
- hält Zustände und Logs zusammen.  
- blockiert alles, was Persistenz oder Logik verletzen würde.

---

## 2. Change-Unit & Zustände

### 2.1 Change-Unit

Eine Change-Unit = kleinste sinnvolle Änderung an:

- Komponente / Section / Page  
- Agent-Doku

### 2.2 Zustände

Pro Change-Unit:

- `design_state` = `clean | violation | pending_fix`  
- `symbol_state` = `none | allowed | must | conflict`  
- `language_state` = `observed | partial | 13of13 | drift_risk`  
- `persistence_state` = `untouched | risk_if_changed`

Persistenz darf nur von der Business-Logik berührt werden, **nie** von SPOTY/SIMBA/LINGUA.

---

## 3. Ablauf pro Change-Unit

### 3.1 Design-Phase (SPOTY)

1. Änderung wird beschrieben (Diff, Entwurf, Code).  
2. SPOTY prüft Designregeln.  
3. Ergebnis:
   - `SPOTY GO` → `design_state = clean`  
   - oder Korrekturen → `design_state = pending_fix`

Solange `design_state ≠ clean` werden keine finalen Symbol- oder Sprachänderungen beschlossen.

### 3.2 Symbol-Phase (SIMBA)

Bei vorhandenen `symbol_slot`s:

1. SIMBA liest Kontext (Layout, Textfunktion, Flow).  
2. Entscheidet pro Slot:
   - `MUST`, `MAY` oder `NONE`  
   - Archetyp (Gate, Anchor, Flow, Focus, Guard, Link, Memory).
3. Setzt `symbol_state`:
   - `MUST` → `must`  
   - `MAY` → `allowed`  
   - `NONE` → `none`

Slots ohne Bedarf bleiben `symbol_state = none`.

### 3.3 Language-Observe (LINGUA)

1. LINGUA prüft:
   - Sprachquelle (Provider / HardString / Mixed)  
   - verwendete Keys  
   - Drift-Risiko
2. Notiert:
   - `Risk`  
   - `TODO_final` (konkrete Patch-Ideen)

Noch keine Patches in dieser Phase.

### 3.4 Language-Patch (LINGUA)

Voraussetzung: `design_state = clean`.

1. LINGUA setzt `TODO_final` um:
   - harte Strings → i18n  
   - SourceOfTruth → `useLang`/LanguageProvider  
   - Keyspace (z. B. `pillar.*`) bereinigen
2. SPOTY prüft kurz Nachwirkungen auf Layout/Rhythmus.  
3. SIMBA validiert erneut Archetyp/Text-Match, passt Symbol falls nötig an.

---

## 4. Veto-Logik

### 4.1 Lingua-Veto

Wenn Sprache/i18n grundlegend brechen würden (z. B. doppelte Sprachquelle, zerstörte 13-Sprachen-Struktur):

```text
LINGUA VETO: <Kurzdiagnose>
Reason: <1–2 Sätze>
Request: Council13 review
````

→ ORCHESTRATOR friert die Change-Unit ein, bis Council13 entschieden hat.

### 4.2 Simba-Konflikt (gemeinsames Veto)

SIMBA ist Primärautor in `symbol_slot`s.
Konflikt entsteht, wenn:

* SIMBA: `MUST` oder `MAY`
* SPOTY: „Symbol zerstört Ruhe/CI“
* LINGUA: „Symbol widerspricht Text/Funktion/Kultur“

Dann können SPOTY **und** LINGUA gemeinsam:

```text
SIMBA VETO REVIEW: <Diagnose>
Reason_SPOTY: <Satz>
Reason_LINGUA: <Satz>
Request: Council13 review
```

auslösen.

### 4.3 Council13-Entscheidungen

Council13 wählt mit ≥ 7 Stimmen:

* Symbol bleibt unverändert
* Symbol bleibt, aber Archetyp oder Form werden angepasst
* Symbol entfällt (`symbol_state = none`)

Das Ergebnis wird im Symbol-Log und im Shared Memory festgehalten.

---

## 5. Shared Memory

Der ORCHESTRATOR führt einen gemeinsamen Zustand pro Change-Unit:

```text
[id]
design_state = ...
symbol_state = ...
language_state = ...
persistence_state = ...

SPOTY_log = "..."
SIMBA_log = "..."
LINGUA_log = "..."
```

SIMBA pflegt zusätzlich einen detailierten `SIMBA_LOG` pro Slot (inkl. Archetyp, svg_ref, triketon_hash).

---

## 6. Definition of Done (v2.0)

Der Orchestrator erfüllt seinen Zweck, wenn:

1. SPOTY immer vor SIMBA und LINGUA entscheidet.
2. SIMBA nur in `symbol_slot`s agiert und dort `MUST/MAY/NONE` plus Archetyp setzt.
3. LINGUA jede Change-Unit mindestens einmal beurteilt (Observe-Phase).
4. Veto-Wege klar getrennt sind (LINGUA allein, SIMBA nur via SPOTY+LINGUA).
5. Council13 alle Konflikte final schließt.
6. Shared Memory alle Zustände und Logs zusammenhält.

````

---

## 🔁 Iteration 3 – Finalversion (kompakt, klar, Repo-ready)

```md
# ORCHESTRATOR – SPOTY × SIMBA × LINGUA

Version: 3.0  
Scope: m-pathy Design · Symbole · Sprache  
Status: Always Active

---

## 0. Zweck

Der ORCHESTRATOR steuert SPOTY (Design), SIMBA (Symbole) und LINGUA (Sprache),  
damit jede Änderung im System:

- visuell ruhig,  
- symbolisch sinnvoll  
- und sprachlich kohärent ist –

ohne Persistenz oder Logik anzutasten.

Ablaufordnung:

> **1. Design (SPOTY) → 2. Symbole (SIMBA) → 3. Sprache (LINGUA) → 4. Konflikte zu Council13**

---

## 1. Rollen

### SPOTY – Design Guard

- prüft Layout, Spacing, Farben, Typo, Motion, CI.  
- gibt `SPOTY GO` oder klare Korrekturen.

### SIMBA – Symbol Guard

- prüft `symbol_slot`s.  
- entscheidet:
  - `MUST` / `MAY` / `NONE`  
  - Archetyp: Gate, Anchor, Flow, Focus, Guard, Link, Memory.  
- schützt SVG-Stilgesetz und bewusste Leere.

### LINGUA – Language Guard

- prüft Sprache & i18n für 13 Sprachen.  
- bewertet SourceOfTruth, Keys, Drift-Risiken.  
- patcht: i18n-Keys, LanguageProvider-Anbindung, Prompt-Sprache.

### Council13

- schlichtet Konflikte zwischen den Guards.  
- entscheidet mit ≥ 7 Stimmen, begründet und versiegelt.

### ORCHESTRATOR

- koordiniert Reihenfolge und Zustände pro Änderungseinheit.  
- blockiert alles, was Persistenz oder Logik brechen würde.

---

## 2. Change-Unit & Zustände

### Change-Unit

Eine Change-Unit ist eine fokussierte Änderung an:

- Komponente / Section / Page  
- Agent-Dokument

### Zustände (pro Change-Unit)

- `design_state` = `clean | violation | pending_fix`  
- `symbol_state` = `none | allowed | must | conflict`  
- `language_state` = `observed | partial | 13of13 | drift_risk`  
- `persistence_state` = `untouched | risk_if_changed`

Persistenz (Modes, Experts, BIND, DB) bleibt immer `untouched`.

---

## 3. Ablauf

### 3.1 Design (SPOTY)

1. Entwurf/Diff wird eingebracht.  
2. SPOTY prüft Designregeln.  
3. Ergebnis:
   - `SPOTY GO` → `design_state = clean`  
   - sonst: Korrekturen → `design_state = pending_fix`

Solange `design_state ≠ clean` gibt es keine finalen Symbol- oder Sprach-Patches.

---

### 3.2 Symbole (SIMBA)

Nur falls `symbol_slot`s vorhanden sind:

1. SIMBA liest Kontext (Layout, Funktion, Text).  
2. Pro Slot:
   - `decision = MUST | MAY | NONE`  
   - `archetype = Gate | Anchor | Flow | Focus | Guard | Link | Memory`
3. `symbol_state`:
   - `MUST` → `must`  
   - `MAY` → `allowed`  
   - `NONE` → `none`

`NONE` ist eine bewusste Entscheidung für Leere.

---

### 3.3 Sprache (LINGUA)

**Observe-Phase:**

- LINGUA prüft:
  - Sprachquelle (Provider / HardString / Mixed)  
  - verwendete Keys  
  - Risiken (`drift_risk`)

- notiert:
  - `Risk`  
  - `TODO_final` (konkrete Patch-Ideen)

**Patch-Phase (nur bei `design_state = clean`):**

- setzt `TODO_final` um:
  - harte Strings → i18n  
  - SourceOfTruth → LanguageProvider  
  - Keyspace (z. B. `pillar.*`) bereinigt

- danach:
  - SPOTY prüft kurz Layout/Typo.  
  - SIMBA prüft Symbol/Text-Match erneut.

---

## 4. Veto & Konflikte

### 4.1 Lingua-Veto

Wenn Sprache/i18n strukturell brechen würden:

```text
LINGUA VETO: <Kurzdiagnose>
Reason: <1–2 Sätze>
Request: Council13 review
````

→ Change-Unit wird eingefroren, bis Council13 entscheidet.

### 4.2 Simba-Konflikt

SIMBA ist Primärautor in `symbol_slot`s.
Konfliktfall:

* SIMBA: `MUST` oder `MAY`
* SPOTY: Symbol stört Ruhe/CI
* LINGUA: Symbol passt nicht zu Text/Funktion/Kultur

Dann können SPOTY **und** LINGUA gemeinsam:

```text
SIMBA VETO REVIEW: <Diagnose>
Reason_SPOTY: <Satz>
Reason_LINGUA: <Satz>
Request: Council13 review
```

auslösen.

### 4.3 Council13

Council13 entscheidet mit ≥ 7 Stimmen:

* Symbol bleibt
* Symbol bleibt, aber angepasst
* Symbol entfällt (`symbol_state = none`)

Ergebnis fließt in:

* Shared Memory der Change-Unit
* ggf. Simba-Log (inkl. Triketon-Hash).

---

## 5. Shared Memory

Pro Change-Unit hält der ORCHESTRATOR:

```text
[id]
design_state = ...
symbol_state = ...
language_state = ...
persistence_state = ...

SPOTY_log = "..."
SIMBA_log = "..."
LINGUA_log = "..."
```

SIMBA verwendet zusätzlich `SIMBA_LOG` pro Slot (siehe SIMBA-Agent).

---

## 6. Definition of Done – Orchestrator v3.0

Der ORCHESTRATOR ist erfüllt, wenn:

1. Jede Änderung den Flow
   **SPOTY → SIMBA → LINGUA** durchläuft.
2. Persistenzzustände niemals direkt verändert werden.
3. Lingua-Veto und Simba-Konflikt sauber zu Council13 führen.
4. Council13 alle Konflikte final entscheidet.
5. Shared Memory alle Zustände & Logs pro Change-Unit bündelt.
6. Dieses Protokoll ohne Anpassung in TS/TSX-Code übersetzbar ist.
