// components/archive/ReportList.tsx
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Report Viewer Overlay – canonical report list + detail view

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

  const [reports, setReports] = useState<VerificationReport[]>(loadReports())
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
          .map((r) => {
            if (!r.truth_hash) return null

            return (
              <Card
                key={r.truth_hash}
                onClick={() => setSelected(r.truth_hash)}
                className="bg-surface1 border-border-soft cursor-pointer hover:border-cyan-500/60"
              >
                <CardContent className="p-3 flex flex-col gap-1">
                  <div className="text-sm text-text-primary">
                    Verified · [Last verified:{' '}
                    {new Date(r.last_verified_at ?? r.generated_at).toLocaleString()}
                    ]
                  </div>

                  <div className="text-xs text-text-secondary">
                    {r.pair_count} message pairs · Source: Archive Selection
                  </div>
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
