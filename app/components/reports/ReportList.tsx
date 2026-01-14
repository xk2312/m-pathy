/* ======================================================================
   FILE INDEX — components/archive/ReportList.tsx
   ======================================================================

   ROLLE DER DATEI
   ----------------------------------------------------------------------
   Diese Datei rendert die LISTE der Verification Reports im REPORTS-Modus.
   Sie ist der letzte Schritt im Pfad:
     LocalStorage → loadReports() → React State → UI

   Sie entscheidet:
   - ob Reports angezeigt werden
   - ob "No reports" angezeigt wird
   - welcher Report ausgewählt ist
   - welche Aktionen (View / Delete / Download) möglich sind

   ----------------------------------------------------------------------
   IMPORTS / ABHÄNGIGKEITEN
   ----------------------------------------------------------------------
   - loadReports(), deleteReport(), getReport()
       aus lib/verificationStorage
   - VerificationReport / VerificationReportLegacy
       aus lib/types
   - downloadVerificationReport()
       aus lib/verificationReport
   - useLanguage() / i18nArchive
       für UI-Texte
   - ReportStatus
       für Einzel-Verify-Anzeige

   ----------------------------------------------------------------------
   STATE
   ----------------------------------------------------------------------
   reports: VerificationReport[]
     - initial: []
     - Quelle: loadReports()

   selected: string | null
     - truth_hash des ausgewählten Reports
     - steuert Detail-Overlay

   ----------------------------------------------------------------------
   LADELOGIK (REPORT READ)
   ----------------------------------------------------------------------
   useEffect([]):
     - wird EINMAL beim Mount ausgeführt
     - ruft readReports() auf
       → setReports(loadReports())

     - registriert Event-Listener:
         'mpathy:archive:verify:success'
       → readReports()

     - deregistriert Listener beim Unmount

   Es gibt:
     - KEIN Reload bei Mode-Wechsel
     - KEIN Reload bei Sichtbarkeits-Toggle
     - KEIN Reload bei Storage-Änderung ohne Event

   ----------------------------------------------------------------------
   DELETE-PFAD
   ----------------------------------------------------------------------
   handleDelete(hash):
     - deleteReport(hash)
     - setReports(loadReports())
     - setSelected(null)

   ----------------------------------------------------------------------
   DOWNLOAD-PFAD
   ----------------------------------------------------------------------
   handleDownload(hash):
     - getReport(hash)
     - adaptiert VerificationReport → Legacy-Shape
     - ruft downloadVerificationReport()

   ----------------------------------------------------------------------
   RENDER-LOGIK
   ----------------------------------------------------------------------
   Header:
     - Titel aus i18nArchive.report.title

   Leerzustand:
     - Wenn reports.length === 0
       → Anzeige von t.noReports
       → KEINE weitere Bedingung

   Listenansicht:
     - reports wird:
         • kopiert
         • nach last_verified_at / generated_at sortiert
     - jedes Element:
         • Card mit truth_hash als key
         • Klick setzt selected = truth_hash

   Detail-Overlay:
     - erscheint, wenn selectedReport !== null
     - zeigt:
         • JSON-Dump des Reports
         • <ReportStatus report={selectedReport}>
         • Aktionen: View / Invalid / Close

   ----------------------------------------------------------------------
   KRITISCHE BEOBACHTUNGEN (OHNE WERTUNG)
   ----------------------------------------------------------------------
   - "No reports" erscheint ausschließlich,
     wenn reports.length === 0 ist.
   - Es existiert KEIN Hardcode, der Reports unterdrückt.
   - Sichtbarkeit hängt ausschließlich davon ab,
     ob loadReports() ein nicht-leeres Array liefert.
   - Die Datei kennt KEINEN Archive-Mode (chat / reports).

   ----------------------------------------------------------------------
   AUSSCHLUSS
   ----------------------------------------------------------------------
   ❌ Kein Schreiben neuer Reports
   ❌ Kein Verify-Flow
   ❌ Kein Mode-Switch
   ❌ Kein eigener Storage-Zugriff

   ====================================================================== */

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

      <div className="flex flex-col gap-2 overflow-y-auto">
        {[...reports]
          .sort((a, b) => {
            const ta = Date.parse(a.last_verified_at ?? a.generated_at)
            const tb = Date.parse(b.last_verified_at ?? b.generated_at)
            return tb - ta
          })
          .map((r, i) => {
            if (!r) return null

            return (
              <Card
                key={r.truth_hash || `report-${i}`}
                onClick={() => setSelected(r.truth_hash || `report-${i}`)}
                className="bg-surface1 border-border-soft cursor-pointer hover:border-cyan-500/60"
              >

                <CardContent className="p-4 flex flex-col gap-3 rounded-xl bg-surface1">
  <div
    className="flex justify-between items-center cursor-pointer"
    onClick={() =>
      setSelected(selected === (r.public_key || `report-${i}`) ? null : r.public_key || `report-${i}`)
    }
  >
    <div>
      <div className="text-sm text-text-primary">
        Verified · [Last verified:{' '}
        {new Date(r.last_verified_at ?? r.generated_at).toLocaleString()}]
      </div>
      <div className="text-xs text-text-secondary">
        {r.pair_count} message pairs · Source: Archive Selection
      </div>
    </div>
    <span className="text-cyan-400 text-sm">
      {selected === (r.public_key || `report-${i}`) ? '▲' : '▼'}
    </span>
  </div>

  {selected === (r.public_key || `report-${i}`) && (
    <div className="mt-3 bg-surface2 rounded-md p-3 border border-border-soft">
      <pre className="text-xs max-h-48 overflow-y-auto whitespace-pre-wrap">
        {JSON.stringify(r, null, 2)}
      </pre>

      <div className="mt-2">
        <ReportStatus report={r} />
      </div>

      <div className="flex justify-end gap-3 mt-3">
        <Button
          variant="ghost"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('mpathy:archive:verify', {
                detail: { intent: 'reverify', payload: { public_key: r.public_key, content: r.content } },
              })
            )
          }
        >
          Re-Verify
        </Button>

        <Button onClick={() => handleDownload(r.public_key || '')}>
          {t.view}
        </Button>

        <Button variant="solid" onClick={() => handleDelete(r.public_key || '')}>
          {t.invalid}
        </Button>
      </div>
    </div>
  )}
</CardContent>

              </Card>
            )
          })}
      </div>

      {selectedReport && selectedReport.truth_hash && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-surface1 rounded-xl p-6 w-[90%] max-w-xl shadow-xl border border-border-soft">
            <h3 className="text-lg font-semibold mb-2">{t.subtitle}</h3>

            <pre className="text-xs bg-surface2 p-3 rounded-md max-h-64 overflow-y-auto">
              {JSON.stringify(selectedReport, null, 2)}
            </pre>

            <ReportStatus report={selectedReport} />

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={() => handleDownload(selectedReport.truth_hash)}>
                {t.view}
              </Button>

              <Button
                variant="solid"
                onClick={() => handleDelete(selectedReport.truth_hash)}
              >
                {t.invalid}
              </Button>

              <Button variant="ghost" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
