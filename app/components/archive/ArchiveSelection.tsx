// components/archive/ArchiveSearch.tsx
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Search & Toggle – projection-only, read-only (MEFL)

'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { throttle, limitNodes } from '@/lib/performance'

type MessageRef = {
  id: string
  role: 'user' | 'assistant'
  timestamp: string
  chat_serial: number
}

export default function ArchiveSearch() {
  const { lang } = useLanguage()
  const t =
    i18nArchive[lang as keyof typeof i18nArchive]?.archive ||
    i18nArchive.en.archive

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MessageRef[]>([])
  const [defaultView, setDefaultView] = useState<
    { chat_serial: number; keywords: string[] }[]
  >([])

  // Default view: recent chats with persisted keywords
  useEffect(() => {
    const base = getRecentChats(13)
    setDefaultView(
      base.map((c) => ({
        chat_serial: c.chat_serial,
        keywords: c.keywords,
      })),
    )
  }, [lang])

  // Search view: filter message refs (no content access)
  useEffect(() => {
    const runSearch = throttle(() => {
      if (query.length < 3) {
        setResults([])
        return
      }

      const chats = getRecentChats(50)
      const q = query.toLowerCase()

      const matches = chats.flatMap((chat) =>
        (chat.messages ?? [])
          .filter((m) => m.id.toLowerCase().includes(q))
          .map((m) => ({
            id: m.id,
            role: m.role,
            timestamp: m.timestamp,
            chat_serial: chat.chat_serial,
          })),
      )

      setResults(limitNodes(matches, 100))
    }, 50)

    runSearch()
  }, [query])

  const visibleDefault = query.length < 3
  const visibleResults = !visibleDefault && results.length > 0
  const visibleNone = !visibleDefault && results.length === 0

  return (
    <div className="p-4 flex flex-col gap-4 w-full h-full text-primary">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="w-full rounded-md bg-surface2 border border-border-soft text-base"
      />

      {visibleDefault && (
        <div className="flex flex-col gap-3 overflow-y-auto">
          <h2 className="text-lg font-medium">{t.defaultHeader}</h2>

          {defaultView.map((c) => (
            <Card
              key={c.chat_serial}
              className="bg-surface1 border-border-soft"
            >
              <CardContent className="p-3 flex flex-wrap gap-1">
                <span className="text-sm text-secondary">
                  {t.chatNumber.replace(
                    '{{chatNumber}}',
                    String(c.chat_serial),
                  )}
                </span>

                {c.keywords.map((k) => (
                  <span
                    key={k}
                    className="text-xs px-2 py-1 bg-surface2 rounded-full border border-border-soft"
                  >
                    {k}
                  </span>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {visibleResults && (
        <div className="flex flex-col gap-3 overflow-y-auto">
          <h2 className="text-lg font-medium">
            {results.length} results
          </h2>

          {results.map((m) => (
            <Card key={m.id} className="bg-surface1 border-border-soft">
              <CardContent className="p-3 flex flex-col gap-1">
                <div className="text-xs text-secondary">
                  Chat {m.chat_serial} ·{' '}
                  {new Date(m.timestamp).toLocaleString()}
                </div>
                <div className="text-sm text-muted">
                  {t.messageReference}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {visibleNone && (
        <div className="text-sm text-muted">{t.noResults}</div>
      )}
    </div>
  )
}
