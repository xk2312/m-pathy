'use client'

import React, { useEffect, useRef } from 'react'
import { startMeteorSequence } from '@/modules/meteorEngine'
import { buildCrystalM, computeMAnchor } from '@/modules/crystalEngine'
import '@/styles/m-path.css'

export default function CanvasMeteorAndM() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current!
    const canvas  = canvasRef.current!
    const ctx = canvas.getContext('2d')
    if (!wrapper || !canvas || !ctx) return

    // Canvas an Wrapper koppeln (DPR-scharf)
    const fit = () => {
      const dpr = window.devicePixelRatio || 1
      const w = Math.floor(wrapper.clientWidth)
      const h = Math.floor(wrapper.clientHeight)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      canvas.width  = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)   // keine Offsets
      ctx.clearRect(0, 0, w, h)                // sauber wischen
    }

    // (Optional) Resize debounce
    let resizeT = 0 as number | ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeT as number)
      resizeT = setTimeout(() => {
        fit()
        const anchor = computeMAnchor(wrapper.clientWidth, wrapper.clientHeight)
        buildCrystalM(ctx, anchor)            // nach Resize direkt M zeigen
      }, 120)
    }

    // Initial
    fit()
    let anchor = computeMAnchor(wrapper.clientWidth, wrapper.clientHeight)

    // Sequenz: Meteor -> M
    const stop = startMeteorSequence(ctx, anchor, () => {
      // Falls während des Flugs resized wurde: Anchor frisch berechnen
      anchor = computeMAnchor(wrapper.clientWidth, wrapper.clientHeight)
      ctx.clearRect(0, 0, canvas.width, canvas.height) // Meteor vollständig weg
      buildCrystalM(ctx, anchor)
    })

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (typeof stop === 'function') stop()
    }
  }, [])

  return (
    <div id="m-wrapper" ref={wrapperRef}>
      <canvas ref={canvasRef} className="m-canvas" />
    </div>
  )
}
