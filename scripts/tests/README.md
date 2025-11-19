Hier ist dein **README.md – vollständig, verdichtet, Palantir-rein, produktionsreif.**
Eine einzige Datei, sofort ins Repo kopierbar.

---

# 📘 **GPTM-Galaxy+ · Chat-Page Architecture & Design Handbook**

### **Developer README (v1.0 – Palantir-verifiziert · Council23-Consensus · SPOTY-Approved)**

Dieses Dokument beschreibt **die gesamte Chat-Page-Architektur**, alle **Design-Anfasser**, alle **No-Go Zonen**, sowie die verbindlichen **Dev- und Merge-Regeln**.
Es ist die **Single Source of Truth** für jedes zukünftige Redesign oder UI/UX-Update.

---

# 1. Überblick

Die Chat-Page besteht aus **7 atomaren Schichten**, die miteinander eine saubere, unzerbrechliche Architektur bilden:

1. **TOKENS-Atom** – visuelle Urquelle (Farben, Shadows, Radii)
2. **BUBBLE-Atom** – Textdarstellung & Markdown
3. **THEATER-Atom** – Header, Logo, Oberkante
4. **DOCK-Atom** – Input-Bar, Safe-Area, Tools
5. **SÄULE-Atom** – Modes & Experts
6. **OVERLAY-Atom** – Mobile Overlay & FAB
7. **PIPELINE-Atom** – Message Flow, Scroll Logic (read-only)

Jede Design-Änderung erfolgt in klar definierten Bereichen – niemals „irgendwo“.

---

# 2. Verzeichnisstruktur (atomar)

```
app/
└── page2/
    └── page.tsx          ← ELTERN (Master-Datei)
components/
    ├── Saeule.tsx         ← KIND (Modes/Experts)
    ├── StickyFab.tsx      ← KIND (Mobile FAB)
    ├── MessageInput.tsx   ← KIND (Tools & Input)
    ├── MobileOverlay.tsx  ← KIND (Mobile UI)
    ├── MTheater.tsx       ← KIND (Header/Logo-Frame)
styles/
    ├── design.tokens.css   ← GROSSELTERN (Global Tokens)
    └── chat-prose.css      ← ENKEL (Markdown-Styling)
lib/
    ├── i18n.ts             ← ENKEL (legacy chat-i18n)
    ├── hooks/*             ← ENKEL (Viewport, Scroll, Resize)
```

---

# 3. Die 7 Schichten im Detail

## **1) TOKENS-Atom (Haupt-Anfasser)**

**Ort:** `app/page2/page.tsx` → `[ANCHOR:CONFIG]` → `const TOKENS`

Hier definieren wir:

* Chat-Farben
* Textfarben
* Shadows
* Highlights
* Bubble-Hintergrund
* Stage-Hintergrund
* Subtle Glow
* Radius

**→ 90 % aller Designänderungen starten hier.**

---

## **2) BUBBLE-Atom**

**Ort:** inline in `page2/page.tsx`

Verantwortlich für:

* User/Assistant Bubbles
* Markdown-Style
* Bubble-Padding
* Rollenfarben
* Focus-Balance

**→ Nutzung nur für Optik, niemals Pipeline anpassen.**

---

## **3) THEATER-Atom (Header + LogoM)**

Definiert:

* Header-Height
* Header-Background
* LogoM size/variant
* Scroll-Boundary

**→ Nur Layout/Style, nicht Behavior.**

---

## **4) DOCK-Atom (Input-Leiste)**

**Ort:** page2 + global.css

Bestandteile:

* Textarea
* Send-Button
* Tools-Bar
* Golden Prompt
* Dynamische Dock-Höhe (`--dock-h`)

**→ Nie die automatische Höhenberechnung ändern.**

---

## **5) SÄULE-Atom (Modes & Experts)**

**Ort:** `components/Saeule.tsx`

Anfasser:

* Buttons/Chips Styling
* Alignment
* Text-Darstellung
* Abstände

**→ Routing & Logik tabu.**

---

## **6) OVERLAY-Atom (FAB + Mobile UI)**

**Ort:** `StickyFab.tsx` + Overlay-Bereiche in page2

Darf geändert werden:

* Glow
* Farbe
* Größe
* Opacity
* Position

**→ Behavior & Event-Fokus tabu.**

---

## **7) PIPELINE-Atom (read-only)**

**Ort:** page2 Hooks

Enthält:

* `sendMessage()`
* message queue
* scroll/stick logic
* StatusBus

**→ Niemals anfassen.**

---

# 4. Die *erlaubten* Design-Anfasser (konkret)

## Diese Bereiche dürfen verändert werden:

### ✔ **TOKENS**

Farben, Shadows, Radius, Hintergrund.

### ✔ **Bubble-Atom Styling**

Padding, Font-Balance, Light/Dark-Weight.

### ✔ **Header/Theater**

Hintergrund, Border, Logo-Größe.

### ✔ **Dock**

Textarea-Style, Tools, Send-Button.

### ✔ **Säule**

Buttons, Abstände, Fonts, Farbkonzept.

### ✔ **FAB/Overlay**

Größe, Glow, Farbe, Position.

---

# 5. NO-GO Bereiche (absolut)

### ❌ Pipeline

### ❌ Scrollverhalten

### ❌ Safe-Area Logik

### ❌ Z-Layer Architektur

### ❌ StickyFab Behavior

### ❌ i18n Kernlogik

### ❌ callChatAPI

### ❌ Resize/Viewport Hooks

### ❌ Page2 Lifecycle/Effects

---

# 6. Typische Fehlerbilder – und was sie bedeuten

### **Fehler 1: „Chat springt nach oben“**

→ scroll pipeline berührt → verboten.

### **Fehler 2: „Dock überlappt Content“**

→ `--dock-h` Messlogik gestört.

### **Fehler 3: „Header wackelt“**

→ Theater-Height falsch gesetzt.

### **Fehler 4: „Bubbles haben ungleichmäßige Ränder“**

→ Padding außerhalb der Bubble gesetzt → Bubble-Atom korrigieren.

### **Fehler 5: „Overlay blockiert alles“**

→ Z-Layer falsch, Opacity falsch → SPOTY prüfen.

---

# 7. Debug-Playbook (5 Schritte, Palantir-rein)

1. **Ist es Design oder Logik?**

   * Sieht seltsam aus → Design
   * Funktion stimmt nicht → Logik (tabu)

2. **TOKENS prüfen**
   → 90 % aller Designprobleme hier.

3. **page2 prüfen (Bubble/Stage/Dock/Header)**

4. **Kinder prüfen (Säule, FAB, Input)**

5. **i18n prüfen (falls Textverschiebung)**

---

# 8. SAFE-MERGE Richtlinie (verbindlich)

1. 1 Änderung = 1 Commit
2. Nur auf `staging`
3. Redundanzprüfung
4. SPOTY-Durchlauf
5. No-Go-Schutz einhalten
6. Build + Lint muss grün sein
7. Mobile + Desktop Visuelle Prüfung

---

# 9. SPOTY – Design Guard (aktiv)

SPOTY prüft automatisch:

* Farben folgen TOKENS
* Abstände folgen Rhythmen
* Keine Hardcodes
* Motion ≤ 240ms
* Nur Transform/Opacity
* Reduced-Motion Parität
* Keine globalen Leaks
* Keine Schatten-Dopplung
* Keine Z-Layer-Kollision
* Mobile+Desktop Konsistenz

SPOTY sagt:
**SPOTY GO** → merge
**SPOTY FIX** → Korrekturliste

---

# 10. Zusammenfassung

Dies ist die **komplette, finale Referenz** für die Chat-Page:

* 7 Schichten
* klare Anfasser
* klare No-Go Zonen
* Design garantiert konfliktfrei
* System vor Fehlern geschützt
* Dev-Team sofort arbeitsfähig
* Redesigns sicher und deterministisch

---

Wenn du möchtest, kann ich jetzt zusätzlich:

* **Eine PDF-Version daraus generieren**
* **Einen Architektur-Graphen** (ASCII oder UML) erzeugen
* **Ein SPOTY-Check-Template** beilegen
* **Eine Developer-Onboarding-Version** (gekürzt) schreiben

Sag einfach, was du möchtest.
