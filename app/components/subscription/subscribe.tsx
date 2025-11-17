"use client";

import { useLang } from "@/app/providers/LanguageProvider";
import { subscribeDict } from "@/lib/i18n.subscribe";

export default function Subscribe() {
  const { lang } = useLang();
  const locale = (subscribeDict[lang] ?? subscribeDict.en).subscribe;

  return (
    <section
      className="pt-[var(--h-space-a2-section)] pb-[var(--h-space-a2-section)]"
      aria-labelledby="subscribe-heading"
    >
      <div
        className="page-center"
        style={{ maxWidth: "calc(var(--page-inner-max) * 1.0)" }}
      >
        {/* HEADER */}
        <header
          className="max-w-[var(--h-a2-max-width)]"
          style={{ marginBottom: "var(--h-gap-sub-content)" }}
        >
          <p
            className="text-white/80"
            style={{
              fontSize: "var(--h-kicker-size)",
              fontWeight: "var(--h-kicker-weight)",
              letterSpacing: "var(--h-kicker-letter)",
              textTransform: "var(--h-kicker-transform)" as any,
              opacity: "var(--h-kicker-opacity)",
              marginBottom: "var(--h-gap-kicker-title)",
            }}
          >
            {locale.kicker}
          </p>

          <h2
            id="subscribe-heading"
            className="font-semibold tracking-tight text-white"
            style={{
              fontSize: "var(--h-a2-size)",
              lineHeight: "var(--h-a2-line)",
              letterSpacing: "var(--h-a2-letter)",
            }}
          >
            {locale.title}
          </h2>

          <p
            className="text-white/70"
            style={{
              marginTop: "var(--h-a2-gap-title-sub)",
              fontSize: "var(--h-a2-sub-size)",
              lineHeight: "var(--h-a2-sub-line)",
              opacity: "var(--h-a2-sub-opacity)",
            }}
          >
            {locale.subtitle}
          </p>
        </header>

        {/* MAIN CARD */}
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
            {/* LEFT – Price, Tokens, CTA */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  {locale.badge_label}
                </span>
                <span className="text-xs font-medium text-white/50">
                  {locale.badge_value}
                </span>
              </div>

              {/* Price + Tokens */}
              <div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-semibold text-white">
                    {locale.price_main}
                  </span>
                  <span className="text-sm text-white/70">
                    {locale.price_period}
                  </span>
                </div>

                <div className="mt-5 space-y-1.5">
                  <p className="text-sm font-semibold text-white/80">
                    {locale.token_headline}
                  </p>
                  <p className="text-sm text-white/70">
                    {locale.token_value}
                  </p>
                  <p className="text-xs text-white/55 max-w-xl">
                    {locale.token_subline}
                  </p>
                </div>

                {/* CTA – höher + 13px Luft oben/unten */}
                <div
                  className="pt-1"
                  style={{ marginTop: "var(--h-gap-sub-content)" }}
                >
                  <p className="text-xs text-white/60 mb-[13px]">
                    {locale.cta_preline}
                  </p>
                  <button
                    type="button"
                    aria-label={locale.cta_aria}
                    className="group inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-medium text-black transition-[background,transform,opacity] duration-200 ease-out hover:bg-white/90 hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <span>{locale.cta_label}</span>
                    <span
                      className="ml-2 inline-block translate-x-0 text-black/70 transition-transform duration-200 ease-out group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                  <p className="mt-[13px] text-xs text-white/55">
                    {locale.cta_subline}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT – 3 Bullets + kurze Safety-Zeile */}
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-white/80">
                  {locale.benefits_title}
                </p>
                <ul className="mt-3 space-y-2.5 text-sm text-white/70">
                  <li>• {locale.benefit_1}</li>
                  <li>• {locale.benefit_2}</li>
                  <li>• {locale.benefit_3}</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                <p className="text-xs font-semibold text-white/75 mb-1">
                  {locale.safety_title}
                </p>
                <p className="text-xs text-white/60">
                  {locale.safety_no_subscription}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTNOTES */}
          <div className="mt-6 border-t border-white/10 pt-4 space-y-1">
            <p className="text-[11px] leading-relaxed text-white/45">
              {locale.footnote_1}
            </p>
            <p className="text-[11px] leading-relaxed text-white/45">
              {locale.footnote_2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
