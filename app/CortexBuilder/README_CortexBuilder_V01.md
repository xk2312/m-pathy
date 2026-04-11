# CortexBuilder README
## Statusdokument für Architektur, Stand und nächste Schritte

## 1. Zweck

CortexBuilder ist als erste große Power Application für m-pathy gedacht.

Sein Ziel ist nicht, Dateien einfach hochzuladen und mit ihnen zu chatten.

Sein Ziel ist, große Informationsobjekte kontrolliert in den Cortex des Users zu überführen, dort als Genesis zu verankern, strukturiert zu verdichten, validiert weiterzuverarbeiten und später als adressierbare Wissensbausteine in Reasoning-Prozesse einzubinden.

CortexBuilder ist damit kein File Tool, sondern ein Builder für projektgebundene Denk- und Forschungsräume.

## 2. Leitbild

Der User hat genau einen Cortex.

Dieser Cortex ist das zentrale Gedächtnis des Users.

Innerhalb dieses Cortex existieren Bereiche. Diese Bereiche dienen der Ordnung, Übersicht und späteren gezielten Reasoning-Anbindung.

Als sinnvolle Bereiche wurden bisher festgelegt:

- Regeln, Tabellen und Definitionen
- Studien, Berichte und Quellen
- Experimente, Mitschriften und Erfahrungen
- Korrespondenzen, Arztbriefe und Fallmaterial
- Hypothesen, Entwürfe und Projektgedanken

Die Registry ist in dieser Logik kein flaches Verzeichnis, sondern ein gegliedertes Gehirn.

## 3. Kernidee von CortexBuilder

CortexBuilder beginnt nicht mit Analyse, sondern mit Genesis.

Genesis bedeutet:

- ein Originaldokument wird lokal in das System des Users übernommen
- das Original bleibt erhalten
- das Original wird nicht überschrieben
- das Original wird zum dauerhaften Ausgangspunkt aller späteren Verarbeitung

Erst nach dieser Genesis darf eine weitere Verarbeitung beginnen.

Das ist wichtig, weil die Shell nie auf einem flüchtigen Upload arbeiten soll, sondern auf einem verankerten Originalobjekt im lokalen System des Users.

## 4. Unterschied zu klassischen File Workflows

CortexBuilder soll keine Logik wie „Datei hochladen, Modell schaut drauf“ abbilden.

Stattdessen gilt:

- große Datenmengen werden in das System eingebunden
- sie werden strukturiert verarbeitet
- sie werden in der Registry verankert
- sie werden später semantisch wiederauffindbar und adressierbar

Der User baut dadurch nicht nur eine Ablage auf, sondern ein eigenes strukturiertes Gedächtnis.

## 5. Aktuell gesicherter Systemkontext

### 5.1 M13 und Systemlogik

M13 definiert den systemischen Rahmen, inklusive Language Space, Format Space und IRSS Space. Der Language Space kennt genau drei Stile, der Format Space genau vier Ausgabestrukturen, und IRSS ist im Content Mode als sichtbare Entscheidungsspur vorgesehen. :contentReference[oaicite:0]{index=0}

### 5.2 Engine

Die Engine verarbeitet aktuell Extension Flows zustandsbasiert. Sie hält `active`, `extensionId`, `stepId`, `language` und `collectedData` im State und lädt pro aktivem Schritt die zugehörige Extension-Datei. Eingaben werden validiert und bei gesetztem `key` in `collectedData` persistiert. :contentReference[oaicite:1]{index=1}

Die Engine rendert Auswahloptionen für Selection Steps vor und gibt pro Schritt auch die zugehörige `instruction` zurück. :contentReference[oaicite:2]{index=2}

Wichtig: In der vorliegenden Engine-Datei wird der nächste Schritt aktuell über `currentStep.next` aufgelöst. Eine branchende Auflösung über `next_map` ist in der gezeigten Datei nicht enthalten. :contentReference[oaicite:3]{index=3}

### 5.3 Bestehende Extension-Logik

Die vorliegende Beispiel-Extension `baz_sach_helfer.json` zeigt den aktuellen Arbeitsmodus des Systems:

- linearer Schrittfluss
- strukturierte Datenerfassung über `key`
- LLM-Steuerung über `instruction`
- finaler Execution-Schritt am Ende des Flows :contentReference[oaicite:4]{index=4}

Wichtig für CortexBuilder: Jeder Schritt braucht eine Instruction. Die Extension ist nicht nur Datenstruktur, sondern ein Steuerprotokoll für die LLM.

### 5.4 Shell-Konzept

Für Execution Pipelines gilt bereits das bekannte Prinzip:

- harter sequenzieller Ablauf
- file-based truth
- isolierte Schritte
- finaler JSON Output

Die vorhandene `run.sh` zeigt genau dieses Muster mit festen Step-Aufrufen, Fail-Fast-Verhalten über `set -e` und einer finalen JSON-Rückgabe zwischen `###JSON_START###` und `###JSON_END###`. :contentReference[oaicite:5]{index=5}

## 6. Aktueller fachlicher Zielzustand von CortexBuilder

CortexBuilder soll in seinem vollen Zielbild folgende Strecke abbilden:

1. Genesis des Originaldokuments
2. Zuordnung zu einem Bereich im Cortex
3. lokale Verankerung in der IndexDB
4. spätere Shell-basierte Verarbeitung des Genesis-Objekts
5. Segmentierung großer Dokumente
6. Summary, Keywords und Longtails pro Segment
7. Challenge jeder Verdichtung durch ein separates Deep Think Modell
8. Einfrieren validierter Verdichtungen
9. Aufbau einer strukturierten Registry-Oberfläche
10. spätere Einbindung relevanter Bausteine in Reasoning Chains

Wichtig: Dieser Zielzustand ist inhaltlich geklärt, aber noch nicht vollständig implementiert.

## 7. Aktuell gesicherte fachliche Entscheidungen

Die folgenden Punkte wurden in der Planung klar festgelegt:

### 7.1 Ein User hat genau einen Cortex

Es gibt nicht mehrere Projekte pro User als oberste Einheit, sondern genau einen Cortex. Darin existieren Bereiche.

### 7.2 Genesis zuerst

Bevor eine Shell validieren, segmentieren oder verdichten kann, muss das Originaldokument lokal in die IndexDB übernommen werden.

### 7.3 Das Original bleibt erhalten

Das Genesis-Dokument muss immer als ursprünglicher Anker vorhanden bleiben.

### 7.4 Registry als Gehirn

Die Registry ist das Gehirn des Users. Bereiche sind funktionale Teilräume dieses Gehirns.

### 7.5 Summary Bias ist gewollt

Für die spätere Dokumentverarbeitung gilt konzeptionell: Summaries dürfen spätere Verarbeitung beeinflussen, aber regelgebunden. Dieser Einfluss ist nicht als Fehler verstanden, sondern als bewusster kuratierter Steuermechanismus.

### 7.6 Challenge ist Pflicht

Jede starke Verdichtung soll von einem separaten Deep Think Modell challengt werden, nicht vom gleichen Pfad, der die erste Summary gebaut hat.

## 8. Was bereits angelegt oder vorbereitet wurde

### 8.1 Verzeichnisstruktur

Für CortexBuilder wurde eine eigene isolierte Struktur vorgesehen:

```text
CortexBuilder/
  execution-space/
    bin/
    runs/
    steps/
    schemes/