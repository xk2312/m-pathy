
/*# 📑 FILE INDEX - ReportList.tsx

## FILE

`ReportList.tsx`

## ROLE (1 Satz)

UI-Komponente für den **REPORTS-Modus** des Archivs: listet Verifikationsreports, ermöglicht Einsehen, Export und Löschung, reagiert auf Verify-Events.

## TOUCH

**NEIN - streng gesperrt**

Diese Datei darf im Rahmen der Injection-Implementierung **nicht verändert** werden.

---

## WHY (Warum diese Datei relevant ist)

* Stellt die **sichtbare Oberfläche der Beweiskette** dar.
* Reagiert ausschließlich auf **Verify-Ergebnisse**.
* Macht klar, dass Injection **keinen Einfluss** auf Reports hat.
* Dient als Abgrenzung zwischen:

  * Kontext-Vorbereitung (Injection)
  * Kryptografischer Versiegelung (Verify)

---

## DANGERS (Absolute No-Gos)

❌ Keine Injection-Logik hier ergänzen
❌ Keine neuen Event-Listener für Injection hinzufügen
❌ Keine SessionStorage- oder Context-Daten hier lesen
❌ Keine automatische Report-Erzeugung triggern
❌ Keine Anpassung der Report-Struktur oder -Texte

Diese Datei ist **audit- und beweisrelevant**.

---

## ANCHORS (Relevante Codebereiche)

### 1️⃣ Laden der Reports

```ts
const data = loadReports()
```

* Quelle: `verificationStorage.ts`
* Read-only Zugriff
* Wird ausgelöst:

  * beim Mount
  * bei `mpathy:archive:verify:success`
  * bei `mpathy:archive:reports:refresh`

➡️ Injection darf **keinen dieser Events dispatchen**.

---

### 2️⃣ Verify-Success Listener

```ts
window.addEventListener('mpathy:archive:verify:success', onVerify)
```

* Triggert Re-Read der Reports
* Signalisiert abgeschlossene Versiegelung

➡️ Injection nutzt **eigenen Namespace**.

---

### 3️⃣ Report-Auswahl (UI-State)

```ts
const [selected, setSelected]
```

* Steuert Auf-/Zuklappen einzelner Reports
* Rein UI-intern

➡️ Nicht systemrelevant.

---

### 4️⃣ Report-Export (Text)

```ts
exportReportAsText(r)
```

* Erstellt menschenlesbare Textfassung
* Enthält:

  * Status
  * Hash
  * Public Key
  * Content
  * Legal/IP-Hinweise

➡️ Rein lesend, kein Einfluss auf Injection.

---

### 5️⃣ Report-Löschung

```ts
deleteReport(hash)
```

* User-getriggerte Aktion
* Entfernt Report aus LocalStorage

➡️ Injection darf hier **niemals** eingreifen.

---

### 6️⃣ Sortierung & Anzeige

* Sortiert nach `last_verified_at` / `generated_at`
* Expand/Collapse UI

➡️ Präsentationslogik.

---

## Relevanz für Injection (klar abgegrenzt)

**Diese Datei ist relevant für:**

* Verständnis, wo Verify-Ergebnisse sichtbar werden
* Abgrenzung: Verify = Reports, Injection = Chat

**Diese Datei ist NICHT zuständig für:**

* Summary-Erzeugung
* Session Storage
* Chat-Initialisierung
* Token-Abbuchung

---

## Kurzfazit (für Dev-Team)

`ReportList.tsx` ist ein **reiner Report-Viewer**.

➡️ Alles hier basiert auf **Verify**.
➡️ Injection hat hier **keinen Berührungspunkt**.

**Nicht anfassen.**
 */

'use client'

import React, { useState } from 'react'
import { loadReports, deleteReport, getReport } from '@/lib/verificationStorage'
import type { VerificationReport, VerificationReportLegacy } from '@/lib/types'
import { downloadVerificationReport } from '@/lib/verificationReport'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ReportStatus from './ReportStatus'

export default function ReportList() {
  const { lang } = useLanguage()
  const t =
    i18nArchive[lang as keyof typeof i18nArchive]?.report ??
    i18nArchive.en.report

  const [reports, setReports] = useState<VerificationReport[]>([])

  React.useEffect(() => {
    const readReports = (source?: string) => {
      try {
        const data = loadReports()
        console.log('[ReportList] 🔍 readReports triggered from →', source ?? 'mount')
        console.log('[ReportList] 📦 loadReports() returned', Array.isArray(data) ? data.length : 'non-array', 'items')
        setReports(data)
      } catch (err) {
        console.error('[ReportList] ❌ loadReports failed', err)
        setReports([])
      }
    }

    // Initial read on mount
    readReports('mount')

    // Re-read after successful verify
    const onVerify = () => readReports('verify:success')
    window.addEventListener('mpathy:archive:verify:success', onVerify)

    // Re-read when ArchiveOverlay dispatches refresh event
    const onRefresh = () => readReports('reports:refresh')
    window.addEventListener('mpathy:archive:reports:refresh', onRefresh)

    return () => {
      window.removeEventListener('mpathy:archive:verify:success', onVerify)
      window.removeEventListener('mpathy:archive:reports:refresh', onRefresh)
    }
  }, [])

  const [selected, setSelected] = useState<string | null>(null)

  const handleDelete = (hash: string) => {
    deleteReport(hash)
    setReports(loadReports())
    setSelected(null)
  }

  const handleDownload = (hash: string) => {
    const r = getReport(hash)
    if (!r) return

    // Adapter: keep downloadVerificationReport() backwards compatible
    const legacy: VerificationReportLegacy = {
      version: r.protocol_version,
      generatedAt: r.generated_at,
      truthHash: r.truth_hash,
      entriesCount: r.pair_count,
      lastVerifiedAt: r.last_verified_at,
      publicKey: r.public_key,
      status: r.status,
      source: r.source,
      content: r.content,
      verification_chain: r.verification_chain,
      chain_signature: r.chain_signature,
    }

    downloadVerificationReport(legacy as any)
  }

  const selectedReport: VerificationReport | null =
    selected !== null ? getReport(selected) : null

  return (
    <div className="p-4 flex flex-col gap-4 text-primary">
      <h2 className="text-lg font-medium">{t.title}</h2>

      {reports.length === 0 && (
        <div className="text-sm text-muted">{t.noReports}</div>
      )}

      <div className="flex flex-col gap-3 overflow-y-auto">
        {[...reports]
          .sort((a, b) => {
            const ta = Date.parse(a.last_verified_at ?? a.generated_at)
            const tb = Date.parse(b.last_verified_at ?? b.generated_at)
            return tb - ta
          })
         .map((r, i) => {
  if (!r) return null
  const reportId = r.public_key ?? `report-${i}`

const selectedReport: VerificationReport | null =
  selected !== null ? getReport(selected) : null

function exportReportAsText(r: VerificationReport) {
  const lines: string[] = []

  lines.push('VERIFICATION REPORT - m-pathy.ai')
  lines.push('=================================')
  lines.push('')
  lines.push('This report was generated on m-pathy.ai.')
  lines.push('')
  lines.push(
    'The contents of this report were created, displayed, and cryptographically sealed on the m-pathy.ai platform at the time indicated.'
  )
  lines.push(
    'The sealing process includes a cryptographically strong content hash (e.g. SHA-256–class),'
  )
  lines.push(
    'a public-key–based identifier, and timestamped metadata generated at the time of creation.'
  )
  lines.push('')
  lines.push(
    'm-pathy.ai can technically confirm whether this report originates from its platform,'
  )
  lines.push(
    'whether the contents match the originally sealed version, and whether the reported'
  )
  lines.push(
    'timestamp and cryptographic identifiers are authentic.'
  )
  lines.push('')
  lines.push(
    'Any modification of the content after sealing will result in a hash mismatch and can be detected.'
  )
  lines.push('')
  lines.push('LEGAL & IP NOTICE')
  lines.push('-----------------')
  lines.push(
    'This report may serve as supporting evidence in intellectual property, authorship,'
  )
  lines.push(
    'priority, or related disputes. In the event of legal or judicial proceedings,'
  )
  lines.push(
    'parties may contact m-pathy.ai to request verification of this report’s authenticity'
  )
  lines.push('and integrity.')
  lines.push('')
  lines.push(
    'This verification does not constitute a legal judgment and does not guarantee a specific legal outcome.'
  )
  lines.push(
    'However, it may significantly strengthen evidentiary value by providing a verifiable'
  )
  lines.push(
    'record of authorship, content integrity, and temporal existence.'
  )
  lines.push('')
  lines.push(
    'Final legal assessment remains the responsibility of the competent court or authority.'
  )
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push(`Status: ${r.status}`)
  lines.push(`Source: ${r.source}`)
  lines.push(`Protocol: ${r.protocol_version}`)
  lines.push('')
  lines.push(`Generated At: ${r.generated_at}`)
  if (r.last_verified_at) {
    lines.push(`Last Verified At: ${r.last_verified_at}`)
  }
  lines.push('')
  lines.push(`Message Pairs: ${r.pair_count}`)
  if (r.truth_hash) {
    lines.push(`Content Hash: ${r.truth_hash}`)
  }
  lines.push(`Public Key: ${r.public_key}`)
  lines.push('')
  lines.push('CONTENT')
  lines.push('-------')
  lines.push(JSON.stringify(r.content, null, 2))

  const blob = new Blob([lines.join('\n')], {
    type: 'text/plain;charset=utf-8',
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `verification-report_${r.public_key}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

  return (

             <div

  key={reportId}

  className="
    bg-surface1
    rounded-xl
    p-[16px]
    mb-[20px]
    cursor-pointer
    transition-colors
    group
  "
>

  {/* HEADER */}
  <div
  className="flex justify-between items-center px-[16px] py-[12px]"
  onClick={() =>
    setSelected(
selected === reportId
        ? null
        : r.public_key || `report-${i}`
    )
  }
>

    <div className="flex flex-col gap-1">
      <div className="text-sm text-text-primary">
  {t.statusVerified} · [{t.lastVerified}:{' '}
  {new Date(r.last_verified_at ?? r.generated_at).toLocaleString()}]
</div>

     <div className="text-xs text-text-secondary">
  {t.messagePairs.replace('{{count}}', String(r.pair_count))} · {t.source}: {t.sourceArchiveSelection}
</div>

    </div>

    <span className="text-cyan-400 text-sm">
      {selected === (r.public_key || `report-${i}`) ? '▲' : '▼'}
    </span>
  </div>

  {/* BODY */}
  {selected === (r.public_key || `report-${i}`) && (
    <div className="mt-4 bg-surface2 rounded-md p-4">
      <pre className="text-xs max-h-48 overflow-y-auto whitespace-pre-wrap">
        {JSON.stringify(r, null, 2)}
      </pre>

      <div className="mt-3">
        <ReportStatus report={r} />
      </div>

      <div className="flex justify-end gap-3 mt-4">
  <Button
  onClick={() => exportReportAsText(r)}
  className="
    !bg-cyan-500
    !text-black
    !px-[5px]
    !py-[7px]
    rounded-md
    hover:!bg-cyan-400
    cursor-pointer
    transition-colors
  "
>
  {t.export}
</Button>


  <Button
  onClick={() => setSelected(null)}
  className="
    !bg-transparent
    hover:!bg-transparent
    !text-white
    hover:!text-gray-300
    !px-[5px]
    !py-[7px]
    cursor-pointer
    transition-colors
  "
>
  {t.close}
</Button>

</div>


    </div>
  )}
</div>

            )
          })}
      </div>
    </div>
  )
}
