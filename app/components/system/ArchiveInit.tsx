'use client'

import { useEffect, useRef } from 'react'
import { syncArchiveFromTriketon } from '@/lib/archiveProjection'
import { syncArchivePairsFromTriketon } from '@/lib/archivePairProjection'

export default function ArchiveInit() {
  const didInit = useRef(false)

  useEffect(() => {
    // 🔒 Initiale, einmalige Projektion
    if (!didInit.current) {
      didInit.current = true
      syncArchiveFromTriketon()
      syncArchivePairsFromTriketon()
    }

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
