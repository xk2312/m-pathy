// components/archive/ArchiveActions.tsx
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Selection Actions – Summarize & Load into New Chat

'use client'

import React, { useState } from 'react'
import { readLS, writeLS } from '@/lib/storage'
import { TArchiveEntry } from '@/lib/types'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'
import { Button } from '@/components/ui/Button'

type Props = {
  selectedChats: number[]
  selectedMessages: string[]
  onClear: () => void
}

export default function ArchiveActions({ selectedChats, selectedMessages, onClear }: Props) {
  const { lang } = useLanguage()
  const t = i18nArchive[lang as keyof typeof i18nArchive]?.archive || i18nArchive.en.archive
  const [status, setStatus] = useState<string>('')

  // Liest aktuelle Archiv-Daten
  const getArchive = (): TArchiveEntry[] => readLS<TArchiveEntry[]>('mpathy:archive:v1') || []

  // Selektierte Nachrichten ermitteln
  const getSelected = (): TArchiveEntry[] => {
    const archive = getArchive()
    const chatFiltered =
      selectedChats.length > 0
        ? archive.filter((a) => selectedChats.includes(a.origin_chat))
        : []
    const msgFiltered =
      selectedMessages.length > 0
        ? archive.filter((a) => selectedMessages.includes(a.id))
        : []
    const merged = [...chatFiltered, ...msgFiltered]
    const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values())
    return unique.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  // (1) Zusammenfassung
  const summarizeSelection = () => {
    const sel = getSelected()
    if (sel.length === 0) return
    const summary = sel
      .map((m) => `[${m.role}] ${m.content}`)
      .join('\n\n')
      .slice(0, 5000)
    writeLS('mpathy:context:upload', { type: 'summary', data: summary, count: sel.length })
    setStatus(`${t.summarize} ✓ (${sel.length})`)
  }

  // (2) Auswahl in neuen Chat laden
  const loadSelection = () => {
    const sel = getSelected()
    if (sel.length === 0) return
    writeLS('mpathy:context:upload', { type: 'raw', data: sel })
    setStatus(`${t.loadSelection} ✓ (${sel.length})`)
  }

  // Reset
  const clear = () => {
    onClear()
    setStatus('')
  }

  return (
    <div className="flex gap-2 mt-4">
      <Button
        onClick={summarizeSelection}
        disabled={selectedChats.length + selectedMessages.length === 0}
      >
        {t.summarize}
      </Button>
      <Button
        onClick={loadSelection}
        disabled={selectedChats.length + selectedMessages.length === 0}
      >
        {t.loadSelection}
      </Button>
      <Button variant="ghost" onClick={clear}>
        {t.clearSelection}
      </Button>
      {status && <span className="text-xs text-secondary ml-2">{status}</span>}
    </div>
  )
}
