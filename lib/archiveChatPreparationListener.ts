'use client'

import { writeArchiveChatContext } from './storage'

type StartChatEventDetail = {
  pairs: {
    user: {
      content: string
    }
    assistant: {
      content: string
    }
  }[]
}


const TIMEOUT_MS = 15000

console.info('[ARCHIVE][L0] archiveChatPreparationListener loaded')

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

/**
 * VORGANG 1 – SUMMARY GENERATION
 * (wortgleich zur Spezifikation)
 */
function buildSummaryPrompt(
  pairs: {
    user: { content?: string }
    assistant: { content?: string }
  }[]
): string {
  console.info('[ARCHIVE][L3] buildSummaryPrompt pairs:', pairs.length)

  return `
You will receive a set of up to four complete USER–ASSISTANT message pairs.
Each pair consists of:
- a USER message
- the corresponding ASSISTANT response

Your task is to produce a detailed, complete, and lossless summary of the conversation so far.

Rules:
- Preserve all factual information
- Preserve all user intent
- Preserve all assistant reasoning, decisions, and constraints
- Do NOT introduce new information
- Do NOT omit relevant context
- Do NOT add commentary

Return ONLY the summary text.

Conversation:
${pairs
  .map(
    (p, i) => `
PAIR ${i + 1}
USER:
${typeof p.user?.content === 'string' ? p.user.content : ''}

ASSISTANT:
${typeof p.assistant?.content === 'string' ? p.assistant.content : ''}
`
  )
  .join('\n')}
`.trim()
}


async function requestSummary(prompt: string): Promise<string> {
  console.info('[ARCHIVE][L4] POST /api/chat')
  console.info('[ARCHIVE][L4.1] prompt length:', prompt.length)

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a precise summarization engine.' },
        { role: 'user', content: prompt },
      ],
    }),
  })

  console.info('[ARCHIVE][L5] response status:', res.status)


  if (!res.ok) {
    throw new Error('SUMMARY_REQUEST_FAILED')
  }

 const data = await res.json()
console.info('[ARCHIVE][L6] response keys:', Object.keys(data || {}))

const text =
  typeof data?.content === 'string'
    ? data.content
    : typeof data?.assistant?.content === 'string'
    ? data.assistant.content
    : null

console.info('[ARCHIVE][L7] summary length:', text?.length)

if (typeof text !== 'string') {
  throw new Error('INVALID_SUMMARY_RESPONSE')
}

return text.trim()

}

async function handleStartChat(e: Event) {
  console.info('[ARCHIVE][L1] start-chat event received')

  const event = e as CustomEvent<StartChatEventDetail>
  const pairs = Array.isArray(event.detail?.pairs) ? event.detail.pairs : []

  console.info('[ARCHIVE][L2] pairs count:', pairs.length)

  try {
    const prompt = buildSummaryPrompt(pairs)

    const summary = await withTimeout(
      requestSummary(prompt),
      TIMEOUT_MS
    )

    if (!summary) {
      throw new Error('EMPTY_SUMMARY')
    }

    console.info('[ARCHIVE][L8] summary ok, length:', summary.length)

    // Persist ONLY the summary, nowhere else
    writeArchiveChatContext(summary)
    console.info('[ARCHIVE][L9] summary written to session storage')

    window.dispatchEvent(
      new CustomEvent('mpathy:archive:chat-prepared')
    )
    console.info('[ARCHIVE][L10] chat-prepared dispatched')
  } catch (err) {
    console.error('[ARCHIVE][E]', err)
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
  console.info('[ARCHIVE][L11] start-chat listener attached')
}
