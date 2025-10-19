/** lib/tts.ts – kleine Web-Speech Helfer (SSR-safe) */

export type SpeakOpts = {
  voiceName?: string; // exakte Voice-Bezeichnung, falls vorhanden
  rate?: number;      // 0.1..10 (1 = normal)
  pitch?: number;     // 0..2   (1 = normal)
  lang?: string;      // z.B. "de-DE" oder "en-US"
};

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function supported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stop() {
  try {
    if (supported()) window.speechSynthesis.cancel();
    currentUtterance = null;
  } catch {}
}

function pickVoice(name?: string, lang?: string): SpeechSynthesisVoice | undefined {
  try {
    if (!supported()) return;
    const voices = window.speechSynthesis.getVoices() || [];
    if (name) {
      const byName = voices.find(v => v.name === name);
      if (byName) return byName;
    }
    if (lang) {
      const byLang = voices.find(v => v.lang?.toLowerCase().startsWith(lang.toLowerCase()));
      if (byLang) return byLang;
    }
    // Fallback: erste passende nach Browser-Sprache
    const nlang = (navigator.language || "").toLowerCase();
    return voices.find(v => v.lang?.toLowerCase().startsWith(nlang)) || voices[0];
  } catch { return undefined; }
}

export function speak(text: string, opts: SpeakOpts = {}, onend?: () => void) {
  stop();
  if (!supported()) return;

  const u = new SpeechSynthesisUtterance(text);
  u.rate  = opts.rate  ?? 1;
  u.pitch = opts.pitch ?? 1;
  u.lang  = opts.lang  || (navigator.language || "en-US");

  const trySetVoice = () => {
    const v = pickVoice(opts.voiceName, u.lang);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  u.onend = () => { currentUtterance = null; onend?.(); };
  currentUtterance = u;

  // Manche Browser laden Voices async:
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length) trySetVoice();
  else {
    const once = () => { try { window.speechSynthesis.onvoiceschanged = null as any; } catch {}; trySetVoice(); };
    try { window.speechSynthesis.onvoiceschanged = once; } catch { trySetVoice(); }
  }
}