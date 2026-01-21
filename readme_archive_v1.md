Perfekt. Ich habe dein README **nicht nur ergänzt**, sondern **strukturell gehärtet**, damit dein **Zukunfts-Ich (oder ein fremdes Wartungsteam)** in **5–10 Minuten**:

* das **Warum** versteht
* die **Adern** (Datenflüsse) erkennt
* weiß, **wo Änderungen erlaubt sind** – und wo **nicht**
* sofort sieht, **warum Reload ≠ Bug**, sondern eine bewusste Designfolge war
* sicher erweitern kann, **ohne Triketon zu verletzen**

Ich habe **keine Semantik verändert**, nur explizit gemacht, was bisher implizit war.

---

# m-pathy Archive System - README

**Archive v1 · Verification-First · Deterministic Projection**

---

## 0. Executive Summary (für Eilige)

Das **m-pathy Archive** ist eine **deterministische, vollständig rebuildbare Projektion** des Triketon-Ledgers.

* **Triketon** ist Wahrheit.
* **Archive** ist Darstellung.
* **UI** ist Konsument.

> ❗️Wenn du jemals unsicher bist:
> **Alles darf gelöscht werden – außer Triketon.**

---

## 1. Purpose & Design Intent

Das Archive existiert aus **genau einem Grund**:

> **Vergangene Dialoge verlässlich anzeigen, durchsuchen, auswählen und als Kontext wiederverwenden – ohne jemals Wahrheit zu erzeugen oder zu verändern.**

Es ist **kein Cache**, kein Backup und keine zweite Datenbank.
Es ist eine **Ansichtsschicht**.

### Warum das wichtig ist

* Debugging bleibt möglich
* Verifikation bleibt möglich
* IP-Schutz bleibt möglich
* Reproduzierbarkeit bleibt möglich

---

## 2. Absolute Invariants (Systemgesetze)

Diese Punkte dürfen **niemals** gebrochen werden.

### 2.1 Triketon ist die einzige Wahrheit

```
mpathy:triketon:v1
```

* append-only
* kryptografisch verknüpft
* niemals überschrieben
* niemals „repariert“
* niemals von der UI beschrieben

> **Wenn etwas falsch aussieht → Archive rebuilden, nicht Triketon ändern.**

---

### 2.2 Archive ist immer eine Projektion

```
mpathy:archive:v1
```

* entsteht ausschließlich aus Triketon
* enthält **keine** Wahrheit
* darf jederzeit gelöscht werden
* darf jederzeit neu erzeugt werden
* optimiert für UI, nicht für Verifikation

---

### 2.3 Keine Heuristiken. Niemals.

Das Archiv **rät nicht**.

❌ keine Zeitfenster
❌ keine Message-Counts
❌ keine „User hat lange nichts gesagt“
❌ keine UI-Interpretation

✔️ nur explizite Ketten (`chain_id`)

---

## 3. Storage-Namespaces (LocalStorage)

### 3.1 Triketon Ledger

```
mpathy:triketon:v1
```

**Typ:** `TriketonAnchor[]`
**Schreibzugriff:** Server / API
**Bedeutung:** Kanonische Wahrheit

---

### 3.2 Archive Projection

```
mpathy:archive:v1
```

**Typ:** `ArchivChat[]`
**Schreibzugriff:** `syncArchiveFromTriketon()`
**Bedeutung:** Chat-Ansicht für UI

---

### 3.3 Archive interne Ableitungen

```
mpathy:archive:chat_counter
mpathy:archive:chat_map
```

**Status:** vollständig **deriviert**
**Lebensdauer:** beliebig
**Löschbar:** jederzeit

#### `chat_counter`

* monoton wachsend
* rein menschliche Lesbarkeit

#### `chat_map`

```ts
chain_id (string) → chat_id (number)
```

> ⚠️ Diese Keys sind **kein Zustand**, sondern **Memoization**.

---

## 4. Zentrale Semantik (kritisch)

### 4.1 `chain_id` - das Rückgrat

* entsteht **nur im Triketon-Write**
* definiert **exakt einen Chat**
* alle Anchors mit gleicher `chain_id` gehören zusammen

**Gesetz:**

```
1 chain_id === 1 Chat
```

Wenn kein neuer `chain_id` erzeugt wird, **existiert aus Systemsicht kein neuer Chat** – egal, was die UI glaubt.

---

### 4.2 `chain_prev`

* verweist auf `truth_hash` der vorherigen Nachricht
* **nur** innerhalb derselben `chain_id`
* muss beim ersten Anchor eines Chats leer sein

---

### 4.3 `truth_hash`

* Hash des normalisierten Inhalts
* unveränderlich
* Grundlage für:

  * Verifikation
  * Kettenintegrität
  * Pair-Bildung

---

## 5. Datenmodelle

### 5.1 TriketonAnchor (Ledger)

```ts
type TriketonAnchor = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  truth_hash: string
  public_key?: string
  chain_id: string
  chain_prev?: string
  orbit_context: 'chat'
  version: 'v1'
}
```

---

### 5.2 ArchivChat (UI-Projektion)

```ts
interface ArchivChat {
  chat_id: number
  first_timestamp: string
  last_timestamp: string
  keywords: string[]
  entries: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }[]
}
```

---

## 6. Architektur & Zuständigkeiten

### 6.1 Truth Layer

* **Server / API**
* erzeugt `chain_id`
* erzeugt `truth_hash`
* appended Triketon

---

### 6.2 Projection Layer (Archive)

* liest Triketon
* gruppiert nach `chain_id`
* bildet Chats
* extrahiert Keywords
* schreibt Archive-Keys

**Einbahnstraße.**

---

### 6.3 UI Layer

* liest Archive
* reagiert auf Events
* zeigt Dialoge
* **schreibt niemals Ledger**

---

## 7. Runtime-Flow (entscheidend für Debugging)

```
User sendet Nachricht
        ↓
API erzeugt TriketonAnchor
        ↓
mpathy:triketon:v1 wächst
        ↓
Event: mpathy:triketon:append
        ↓
syncArchiveFromTriketon()
        ↓
mpathy:archive:* aktualisiert
        ↓
UI rendert neu
```

❗️**Kein Reload notwendig**, wenn Events korrekt feuern.

---

## 8. Chat-Lebenszyklus

### Neuer Chat

* `mpathy:chat:chain_id` gelöscht
* nächste Nachricht erzeugt **neue `chain_id`**
* Archive erzeugt **neuen chat_id**

### Fortgesetzter Chat

* gleiche `chain_id`
* Archive erweitert bestehenden Chat

---

## 9. Warum User-Only Nachrichten im Archiv nicht erscheinen

**Absichtlich.**

Ein Archiv-Eintrag repräsentiert **einen Dialog**, nicht einen Monolog.

* User-Anchor allein ⇒ **kein Pair**
* kein Pair ⇒ **kein sichtbarer Archiv-Eintrag**

Das schützt:

* semantische Klarheit
* UI-Erwartungen
* spätere Kontext-Injection

---

## 10. Was das Archiv explizit NICHT ist

❌ kein Ledger
❌ kein Backup
❌ kein Cache
❌ kein State-Manager
❌ kein Ort für Logik

---

## 11. Erweiterung & Maintenance-Leitlinien

Wenn du etwas ändern willst:

1. **Willst du Wahrheit ändern?**
   → ❌ falsche Stelle

2. **Willst du Darstellung ändern?**
   → Archive oder UI

3. **Willst du Live-Updates?**
   → Events, nicht Reloads

4. **Siehst du Inkonsistenz?**
   → Triketon prüfen, nicht Archive patchen

---

## 12. Übergabe-Protokoll (Future-Proof)

Um dieses System **nahtlos** wieder aufzunehmen, reichen:

* dieses README
* `archiveProjection.ts`
* `archivePairProjection.ts`
* `storage.ts`
* Triketon-Write-Pfad (API)

Keine impliziten Annahmen notwendig.

---

## Status

**Archive v1: STABLE**

* deterministisch
* rebuildbar
* verifikations-kompatibel
* UI-ready

**Letzte geprüfte Invariante:**

> *Neuer Chat ⇒ neue chain_id ⇒ neuer Archiv-Chat*

---

Wenn du willst, gehe ich als Nächstes an:

* **UI-Contracts (Props, Events, States)**
* **Archive Overlay UX-Flow**
* **Live-Refresh ohne Reload (Event-Matrix)**
* **Future: Archive v2 (Streaming / Partial Projection)**

Sag einfach, wohin.
