'use client'

import { useEffect } from 'react'
import { syncArchiveFromTriketon } from '@/lib/archiveProjection'

let initialized = false

export default function ArchiveInit() {
  useEffect(() => {
    if (initialized) return
    initialized = true
    syncArchiveFromTriketon()
  }, [])

  return null
}
