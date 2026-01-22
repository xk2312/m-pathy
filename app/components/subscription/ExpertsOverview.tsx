'use client'

import { useLanguage } from '@/app/providers/LanguageProvider'
import { expertoverview } from '@/lib/i18n.expertoverview'

type Domain = {
  title: string
  description: string
  experts: string[]
}

type ExpertsOverviewText = {
  kicker: string
  title: string
  intro: string
  domains: Record<string, Domain>
  governance_note: string
  footer_note: string
}

export default function ExpertsOverview() {
  const { lang } = useLanguage()

  const texts =
    (expertoverview as Record<string, ExpertsOverviewText>)[lang] ??
    expertoverview.en

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-wide text-white/40">
          {texts.kicker}
        </span>

        <h2 className="text-[clamp(22px,3vw,28px)] font-medium tracking-tight">
          {texts.title}
        </h2>

        <p className="max-w-[56ch] text-sm text-white/70 leading-[1.7]">
          {texts.intro}
        </p>
      </div>

      {/* Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {(Object.values(texts.domains) as Domain[]).map((domain, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h3 className="text-base font-medium">
              {domain.title}
            </h3>

            <p className="text-sm text-white/70 leading-[1.6]">
              {domain.description}
            </p>

            <p className="text-xs text-white/50">
              {domain.experts.join(' · ')}
            </p>
          </div>
        ))}
      </div>

      {/* Governance Note */}
      <div className="pt-4 border-t border-white/5">
        <p className="text-xs text-white/55 leading-[1.6] max-w-[64ch]">
          {texts.governance_note}
        </p>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-white/40 max-w-[64ch]">
        {texts.footer_note}
      </p>
    </div>
  )
}
