# README — Refactoring Protocol (Canonical)

MODE: Standard · Team-wide · Reproducible · Junior-safe
GOAL: Sichere, deterministische und driftfreie Refactorings in komplexen Systemen

---

## 0. Grundsatz (nicht verhandelbar)

> **Refactoring ist ein kontrollierter Erkenntnis‑→‑Umsetzungs‑Prozess, kein spontanes Umbauen.**

Dieses Protokoll ist **bindend** für alle Refactorings – unabhängig von Umfang, Dringlichkeit oder Erfahrungsgrad der Entwickler.

Der Prozess trennt strikt:

* **Denken** (Analyse)
* **Festlegen** (Soll)
* **Planen** (Patchplan)
* **Handeln** (Execution)

---

## 1. Point Zero (Reset & Klarheit)

**Zweck:** Mentale und technische Ausgangslage stabilisieren.

Pflicht:

* Keine aktiven Patches
* Kein Code in Bewegung
* Ziel unklar → **STOPP**

Ergebnis:

* Bewusster Startpunkt („Point Zero“)

---

## 2. Sollzustand definieren (bindend)

**Vor jeder Änderung:**

* Architektur‑, UI‑ oder Verhaltens‑Sollzustand **schriftlich** festlegen
* Explizit, eindeutig, ohne Interpretation

Regeln:

* Der Sollzustand ist **nicht verhandelbar**, sobald er fixiert ist
* Änderungen am Sollzustand → **neuer Refactoring‑Zyklus**

---

## 3. Istzustand analysieren (dateiweiser Index · Babysteps)

**Zweck:** Sicherstellen, dass das System immer mit dem **echten Projektcode** arbeitet.

### Verbindlicher Ablauf (Junior‑tauglich, kein Spielraum)

1. User nimmt die **Originaldatei aus dem Projekt/Repo**.
2. User erstellt daraus **zuerst eine `.txt`‑Datei** (gleicher Name + `.txt`).
3. User kopiert den **kompletten Originalcode unverändert** in diese `.txt`‑Datei.
4. User lädt **diese `.txt`‑Datei** hoch.
5. Das System analysiert den Istzustand und liefert **einen File‑Index** zurück.
6. User fügt den gelieferten **Index als Kommentarblock ganz oben** in die Originaldatei im Projekt ein.
7. User speichert die Originaldatei.
8. User markiert **den gesamten Dateiinhalt**.
9. User kopiert alles erneut in die `.txt`‑Datei (Update des Snapshots).

👉 Ergebnis:

* `.txt` = **1:1 Spiegel des aktuellen Projektcodes**
* Keine Annahmen, kein Kontextverlust

**Regeln:**

* Kein Index ohne `.txt`
* Keine Analyse ohne Upload
* Indizes dürfen **niemals manuell verändert** werden
* Es wird **immer nur eine Datei gleichzeitig** bearbeitet

---

## 4. Gesamt‑Index bilden

**Ziel:** Systemische Abweichungen sichtbar machen.

Enthält:

* Wiederkehrende Muster
* Lokale vs. systemische Deltas
* Klare Problemcluster

Ergebnis:

* Gemeinsames, teamweites Verständnis des Problems

---

## 5. Patchplan erstellen (Planung only)

**Eigenschaften:**

* Sequenziell
* Ein Pfad (keine Alternativen)
* Patch‑weise strukturiert

Jeder Patch enthält **verpflichtend**:

* Ziel
* Betroffene Dateien
* Inhalt (Plan, kein Code)
* Abhängigkeiten
* Risiko

**In dieser Phase gilt strikt:**

* ❌ Kein Code
* ❌ Keine Lösungsversuche

---

## 6. Übergabeprotokoll erstellen

**Zweck:** Nahtloser Übergang in die Execution‑Phase ohne Kontextverlust.

Das Übergabeprotokoll enthält:

* Den fixierten Sollzustand
* Die Liste aller analysierten Dateien
* Den vollständigen Patchplan
* Einen expliziten Hinweis auf **im Memory gespeicherte Referenzen**

📌 **Memory‑Regel (explizit):**
Wenn etwas im Memory gespeichert werden soll, muss der User **ausdrücklich sagen**:

* *was* gespeichert werden soll
* *warum*
* *exakter Wortlaut*
* Zusatz: **„Bitte exakt so und ohne Änderung speichern.“**

Ohne diese Anweisung → **kein Memory‑Eintrag**.

---

## 7. Execution‑Phase (separater Node / Kontext)

### 7.0 Grundregeln (nicht verhandelbar)

* Babysteps
* Ein Patch = ein Commit
* Repo = **Single Source of Truth**
* Keine Re‑Analyse
* Keine Neuinterpretation
* Keine Scope‑Erweiterung

### 7.1 Patch‑Ausgabe (Pflichtinhalt)

Bei **jedem** Patch muss das System **immer** liefern:

1. **Commit‑Titel** (final, eindeutig, copy‑paste‑fähig)
2. **Exakte Datei**, die im **nächsten Patch** aus den Projektdateien gelesen wird

**Zweck:**

* Verhindert Kontextverlust
* Verhindert Raten durch den Assistenten
* Erzwingt eine lineare, deterministische Patch‑Kette

Ohne diese zwei Punkte ist ein Patch **ungültig**.

### 7.2 BEFORE / AFTER – 1:1‑Regel

**Kritische Regel:**

* BEFORE‑Blöcke müssen **exakt 1:1** dem Projektcode entsprechen
* **Keine** ausgelassenen Leerzeilen
* **Keine** entfernten Kommentare
* **Keine** verkürzten Ausschnitte
* Auch bei **100+ Zeilen**

**Warum:**

* Blöcke müssen im Editor **auffindbar** sein
* Jeder Patch muss **deterministisch überprüfbar** bleiben

Wenn ein BEFORE‑Block nicht 1:1 auffindbar ist:

* **STOPP**
* Datei erneut als `.txt` anfordern

### 7.3 Patch‑Umsetzung (User‑Pflichtablauf)

1. Patch kommt vom System.
2. User trägt den Patch **im echten Projektcode** ein.
3. User speichert die Datei.
4. User markiert den **gesamten Dateiinhalt**.
5. User kopiert alles in die `.txt`‑Datei.
6. User tauscht die Datei in den Projektdateien aus.
7. **Commit** (ein Patch = ein Commit).

Erst danach wird fortgefahren.

---

## 8. Abschlusskriterium

Ein Refactoring gilt als abgeschlossen, wenn:

* Der Sollzustand vollständig erreicht ist
* Keine impliziten Workarounds existieren
* Keine impliziten Zustandswechsel verbleiben
* System visuell, logisch und strukturell stabil ist

---

## 9. Merksätze (Team‑Guiding)

* **Erst verstehen, dann handeln.**
* **Der Plan schützt vor Drift.**
* **Der Chat denkt – das Repo ist die Wahrheit.**
* **Ohne `.txt` kein Kontext.**
* **Wenn Unsicherheit besteht → STOPP und nachfragen, nicht raten.**

---

**Ende des Refactoring‑Protokolls (Canonical, verbindlich)**
