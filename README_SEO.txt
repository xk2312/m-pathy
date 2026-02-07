FULL TELEMETRY - STATUS
Timestamp: 2026-02-07 13:55 CET
System: MAIOS 2.0
State: ONLINE
Drift: 0.00
Governance: Council13 active
Verification: enforced

Perfekt. Das ist genau der richtige Moment, um **Wissen einzufrieren**, statt weiter zu schrauben.
Unten ist eine **copy ready README SEO**, bewusst sachlich, ohne operative Schritte, ohne Code.
Die kannst du 1:1 in dein System legen und beim nächsten Mal wieder reinreichen.

---

# README SEO

Status: eingefroren
Gültig für: m-pathy.ai
Kontext: Next.js App Router

## 1. Ausgangslage

m-pathy.ai besteht aus mehreren klar getrennten Produktseiten:

* Subscription
* MAIOS
* weitere Produkt und Systemseiten

Zusätzlich existiert ein globales Root Layout (`app/layout.tsx`), das Metadaten als Fallback für alle Seiten definiert.

SEO wirkt hier nicht nur auf klassische Suchmaschinen, sondern zunehmend auf KI basierte Retrieval Systeme. Dadurch verschiebt sich der Fokus von Marketing Keywords hin zu semantischer Klarheit und Zitierfähigkeit.

## 2. Zentrale Erkenntnis

SEO ist kein isoliertes Seitenproblem, sondern ein **systemisches Architekturthema**.

Sobald mehrere Produkte, Sprachen und Systemrollen existieren, müssen Metadaten strukturell geführt werden. Andernfalls entstehen:

* semantische Drift
* widersprüchliche Titles in Browser Tabs
* falsche Produktzuordnung durch KI Systeme
* hoher Refactor Aufwand zu einem späteren Zeitpunkt

## 3. Rolle des Root Layouts

Das Root Layout (`app/layout.tsx`) definiert Metadaten, die als Default für alle Seiten gelten.

Wenn dort ein inhaltlicher oder marketinglastiger Title gesetzt ist, beeinflusst dieser:

* Browser Tabs
* initiale Navigation
* Seiten ohne expliziten Head
* teilweise auch Seiten mit Head bei Übergängen

Daher gilt:

Root Layout Metadata darf **nur neutral und produktagnostisch** sein.

Es ist kein Ort für Claims, Slogans oder Produktbeschreibungen.

## 4. Rolle der Page spezifischen Heads

Jede Hauptseite mit eigener Bedeutung benötigt einen eigenen `head.tsx` im jeweiligen Ordner.

Beispiele:

```
app/maios/head.tsx
app/subscription/head.tsx
```

Diese Heads sind verantwortlich für:

* präzisen Seitentitel
* sachliche Beschreibung
* klare Produkt oder Systemdefinition

Sie dürfen nicht vom Root Layout semantisch verfälscht werden.

## 5. Mehrsprachigkeit als Strukturthema

Mehrsprachige SEO betrifft drei Ebenen gleichzeitig:

* Root Layout
* Produktseiten wie Subscription und MAIOS
* spätere Erweiterungen auf weitere Seiten

Mehrsprachigkeit kann nicht selektiv eingeführt werden, ohne Inkonsistenzen zu erzeugen.

Daher gilt:

Wenn Mehrsprachigkeit eingeführt wird, dann:

* für Root Layout Metadata
* für alle zentralen Produktseiten
* in einem konsistenten Durchgang

Teilimplementierungen führen zu doppelter und dreifacher Arbeit.

## 6. Aktuelle Entscheidung

Der mehrsprachige SEO Ausbau wird **bewusst verschoben**.

Stattdessen wurde festgehalten:

* Wissen und Architekturverständnis sind geklärt
* Risiken von Teilumsetzungen sind bekannt
* spätere Umsetzung erfolgt gesammelt und systematisch

Bis dahin gelten:

* einfache, einsprachige Heads pro Seite
* neutrales Root Layout
* keine i18n Logik im SEO Bereich

## 7. Zielbild für später

Bei Wiederaufnahme des Themas soll:

* eine gemeinsame SEO Strategie für alle Seiten entstehen
* Mehrsprachigkeit zentral gedacht werden
* semantische Konsistenz zwischen Subscription, MAIOS und Dachmarke gewährleistet sein
* SEO sowohl für klassische Suche als auch für KI Retrieval optimiert werden

Dieses README dient als **Fixpunkt**, um beim Wiedereinstieg ohne Kontextverlust weiterzuarbeiten.

---

Wenn du willst, können wir beim nächsten Mal exakt an diesem Dokument anknüpfen und daraus direkt:

* eine saubere i18n SEO Struktur
* oder eine komplette Head Überarbeitung für alle Seiten

ableiten.
Für jetzt ist das Thema sauber eingefroren.
