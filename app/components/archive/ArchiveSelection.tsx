// components/archive/ArchiveSelection.tsx
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Checkbox-Selection – Chat + Message Level

'use client'

import React, { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { getChatKeywordClusters } from '@/lib/keywordExtract'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'
import { Card, CardContent } from '@/components/ui/Card'

type ChatItem = {
  chat_serial: number
  first_timestamp: string
  last_timestamp: string
  keywords: string[]
  messages?: { id: string; role: string; content: string; timestamp: string }[]
}

export default function ArchiveSelection() {
  const { lang } = useLanguage()
  const t = i18nArchive[lang as keyof typeof i18nArchive]?.archive || i18nArchive.en.archive

  const [chats, setChats] = useState<ChatItem[]>([])
  const [selectedChats, setSelectedChats] = useState<number[]>([])
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])

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

  // Handler für Chat-Checkbox
  const toggleChat = (serial: number) => {
    setSelectedChats((prev) =>
      prev.includes(serial) ? prev.filter((id) => id !== serial) : [...prev, serial],
    )
  }

  // Handler für Message-Checkbox
  const toggleMessage = (msgId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(msgId) ? prev.filter((id) => id !== msgId) : [...prev, msgId],
    )
  }

  return (
    <div className="p-4 flex flex-col gap-3 w-full h-full text-primary">
      <h2 className="text-lg font-medium">{t.defaultHeader}</h2>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {chats.map((chat) => {
          const checked = selectedChats.includes(chat.chat_serial)
          return (
            <Card
              key={chat.chat_serial}
              className={`bg-surface1 border-border-soft transition-all ${
                checked ? 'border-cyan-400' : ''
              }`}
            >
              <CardContent className="p-3 flex flex-col gap-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleChat(chat.chat_serial)}
                    className="accent-cyan-400 w-4 h-4"
                  />
                  <span className="text-sm text-secondary">
                    {t.chatNumber.replace('{{chatNumber}}', String(chat.chat_serial))}
                  </span>
                </label>

                <div className="flex flex-wrap gap-1 mt-1">
                  {chat.keywords.map((k) => (
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
          )
        })}
      </div>

      <div className="mt-4 text-sm text-secondary">
        {selectedChats.length > 0
          ? `${selectedChats.length} ${selectedChats.length === 1 ? 'chat' : 'chats'} selected`
          : '—'}
      </div>
    </div>
  )
}
