// /modules/mobileTrigger.ts
export function setupMobileTrigger(
    canvas: HTMLCanvasElement,
    core: HTMLDivElement,
    wrapper: HTMLDivElement,
    triggerImplosion: (
      cx: number,
      cy: number,
      core: HTMLDivElement,
      wrapper: HTMLDivElement
    ) => void
  ) {
    let exploded = false
  
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      const pulseBox = core.getBoundingClientRect()
      const cx = pulseBox.left + pulseBox.width / 2
      const cy = pulseBox.top + pulseBox.height / 2
      const dist = Math.sqrt((touch.clientX - cx) ** 2 + (touch.clientY - cy) ** 2)
  
      if (!exploded && dist <= pulseBox.width / 2 + 40) {
        exploded = true
        triggerImplosion(cx, cy, core, wrapper)
      }
    }
  
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
  
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
    }
  }
  