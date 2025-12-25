// lib/performance.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Performance Hardening – realtime control & node-limiting

/**
 * throttle() – führt eine Funktion höchstens alle 'limit' ms aus.
 * Verhindert UI-Stottern bei Input-Events.
 */
export function throttle<F extends (...args: any[]) => void>(
  fn: F,
  limit = 50,
): (...args: Parameters<F>) => void {
  let lastRun = 0
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (...args: Parameters<F>) {
    const now = Date.now()
    const remaining = limit - (now - lastRun)
    if (remaining <= 0) {
      if (timeout) clearTimeout(timeout)
      lastRun = now
      fn(...args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastRun = Date.now()
        timeout = null
        fn(...args)
      }, remaining)
    }
  }
}

/**
 * limitNodes() – begrenzt DOM-Einträge für Listen-Render auf max count.
 * Nutzt Slice statt Pagination → keine Drift.
 */
export function limitNodes<T>(arr: T[], count = 100): T[] {
  return arr.slice(0, count)
}

/**
 * measureRender() – einfache Zeitmessung für Renderzyklen (Debug/QA).
 */
export function measureRender(label: string, fn: () => void) {
  const start = performance.now()
  fn()
  const end = performance.now()
  if (end - start > 50) {
    console.warn(`[Perf] ${label} took ${(end - start).toFixed(2)} ms`)
  }
}
