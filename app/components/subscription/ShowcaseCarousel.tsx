// components/subscription/ShowcaseCarousel.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

type Slide = { key:string; title:string; sub:string; body: JSX.Element; };

export default function ShowcaseCarousel(){
  const { t } = useLang();
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // ── Reduced-Motion Guard
  const [rm, setRm] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setRm(mq.matches);
    update();
    // older Safari fallback
    if (mq.addEventListener) mq.addEventListener("change", update);
    else (mq as any).addListener?.(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else (mq as any).removeListener?.(update);
    };
  }, []);

  const slides: Slide[] = [
    {
      key:"s1",
      title: t("s1_title"),
      sub: t("s1_sub"),
      body: (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Tile label="Campaign Plan" />
          <Tile label="Smart Landing" />
          <Tile label="Email Flow" />
        </div>
      )
    },
    {
      key:"s2",
      title: t("s2_title"),
      sub: t("s2_sub"),
      body: (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar label="Biologist" /><span className="text-white/80">×</span><Avatar label="Chemist" />
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <ol className="list-decimal pl-5 space-y-1 text-white/80">
              <li>NEM Step 1 — Scope & Constraints</li>
              <li>NEM Step 2 — Design & Validation</li>
              <li>NEM Step 3 — Review & Report</li>
            </ol>
            <p className="mt-3 text-white/60 text-sm">{t("s2_why")}</p>
          </div>
        </div>
      )
    },
    {
      key:"s3",
      title: t("s3_title"),
      sub: t("s3_sub"),
      body: (
        <div className="mt-4 grid grid-cols-1 gap-3">
          <Frame title="Ledger" />
          <Frame title="Blocks" />
          <Frame title="Consensus + mini JSON" />
        </div>
      )
    },
  ];

  // ── basic swipe (belassen)
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    let x0=0, x=0;
    function onTouchStart(e:TouchEvent){ x0 = e.touches[0].clientX; }
    function onTouchMove(e:TouchEvent){ x = e.touches[0].clientX; }
    function onTouchEnd(){
      const dx = x - x0;
      if (dx < -40) setIdx(i=>Math.min(i+1, slides.length-1));
      if (dx >  40) setIdx(i=>Math.max(i-1, 0));
    }
    el.addEventListener("touchstart", onTouchStart, {passive:true});
    el.addEventListener("touchmove", onTouchMove, {passive:true});
    el.addEventListener("touchend", onTouchEnd);
    return ()=> {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [slides.length]);

  // ── Panel Fade-In (transform/opacity ≤ 200 ms; deaktiviert bei RRM)
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (rm) return; // RRM: keine Animation
    const el = panelRef.current;
    if (!el) return;
    el.style.willChange = "opacity, transform";
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    el.style.transition = "opacity 180ms var(--ease), transform 180ms var(--ease)";
    // nächste Frame → Zielzustand
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    // Cleanup
    return () => {
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [idx, rm]);

  return (
    <div id="showcases" ref={ref} className="max-w-xl mx-auto">
      {/* 🔹 Tab-Leiste – A11y komplett mit Keyboard */}
      <Tabs
        labels={slides.map(s => s.title)}
        idx={idx}
        setIdx={setIdx}
      />

      {/* Panel mit korrekter A11y-Semantik */}
      <h3 className="mt-4 text-2xl font-semibold" id={`panel-title-${idx}`}>
        {slides[idx].title}
      </h3>
      <p className="mt-1 text-white/70">{slides[idx].sub}</p>

      <div
        role="tabpanel"
        id={`panel-${idx}`}
        aria-labelledby={`tab-${idx}`}
        tabIndex={0}
        className="outline-none"
        ref={panelRef}
      >
        {slides[idx].body}
      </div>

      {/* Sekundär-Nav (Dots) bleibt vorerst erhalten */}
      <Dots n={slides.length} idx={idx} setIdx={setIdx} />
    </div>
  );
}

function Chip({children}:{children:React.ReactNode}){
  return <span className="inline-block text-sm px-3 py-1 rounded-full bg-white/10 border border-white/15">{children}</span>;
}

function Tabs({ labels, idx, setIdx }:{
  labels: string[]; idx:number; setIdx:(v:number)=>void;
}){
  const btnRefs = useRef<Array<HTMLButtonElement|null>>([]);

  function focusTab(i:number){
    const btn = btnRefs.current[i];
    if (btn) btn.focus();
  }
  function activate(i:number){
    const next = Math.max(0, Math.min(labels.length - 1, i));
    setIdx(next);
    requestAnimationFrame(()=> focusTab(next));
  }
  function onKeyDown(e:React.KeyboardEvent){
    const { key } = e;
    if (key === "ArrowRight") { e.preventDefault(); activate(idx + 1); }
    else if (key === "ArrowLeft") { e.preventDefault(); activate(idx - 1); }
    else if (key === "Home") { e.preventDefault(); activate(0); }
    else if (key === "End") { e.preventDefault(); activate(labels.length - 1); }
    else if (key === "Enter" || key === " ") { e.preventDefault(); activate(idx); }
  }

  return (
    <div
      role="tablist"
      aria-label="Showcases"
      onKeyDown={onKeyDown}
      className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-white/10 p-1 bg-white/5 text-white"
    >
      {labels.map((label, i) => {
        const selected = i === idx;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${i}`}
            id={`tab-${i}`}
            ref={(el) => { btnRefs.current[i] = el; }}  // returns void
            onClick={() => activate(i)}
            className={[
              "px-3 py-1.5 rounded-xl text-sm leading-none whitespace-nowrap font-medium",
              // sanfter Hover-Lift (compositor-sicher)
              "transition-transform duration-150 hover:-translate-y-px",
              "focus-visible:outline-2 focus-visible:outline-cyan-300/55 focus-visible:outline-offset-2",
              selected
                ? "bg-white/20 text-white"
                : "bg-transparent text-white/80 hover:text-white"
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Tile({label}:{label:string}){
  return <div className="rounded-xl border border-white/10 p-4 text-white/80">{label}</div>;
}
function Avatar({label}:{label:string}){
  return <div className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-sm">{label}</div>;
}
function Frame({title}:{title:string}){
  return <div className="rounded-xl border border-white/10 p-4 text-white/80">{title}</div>;
}
function Dots({n, idx, setIdx}:{n:number; idx:number; setIdx:(v:number)=>void;}){
  return (
    <div className="mt-4 flex items-center gap-2" aria-hidden="true">
      {Array.from({length:n}).map((_,i)=>(
        <button key={i} onClick={()=>setIdx(i)} aria-label={`Slide ${i+1}`}
          className={`h-2.5 w-2.5 rounded-full ${i===idx?"bg-white":"bg-white/25"}`} />
      ))}
    </div>
  );
}
