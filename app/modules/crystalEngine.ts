// app/modules/crystalEngine.ts
// Fixe Container-Bühne (kommt vom Wrapper/Canvas). Geometrie rein relativ
// zu canvas.width/height. Pen-Sweep mit runden Caps/Joins, Valley-Plug, Außenkappen.

type XY = { x: number; y: number }

/* ========= Tunables (für Look & Proportionen) ============================ */
// ca. +18% Gesamtgröße (breiter und etwas höher)
const INNER_W_FACTOR = 0.80   // vorher 0.68 → M größer (seitliche Luft etwas kleiner)

// Vertikale Marken (höher & tiefer → mehr Höhe der Säulen)
const TOP_Y_FACTOR  = 0.32    // vorher 0.36  (weiter rauf)
const BASE_Y_FACTOR = 0.78    // vorher 0.74  (weiter runter)

// V-Kerbe etwas tiefer (näher an der Basis): kleinere Tiefe → größerer valleyY
const VALLEY_DEPTH_MIN     = 90
const VALLEY_DEPTH_FACTOR  = 0.12   // vorher 0.14

// Strichbreite (etwas kräftiger)
const MOBILE_STROKE_PX = 36         // vorher ~28–34
const DESKTOP_STROKE_PX = 64        // vorher ~56

/* ========= Geometrie (nur Canvas, keine Viewport-Infos) ================== */
function computeFixedGeometry(canvasW: number, canvasH: number) {
  const w = canvasW
  const h = canvasH

  const innerW = w * INNER_W_FACTOR
  const leftX  = (w - innerW) / 2
  const rightX = leftX + innerW

  const topY   = h * TOP_Y_FACTOR
  const baseY  = h * BASE_Y_FACTOR

  const midX   = (leftX + rightX) / 2
  const depth  = Math.max(VALLEY_DEPTH_MIN, h * VALLEY_DEPTH_FACTOR)
  const valleyY = baseY - depth

  return { w, h, innerW, leftX, rightX, topY, baseY, midX, valleyY }
}

/** Anchor: linker unterer Punkt des M (rein aus Canvas) */
export function computeMAnchor(w: number, h: number): XY {
  const g = computeFixedGeometry(w, h)
  return { x: g.leftX, y: g.baseY }
}

/* ========= Rendering ===================================================== */
export function buildCrystalM(ctx: CanvasRenderingContext2D, anchor: XY) {
  // CSS-Pixel-Geometrie (nicht der DPR-Backbuffer!)
  const rect = ctx.canvas.getBoundingClientRect()
  const g = computeFixedGeometry(rect.width, rect.height)

  const P = [
    { x: g.leftX,  y: g.baseY },   // 0
    { x: g.leftX,  y: g.topY  },   // 1
    { x: g.midX,   y: g.valleyY }, // 2
    { x: g.rightX, y: g.topY  },   // 3
    { x: g.rightX, y: g.baseY },   // 4
  ] as const

  // Segmente + Differentialgeometrie
  const segs = [
    { a: P[0], b: P[1] },
    { a: P[1], b: P[2] },
    { a: P[2], b: P[3] },
    { a: P[3], b: P[4] },
  ].map(s => {
    const dx = s.b.x - s.a.x
    const dy = s.b.y - s.a.y
    const len = Math.hypot(dx, dy)
    const tx = len ? dx / len : 0
    const ty = len ? dy / len : 0
    const nx =  ty
    const ny = -tx
    return { ...s, dx, dy, len, tx, ty, nx, ny }
  })

  const totalLen = segs.reduce((acc, g) => acc + g.len, 0)

  // Look & Raster
  const isMobile   = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const dotR       = isMobile ? 1.3 : 1.6
  const minGap     = isMobile ? 1.8 : 2.2
  const stepAlong  = Math.max(isMobile ? 2.4 : 2.0, dotR * 2 + (minGap - 0.6))
  const gapAcross  = Math.max(isMobile ? 4.8 : 4.2, dotR * 2 + minGap)
  const widthPx    = (isMobile ? MOBILE_STROKE_PX : DESKTOP_STROKE_PX)
  const rows       = Math.max(1, Math.floor(widthPx / gapAcross))
  const durationSec = 5

  // Zeitsteuerung
  const start = performance.now()
  let prevS = 0
  let raf = 0

  // Spatial Hash (Abstandsgarantie)
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

  // Erster Punkt (Anchor)
  tryDot(anchor.x, anchor.y, dotR + 0.9)

  // Extras (Caps/Joins/Valley/Outer-Caps) vorberechnen
  type Extra = { s: number; x: number; y: number; r?: number }
  const extras: Extra[] = []

  // Start-Cap am P0
  if (segs[0]) {
    pushRoundCap(extras, P[0], -segs[0].tx, -segs[0].ty, rows, gapAcross, dotR, stepAlong, 0)
  }

  // Ecken P1..P3
  for (let i = 1; i < segs.length; i++) {
    const prev = segs[i - 1]
    const next = segs[i]
    const sAtCorner = segs.slice(0, i).reduce((s, g) => s + g.len, 0)

    // Innen-Join
    pushRoundJoin(extras, P[i], prev, next, rows, gapAcross, dotR, stepAlong, sAtCorner)

    // V-Kerbe (nur am Innenknick P2) & außen runde Kappen an P1/P3
    if (i === 2) {
      pushValleyPlug(extras, P[2], segs[1], segs[2], rows, gapAcross, dotR, sAtCorner)
    } else {
      pushOuterCornerCap(extras, P[i], prev, next, rows, gapAcross, dotR, sAtCorner)
    }
  }

  // End-Cap am P4
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

  // Rendering-Reihenfolge entlang des Sweeps
  extras.sort((a, b) => a.s - b.s)
  let extraIdx = 0

  // Animation
  function tick(now: number) {
    const t = Math.min((now - start) / (durationSec * 1000), 1)
    const sTarget = t * totalLen

    // Linienpunkte
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

    // Extras (Caps/Joins/Plug)
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

  /* ================= Helpers ============================================ */

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

  // runder Start-/End-Cap (Halbkreis)
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
    const arcEnd   = arcStart + Math.PI

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

  // runder Innen-Join (Sektor)
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
    const aIn  = Math.atan2(prev.ny, prev.nx)
    const aOut = Math.atan2(next.ny, next.nx)

    let tIn  = Math.atan2(prev.ty, prev.tx)
    let tOut = Math.atan2(next.ty, next.tx)
    while (tOut - tIn <= -Math.PI) tOut += 2 * Math.PI
    while (tOut - tIn >   Math.PI) tOut -= 2 * Math.PI
    const turn = tOut - tIn

    let delta = aOut - aIn
    while (delta <= -Math.PI) delta += 2 * Math.PI
    while (delta >   Math.PI) delta -= 2 * Math.PI

    const useLargeArc = Math.abs(turn) > (Math.PI / 2)
    let startAngle = aIn
    let endAngle   = aIn + delta
    if (useLargeArc) {
      if (delta > 0) endAngle = aIn - (2 * Math.PI - delta)
      else           endAngle = aIn + (2 * Math.PI + delta)
    }

    const radius   = ((nRows - 1) * across) / 2
    const ringStep = Math.max(rDot * 2 + minGap, across * 0.9)
    const rings    = Math.max(1, Math.floor(radius / ringStep))
    const angStep  = Math.max((rDot * 2 + minGap) / Math.max(radius, 1), Math.PI / 36)

    const dir = endAngle >= startAngle ? 1 : -1
    let seq = 0
    for (let r = 0; r <= rings; r++) {
      const rad = r * ringStep
      for (let a = startAngle; dir > 0 ? a <= endAngle : a >= endAngle; a += dir * angStep) {
        out.push({
          s: sAtCorner + 0.001 * (seq++),
          x: C.x + Math.cos(a) * rad,
          y: C.y + Math.sin(a) * rad
        })
      }
    }
    out.push({ s: sAtCorner + 0.002 * (seq++), x: C.x, y: C.y, r: rDot })
  }

  // weicher Plug in der V-Kerbe
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
    let bx = -prev.tx + next.tx
    let by = -prev.ty + next.ty
    const bl = Math.hypot(bx, by) || 1; bx /= bl; by /= bl

    const innerR = ((nRows - 1) * across) * 0.48
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

  // runde Außenkappe an P1/P3
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

    let bx = prev.nx + next.nx
    let by = prev.ny + next.ny
    const bl = Math.hypot(bx, by) || 1; bx /= bl; by /= bl

    const baseAngle = Math.atan2(by, bx)
    const arcStart  = baseAngle - Math.PI / 2
    const arcEnd    = baseAngle + Math.PI / 2

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
// === M-FINAL-EVENT via eigener RAF-Progress ===
let start: number | null = null;
let notified = false;

const DURATION_MS = 1800;          // Dauer bis M fertig gezeichnet (anpassen)
const AFTER_FINISH_DELAY_MS = 5000; // EXTRA-Wartezeit NACH Fertig (anpassen)

function tick(ts: number) {
  if (start === null) start = ts;

  const elapsed = ts - start;
  const progress = elapsed / DURATION_MS; // kann >1 werden

  // --- hier dein normales Zeichnen mit progress (0..1 clampen wenn nötig) ---
  // drawM(Math.min(1, progress));

  // Sobald fertig (>=1), GENAU EINMAL melden – nach gewünschter Zusatz-Wartezeit
  if (!notified && progress >= 1) {
    notified = true;
    setTimeout(() => {
      (window as any).__mFormedFired = true;
      window.dispatchEvent(new CustomEvent('m:formed'));
    }, AFTER_FINISH_DELAY_MS);
    return; // Loop stoppen
  }

  requestAnimationFrame(tick);
}

// Loop starten
requestAnimationFrame(tick);
