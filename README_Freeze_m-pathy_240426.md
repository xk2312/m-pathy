# README_Freeze_m-pathy_240426

## Zweck

Dieses Dokument friert den aktuellen lauffähigen Stand von m-pathy/M13 ein.

Es dient als stabiler Rollback-Anker, Commit-Referenz und Sprint-Übergabe für die nächste Phase.

Commit-Titel:

```bash
README_Freeze_m-pathy_240426
```

---

## Systemstatus

Der aktuelle Stand ist funktional stabil.

IRSS ist als kanonische Systemstruktur wiederhergestellt und `telemetry` wurde aus den bearbeiteten Schichten entfernt oder entkoppelt.

Das System läuft aktuell mit sauberer IRSS-Pipeline, sauberem Frontend-Rendering und bereinigten Archive-/Projection-/Type-Schichten.

---

## Architekturentscheidung

### Kanonischer Beschluss

```txt
IRSS = einzige kanonische Runtime-Systemstruktur
telemetry = Legacy und wird nicht weitergeführt
```

### Bedeutung

- Neue Logik darf nicht mehr auf `telemetry` aufbauen.
- IRSS wird als strukturierter Systemzustand behandelt.
- `telemetry` wurde als Legacy-Pfad aus den zentralen Flow-Dateien entfernt.
- Parsing, Rendering, Archive-Projektionen und Typen wurden auf IRSS beziehungsweise telemetry-freie Strukturen ausgerichtet.

---

## Erreichte Änderungen

### 1. `page.tsx`

Der alte Frontend-Split-Mechanismus wurde entfernt.

Entfernt wurden insbesondere:

- `splitTelemetryFromContent`
- `telemetryBlock`
- `telemetryHtml`
- Frontend-Heuristik über `startsWith("{")`
- Legacy-Fallback von Content auf telemetry

Der aktuelle Zustand:

- `msg.content` enthält nur den sichtbaren Inhalt.
- `msg.irss` ist die strukturierte IRSS-Quelle.
- IRSS wird direkt aus `msg.irss` gerendert.
- Kein Frontend-Reparse des Contents mehr.

---

### 2. `route.ts`

Die Backend-IRSS-Pipeline wurde bereinigt.

Entfernt beziehungsweise bereinigt wurden:

- `irssContent` als String-Repräsentation
- IRSS-String-Merge mit `renderContent`
- Legacy-Logging auf `hasIrssContent`
- doppelte Counter-Manipulation über String und Objekt

Der aktuelle Zustand:

- Das Model darf weiterhin IRSS als führenden JSON-Block liefern.
- Das Backend splittet einmalig.
- `irssPayload` ist die strukturierte Wahrheit.
- `renderContent` bleibt sichtbarer Text.
- Response gibt getrennt zurück:

```ts
content: renderContent
message: renderContent
irss: irssPayload ?? null
```

Die Backend-Split-Logik bleibt aktuell noch notwendig, weil das Model IRSS weiterhin als führenden JSON-Block im Content liefert.

---

### 3. `archivePairProjection.ts`

Telemetry wurde aus der Pair-Projektion entfernt.

Entfernt wurden:

- `telemetry?: any` aus `TriketonAnchor`
- `telemetry?: any` aus `ArchivePair.assistant`
- Durchreichen von `(next as any).telemetry`

Der aktuelle Zustand:

- Archive Pairs bestehen aus User/Assistant Content, Timestamp, Truth Hash und Keywords.
- Keine telemetry-Abhängigkeit mehr.

---

### 4. `archiveProjection.ts`

Telemetry wurde aus der Archive-Projektion entfernt.

Entfernt wurden:

- `telemetry?: any` aus `TriketonAnchor`
- `telemetry` beim Aufbau von `TArchiveEntry`
- `telemetry` beim Aufbau von Chat Entries

Der aktuelle Zustand:

- Archive-Projektion arbeitet telemetry-frei.
- Gruppierung, Anzeige und Keywording hängen nur noch an Content, Timestamp, Chain und Truth Hash.

---

### 5. `keywordExtract.ts`

Die alte telemetry-Heuristik wurde entfernt beziehungsweise durch strukturelle IRSS-Erkennung ersetzt.

Alter Zustand:

- Keyword-Starts wie `telemetry`, `system:`, `session`, `drift`, `complexity` konnten natürliche Inhalte fälschlich blocken.

Neuer Zustand:

- IRSS wird strukturell erkannt.
- JSON mit `parsed.irss` wird als Systemblock ausgeschlossen.
- Keine unscharfe telemetry-Keyword-Heuristik mehr.

---

### 6. `triketonVerify.ts`

Die Truth-State-Canonicalization wurde von `telemetry` auf IRSS umgestellt.

Ziel:

- `telemetry` ist nicht mehr Teil des Truth-State-Modells.
- IRSS kann als canonical state-bound Systembestandteil behandelt werden.

Wichtig:

Die Pipeline muss garantieren:

```txt
IRSS finalisieren -> dann Hash bilden
```

Nicht:

```txt
Hash bilden -> danach IRSS verändern
```

---

### 7. `types.ts`

Die globalen Typen wurden von telemetry bereinigt.

Entfernt wurden:

- `telemetry?: any` aus `ChatMessage`
- `telemetry` aus `ArchiveEntry`

Der aktuelle Zustand:

- `ChatMessage` trägt `irss?: any`.
- Archive-Typen sind telemetry-frei.
- Neue telemetry-Nutzung wird durch TypeScript eher sichtbar statt still weitergetragen.

---

## Aktueller funktionaler Zustand

### Stabil

- System läuft.
- Chat Response funktioniert.
- IRSS wird vom Model geliefert oder per Fallback erzeugt.
- Backend erkennt und trennt IRSS.
- Frontend rendert Content und IRSS getrennt.
- Archive-Projektionen sind telemetry-frei.
- Types sind telemetry-frei.
- Route-Pipeline ist nicht mehr auf `irssContent` als String angewiesen.

### Bestätigte Beobachtung

IRSS ist im Response-Flow wieder vorhanden und sichtbar.

Im Frontend wird `data.irss` erkannt und `msg.irss` kann angezeigt werden.

---

## Offener Punkt

### Noch nicht abgeschlossen

IRSS wird aktuell noch nicht vollständig als strukturiertes Feld in der Client-Persistenz gespeichert.

Das betrifft insbesondere:

- LocalStorage Chat Persistenz
- IndexedDB Client Persistenz
- Reload-Verhalten

Der aktuelle Zustand:

```txt
IRSS im laufenden Response-Flow: vorhanden
IRSS im UI-Zustand: vorhanden
IRSS nach Reload aus Client-Persistenz: noch nicht final gesichert
```

---

## Nächster Sprint-Schritt

### Ziel

IRSS muss als strukturiertes Feld in der Client-Persistenz erhalten bleiben.

### Primärer Fokus

`chatStorage.ts`

Zu prüfen und zu patchen:

1. `normalizeMessage()`
2. Save-Funktion für ChatMessages
3. Ledger Entry Type
4. LocalStorage Write
5. IndexedDB Write, falls dort ChatMessages oder Ledger gespiegelt werden

### Zielzustand

```ts
{
  id,
  role,
  content,
  irss,
  ts,
  triketon
}
```

Nicht mehr:

```ts
{
  id,
  role,
  content,
  telemetry,
  ts,
  triketon
}
```

---

## Nicht erneut öffnen

Diese Themen gelten für den aktuellen Freeze als erledigt:

- Frontend-IRSS-Split aus Content entfernen
- `telemetryBlock` entfernen
- `telemetryHtml` entfernen
- `irssContent` aus `route.ts` entfernen
- Archive-Projektionen von telemetry bereinigen
- Typen von telemetry bereinigen
- keyword-basierte telemetry-Heuristik entfernen

---

## Arbeitsregel für den nächsten Sprint

Keine globalen Ersetzungen.

Jede Datei wird einzeln geprüft.

Jeder Patch benötigt:

- echte Datei oder echten Codeausschnitt
- exakten BEFORE-Block
- exakten AFTER-Block
- Commit-Titel
- keine Annahmen außerhalb des sichtbaren Codes

---

## Freeze-Status

```txt
System läuft.
IRSS Pipeline ist wieder stabil.
telemetry wurde aus den zentralen Schichten entfernt.
Offen bleibt nur die vollständige strukturierte IRSS-Persistenz in LocalStorage / IndexedDB.
```

