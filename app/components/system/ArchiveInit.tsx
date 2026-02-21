'use client'

import { useEffect, useRef } from 'react'
import { syncArchiveFromTriketon } from '@/lib/archiveProjection'
import { syncArchivePairsFromTriketon } from '@/lib/archivePairProjection'
import { restoreTriketonFromVault } from '@/lib/storage'


export default function ArchiveInit() {
  const didInit = useRef(false)

  useEffect(() => {
    restoreTriketonFromVault()

    const TRIKETON_KEY = 'mpathy:triketon:v1'
    let stopped = false

    const hasTriketon = (): boolean => {
      try {
        const raw = window.localStorage.getItem(TRIKETON_KEY)
        if (!raw) return false
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) && parsed.length > 0
      } catch {
        return false
      }
    }

    const runProjections = () => {
      syncArchiveFromTriketon()
      syncArchivePairsFromTriketon()
    }

    const tryHydrate = () => {
      if (stopped) return
      if (!hasTriketon()) return false
      runProjections()
      return true
    }

    if (!didInit.current) {
      didInit.current = true

      let attempts = 0
      const maxAttempts = 30

      const tick = () => {
        if (stopped) return
        attempts += 1
        const ok = tryHydrate()
        if (ok) return
        if (attempts >= maxAttempts) return
        window.setTimeout(tick, 100)
      }

      window.setTimeout(tick, 50)
    }

    const onUpdated = () => {
      runProjections()

      let attempts = 0
      const maxAttempts = 10

      const tick = () => {
        if (stopped) return
        attempts += 1
        runProjections()
        if (attempts >= maxAttempts) return
        window.setTimeout(tick, 100)
      }

      window.setTimeout(tick, 100)
    }

    window.addEventListener('mpathy:triketon:updated', onUpdated)

    return () => {
      stopped = true
      window.removeEventListener('mpathy:triketon:updated', onUpdated)
    }



  }, [])

  return null
}
