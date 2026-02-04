"use client";

import { useEffect, useRef } from "react";

export default function MOceanField() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
const path = pathRef.current as SVGPathElement;
  if (!path) return;

  let t = 0;

  const points = 260;
  const width = 1200;
  const height = 320;
  const centerY = height / 2;

  function animate() {
    t += 0.002;

    let d = "M ";

    for (let i = 0; i <= points; i++) {
      const p = i / points;
      const x = p * width;

      const chaos =
        Math.sin(p * 18 + t * 3) * 28 +
        Math.sin(p * 7 - t * 1.5) * 16;

      const coherence = (Math.sin(t * 0.4) + 1) / 2;

      const channel =
        Math.sin(p * Math.PI * 2 + t) * 22;

      const y =
        centerY +
        chaos * (1 - coherence) +
        channel * coherence;

      d += `${x.toFixed(2)},${y.toFixed(2)} `;
    }

    path.setAttribute("d", d);
    requestAnimationFrame(animate);
  }

  animate();
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
                id="oceanGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="30%" stopColor="rgba(140,180,255,0.25)" />
                <stop offset="50%" stopColor="rgba(120,160,255,0.85)" />
                <stop offset="70%" stopColor="rgba(140,180,255,0.25)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>

              <filter id="oceanGlow">
                <feGaussianBlur stdDeviation="8" result="blur" />
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
              stroke="url(#oceanGradient)"
              strokeWidth="2"
              filter="url(#oceanGlow)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
