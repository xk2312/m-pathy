# README_CORTEX_DevPlan_26042026.md

## 1. Ziel dieses Dokuments

Dieses Dokument ist der **kanonische Entwicklungsplan für Cortex V1**.

Es dient als Referenz für zukünftige Entwicklungsschritte und stellt sicher, dass:

* keine Architekturentscheidungen verloren gehen
* kein Drift entsteht
* jeder weitere Schritt auf einem klar definierten Systemverständnis basiert

---

## 2. Systemkontext

m-pathy besteht aus:

* Engine (Extension-Orchestrierung)
* Extensions (User-Flows)
* Execution Layer (`run.sh` + Python Steps)
* Registry (Systemstruktur)
* UI (Wall, Overlay, Prompt)

Cortex ist ein **Execution-getriebenes Subsystem** innerhalb dieser Architektur.

---

## 3. Grunddefinition von Cortex

Cortex ist:

* das zweite Gehirn des Users
* projektgebunden
* lokal verankert
* artefaktbasiert
* chain-basiert

### Kernregeln

* Ein User hat mehrere Projekte
* Es gibt genau **einen aktiven Cortex**
* Cortex kann exportiert und importiert werden
* Projekte sind isoliert

---

## 4. Einstieg in Cortex

Cortex wird ausschließlich über eine Extension gestartet.

### Flow

1. Einführung in Cortex (Konzept: zweites Gehirn)
2. Projektname wird gesetzt
3. User lädt genau **ein File** hoch
4. Pipeline startet
5. Ergebnis wird sichtbar gemacht
6. Erst danach kann das nächste File folgen

---

## 5. Upload-Prinzip

Upload ist **keine globale Funktion**.

### Regeln

* Upload nur innerhalb von Cortex
* Upload nur über Extension-Trigger
* Upload erfolgt über Local File Picker
* Datei ist zunächst nur im Browser RAM
* Limit: **50 MB**

### Architekturregel

> Kein File ohne Pipeline

---

## 6. run.sh als Kernsystem

Die `run.sh` ist der zentrale Orchestrator.

### Eigenschaften

* sequenziell
* deterministisch
* fail-fast (`set -e`)
* artefaktbasiert

### Prinzip

Jeder Step:

* erhält Input
* erzeugt Output
* schreibt ein Success-Artefakt

---

## 7. Cortex als Chain-System

Cortex ist keine einmalige Verarbeitung.

Cortex ist eine **fortlaufende Artefakt-Chain**.

### Wichtiger Grundsatz

> Jeder Step erzeugt einen neuen Startpunkt.

---

## 8. Aktueller Scope (Kickoff-Chain)

Der aktuelle Sprint bildet nur den Einstieg:

```text
Upload
→ Original Storage
→ Chunking
→ Source Registry
```

Dies ist **nicht das finale System**, sondern der erste stabile Anker.

---

## 9. Speicherstruktur

### 9.1 Source Structure (Registry)

Hier wird strukturiert gespeichert:

* Projekt
* Files
* Chunks
* Speicherpfade

Die Registry ist:

> das strukturierte Gedächtnis

---

### 9.2 Access Structure

Hier wird flach gespeichert:

* summaries
* keywords
* chunk references

Die Access Structure ist:

> das Reasoning Interface

---

### Grundregel

> Ordnen in Bäumen. Denken in Listen.

---

## 10. Speicherung (V1)

Für jedes File wird gespeichert:

### Original

* vollständiges Dokument
* unverändert

### Chunks

* deterministisch erzeugt
* einzeln referenzierbar

### Source Registry

* Projektname
* File-Name
* Chunk-IDs
* Speicherpfade
* Keywords (Top 10 pro Chunk)
* Summary pro Chunk

---

## 11. Python-Step-Logik

### Step 1: Original Storage

* nimmt File entgegen
* speichert Original
* erzeugt Artefakt

---

### Step 2: Chunking + Registry

* iterativer Loop
* verarbeitet Chunk für Chunk
* erzeugt Source Registry
* speichert Speicherpfade

---

## 12. Artefakt-Prinzip

Jeder Step erzeugt:

* ein JSON-Artefakt
* prüfbaren Output
* persistente Referenz

### Regel

> Kein Step ohne Artefakt

---

## 13. Fehlerlogik

Pipeline darf nicht in halbfertigem Zustand enden.

### Anforderungen

* klare Success-Zustände
* kein stilles Scheitern
* keine impliziten Übergänge

---

## 14. UI-Zielzustand

Nach erfolgreicher Verarbeitung:

* Cortex Icon erscheint auf der Wall
* Cortex Overlay öffnet sich
* File ist sichtbar
* Artefakte sind sichtbar

---

## 15. Prompt Integration

Cortex wird über einen Switch gesteuert:

* OFF → ignorieren
* ON → nutzbar

### Regel

> Kein automatischer Zugriff auf Cortex

---

## 16. Bilder

* werden in V1 nicht verarbeitet
* bleiben unberücksichtigt
* Erweiterung möglich in späteren Versionen

---

## 17. Token-System (offen)

Problem:

* variable Pipeline-Kosten
* aktuelles Modell zu ungenau

### Entscheidung

> Token-Tracking muss in der Shell stattfinden

Keine Umsetzung in diesem Sprint.

---

## 18. Monitor (Abgrenzung)

Monitor wird nicht Teil dieses Sprints.

Reihenfolge:

1. Cortex Pipeline
2. Cortex Stabilität
3. Monitor später

---

## 19. Nicht-Ziele (V1)

Nicht implementieren:

* Multi-File Upload
* globale Upload-Funktion
* Bildverarbeitung
* automatische Cortex-Nutzung
* Monitor Integration
* komplexe Taxonomien
* vollständige Token-Ökonomie

---

## 20. Nächste Schritte

Der nächste Chat startet mit:

1. Analyse von `run.sh`
2. Definition jedes Steps
3. Definition jedes Artefakts
4. Definition Speicherpfade
5. erst danach Python-Implementierung

---

## 21. Finaler Leitgedanke

> Cortex ist kein Feature.
> Cortex ist eine wachsende, persistente Wissens-Chain.
