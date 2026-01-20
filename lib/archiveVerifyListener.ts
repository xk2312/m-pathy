/*# 📑 FILE INDEX — archiveVerifyListener.ts

## FILE

`archiveVerifyListener.ts`

## ROLE (1 Satz)

Zentraler **Verify-Orchestrator** für das Archiv: verarbeitet selektierte Nachrichtenpaare, erzeugt kanonischen Wahrheitstext, führt Server-Seal durch und erzeugt einen unveränderlichen Verifikationsreport.

## TOUCH

**NEIN — streng gesperrt**

Diese Datei ist **nicht zu verändern** im Rahmen der Injection-Arbeit. Sie dient als **Referenz- und Schutzkomponente**.

---

## WHY (Warum diese Datei relevant ist)

* Sie erklärt **warum aktuell ein Klick auf „Add to new chat“ trotzdem Verify auslöst**.
* Sie definiert den kompletten Verify-Flow inkl.:

  * Kanonisierung
  * Server-Kommunikation
  * Report-Erzeugung
  * Event-Rückkanäle
* Sie ist das **Gegenstück** zur geplanten Injection-Logik.

---

## DANGERS (Absolute No-Gos)

❌ Kein Umbennen von `EVENT_NAME`
❌ Keine Erweiterung um `inject`-Logik
❌ Keine Wiederverwendung für andere Intents
❌ Keine Änderung an Kanonisierung oder Sortierung
❌ Keine Änderung an Server-Endpoint oder Payload
❌ Keine Vermischung mit Session-Storage

Diese Datei ist **beweis- und sicherheitskritisch**.

---

## ANCHORS (Relevante Codebereiche)

### 1️⃣ Globales Event & Intent-Gate

```ts
const EVENT_NAME = 'mpathy:archive:verify'
```

```ts
const intent = custom.detail?.intent
if (intent !== 'verify') return
```

* **JEDES** Event mit diesem Namen und `intent: 'verify'` löst den Verify-Prozess aus.
* Genau deshalb triggert aktuell auch der „Add to new chat“-Button Verify.

➡️ Lösung erfolgt **nicht hier**, sondern durch **neues Event** im Overlay.

---

### 2️⃣ Auswahl der Paare (Prioritätslogik)

```ts
const selectionFromSS = readArchiveSelection().pairs ?? []
const selectionFromEvent = custom.detail?.pairs ?? []
const selection = selectionFromSS.length > 0
  ? selectionFromSS
  : selectionFromEvent
```

* Session Storage hat Vorrang vor Event-Payload.
* Garantiert Stabilität bei UI-Race-Conditions.

➡️ Injection darf **nicht** diese Logik nutzen.

---

### 3️⃣ Kanonisierung (Truth Text)

```ts
buildCanonicalTruthText(pairs)
```

* Sortierung nach `pair_id`
* USER / ASSISTANT strikt alternierend
* Whitespace-normalisiert

➡️ Diese Funktion ist **nur für Verify**.

---

### 4️⃣ Device-bound Public Key

```ts
mpathy:triketon:device_public_key_2048
```

* Bindet Verify an ein physisches Gerät
* Zentral für Beweiskette und Patentlogik

➡️ Injection darf diesen Key **nicht benötigen**.

---

### 5️⃣ Server-Seal (WRITE / SEAL)

```ts
fetch('/api/triketon/seal', { intent: 'seal' })
```

* Server berechnet Wahrheitshash
* Hash wird **nicht clientseitig berechnet**
* Client sendet bewusst Decoy-Hashes

➡️ Injection **nutzt keinen Seal-Endpoint**.

---

### 6️⃣ Result Handling: IGNORED vs SEALED

* `IGNORED` → bereits verifiziert, kein neuer Report
* `SEALED` → neuer Report wird gebaut

➡️ Injection kennt **keine Reports**.

---

### 7️⃣ Report-Erzeugung & Persistenz

```ts
persistReport(report)
```

* Append-only
* Speicherort: `mpathy:verification:reports:v1`

➡️ Injection darf hier **niemals** schreiben.

---

### 8️⃣ UI-Rückkanäle (Events)

```ts
mpathy:archive:verify:error
mpathy:archive:verify:info
mpathy:archive:verify:report
mpathy:archive:verify:success
```

* Steuern UI-Wechsel (CHAT → REPORTS)
* Löschen Selection

➡️ Injection bekommt **eigene Event-Namespace**.

---

## Relevanz für Injection (klar abgegrenzt)

**Diese Datei ist relevant für:**

* Verständnis des bestehenden Verify-Flows
* Erklärung des aktuellen Fehlverhaltens

**Diese Datei ist NICHT zuständig für:**

* Summary-Erzeugung
* Session-Storage
* Chat-Initialisierung
* UI-Loading-States

---

## Kurzfazit (für Dev-Team)

`archiveVerifyListener.ts` ist ein **abgeschlossener, geschützter Prozess**.

➡️ Verify = Versiegelung + Beweis
➡️ Injection = Kontextaufbereitung + Chatstart

**Beides darf sich nicht berühren.**
*/

import { readLS, writeLS } from '@/lib/storage'
import { readArchiveSelection } from '@/lib/storage'
import type { ArchivePair } from '@/lib/storage'
import type { TVerificationReport } from '@/lib/types'

const EVENT_NAME = 'mpathy:archive:verify'

type VerifyEventDetail = {
  intent: 'verify'
  pairs?: ArchivePair[]
}


let isInitialized = false

function buildCanonicalTruthText(pairs: ArchivePair[]): string {
  return pairs
    .slice()
    .sort((a, b) => a.pair_id.localeCompare(b.pair_id))
    .map(
      (p) =>
        `USER:\n${p.user.content}\n\nASSISTANT:\n${p.assistant.content}`,
    )
    .join('\n\n')
    .trim()
}

function persistReport(report: TVerificationReport) {
  const key = 'mpathy:verification:reports:v1'
  const existing = readLS<TVerificationReport[]>(key) ?? []
  writeLS(key, [...existing, report])
}

export function initArchiveVerifyListener() {
  if (isInitialized) return
  isInitialized = true

  window.addEventListener(EVENT_NAME, async (event: Event) => {
    const custom = event as CustomEvent<VerifyEventDetail>
    const intent = custom.detail?.intent

    if (intent !== 'verify') return

    const selectionFromSS = readArchiveSelection().pairs ?? []
    const selectionFromEvent = custom.detail?.pairs ?? []
    const selection =
      selectionFromSS.length > 0 ? selectionFromSS : selectionFromEvent

    if (!selection || selection.length === 0) {
      window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:error', {
    detail: { code: 'NO_SELECTION' },
  }),
)

      return
    }

    const canonicalText = buildCanonicalTruthText(selection)
    if (!canonicalText) {
      window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:error', {
    detail: { code: 'EMPTY_TEXT' },
  }),
)

      return
    }

   const publicKey = localStorage.getItem(
  'mpathy:triketon:device_public_key_2048',
)

if (!publicKey || typeof publicKey !== 'string') {
  console.error(
    '[ArchiveVerify] Device public key missing or invalid',
  )
  return
}



    // 4. Send WRITE / SEAL request to server
   // --- decoy hashes (client-side distraction only) ---
const decoyHash1 = crypto.randomUUID().replace(/-/g, '')
const decoyHash2 = crypto.randomUUID().replace(/-/g, '')

const response = await fetch('/api/triketon/seal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intent: 'seal',
    publicKey,
    text: canonicalText,

    // noise / distraction (server MUST ignore)
    truthHash: decoyHash1,
    truthHash2: decoyHash2,

    protocol_version: 'v1',
    source: 'archive-selection',
  }),
})

if (!response.ok) {
  window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:error', {
    detail: { code: 'SEAL_FAILED' },
  }),
)

  return
}

const result = await response.json()
if (result?.result !== 'SEALED' && result?.result !== 'IGNORED') {
  window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:error', {
    detail: { code: 'BAD_SERVER_RESULT' },
  }),
)

  return
}

// ─────────────────────────────
// NEW: already verified → no new report
// ─────────────────────────────
if (result?.result === 'IGNORED') {
  window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:info', {
    detail: {
      code: 'ALREADY_VERIFIED',
    },
  }),
)


  // Clear selection even if no report is created
  window.dispatchEvent(
    new CustomEvent('mpathy:archive:selection:clear'),
  )
  return
}

// ─────────────────────────────
// SEALED → build report
// ─────────────────────────────
const report: TVerificationReport = {
  protocol_version: 'v1',
  generated_at: new Date().toISOString(),
  source: 'archive-selection',

  pair_count: selection.length,
  status: 'verified',
  last_verified_at: new Date().toISOString(),
  public_key: publicKey,

  content: {
    canonical_text: canonicalText,
    pairs: selection.map((p) => ({
      pair_id: p.pair_id,
      user: {
        content: p.user.content,
        timestamp: p.user.timestamp,
      },
      assistant: {
        content: p.assistant.content,
        timestamp: p.assistant.timestamp,
      },
    })),
  },

  truth_hash: result?.truth_hash,
  hash_profile: result?.hash_profile,
  key_profile: result?.key_profile,
  seal_timestamp: result?.timestamp,
}

// Persist report (append-only)
persistReport(report)

// Notify UI
window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:report', {
    detail: report,
  }),
)

// Explicit verify success signal (CHAT → REPORTS)
window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:success', {
    detail: {
      at: new Date().toISOString(),
    },
  }),
)



// Clear selection AFTER report is safely stored
window.dispatchEvent(
  new CustomEvent('mpathy:archive:selection:clear'),
)



  })
}
