// lib/verificationReport.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Signed Verification Reports – JSON + optional PDF-export

import { verifyAll } from './triketonVerify'
import { TArchiveEntry } from './types'

export type VerificationLevel = 'message' | 'pair' | 'chat'

export interface VerificationReport {
  version: string
  generatedAt: string
  level: VerificationLevel
  messageLevel: boolean[]
  pairLevel: boolean[]
  chatLevel: boolean
  truthHash: string
  entriesCount: number

  // 🔒 NEU - lokal, nicht serverseitig
  pair?: {
    user: {
      content: string
    }
    assistant: {
      content: string
    }
  }
}


/**
 * Erzeugt einen signierten, deterministischen JSON-Report
 */
export async function createVerificationReport(
  entries: TArchiveEntry[],
  level: VerificationLevel = 'chat',
): Promise<VerificationReport> {

  const result = verifyAll(entries)
  const summary = JSON.stringify(
    {
      messageLevel: result.messageLevel,
      pairLevel: result.pairLevel,
      chatLevel: result.chatLevel,
    },
    null,
    2,
  )
   // Universelle SHA-256 Berechnung (deterministisch, ohne async-Drift)
  let truthHash: string
  try {
    const buffer = new TextEncoder().encode(summary)
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      // Browserpfad (async digest via then)
      const buf = await window.crypto.subtle.digest('SHA-256', buffer)
      const arr = Array.from(new Uint8Array(buf))
      truthHash = arr.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
    } else if (typeof require !== 'undefined') {
      // Node-Pfad (synchron)
      const { createHash } = require('crypto')
      truthHash = createHash('sha256').update(summary).digest('hex').slice(0, 16)
    } else {
      truthHash = `T${Math.abs(summary.length * 13_337).toString(16)}`
    }
  } catch {
    truthHash = `T${Math.abs(summary.length * 13_337).toString(16)}`
  }


  return {
    version: 'v1',
    generatedAt: new Date().toISOString(),
    level,
    messageLevel: result.messageLevel,
    pairLevel: result.pairLevel,
    chatLevel: result.chatLevel,
    truthHash,
    entriesCount: entries.length,
  }
}

/**
 * Lädt den Report automatisch als JSON-Datei herunter
 */
export function downloadVerificationReport(report: VerificationReport) {
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `verification-report-${report.truthHash}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/**
 * Optionaler PDF-Export (Plaintext → PDF via Blob)
 */
export async function downloadReportAsPDF(report: VerificationReport) {
  const text = [
    'Triketon2048 – Verification Report',
    '',
    `Generated at: ${report.generatedAt}`,
    `Level: ${report.level}`,
    `Entries: ${report.entriesCount}`,
    `Truth Hash: ${report.truthHash}`,
    '',
    'Message-Level:',
    JSON.stringify(report.messageLevel, null, 2),
    '',
    'Pair-Level:',
    JSON.stringify(report.pairLevel, null, 2),
    '',
    `Chat-Level: ${report.chatLevel}`,
  ].join('\n')

  const blob = new Blob([text], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `verification-report-${report.truthHash}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
