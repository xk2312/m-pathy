// components/archive/ArchiveTrigger.tsx
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ArchiveUIFinish from './ArchiveUIFinish'
import { syncArchiveFromTriketon } from '@/lib/archiveProjection'
import { syncArchivePairsFromTriketon } from '@/lib/archivePairProjection'

export default function ArchiveTrigger() {
  const [open, setOpen] = useState(false)

  // 🔒 SYSTEM PROJECTION INIT (runs once, deterministic)
  useEffect(() => {
    // Guard against double execution (React StrictMode / Dev)
    if ((window as any).__mpathy_archive_init_done__) return
    ;(window as any).__mpathy_archive_init_done__ = true

    try {
      syncArchiveFromTriketon()
      syncArchivePairsFromTriketon()
      console.debug('[ArchiveTrigger] archive + pair projection synced')
    } catch (e) {
      console.error('[ArchiveTrigger] projection failed', e)
    }
  }, [])

  useEffect(() => {
    const openHandler = () => setOpen(true)

    window.addEventListener('mpathy:archive:open', openHandler)
    document.addEventListener('mpathy:archive:open', openHandler)

    return () => {
      window.removeEventListener('mpathy:archive:open', openHandler)
      document.removeEventListener('mpathy:archive:open', openHandler)
    }
  }, [])

  if (typeof document === 'undefined') return null

  return (
    <>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60">
            <div className="absolute inset-4 bg-surface1 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-sm text-secondary"
                aria-label="Close Archive"
              >
                ✕
              </button>
              <ArchiveUIFinish />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
