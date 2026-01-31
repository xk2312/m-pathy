// app/maios/page.tsx
"use client";

import { useEffect, useState } from "react";
import Navigation from "@/app/components/navigation/navigation";
import Footer from "@/app/components/subscription/footer";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as maiosDict } from "@/lib/i18n.maios";

export default function MaiosPage() {
  const { lang } = useLang();
  const t = (maiosDict as any)[lang] ?? maiosDict.en;

  const sequence = [
    { letter: "M", word: "Modular" },
    { letter: "A", word: "Artificial" },
    { letter: "I", word: "Intelligence" },
    { letter: "O", word: "Operating" },
    { letter: "S", word: "System" }
  ];

  const [step, setStep] = useState(0);
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("enable-scroll");

    const timers: number[] = [];

    sequence.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setStep(index + 1);
        }, index * 900)
      );
    });

    timers.push(
      window.setTimeout(() => {
        setShowClaim(true);
      }, sequence.length * 900 + 400)
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

              {/* Buchstabe */}
              <div className="h-[70px] overflow-hidden">
                <h1
                  className="
                    text-[clamp(40px,7vw,64px)]
                    font-semibold
                    tracking-tight
                    transition-all
                    duration-700
                    ease-out
                  "
                  style={{
                    opacity: step > 0 ? 1 : 0,
                    transform: step > 0 ? "translateY(0)" : "translateY(14px)"
                  }}
                >
                  {sequence[Math.max(step - 1, 0)]?.letter}
                </h1>
              </div>

              {/* Begriff */}
              <div className="h-[36px] overflow-hidden mt-2">
                <p
                  className="
                    text-white/80
                    text-[clamp(18px,3vw,22px)]
                    transition-all
                    duration-700
                    ease-out
                  "
                  style={{
                    opacity: step > 0 ? 1 : 0,
                    transform: step > 0 ? "translateY(0)" : "translateY(10px)"
                  }}
                >
                  {sequence[Math.max(step - 1, 0)]?.word}
                </p>
              </div>

              {step === sequence.length && (
                <h2
                  className="
                    mt-6
                    text-white
                    text-[clamp(22px,4vw,32px)]
                    font-medium
                    transition-opacity
                    duration-700
                  "
                >
                  MAIOS
                </h2>
              )}

              {showClaim && (
                <p
                  className="
                    mt-4
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

          {/* BUFFER */}
          <div aria-hidden="true" style={{ height: "var(--h-gap-md)" }} />

          {/* CLARIFICATION */}
          <section className="pt-[80px] pb-[80px]">
            <div className="page-center max-w-[760px]">
              <h2 className="text-xl font-semibold mb-6">
                {t.clarification.title}
              </h2>
              <ul className="space-y-2 text-white/70">
                {t.clarification.body.map((line: string, i: number) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </section>

          
          
          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

          {/* PROBLEM STATEMENT */}
          <section className="pt-[100px] pb-[100px]">
            <div className="page-center max-w-[820px]">
              <h2 className="text-2xl font-semibold">
                {t.problem_statement.title}
              </h2>
              <p className="mt-2 text-white/60">
                {t.problem_statement.subtitle}
              </p>
              <div className="mt-6 space-y-3 text-white/70">
                {t.problem_statement.body.map((line: string, i: number) => (
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

          {/* PROBLEMS */}
          <section className="pt-[100px] pb-[100px]">
            <div className="page-center max-w-[820px]">
              <h2 className="text-2xl font-semibold mb-8">
                {t.problems.title}
              </h2>
              <ul className="space-y-4">
                {t.problems.items.map((item: any, i: number) => (
                  <li key={i} className="text-white/75">
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

          {/* WHAT MAIOS IS */}
          <section className="pt-[100px] pb-[100px]">
            <div className="page-center max-w-[820px]">
              <h2 className="text-2xl font-semibold mb-6">
                {t.what_it_is.title}
              </h2>
              <div className="space-y-3 text-white/70">
                {t.what_it_is.body.map((line: string, i: number) => (
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

          {/* WHAT MAIOS IS NOT */}
          <section className="pt-[80px] pb-[80px]">
            <div className="page-center max-w-[820px]">
              <h2 className="text-xl font-semibold mb-6">
                {t.what_it_is_not.title}
              </h2>
              <ul className="space-y-2 text-white/70">
                {t.what_it_is_not.body.map((line: string, i: number) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </section>
          {/* BUFFER */}
    <div
      aria-hidden="true"
      style={{ height: "var(--h-gap-md)" }}
    />

          {/* AUDIENCE */}
          <section className="pt-[100px] pb-[100px]">
            <div className="page-center max-w-[820px]">
              <h2 className="text-2xl font-semibold mb-6">
                {t.audience.title}
              </h2>
              <div className="space-y-3 text-white/70">
                {t.audience.body.map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <ul className="mt-6 space-y-2 text-white/65">
                {t.audience.sectors.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 text-white/60">
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
          <section className="pt-[120px] pb-[120px]">
            <div className="page-center max-w-[820px]">
              <h2 className="text-2xl font-semibold mb-8">
                {t.offering.title}
              </h2>

              <h3 className="text-xl font-semibold mb-4">
                {t.offering.core.title}
              </h3>
              <div className="space-y-2 text-white/70 mb-10">
                {t.offering.core.body.map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-4">
                {t.offering.inventory.title}
              </h3>
              <div className="space-y-2 text-white/70">
                {t.offering.inventory.body.map((line: string, i: number) => (
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

          {/* PROOF */}
          <section className="pt-[100px] pb-[100px]">
            <div className="page-center max-w-[820px]">
              <h2 className="text-2xl font-semibold mb-6">
                {t.proof.title}
              </h2>
              <div className="space-y-2 text-white/70">
                {t.proof.body.map((line: string, i: number) => (
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

          {/* CONSULTING */}
          <section className="pt-[100px] pb-[100px]">
            <div className="page-center max-w-[820px]">
              <h2 className="text-2xl font-semibold mb-6">
                {t.consulting.title}
              </h2>
              <div className="space-y-2 text-white/70">
                {t.consulting.body.map((line: string, i: number) => (
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

          {/* CONTACT */}
          <section className="pt-[120px] pb-[120px]">
            <div className="page-center max-w-[720px]">
              <h2 className="text-2xl font-semibold mb-4">
                {t.contact.title}
              </h2>
              <p className="text-white/70 mb-8">
                {t.contact.body[0]}
              </p>
              <div className="space-y-2 text-white/60 text-sm">
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
          <section className="pt-[80px] pb-[40px]">
            <div className="page-center max-w-[720px] text-white/70">
              {t.closing.body.map((line: string, i: number) => (
                <p key={i}>{line}</p>
              ))}
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
