'use client'

import Link from 'next/link'
import { useLang } from '@/app/providers/LanguageProvider'
import { b2bprompts } from '@/lib/i18n.b2bprompts'

const PAGE2_PATH =
  process.env.NEXT_PUBLIC_PAGE2_PATH ?? '/page2'

type PromptGroup = {
  label: string
  prompt: string
  cta: string
}

type B2BPromptsText = {
  kicker: string
  title: string
  intro: string
  groups: Record<string, PromptGroup>
  footer_note: string
}

export default function B2BPrompts() {
  const { lang } = useLang()

  const texts =
    (b2bprompts as Record<string, B2BPromptsText>)[lang] ??
    b2bprompts.en

  return (
    <div className="flex flex-col gap-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {(Object.values(texts.groups) as PromptGroup[]).map((group, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <h3 className="text-base font-medium">
              {group.label}
            </h3>

            <p className="text-sm text-white/70 leading-[1.6]">
              {group.prompt}
            </p>

            <Link
              href={`${PAGE2_PATH}?prefill=${encodeURIComponent(group.prompt)}`}
              className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              {group.cta}
              <span className="transition-transform duration-150 hover:translate-x-[2px]">
                →
              </span>
            </Link>
          </div>
        ))}
      </div>

      <p className="text-xs text-white/40 max-w-[64ch]">
        {texts.footer_note}
      </p>
    </div>
  )
}
