// app/maios/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Navigation from "@/app/components/navigation/navigation";
import Footer from "@/app/components/subscription/footer";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as maiosDict } from "@/lib/i18n.maios";
import { usePathname } from "next/navigation";
import MuTahLine from "@/app/components/MuTahLine";


export default function MaiosPage() {
  const { lang } = useLang();
  const t = (maiosDict as any)[lang] ?? maiosDict.en;
  const pathname = usePathname();


  // Sequenzdefinition
const sequence = [
  { letter: "M", word: "Modular" },
  { letter: "A", word: "Artificial" },
  { letter: "I", word: "Intelligence" },
  { letter: "O", word: "Operating" },
  { letter: "S", word: "System" }
];

const svgRef = useRef<SVGSVGElement | null>(null);
const pathRef = useRef<SVGPathElement | null>(null);


// progress = wie viele Elemente bereits „eingraviert“ sind
const [progress, setProgress] = useState(0);
const [showClaim, setShowClaim] = useState(false);
useEffect(() => {
  const path = pathRef.current;
  if (!path) return;

  let t = 0;
  let raf: number;

  const points = 240;
  const width = 1200;
  const height = 320;
  const centerY = height / 2;

  const animate = () => {
    t += 0.0025;

    let d = "M ";
    for (let i = 0; i <= points; i++) {
      const progress = i / points;
      const x = progress * width;

      const baseWave =
        Math.sin(progress * 6 + t * 2) * 18;

      const spiralStrength =
        (Math.sin(t * 0.6) + 1) / 2;

      const angle =
        progress * Math.PI * 2 +
        t * 0.8;

      const radius =
        spiralStrength * 80 * progress;

      const spiralY =
        Math.sin(angle) * radius * 0.35;

      const y =
        centerY +
        baseWave +
        spiralY;

      d += `${x.toFixed(2)},${y.toFixed(2)} `;
    }

    path.setAttribute("d", d);
    raf = requestAnimationFrame(animate);
  };

  animate();

  return () => cancelAnimationFrame(raf);
}, []);


useEffect(() => {
  document.documentElement.classList.add("enable-scroll");

  const timers: number[] = [];

  sequence.forEach((_, index) => {
    timers.push(
      window.setTimeout(() => {
        setProgress(index + 1);
      }, index * 900)
    );
  });

  timers.push(
    window.setTimeout(() => {
      setShowClaim(true);
    }, sequence.length * 900 + 500)
  );

  return () => {
    document.documentElement.classList.remove("enable-scroll");
    timers.forEach(clearTimeout);
  };
}, []);


  return (
    <>
      <Navigation />

      <main
        id="content"
        role="main"
        className="relative isolate z-10 min-h-dvh bg-transparent text-white antialiased selection:bg-white/20"
      >
        <div className="px-[clamp(10px,4vw,90px)] pb-[clamp(40px,6vw,120px)]">

          {/* TOP SUPER BUFFER */}
          <div aria-hidden="true" style={{ height: "var(--h-gap-md)" }} />

          {/* HERO */}
          <section className="pt-[120px] pb-[120px]">
  <div className="page-center max-w-[820px]">

    {/* HEADER WORD BUILD */}
    <h1
      className="
        text-[clamp(40px,7vw,64px)]
        font-semibold
        tracking-tight
        transition-all
        duration-700
        ease-out
      "
    >
      {sequence.slice(0, progress).map(s => s.letter).join("")}
    </h1>

    {/* MEANING LINE BUILD */}
    <p
      className="
        mt-3
        text-white/80
        text-[clamp(18px,3vw,22px)]
        transition-all
        duration-700
        ease-out
      "
    >
      {sequence.slice(0, progress).map(s => s.word).join(" ")}
    </p>

    {/* FINAL CLAIM */}
    {showClaim && (
      <p
        className="
          mt-6
          text-white/60
          max-w-[680px]
          transition-all
          duration-700
          ease-out
        "
        style={{
          opacity: showClaim ? 1 : 0,
          transform: showClaim ? "translateY(0)" : "translateY(10px)"
        }}
      >
        {t.hero.intro}
      </p>
    )}

  </div>
</section>

<MuTahLine key={pathname} />





          {/* CLARIFICATION */}
<section className="pt-[100px] pb-[100px]">
  <div className="page-center max-w-[760px]"> 

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      System clarification layer
    </div>

    {/* TITLE */}
    <h2 className="text-2xl font-semibold mb-10">
      {t.clarification.title}
    </h2>

    {/* PRIMARY STATEMENT */}
    <p className="text-white mb-8 text-[17px] leading-relaxed">
      {t.clarification.body[0]}
    </p>

    {/* STRUCTURED BULLETS WITH ARROWS */}
    <ul className="space-y-4">
      {t.clarification.body.slice(1, -1).map((line: string, i: number) => (
        <li
          key={i}
          className="flex items-start gap-3 text-white/70"
        >
          {/* ARROW ICON */}
          <span className="mt-[0.35em] flex-shrink-0 text-white/50">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </span>

          {/* TEXT */}
          <span className="leading-relaxed">
            {line}
          </span>
        </li>
      ))}
    </ul>

    {/* FINAL ASSERTION */}
    <p className="mt-10 text-white/85 font-medium">
      {t.clarification.body[t.clarification.body.length - 1]}
    </p>

  </div>
</section>



          
          
     {/* PHASE-SHIFTED LINE SPIRAL */}
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
          <linearGradient id="phaseSpiralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="25%" stopColor="rgba(160,190,255,0.35)" />
            <stop offset="50%" stopColor="rgba(120,160,255,0.9)" />
            <stop offset="75%" stopColor="rgba(160,190,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          <filter id="phaseGlow">
            <feGaussianBlur stdDeviation="7" result="blur" />
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
          stroke="url(#phaseSpiralGradient)"
          strokeWidth="2"
          filter="url(#phaseGlow)"
        />
      </svg>
    </div>
  </div>
</section>



         {/* PROBLEM STATEMENT */}
<section className="pt-[120px] pb-[120px]">
  <div className="page-center max-w-[820px]">

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      Runtime reality
    </div>

    {/* TITLE */}
    <h2 className="text-3xl font-semibold">
      {t.problem_statement.title}
    </h2>

    {/* SUBTITLE AS CHALLENGE */}
    <p className="mt-4 text-white/70 text-lg max-w-[620px]">
      {t.problem_statement.subtitle}
    </p>

    {/* SEPARATION */}
    <div className="mt-10 h-px w-24 bg-white/10" />

    {/* CONTEXT PARAGRAPHS */}
    <div className="mt-10 space-y-5 text-white/70 max-w-[720px]">
      {t.problem_statement.body.slice(0, 2).map((line: string, i: number) => (
        <p key={i}>{line}</p>
      ))}
    </div>

   {/* JUDGEMENT BULLETS */}
<div className="mt-10 space-y-6 max-w-[720px]">
  {t.problem_statement.body.slice(2).map((line: string, i: number) => (
    <div key={i} className="flex items-start gap-4">
      {/* ARROW ICON */}
      <span className="flex-shrink-0 text-white/50 translate-y-[7px]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </span>

      {/* TEXT */}
      <p className="text-white/85 font-medium text-lg leading-relaxed">
        {line}
      </p>
    </div>
  ))}
</div>



  </div>
</section>



          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

         {/* PROBLEMS */}
<section className="pt-[120px] pb-[120px]">
  <div className="page-center max-w-[820px]">

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      Structural failure patterns
    </div>

    {/* TITLE */}
    <h2 className="text-3xl font-semibold mb-12">
      {t.problems.title}
    </h2>

    {/* PROBLEM LIST AS ASSERTIONS */}
    <ul className="space-y-6 max-w-[720px]">
      {t.problems.items.map((item: any, i: number) => (
        <li
          key={i}
          className="
            text-white/75
            pl-5
            border-l
            border-white/10
            leading-relaxed
          "
        >
          {item.title}
        </li>
      ))}
    </ul>

    {/* CLOSING SIGNAL */}
    <p className="mt-12 text-white/50 text-sm max-w-[600px]">
      These are not isolated issues. They are symptoms of missing inner system structure.
    </p>

  </div>
</section>

          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

         {/* WHAT MAIOS IS */}
<section className="pt-[120px] pb-[120px]">
  <div className="page-center max-w-[820px]">

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      System definition
    </div>

    {/* TITLE */}
    <h2 className="text-3xl font-semibold mb-10">
      {t.what_it_is.title}
    </h2>

    {/* PRIMARY DEFINITION */}
    <p className="text-white text-lg leading-relaxed max-w-[720px] mb-10">
      {t.what_it_is.body[0]}
    </p>

    {/* STRUCTURAL EXPLANATION */}
    <div className="space-y-4 text-white/70 max-w-[720px]">
      {t.what_it_is.body.slice(1, -2).map((line: string, i: number) => (
        <p key={i}>{line}</p>
      ))}
    </div>

    {/* SEPARATION */}
    <div className="mt-10 h-px w-24 bg-white/10" />

    {/* FINAL ASSERTIONS */}
    <div className="mt-10 space-y-2">
      {t.what_it_is.body.slice(-2).map((line: string, i: number) => (
        <p
          key={i}
          className="text-white/90 font-medium"
        >
          {line}
        </p>
      ))}
    </div>

  </div>
</section>

          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

          {/* WHAT MAIOS IS NOT */}
<section className="pt-[100px] pb-[100px]">
  <div className="page-center max-w-[820px]">

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      Explicit exclusions
    </div>

    {/* TITLE */}
    <h2 className="text-2xl font-semibold mb-10">
      {t.what_it_is_not.title}
    </h2>

    {/* NEGATIVE BOUNDARIES */}
    <ul className="space-y-4 max-w-[720px]">
      {t.what_it_is_not.body.map((line: string, i: number) => (
        <li
          key={i}
          className="
            text-white/70
            pl-5
            border-l
            border-white/10
            leading-relaxed
          "
        >
          {line}
        </li>
      ))}
    </ul>

    {/* CLOSING BOUNDARY STATEMENT */}
    <p className="mt-12 text-white/85 font-medium max-w-[600px]">
      These exclusions are intentional. They define the responsibility boundary of MAIOS.
    </p>

  </div>
</section>

          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

         {/* AUDIENCE */}
<section className="pt-[120px] pb-[120px]">
  <div className="page-center max-w-[820px]">

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      Intended operating environments
    </div>

    {/* TITLE */}
    <h2 className="text-3xl font-semibold mb-10">
      {t.audience.title}
    </h2>

    {/* CONTEXT */}
    <div className="space-y-4 text-white/70 max-w-[720px] mb-12">
      {t.audience.body.map((line: string, i: number) => (
        <p key={i}>{line}</p>
      ))}
    </div>

    {/* SECTORS AS SCOPE */}
    <div className="mb-12">
      <div className="mb-4 text-sm uppercase tracking-wide text-white/40">
        Typical domains
      </div>
      <ul className="space-y-3 max-w-[520px]">
        {t.audience.sectors.map((s: string, i: number) => (
          <li
            key={i}
            className="
              text-white/70
              pl-5
              border-l
              border-white/10
              leading-relaxed
            "
          >
            {s}
          </li>
        ))}
      </ul>
    </div>

    {/* FOOTNOTE BOUNDARY */}
    <div className="space-y-2 text-white/60 max-w-[640px]">
      {t.audience.footer.map((line: string, i: number) => (
        <p key={i}>{line}</p>
      ))}
    </div>

  </div>
</section>

          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

          {/* OFFERING */}
<section className="pt-[140px] pb-[140px]">
  <div className="page-center max-w-[820px]">

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      Delivery structure
    </div>

    {/* TITLE */}
    <h2 className="text-3xl font-semibold mb-14">
      {t.offering.title}
    </h2>

    {/* CORE OFFERING */}
    <div className="mb-20 max-w-[720px]">
      <div className="mb-4 text-sm uppercase tracking-wide text-white/40">
        Core layer
      </div>

      <h3 className="text-2xl font-semibold mb-6">
        {t.offering.core.title}
      </h3>

      <div className="space-y-4 text-white/70">
        {t.offering.core.body.map((line: string, i: number) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-white/90 text-lg"
                : undefined
            }
          >
            {line}
          </p>
        ))}
      </div>
    </div>

    {/* INVENTORY EXTENSION */}
    <div className="max-w-[720px]">
      <div className="mb-4 text-sm uppercase tracking-wide text-white/40">
        System adaptation
      </div>

      <h3 className="text-2xl font-semibold mb-6">
        {t.offering.inventory.title}
      </h3>

      <div className="space-y-4 text-white/70">
        {t.offering.inventory.body.map((line: string, i: number) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>

  </div>
</section>

          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

          {/* PROOF */}
<section className="pt-[120px] pb-[120px]">
  <div className="page-center max-w-[820px]">

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      Operational proof
    </div>

    {/* TITLE */}
    <h2 className="text-3xl font-semibold mb-10">
      {t.proof.title}
    </h2>

    {/* PRIMARY EVIDENCE */}
    <p className="text-white/90 text-lg leading-relaxed max-w-[720px] mb-10">
      {t.proof.body[0]}
    </p>

    {/* SUPPORTING FACTS */}
    <div className="space-y-4 text-white/70 max-w-[720px]">
      {t.proof.body.slice(1).map((line: string, i: number) => (
        <p key={i}>{line}</p>
      ))}
    </div>

    {/* EVIDENCE BOUNDARY */}
    <div className="mt-12 pt-6 border-t border-white/10 max-w-[600px]">
      <p className="text-white/60 text-sm">
        Proof here refers to observable operation and verifiable system behavior, not certification or endorsement.
      </p>
    </div>

  </div>
</section>

          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

          {/* CONSULTING */}
<section className="pt-[120px] pb-[120px]">
  <div className="page-center max-w-[820px]">

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      Structural intervention
    </div>

    {/* TITLE */}
    <h2 className="text-3xl font-semibold mb-10">
      {t.consulting.title}
    </h2>

    {/* PRIMARY POSITIONING */}
    <p className="text-white/90 text-lg leading-relaxed max-w-[720px] mb-10">
      {t.consulting.body[0]}
    </p>

    {/* SCOPE DESCRIPTION */}
    <div className="space-y-4 text-white/70 max-w-[720px]">
      {t.consulting.body.slice(1, -2).map((line: string, i: number) => (
        <p key={i}>{line}</p>
      ))}
    </div>

    {/* SEPARATION */}
    <div className="mt-12 h-px w-24 bg-white/10" />

    {/* FINAL BOUNDARIES */}
    <div className="mt-10 space-y-2">
      {t.consulting.body.slice(-2).map((line: string, i: number) => (
        <p
          key={i}
          className="text-white/85 font-medium"
        >
          {line}
        </p>
      ))}
    </div>

  </div>
</section>

          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

          {/* CONTACT */}
<section className="pt-[140px] pb-[140px]">
  <div className="page-center max-w-[720px]">

    {/* SYSTEM TAG */}
    <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
      Controlled system entry
    </div>

    {/* TITLE */}
    <h2 className="text-3xl font-semibold mb-6">
      {t.contact.title}
    </h2>

    {/* CONTEXT */}
    <p className="text-white/70 mb-12 max-w-[560px]">
      {t.contact.body[0]}
    </p>

    {/* FORM */}
    <form
      action="/api/contact"
      method="post"
      className="space-y-6 max-w-[560px]"
    >
      <div>
        <label className="block text-sm text-white/60 mb-1">
          {t.contact.fields[0]}
        </label>
        <input
          name="type"
          required
          className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">
          {t.contact.fields[1]}
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">
          {t.contact.fields[2]}
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">
          {t.contact.fields[3]}
        </label>
        <input
          name="company"
          className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">
          {t.contact.fields[4]}
        </label>
        <input
          name="role"
          className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
        />
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex items-center border border-white/20 px-6 py-2 text-white/80 hover:text-white hover:border-white/40 transition"
      >
        Send message
      </button>
    </form>

    {/* FOOTNOTE */}
    <div className="mt-12 space-y-2 text-white/60 text-sm max-w-[600px]">
      {t.contact.footer.map((line: string, i: number) => (
        <p key={i}>{line}</p>
      ))}
    </div>

  </div>
</section>

          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

          {/* CLOSING */}
<section className="pt-[120px] pb-[80px]">
  <div className="page-center max-w-[720px]">

    {/* FINAL SYSTEM MARK */}
    <div className="mb-8 h-px w-24 bg-white/10" />

    {/* CLOSING STATEMENTS */}
    <div className="space-y-4 text-white/75 text-lg">
      {t.closing.body.map((line: string, i: number) => (
        <p
          key={i}
          className={i === t.closing.body.length - 1 ? "text-white/90 font-medium" : undefined}
        >
          {line}
        </p>
      ))}
    </div>

  </div>
</section>


        </div>
        {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

        <Footer />
      </main>
    </>
  );
}
