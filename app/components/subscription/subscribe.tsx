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
        {/* Header: Kicker, Title, Subtitle */}
        <header className="max-w-[var(--h-a2-max-width)]">
          <p className="text-[length:var(--h-kicker-size)] font-semibold tracking-[var(--h-kicker-letter)] uppercase text-white/60 mb-[var(--h-gap-kicker-title)]">
            {locale.kicker}
          </p>

          <h2
            id="subscribe-heading"
            className="text-[length:var(--h-a2-size)] leading-[var(--h-a2-line)] tracking-[var(--h-a2-letter)] text-white"
          >
            {locale.title}
          </h2>
          <p className="mt-[var(--h-a2-gap-title-sub)] text-base leading-relaxed text-white/70">
            {locale.subtitle}
          </p>
        </header>

        {/* Main Card */}
        <div className="mt-[clamp(130px,12vw,160px)]">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
              {/* Left: Price & Tokens */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                    {locale.badge_label}
                  </span>
                  <span className="text-xs font-medium text-white/50">
                    {locale.badge_value}
                  </span>
                </div>

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
                </div>
              </div>

              {/* Right: Benefits + Safety + CTA */}
              <div className="space-y-5">
                {/* Benefits */}
                <div>
                  <p className="text-sm font-semibold text-white/80">
                    {locale.benefits_title}
                  </p>
                  <ul className="mt-3 space-y-2.5 text-sm text-white/70">
                    <li>• {locale.benefit_1}</li>
                    <li>• {locale.benefit_2}</li>
                    <li>• {locale.benefit_3}</li>
                    <li>• {locale.benefit_4}</li>
                  </ul>
                </div>

                {/* Safety */}
                <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                  <p className="text-xs font-semibold text-white/75">
                    {locale.safety_title}
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-white/60">
                    <li>• {locale.safety_no_subscription}</li>
                    <li>• {locale.safety_one_month}</li>
                    <li>• {locale.safety_control}</li>
                    <li>• {locale.safety_data}</li>
                  </ul>
                </div>

                {/* CTA */}
                <div className="pt-1">
                  <p className="mb-2 text-xs text-white/60">
                    {locale.cta_preline}
                  </p>
                  <button
                    type="button"
                    aria-label={locale.cta_aria}
                    className="group inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-[background,transform,opacity] duration-200 ease-out hover:bg-white/90 hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <span>{locale.cta_label}</span>
                    <span
                      className="ml-2 inline-block translate-x-0 text-black/70 transition-transform duration-200 ease-out group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                  <p className="mt-2 text-xs text-white/55">
                    {locale.cta_subline}
                  </p>
                </div>
              </div>
            </div>

            {/* Footnotes */}
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
      </div>
    </section>
  );
}
