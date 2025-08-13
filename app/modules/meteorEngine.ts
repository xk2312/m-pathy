type XY = { x: number; y: number }

export function startMeteorSequence(
  ctx: CanvasRenderingContext2D,
  target: XY,
  onImpact: () => void
): () => void {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

  // Wir arbeiten konsequent in CSS-Pixeln
  const rect = ctx.canvas.getBoundingClientRect()
  const W = Math.floor(rect.width)
  const H = Math.floor(rect.height)

  // Startpunkt (oben rechts außerhalb), Ziel = anchor (CSS-Pixel)
  const x0 = W * 1.08
  const y0 = -H * 0.08

  const frames = isMobile ? 90 : 120
  const easeOutQuad = (p: number) => 1 - (1 - p) * (1 - p)

  const dx = target.x - x0
  const dy = target.y - y0

  let t = 0
  let rafId = 0
  let hit = false
  let stopped = false

  type Tail = { x: number; y: number; a: number }
  const tail: Tail[] = []

  function drawTail() {
    for (let i = tail.length - 1; i >= 0; i--) {
      const d = tail[i]
      ctx.beginPath()
      ctx.arc(d.x, d.y, isMobile ? 1.6 : 2.2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(107,213,255,${d.a})`
      ctx.fill()
      d.a -= 0.03
      if (d.a <= 0) tail.splice(i, 1)
    }
  }

  function drawMeteor(x: number, y: number) {
    ctx.beginPath()
    ctx.arc(x, y, isMobile ? 4 : 6, 0, Math.PI * 2)
    ctx.fillStyle = '#6BD5FF'
    ctx.shadowColor = 'rgba(107,213,255,1)'
    ctx.shadowBlur = 20
    ctx.fill()
  }

  function clearCanvas() {
    // Wichtig: in CSS-Pixeln löschen (passend zur Transform)
    ctx.clearRect(0, 0, W, H)
  }

  function loop() {
    if (stopped) return

    clearCanvas()

    const p = Math.min(t / frames, 1)
    const e = easeOutQuad(p)
    const x = x0 + dx * e
    const y = y0 + dy * e

    tail.push({ x, y, a: 1 })
    drawTail()
    drawMeteor(x, y)

    if (!hit && p >= 1) {
      hit = true
      cancelAnimationFrame(rafId)
      clearCanvas()        // Meteor komplett weg
      onImpact()           // jetzt das Punkt-M starten
      return
    }

    t++
    rafId = requestAnimationFrame(loop)
  }

  rafId = requestAnimationFrame(loop)

  // Stop-Funktion: Animation abbrechen & weiteren Impact verhindern
  return () => {
    stopped = true
    cancelAnimationFrame(rafId)
  }
}
