// components/archive/ReportList.tsx
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Report Viewer Overlay – local re-check & detail view

'use client'

import React, { useState } from 'react'
import { loadReports, deleteReport, getReport } from '@/lib/verificationStorage'
import { downloadVerificationReport } from '@/lib/verificationReport'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function ReportList() {
  const { lang } = useLanguage()
  const t = i18nArchive[lang as keyof typeof i18nArchive]?.report || i18nArchive.en.report
  const [reports, setReports] = useState(loadReports())
  const [selected, setSelected] = useState<string | null>(null)

  const handleDelete = (hash: string) => {
    deleteReport(hash)
    setReports(loadReports())
  }

  const handleDownload = (hash: string) => {
    const r = getReport(hash)
    if (r) downloadVerificationReport(r)
  }

  const selectedReport = selected ? getReport(selected) : null

  return (
    <div className="p-4 flex flex-col gap-4 text-primary">
      <h2 className="text-lg font-medium">{t.title}</h2>

      {reports.length === 0 && <div className="text-sm text-muted">{t.noReports}</div>}

      <div className="flex flex-col gap-3 overflow-y-auto">
        {reports.map((r) => (
          <Card
            key={r.truthHash}
            onClick={() => setSelected(r.truthHash)}
            className="bg-surface1 border-border-soft cursor-pointer hover:border-cyan-500/60"
          >
            <CardContent className="p-3 flex flex-col gap-1">
              <div className="text-xs text-secondary">
                {new Date(r.generatedAt).toLocaleString()}
              </div>
              <div className="text-sm">
                {t.valid}: {r.chatLevel ? '✅' : '⚠️'} — {r.entriesCount} entries
              </div>
              <div className="text-xs text-muted">{r.truthHash}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-surface1 rounded-xl p-6 w-[90%] max-w-xl shadow-xl border border-border-soft">
            <h3 className="text-lg font-semibold mb-2">{t.subtitle}</h3>
            <pre className="text-xs bg-surface2 p-3 rounded-md max-h-64 overflow-y-auto">
              {JSON.stringify(selectedReport, null, 2)}
            </pre>
            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={() => handleDownload(selectedReport.truthHash)}>{t.view}</Button>
             <Button variant="solid" onClick={() => handleDelete(selectedReport.truthHash)}>
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
