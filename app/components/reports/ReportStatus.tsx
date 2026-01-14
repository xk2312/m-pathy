/* ======================================================================
   FILE INDEX — reportstatus.tsx
   ======================================================================

   ROLLE DER DATEI
   ----------------------------------------------------------------------
   UI-Komponente zur Anzeige des aktuellen Verifikationsstatus
   eines einzelnen Verification Reports.

   Diese Datei:
   - rendert KEINE Reports-Liste
   - entscheidet NICHT, ob Reports existieren
   - validiert einen bereits existierenden Report erneut
   - zeigt ausschließlich Status (loading / success / fail)

   ----------------------------------------------------------------------
   INPUT
   ----------------------------------------------------------------------
   Props:
     - report: VerificationReport
       (kanonische Report-Struktur aus lib/types)

   Abhängigkeiten:
     - useLanguage() → aktuelle Sprache
     - i18nArchive.overlay → UI-Texte
     - window.localStorage (read-only)

   ----------------------------------------------------------------------
   INTERNE HILFSTYPEN
   ----------------------------------------------------------------------
   TriketonAnchor
     - truth_hash?: unknown
     - public_key?: unknown

   VerifyResponse
     - result?: 'TRUE' | 'FALSE'

   ----------------------------------------------------------------------
   TEXT-AUFBAU FÜR VERIFY
   ----------------------------------------------------------------------
   buildVerifyText(report)
     - bevorzugt:
         report.content.canonical_text
     - Fallback:
         report.content.pairs[]
           → USER / ASSISTANT Inhalte
           → deterministische Join-Struktur
     - Leerer Text → Verify wird als false gewertet

   ----------------------------------------------------------------------
   VERIFIKATIONS-ABLAUF (CLIENTSEITIG)
   ----------------------------------------------------------------------
   useEffect([report])

   Ablauf:
     1) Ermittelt truthHash aus report.truth_hash
     2) Baut pairText via buildVerifyText()
     3) Bestimmt publicKey:
         a) report.public_key (bevorzugt)
         b) Fallback: Lookup im Ledger
            - LocalStorage Key: 'mpathy:triketon:v1'
            - Match auf truth_hash
     4) Abbruch, wenn:
         - kein publicKey
         - kein pairText
     5) POST /api/triketon/verify
         Body:
           - publicKey
           - truthHash
           - text
     6) Ergebnis:
         - TRUE  → verified = true
         - FALSE → verified = false
         - Error → verified = false

   ----------------------------------------------------------------------
   STATE
   ----------------------------------------------------------------------
   verified: boolean | null
     - null   → loading
     - true   → verified success
     - false  → verify failed / nicht prüfbar

   cancelled-Flag:
     - verhindert State-Updates nach Unmount

   ----------------------------------------------------------------------
   RENDERING
   ----------------------------------------------------------------------
   - verified === null
       → Ladeanzeige (t.loading)
   - verified === true
       → Erfolg (🟢, t.success, t.verifyChat)
   - verified === false
       → Fehlanzeige (⚪︎, t.fail)

   ----------------------------------------------------------------------
   RELEVANZ FÜR REPORTS-PROBLEM
   ----------------------------------------------------------------------
   - Diese Datei beeinflusst NICHT:
       • ob Reports geladen werden
       • ob Reports sichtbar sind
       • aus welchem Storage Reports kommen
   - Sie setzt voraus:
       • report.truth_hash existiert
       • report.public_key existiert oder im Ledger auffindbar ist
   - Fehler hier würden sich als falscher Status zeigen,
     nicht als „No reports“.

   ----------------------------------------------------------------------
   AUSSCHLUSS
   ----------------------------------------------------------------------
   ❌ Kein Schreiben in LocalStorage
   ❌ Kein Event-Dispatch
   ❌ Keine Listenlogik
   ❌ Kein Mode-Switch

   ====================================================================== */


'use client'

import React, { useEffect, useState } from 'react'
import type { VerificationReport } from '@/lib/types'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'

interface ReportStatusProps {
  report: VerificationReport
}

type TriketonAnchor = {
  truth_hash?: unknown
  public_key?: unknown
}

type VerifyResponse = {
  result?: 'TRUE' | 'FALSE'
}

function buildVerifyText(report: VerificationReport): string {
  const canonical = report.content?.canonical_text
  if (typeof canonical === 'string' && canonical.trim().length > 0) return canonical

  const pairs = report.content?.pairs
  if (!Array.isArray(pairs) || pairs.length === 0) return ''

  return pairs
    .map((p) => {
      const u = p?.user?.content ?? ''
      const a = p?.assistant?.content ?? ''
      return u + '\n\n---\n\n' + a
    })
    .join('\n\n====\n\n')
}

export default function ReportStatus({ report }: ReportStatusProps) {
  const { lang } = useLanguage()
  const t =
    i18nArchive[lang as keyof typeof i18nArchive]?.overlay ||
    i18nArchive.en.overlay

  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    async function verify() {
      try {
        const truthHash = report.truth_hash
        const pairText = buildVerifyText(report)

        // Prefer report.public_key (canonical), fallback to ledger lookup
        let publicKey: string | null =
          typeof report.public_key === 'string' && report.public_key.length > 0
            ? report.public_key
            : null

        if (!publicKey) {
          const raw = window.localStorage.getItem('mpathy:triketon:v1')
          const anchors: TriketonAnchor[] = raw ? JSON.parse(raw) : []
          const hit = anchors.find(
            (a) => typeof a?.truth_hash === 'string' && a.truth_hash === truthHash,
          )
          publicKey =
            hit && typeof hit.public_key === 'string' ? hit.public_key : null
        }

        if (!publicKey || !pairText) {
          if (!cancelled) setVerified(false)
          return
        }

        const res = await fetch('/api/triketon/verify', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            publicKey,
            truthHash,
            text: pairText,
          }),
        })

        const data = (await res.json()) as VerifyResponse
        const ok = res.ok && data?.result === 'TRUE'
        if (!cancelled) setVerified(ok)
      } catch {
        if (!cancelled) setVerified(false)
      }
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [report])

  return (
    <div className="flex items-center gap-2 text-sm mt-2">
      {verified === null && (
        <span className="text-muted animate-pulse">{t.loading}</span>
      )}
      {verified === true && (
        <span className="text-cyan-400 font-medium">
          🟢 {t.success} ({t.verifyChat})
        </span>
      )}
      {verified === false && (
        <span className="text-secondary font-medium">⚪︎ {t.fail}</span>
      )}
    </div>
  )
}
