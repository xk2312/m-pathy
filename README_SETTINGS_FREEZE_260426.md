# README_SETTINGS_FREEZE_260426

## Freeze Status

Datum: 2026-04-26  
Bereich: M13 Settings Overlay  
Status: stabiler Feature-Freeze nach erfolgreicher Settings-Datenlogik

Dieser Freeze dokumentiert den aktuellen stabilen Stand des Settings Overlays. Das Overlay ist sichtbar, datenfähig, mit der User Registry in IndexedDB verbunden und besitzt funktionierendes Save-Verhalten mit Dirty-State und User-Feedback.

---

## Commit-Titel

```txt
freeze settings overlay data binding and save feedback
```

---

## Betroffene Hauptdatei

```txt
app/components/settings/SettingsOverlay.tsx
```

---

## Ausgangslage

Vor diesem Block war das Settings Overlay zwar sichtbar, aber noch nicht vollständig funktional.

Vorhanden war:

- Settings Overlay öffnete auf Desktop
- Settings Overlay öffnete auf Mobile
- OverlayHost war global eingebunden
- Settings wurde über den korrekten UI Event geöffnet
- Platzhalterfelder waren sichtbar
- Save Button existierte, gab aber kein brauchbares Feedback
- Daten wurden zunächst nicht an der echten IndexedDB-Quelle gespeichert

Nicht stabil war:

- echte Datenbindung
- Save-Ziel
- API Key Struktur
- Dirty-State
- Save Feedback
- User-Vertrauen nach Klick auf Save

---

## Ziel dieses Blocks

Das Settings Overlay sollte echte Daten aus der User Registry anzeigen, editierbare und read-only Felder trennen und Änderungen sauber in der IndexedDB persistieren.

Zielstruktur:

```txt
General
  Name
  Tone

Security
  Public Key

Infrastructure
  Server URL
  API Key

Danger Zone
  vorbereitet für spätere Account- und Funktionsverwaltung
```

---

## Aktueller stabiler Flow

```txt
IndexedDB Load
→ Runtime Normalisierung
→ registry + draft + initial snapshot
→ User editiert draft
→ isDirty vergleicht draft gegen initial
→ Save schreibt draft nach IndexedDB
→ registry, draft und initial werden aktualisiert
→ Save Button wird wieder inactive
```

---

## Persistenzquelle

Die aktive Speicherquelle ist jetzt:

```txt
IndexedDB
Database: MpathyRuntime
Object Store: user
Key: registry
```

Die alte lokale Annahme über `localStorage` war für diesen Stand falsch.

Wichtig:

```txt
SettingsOverlay liest und schreibt direkt MpathyRuntime / user / registry.
```

---

## Load-Logik

`loadUserRegistry()` wurde auf IndexedDB umgestellt.

Erwartetes Verhalten:

- öffnet `MpathyRuntime`
- liest Object Store `user`
- lädt Key `registry`
- gibt das Objekt direkt zurück
- nutzt kein `JSON.parse`
- nutzt kein `localStorage`
- gibt bei leerem Ergebnis `null` zurück

---

## Save-Logik

`saveUserRegistry(registry)` schreibt jetzt in IndexedDB.

Erwartetes Verhalten:

- öffnet `MpathyRuntime`
- startet `readwrite` Transaction auf `user`
- schreibt per `store.put(registry, "registry")`
- wartet auf `tx.oncomplete`
- loggt Save Success

Save erfolgt über den bestehenden Save Button.

---

## Runtime Normalisierung

Die User Registry wird beim Laden defensiv erweitert.

Grundsatz:

```txt
Wenn Feld fehlt, lokal ergänzen.
Wenn Feld existiert, respektieren.
```

Wichtige Normalisierung:

```txt
infrastructure
infrastructure.server
infrastructure.server.url
infrastructure.server.api_key
infrastructure.server.status
```

Damit existiert `api_key` auch dann, wenn er in älteren Registries noch nicht vorhanden war.

Diese Normalisierung wird nicht als starres Schema verstanden, sondern als Runtime-Schutz für das Overlay.

---

## General Section

Die General Section ist funktional.

Felder:

```txt
Name
Tone
```

### Name

- Quelle: `draft.profile.name`
- UI: freies Input-Feld
- editierbar
- wird beim Save nach IndexedDB geschrieben

### Tone

- Quelle: `draft.profile.tone`
- UI: Dropdown
- Registry-Werte:
  - `1` = Förmlich
  - `2` = Persönlich
- Anzeige:
  - Förmlich
  - Persönlich

Tone wird als String verglichen und gespeichert, damit Nummer/String-Abweichungen keine UI-Probleme erzeugen.

---

## Security Section

Die Security Section ist wieder korrekt als eigene Section vorhanden.

Feld:

```txt
Public Key
```

### Public Key

- Quelle: `draft.security.public_key`
- UI: read-only Input
- nicht editierbar
- aktuell vollständig sichtbar
- später eventuell maskieren und Copy Button ergänzen

Wichtige Strukturentscheidung:

```txt
Security bleibt Section.
Public Key ist ein Feld innerhalb von Security.
```

Public Key darf nicht die Section ersetzen.

---

## Infrastructure Section

Die Infrastructure Section ist funktional.

Felder:

```txt
Server URL
API Key
```

### Server URL

- Quelle: `draft.infrastructure.server.url`
- UI: Input
- editierbar
- wird beim Save gespeichert

### API Key

- Quelle: `draft.infrastructure.server.api_key`
- UI: Input
- editierbar
- wird beim Save gespeichert
- Feld wird durch Runtime Normalisierung gebildet, falls es noch nicht existiert

Wichtig:

```txt
API Key wird nicht im Save erzeugt.
API Key wird beim Load normalisiert.
```

Das verhindert Bugloops und hält die UI stabil.

---

## Danger Zone

Die Danger Zone ist vorbereitet, aber noch nicht funktional ausgebaut.

Aktueller Zustand:

```txt
Account Deletion (coming soon)
```

Zukünftige Zielrichtung:

```txt
Danger Zone =
User-Control Layer
```

Dort sollen später stehen:

- Apps und Funktionen aus `user_registry.items`
- keine Systemprogramme
- Account löschen
- eventuell Funktionen deaktivieren oder entfernen

Aktuelle Regel:

```txt
Danger Zone jetzt nicht weiter ausbauen.
Nur als vorbereitete Struktur belassen.
```

---

## Dirty State

Der Dirty State ist jetzt snapshot-basiert.

Nicht mehr:

```txt
draft vs registry
```

Sondern:

```txt
draft vs initial
```

Warum:

- `registry` ist ein beweglicher Zustand
- nach Save wird `registry` aktualisiert
- der sichere Vergleich braucht einen festen Ausgangszustand
- `initial` ist dieser Snapshot

Aktueller Flow:

```txt
Load:
  setRegistry(data)
  setDraft(data)
  setInitial(deep clone of data)

Edit:
  draft verändert sich

Dirty:
  relevante Felder draft vs initial vergleichen

Save:
  IndexedDB schreiben
  setRegistry(updated)
  setDraft(updated)
  setInitial(deep clone of updated)
```

---

## Save Button Verhalten

Der Save Button besitzt jetzt funktionales Feedback.

Zustände:

```txt
nicht dirty:
  disabled
  grau
  cursor not-allowed

dirty:
  aktiv
  cyan
  klickbar

saving:
  Text: Saving...
  opacity reduziert

saved:
  Text: Saved
  grün
  danach Rückkehr in disabled Zustand
```

Damit weiß der User:

- ob Änderungen vorhanden sind
- ob gespeichert wird
- ob das Speichern abgeschlossen ist

---

## Fehler und Korrekturen während des Blocks

### Fehler 1: Save schrieb zunächst in den falschen Speicher

Symptom:

```txt
Console zeigte SAVE success
IndexedDB änderte sich nicht
```

Ursache:

```txt
saveUserRegistry schrieb noch nach localStorage
```

Korrektur:

```txt
saveUserRegistry schreibt jetzt nach IndexedDB MpathyRuntime / user / registry
```

---

### Fehler 2: Load enthielt alten localStorage-Restcode

Symptom:

```txt
raw not found
JSON.parse(raw) Fehler
Syntaxreste
```

Ursache:

```txt
alter localStorage Code wurde nicht vollständig entfernt
```

Korrektur:

```txt
loadUserRegistry wurde clean auf IndexedDB ersetzt
doppelte catch-Blöcke wurden entfernt
```

---

### Fehler 3: API Key wurde nicht gespeichert

Symptom:

```txt
Server URL wurde sichtbar gespeichert
API Key fehlte im Objekt
```

Ursache:

```txt
infrastructure.server.api_key existierte in der alten registry noch nicht
```

Korrektur:

```txt
Runtime Normalisierung beim Load bildet api_key als leeres Feld
```

---

### Fehler 4: Save Button blieb dauerhaft inactive

Symptom:

```txt
Button blieb grau trotz Änderung
```

Ursache:

```txt
isDirty verglich gegen ungeeigneten Zustand
```

Korrektur:

```txt
snapshot-basierter Vergleich gegen initial
```

---

## Bekannte bewusste Nicht-Ziele

Nicht gebaut in diesem Freeze:

- Account löschen
- Apps/Funktionen in Danger Zone verwalten
- Public Key maskieren
- Public Key Copy Button
- Server Connection Test
- API Key Masking
- Toast-System
- globale Settings Architektur
- Registry.json Umbau
- Onboarding Umbau
- Backend Umbau
- Python Execution Umbau

---

## Wichtige Architekturregeln für den nächsten Block

### Regel 1

```txt
SettingsOverlay arbeitet auf user_registry.
Nicht auf registry.json.
```

### Regel 2

```txt
Neue optionale Felder werden beim Load defensiv normalisiert.
Nicht im Save.
```

### Regel 3

```txt
Save schreibt den kontrollierten draft nach IndexedDB.
```

### Regel 4

```txt
Dirty State vergleicht draft gegen initial snapshot.
Nicht gegen registry.
```

### Regel 5

```txt
Danger Zone bekommt später nur Apps und Funktionen.
Systemprogramme bleiben draußen.
```

### Regel 6

```txt
Kein Patch ohne echte Datei und echten aktuellen Code.
```

---

## Aktueller stabiler Zustand

```txt
Settings Overlay sichtbar: ja
Desktop: ja
Mobile: ja
General Felder: ja
Security Feld: ja
Infrastructure Felder: ja
IndexedDB Load: ja
IndexedDB Save: ja
Runtime Normalisierung: ja
API Key Persistenz: ja
Dirty State: ja
Save Feedback: ja
Danger Zone vorbereitet: ja
```

---

## Empfohlener Commit

```bash
git add app/components/settings/SettingsOverlay.tsx README_SETTINGS_FREEZE_260426.md
git commit -m "freeze settings overlay data binding and save feedback"
```

---

## Abschluss

Dieser Freeze markiert den Abschluss des Settings Overlay Datenbindungsblocks.

Der nächste sinnvolle Block ist nicht Save und nicht General/Security/Infrastructure, sondern entweder:

```txt
Danger Zone Ausbau
```

oder:

```txt
Security UX Ausbau
```

Für beide gilt: zuerst aktuelle Datei prüfen, dann exakt patchen.
