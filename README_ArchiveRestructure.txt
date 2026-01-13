# README — Archive Restructure (Soll/Ist-Gesamtindex)

MODE: Research · Documentation · Planning ONLY
SCOPE: ARCHIVE Overlay (Chat / Reports)
STATUS: Konsolidierter Gesamt-Index auf Basis von 8 Dateien

---

## 1. Referenz — KANONISCHER SOLLZUSTAND (bindend)

### EBENE 0 — FIX (immer sichtbar)

* Titel: **ARCHIVE** (immer oben)
* Erklärungstext unter dem Titel (immer sichtbar)
* Suchschlitz (konstante Position, Höhe, Abstände)
* Close-X (logisch dem ARCHIVE zugeordnet)

### EBENE 1 — MODE-SWITCH (immer sichtbar)

* Horizontaler Switch: **[ CHAT ] [ REPORTS ]**
* Startzustand: CHAT aktiv
* Umschalten nur per Klick
* Umschalten beeinflusst **ausschließlich EBENE 2**

### EBENE 2 — INHALT (modusabhängig)

* **CHAT**:

  * Recent Chats (Default)
  * Detailed Chat View
  * Search View (ab Query-Schwelle)
  * Diese drei sind **Unterzustände von CHAT**, keine eigenen Modi
* **REPORTS**:

  * Reports Overview **exklusiv**
  * Keine Chats, keine Chat-Suche, keine Chat-Details

### Explizite No-Gos

* Kein Neuaufbau von ARCHIVE beim Modewechsel
* Keine Layout-Sprünge
* Kein Vermischen von Chat/Reports
* Kein implizites Umschalten durch Query

---

## 2. Analysierte Dateien (8/8)

1. lib/storage.ts
2. ArchiveOverlay.tsx
3. reportstatus.tsx
4. components/archive/ReportList.tsx
5. lib/verificationStorage.ts
6. lib/types.ts
7. lib/archiveVerifyListener.ts
8. lib/i18n.archive.ts

---

## 3. Konsolidierte Ist–Soll-Deltas (systemisch)

### ΔA — Fehlende explizite EBENE-1-Mode-Switch-Struktur

**Beobachtung (IST):**

* Kein klarer, expliziter UI-Switch [CHAT | REPORTS]
* Mode-Wechsel erfolgt verteilt (State, Events, Seiteneffekte)

**Soll-Abweichung:**

* EBENE 1 ist nicht als eigenständige, immer sichtbare Struktur implementiert

---

### ΔB — Vermischung von Modus und Unterzustand

**Beobachtung (IST):**

* CHAT-Unterzustände (browse, detail, search) werden als Modi behandelt
* Query-Länge steuert implizit View-Wechsel

**Soll-Abweichung:**

* Unterzustände von CHAT sind nicht explizit als solche modelliert
* Implizites Umschalten durch Query widerspricht dem Sollzustand

---

### ΔC — REPORTS ist nicht strikt isoliert

**Beobachtung (IST):**

* REPORTS teilt sich State mit CHAT (query, selection, openChainId)
* REPORTS nutzt Komponenten mit Chat-Abhängigkeiten (z. B. ReportStatus)

**Soll-Abweichung:**

* REPORTS darf ausschließlich mit Report-Daten arbeiten
* Keine Chat-Inhalte, keine Chat-Abhängigkeiten

---

### ΔD — REPORTS-Umfang überschreitet „Overview“

**Beobachtung (IST):**

* REPORTS enthält:

  * Übersicht
  * Detail-Modal
  * Download
  * Delete / Invalidate
  * Status-Komponenten

**Soll-Abweichung:**

* Kanonisch ist ausschließlich eine **Reports Overview** vorgesehen

---

### ΔE — Verschachtelte Overlays im ARCHIVE

**Beobachtung (IST):**

* Report-Details öffnen ein eigenes Fullscreen-Overlay
* Z-Index- und Raumkonkurrenz innerhalb des ARCHIVE-Overlays

**Soll-Abweichung:**

* ARCHIVE ist ein klar definierter Raum
* Keine Sub-Overlays innerhalb des ARCHIVE

---

### ΔF — Event-getriebene statt kanonische Mode-Steuerung

**Beobachtung (IST):**

* Übergang CHAT → REPORTS erfolgt über Events
* Kein zentraler, deterministischer Mode-Wechsel

**Soll-Abweichung:**

* Mode-Wechsel muss explizit, lokal und UI-gesteuert sein

---

### ΔG — Semantische Vermischung auf Typ- & i18n-Ebene

**Beobachtung (IST):**

* CHAT- und REPORTS-Typen liegen im selben Typraum
* i18n-Datei enthält CHAT- und REPORTS-Texte ohne klare Ebenen-Markierung

**Soll-Abweichung:**

* Semantische Trennung ist nicht explizit abgebildet

---

## 4. Ursachen-Zusammenfassung (deskriptiv)

* ARCHIVE ist funktional gewachsen, nicht strikt entlang der Ebenen modelliert
* Mode-Logik ist verteilt (State + Events + Seiteneffekte)
* REPORTS ist logisch korrekt, aber strukturell nicht isoliert
* CHAT-Unterzustände sind implizit statt explizit

---

## 5. Ergebnis dieses Dokuments

* Vollständiger **Soll/Ist-Gesamtindex** für das Archive-Overlay
* Klare System-Deltas ohne Bewertung
* Verlässliche Grundlage für einen **sequenziellen Patchplan**

---

## 6. Patchplan — Sequenziell (Planung only, kein Code)

MODE: Planning · MEFL · Ein Pfad
ZIEL: Ist → Kanonischer Sollzustand (ARCHIVE Overlay)

---

### PATCH 1 — Einführung expliziter EBENE‑1‑Mode‑Switch‑Logik

**Ziel:** Klare Trennung von EBENE 1 (CHAT | REPORTS) und EBENE 2

**Betroffene Dateien:**

* ArchiveOverlay.tsx
* lib/i18n.archive.ts

**Inhalt (Plan):**

* Einführung eines expliziten Mode‑States: `mode = 'chat' | 'reports'`
* Sichtbarer, horizontaler Mode‑Switch unter Suchschlitz
* Umschalten ausschließlich per User‑Klick

**Abhängigkeiten:** keine

**Risiko:** gering (UI‑State‑Refactoring)

---

### PATCH 2 — Modellierung von CHAT‑Unterzuständen

**Ziel:** Trennung von Modus (CHAT) und Unterzuständen (Recent | Detail | Search)

**Betroffene Dateien:**

* ArchiveOverlay.tsx

**Inhalt (Plan):**

* Einführung eines separaten `chatView`‑States
* Entfernen impliziter Ableitung über `query.length` als Modus
* Search ausschließlich als Unterzustand von CHAT

**Abhängigkeiten:** Patch 1

**Risiko:** mittel (View‑Routing)

---

### PATCH 3 — EBENE‑0‑Invarianz erzwingen

**Ziel:** Titel, Erklärung, Suchschlitz, Close‑X immer sichtbar

**Betroffene Dateien:**

* ArchiveOverlay.tsx

**Inhalt (Plan):**

* Entfernung mode‑abhängiger Bedingungen für EBENE‑0‑Elemente
* Fixierung von Abständen, Höhen, Positionen

**Abhängigkeiten:** Patch 1

**Risiko:** gering

---

### PATCH 4 — REPORTS strikt isolieren (UI)

**Ziel:** REPORTS enthält ausschließlich Reports Overview

**Betroffene Dateien:**

* ArchiveOverlay.tsx
* components/archive/ReportList.tsx

**Inhalt (Plan):**

* REPORTS rendert nur Overview‑Liste
* Entfernen/Verlagern von Report‑Detail‑Modals aus ARCHIVE
* Keine CHAT‑States im REPORTS‑Renderpfad

**Abhängigkeiten:** Patch 1

**Risiko:** mittel

---

### PATCH 5 — REPORTS‑Detailansichten entkoppeln

**Ziel:** Keine Sub‑Overlays im ARCHIVE

**Betroffene Dateien:**

* components/archive/ReportList.tsx

**Inhalt (Plan):**

* Entfernen fullscreen/fixed Modals aus dem ARCHIVE‑Raum
* Vorbereitung separater Report‑Detail‑Darstellung (außerhalb ARCHIVE)

**Abhängigkeiten:** Patch 4

**Risiko:** mittel

---

### PATCH 6 — Verify‑Flow: expliziter Mode‑Übergang

**Ziel:** Deterministischer Übergang CHAT → REPORTS

**Betroffene Dateien:**

* lib/archiveVerifyListener.ts
* ArchiveOverlay.tsx

**Inhalt (Plan):**

* Entfernen impliziter Event‑Seiteneffekte für Mode‑Wechsel
* Zentraler, expliziter Wechsel in REPORTS nach erfolgreichem Verify

**Abhängigkeiten:** Patch 1, Patch 4

**Risiko:** mittel

---

### PATCH 7 — Semantische Trennung auf Typ‑Ebene (Vorbereitung)

**Ziel:** Klarere CHAT/REPORTS‑Grenzen

**Betroffene Dateien:**

* lib/types.ts

**Inhalt (Plan):**

* Vorbereitung getrennter Typ‑Namespaces (ohne API‑Break)
* Reduktion optionaler CHAT‑Meta‑Felder in REPORTS‑Kontext

**Abhängigkeiten:** keine

**Risiko:** gering

---

### PATCH 8 — i18n‑Abgleich zur Ebenen‑Struktur

**Ziel:** Sprachlich explizite EBENE‑0/1/2‑Abbildung

**Betroffene Dateien:**

* lib/i18n.archive.ts

**Inhalt (Plan):**

* Ergänzung klarer Mode‑Switch‑Labels
* Sicherstellung, dass Erklärungstexte EBENE‑0‑invariant sind

**Abhängigkeiten:** Patch 1

**Risiko:** gering

---

## 7. Abschlusskriterium

Der Patchplan ist abgeschlossen, wenn:

* EBENE 0, 1, 2 strikt getrennt sind
* CHAT‑Unterzustände explizit modelliert sind
* REPORTS vollständig isoliert ist
* Kein implizites Umschalten mehr existiert
* ARCHIVE visuell und logisch stabil bleibt

---

**Ende des Patchplans — kein Code enthalten**
