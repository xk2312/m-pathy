'use client'

import { useEffect, useRef } from 'react'
import { syncArchiveFromTriketon } from '@/lib/archiveProjection'
import { syncArchivePairsFromTriketon } from '@/lib/archivePairProjection'

export default function ArchiveInit() {
  const didInit = useRef(false)

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true
      // Wir geben dem System 100ms Zeit, um LS-Sperren nach dem Reset zu lösen
      setTimeout(() => {
        syncArchiveFromTriketon()
        syncArchivePairsFromTriketon()
      }, 100);
    }
    // ...

    // 🔁 Re-Projektion bei Ledger-Append
    const onAppend = () => {
      syncArchiveFromTriketon()
      syncArchivePairsFromTriketon()
    }

    window.addEventListener('mpathy:triketon:append', onAppend)
    return () => {
      window.removeEventListener('mpathy:triketon:append', onAppend)
    }
  }, [])

  return null
}
