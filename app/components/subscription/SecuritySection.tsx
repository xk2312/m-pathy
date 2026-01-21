"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as securityDict } from "@/lib/i18n.security";
import SecurityIcon from "@/app/components/security/SecurityIcon";

// Zielpfad wie bei PowerPrompts / Experts
const PAGE2_PATH = process.env.NEXT_PUBLIC_PAGE2_PATH ?? "/page2";


/** Karten-IDs – 4 Sicherheits-Ebenen */
type CardId = "emotional" | "storage" | "deletion" | "triketon";

/** Englische Defaults (BASE) – werden genutzt, wenn kein i18n vorhanden ist */
const BASE = {
  kicker: "SECURITY BY DESIGN",
  title: "Your safety, by design – emotional, private and auditable.",
  intro:
    "m-pathy.ai gives you four layers of security: emotional protection, local-only chats, full deletability and cryptographic sealing with Triketon.",
  cards: {
    emotional: {
      title: "Emotional safety – FLOW & CALM",
      body:
        "FLOW protects you from overload, CALM slows everything down. No judgement, no provocation – only resonance and a safe dialogue.",
      prefill:
        "@Digital Security Expert: Tell me everything about emotional security on m-pathy.ai. Answer minimalistically.",
    },
    storage: {
      title: "No server-side chat storage",
      body:
        "Chats are not stored on our servers. Conversations stay on your device – no cloud archive, no tracking, no shadow copies.",
      prefill:
        "@Digital Security Expert: Explain the 'no server-side storage of personal data and chats' principle on m-pathy.ai – minimalistic, please.",
    },
    deletion: {
      title: "Full deletability – you stay in control",
      body:
        "You can delete threads at any time. When you delete, they are gone – there is no hidden backup on our side.",
      prefill:
        "@Digital Security Expert: How permanently can I delete my threads on m-pathy.ai? Answer minimalistically.",
    },
    triketon: {
      title: "Triketon – 3×256-bit hashing",
      body:
        "Every secured action can be sealed with Triketon: a triple 256-bit hash with salt (time, page, context). Today in beta, later for content proof and origin certificates.",
      prefill:
        "@Digital Security Expert: Tell me how Triketon works on m-pathy.ai and how it protects my content. Answer minimalistically.",
    },
  },
  ctaLabel: "Ask Digital Security Expert",
};

/** Hilfsfunktion: Security-i18n mit Fallback auf BASE */
function useSecurityText() {
  const { lang } = useLang();

  // Aktuelle Locale aus i18n.security.ts, Fallback auf Englisch
  const locale = (securityDict as any)[lang] ?? securityDict.en;

  // Mapping: interne CardId -> Key in i18n.security.ts
  const cardKeyMap: Record<CardId, string> = {
    emotional: "emotional",
    storage: "local_only", // wichtig: storage ↔ local_only
    deletion: "deletion",
    triketon: "triketon",
  };

  return {
    kicker: locale?.kicker || BASE.kicker,
    title: locale?.title || BASE.title,
    intro: locale?.intro || BASE.intro,
    ctaLabel: locale?.cta_label || BASE.ctaLabel,
    card: (id: CardId) => {
      const dictKey = cardKeyMap[id];
      const dictCard = locale?.cards?.[dictKey] ?? {};
      const baseCard = BASE.cards[id];

      return {
        title: dictCard.title || baseCard.title,
        body: dictCard.body || baseCard.body,
        prefill: dictCard.prefill || baseCard.prefill,
      };
    },
  };
}


export default function SecuritySection() {
  const router = useRouter();
  const texts = useSecurityText();

  const cards: { id: CardId }[] = [
    { id: "emotional" },
    { id: "storage" },
    { id: "deletion" },
    { id: "triketon" },
  ];

  const handleAsk = (prefill: string) => {
    const url = `${PAGE2_PATH}?prefill=${encodeURIComponent(prefill)}`;
    router.push(url);
  };

  return (
    <section
      aria-label="Security section"
      className="pt-[var(--h-space-a2-section)] pb-[var(--h-space-a2-section)]"
    >
      <div
        className="page-center security-scope"
        style={{ maxWidth: "calc(var(--page-inner-max) * 1.0)" }}
      >
        {/* HEADER – selbe DNA wie PowerPrompts / Aktionsbefehle */}
        <div
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
            {texts.kicker}
          </p>

          <h2
            className="font-semibold tracking-tight text-white"
            style={{
              fontSize: "var(--h-a2-size)",
              lineHeight: "var(--h-a2-line)",
              letterSpacing: "var(--h-a2-letter)",
            }}
          >
            {texts.title}
          </h2>

          <p
            className="text-white"
            style={{
              marginTop: "var(--h-a2-gap-title-sub)",
              fontSize: "var(--h-a2-sub-size)",
              lineHeight: "var(--h-a2-sub-line)",
              opacity: "var(--h-a2-sub-opacity)",
            }}
          >
            {texts.intro}
          </p>
        </div>

        {/* GRID – 4 KARTEN, zwei Reihen, zwei Spalten – auto-fit, max 900px */}
        <div
          className="grid gap-[var(--h-gap-sub-content)]"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}
        >
          {cards.map(({ id }) => {
            const card = texts.card(id);

            return (
              <article
                key={id}
                className="security-card rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md"
                style={{
                  padding: "var(--sec-card-pad-y) var(--sec-card-pad-x)",
                }}
              >
                {/* Icon-Placeholder – hier später SVGs im Stil der Aktionsbefehle */}
                <div className="mb-[var(--h-card-icon-space)]">
                  {/* TODO: replace with real SVG icons */}
                  <span className="inline-flex items-center justify-center mb-2 text-white/60">
                    <SecurityIcon type={id} className="h-5 w-5" />
                  </span>


                </div>

                <h3 className="text-white font-semibold text-lg mb-[var(--h-card-title-space)]">
                  {card.title}
                </h3>

                <p className="text-white/75 text-sm leading-[1.7]">
                  {card.body}
                </p>


                <button
                type="button"
                className="m-button-secondary inline-flex items-center justify-center gap-2 cursor-pointer group"
                style={{
                    padding: "7px 13px",
                }}
                onClick={() => handleAsk(card.prefill)}
                >
                {texts.ctaLabel}
                <span
                    className="text-cyan-300 text-base transition-transform duration-[180ms] ease-out group-hover:translate-x-[3px]"
                >
                    →
                </span>
                </button>


              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
