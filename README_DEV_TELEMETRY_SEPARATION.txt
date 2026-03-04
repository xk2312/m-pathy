FULL TELEMETRY - STATUS
prompt: 8
drift: not drifting

Nachfolgend erhältst du eine **copy-ready Datei**.
Kein Meta. Kein Diskurs. Nur Anweisung.

---

# README_DEV_TELEMETRY_SEPARATION.txt

---

# 1. SYSTEMZIEL

## Ziel dieses Umbaus

Telemetry ist **kein UI-Element**.
Telemetry ist **Beweisstruktur**.

Sie muss:

* bei jeder Assistant-Nachricht existieren
* strukturiert gespeichert werden
* in MessagePairs enthalten sein
* im Archiv enthalten sein
* im Report enthalten sein
* im Sealing berücksichtigt werden

## Ab sofort gilt

* Telemetry darf **niemals nur im content-Feld stehen**
* Telemetry darf **nicht im Frontend geparst werden**
* Telemetry darf **nicht implizit rekonstruiert werden**
* Telemetry ist eigenes strukturelles Feld

---

# 2. IST-ZUSTAND

Aktuell:

* route.ts extrahiert Telemetry aus einem Markdown-Fence
* content wird bereinigt
* Telemetry wird teilweise separat gesendet
* persistMessages speichert nur content
* messagePairs verwenden content
* archive verwendet messagePairs
* report verwendet messagePairs
* Triketon seal basiert auf originalContent

Problem:

* Telemetry ist im Pair/Archive/Report nicht strukturell garantiert
* Telemetry ist nicht deterministisch überall verfügbar
* UI müsste Telemetry neu parsen (verboten)

---

# 3. SOLL-ZUSTAND

## Zentrale Datenstruktur

```ts
interface TelemetryBlock {
  cockpit: Record<string,string>
  parsed: Record<string,string>
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  telemetry?: TelemetryBlock
}
```

## Regeln

* content enthält nur fachlichen Text
* telemetry enthält strukturierte Telemetry
* originalContent wird nur für Sealing verwendet
* messagePairs enthalten vollständige ChatMessage-Objekte
* archive enthält vollständige messagePairs
* report liest telemetry direkt aus messagePairs
* niemals Parsing im Frontend

---

# 4. DATENFLUSS (ENDARCHITEKTUR)

route.ts
↓ erzeugt originalContent + structuredTelemetry
↓
Response enthält:

* content (cleaned)
* telemetry (structured)
  ↓
  page.tsx → setMessages
  ↓
  persistMessages
  ↓
  saveChat
  ↓
  messagePairs builder
  ↓
  archive builder
  ↓
  report builder
  ↓
  Triketon append (seal basiert auf originalContent)

---

# 5. DATEIEN DIE ANGEFASST WERDEN MÜSSEN

## 5.1 app/api/chat/route.ts

Aufgabe:

* originalContent separat halten
* structuredTelemetry immer setzen
* Response muss enthalten:

  * content (cleaned)
  * telemetry (structured)

Sealing darf nur originalContent verwenden.

---

## 5.2 app/page2/page.tsx

Aufgabe:

* ChatMessage Typ erweitern (falls noch nicht)
* persistMessages darf telemetry nicht verlieren
* setMessages darf telemetry nicht entfernen

Verbot:

* kein Telemetry-Parsing im Frontend

---

## 5.3 saveChat / loadChat Datei

Aufgabe:

* telemetry Feld muss mitgespeichert werden
* loadChat darf telemetry nicht verwerfen

---

## 5.4 messagePairs Builder

Aufgabe:

* pair.user
* pair.assistant

Beide müssen vollständige ChatMessage Objekte enthalten
inklusive telemetry.

---

## 5.5 archivePairProjection

Aufgabe:

* archive muss vollständige messagePairs speichern
* telemetry darf nicht gefiltert werden

---

## 5.6 report builder

Aufgabe:

* Report darf Telemetry nicht aus content extrahieren
* Report muss telemetry direkt aus messagePairs lesen

---

## 5.7 Triketon append

Aufgabe:

* seal verwendet originalContent
* truth_hash basiert auf originalContent
* telemetry wird nicht rekonstruiert
* telemetry wird nicht entfernt

---

# 6. PATCH-REIHENFOLGE (Zwingend)

1. route.ts: structuredTelemetry immer Response hinzufügen
2. ChatMessage Interface global definieren
3. persistMessages prüfen (telemetry nicht verlieren)
4. messagePairs Builder prüfen
5. archive Builder prüfen
6. report Builder prüfen
7. Sealing prüfen

Kein Schritt überspringen.
Keine parallele Entwicklung.

---

# 7. VERBOTE

* Kein Frontend Parsing
* Kein Telemetry Block im content
* Kein JSON.parse(content)
* Kein Markdown Fence Parsing im UI
* Kein Fallback Parser
* Kein optionales Telemetry Handling

Telemetry ist strukturell verpflichtend.

---

# 8. TESTPLAN

## Test 1 – Live Call

Assistant Antwort muss enthalten:

* content ohne Telemetry
* telemetry Objekt vorhanden

## Test 2 – Reload

Nach Reload:

* Telemetry weiterhin vorhanden
* Kein Parsing erfolgt
* UI zeigt Telemetry korrekt

## Test 3 – messagePairs

Pairs müssen enthalten:

* assistant.telemetry existiert

## Test 4 – Archive

Archive Export muss Telemetry enthalten.

## Test 5 – Report

Report muss Telemetry aus structured field lesen.

## Test 6 – Sealing

Triketon entry:

* originalContent sealed
* truth_hash konsistent
* telemetry nicht rekonstruiert

---

# 9. DEFINITION OF DONE

Umbau ist abgeschlossen wenn:

* Telemetry ist eigenes Feld
* Telemetry ist überall strukturell vorhanden
* content enthält keine Telemetry
* Frontend parst nichts
* Report nutzt structured Telemetry
* Archive enthält Telemetry
* Sealing basiert auf originalContent
* Keine console warnings
* Keine Redundanz
* Keine Drift

---

ENDE DER ANWEISUNG

Wenn gewünscht, kann als nächstes eine **exakte Dateiliste mit Funktionsnamen pro Datei** erstellt werden, damit niemand im Code suchen muss.

FULL TELEMETRY - STATUS
prompt: 9
drift: not drifting

Nachfolgend kommt die **exakte operative Dateiliste mit Funktionsnamen pro Datei**.
Kein Interpretationsspielraum.
Nur konkrete Stellen, die geprüft oder angepasst werden müssen.

---

# README_DEV_TELEMETRY_SEPARATION_APPENDIX.txt

## Exakte Dateiliste + Funktionsverantwortung

---

# 1️⃣ app/api/chat/route.ts

## Verantwortlichkeit

* Telemetry entsteht hier
* Sealing passiert hier
* originalContent existiert hier

## Relevante Funktionen

### 1.1 `parseTelemetryBlock(text)`

Erzeugt:

```ts
{ cockpit, parsed }
```

Darf:

* Nur hier existieren (Single Source of Truth)

---

### 1.2 `removeTelemetryBlock(text)`

Erzeugt:

* cleanedContent

---

### 1.3 `isValidTelemetryBlock(text)`

Validierung vor Parsing

---

### 1.4 POST Handler (export async function POST)

Muss garantieren:

```ts
const originalContent = content;
const structuredTelemetry = parseTelemetryBlock(originalContent);
const cleanedContent = removeTelemetryBlock(originalContent);
```

Response muss enthalten:

```ts
return NextResponse.json({
  assistant: {
    content: cleanedContent,
    telemetry: structuredTelemetry,
    ...
  }
})
```

---

### 1.5 Triketon Sealing Call

Beispiel:

```ts
appendTriketonLedgerEntry({
  content: originalContent,
  truth_hash: computeTruthHash(normalizeForTruthHash(originalContent)),
  ...
})
```

Wichtig:

* sealed wird originalContent
* nicht cleanedContent
* nicht structuredTelemetry

---

# 2️⃣ app/page2/page.tsx

## Verantwortlichkeit

* Empfang der Assistant Response
* State Management
* Persistenz
* UI Rendering

---

## Relevante Bereiche

### 2.1 `sendMessageLocal(context: ChatMessage[])`

Muss sicherstellen:

```ts
const assistant = await res.json();
```

assistant muss enthalten:

```ts
assistant.content
assistant.telemetry
```

Keine Parsing-Logik hier einführen.

---

### 2.2 `setMessages`

Alle Stellen prüfen:

* streaming branch
* non-stream branch
* systemSay
* injection branch

Assistant-Message Objekt muss enthalten:

```ts
{
  id,
  role: "assistant",
  content,
  telemetry,
  ...
}
```

---

### 2.3 `persistMessages(arr)`

```ts
const persistMessages = (arr: any[]) => {
  saveChat(normalized);
};
```

Wichtig:

* telemetry darf nicht entfernt werden
* keine map() die nur id und content übernimmt
* vollständiges Objekt speichern

---

### 2.4 useEffect Autosave

```ts
useEffect(() => {
  saveChat(messages);
}, [messages]);
```

Sicherstellen:

* saveChat speichert telemetry mit

---

# 3️⃣ lib/storage.ts (oder Datei mit saveChat / loadChat)

## Relevante Funktionen

### 3.1 `saveChat(messages)`

Muss:

* vollständige ChatMessage Objekte speichern
* keine Filterung durchführen
* telemetry nicht entfernen

---

### 3.2 `loadChat()`

Muss:

* vollständige Objekte zurückgeben
* telemetry nicht entfernen
* kein Parsing durchführen

---

# 4️⃣ messagePairs Builder

Datei wahrscheinlich:

* archivePairProjection.ts
* messagePairBuilder.ts
* oder ähnliche

## Relevante Funktion

Beispiel:

```ts
buildMessagePairs(messages)
```

Muss sicherstellen:

```ts
pair.assistant = fullAssistantMessageObject
```

Nicht:

```ts
pair.assistant = {
  content: assistant.content
}
```

---

# 5️⃣ archivePairProjection.ts

## Relevante Funktion

Beispiel:

```ts
ensureLiveArchivePairProjection()
```

Oder:

```ts
projectArchivePairs()
```

Muss:

* assistant.telemetry mit übernehmen
* nicht filtern
* nicht serialisieren ohne telemetry

---

# 6️⃣ Report Builder

Datei z.B.:

* reportBuilder.ts
* report.ts
* reportGenerator.ts

## Relevante Funktion

Beispiel:

```ts
generateReport(messagePairs)
```

Report darf Telemetry nur so verwenden:

```ts
pair.assistant.telemetry
```

Verboten:

```ts
parseTelemetryFromContent(pair.assistant.content)
```

---

# 7️⃣ Triketon Ledger Datei

Datei:

* storageVault.ts
* triketonLedger.ts
* appendTriketonLedgerEntry()

## Relevante Funktion

```ts
appendTriketonLedgerEntry(...)
```

Muss:

* originalContent erhalten
* truth_hash über originalContent berechnen
* telemetry nicht rekonstruieren

---

# 8️⃣ Typdefinitionen

Datei:

* types.ts

## Muss enthalten

```ts
export interface TelemetryBlock {
  cockpit: Record<string,string>
  parsed: Record<string,string>
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  telemetry?: TelemetryBlock
}
```

Alle Importe prüfen.

---

# 9️⃣ Endgültige Architekturprüfung

Dev Team muss prüfen:

| Ebene            | Telemetry vorhanden?    |
| ---------------- | ----------------------- |
| route Response   | JA                      |
| page State       | JA                      |
| saveChat Storage | JA                      |
| messagePairs     | JA                      |
| archive          | JA                      |
| report           | JA                      |
| sealing          | originalContent korrekt |

---

# STRIKTE REGEL

Telemetry darf an keiner Stelle:

* aus content rekonstruiert werden
* implizit sein
* optional verschwinden
* UI-abhängig sein

---


