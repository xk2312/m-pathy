/**
 * ============================================================================
 * INVENTUS INDEX — SearchResultsView.tsx
 * ============================================================================
 *
 * ZWECK
 * -----
 * Reine Präsentations- und Interaktions-Komponente für Suchergebnisse im Archiv.
 * Zeigt Treffer (Archive-Suchresultate) und ermöglicht:
 *   - Auswahl (+) eines Message-Paares
 *   - Entfernung (−) eines bereits ausgewählten Paares
 *
 * KEINE Server-Logik.
 * KEINE Storage-Logik.
 * KEINE Verify- oder Report-Logik.
 *
 *
 * ============================================================================
 * ROLLE IM GESAMTSYSTEM
 * ============================================================================
 *
 * Diese Komponente:
 *   - kennt NUR Suchergebnisse (SearchResult)
 *   - kennt die aktuelle Selection (ArchivePair[])
 *   - delegiert JEDE Zustandsänderung nach außen
 *
 * Sie ist ein reiner „Dumb View + Event Forwarder“.
 *
 *
 * ============================================================================
 * PROPS (INPUT-VERTRAG)
 * ============================================================================
 *
 * results: SearchResult[]
 *   - Ergebnisliste der Archiv-Suche
 *   - enthält Previews + Metadaten (KEINE vollständigen Pairs)
 *
 * selection: ArchivePair[]
 *   - aktuelle Auswahl aus dem ArchiveOverlay
 *   - dient ausschließlich zur Bestimmung des Selected-Status
 *
 * addPair(pair: ArchivePair): void
 *   - Callback vom Parent (ArchiveOverlay)
 *   - fügt ein Pair zur Selection hinzu
 *
 * removePair(pair_id: string): void
 *   - Callback vom Parent (ArchiveOverlay)
 *   - entfernt ein Pair aus der Selection
 *
 * onOpenChat?: (chainId: string) => void
 *   - optional (derzeit nicht genutzt)
 *
 *
 * ============================================================================
 * INTERNE HILFSFUNKTIONEN
 * ============================================================================
 *
 * highlightText(text, keywords)
 * -----------------------------
 * - Hebt Suchbegriffe visuell hervor
 * - rein visuell, keine Logik-Auswirkungen
 * - verändert KEINE Inhalte, nur Darstellung
 *
 *
 * isSelected(pair_id)
 * -------------------
 * - prüft, ob ein Pair bereits in selection enthalten ist
 * - basiert ausschließlich auf pair_id-Vergleich
 *
 *
 * ============================================================================
 * SELECTION-BUILDING (KRITISCHER PUNKT)
 * ============================================================================
 *
 * Beim Klick auf "+" (Add):
 *
 * - Es wird aus SearchResult ein ArchivePair konstruiert:
 *     {
 *       pair_id,
 *       chain_id,
 *       user: {
 *         id,
 *         content: preview,
 *         timestamp
 *       },
 *       assistant: {
 *         id,
 *         content: preview,
 *         timestamp
 *       }
 *     }
 *
 * - ACHTUNG:
 *   - content = preview (nicht Volltext)
 *   - Diese Pair-Objekte sind funktional,
 *     aber NICHT identisch mit archive:pairs Full Objects
 *
 * → Verantwortlich für Konsistenz ist der Parent (ArchiveOverlay).
 *
 *
 * ============================================================================
 * USER-INTERAKTION
 * ============================================================================
 *
 * Button "+":
 *   - ruft addPair(ArchivePair)
 *
 * Button "−":
 *   - ruft removePair(pair_id)
 *
 * KEIN direkter Zugriff auf Storage.
 * KEIN direkter Event-Dispatch.
 *
 *
 * ============================================================================
 * RENDERING-LOGIK
 * ============================================================================
 *
 * - Wenn results leer → return null
 * - Für jedes SearchResult:
 *     - Card mit:
 *         • Add/Remove Button
 *         • Timestamp (Start)
 *         • User Preview (highlighted)
 *         • Assistant Preview (highlighted)
 *
 *
 * ============================================================================
 * BEKANNTE GRENZEN / IMPLIKATIONEN
 * ============================================================================
 *
 * - SearchResultsView weiß NICHT:
 *     • was Verify ist
 *     • was Reports sind
 *     • was Seal / TruthHash ist
 *
 * - Diese Komponente kann NIEMALS Ursache dafür sein,
 *   dass „Verify nichts macht“.
 *
 * - Wenn Selection korrekt gefüllt ist,
 *   liegt ein Verify-Problem IMMER außerhalb dieser Datei.
 *
 *
 * ============================================================================
 * NICHT VERHANDELBAR
 * ============================================================================
 *
 * - Keine Persistenz hier
 * - Keine Business-Logik
 * - Keine Server-Kommunikation
 *
 * Diese Datei ist ein reiner UI-Baustein.
 *
 * ============================================================================
 */

'use client'

import type { SearchResult } from '@/components/archive/ArchiveSearch'
import type { ArchivePair } from '@/lib/storage'

type SelectedPair = {
  pair_id: string
}


type Props = {
  results: SearchResult[]
  selection: ArchivePair[]
  addPair: (pair: ArchivePair) => void
  removePair: (pair_id: string) => void
  onOpenChat?: (chainId: string) => void
}




function highlightText(text: string, keywords: string[]) {
  if (!keywords.length) return text

  const escaped = keywords.map(k =>
    k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )

  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')

  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-cyan-400">
        {part}
      </span>
    ) : (
      part
    )
  )
}

export default function SearchResultsView({
  results,
  selection,
  addPair,
  removePair,
}: Props) {
  if (!results.length) return null

  const isSelected = (pair_id: string) =>
    selection.some(p => p.pair_id === pair_id)


  return (
    <section className="space-y-6">
      {results.map((pair) => {
  const selected = isSelected(pair.pair_id)

  return (
    <div
      key={pair.pair_id}
      className="rounded-lg border border-white/10 p-4 space-y-3 relative"
    >
      <button
        type="button"
        onClick={() => {
  if (selected) {
    removePair(pair.pair_id)
    return
  }

  const archivePair: ArchivePair = {
    pair_id: pair.pair_id,
    chain_id: pair.chain_id,
    user: {
      id: `${pair.pair_id}:user`,
      content: pair.user.preview,
      timestamp: pair.timestamp_start,
    },
    assistant: {
      id: `${pair.pair_id}:assistant`,
      content: pair.assistant.preview,
      timestamp: pair.timestamp_end,
    },
  }

  addPair(archivePair)
}}

        className="
          absolute
          top-3
          right-3
          w-7
          h-7
          rounded-full
          flex
          items-center
          justify-center
          text-sm
          font-medium
          border
          transition
          cursor-pointer
          bg-[#121418]
          border-border-soft
          hover:border-cyan-500
          hover:text-cyan-400
        "
        aria-label={selected ? 'Remove from selection' : 'Add to selection'}
      >
        {selected ? '−' : '+'}
      </button>

      <div className="text-xs text-white/50">
        {new Date(pair.timestamp_start).toLocaleString()}
      </div>

      <div className="text-sm">
        {highlightText(pair.user.preview, pair.user.matched_keywords)}
      </div>

      <div className="text-sm text-white/80">
        {highlightText(pair.assistant.preview, pair.assistant.matched_keywords)}
      </div>
    </div>
  )
})}

    </section>
  )
}
