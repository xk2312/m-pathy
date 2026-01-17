'use client'

import {
  writeArchiveChatContext,
} from './storage'

type StartChatEventDetail = {
  pairs: unknown[]
}

const TIMEOUT_MS = 15000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('TIMEOUT')), ms)
    promise
      .then((res) => {
        clearTimeout(id)
        resolve(res)
      })
      .catch((err) => {
        clearTimeout(id)
        reject(err)
      })
  })
}

async function requestSummary(pairs: unknown[]): Promise<string> {
  const res = await fetch('/api/ai/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pairs }),
  })

  if (!res.ok) {
    throw new Error('SUMMARY_REQUEST_FAILED')
  }

  const text = await res.text()
  return text.trim()
}

async function handleStartChat(e: Event) {
  const event = e as CustomEvent<StartChatEventDetail>
  const pairs = Array.isArray(event.detail?.pairs)
    ? event.detail.pairs
    : []

  try {
    const summary = await withTimeout(
      requestSummary(pairs),
      TIMEOUT_MS
    )

    if (!summary) {
      throw new Error('EMPTY_SUMMARY')
    }

    writeArchiveChatContext(summary)

    window.dispatchEvent(
      new CustomEvent('mpathy:archive:chat-prepared')
    )
  } catch {
    window.dispatchEvent(
      new CustomEvent('mpathy:archive:chat-error')
    )
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'mpathy:archive:start-chat',
    handleStartChat
  )
}
