'use client'

import { useEffect } from 'react'
import { syncArchiveFromTriketon } from '@/lib/archiveProjection'

let initialized = false

export default function ArchiveInit() {
  useEffect(() => {
    if (!initialized) {
      initialized = true
      syncArchiveFromTriketon()
    }

    const onAppend = () => {
      syncArchiveFromTriketon()
    }

    window.addEventListener('mpathy:triketon:append', onAppend)
    return () => {
      window.removeEventListener('mpathy:triketon:append', onAppend)
    }
  }, [])

  return null
}
