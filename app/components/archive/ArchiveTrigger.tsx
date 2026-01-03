// components/archive/ArchiveTrigger.tsx
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ArchiveUIFinish from './ArchiveUIFinish'
import { syncArchiveFromTriketon } from '@/lib/archiveProjection'
import { syncArchivePairsFromTriketon } from '@/lib/archivePairProjection'


export default function ArchiveTrigger() {
  const [open, setOpen] = useState(false)

  // AFTER
// 🔒 SYSTEM PROJECTION INIT (runs once, deterministic)
useEffect(() => {
  syncArchiveFromTriketon()
  syncArchivePairsFromTriketon()
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
