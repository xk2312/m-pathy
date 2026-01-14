/**
 * ============================================================
 * ARCHIVE OVERLAY — NAVIGATION & POINTER INDEX
 * ============================================================
 *
 * CONTEXT
 * -------
 * This index documents all user-interactive navigation elements
 * inside the ARCHIVE overlay that require explicit pointer / cursor
 * affordance and predictable UX behavior.
 *
 * The ARCHIVE overlay is a MODE-BASED UI, not a route.
 * All navigation happens via local state + events.
 *
 * ------------------------------------------------------------
 * POINTER TARGETS (3)
 * ------------------------------------------------------------
 *
 * [A] MODE SWITCH: "CHAT"
 * ---------------------
 * Purpose:
 * - Switch Archive view to CHAT mode
 *
 * Expected UX:
 * - cursor: pointer
 * - immediate visual affordance
 *
 * Implementation pattern:
 * - onClick → setArchiveMode("chat")
 * - MUST NOT trigger overlay close
 *
 * Typical location:
 * - Archive header / mode switch section
 *
 *
 * [B] MODE SWITCH: "REPORTS"
 * -------------------------
 * Purpose:
 * - Switch Archive view to REPORTS mode
 *
 * Expected UX:
 * - cursor: pointer
 * - same affordance as CHAT (symmetry)
 *
 * Implementation pattern:
 * - onClick → setArchiveMode("reports")
 * - MUST NOT close Archive overlay
 * - Report data rendered by <ReportList />
 *
 * Related file:
 * - ReportList.tsx
 *
 * NOTE:
 * - Pointer is required even though content rendering
 *   happens in a different component.
 *
 *
 * [C] NAVIGATION: "← Back"
 * -----------------------
 * Purpose:
 * - Exit ARCHIVE overlay and return to Chat
 *
 * Expected UX:
 * - cursor: pointer
 * - clear affordance of navigation / exit
 *
 * Implementation pattern:
 * - onClick → dispatch close action
 *   e.g. window.dispatchEvent("mpathy:archive:close")
 *   OR local overlay close handler
 *
 * IMPORTANT:
 * - This is the ONLY element that closes the Archive overlay
 * - Must not interfere with CHAT / REPORTS switches
 *
 *
 * ------------------------------------------------------------
 * RELATION TO ReportList.tsx
 * ------------------------------------------------------------
 *
 * - ReportList.tsx is a CHILD view rendered ONLY when:
 *     archiveMode === "reports"
 *
 * - ReportList does NOT control navigation.
 * - Pointer logic for CHAT / REPORTS lives in Archive overlay,
 *   NOT inside ReportList.
 *
 * - Any missing pointer on REPORTS is a UI affordance issue,
 *   not a data or state issue.
 *
 *
 * ------------------------------------------------------------
 * DESIGN RULES (Point Zero)
 * ------------------------------------------------------------
 *
 * - CHAT / REPORTS:
 *     mode switch → pointer required → overlay stays open
 *
 * - ← Back:
 *     navigation action → pointer required → overlay closes
 *
 * - No routing assumptions
 * - No implicit navigation
 * - Overlay reacts ONLY to explicit user actions
 *
 * ============================================================
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

  lines.push('VERIFICATION REPORT — m-pathy.ai')
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
    Export Report
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
    Close
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
