// lib/triketonSync.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Triketon Integration A – Seal ↔ Verify Sync (local ↔ server)

import { computeTruthHash, normalizeForTruthHash } from './triketonVerify'
import { readLS, writeLS } from './storage'

interface SyncPayload {
  public_key: string
  truth_hash: string
  text: string
  version?: string
}

/**
 * Lokale Vorberechnung (Seal → TruthHash + PublicKey Fetch)
 */
export function prepareSealPayload(text: string): SyncPayload {
  const normalized = normalizeForTruthHash(text)
  const truth_hash = computeTruthHash(normalized)
  const public_key =
    readLS<string>('mpathy:triketon:pubkey' as any) || 'unknown'
  return { public_key, truth_hash, text: normalized, version: 'v1' }
}

/**
 * Sendet Seal an /api/triketon und gibt TRUE/FALSE-Verifikation zurück.
 */
export async function verifyWithServer(payload: SyncPayload): Promise<boolean> {
  try {
    const res = await fetch('/api/triketon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) return false
    const data = await res.json()
    // Erwartetes Schema: { verified: true | false }
    return Boolean(data.verified)
  } catch {
    return false
  }
}

/**
 * Führt kompletten Seal ↔ Verify-Sync aus:
 *  1. lokal TruthHash berechnen  
 *  2. Server Verify aufrufen  
 *  3. Ergebnis im LocalStorage speichern (mpathy:verification:sync)
 */
export async function runTriketonSync(text: string): Promise<boolean> {
  const payload = prepareSealPayload(text)
  const verified = await verifyWithServer(payload)
  const entry = {
    timestamp: new Date().toISOString(),
    ...payload,
    verified,
  }

  const all = readLS<typeof entry[]>('mpathy:verification:sync' as any) || []
  all.unshift(entry)
  writeLS('mpathy:verification:sync' as any, all.slice(0, 50))
  return verified
}
