'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ArchiveUIFinish from './ArchiveUIFinish'

export default function ArchiveTrigger() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const openHandler = () => setOpen(true)
    const closeHandler = () => setOpen(false)

    // OPEN
    window.addEventListener('mpathy:archive:open', openHandler)
    document.addEventListener('mpathy:archive:open', openHandler)

    // CLOSE
    window.addEventListener('mpathy:archive:close', closeHandler)
    document.addEventListener('mpathy:archive:close', closeHandler)

    return () => {
      window.removeEventListener('mpathy:archive:open', openHandler)
      document.removeEventListener('mpathy:archive:open', openHandler)

      window.removeEventListener('mpathy:archive:close', closeHandler)
      document.removeEventListener('mpathy:archive:close', closeHandler)
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
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('mpathy:archive:close')
                  )
                }
                className="absolute top-3 right-3 text-sm text-secondary cursor-pointer"
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
