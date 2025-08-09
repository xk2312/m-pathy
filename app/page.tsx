'use client'

import '@/styles/m-path.css'
import CanvasMeteorAndM from './components/CanvasMeteorAndM'

export default function Page() {
  return (
    <div style={{
      margin: 0, padding: 0, overflow: 'hidden',
      width: '100vw', height: '100vh', backgroundColor: '#000'
    }}>
      <CanvasMeteorAndM />
    </div>
  )
}
