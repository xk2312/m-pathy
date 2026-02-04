"use client";

import { useEffect, useRef } from "react";

export default function MuTahSpiral() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    let t = 0;

    const points = 420;
    const centerX = 600;
    const centerY = 160;

    const maxRadius = 140;
    const turns = 3.2;

    let raf: number;

    const animate = () => {
      t += 0.0016;

      let d = "";

      for (let i = 0; i <= points; i++) {
        const p = i / points;

        // Spiral core math
        const theta = p * Math.PI * 2 * turns + t;
        const radius = maxRadius * (1 - p);

        // Perspective projection
        const depth = Math.pow(1 - p, 1.6);
        const perspective = 0.65 + depth * 0.35;

        const x =
          centerX +
          Math.cos(theta) * radius * perspective;

        const y =
          centerY +
          Math.sin(theta) * radius * perspective * 0.55;

        d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
      }

      path.setAttribute("d", d);
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="pt-[160px] pb-[160px] relative overflow-hidden">
      <div className="page-center max-w-[1200px]">
        <div className="relative h-[320px]">
          <svg
            ref={svgRef}
            width="100%"
            height="320"
            viewBox="0 0 1200 320"
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <defs>
              <linearGradient
                id="spiralGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(120,160,255,0.85)" />
                <stop offset="60%" stopColor="rgba(160,190,255,0.35)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>

              <filter id="spiralFog">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              ref={pathRef}
              fill="none"
              stroke="url(#spiralGradient)"
              strokeWidth="1.6"
              filter="url(#spiralFog)"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
