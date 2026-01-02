'use client'

import { useEffect } from 'react'
import { syncArchiveFromTriketon } from '@/lib/archiveProjection'

export default function ArchiveInit() {
  useEffect(() => {
    syncArchiveFromTriketon()
  }, [])

  return null
}
