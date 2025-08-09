// app/modules/crystalEngine.ts
type XY = { x: number; y: number }

/** Linker unterer Anker exakt wie im M */
export function computeMAnchor(w: number, h: number): XY {
  const leftX = w * 0.28
  const baseY = h * 0.74
  return { x: leftX, y: baseY }
}

/**
 * Pen-Sweep: Ein digitaler Stift fährt den Pfad P0→P1→P2→P3→P4 in ~5 s ab
 * und setzt unterwegs Punkte (mehrere parallele Reihen = Strichbreite)
 * mit Mindestabstand. Runde Caps + runde Joins; Valley-Plug füllt die V-Kerbe.
 * Zusätzlich: runde Außenkappen an den oberen Ecken (P1, P3).
 */
export function buildCrystalM(ctx: CanvasRenderingContext2D, anchor: XY) {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const { width: w, height: h } = ctx.canvas.getBoundingClientRect()

  // Proportionen (aufrechte Säulen, edel)
  const baseY = h * 0.74
  const topY = h * 0.36
  const leftX = w * 0.28
  const rightX = w * 0.28 + Math.max(360, w * 0.32)
  const midX = (leftX + rightX) / 2
  const valleyY = baseY - Math.max(90, h * 0.14)

  const P = [
    { x: leftX, y: baseY }, // 0
    { x: leftX, y: topY }, // 1
    { x: midX, y: valleyY }, // 2
    { x: rightX, y: topY }, // 3
    { x: rightX, y: baseY } // 4
  ] as const

  // Segmente + Geometrie
  const segs = [
    { a: P[0], b: P[1] },
    { a: P[1], b: P[2] },
    { a: P[2], b: P[3] },
    { a: P[3], b: P[4] }
  ].map(s => {
    const dx = s.b.x - s.a.x
    const dy = s.b.y - s.a.y
    const len = Math.hypot(dx, dy)
    const tx = len ? dx / len : 0
    const ty = len ? dy / len : 0
    const nx = ty
    const ny = -tx
    return { ...s, dx, dy, len, tx, ty, nx, ny }
  })

  const totalLen = segs.reduce((s, g) => s + g.len, 0)

  // Look & Rasterabstände
  const dotR = isMobile ? 1.3 : 1.6
  const minGap = isMobile ? 1.8 : 2.2
  const stepAlong = Math.max(isMobile ? 2.4 : 2.0, dotR * 2 + (minGap - 0.6))
  const gapAcross = Math.max(isMobile ? 4.8 : 4.2, dotR * 2 + minGap)
  const widthPx = isMobile ? 28 : 56
  const rows = Math.max(1, Math.floor(widthPx / gapAcross))
  const durationSec = 5

  // Zeitsteuerung
  const start = performance.now()
  let prevS = 0
  let raf = 0

  // Spatial Hash (Abstands-Garantie)
  const cell = Math.min(stepAlong, gapAcross) * 0.9
  const placed = new Set<string>()
  const key = (x: number, y: number) => `${Math.round(x / cell)}:${Math.round(y / cell)}`
  const drawDot = (x: number, y: number, r: number = dotR) => {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = '#6BD5FF'
    ctx.shadowColor = 'rgba(107,213,255,0.55)'
    ctx.shadowBlur = 4
    ctx.fill()
  }
  const tryDot = (x: number, y: number, r: number = dotR) => {
    const k = key(x, y)
    if (placed.has(k)) return false
    placed.add(k)
    drawDot(x, y, r)
    return true
  }

  // Erstpunkt (Anchor)
  tryDot(anchor.x, anchor.y, dotR + 0.9)

  // Extras (Caps/Joins/Valley-Plug/Outer-Caps)
  type Extra = { s: number; x: number; y: number; r?: number }
  const extras: Extra[] = []

  // Start-Cap (Halbkreis am P0)
  if (segs[0]) {
    pushRoundCap(extras, P[0], -segs[0].tx, -segs[0].ty, rows, gapAcross, dotR, stepAlong, 0)
  }

  // Joins + Outer-Caps + Valley-Plug
  for (let i = 1; i < segs.length; i++) {
    const prev = segs[i - 1]
    const next = segs[i]
    const sAtCorner = segs.slice(0, i).reduce((s, g) => s + g.len, 0)

    // Innen-Join
    pushRoundJoin(extras, P[i], prev, next, rows, gapAcross, dotR, stepAlong, sAtCorner)

    // Tal (innen) auffüllen
    if (i === 2) {
      pushValleyPlug(extras, P[2], segs[1], segs[2], rows, gapAcross, dotR, sAtCorner)
    } else {
      // Obere Außenkappen an P1 und P3
      pushOuterCornerCap(extras, P[i], prev, next, rows, gapAcross, dotR, sAtCorner)
    }
  }

  // End-Cap (Halbkreis am P4)
  const lenBeforeEnd = segs.reduce((s, g) => s + g.len, 0)
  pushRoundCap(
    extras,
    P[4],
    segs[segs.length - 1].tx,
    segs[segs.length - 1].ty,
    rows,
    gapAcross,
    dotR,
    stepAlong,
    lenBeforeEnd
  )

  // Sortieren, damit die Einblendung zeitlich in den Sweep passt
  extras.sort((a, b) => a.s - b.s)
  let extraIdx = 0

  // PEN-SWEEP
  function tick(now: number) {
    const t = Math.min((now - start) / (durationSec * 1000), 1)
    const sTarget = t * totalLen

    // entlang des Pfads Punkte setzen (mehrere Reihen = Strichbreite)
    for (let s = prevS; s <= sTarget; s += stepAlong) {
      const pos = pointAtLength(s)
      if (!pos) continue
      const { x, y, nx, ny } = pos
      const half = (rows - 1) / 2
      for (let r = 0; r < rows; r++) {
        const offset = (r - half) * gapAcross
        tryDot(x + nx * offset, y + ny * offset)
      }
    }
    prevS = sTarget

    // Extras, deren s erreicht ist
    while (extraIdx < extras.length && extras[extraIdx].s <= sTarget) {
      const e = extras[extraIdx++]
      tryDot(e.x, e.y, e.r ?? dotR)
    }

    if (t < 1 || extraIdx < extras.length) {
      raf = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(raf)
    }
  }
  raf = requestAnimationFrame(tick)

  // ---------- Helpers -------------------------------------------------------

  function pointAtLength(
    s: number
  ): { x: number; y: number; nx: number; ny: number } | null {
    let acc = 0
    for (const g of segs) {
      if (s <= acc + g.len) {
        const d = s - acc
        const t = g.len ? d / g.len : 0
        const x = g.a.x + g.dx * t
        const y = g.a.y + g.dy * t
        return { x, y, nx: g.nx, ny: g.ny }
      }
      acc += g.len
    }
    const last = segs[segs.length - 1]
    return { x: last.b.x, y: last.b.y, nx: last.ny, ny: -last.nx }
  }

  // runder End-/Start-Cap (Halbkreis)
  function pushRoundCap(
    out: Extra[],
    C: XY,
    tx: number,
    ty: number,
    nRows: number,
    across: number,
    rDot: number,
    along: number,
    sBase: number
  ) {
    const half = (nRows - 1) / 2
    const radius = half * across
    const arcStart = Math.atan2(-ty, -tx) - Math.PI / 2
    const arcEnd = arcStart + Math.PI

    const ringStep = Math.max(rDot * 2 + minGap, across * 0.9)
    const rings = Math.max(1, Math.floor(radius / ringStep))
    let seq = 0
    for (let r = 0; r <= rings; r++) {
      const rad = r * ringStep
      const circ = 2 * Math.PI * Math.max(rad, 1)
      const pts = Math.max(6, Math.floor(circ / (rDot * 2 + minGap)))
      for (let i = 0; i <= pts; i++) {
        const a = arcStart + (i / pts) * (arcEnd - arcStart)
        out.push({
          s: sBase + 0.001 * (seq++),
          x: C.x + Math.cos(a) * rad,
          y: C.y + Math.sin(a) * rad
        })
      }
    }
  }

  // runder Join (Sektor) zwischen zwei Segmenten am Eckpunkt C (inkl. Large-Arc)
  function pushRoundJoin(
    out: Extra[],
    C: XY,
    prev: any,
    next: any,
    nRows: number,
    across: number,
    rDot: number,
    along: number,
    sAtCorner: number
  ) {
    const aIn = Math.atan2(prev.ny, prev.nx)
    const aOut = Math.atan2(next.ny, next.nx)

    // Tangenten (für konkav/konvex)
    let tIn = Math.atan2(prev.ty, prev.tx)
    let tOut = Math.atan2(next.ty, next.tx)
    while (tOut - tIn <= -Math.PI) tOut += 2 * Math.PI
    while (tOut - tIn > Math.PI) tOut -= 2 * Math.PI
    const turn = tOut - tIn

    // Winkel-Differenz der Normalen auf [-π,π]
    let delta = aOut - aIn
    while (delta <= -Math.PI) delta += 2 * Math.PI
    while (delta > Math.PI) delta -= 2 * Math.PI

    // konkav → großen Bogen nehmen
    const useLargeArc = Math.abs(turn) > Math.PI / 2
    let startAngle = aIn
    let endAngle = aIn + delta
    if (useLargeArc) {
      if (delta > 0) endAngle = aIn - (2 * Math.PI - delta)
      else endAngle = aIn + (2 * Math.PI + delta)
    }

    const radius = ((nRows - 1) * across) / 2
    const ringStep = Math.max(rDot * 2 + minGap, across * 0.9)
    const rings = Math.max(1, Math.floor(radius / ringStep))
    const angStep = Math.max((rDot * 2 + minGap) / Math.max(radius, 1), Math.PI / 36)

    const dir = endAngle >= startAngle ? 1 : -1
    let seq = 0
    for (let r = 0; r <= rings; r++) {
      const rad = r * ringStep
      for (
        let a = startAngle;
        dir > 0 ? a <= endAngle : a >= endAngle;
        a += dir * angStep
      ) {
        out.push({
          s: sAtCorner + 0.001 * (seq++),
          x: C.x + Math.cos(a) * rad,
          y: C.y + Math.sin(a) * rad
        })
      }
    }
    out.push({ s: sAtCorner + 0.002 * (seq++), x: C.x, y: C.y, r: rDot })
  }

  // füllt die innere V-Ecke (Tal) weich
  function pushValleyPlug(
    out: Extra[],
    C: XY,
    prev: any,
    next: any,
    nRows: number,
    across: number,
    rDot: number,
    sAtCorner: number
  ) {
    // Innen-Bisektor
    let bx = -prev.tx + next.tx
    let by = -prev.ty + next.ty
    const bl = Math.hypot(bx, by) || 1
    bx /= bl
    by /= bl

    const innerR = (nRows - 1) * across * 0.48
    const cx = C.x + bx * (innerR * 0.35)
    const cy = C.y + by * (innerR * 0.35)

    const ringStep = Math.max(rDot * 2.0, across * 0.9)
    const rings = Math.max(2, Math.floor(innerR / ringStep))

    let seq = 0
    for (let r = 0; r <= rings; r++) {
      const rad = (r / rings) * innerR
      const circ = 2 * Math.PI * Math.max(rad, 1)
      const step = Math.max(rDot * 2.0, across * 0.9)
      const n = Math.max(8, Math.floor(circ / step))
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        out.push({
          s: sAtCorner + 0.001 * (seq++),
          x: cx + Math.cos(a) * rad,
          y: cy + Math.sin(a) * rad
        })
      }
    }
    out.push({ s: sAtCorner + 0.002 * (seq++), x: cx, y: cy, r: rDot })
  }

  // runde Außenkappe an konvexen oberen Ecken (P1, P3)
  function pushOuterCornerCap(
    out: Extra[],
    C: XY,
    prev: any,
    next: any,
    nRows: number,
    across: number,
    rDot: number,
    sAtCorner: number
  ) {
    const radius = ((nRows - 1) * across) / 2

    // Außen-Bisektor aus den linken Normalen
    let bx = prev.nx + next.nx
    let by = prev.ny + next.ny
    const bl = Math.hypot(bx, by) || 1
    bx /= bl
    by /= bl

    // Halbkreis nach außen (orthogonal zum Bisektor)
    const baseAngle = Math.atan2(by, bx)
    const arcStart = baseAngle - Math.PI / 2
    const arcEnd = baseAngle + Math.PI / 2

    const ringStep = Math.max(rDot * 2 + minGap, across * 0.9)
    const rings = Math.max(1, Math.floor(radius / ringStep))
    let seq = 0
    for (let r = 0; r <= rings; r++) {
      const rad = r * ringStep
      const circ = 2 * Math.PI * Math.max(rad, 1)
      const pts = Math.max(6, Math.floor(circ / (rDot * 2 + minGap)))
      for (let i = 0; i <= pts; i++) {
        const a = arcStart + (i / pts) * (arcEnd - arcStart)
        out.push({
          s: sAtCorner + 0.001 * (seq++),
          x: C.x + Math.cos(a) * rad,
          y: C.y + Math.sin(a) * rad
        })
      }
    }
  }
}
