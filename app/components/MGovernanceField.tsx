"use client";

import { useEffect, useRef } from "react";

type LineState = "raw" | "governance" | "accepted" | "rejected";

interface Line {
  id: number;
  phase: number;
  offset: number;
  state: LineState;
  progress: number;
  retries: number;
}

export default function MGovernanceField() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const width = 1200;
    const height = 360;
    const centerY = height / 2;
    const gateX = width * 0.5;

    const MAX_LINES = 21;
    const DIRECT_PASS = 7;
    const GOVERNANCE_PASS = 5;

    let t = 0;

    const lines: Line[] = Array.from({ length: MAX_LINES }).map((_, i) => ({
      id: i,
      phase: Math.random() * Math.PI * 2,
      offset: (i - MAX_LINES / 2) * 8,
      state:
        i < DIRECT_PASS
          ? "accepted"
          : i < DIRECT_PASS + GOVERNANCE_PASS
          ? "governance"
          : "raw",
      progress: 0,
      retries: 0,
    }));

    function buildPath(line: Line) {
      let d = "M ";
      const steps = 120;

      for (let i = 0; i <= steps; i++) {
        const p = i / steps;
        let x = p * width;
        let y = centerY + line.offset;

        if (x < gateX) {
          const chaos =
            Math.sin(p * 14 + t * 2 + line.phase) * 22 +
            Math.sin(p * 6 - t * 1.4) * 12;
          y += chaos * (1 - Math.min(line.progress, 1));
        } else {
          const coherence =
            Math.sin(p * Math.PI + t * 0.3) * 4;
          y += coherence;
        }

        if (line.state === "governance" && x > gateX - 40 && x < gateX + 40) {
          y += Math.sin(t * 6 + line.phase) * 18;
        }

        d += `${x.toFixed(2)},${y.toFixed(2)} `;
      }

      return d;
    }

    function updateState(line: Line) {
      if (line.state === "raw" && line.progress > 0.45) {
        line.state = "governance";
        line.progress = 0.4;
      }

      if (line.state === "governance" && line.progress > 0.65) {
        if (line.retries < 1) {
          line.state = "rejected";
          line.retries += 1;
          line.progress = 0.2;
        } else {
          line.state = "accepted";
        }
      }

      if (line.state === "rejected") {
        line.progress -= 0.003;
        if (line.progress <= 0.2) {
          line.state = "governance";
        }
      }
    }

    function animate() {
      t += 0.01;

      lines.forEach((line, i) => {
        if (line.state !== "accepted") {
          line.progress += 0.002;
        } else {
          line.progress = Math.min(line.progress + 0.001, 1);
        }

        updateState(line);

        const path = pathsRef.current[i];
        if (!path) return;

        path.setAttribute("d", buildPath(line));
        path.setAttribute(
          "stroke",
          line.state === "accepted"
            ? "url(#acceptGradient)"
            : line.state === "governance"
            ? "url(#gateGradient)"
            : "url(#rawGradient)"
        );
        path.setAttribute(
          "opacity",
          line.state === "accepted" ? "1" : "0.6"
        );
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <section className="pt-[160px] pb-[160px] relative overflow-hidden">
      <div className="page-center max-w-[1200px]">
        <svg
          ref={svgRef}
          width="100%"
          height="360"
          viewBox="0 0 1200 360"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="rawGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(160,160,160,0.2)" />
              <stop offset="50%" stopColor="rgba(160,160,160,0.4)" />
              <stop offset="100%" stopColor="rgba(160,160,160,0.1)" />
            </linearGradient>

            <linearGradient id="gateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(120,160,255,0.3)" />
              <stop offset="50%" stopColor="rgba(120,160,255,0.8)" />
              <stop offset="100%" stopColor="rgba(120,160,255,0.3)" />
            </linearGradient>

            <linearGradient id="acceptGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
            </linearGradient>

            <filter id="softGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {Array.from({ length: 21 }).map((_, i) => (
            <path
              key={i}
ref={(el) => {
  pathsRef.current[i] = el;
}}
              d=""
              fill="none"
              strokeWidth="2"
              filter="url(#softGlow)"
            />
          ))}
        </svg>
      </div>
    </section>
  );
}
