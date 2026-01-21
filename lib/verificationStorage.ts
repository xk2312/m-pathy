/*# 📑 FILE INDEX - verificationStorage.ts

## FILE

`verificationStorage.ts`

## ROLE (1 Satz)

Client-seitiger **Persistenz- und Normalisierungs-Layer** für Verifikationsreports: Laden, Speichern, Löschen und Rückwärtskompatibilität von Verify-Ergebnissen.

## TOUCH

**NEIN - strikt gesperrt**

Diese Datei darf im Rahmen der Injection-Implementierung **unter keinen Umständen verändert** werden.

---

## WHY (Warum diese Datei relevant ist)

* Sie definiert **was ein Verifikationsreport ist** und wie er strukturiert wird.
* Sie ist die **einzige Quelle** für Reports im REPORTS-Modus des Archivs.
* Sie bildet die Brücke zwischen:

  * alten (Legacy) Report-Formaten
  * dem aktuellen `TVerificationReport`-Schema
* Sie ist **Teil der formalen Beweiskette** (Audit-Trail).

---

## DANGERS (Absolute No-Gos)

❌ Keine Injection-Logik hier einbauen
❌ Keine SessionStorage-Zugriffe ergänzen
❌ Keine neuen Keys oder Report-Typen einführen
❌ Keine Summary- oder Kontextdaten hier speichern
❌ Keine Änderung an Normalisierung oder Legacy-Mapping
❌ Keine Vermischung von Verify- und Injection-Flows

Diese Datei ist **audit- und beweisrelevant**.

---

## ANCHORS (Relevante Codebereiche)

### 1️⃣ Storage-Key (Reports Namespace)

```ts
const KEY = 'mpathy:verification:reports:v1'
```

* Enthält **ausschließlich** Verifikationsreports
* Speicherort: `localStorage`
* Maximal 100 Reports (`slice(0, 100)`)

➡️ Injection darf diesen Namespace **niemals** nutzen.

---

### 2️⃣ Legacy-Report-Typ

```ts
type LegacyVerificationReport
```

* Unterstützt alte Felder:

  * `truthHash`
  * `generatedAt`
  * `entriesCount`
* Ermöglicht saubere Migration ohne Datenverlust

➡️ Nicht erweitern, nicht vereinfachen.

---

### 3️⃣ normalizeReport()

```ts
function normalizeReport(r)
```

* Zentraler Normalisierungspunkt
* Vereinheitlicht:

  * `truth_hash`
  * `public_key`
  * Timestamps
  * Status-Felder

➡️ Injection-Summary darf **hier nicht auftauchen**.

---

### 4️⃣ loadReports()

* Lädt Reports aus `localStorage`
* Defensive Guards gegen kaputte Daten
* Liefert **immer ein Array**

➡️ Read-only im Injection-Kontext.

---

### 5️⃣ saveReport()

* Append-only Verhalten (neueste zuerst)
* Duplikat-Guard via `truth_hash`

➡️ Nur vom Verify-Flow aufzurufen.

---

### 6️⃣ deleteReport()

* Entfernt Report anhand `truth_hash`
* UI-Aktion (User-getriggert)

➡️ Kein Systemprozess darf hier löschen.

---

### 7️⃣ getReport()

* Lookup eines einzelnen Reports
* Grundlage für Detailansichten

➡️ Injection irrelevant.

---

## Relevanz für Injection (klar abgegrenzt)

**Diese Datei ist relevant für:**

* Verständnis, wo Verify-Ergebnisse landen
* Abgrenzung: Verify (Beweis) vs. Injection (Kontext)

**Diese Datei ist NICHT zuständig für:**

* Summary-Erzeugung
* Session Storage
* Chat-Initialisierung
* Token-Abbuchung

---

## Kurzfazit (für Dev-Team)

`verificationStorage.ts` ist ein **reiner Verify-Speicher**.

➡️ Alles hier ist **Beweis**, nicht Vorbereitung.
➡️ Injection hat hier **nichts verloren**.

**Nicht anfassen. Nicht erweitern. Nicht refactoren.**
*/

import type { VerificationReport as TVerificationReport } from './types'
import { readLS, writeLS } from './storage'

const KEY = 'mpathy:verification:reports:v1'

type LegacyVerificationReport = {
  generatedAt: string
  truthHash: string
  entriesCount?: number
  lastVerifiedAt?: string
  publicKey: string
  status?: 'verified' | 'unverified'
  source?: 'archive-selection'
  content?: any
  verification_chain?: any
  chain_signature?: any
  [key: string]: any
}

function normalizeReport(
  r: LegacyVerificationReport | Partial<TVerificationReport>
): TVerificationReport {
  if ((r as any) && typeof (r as any).generated_at === 'string') {
    const rr = r as Partial<TVerificationReport>
    const anyR = r as any

    const truth_hash =
      typeof rr.truth_hash === 'string'
        ? rr.truth_hash
        : typeof anyR.truthHash === 'string'
          ? anyR.truthHash
          : (Array.isArray(anyR.content?.pairs) && anyR.content.pairs[0]?.truth_hash)
            ? anyR.content.pairs[0].truth_hash
            : ''

    const public_key =
      typeof rr.public_key === 'string'
        ? rr.public_key
        : typeof anyR.publicKey === 'string'
          ? anyR.publicKey
          : ''

    return {
      protocol_version: 'v1',
      generated_at:
        typeof rr.generated_at === 'string' ? rr.generated_at : new Date().toISOString(),
      last_verified_at:
        typeof rr.last_verified_at === 'string' ? rr.last_verified_at : undefined,
      pair_count:
        typeof rr.pair_count === 'number' ? rr.pair_count : 0,
      status:
        rr.status === 'verified' || rr.status === 'unverified' ? rr.status : 'unverified',
      source: 'archive-selection',
      public_key,
      truth_hash,
      hash_profile: rr.hash_profile,
      key_profile: rr.key_profile,
      seal_timestamp: rr.seal_timestamp,
      content: rr.content,
      chat_meta: rr.chat_meta,
      verification_chain: rr.verification_chain,
      chain_signature: rr.chain_signature,
      verified_true: rr.verified_true,
      verified_false: rr.verified_false,
    }
  }

  const legacy = r as LegacyVerificationReport

  return {
    protocol_version: 'v1',
    generated_at: legacy.generatedAt,
    last_verified_at: legacy.lastVerifiedAt,
    pair_count: typeof legacy.entriesCount === 'number' ? legacy.entriesCount : 0,
    status:
      legacy.status === 'verified' || legacy.status === 'unverified'
        ? legacy.status
        : 'unverified',
    source: 'archive-selection',
    public_key: legacy.publicKey,
    truth_hash: legacy.truthHash,
    content: legacy.content,
    verification_chain: legacy.verification_chain,
    chain_signature: legacy.chain_signature,
  }
}

export function loadReports(): TVerificationReport[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    const normalized = parsed.map(normalizeReport)
    console.log(`[ArchiveVerify] ✅ loaded ${normalized.length} reports`)
    return normalized
  } catch (err) {
    console.error('[ArchiveVerify] ❌ loadReports failed', err)
    return []
  }
}

export function saveReport(report: TVerificationReport): void {
  const all = loadReports()
  const exists = all.some((r) => r.truth_hash === report.truth_hash)
  if (!exists) {
    all.unshift(report)
    writeLS(KEY, all.slice(0, 100))
  }
}

export function deleteReport(hash: string): void {
  const all = loadReports().filter((r) => r.truth_hash !== hash)
  writeLS(KEY, all)
}

export function getReport(hash: string): TVerificationReport | null {
  return loadReports().find((r) => r.truth_hash === hash) || null
}
