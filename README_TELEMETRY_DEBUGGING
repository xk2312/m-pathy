Prompt: 51
Drift: not drifting

# README

## Aktueller Zustand von `app/api/chat/route.ts`

Basis dieses Dokuments ist die zuletzt hochgeladene aktuelle `route.ts`. Der File enthält bereits einen kanonischen Index im Kopf, die Sentinel Konfiguration für Telemetrie, den Skeleton Builder, den Envelope Extractor und den markerbasierten Validator. Außerdem wird der Telemetrie System Prompt vor die eigentlichen `messages` gesetzt.  

## 1. Zielbild des aktuellen Flows

Der aktuelle Flow in der Datei ist wie folgt aufgebaut:

Zuerst wird der normale Azure Request gebaut. Dazu werden `systemPrompt`, `languageGuard` und die eingehenden `body.messages` zu `messages` zusammengesetzt. Zusätzlich wird `telemetrySystemPrompt` davor gesetzt. Dieser Prompt fordert, dass jede Antwort exakt der Struktur aus `buildTelemetrySkeleton()` folgt, inklusive Sentinel Markern und ohne zusätzlichen Text außerhalb der Blöcke. 

Danach wird die Azure Antwort gelesen und in `content` übernommen. Wenn `content` fehlt, wird sofort mit HTTP 502 beendet. Anschließend beginnt der erste Telemetrie Prüfpfad mit `if (!isValidTelemetryBlock(content))`. Wird der Block nicht als gültig erkannt, startet ein Retry. 

## 2. Aktive Telemetrie Architektur im aktuellen Stand

Die Datei enthält aktuell vier zentrale Telemetrie Bausteine:

`TELEMETRY_REQUIRED_FIELDS` definiert die erwarteten Telemetrie Schlüssel.
`buildTelemetrySkeleton()` baut die erwartete Antwortstruktur aus Telemetrie Block und Content Block.
`extractTelemetryEnvelope()` sucht die vier Marker und extrahiert `telemetryBlock` und `contentBlock`.
`isValidTelemetryBlock()` validiert auf Basis des extrahierten `telemetryBlock`, ob alle Pflichtfelder vorhanden sind. 

Der Telemetrie System Prompt fordert explizit:

* exakte Struktur
* keine Marker Änderung
* keine Übersetzung der Feldnamen
* keine zusätzlichen Zeilen im Telemetrie Block
* kein Text außerhalb der definierten Blöcke

Diese Anforderungen werden direkt per `${buildTelemetrySkeleton()}` in den Request eingebettet. 

## 3. Was aktuell beim ersten Azure Lauf passiert

Nach erfolgreichem Azure Call wird `content` aus `data?.choices?.[0]?.message?.content` gelesen. Danach wird sofort geprüft, ob `content` einen gültigen Telemetrie Block enthält. Schlägt diese Prüfung fehl, wird ein Warn Log geschrieben und ein Retry gestartet. 

Der Retry verwendet aktuell einen eigenen `strictRetryPayload`. Dieser enthält einen neuen `system` Prompt mit erneutem Verweis auf `buildTelemetrySkeleton()`. Zusätzlich wird aktuell nur die letzte User Nachricht per `lastUserMessage` in den Retry gegeben, nicht der komplette bisherige Kontext. 

## 4. Was aktuell beim Retry passiert

Der Retry liest `retryContent` aus `retryData?.choices?.[0]?.message?.content`. Danach wird erneut geprüft:

* `retryResponse.ok`
* `retryContent` vorhanden
* `isValidTelemetryBlock(retryContent)`

Wenn eine dieser Bedingungen fehlschlägt, wird nicht weiterverarbeitet. Stattdessen wird direkt eine lokalisierte Fallback Nachricht aus `telemetryBlockedMessages` als Assistant Antwort zurückgegeben. Der Status wird in diesem Fall auf `telemetry_blocked` gesetzt. Genau dieser Rückgabepfad ist derzeit aktiv, wenn für jeden Prompt nur noch die Meldung `SYSTEM NOTICE: Telemetry validation failed. Output was blocked according to system policy. Please retry your request.` erscheint. 

Im erfolgreichen Retry Pfad wird aktuell nur noch

```ts
const envelope = extractTelemetryEnvelope(retryContent);
```

ausgeführt. Danach wird in diesem Block weder `content = retryContent` gesetzt noch `contentBlock` oder `telemetryBlock` aktiv übernommen. Das heißt: Der Retry liest und prüft `retryContent`, schreibt das Ergebnis im aktuellen Stand aber nicht zurück in die spätere Hauptpipeline. 

## 5. Was nach dem Retry aktuell weiterläuft

Unabhängig davon läuft danach der restliche Hauptpfad weiter:

* Token Berechnung über `usage` oder Fallback Schätzung
* Ledger Debit
* Triketon Sealing auf `content`
* Post Seal Telemetry Structuring
* Aufbau von `structuredTelemetry`
* Cleanup von `cleanedContent`
* Finales `NextResponse.json` mit `role`, `content`, `telemetry`, `status`, `tokens_used`, `balance_after`, `debug_usage` und `triketon` 

Das Sealing verwendet aktuell `String(content)` als Input für `python3 -m triketon.triketon2048 seal ...`. Auch der spätere Hash und `computeClientTruthHash(content)` beziehen sich auf `content`. 

## 6. Aktueller Post Seal Telemetry Pfad

Nach dem Triketon Block wird ein zweiter Telemetrie Verarbeitungspfad ausgeführt.

Dort werden gesetzt:

* `let structuredTelemetry: any = null;`
* `let cleanedContent = content;`

Dann wird `content` per Regex auf den `Session Prompt Counter` überschrieben. Danach wird mit

```ts
const envelope = extractTelemetryEnvelope(content ?? "");
const telemetrySource = envelope.telemetryBlock ?? content;
const lines = telemetrySource.split("\n");
const startIndex = lines.findIndex((l) => l.startsWith("System:"));
```

ein zweiter Parserpfad gestartet. Wird `startIndex !== -1`, werden `telemetryLines`, `telemetryObj`, `structuredTelemetry` und `cleanedContent` aufgebaut. Andernfalls bleibt `cleanedContent = content`. Anschließend werden nur noch bestimmte Präfixe aus `cleanedContent` entfernt. 

Dieser zweite Pfad nutzt also nicht direkt den bereits im Retry geprüften Envelope Zustand, sondern baut später erneut aus `content` und `telemetrySource` eine Telemetrie Struktur auf. 

## 7. Stolpersteine, die im Verlauf bereits aufgetreten sind

### A. Umstellung von freier Telemetrie auf Sentinel Envelope

Die Datei wurde von einer alten Freitext Telemetrie Logik auf Sentinel Marker umgestellt. Dazu wurden `TELEMETRY_START_SENTINEL`, `TELEMETRY_END_SENTINEL`, `CONTENT_START_SENTINEL` und `CONTENT_END_SENTINEL` eingeführt, ebenso `buildTelemetrySkeleton()` und `extractTelemetryEnvelope()`. 

### B. Alter Retry Prompt wurde ersetzt

Früher enthielt der Retry nur eine knappe Regel wie `CRITICAL SYSTEM RULE: Output MUST start with telemetry block.` Im aktuellen Stand wurde dieser Retry Prompt auf einen strukturgebenden Prompt mit Skeleton umgestellt. Gleichzeitig blieb aber `...lastUserMessage` im Retry erhalten.  

### C. Versuch, den Post Seal Block komplett umzubauen

Ein größerer Umbau des Blocks `// === TELEMETRY STRUCTURING (POST-SEAL, PRE-RESPONSE) ===` wurde zwischenzeitlich versucht und wieder zurückgenommen. In der aktuellen Datei ist dieser Block wieder vorhanden und arbeitet noch mit `startIndex`, `telemetryLines`, `telemetryObj` und `cleanedContent`. Das ist der aktuell gültige Stand. 

### D. Retry Ergebnis wird aktuell nicht in die Hauptpipeline übernommen

Im aktuellen File ist nach erfolgreichem Retry nur noch die Zeile mit `extractTelemetryEnvelope(retryContent)` vorhanden. Es folgt keine aktive Übernahme in `content`. Das ist der Zustand der zuletzt hochgeladenen Originaldatei. 

## 8. Aktueller sichtbarer Benutzerzustand

Der aktuell sichtbare Benutzerzustand ist:

Für normale Prompts wird derzeit nicht mehr die eigentliche Assistant Nachricht ausgeliefert, sondern die lokalisierte Standardmeldung aus `telemetryBlockedMessages`. Im englischen Fallback lautet sie:

`SYSTEM NOTICE: Telemetry validation failed. Output was blocked according to system policy. Please retry your request.`

Dieser Text ist im aktuellen Code fest hinterlegt und wird im Fehlerpfad des Retry Blocks direkt als Assistant Inhalt zurückgegeben. 

## 9. Zusammenspiel der Systeme im aktuellen Stand

### Request Ebene

Die Middleware dieser Route baut aus System Prompt, Sprach Guard, User Nachrichten und Telemetrie Prompt den Azure Payload. Die Telemetrie Struktur wird also schon vor dem ersten Modelllauf injiziert. 

### Validation Ebene

Der erste Gatekeeper ist `isValidTelemetryBlock(content)`. Er arbeitet markerbasiert über `extractTelemetryEnvelope(text)` und verlangt, dass alle `TELEMETRY_REQUIRED_FIELDS` vorhanden sind. Fehlt der Envelope oder fehlen Felder, liefert die Funktion `false`. 

### Retry Ebene

Der Retry versucht dieselbe Telemetrie Struktur mit einem neuen System Prompt erneut zu erzwingen. Im aktuellen Stand wird aber nur die letzte User Nachricht in diesen Retry geschickt. 

### Accounting Ebene

Nach der Retry Sektion laufen Token Berechnung und Ledger Debit weiter. Die Datei verwendet dafür `usage` der ersten Azure Antwort oder eine Fallback Schätzung aus `messages` und `content`. 

### Sealing Ebene

Das Sealing nutzt aktuell den Wert von `content` als Basis für `seal`, `dbTruthHash` und `computeClientTruthHash(content)`. 

### Response Ebene

Im letzten Schritt werden `cleanedContent`, `structuredTelemetry`, `status`, `tokens_used`, `balance_after`, `debug_usage` und `triketon` an das Frontend ausgeliefert. 

## 10. Was bereits versucht wurde zu richten

Es wurden in der aktuellen Datei bereits folgende Richtungsänderungen vorgenommen:

* Einführung der Sentinel Marker
* Einführung des Skeleton Builders
* Einführung des Envelope Extractors
* Umstellung des Validators auf markerbasierte Prüfung
* Ersetzung des alten Telemetrie Prompts durch einen Skeleton Prompt
* Ersetzung des alten Retry Prompts durch einen Skeleton Prompt
* Einbau eines zweiten Envelope bezogenen Telemetrie Pfads im Post Seal Bereich

All diese Elemente sind im aktuellen hochgeladenen File vorhanden.   

## 11. Was im aktuellen Zustand nicht geklappt hat

Im aktuellen Zustand sind folgende Versuche nicht bis in die laufende Hauptpipeline wirksam geworden:

* Der erfolgreiche Retry wird aktuell nicht zurück in `content` übernommen.
* Der Retry nutzt weiterhin nur `lastUserMessage` statt `messages`.
* Die zweite Telemetrie Strukturierung arbeitet weiterhin separat auf `content` und nicht auf einem einmalig finalisierten Envelope Zustand.

Diese drei Punkte sind im aktuellen File direkt sichtbar. 

## 12. Kurzstatus

Aktueller Stand der Datei:

* Telemetrie Architektur auf Sentinel und Skeleton umgestellt
* Validator markerbasiert aktiv
* Retry mit Skeleton Prompt aktiv
* `telemetry_blocked` Fallback aktiv
* Assistant Hauptnachricht aktuell nicht wiederhergestellt
* Ursache im aktuellen File sichtbar durch nicht übernommenes `retryContent` und getrennte Nachverarbeitungspfade  

Ich kann dir dieses README im nächsten Schritt auch als saubere `.md` Datei ausgeben.
