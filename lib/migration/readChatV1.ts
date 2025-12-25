// AFTER
// lib/migration/readChatV1.ts
// Phase B · Baby-Step B1
// Read-only Zugriff auf mpathy:chat:v1 (keine Mutation)

import type { ChatMessage } from '@/lib/chatStorage'

export function readChatV1(): ChatMessage[] {
  try {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem('mpathy:chat:v1')
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
