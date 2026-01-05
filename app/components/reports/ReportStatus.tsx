'use client'

import React, { useEffect, useState } from 'react'
import { runTriketonSync } from '@/lib/triketonSync'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'

interface ReportStatusProps {
  userText: string
  assistantText: string
  truthHash: string
}

export default function ReportStatus({
  userText,
  assistantText,
  truthHash,
}: ReportStatusProps) {
  const { lang } = useLanguage()
  const t =
    i18nArchive[lang as keyof typeof i18nArchive]?.overlay ||
    i18nArchive.en.overlay

  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    async function verify() {
      const pairText =
        userText + '\n\n---\n\n' + assistantText

      const ok = await runTriketonSync(pairText)
      if (!cancelled) setVerified(ok)
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [userText, assistantText, truthHash])

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
