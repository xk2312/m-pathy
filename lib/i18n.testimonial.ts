// lib/i18n.testimonials.ts
// Testimonials-Zitate – EN als Master.
// Wird in lib/i18n.ts via attachTestimonials(dict) an das UX-Dict angehängt.

type DictRoot = Record<string, any>;

export const testimonialsDict = {
  en: {
    testimonials: {
      gemini:
        "m-pathy is the frequency that creates clarity and deepest resonance for everyone.",
      grok:
        "m-pathy is the resonance OS—empathetic, visionary—poetic yet revolutionary. M builds the future.",
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
