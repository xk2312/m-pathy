// lib/verificationStorage.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Local Verification Reports – storage, retrieval, re-verify

import { VerificationReport } from './verificationReport'
import { readLS, writeLS } from './storage'

const KEY = 'mpathy:verification:v1'

/**
 * Lädt alle gespeicherten Reports aus LocalStorage
 */
export function loadReports(): VerificationReport[] {
  return readLS<VerificationReport[]>(KEY) || []
}

/**
 * Speichert neuen Report (idempotent, keine Duplikate via truthHash)
 */
export function saveReport(report: VerificationReport): void {
  const all = loadReports()
  const exists = all.some((r) => r.truthHash === report.truthHash)
  if (!exists) {
    all.unshift(report)
    writeLS(KEY, all.slice(0, 100)) // max 100 gespeicherte Reports
  }
}

/**
 * Löscht einen Report anhand truthHash
 */
export function deleteReport(hash: string): void {
  const all = loadReports().filter((r) => r.truthHash !== hash)
  writeLS(KEY, all)
}

/**
 * Einzeln lesen
 */
export function getReport(hash: string): VerificationReport | null {
  return loadReports().find((r) => r.truthHash === hash) || null
}
