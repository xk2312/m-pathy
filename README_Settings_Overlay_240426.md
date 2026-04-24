# README_Settings_Overlay

## 0. Zweck dieses Dokuments

Dieses Dokument definiert das Settings Overlay von m-pathy als eigenständigen, klar begrenzten UI-Raum.
Es bündelt den aktuellen Zielzustand, die Architekturprinzipien, die Datenlogik, die strukturellen Regeln, die geplanten Settings-Bereiche und die Funktionslogik der einzelnen Bereiche.

Das Dokument ist als Arbeitsgrundlage für den nächsten Chat gedacht.
Es dient dazu, das Overlay ohne Drift, ohne Architekturvermischung und ohne neue Orientierungskosten umzusetzen.

---

## 1. Kernidentität des Settings Overlays

### 1.1 Was das Settings Overlay ist

Das Settings Overlay ist ein isolierter Editor für die `user_registry`.

Es ist:
- ein Overlay über der Wall
- ein kontrollierter Bearbeitungsraum für nutzerspezifische Einstellungen
- ein UI-Modul mit zentraler Strukturhoheit
- ein direktes Frontend-Modul ohne Beteiligung von Engine, Extension oder Execution Pipeline

### 1.2 Was das Settings Overlay nicht ist

Das Settings Overlay ist nicht:
- ein Editor für die systemische `registry`
- ein Teil der Extension Engine
- ein Teil des Onboarding Flows
- ein nachgelagerter Persist-Workaround
- ein verteilt aufgebautes UI-System wie das Archiv

### 1.3 Höchste Regel

Das Settings Overlay arbeitet ausschließlich auf der `user_registry` und weiß nichts über die `registry`.

---

## 2. Zentrale Architekturentscheidung

### 2.1 Single File Control

Das Settings Overlay wird als **eine zentrale Master-Datei** gebaut.

Diese Datei kontrolliert vollständig:
- Overlay Root
- Backdrop
- Inner Frame
- Top Spacing
- Section Spacing
- Reihenfolge der Bereiche
- Save Flow
- Cancel Flow
- State Handling für die `user_registry`
- Sichtbarkeit der Danger Zone
- Layout der gesamten Oberfläche

### 2.2 Warum diese Entscheidung getroffen wurde

Das Archiv hat gezeigt, dass verteilte Layout-Verantwortung problematisch ist.
Dort mussten Abstände und Struktur über mehrere Stellen hinweg angepasst werden.
Das erzeugt:
- Orientierungsaufwand
- Fehleranfälligkeit
- inkonsistente Abstände
- langsame Änderungen
- unnötige Sucharbeit

Das Settings Overlay soll genau das vermeiden.

### 2.3 Konsequenz

Alle strukturellen Abstände und die gesamte visuelle Hauptordnung liegen in genau einer Datei.

---

## 3. Verhältnis zu Komponenten

### 3.1 Erlaubt

Subkomponenten sind erlaubt, wenn sie inhaltliche Blöcke kapseln.
Beispiele:
- `ProfileSettingsBlock`
- `SecuritySettingsBlock`
- `InfrastructureSettingsBlock`
- `DangerZoneBlock`
- `ServerConnectionBlock`

### 3.2 Nicht erlaubt

Subkomponenten dürfen **keine strukturelle Hoheit** besitzen.
Das bedeutet:
- kein eigenes globales Padding
- keine eigenen äußeren Margins
- keine Section-Abstände
- keine Top-Abstände
- keine konkurrierenden Layout-Container

### 3.3 Regel

Subkomponenten liefern Inhalt.
Die Master-Datei liefert Struktur.

---

## 4. Datenquelle und Datenlogik

### 4.1 Einzige Datenquelle

Die einzige Datenquelle des Overlays ist die `user_registry`.

### 4.2 Aktuelle bekannte Grundstruktur der user_registry

```json
{
  "profile": {
    "name": "...",
    "tone": "..."
  },
  "security": {
    "public_key": "..."
  },
  "infrastructure": {
    "server": null
  },
  "items": [
    "settings",
    "archive",
    "new_chat",
    "csv_download",
    "json_download"
  ],
  "updated_at": "..."
}
```

### 4.3 Nicht Teil der Overlay-Logik

Das Overlay kennt nicht:
- `registry.json`
- Registry Entries
- Extension State
- Engine State
- Pipeline State
- run.sh
- Execution Artefacts

### 4.4 Datenfluss des Overlays

Der gewünschte logische Datenfluss ist:

```text
IndexedDB
  -> user_registry laden
  -> Overlay State initialisieren
  -> Nutzer ändert Felder
  -> lokale Änderungen halten
  -> gezielt speichern
  -> user_registry zurück in IndexedDB schreiben
```

### 4.5 Speicherkonzept

Das Overlay soll direkt auf die `user_registry` schreiben.
Kein Umweg über:
- Extension Persist
- Engine Mapping
- route.ts
- Python Builder

---

## 5. Designprinzip

### 5.1 Visuelle Orientierung

Das Overlay soll sich visuell am Archiv orientieren.
Das betrifft:
- Dark First Oberfläche
- ruhige, kontrollierte Fläche
- klare Typografie
- zurückhaltende Premium-Optik
- lineare Lesbarkeit

### 5.2 Logische Orientierung

Die innere Logik der Settings soll sich eher an GitHub Settings orientieren.
Das betrifft:
- klar getrennte Sektionen
- lineare Bereiche
- deutliche Trennlinien
- Danger Zone als eigener Bereich
- schnelle Orientierung
- wenig verschachtelte Tiefe

### 5.3 Zielbild

Archiv-Look, aber GitHub-Logik.

---

## 6. Strukturelles Zielbild des Overlays

### 6.1 Linearer Hauptaufbau

Das Overlay soll als lineare Abfolge von klar getrennten Bereichen gebaut werden.

Beispielhafte Hauptstruktur:

```text
HEADER
GENERAL
SECURITY
INFRASTRUCTURE
DANGER ZONE
```

### 6.2 Keine tiefe Verschachtelung

Es soll keine verschachtelte UI-Hierarchie entstehen, in der sich:
- Spacing
- Borders
- Sichtbarkeitslogik
- Zuständigkeiten

über mehrere Ebenen verteilen.

### 6.3 Jede Section ist ein eigener, klarer Abschnitt

Jede Section soll:
- einen Titel haben
- einen klaren Zweck haben
- einen klar begrenzten Feldsatz haben
- logisch von anderen Bereichen getrennt sein

---

## 7. Spacing-Regeln

### 7.1 Oberste Regel

Spacing wird vollständig in der Master-Datei gesteuert.

### 7.2 Was zentral steuerbar sein muss

In einer Datei müssen gleichzeitig einstellbar sein:
- äußerer Overlay-Abstand
- Abstand zum oberen Viewport
- Abstand Header zu erster Section
- Abstand zwischen Sections
- Abstand zwischen Inputs innerhalb einer Section
- Abstand zwischen Label, Input und Hilfetext
- Abstand vor der Danger Zone
- Abstand innerhalb der Danger Zone

### 7.3 Verbotene Muster

Nicht erlaubt sind:
- spontane `mt-*` oder `mb-*` Verteilungen über viele Dateien
- Layout-Margins in Child-Komponenten
- globale Spacing-Korrekturen außerhalb der Overlay-Master-Datei
- Konflikte zwischen Root-Spacings und Section-Spacings

### 7.4 Ziel

Jede spätere Spacing-Anpassung soll in einer Datei schnell und sicher möglich sein.

---

## 8. Header des Overlays

### 8.1 Funktion

Der Header markiert das Overlay als eigenständigen Raum.

### 8.2 Elemente

Der Header soll mindestens enthalten:
- Settings Titel
- optionales Settings Icon
- Close Action
- optional kurze Einordnung oder Subline

### 8.3 Verhalten

Der Header ist statisch und strukturell klar.
Er ist nicht Teil einzelner Settings-Bereiche.

---

## 9. Section: General

### 9.1 Rolle

General enthält allgemeine nutzerspezifische Grundeinstellungen.

### 9.2 Aktuell sicher bekannte Felder

#### 9.2.1 Name
Pfad:
```text
user_registry.profile.name
```

Funktion:
- speichert, wie der Nutzer angesprochen werden soll
- dient als zentrale Namensquelle für personalisierte UI und Kommunikation

#### 9.2.2 Tone
Pfad:
```text
user_registry.profile.tone
```

Funktion:
- steuert die gewünschte Anspracheform
- bisher bekannte Werte im Systemkontext:
  - `1` formal
  - `2` personal

### 9.3 Ziel des General Blocks

Der General Block soll schnell erfassbar sein und nur die Basisidentität des Nutzers enthalten.

### 9.4 Erwartete UI-Form

Beispielhaft:
- Name Eingabefeld
- Tone Auswahlfeld oder Segment Control
- optional kurze Erklärung pro Feld

---

## 10. Section: Security

### 10.1 Rolle

Security enthält sicherheitsbezogene nutzerspezifische Informationen.

### 10.2 Aktuell sicher bekanntes Feld

#### 10.2.1 Public Key
Pfad:
```text
user_registry.security.public_key
```

Funktion:
- Identitäts- bzw. Sicherheitsanker innerhalb der vorhandenen Nutzerstruktur
- kann später für Verifikation, Signaturbezug oder weitere sichere Funktionen relevant sein

### 10.3 UX-Regel

Dieser Bereich muss klar getrennt vom General-Bereich sein.
Er darf nicht wie ein Profilfeld aussehen.

### 10.4 Mögliche UI-Muster

Je nach gewünschter Funktionalität:
- read only Anzeige
- kopierbarer Wert
- ersetzen / erneuern
- später mit tieferer Sicherheitslogik koppelbar

---

## 11. Section: Infrastructure

### 11.1 Rolle

Infrastructure bündelt technische nutzergebundene Verbindungs- und Systemparameter.

### 11.2 Aktuell sicher bekanntes Feld

#### 11.2.1 Server
Pfad:
```text
user_registry.infrastructure.server
```

Funktion:
- speichert den aktuellen Serverbezug oder einen leeren Zustand
- ist die Basis für späteren Server Connect Flow

### 11.3 Wichtig

Der zuvor diskutierte `status` ist **nicht Teil des aktuellen stabilen Zustands**.
Er soll für das Overlay später sauber in der `user_registry` ergänzt werden und nicht über Extension- oder Engine-Workarounds entstehen.

### 11.4 Konsequenz

Infrastructure soll so gebaut werden, dass sie später sauber erweiterbar bleibt.

### 11.5 Erwartbare spätere Erweiterung

Mögliche spätere Felder:
- server
- status
- connection metadata
- last sync state
- environment marker

Aber für den aktuellen stabilen Start ist nur `server` sicher vorhanden.

---

## 12. Section: Danger Zone

### 12.1 Rolle

Die Danger Zone ist ein eigener, klar separierter Bereich für destruktive oder schwer reversible Aktionen.

### 12.2 Designprinzip

Sie soll sich logisch an GitHub Settings orientieren.
Das bedeutet:
- eigener Titel
- eigene optische Trennung
- rote Akzente
- klare Aktionsblöcke
- keine Vermischung mit normalen Settings

### 12.3 Nicht vermischen mit normalen Settings

Actions wie Löschen oder Zurücksetzen dürfen nicht im normalen Flow zwischen Name, Tone oder Server erscheinen.

### 12.4 Typische Funktionen der Danger Zone

Für m-pathy sind als Prinzip vorgesehen:
- Profil zurücksetzen
- Nutzerbezogene Daten zurücksetzen
- Account oder lokale Nutzeridentität löschen
- spätere schwer reversible Aktionen

### 12.5 Wichtige UX-Regeln

Jede Danger Action soll haben:
- klaren Titel
- kurze Erklärung
- deutliches visuelles Signal
- eindeutigen Button
- idealerweise Bestätigungsschritt

### 12.6 Denkbild

Nicht chaotisch, nicht dramatisch, sondern ruhig und klar gefährlich.

---

## 13. Overlay-Verhalten

### 13.1 Öffnen

Das Overlay wird über das Settings Icon der Wall geöffnet.

### 13.2 Schließen

Das Overlay braucht eine klare Close-Interaktion.
Typisch:
- Close Icon
- optional Escape
- optional Klick außerhalb, falls gewünscht

### 13.3 Interner Bearbeitungsmodus

Das Overlay soll lokale Änderungen zuerst im Overlay-State halten.
Nicht jede Eingabe muss sofort in IndexedDB geschrieben werden.

### 13.4 Speichern

Speichern soll bewusst und kontrolliert stattfinden.

### 13.5 Abbrechen

Beim Abbrechen soll der unveränderte Zustand erhalten bleiben.

---

## 14. Funktionslogik der einzelnen Settings

### 14.1 Name

Zweck:
- bestimmt den Nutzernamen im persönlichen Systemkontext

Operationen:
- laden
- anzeigen
- bearbeiten
- speichern

### 14.2 Tone

Zweck:
- bestimmt die bevorzugte Anspracheform

Operationen:
- laden
- anzeigen
- ändern
- speichern

### 14.3 Public Key

Zweck:
- dient als Sicherheitsanker in der `user_registry`

Operationen:
- laden
- anzeigen
- optional kopieren
- später ggf. ersetzen oder neu generieren

### 14.4 Server

Zweck:
- dient als Infrastrukturanker für spätere Server-Verknüpfungen

Operationen:
- laden
- anzeigen
- bearbeiten oder setzen
- speichern

### 14.5 Danger Actions

Zweck:
- führen schwere oder irreversible Änderungen aus

Operationen:
- anzeigen
- erklären
- bestätigen lassen
- dann erst ausführen

---

## 15. Technische Grundprinzipien für die Umsetzung

### 15.1 Single Source of Truth im Overlay

Die `user_registry` ist die einzige Wahrheit des Overlays.

### 15.2 Keine Registry-Kopplung

Das Overlay darf nicht gegen `registry.json` validieren.

### 15.3 Keine Engine-Kopplung

Das Overlay darf keine Engine-Wege nutzen.

### 15.4 Keine Extension-Kopplung

Das Overlay darf keine Persist-Mappings oder Onboarding-Mechanik benötigen.

### 15.5 Keine verstreute Layoutlogik

Die Layout- und Abstandslogik liegt vollständig in der Master-Datei.

---

## 16. Empfohlene innere Struktur der Master-Datei

### 16.1 Inhalte der Datei

Die Master-Datei soll mindestens enthalten:
- Imports
- lokaler Overlay State
- Ladefunktion für `user_registry`
- Save Funktion für `user_registry`
- Close Handling
- Spacing-Konstanten
- Hauptlayout
- lineare Sections
- Danger Zone

### 16.2 Beispielhafte lineare Reihenfolge

```text
SettingsOverlay
  Header
  GeneralSection
  SecuritySection
  InfrastructureSection
  DangerZoneSection
```

### 16.3 Ziel

Die Datei soll von oben nach unten lesbar sein, ohne Springen zwischen mehreren Layout-Dateien.

---

## 17. Erweiterbarkeit

### 17.1 Ziel

Zukünftige Änderungen sollen schnell und ohne Re-Orientierung möglich sein.

### 17.2 Daraus folgen diese Regeln

Neue Settings sollen:
- als neue Section oder klarer Unterblock entstehen
- in derselben Master-Datei eingehängt werden
- keine Layout-Verantwortung auf andere Dateien verteilen

### 17.3 Beispiel für spätere Erweiterungen

Möglich sind später:
- Server Status
- Connected Services
- Export Preferences
- Account Actions
- Privacy Controls
- Local Data Controls

Aber jede Erweiterung bleibt unter derselben zentralen Steuerlogik.

---

## 18. Regeln für zukünftige Modifikationen

### 18.1 Klarheit vor Wiederverwendung

Nicht alles muss sofort in Komponenten ausgelagert werden.

### 18.2 Geschwindigkeit vor Architekturkosmetik

Wenn eine Änderung in einer klaren Master-Datei schneller und sicherer ist, ist das besser als verteilte Eleganz.

### 18.3 Struktur vor Abstraktion

Erst wenn ein Block stabil und klar ist, darf er als Inhaltskomponente ausgelagert werden.

### 18.4 Layout bleibt zentral

Auch nach Auslagerungen bleibt die Strukturhoheit in der Master-Datei.

---

## 19. Bekannte Fehlerquelle, die vermieden werden muss

### 19.1 Archiv-Fehlerbild

Das Archiv war aus Nutzersicht zu verschachtelt.
Vor allem problematisch waren:
- verteilte Spacing-Verantwortung
- Layout-Korrekturen über mehrere Dateien
- zu hoher Orientierungsaufwand

### 19.2 Gegenmaßnahme im Settings Overlay

Das Settings Overlay wird deshalb absichtlich anders aufgebaut:
- eine Master-Datei
- lineare Struktur
- klare Sections
- zentrale Spacing-Steuerung

---

## 20. Kanonische Leitformel

Das Settings Overlay ist ein isolierter Editor für die `user_registry`, dessen Layout und Abstände vollständig von einer einzigen Master-Datei kontrolliert werden, während optionale Subkomponenten nur Inhalte liefern und keinerlei strukturelle Hoheit besitzen.

---

## 21. Kurzfassung für den nächsten Chat

Wenn nur ein kompakter Übergabesatz gebraucht wird:

> Das Settings Overlay soll visuell an das Archiv angelehnt sein, logisch aber wie GitHub Settings funktionieren, mit klaren linearen Sektionen und einer isolierten Danger Zone. Es arbeitet ausschließlich auf der `user_registry`, kennt die `registry` nicht und wird als eine zentrale Master-Datei gebaut, in der das komplette Layout und alle Abstände kontrolliert werden.
