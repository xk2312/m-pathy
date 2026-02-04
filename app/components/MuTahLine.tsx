"use client";

import { useEffect, useRef } from "react";

export default function MuTahLine() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    let frameId: number;
    let t = 0;

    const points = 120;
    const width = 1200;
    const height = 260;
    const centerY = height / 2;

    const animate = () => {
      t += 0.004;

      let d = "M ";

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;

        const wave1 = Math.sin(i * 0.12 + t * 2);
        const wave2 = Math.sin(i * 0.04 - t);
        const morph = (Math.sin(t) + 1) / 2;

        const amplitude = 6 + morph * 18;

        const y =
          centerY +
          wave1 * amplitude +
          wave2 * amplitude * 0.6;

        d += `${x.toFixed(2)},${y.toFixed(2)} `;
      }

      path.setAttribute("d", d);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className="pt-[160px] pb-[160px] relative overflow-hidden">
      <div className="page-center max-w-[1200px]">
        <div className="relative h-[260px]">
          <svg
            ref={svgRef}
            width="100%"
            height="260"
            viewBox="0 0 1200 260"
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="20%" stopColor="rgba(180,200,255,0.35)" />
                <stop offset="50%" stopColor="rgba(120,160,255,0.9)" />
                <stop offset="80%" stopColor="rgba(180,200,255,0.35)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>

              <filter id="softGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              ref={pathRef}
              d=""
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              filter="url(#softGlow)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
