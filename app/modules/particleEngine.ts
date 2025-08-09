// /modules/meteorEngine.ts
export function startMeteorSequence(
  ctx: CanvasRenderingContext2D,
  onImpact: () => void
) {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  // Startposition oben rechts
  let meteorX = width * 1.1
  let meteorY = -height * 0.1

  // Ziel: linke untere Ecke vom M
  const targetX = width * 0.3
  const targetY = height * 0.7

  // Geschwindigkeit
  const dx = (targetX - meteorX) / 120 // Frames
  const dy = (targetY - meteorY) / 120

  // Schweifpartikel
  const trail: { x: number; y: number; alpha: number }[] = []

  let frame = 0
  let impactTriggered = false

  const animate = () => {
    ctx.clearRect(0, 0, width, height)

    // Schweif zeichnen
    for (let i = trail.length - 1; i >= 0; i--) {
      const t = trail[i]
      ctx.beginPath()
      ctx.arc(t.x, t.y, isMobile ? 1.5 : 2.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 215, 0, ${t.alpha})`
      ctx.fill()
      t.alpha -= 0.02
      if (t.alpha <= 0) trail.splice(i, 1)
    }

    // Meteorit zeichnen
    ctx.beginPath()
    ctx.arc(meteorX, meteorY, isMobile ? 4 : 6, 0, Math.PI * 2)
    ctx.fillStyle = 'gold'
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)'
    ctx.shadowBlur = 15
    ctx.fill()

    // Neue Schweifspur hinzufügen
    trail.push({ x: meteorX, y: meteorY, alpha: 1 })

    // Bewegung
    meteorX += dx
    meteorY += dy

    frame++

    // Impact-Erkennung
    const dist = Math.hypot(meteorX - targetX, meteorY - targetY)
    if (!impactTriggered && dist < 2) {
      impactTriggered = true
      onImpact()
      return
    }

    requestAnimationFrame(animate)
  }

  animate()
}
