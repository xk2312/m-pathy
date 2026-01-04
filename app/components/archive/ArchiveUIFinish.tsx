'use client'

import ArchiveOverlay from './ArchiveOverlay'

export default function ArchiveUIFinish() {
  /**
   * NOTE:
   * This component is a pure view orchestrator.
   * It must not impose layout, spacing, or visual structure.
   * Layout authority lives inside the rendered views.
   */

  return <ArchiveOverlay />
}
