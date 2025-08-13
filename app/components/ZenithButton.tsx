'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ZenithButton.module.css';

type Position = 'under' | 'over';

interface Props {
  position?: Position;
  onNavigate?: string;   // z.B. '/start' oder '#next'
  appearDelayMs?: number; // optional: Verzögerung nach m:formed (Default 0)
  resetFlagOnMount?: boolean; // HMR-Fix: default true
}

// TS: Window-Flag typisieren
declare global {
  interface Window { __mFormedFired?: boolean }
}

export default function ZenithButton({
  position = 'under',
  onNavigate,
  appearDelayMs = 0,
  resetFlagOnMount = true,
}: Props) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // HMR/Navigation-Reset, damit der Button nicht "kleben" bleibt
    if (resetFlagOnMount) window.__mFormedFired = false;

    const show = () => {
      if (appearDelayMs > 0) {
        const t = setTimeout(() => setVisible(true), appearDelayMs);
        return () => clearTimeout(t);
      }
      setVisible(true);
      return undefined;
    };

    // Falls das M schon fertig war (z. B. schneller Dispatch), sofort anzeigen
    if (window.__mFormedFired) {
      const cleanup = show();
      return cleanup;
    }

    // Einmalig auf das Canvas-Ereignis warten
    const onFormed = () => {
      window.__mFormedFired = true;
      show();
    };
    window.addEventListener('m:formed', onFormed, { once: true });
    return () => window.removeEventListener('m:formed', onFormed);
  }, [appearDelayMs, resetFlagOnMount]);

  // GAR NICHT rendern, bis sichtbar
  if (!visible) return null;

  const burstDust = (x: number, y: number, count = 22) => {
    const root = rootRef.current;
    if (!root) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = styles.zenithDust;
      const angle = (Math.PI * 2) * (i / count) + Math.random() * 0.6;
      const radius = 40 + Math.random() * 90;
      const dx = Math.cos(angle) * radius;
      const dy = (Math.sin(angle) * radius) - 120;
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.left = `${x - 3}px`;
      p.style.top  = `${y - 3}px`;
      p.style.animation = `zenithDust ${0.7 + Math.random() * 0.5}s ease forwards`;
      root.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 + window.scrollX;
    const cy = rect.top  + rect.height / 2 + window.scrollY;
    burstDust(cx, cy, 26);
    e.currentTarget.classList.add(styles.isExiting);
    setTimeout(() => {
      if (!onNavigate) return;
      if (onNavigate.startsWith('#')) {
        document.querySelector(onNavigate)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(onNavigate);
      }
    }, 520);
  };

  return (
    <div className={styles.scope} data-position={position} ref={rootRef}>
      <button className={styles.btn} onClick={handleClick} aria-label="Weiter">
        <span className={styles.label}>DIVE DEEPER</span>
        <span className={`${styles.crystal} ${styles.c1}`} />
        <span className={`${styles.crystal} ${styles.c2}`} />
        <span className={`${styles.crystal} ${styles.c3}`} />
      </button>
    </div>
  );
}
