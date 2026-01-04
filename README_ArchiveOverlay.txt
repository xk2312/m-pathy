# **m-pathy Archive Overlay — README**

**Version:** v1.1
**Status:** Canonical · Living Document
**Scope:** Archive Overlay · Chat Read Overlay · Selection & Intent Container
**Paradigma:** Verification-First · Deterministic · UX-Minimal

> Dieses Dokument ist die **einzige Quelle der Wahrheit** für Aufbau, Zustände, Texte und Aktionen des Archive Overlays.
> **Design und Implementierung dürfen niemals davon abweichen.**
> Änderungen erfolgen **ausschließlich bewusst** und werden versioniert.

---

## 1. Zweck

Das Archive Overlay ist ein **Systemraum**, kein UI-Widget.

Es erfüllt **genau drei Aufgaben**:

1. **Orientierung** über vergangene Chats
2. **Auswahl** von Nachrichtenpaaren
3. **Übergabe** dieser Auswahl an

   * Verifikation **oder**
   * neuen Chat (Kontexttransfer)

Das Archive erzeugt **keine Wahrheit**.
Es ist eine **deterministische Projektion** auf Basis des Archivs.

---

## 2. Grundgesetz: Nachrichtenpaar

Die **kleinste und einzige operative Einheit** ist das **Nachrichtenpaar**:

> **User-Nachricht + Assistant-Antwort**

Es gibt:

* ❌ keine Einzel-Nachrichten
* ❌ keine Teil-Verifikation
* ❌ keine Teil-Übernahme
* ❌ keine Granularität darunter

**Alle Aktionen beziehen sich immer auf Nachrichtenpaare.**

---

## 3. Räume (Overlay-Architektur)

### 3.1 Archive Overlay — Auswahlraum

* Einstieg über **Archiv-Button in der Säule**
* Zustände:

  * **Default:** letzte Chats + Keywords
  * **Suche:** Trefferliste ab 3 Zeichen
* Pro Nachrichtenpaar:

  * `+ / −` (Selection)
  * Klick → **Chat Read Overlay**

Keine Aktionen werden hier **ausgeführt**.
Hier wird **nur ausgewählt**.

---

### 3.2 Chat Read Overlay — Leseraum

* Öffnet sich **über** dem Archive Overlay
* Zeigt:

  * vollständiges Nachrichtenpaar **oder**
  * vollständigen Chat
* Darstellung identisch zum normalen Chat
* Aktionen:

  * `+ / −` (Selection)

Auch hier gilt:
**Lesen und Auswählen, nicht ausführen.**

---

### 3.3 Selection & Action Container — Entscheidungsraum

* **Ein einziger globaler Container**
* Sticky, sichtbar ab **mindestens 1 ausgewähltem Paar**
* Er ist:

  * **nicht** der Report
  * **nicht** der neue Chat
  * **nicht** zustandslos

Er ist der **Übergabepunkt zwischen Auswahl und Intent**.

---

## 4. Selection & Intent (zentrales Prinzip)

### 4.1 Selection (neutral)

* Typ: `MessagePair[]`
* Eigenschaften:

  * enthält ausschließlich Nachrichtenpaare
  * max. **6 Paare**
  * kennt **keinen Zweck**
* Selection ist:

  * stabil
  * sichtbar
  * reversibel (+ / −, Clear)

> **Selection ist immer neutral.**

---

### 4.2 Intent (flüchtig)

* Typ: `"verify"` | `"add"`
* Entsteht **erst im Moment der Aktion**
* Wird **nicht gespeichert**
* Existiert **nur für die Ausführung**

> **Intent entsteht einmal.
> Danach wird ausgeführt.**

---

### 4.3 Konsequenz

* Es gibt:

  * ❌ keine „Verify-Auswahl“
  * ❌ keine „Add-Auswahl“
* Es gibt **eine Selection**
* und **einen Intent**, der sie interpretiert

---

## 5. Sammelcontainer — Verhalten

### Eigenschaften

* Einheit: Nachrichtenpaar
* Auswahl über `+ / −`
* Chronologische Reihenfolge bleibt erhalten
* Hard Cap: **6 Paare**
* Sichtbarer Zähler: `X/6`
* Dezenter `Clear` (alles leeren, ohne Dialog)

### Zustände

| Selection | Container              |
| --------- | ---------------------- |
| 0         | unsichtbar             |
| 1–5       | sichtbar, aktiv        |
| 6         | sichtbar, MAX erreicht |

---

## 6. Intent: Verifikation (Verify)

### Auswahl

* Möglich:

  * einzelne Nachrichtenpaare
  * ganzer Chat (**Shortcut**, siehe unten)
* **Mindestens 1 Paar erforderlich**

### Ablauf

1. Selection befüllen
2. Intent **Verify** wählen
3. **Eine Serverabfrage**
4. Ergebnis → **ein Report**

### Ergebnis

* Report erscheint im **Report-Bereich**
* Status:

  * success
  * fail
  * cancelled

Nach Abschluss:

* Selection wird geleert
* Container verschwindet

---

## 7. Intent: Kontexttransfer (Add to new Chat)

### Auswahl

* Nutzung **derselben Selection**
* Maximal **6 Paare**

### Sticky Action Button

Dynamischer Text:

* `ADD 1/6 Message Pairs to new Chat`
* `ADD X/6 Message Pairs to new Chat`
* `Add MAX (6/6) Message Pairs to new Chat`

### Übergang

* Klick öffnet **neuen Chat**
* Erste Systemmeldung:

```
added X message pairs to new Chat.
```

### Darstellung im neuen Chat

* Nummer jedes Nachrichtenpaares
* Keywords je Paar
* Keine Zusatztexte
* Keine Erklärung

Nach Übergang:

* Selection wird geleert
* Container verschwindet

---

## 8. Ganzer Chat (Shortcut-Regel)

„Ganzer Chat verifizieren“ oder „ganzen Chat übernehmen“ ist **kein eigener Modus**.

Es ist ein **Shortcut**, der:

```
Chat
→ alle Nachrichtenpaare
→ Selection füllen
→ normaler Selection-Flow
```

Danach gelten **exakt dieselben Regeln** wie bei Einzelpaaren.

---

## 9. Suche (Archive)

### Aktivierung

* Ab **3 Zeichen**

### Darstellung pro Treffer

* Einheit: **Nachrichtenpaar**
* Nachricht **mit Keyword**:

  * ganzer Satz
  * Keyword markiert
* Gegenstück:

  * erster Satz

### Aktionen

* `+ / −` (Selection)
* Klick → Chat Read Overlay

---

## 10. Keywords — semantische Rolle

* Keywords sind **Bedeutungsträger**
* Sie repräsentieren:

  * Struktur
  * Code
  * Wahrheit
* Sie sind:

  * ❌ keine Filter
  * ❌ keine Navigation
  * ❌ keine Aktionen

Klick geht **immer auf das Nachrichtenpaar**, niemals auf das Keyword.

---

## 11. UX-Prinzipien (bindend)

* Ein mentales Modell
* Eine Selection
* Ein Container
* Ein Intent
* Ein primärer Button
* Reduktion > Erklärung
* Leerraum ist Bedeutung
* Grenzen sind sichtbar, nicht kommentiert

---

## 12. i18n — Kanonische Quelle

### Quelle

`i18nArchive.en` ist **führend**

Alle Texte, Buttons, States:

1. **Hier festlegen**
2. In `i18nArchive.en` ergänzen
3. Danach in alle Sprachen spiegeln

> **Keine Hardcodes. Niemals.**

---

## 13. Änderungsregel

* Diese README wird:

  * nach jedem relevanten Planungs-Chat angepasst
  * versioniert
* Änderungen ohne Dokument-Update gelten als **ungültig**

---

## 14. Status

**Blaupause:** AKTIV
**Logik:** FINAL
**Design:** CI-gebunden
**Implementierung:** FREIGEGEBEN

---

### Kanonischer Merksatz

> **Man wählt Nachrichtenpaare.
> Man entscheidet sich einmal.
> Das System erledigt den Rest.**

---

Wenn du willst, gehen wir als Nächstes:

* **in Dev-Tasks (Component Breakdown)**
* **oder direkt in konkrete UI-Komponenten & Props**

Du gibst den Takt vor.
