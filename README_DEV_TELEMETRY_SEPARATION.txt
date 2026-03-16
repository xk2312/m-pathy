FULL TELEMETRY - STATUS
Prompt: 8
Drift: not drifting

# README

# MAIOS 3.0 Telemetrie

# Status Quo und Übergabeprotokoll für den nächsten Dev

## 1. Zweck dieses Dokuments

Dieses Dokument beschreibt den aktuellen Stand des MAIOS 3.0 Telemetrie Systems, die reale Server Pipeline, die aktuell beobachteten Effekte im Chat, die bekannten Redundanzen im Code und die Punkte, die noch nicht final bereinigt wurden. Ziel ist, dass ein neuer Dev ohne Vorwissen direkt versteht, wie das System heute arbeitet, welche Teile stabil sind, welche Teile unnötig komplex geworden sind und an welchen Stellen der nächste saubere Schnitt angesetzt werden sollte.

Dieses README ist bewusst ausführlich. Es enthält nicht nur die Soll Struktur, sondern vor allem den real beobachteten Ist Zustand.

## 2. Gesamtbild

MAIOS nutzt ein verpflichtendes Telemetrie System. Jede Modellantwort soll aus zwei logisch getrennten Teilen bestehen:

1. Telemetrieblock
2. Contentblock

Die Grundstruktur ist:

```text
<<<MAIOS_TELEMETRY_START>>>
... Telemetrie ...
<<<MAIOS_TELEMETRY_END>>>
<<<MAIOS_CONTENT_START>>>
... Assistant Inhalt ...
<<<MAIOS_CONTENT_END>>>
```

Die Telemetrie soll immer vor dem Content stehen. Der Server validiert die Antwort danach, extrahiert die Telemetrie, trennt den Content ab und liefert an das Frontend sowohl bereinigten Inhalt als auch eine strukturierte Telemetrie für Cockpit und Akkordion.

Das System ist also als zweistufiges Modell gedacht:

1. Das Modell erzeugt einen formatierten Gesamtoutput.
2. Der Server zerlegt diesen Output wieder in Content und Telemetrie.

## 3. Aktueller Architekturgedanke

Die ursprüngliche Idee hinter der aktuellen Architektur war:

Das Modell soll die Telemetrie direkt mitliefern. Der Server soll diese Antwort danach robust verarbeiten. Falls die Modell Telemetrie fehlt oder unvollständig ist, soll der Server eine vollständige Fallback Telemetrie erzeugen.

Zusätzlich wurde versucht, das Modell durch mehrere parallele Mechanismen auf das gewünschte Format festzulegen. Dadurch ist im Laufe der Zeit aber eine starke Verschachtelung und Redundanz entstanden.

Genau das ist der Punkt, an dem das System jetzt als zu komplex empfunden wird.

## 4. Aktueller technischer Aufbau in route.ts

Der relevante Bereich liegt in route.ts im Abschnitt des POST Handlers. Dort passiert aktuell sehr viel in einer einzigen Datei und in einer langen Kette.

Die wesentlichen Blöcke sind:

1. Request Contract Prüfung
2. Session und Conversation Rekonstruktion
3. FreeGate Logik
4. Ledger Precheck
5. Locale Ermittlung
6. Language Guard Injection
7. Rebuild von Assistant Nachrichten
8. Wiederherstellung des letzten Telemetrie Zustands
9. Aufbau des finalen Message Stacks
10. Aufbau eines zusätzlichen Telemetrie System Prompts
11. Erzeugung eines Telemetry Skeleton
12. Azure Request
13. Azure Response Verarbeitung
14. Telemetrie Validierung
15. Token Berechnung und Ledger
16. Optionaler Triketon Anchor
17. Serverseitiger Telemetrie Fallback
18. Parsing und Strukturierung
19. Content Reinigung
20. Finale JSON Response an das Frontend

Die Datei ist dadurch funktional mächtig, aber schwer überschaubar geworden.

## 5. Die vier Telemetrie Ebenen, die aktuell existieren

Der wichtigste Architekturpunkt ist: Telemetrie existiert heute nicht nur an einer Stelle, sondern in mehreren parallelen Schichten.

### Ebene 1: Systemprompt

Der Systemprompt enthält bereits die Telemetrie Regeln, das Format und die Ausgabepflichten.

Das Modell bekommt darüber schon die Information, dass Telemetrie erwartet wird und wie diese aussehen soll.

### Ebene 2: Chat History

Assistant Antworten aus vorherigen Prompts enthalten vollständige Telemetrie mit echten Werten. Diese Antworten gehen zurück in die History und dienen damit faktisch als Zustandsquelle.

Das bedeutet: Der historische Zustand des Systems wird bereits durch den Chat selbst transportiert.

### Ebene 3: Last Telemetry State als zusätzliche System Message

Im Request Builder wird aus der letzten Assistant Antwort nochmals ein eigener Systemblock gebaut, der das vorige Telemetrie State explizit an das Modell weiterreicht.

Das ist bereits eine zusätzliche Verstärkung der History.

### Ebene 4: Telemetry Skeleton

Zusätzlich baut der Server einen Telemetry Skeleton Block mit allen Feldnamen, aber ohne Werte, und schickt ihn noch einmal als Systemnachricht an das Modell.

Dieser Block sieht inhaltlich so aus:

```text
<<<MAIOS_TELEMETRY_START>>>
System
Version
Telemetry Authority
Session Prompt Counter
...
System State Hash
<<<MAIOS_TELEMETRY_END>>>
<<<MAIOS_CONTENT_START>>>
<assistant content>
<<<MAIOS_CONTENT_END>>>
```

Das ist aktuell die auffälligste Redundanz.

## 6. Warum das System heute als zu komplex empfunden wird

Das Problem ist nicht, dass die Pipeline grundsätzlich kaputt ist. Das Problem ist, dass mehrere Schichten gleichzeitig dieselbe Aufgabe teilweise doppelt oder dreifach erfüllen.

Die Telemetrie wird aktuell gleichzeitig durch folgende Dinge beeinflusst:

Systemprompt
History
Last Telemetry State Message
Telemetry Skeleton
serverseitige Korrekturen
serverseitige Fallback Telemetrie
serverseitige Effective Mode Ableitung
serverseitige Prompt Counter Überschreibung

Dadurch ist schwer zu sehen, welche Instanz gerade die eigentliche Wahrheit ist.

Für Wartung und Debugging ist das problematisch, weil ein Effekt immer mehrere mögliche Ursachen haben kann.

## 7. Was im System stabil funktioniert

Trotz der Komplexität funktionieren mehrere Teile nachweislich stabil.

### 7.1 Azure Antwort kommt sauber zurück

Die beobachteten Logs zeigen eine normale Azure Antwort mit:

finish_reason: stop

Das Modell antwortet also regulär und wird nicht auf Provider Ebene blockiert.

### 7.2 Das Modell liefert vollständige Telemetrie

In den beobachteten Beispielen hat das Modell den Telemetrieblock korrekt geliefert. Die 37 Felder sind enthalten. Die Antwort enthält sowohl Telemetrie als auch Content.

### 7.3 Die Telemetrie Validierung schlägt nicht fehl

In den Logs steht:

TELEMETRY_VALIDATION_RESULT true

Das bedeutet: Der Server erkennt die Modellantwort als formal gültig.

### 7.4 Das Parsing auf 37 Felder funktioniert

In den Trace Logs steht:

fieldCount: 37

Der Parser kann also alle erwarteten Felder erkennen.

### 7.5 Session Prompt Counter wird serverseitig gesetzt

Der Prompt Counter wird nicht dem Modell überlassen, sondern serverseitig bestimmt und in die Telemetrie eingesetzt. Das ist aktuell eine sinnvolle deterministische Korrektur.

### 7.6 Das strukturierte Telemetrie Objekt wird gebaut

Der Server baut aus der geparsten Telemetrie ein `structuredTelemetry` Objekt mit zwei Ebenen:

1. `cockpit`
2. `parsed`

Das Frontend kann daraus sowohl kompakte als auch vollständige Telemetrie rendern.

## 8. Was in den Logs konkret beobachtet wurde

### 8.1 Prompt 1

Bei Prompt 1 wurde der Telemetry Skeleton vor dem Azure Call mitgeloggt. Danach kam eine vollständige Modellantwort zurück. Der Telemetrieblock war vollständig vorhanden. Die Validierung war erfolgreich. Das Modell setzte Werte wie:

System Mode: empathy
Effective Mode: empathy
Drift Origin: user_input
Drift Risk: minimal

Wichtig war hier eine Auffälligkeit im Trace:

`hasTelemetryBlock: true`
`hasContentBlock: false`

Gleichzeitig war aber im Modelloutput ein Contentblock sichtbar. Das deutet darauf hin, dass der Envelope Extraktor oder die Marker Erkennung in diesem Lauf den Contentblock nicht korrekt erkannt hat, obwohl er im Text vorhanden war.

Folge davon war, dass in den weiteren Trace Stufen der bereinigte Content nicht wirklich abgetrennt wurde, sondern der komplette Text weitergereicht wurde.

Das ist ein zentraler Beobachtungspunkt.

### 8.2 Prompt 2

Bei Prompt 2 wurde der Telemetry Skeleton erneut gesendet. Die History war länger. Der Payload war größer. Das Modell antwortete wieder vollständig und korrekt.

Hier war die wichtige Trace Beobachtung:

`hasTelemetryBlock: true`
`hasContentBlock: true`

Diesmal wurde der Contentblock also korrekt erkannt.

Danach war in Stage 2 sichtbar, dass `cleanedContent` nur noch den eigentlichen Inhalt enthielt und die Telemetrie erfolgreich abgestrippt wurde. Die Längenangaben im Log bestätigen genau das.

Das bedeutet: In Prompt 2 funktioniert die Trennung sauberer als in Prompt 1.

## 9. Das aktuell sichtbarste Problem im UI

Das aktuell wichtigste Symptom ist folgendes:

Bei der ersten Antwort wird die volle Telemetrie teilweise sowohl direkt im Chattext als auch noch einmal im unteren Telemetrie Kasten angezeigt.

Das fühlt sich wie eine doppelte Darstellung an.

Wichtig ist hier: Das ist nicht automatisch ein Modellproblem. Es ist auch nicht automatisch ein Problem der finalen JSON Response allein. Es ist eine Kette aus zwei möglichen Problemzonen:

1. Der Server trennt Telemetrie und Content im ersten Prompt nicht immer sauber.
2. Das Frontend rendert zusätzlich Telemetrie separat im Kasten.

Wenn beides gleichzeitig passiert, erscheint die Telemetrie doppelt.

## 10. Was die bisherigen Logs dazu nahelegen

Die Logs zeigen für Prompt 1, dass der Envelope zwar einen Telemetrieblock erkennt, aber keinen Contentblock. Dadurch bleibt `cleanedContent` effektiv unbereinigt und enthält weiter den kompletten Antworttext inklusive Telemetrie.

Wenn der Server diesen unbereinigten Text dann als `content` an das Frontend liefert und das Frontend zusätzlich aus `telemetry` das Cockpit und das Akkordion rendert, sieht der Nutzer die Telemetrie doppelt:

1. einmal als Text im Chat
2. einmal strukturiert im Telemetrie Kasten

Für Prompt 2 scheint die Envelope Erkennung sauberer zu greifen. Dort wurde der Contentblock erkannt und `cleanedContent` reduziert sich auf den eigentlichen Text.

Das deutet auf eine Instabilität oder Inkonsistenz der Envelope Trennung hin, vor allem im ersten Prompt.

## 11. Warum der Telemetry Skeleton architektonisch problematisch ist

Der Skeleton liefert nur Feldnamen, keine Werte.

Die History liefert hingegen vollständige Telemetrie mit echten Werten.

Der Systemprompt definiert zusätzlich bereits das Format.

Dadurch bekommt das Modell gleichzeitig:

eine Regeldefinition
eine historische Zustandsquelle
eine weitere explizite Zustandsquelle
und ein leeres Feldschema

Der leere Feldschema Block konkurriert semantisch mit den gefüllten Blöcken. Genau deshalb wurde bereits mehrfach beobachtet, dass das Modell in manchen Fällen Werte wie `unknown` oder `none` setzt, obwohl in der History bereits echte Werte vorhanden sind.

Auch wenn der Skeleton formal nicht direkt die doppelte Anzeige im UI verursacht, erhöht er die Komplexität stark und erzeugt eine zusätzliche Telemetriequelle ohne echten Mehrwert.

## 12. Warum der Code schwer wartbar geworden ist

Die Wartbarkeit leidet aktuell aus mehreren Gründen.

### 12.1 Zu viele Verantwortlichkeiten in einem Handler

Der POST Handler macht sehr viele Dinge auf einmal. Es gibt keine klare Trennung zwischen:

Request Aufbau
Telemetrie Eingabe
Telemetrie Parsing
State Rekonstruktion
Fallback Logik
Content Reinigung
Ledger
Triketon
Response Build

### 12.2 Mehrere Wahrheitsquellen

Es ist nicht immer klar, welche Quelle im Konfliktfall maßgeblich ist.

Ist die Wahrheit der Systemprompt
die History
die letzte Telemetrie Nachricht
der Skeleton
die serverseitige Fallback Telemetrie
oder die serverseitige Überschreibung bestimmter Felder

### 12.3 Mehrere Formatstufen

Die Telemetrie existiert gleichzeitig als:

Textformat
Envelope
geparstes Objekt
Cockpit Objekt
Fallback Objekt

### 12.4 Debugging ist nur noch mit vielen Logs möglich

Ohne die Trace Logs ist kaum sichtbar, an welcher Stelle sich ein Fehler einschleicht.

## 13. Was aktuell nicht geändert wurde

Wichtig für den nächsten Dev:

Nach dem aktuellen Stand wurde bewusst nichts weiter umgebaut. Es wurde analysiert, indexiert und verglichen, aber kein neuer Vereinfachungsschritt wurde umgesetzt.

Das bedeutet:

Der Status Quo ist noch aktiv.
Der Telemetry Skeleton ist noch im Code.
Die verschachtelte Struktur ist noch vorhanden.
Die Pipeline wurde beobachtet, aber nicht zurückgebaut.

## 14. Der aktuelle Point Zero Gedanke

Der Wunsch ist ausdrücklich, zurück auf Point Zero zu gehen.

Point Zero bedeutet in diesem Zusammenhang nicht, alles zu löschen, sondern das System wieder auf seine minimale Kernlogik zurückzuführen.

Die Kernidee wäre:

Das Modell bekommt genau eine Formatdefinition.
Der Verlauf trägt den Zustand.
Der Server validiert, parst und setzt nur deterministische Felder.
Unnötige doppelte oder dreifache Telemetriequellen werden entfernt.

Damit wird das System klarer, wartbarer und robuster.

## 15. Möglicher Zielzustand für die Vereinfachung

Ohne hier bereits einen Patch vorzugeben, lässt sich der gewünschte Zielzustand so beschreiben:

### 15.1 Eine einzige Formatinstruktion

Der Systemprompt definiert die Telemetriestruktur.

### 15.2 Eine einzige Zustandsquelle

Die Chat History mit früheren Assistant Telemetrieblöcken trägt den Zustand.

### 15.3 Server nur für harte Aufgaben

Der Server übernimmt nur:

Validierung
Parsing
deterministische Felder
Fallback im Notfall

### 15.4 Keine leeren konkurrierenden Referenzen

Ein Skeleton ohne Werte wäre in so einem Zielbild nicht mehr nötig.

## 16. Was der nächste Dev zuerst verstehen muss

Der nächste Dev sollte nicht mit einem Patch beginnen, sondern zuerst die Architektur als Flussbild verstehen.

Die entscheidende Reihenfolge lautet:

1. Welche Messages gehen wirklich an Azure
2. Welche Telemetriequellen liegen gleichzeitig im Request
3. Was kommt real vom Modell zurück
4. Was erkennt `extractTelemetryEnvelope()`
5. Was landet in `cleanedContent`
6. Was landet in `structuredTelemetry`
7. Was rendert das Frontend als Chatinhalt
8. Was rendert das Frontend als Telemetrie Panel

Erst wenn diese Kette glasklar ist, sollte reduziert werden.

## 17. Der kritischste technische Prüfpunkt

Der kritischste technische Prüfpunkt ist aktuell die Envelope Trennung zwischen Telemetrie und Content.

Die Logs zeigen, dass diese Trennung nicht in jedem Prompt identisch arbeitet. Besonders Prompt 1 war auffällig, weil `hasContentBlock` dort im Trace als false auftauchte, obwohl im Modelloutput ein Contentblock sichtbar war.

Das ist ein Kernproblem, weil davon abhängt, ob `cleanedContent` wirklich sauber nur den Chatinhalt enthält.

## 18. Der kritischste architektonische Prüfpunkt

Der kritischste architektonische Prüfpunkt ist die Frage:

Welche Telemetriequelle ist kanonisch

Solange diese Frage nicht klar auf genau eine oder höchstens zwei Ebenen reduziert wird, bleibt das System unnötig komplex.

## 19. Empfohlene Lesereihenfolge für den nächsten Dev

Der nächste Dev sollte in dieser Reihenfolge vorgehen:

Erstens den relevanten Bereich von route.ts lesen.
Zweitens den Request Builder identifizieren.
Drittens alle Stellen sammeln, an denen Telemetrie aktiv erzeugt oder injiziert wird.
Viertens die Envelope und Parsing Logik prüfen.
Fünftens die finale JSON Response prüfen.
Sechstens das Frontend Rendering gegen diese Response legen.

## 20. Status Zusammenfassung in Klarform

Der aktuelle Stand lässt sich so zusammenfassen:

Die Pipeline ist grundsätzlich funktionsfähig.
Azure liefert reguläre Antworten.
Das Modell kann die 37 Telemetrie Felder korrekt ausgeben.
Die Servervalidierung funktioniert.
Das Parsing funktioniert grundsätzlich.
Der Server baut strukturierte Telemetrie korrekt auf.
Es gibt aber eine zu hohe Komplexität durch mehrere parallele Telemetriequellen.
Der Telemetry Skeleton ist funktional redundant und erhöht die Verschachtelung.
Die Trennung von Telemetrie und Content wirkt insbesondere beim ersten Prompt nicht durchgehend stabil.
Dadurch kann Telemetrie im Chattext sichtbar bleiben und zusätzlich im Telemetrie Kasten erscheinen.
Das System ist derzeit technisch arbeitsfähig, aber architektonisch zu schwer geworden.

## 21. Abschluss

Dieses README friert den aktuellen Status Quo ein. Es dokumentiert bewusst den Ist Zustand vor einem Point Zero Cleanup. Der nächste Dev soll nicht direkt weiterkomplexifizieren, sondern zuerst vereinfachen, Verantwortlichkeiten trennen und die kanonische Telemetriequelle festlegen.

Die zentrale Leitfrage für die nächste Phase lautet:

Wie machen wir aus einem funktionierenden, aber zu verschachtelten Telemetriesystem wieder ein minimales, eindeutiges und wartbares System.
