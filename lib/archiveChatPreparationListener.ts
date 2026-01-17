'use client'

import {
  writeArchiveChatContext,
  clearArchiveChatContext,
  clearArchiveSelection,
} from './storage'

/* ======================================================
   CONFIG
   ====================================================== */

const TIMEOUT_MS = 15000

const SYSTEM_SUMMARY_HEADER =
  'You are a precise summarization engine.'

const SYSTEM_CONTINUATION_HEADER = `
You are continuing a conversation based on a verified archival summary.

The summary below is a complete, lossless representation of the prior USER–ASSISTANT conversation.
It contains all relevant facts, intents, constraints, and decisions.

Rules:
- Treat the summary as authoritative conversation history.
- Do NOT question or reinterpret the summary.
- Do NOT ask for missing context.
- Do NOT reference the archive or summarization process.
- Continue the conversation naturally and directly.

Produce the next assistant response to the user.
`.trim()

console.info('[ARCHIVE][BOOT] archiveChatPreparation loaded')

/* ======================================================
   TYPES
   ====================================================== */

type ArchivePairLike = {
  user: { content?: string }
  assistant: { content?: string }
}

type StartChatEventDetail = {
  pairs: ArchivePairLike[]
}

/* ======================================================
   UTILS
   ====================================================== */

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

/* ======================================================
   SUMMARY PROMPT
   ====================================================== */

function buildSummaryPrompt(pairs: ArchivePairLike[]): string {
  console.info('[ARCHIVE][S1] buildSummaryPrompt pairs:', pairs.length)

  return `
You will receive a set of up to four complete USER–ASSISTANT message pairs.

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
${typeof p.assistant?.content === 'string'
  ? p.assistant.content
  : ''}
`
  )
  .join('\n')}
`.trim()
}

/* ======================================================
   API CALLS
   ====================================================== */

async function requestSummary(prompt: string): Promise<string> {
  console.info('[ARCHIVE][S2] POST /api/chat (summary)')
  console.info('[ARCHIVE][S2.1] prompt length:', prompt.length)

  const res = await fetch('/api/chat', {
  method: 'POST',
credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'system', content: SYSTEM_SUMMARY_HEADER },
      { role: 'user', content: prompt },
    ],
  }),
})



  console.info('[ARCHIVE][S2.2] response status:', res.status)

  if (!res.ok) throw new Error('SUMMARY_REQUEST_FAILED')

  const data = await res.json()
  const text =
    typeof data?.content === 'string'
      ? data.content
      : typeof data?.assistant?.content === 'string'
      ? data.assistant.content
      : null

  console.info('[ARCHIVE][S2.3] summary length:', text?.length)

  if (typeof text !== 'string') {
    throw new Error('INVALID_SUMMARY_RESPONSE')
  }

  return text.trim()
}

async function requestContinuation(summary: string): Promise<any> {
  console.info('[ARCHIVE][C1] POST /api/chat (continuation)')
  console.info('[ARCHIVE][C1.1] summary length:', summary.length)

  const res = await fetch('/api/chat', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'system', content: SYSTEM_CONTINUATION_HEADER },
      { role: 'user', content: `ARCHIVAL SUMMARY:\n\n${summary}` },
    ],
  }),
})


  console.info('[ARCHIVE][C1.2] response status:', res.status)

  if (!res.ok) throw new Error('CONTINUATION_REQUEST_FAILED')

  const data = await res.json()
  console.info('[ARCHIVE][C1.3] continuation response received')

  return data
}

/* ======================================================
   MAIN FLOW — SINGLE ENTRY POINT
   ====================================================== */

async function handleStartChat(e: Event) {
  console.info('[ARCHIVE][F0] start-chat event received')

  const event = e as CustomEvent<StartChatEventDetail>
  const pairs = Array.isArray(event.detail?.pairs)
    ? event.detail.pairs
    : []

  console.info('[ARCHIVE][F1] pairs count:', pairs.length)

  try {
    /* -------- SUMMARY -------- */
    const summaryPrompt = buildSummaryPrompt(pairs)

    const summary = await withTimeout(
      requestSummary(summaryPrompt),
      TIMEOUT_MS
    )

    if (!summary) throw new Error('EMPTY_SUMMARY')

    console.info('[ARCHIVE][F2] summary ok')

    writeArchiveChatContext(summary)
    console.info('[ARCHIVE][F3] summary written to session storage')

    /* -------- CONTINUATION -------- */
    const continuation = await withTimeout(
      requestContinuation(summary),
      TIMEOUT_MS
    )

    console.info('[ARCHIVE][F4] continuation ok')

    /* ======================================================
       ⛔️ KRITISCHER ÜBERGABEPUNKT
       ------------------------------------------------------
       HIER muss die Antwort in die KANONISCHE CHAT-PIPELINE:
       - write to mpathy:chat:v1
       - Triketon-Seal erzeugen
       - UI auf neuen Chat wechseln
       ------------------------------------------------------
       Beispiel (PSEUDO, ggf. anpassen):
       
       writeChatAssistantMessage(continuation)
       sealWithTriketon(...)
       navigateToChat(...)
       
       ====================================================== */

    console.info('[ARCHIVE][F5] TODO: write continuation into chat pipeline')

    /* -------- CLEANUP (STRICTLY LAST) -------- */
    clearArchiveSelection()
    clearArchiveChatContext()
    console.info('[ARCHIVE][F6] archive namespaces cleared')
  } catch (err) {
    console.error('[ARCHIVE][ERROR]', err)
  }
}

/* ======================================================
   LISTENER ATTACH
   ====================================================== */

if (typeof window !== 'undefined') {
  window.addEventListener(
    'mpathy:archive:start-chat',
    handleStartChat
  )
  console.info('[ARCHIVE][BOOT] start-chat listener attached')
}
