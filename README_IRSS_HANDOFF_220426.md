# README_IRSS_HANDOFF.md

## Zweck
Diese Datei dokumentiert den IRSS Fall in M13 so, dass ein späterer Chat oder Entwickler den Stand sofort versteht, ohne den gesamten Bugloop erneut durchlaufen zu müssen.

---

## Kurzfassung
IRSS war ursprünglich als JSON Block direkt im Assistant Content enthalten.
Später wurde IRSS von sichtbarem Content getrennt, damit der User nur den eigentlichen Antworttext sieht und IRSS separat behandelt werden kann.

Dabei entstand zeitweise ein Bruch zwischen:

1. Server Response
2. Frontend Message Objekt
3. Persistenz in Triketon / IndexedDB
4. Rendering im MessageBody

Der wichtige Endstand ist:

- IRSS wird serverseitig geliefert oder per Fallback garantiert.
- IRSS wird getrennt vom sichtbaren Content behandelt.
- Im Frontend kann IRSS über `msg.irss` angezeigt werden.
- Im Ledger / Triketon ist IRSS im gespeicherten Content korrekt enthalten.
- Das System läuft aktuell stabil.

---

## Das eigentliche Problem
Das Problem war nicht, dass IRSS serverseitig fehlte.
Die Logs haben mehrfach bestätigt:

- Azure / Model liefert IRSS korrekt
- Server erkennt IRSS korrekt
- Ledger erkennt IRSS korrekt

Der Bruch entstand beim Übergang zwischen mehreren Darstellungen derselben Assistant Antwort.

Frühere Situation:

```json
{
  "irss": { ... }
}

Hallo ...
```

Spätere Situation:

```json
{
  "content": "Hallo ...",
  "irss": { ... }
}
```

Das führte dazu, dass verschiedene Stellen im Code unterschiedliche Formate erwarteten.

---

## Was gesichert bewiesen wurde
Durch Serverlogs wurde bewiesen:

- `AZURE RAW RESPONSE` enthält IRSS
- `MODEL CONTENT START` enthält IRSS
- `[IRSS][POST-SPLIT][STATE]` zeigt, dass IRSS Payload und IRSS Content vorhanden sind
- `[LEDGER][IRSS CHECK] exists: true` bestätigt, dass IRSS im Server Flow korrekt vorhanden ist
- `[LEDGER][CONTENT]` zeigt, dass im Ledger Content sowohl `content` als auch `irss` enthalten sind

Wichtige Schlussfolgerung:

> Der Server war nicht das Kernproblem.

---

## Root Cause
Der eigentliche Root Cause war eine inkonsistente Kette zwischen Schreiben und Lesen.

### Schreiben
IRSS wurde teilweise korrekt in Message Objekten und im Ledger gehalten.

### Lesen
Das Frontend war zeitweise nicht konsequent auf genau eine Quelle ausgerichtet.
Es existierten parallel zwei Denkmodelle:

1. IRSS steckt im Content und muss wieder herausgeparst werden
2. IRSS liegt bereits sauber in `msg.irss`

Sobald diese beiden Modelle gleichzeitig aktiv sind, entstehen Fehlerbilder wie:

- `hasMsgIrss: true, hasSplitIrss: false`
- IRSS ist im Ledger, aber wird nicht im UI erkannt
- IRSS wird visuell sauber verborgen, aber beim Persistieren falsch eingeschätzt

---

## Wichtige Architekturregel
### Source of truth
Die saubere Zielstruktur ist:

- Sichtbarer Text lebt in `content`
- IRSS lebt in `irss`

Also:

```ts
{
  role: "assistant",
  content: "Hallo ...",
  irss: { ... }
}
```

### Warum das wichtig ist
Der sichtbare Text darf nicht erneut zum Wahrheitscontainer für IRSS gemacht werden.
Wenn IRSS wieder aus `content` geparst werden muss, entsteht sofort wieder Drift.

---

## Was aktuell als stabil gilt
Der aktuelle stabile Zustand ist:

1. Das Model liefert IRSS oder der Server setzt einen Fallback.
2. Der Server trennt sichtbaren Text und IRSS.
3. Das Frontend bekommt ein Assistant Objekt mit `content` und `irss`.
4. Das UI rendert den Text ohne sichtbaren IRSS Block im Haupttext.
5. Das Ledger speichert IRSS korrekt mit.

Wichtiger Punkt:

> Wenn das so bleibt, sind keine weiteren Sofortmaßnahmen nötig.

---

## Was NICHT mehr getan werden sollte
Diese Dinge haben in der Vergangenheit Chaos erzeugt und sollten nicht erneut eingeführt werden:

### 1. IRSS wieder primär aus `content` parsen
Das darf höchstens ein Legacy Fallback sein, nicht der Hauptpfad.

### 2. Zwei parallele Wahrheiten zulassen
Also nicht gleichzeitig:

- `msg.irss` als Wahrheit
- `content` JSON als Wahrheit

### 3. Globale Notbehelfe als Hauptarchitektur behandeln
Beispiel:

- `window.__M13_LAST_IRSS__`

So etwas kann kurzfristig Debug helfen, sollte aber nicht die Kernarchitektur sein.

### 4. Persistenz von UI Transformation abhängig machen
Was gespeichert wird, darf nicht davon abhängen, wie das Frontend gerade rendert.

---

## Wenn der Bug in Zukunft wieder auftaucht
Dann bitte in genau dieser Reihenfolge prüfen.

### Schritt 1. Server Response prüfen
Logs prüfen auf:

- `AZURE RAW RESPONSE`
- `MODEL CONTENT START`
- `[IRSS][POST-SPLIT][STATE]`

Frage:
Kommt IRSS überhaupt vom Model / Fallback an?

### Schritt 2. Server Ledger prüfen
Logs prüfen auf:

- `[LEDGER][IRSS CHECK]`
- `[LEDGER][CONTENT]`

Frage:
Ist IRSS im Server Ledger Flow wirklich vorhanden?

### Schritt 3. Frontend Message Objekt prüfen
Im Frontend prüfen, ob Assistant Messages wirklich enthalten:

```ts
msg.irss
```

Nicht nur sichtbar im Content, sondern als eigenes Feld.

### Schritt 4. Rendering prüfen
MessageBody prüfen:

- Nutzt die Anzeige `msg.irss`?
- Erwartet sie fälschlich weiterhin JSON im `content`?

### Schritt 5. IndexedDB / Triketon prüfen
Prüfen, ob gespeicherte Einträge entweder:

- ein separates `irss` Feld tragen
- oder im Ledger Content klar als `content + irss` Struktur vorliegen

---

## Typische Fehlbilder und ihre Bedeutung
### Fehlbild A
`hasMsgIrss: true, hasSplitIrss: false`

Bedeutung:
`msg.irss` ist vorhanden. Das ist meistens gut. Der Split Pfad ist dann nicht mehr die Wahrheit.

### Fehlbild B
`hasMsgIrss: false, hasSplitIrss: false`

Bedeutung:
IRSS ist im Frontend Message Objekt nicht angekommen.
Dann liegt der Fehler vor dem Rendering.

### Fehlbild C
Server Logs zeigen IRSS, aber DB Eintrag nicht

Bedeutung:
Der Bruch liegt zwischen Response Mapping und Persistenz.

### Fehlbild D
DB hat IRSS, UI aber nicht

Bedeutung:
Der Write Pfad ist ok, aber der Read / Render Pfad ist falsch.

---

## Relevante Kernidee für spätere Arbeit
Wenn man das System später weiter vereinfacht, sollte die endgültige Zielarchitektur sein:

### Write Path
Server erzeugt oder garantiert IRSS und übergibt immer:

```ts
{ content, irss }
```

### Read Path
Frontend liest immer:

```ts
msg.irss
```

### Legacy Fallback
Nur falls alte Daten geladen werden:

- einmalige Migration oder Fallback Parser
- aber nicht mehr als Hauptpfad

---

## Empfohlene Zukunftsregel
Diese Regel sollte am besten als Kommentar im Code hinterlegt werden:

```ts
// IRSS is guaranteed by server contract or fallback.
// UI must use msg.irss as the single source of truth.
// Do not reintroduce content-based IRSS parsing as primary logic.
```

---

## Finales Fazit
Der Fall war kein einfacher "IRSS fehlt" Bug.
Es war ein Architekturproblem mit zwei konkurrierenden Wahrheiten.

Die wichtigste Erkenntnis lautet:

> IRSS darf nicht gleichzeitig aus `content` und `msg.irss` als Hauptquelle gelesen werden.

Sauber ist nur:

- `content` für sichtbaren Text
- `irss` für Maschinenzustand / Analyse / Box / Ledger

Wenn das eingehalten wird, bleibt das System stabil.
