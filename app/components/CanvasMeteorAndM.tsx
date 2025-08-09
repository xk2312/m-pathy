'use client'

import React, { useEffect, useRef } from 'react'
import '@/styles/m-path.css'
import { startMeteorSequence } from '@/modules/meteorEngine'
import { buildCrystalM, computeMAnchor } from '@/modules/crystalEngine'

function CanvasMeteorAndM() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // DPR-aware Resize
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Anchor exakt aus den M-Parametern ableiten
    const rect = canvas.getBoundingClientRect()
    const anchor = computeMAnchor(rect.width, rect.height)

    const stop = startMeteorSequence(
      ctx,
      anchor,
      () => {
        // 1 Sekunde stehen lassen, dann aufbauen
        setTimeout(() => buildCrystalM(ctx, anchor), 1000)
      }
    )

    return () => {
      window.removeEventListener('resize', resize)
      if (typeof stop === 'function') stop()
    }
  }, [])

  return <canvas ref={canvasRef} className="m-canvas" />
}

export default CanvasMeteorAndM
