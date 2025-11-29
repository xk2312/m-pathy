// lib/i18n.hero.ts
// Hero-Copy für Subscription/Landing – EN als Master.
// Wird in lib/i18n.ts via attachHero(dict) an das UX-Dict angehängt.

type DictRoot = Record<string, any>;

export const heroDict = {
  en: {
    hero_title: "Your Operating System for Creation",
    hero_sub: "From idea to impact in minutes.",
    hero_cta: "Begin your journey",
  },
} as const;

export function attachHero(dict: DictRoot) {
  for (const [locale, values] of Object.entries(heroDict)) {
    const current = (dict as DictRoot)[locale] ?? {};
    (dict as DictRoot)[locale] = {
      ...current,
      ...values,
    };
  }
}
