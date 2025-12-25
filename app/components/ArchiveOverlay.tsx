'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { getChatKeywordClusters } from '@/lib/keywordExtract'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

type ChatDisplay = {
  chat_serial: number
  first_timestamp: string
  last_timestamp: string
  keywords: string[]
}

export default function ArchiveOverlay() {
  const { lang } = useLanguage()
  const t = i18nArchive[lang as keyof typeof i18nArchive]?.archive || i18nArchive.en.archive
  const [query, setQuery] = useState('')
  const [chats, setChats] = useState<ChatDisplay[]>([])

  useEffect(() => {
    const base = getRecentChats(13)
    const clusters = getChatKeywordClusters(base, lang).map((c) => {
      const meta = base.find((b) => b.chat_serial === c.chat_serial)
      return {
        chat_serial: c.chat_serial,
        first_timestamp: meta?.first_timestamp ?? '',
        last_timestamp: meta?.last_timestamp ?? '',
        keywords: c.keywords,
      }
    })
    setChats(clusters)
  }, [lang])

  return (
    <div className="p-4 flex flex-col gap-4 w-full h-full text-primary">
      <div className="flex w-full">
        <Input
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-md bg-surface2 border border-border-soft text-base"
        />
      </div>

      {query.length < 3 ? (
        <div className="flex flex-col gap-3 overflow-y-auto">
          <h2 className="text-lg font-medium">{t.defaultHeader}</h2>
          {chats.map((c) => (
            <Card key={c.chat_serial} className="bg-surface1 border-border-soft">
              <CardContent className="p-3 flex flex-col gap-1">
                <div className="text-sm text-secondary">
                  {t.chatNumber.replace('{{chatNumber}}', String(c.chat_serial))}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {c.keywords.map((k) => (
                    <span
                      key={k}
                      className="text-xs px-2 py-1 bg-surface2 rounded-full border border-border-soft"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted">{t.noResults}</div>
      )}
    </div>
  )
}
