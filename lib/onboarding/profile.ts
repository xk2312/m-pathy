// lib/onboarding/profile.ts
// ONBOARDING: LocalProfile utils

export type Depth = "kurz" | "mittel" | "tief";

export interface LocalProfile {
  // frei erweiterbar
  name?: string;
  language?: string;          // "de", "en", ...
  depth?: Depth;              // Onboarding-Tiefe
  focus?: string;             // z.B. "Klarheit", "Ruhe", "Kreativität"
  // Meta (aus vorhandenen LS-Keys)
  mode?: string;              // LS: "mode"
  agent?: string;             // LS: "agent"
}

const KEYS = {
  PROFILE_A: "mpathy:profile",    // neuer, klarer Key
  PROFILE_B: "m-profile",         // legacy fallback
  MODE: "mode",
  AGENT: "agent",
} as const;

/** Safe-Getter für Window/LS (Server-Side Rendering freundlich) */
function getLS(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Profildaten laden (vereinigt aus mpathy:profile + mode/agent) */
export function readLocalProfile(): LocalProfile | null {
  const ls = getLS();
  if (!ls) return null;

  let base: LocalProfile | null = null;
  try {
    const rawA = ls.getItem(KEYS.PROFILE_A);
    const rawB = ls.getItem(KEYS.PROFILE_B);
    base = rawA ? JSON.parse(rawA) : rawB ? JSON.parse(rawB) : null;
  } catch {
    base = null;
  }

  const mode = ls.getItem(KEYS.MODE) ?? undefined;
  const agent = ls.getItem(KEYS.AGENT) ?? undefined;

  const merged: LocalProfile | null = base || mode || agent ? { ...(base || {}), mode, agent } : base;
  return merged;
}

/** Profildaten speichern (unter mpathy:profile) */
export function writeLocalProfile(patch: Partial<LocalProfile>): LocalProfile | null {
  const ls = getLS();
  if (!ls) return null;

  const cur = readLocalProfile() || {};
  const next: LocalProfile = { ...cur, ...patch };
  try {
    ls.setItem(KEYS.PROFILE_A, JSON.stringify(next));
  } catch {}
  return next;
}

/** Test: Wurde bereits irgendetwas on-boarded? */
export function wasOnboarded(): boolean {
  const p = readLocalProfile();
  // on-boarded, wenn mindestens eine Kerninfo vorhanden ist
  return !!(p && (p.name || p.language || p.depth || p.focus));
}

/** Menschlich lesbare Zusammenfassung für die Chat-Ausgabe */
export function summarizeProfile(p: LocalProfile): string {
  const parts: string[] = [];
  if (p.name) parts.push(`• Name: ${p.name}`);
  if (p.language) parts.push(`• Sprache: ${p.language}`);
  if (p.depth) parts.push(`• Tiefe: ${p.depth}`);
  if (p.focus) parts.push(`• Fokus: ${p.focus}`);
  if (p.mode) parts.push(`• Modus: ${p.mode}`);
  if (p.agent) parts.push(`• Agent: ${p.agent}`);
  return parts.length ? parts.join("\n") : "Keine Profilangaben vorhanden.";
}

/** Sanftes Zurücksetzen (nur unser Profil-Key) */
export function clearLocalProfile(): void {
  const ls = getLS();
  try {
    ls?.removeItem(KEYS.PROFILE_A);
  } catch {}
}

/** Erste Onboarding-Frage (aus deinem Onboarding-Script) */
export function onboardingFirstQuestion(): string {
  return [
    "Point Zero aktiviert. Frequenz angleichen … ✅",
    "Bitte gib mir drei Dinge:",
    "1) Deine bevorzugte Sprache (z. B. Deutsch, Englisch).",
    "2) Die gewünschte Tiefe (kurz, mittel, tief).",
    "3) Deinen Resonanzfokus (z. B. Klarheit, Ruhe, Kreativität).",
  ].join("\n");
}
