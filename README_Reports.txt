# 🧭 ReadmeReports.txt

**Projekt:** Archive / Verification / Reports
**Stand:** 14. Januar 2026
**Status:** laufend (funktional stabil · visuell noch offen)
**Modul:** `ReportList` + `verificationStorage` + `ReportStatus`
**Scope:** Anzeige, Verwaltung und Re-Verification von gespeicherten Verification Reports

---

## 1. Ziel und Kontext

Das Reports-Subsystem ist ein Bestandteil des **Archive + Verification-Stacks**.
Es dient der **lokalen Anzeige, Verwaltung und Re-Verifikation** von bereits abgeschlossenen Prüfungen (Verification Reports), die in `LocalStorage` persistiert werden.

Ziel ist:

* Alle Reports aus dem Speicher **deterministisch** lesen,
* sie **visuell klar und minimalistisch** darstellen,
* **Re-Verify** (erneute Prüfung) auslösen zu können,
* und **Invalidierung** (Löschen) zu ermöglichen - ohne Drift, ohne API-Abhängigkeiten.

Die Architektur ist **lokal**, **deterministisch** und **unabhängig vom Server**.

---

## 2. Technischer Aufbau

### 📁 Hauptdateien

| Datei                                 | Zweck                                                        |
| ------------------------------------- | ------------------------------------------------------------ |
| `components/archive/ReportList.tsx`   | UI-Komponente zur Anzeige, Steuerung und Event-Weitergabe    |
| `lib/verificationStorage.ts`          | LocalStorage-Layer für Reports (lesen, speichern, löschen)   |
| `components/archive/ReportStatus.tsx` | Status-Anzeige eines einzelnen Reports (verified/unverified) |
| `lib/types.ts`                        | Typdefinition `VerificationReport` (Kanonischer Typ)         |

---

## 3. Aktueller Codezustand (ReportList)

* **Basis:** React Functional Component mit Hooks (`useState`, `useEffect`)
* **Sprachensteuerung:** über `useLanguage()` + `i18nArchive`
* **Initialisierung:** `loadReports()` liest aus LocalStorage (`mpathy:verification:reports:v1`)
* **Limitierung:** aktuell `slice(0, 3)` – nur drei Reports werden geladen (Performance-Schutz)
* **Re-Render Trigger:**

  * `mpathy:archive:verify:success` (nach erfolgreicher Verifikation)
  * `mpathy:archive:reports:refresh` (manuelles Refresh-Event)
* **Interne States:**

  * `reports` → Liste aller geladenen Reports
  * `selected` → aktuell geöffneter Report (Accordion-Mechanik, single open)
* **Interaktion:**

  * Klick auf Header → öffnet Accordion
  * Button „Re-Verify“ → sendet CustomEvent an System
  * Button „Invalid“ → löscht Report
  * Button „Close“ → schließt Accordion

---

## 4. UI-Regeln (aktuell gültig)

| Element                  | Verhalten                                                    | Fix / Anpassbar                      |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------ |
| **Card (Header)**        | Zeigt Timestamp + Pair Count, öffnet Detailansicht           | Fix (keine Funktionsänderung)        |
| **Accordion-Body**       | Zeigt JSON Dump des Reports + Status                         | Fix, Styling darf angepasst werden   |
| **Button Re-Verify**     | Dispatch Event → `mpathy:archive:verify`                     | Fix, Eventname unveränderlich        |
| **Button Invalid**       | Ruft `deleteReport()` → löscht aus LocalStorage              | Fix                                  |
| **Button Close**         | Schließt Accordion → setzt `selected = null`                 | Fix                                  |
| **Padding / Spacing**    | 10 px Innenabstand in Accordion Body, `gap-4` zwischen Cards | Anpassbar (Style-Ebene)              |
| **Autostart-Zustand**    | Kein Accordion offen beim Mount                              | Fix                                  |
| **Anzeige-Limit**        | Nur 3 Reports sichtbar, Pagination noch nicht implementiert  | Anpassbar (limit in `loadReports()`) |
| **White Border Removal** | Kein sichtbarer Rand um Header                               | Fix, CI-Regel                        |

---

## 5. Event-Flows

### 🔄 Inbound Events (von außen empfangen)

| Event                            | Quelle         | Wirkung                 |
| -------------------------------- | -------------- | ----------------------- |
| `mpathy:archive:verify:success`  | Verify-System  | Reload der Report-Liste |
| `mpathy:archive:reports:refresh` | ArchiveOverlay | Manuelles Reload        |

### 🚀 Outbound Events (von ReportList gesendet)

| Event                   | Empfänger           | Payload                                                    |
| ----------------------- | ------------------- | ---------------------------------------------------------- |
| `mpathy:archive:verify` | Verification Engine | `{ intent: 'reverify', payload: { public_key, content } }` |

---

## 6. Datenquelle & Format

### 🔑 Storage-Key

`mpathy:verification:reports:v1`

### 📦 Datenformat

Einträge sind normalisierte Objekte vom Typ `VerificationReport`, bestehend aus:

```ts
{
  protocol_version: 'v1',
  generated_at: string,
  last_verified_at?: string,
  pair_count: number,
  status: 'verified' | 'unverified',
  source: 'archive-selection',
  public_key: string,
  truth_hash?: string,
  content: any,
  verification_chain?: any,
  chain_signature?: any
}
```

> 🔒 Wichtig: `truth_hash` wird **nicht als Pflichtfeld** behandelt.
> Reports ohne Truth-Hash werden trotzdem angezeigt.

---

## 7. Integrationsbeziehungen

| Modul                 | Beziehung | Beschreibung                                      |
| --------------------- | --------- | ------------------------------------------------- |
| `ArchiveOverlay`      | Parent    | Steuert Mode-Switch zwischen CHAT / REPORTS       |
| `ReportList`          | Child     | Visualisierung & Verwaltung lokaler Reports       |
| `ReportStatus`        | Sub-Child | Zeigt Status (verified / unverified) im Accordion |
| `verificationStorage` | Backend   | Liefert persistente Reports aus LocalStorage      |
| `Triketon`            | Indirekt  | Ursprungsquelle der Reports (Anchor-Seals)        |

---

## 8. Entwicklungsnotizen & offene Punkte

| Bereich                         | Beschreibung                                                        | Status |
| ------------------------------- | ------------------------------------------------------------------- | ------ |
| **Styling Feinschliff**         | Header Padding, Weißraum + Card-Übergänge                           | offen  |
| **Accordion-Smoothness**        | noch ohne Transition Animation                                      | offen  |
| **Pagination / Lazy Load**      | nur `slice(0, 3)` aktiv – Paging geplant                            | offen  |
| **Re-Verify Flow**              | Event Dispatch funktioniert, aber noch kein visuelles Feedback      | offen  |
| **Invalid → Refresh**           | funktioniert funktional, UI-Update momentan sofort via setReports() | stabil |
| **White Header Border**         | erfolgreich entfernt                                                | stabil |
| **LocalStorage Parse Fallback** | vorhanden in `verificationStorage`                                  | stabil |
| **Event Logging**               | aktiviert (mount / verify / refresh)                                | stabil |

---

## 9. Änderungs-Governance

### ❌ Nicht anpassen

* Event-Namen (`mpathy:archive:*`)
* LocalStorage-Key (`mpathy:verification:reports:v1`)
* State-Struktur (`reports`, `selected`)
* Component-Hierarchie
* `deleteReport()`, `loadReports()`, `getReport()` Signaturen
* Payload-Format des Re-Verify-Events

### ⚙️ Darf angepasst werden

* `slice()`-Limit für angezeigte Reports
* Styling (Abstände, Farben, Border, Font-Size)
* Sortierreihenfolge der Reports
* Ausgabeformat (JSON → Kurzinfo etc.)
* Logging Detailtiefe
* i18n-Labels (im Namespace `report`)

---

## 10. Zusammenfassung

Das Reports-Subsystem ist **funktionsfähig**, **deterministisch** und **stabil im Kern**.
Es bildet die **Brücke zwischen Verifikations-Engine und Nutzeroberfläche** im Archive-System.

Es gibt derzeit **kein Drift-Signal** im Codefluss, aber mehrere **offene visuelle und UX-Punkte**, die für die finale Version (Patch 12 +) bearbeitet werden.

Das System folgt durchgehend den **MEFL-Prinzipien**:
**Ein Pfad, klare Zuständigkeit, deterministische Daten, sanfte Oberfläche.**

---

**End of ReadmeReports.txt**
*(Status 14.01.2026 · für Übergabe an Council13 oder Next Node)*
