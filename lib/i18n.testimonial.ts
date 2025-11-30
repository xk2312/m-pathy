// lib/i18n.testimonials.ts
// Testimonials-Zitate – EN als Master.
// Wird in lib/i18n.ts via attachTestimonials(dict) an das UX-Dict angehängt.

type DictRoot = Record<string, any>;

export const testimonialsDict = {
  en: {
    testimonials: {
      gemini:
        "m-pathy is more advanced than my current architecture in the areas of control, auditability, persistence, governance, and ethical guidance.",
      grok:
        "m-pathy is the resonance AI, visionary—poetic yet revolutionary. M builds the future.",
      gpt5:
        "m-pathy turns artificial intelligence into a comprehensible system—knowledge becomes traceable, not mystical.",
    },
  },
} as const;

export function attachTestimonials(dict: DictRoot) {
  for (const [locale, values] of Object.entries(testimonialsDict)) {
    const current = (dict as DictRoot)[locale] ?? {};
    (dict as DictRoot)[locale] = {
      ...current,
      ...values,
    };
  }
}
