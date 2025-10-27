'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import '../styles/m-path.css'; // relativer Import, kein Alias

// Button optional client-only laden
const ZenithButton = dynamic(() => import('./components/ZenithButton'), { ssr: false });

// Canvas MUSS client-only sein (nutzt requestAnimationFrame)
const CanvasMeteorAndM = dynamic(() => import('./components/CanvasMeteorAndM'), { ssr: false });

function Page() {
  useEffect(() => {
    (window as any).__mFormedFired = false;
  }, []);

  return (
    <div className="stage">
      <CanvasMeteorAndM />
      {/* ↓ Pfad bleibt wie gehabt */}
      <Link href="/page2"><ZenithButton position="under"  resetFlagOnMount={false} /></Link>
      </div>
  );
}

// Ganze Seite client-only rendern (kein SSR/SSG)
export default dynamic(() => Promise.resolve(Page), { ssr: false });
