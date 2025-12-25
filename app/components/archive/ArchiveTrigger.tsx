// components/archive/ArchiveTrigger.tsx
'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import ArchiveUIFinish from './ArchiveUIFinish'

export default function ArchiveTrigger() {
  const [open, setOpen] = useState(false)

  if (typeof document === 'undefined') return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="saeuleSupportButton"
        aria-label="Open Archive"
      >
        Archive
      </button>

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
