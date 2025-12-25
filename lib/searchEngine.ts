// lib/searchEngine.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Intelligent Search Syntax – local boolean/phrase filtering (deterministic)

import { TArchiveEntry } from './types'

/**
 * Tokenizer – zerlegt Suchstring in logische Einheiten.
 * Unterstützt:
 *  - "phrase search"
 *  - AND / OR / NOT / && / ||
 *  - runde Klammern für Gruppierung
 */
function tokenize(query: string): string[] {
  const tokens: string[] = []
  const regex = /"([^"]+)"|(\(|\)|&&|\|\||\bAND\b|\bOR\b|\bNOT\b)|([\p{L}\p{N}_-]+)/giu
  let match
  while ((match = regex.exec(query))) {
    const [, phrase, op, word] = match
    if (phrase) tokens.push(`"${phrase.toLowerCase()}"`)
    else if (op) tokens.push(op.toUpperCase())
    else if (word) tokens.push(word.toLowerCase())
  }
  return tokens
}

/**
 * Evaluator – führt Boolesche Logik auf einem Eintrag aus
 */
function evaluateEntry(entry: TArchiveEntry, tokens: string[]): boolean {
  const text = entry.content.toLowerCase()
  const evalStack: (boolean | string)[] = []

  const resolve = () => {
    const b = evalStack.pop()
    const a = evalStack.pop()
    const op = evalStack.pop()
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      if (op === 'AND' || op === '&&') return evalStack.push(a && b)
      if (op === 'OR' || op === '||') return evalStack.push(a || b)
    }
    evalStack.push(false)
  }

  for (const token of tokens) {
    if (token === 'AND' || token === 'OR' || token === '&&' || token === '||') {
      evalStack.push(token)
    } else if (token === 'NOT') {
      const next = evalStack.pop()
      evalStack.push(!next)
    } else if (token.startsWith('"')) {
      const phrase = token.slice(1, -1)
      evalStack.push(text.includes(phrase))
    } else if (token === '(' || token === ')') {
      // Gruppierung wird in dieser deterministischen Minimalversion ignoriert,
      // kann in späteren Iterationen erweitert werden.
      continue
    } else {
      evalStack.push(text.includes(token))
    }

    // Automatische Reduktion bei Stapelgröße ≥ 3
    if (evalStack.length >= 3 && typeof evalStack[evalStack.length - 1] === 'boolean') {
      resolve()
    }
  }

  return Boolean(evalStack.pop())
}

/**
 * Hauptfunktion – filtert Archiv nach Query mit Operatoren
 */
export function searchArchiveEntries(
  entries: TArchiveEntry[],
  query: string,
): TArchiveEntry[] {
  if (!query || query.trim().length < 3) return []
  const tokens = tokenize(query)
  const result = entries.filter((entry) => evaluateEntry(entry, tokens))
  return result.slice(0, 100)
}
