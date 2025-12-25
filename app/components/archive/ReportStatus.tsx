// components/archive/ReportStatus.tsx
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Triketon Integration B — Live Report Sync + Status Badges

'use client'

import React, { useEffect, useState } from 'react'
import { runTriketonSync } from '@/lib/triketonSync'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'

interface ReportStatusProps {
  text: string
  truthHash: string
}

/**
 * Zeigt Live-Verifikationsstatus (lokal ↔ Server)
 */
export default function ReportStatus({ text, truthHash }: ReportStatusProps) {
  const { lang } = useLanguage()
  const t =
    i18nArchive[lang as keyof typeof i18nArchive]?.overlay ||
    i18nArchive.en.overlay
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    async function verify() {
      const ok = await runTriketonSync(text)
      if (!cancelled) setVerified(ok)
    }
    verify()
    return () => {
      cancelled = true
    }
  }, [text, truthHash])

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
        <span className="text-secondary font-medium">
          ⚪︎ {t.fail} (Local only)
        </span>
      )}
    </div>
  )
}
