// components/archive/ArchiveUIFinish.tsx
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// UI-Finish & Test-Run – visual consistency + motion polishing

'use client'

import React, { useEffect, useState } from 'react'
import ArchiveSearch from './ArchiveSearch'
import ReportList from './ReportList'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { i18nArchive } from '@/lib/i18n.archive'
import { motion, AnimatePresence } from 'framer-motion'

export default function ArchiveUIFinish() {
  const { lang } = useLanguage()
  const t = i18nArchive[lang as keyof typeof i18nArchive]?.archive || i18nArchive.en.archive
  const [view, setView] = useState<'archive' | 'reports'>('archive')

  // Simple keyboard toggle for test run (Ctrl + R → Reports)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        setView((v) => (v === 'archive' ? 'reports' : 'archive'))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="relative w-full h-full">
      <div className="flex justify-between items-center border-b border-border-soft px-4 py-2">
        <h1 className="text-lg font-semibold text-primary">
          {view === 'archive' ? t.title : i18nArchive[lang]?.report?.title ?? 'Reports'}
        </h1>
        <button
          onClick={() => setView(view === 'archive' ? 'reports' : 'archive')}
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {view === 'archive' ? '→ Reports' : '← Archive'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'archive' ? (
          <motion.div
            key="archive"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="h-[calc(100%-40px)] overflow-hidden"
          >
            <ArchiveSearch />
          </motion.div>
        ) : (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="h-[calc(100%-40px)] overflow-hidden"
          >
            <ReportList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
