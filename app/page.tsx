'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import '../styles/m-path.css';

// Optional: Button auch client-only laden (schadet nicht)
const ZenithButton = dynamic(() => import('./components/ZenithButton'), { ssr: false });

// Wichtig: Canvas darf auf dem Server nie geladen/gerendert werden
const CanvasMeteorAndM = dynamic(() => import('./components/CanvasMeteorAndM'), { ssr: false });

// Deine gewohnte Komponente
function Page() {
  useEffect(() => {
    (window as any).__mFormedFired = false;
  }, []);

  return (
    <div className="stage">
      <CanvasMeteorAndM />
      {/* ↓ Pfad bleibt wie gehabt */}
      <ZenithButton position="under" onNavigate="/page2" />
    </div>
  );
}

// Der Trick, der die GESAMTE Seite client-only macht (kein SSR/SSG → kein requestAnimationFrame auf dem Server)
export default dynamic(() => Promise.resolve(Page), { ssr: false });

// Hinweis: KEIN `export const revalidate = 0` und KEIN `export const dynamic = 'force-dynamic'` hier,
// weil diese Optionen Server-only sind und in einer Client-Datei Fehler verursachen.
