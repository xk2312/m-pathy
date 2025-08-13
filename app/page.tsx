// app/page.tsx
'use client'
import { useEffect } from 'react';
import CanvasMeteorAndM from './components/CanvasMeteorAndM'
import ZenithButton from './components/ZenithButton'
import '@/styles/m-path.css'

export default function Page() {
  useEffect(() => { (window as any).__mFormedFired = false }, []);
  return (
    <div className="stage">
      <CanvasMeteorAndM />
      {/* ↓ hier nur den Pfad tauschen */}
      <ZenithButton position="under" onNavigate="/page2" />
    </div>
  )
}
