"use client";

/***
 * =========================================================
 *  M — PAGE2 MASTER (Single-File Design/Behavior Control)
 * =========================================================
 *
 *  INDEX (Sprunganker):
 *  [ANCHOR:CONFIG]         – Design Tokens, Themes, Personas, System Prompt
 *  [ANCHOR:HOOKS]          – useBreakpoint, useTheme
 *  [ANCHOR:UTILS]          – tiny helpers (cx)
 *  [ANCHOR:COMPONENTS]     – Header, Bubble, Conversation, InputDock
 *  [ANCHOR:BEHAVIOR]       – Chat State + sendMessage (Azure OpenAI)
 *  [ANCHOR:LAYOUT]         – Page Layout mit festen Abständen/Dock-Regeln
 *
 *  Philosophie:
 *  - Eine Datei steuert Form & Verhalten. M kann hier gezielt patchen.
 *  - Keine externen Abhängigkeiten nötig (CSS-in-TSX für dynamische Teile).
 *  - Statischer Bühnenlook (Hintergrund/Bubbles) darf zusätzlich in page2.module.css bleiben.
 */

import React, {
  useEffect,
  useLayoutEffect, // darf drin bleiben, wird hier aber nicht zwingend gebraucht
  useState,
  useRef,
  useCallback,
  useMemo,
  FormEvent,
} from "react";
import Image from "next/image";

import LogoM from "../components/LogoM";
import MessageInput from "../components/MessageInput";
import Saeule from "../components/Saeule";
import SidebarContainer from "../components/SidebarContainer";
import MobileOverlay from "../components/MobileOverlay";
import StickyFab from "../components/StickyFab";
import { t } from "@/lib/i18n";
import OnboardingWatcher from "@/components/onboarding/OnboardingWatcher"; // ← NEU
import { useMobileViewport } from "@/lib/useMobileViewport";

// ⚠️ NICHT importieren: useTheme aus "next-themes" (Konflikt mit lokalem Hook)
// import { useTheme } from "next-themes"; // ❌ bitte entfernt lassen

// ——— Theme-Token-Typen (global, einmalig) ———
type ColorTokens = { bg0?: string; bg1?: string; text?: string };
type ThemeTokens = { color?: ColorTokens; [k: string]: any };


/* =======================================================================
   [ANCHOR:CONFIG] — Design Tokens, Themes, Personas, System Prompt
   ======================================================================= */

   type Tokens = {
    radius: { sm: number; md: number; lg: number };
    shadow: { soft: string; glowCyan: string };
    color: {
      bg0: string;
      bg1: string;
      text: string;
      textMuted: string;
      cyan: string;
      cyanGlass: string;
      cyanBorder: string;
      slateGlass: string;
      slateBorder: string;
      glass: string;
      glassBorder: string;
    };
  };
  
  const TOKENS: Tokens = {
    radius: { sm: 10, md: 12, lg: 16 },
    shadow: {
      soft: "0 14px 40px rgba(0,0,0,0.35)",
      glowCyan: "0 0 28px rgba(34,211,238,0.12)",
    },
    color: {
      bg0: "#000",
      bg1: "#0c0f12",
      text: "#E6F0F3",
      textMuted: "rgba(230,240,243,0.65)",
      cyan: "#22d3ee",
      cyanGlass: "rgba(34,211,238,0.12)",
      cyanBorder: "rgba(34,211,238,0.28)",
      slateGlass: "rgba(148,163,184,0.10)",
      slateBorder: "rgba(148,163,184,0.30)",
      glass: "rgba(255,255,255,0.06)",
      glassBorder: "rgba(255,255,255,0.12)",
    },
  };
  
  type Theme = {
    name: string;
    tokens: Tokens;
    dock: {
      desktop: { width: number; bottom: number; side: number };
      mobile: { widthCalc: string; bottom: number; side: number };
    };
  };
  
  const THEMES: Record<string, Theme> = {
    m_default: {
      name: "m_default",
      tokens: TOKENS,
      dock: {
        desktop: { width: 600, bottom: 300, side: 24 },
        mobile: { widthCalc: "calc(100% - 20px)", bottom: 50, side: 10 },
      },
    },
  };
  
  const PERSONAS: Record<string, { theme: keyof typeof THEMES }> = {
    default: { theme: "m_default" },
  };
  
  // (optional, wenn in dieser Datei genutzt; sonst komplett entfernen)
  const COUNCIL_COMMANDS: Record<string, string> = {
    LUX: "INIT LUX-Anchor",
    JURAXY: "INITIATE JURAXY-1/13",
    DATAMASTER: "START DataMaster Session",
    CHEMOMASTER: "START ChemoMaster 2.0 Loop",
    SHADOWMASTER: "TRIGGER_SHADOW_ANALYSIS",
  };  
  
/* =======================================================================
   [ANCHOR:HOOKS]  — Breakpoint + Theme Resolution
   ======================================================================= */

function useBreakpoint(threshold = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= threshold);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [threshold]);
  return { isMobile };
}

function useTheme(persona: keyof typeof PERSONAS = "default") {
  const key = PERSONAS[persona]?.theme ?? "m_default";
  return THEMES[key];
}
/* =======================================================================
   [ANCHOR:UTILS] — kleine Helfer (keine Exports in page.tsx!)
   ======================================================================= */

// [ANCHOR:UTILS]
const LS_KEY = "mpathy:thread:default";
const MAX_HISTORY = 200;

type Role = "user" | "assistant" | "system";
type ChatMessage = {
  role: Role;
  content: string;
  format?: "plain" | "markdown" | "html";
};

function truncateMessages(list: ReadonlyArray<ChatMessage>, max = MAX_HISTORY): ChatMessage[] {
  return list.length > max ? list.slice(list.length - max) : [...list];
}

function loadMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const msgs = (parsed as any)?.messages;
    return Array.isArray(msgs) ? (msgs as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: ReadonlyArray<ChatMessage>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify({ messages, updatedAt: Date.now() }));
  } catch { /* noop */ }
}
  
/* =======================================================================
   [ANCHOR:COMPONENTS]  — UI-Bausteine
   ======================================================================= */

/** Kopfzeile */
function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(10px)",
        background: "rgba(0,0,0,0.45)",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
      }}
      aria-label="Conversation header"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
        }}
      >
        <Image
          src="/pictures/m.svg"
          alt="M"
          width={22}
          height={22}
          style={{ marginTop: 6, flex: "0 0 22px" }}
        />
        {/* Screenreader-Title, visuell versteckt */}
        <span style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
          M
        </span>
      </div>
    </header>
  );
}

/* --- Markdown Mini-Renderer (XSS-safe: erst escapen, dann Muster ersetzen) --- */
function mdToHtml(src: string): string {
  // 1) Escapen
  const esc = String(src)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2) Headings
  let out = esc
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>");

  // 3) Inline-Styles
  out = out
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+?)`/g, "<code>$1</code>");

  // 4) Listen: zusammenhängende - / * Zeilen zu EINEM <ul> gruppieren
  out = out.replace(
    /(^|\n)((?:[-*]\s+.*(?:\n|$))+)/g,
    (_m: string, prefix: string, block: string) => {
      const items = block
        .trimEnd()
        .split("\n")
        .filter(Boolean)
        .map((line: string) => line.replace(/^[-*]\s+/, "")) // Marker entfernen
        .map((text: string) => `<li>${text}</li>`)
        .join("");
      return `${prefix}<ul>${items}</ul>\n`;
    }
  );

  // 5) Absätze: Nur „nackte“ Textblöcke in <p> einpacken, nicht Blockelemente
  const blocks = out.split(/\n{2,}/);
  const rendered = blocks
    .map((b) => {
      const t = b.trim();
      if (!t) return "";
      if (/^<(h1|h2|h3|ul|ol|pre|blockquote|table|hr)\b/i.test(t)) return t;
      return `<p>${t}</p>`;
    })
    .join("\n");

  return rendered;
}

/** Body einer Nachricht: entscheidet Markdown vs. Plaintext */
function MessageBody({ msg }: { msg: ChatMessage }) {
  const isMd = (msg as any).format === "markdown";
  if (isMd) {
    return (
      <div
        className="markdown" // Haken für deine bestehenden CSS-Regeln (.markdown h1, .markdown ul, ...)
        dangerouslySetInnerHTML={{ __html: mdToHtml(String(msg.content ?? "")) }}
        style={{ lineHeight: 1.55 }}
      />
    );
  }
  return <div style={{ lineHeight: 1.55 }}>{String(msg.content ?? "")}</div>;
}

/** Sprechblase mit M-Avatar für Assistant */
function Bubble({
  msg,
  tokens,
}: {
  msg: ChatMessage;
  tokens: Tokens;
}) {
  const isUser = msg.role === "user";

  const bubbleBase: React.CSSProperties = {
    maxWidth: "90%",
    borderRadius: 16,
    padding: "14px 18px",
    lineHeight: 1.55,
    backdropFilter: "blur(6px)",
    border: "1px solid",
    color: tokens.color.text,
    boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
  };

  const bubbleStyle: React.CSSProperties = isUser
    ? {
        ...bubbleBase,
        marginLeft: "auto",
        background: tokens.color.cyanGlass,
        borderColor: tokens.color.cyanBorder,
      }
    : {
        ...bubbleBase,
        marginRight: "auto",
        background: tokens.color.slateGlass,
        borderColor: tokens.color.slateBorder,
      };

      return (
        <div
          role="group"                    // group statt listitem → Screenreader-Gruppe
  aria-roledescription={isUser ? "user message" : "assistant message"}
  aria-label={isUser ? t("youSaid") : t("assistantSays")}
  style={{
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
            alignItems: "flex-start",
            gap: 10,
            margin: "6px 0",
          }}
        >
          {!isUser && (
            <Image
              src="/pictures/m.svg"
              alt="M"
              width={22}
              height={22}
              style={{ marginTop: 6, flex: "0 0 22px" }}
            />
          )}
      
          <div style={bubbleStyle}>
            <MessageBody msg={msg} />
          </div>
        </div>
      );
      
}

/** Nachrichtenliste (echter Scroll-Container ist die <section>) */
function Conversation({
  messages,
  tokens,
  padBottom = "12px",
  scrollRef,
}: {
  messages: ChatMessage[];
  tokens: Tokens;
  padBottom?: string;
  scrollRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <section
  role="log"
  aria-live="polite"
  aria-relevant="additions"
  aria-label={t("conversationAria")}
  style={{ /* … unverändert … */ }}
>
  {messages.map((m, i) => (
    <Bubble key={i} msg={m} tokens={tokens} />
  ))}
</section>
  );
}

/** Eingabedock — unterstützt "flow" (im Layoutfluss) und "fixed" (schwebend) */
function InputDock({
  tokens,
  isMobile,
  onSubmit,
  value,
  setValue,
  disabled,
  dockRef,
  mode = "flow", // "flow" | "fixed"
}: {
  tokens: Tokens;
  isMobile: boolean;
  onSubmit: (e: FormEvent) => void;
  value: string;
  setValue: (v: string) => void;
  disabled: boolean;
  dockRef?: React.Ref<HTMLFormElement>;
  mode?: "flow" | "fixed";
}) {
  const dockStyle: React.CSSProperties = useMemo(() => {
    const baseShadow = `${TOKENS.shadow.soft}, ${TOKENS.shadow.glowCyan}`;
    const base: React.CSSProperties = {
      width: isMobile
        ? THEMES.m_default.dock.mobile.widthCalc
        : THEMES.m_default.dock.desktop.width,
      display: "flex",
      gap: 10,
      padding: 10,
      background: tokens.color.glass,
      border: `1px solid ${tokens.color.glassBorder}`,
      borderRadius: TOKENS.radius.lg,
      backdropFilter: "blur(12px)",
      boxShadow: baseShadow,
    };

    if (mode === "fixed") {
      return {
        ...base,
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: isMobile
          ? THEMES.m_default.dock.mobile.bottom
          : THEMES.m_default.dock.desktop.bottom,
        zIndex: 20,
      };
    }

    // flow: im normalen Layoutfluss; zur Sicherheit selber zentrieren
    return {
      ...base,
      margin: "30px auto",
    };
  }, [isMobile, tokens, mode]);

  return (
  <div
    id="m-input"               // ← eindeutige ID
    role="group"               // ← A11y statt Form
    style={dockStyle}
    aria-label="Message input"
    data-testid="m-input-form"
  >
    <input
      aria-label="Type your message"
      style={{
        flex: 1,
        height: 44,
        padding: "0 14px",
        borderRadius: TOKENS.radius.md,
        border: `1px solid ${tokens.color.glassBorder}`,
        background: "rgba(255,255,255,0.04)",
        color: tokens.color.text,
        outline: "none",
      }}
      placeholder="Talk to M"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (!disabled && value.trim()) {
            // Form-Submit synthetisch auslösen (ohne echtes <form>)
            onSubmit?.({ preventDefault() {} } as any);
          }
        }
      }}
    />

    <button
      type="button"                                  // ← kein echter Submit
      disabled={disabled || !value.trim()}
      onClick={() => {
        if (!disabled && value.trim()) {
          onSubmit?.({ preventDefault() {} } as any); // ← triggert deine bestehende Logik
        }
      }}
    >
      Senden
    </button>
  </div>
);


}

/* =======================================================================
   [ANCHOR:BEHAVIOR] — Chatlogik (Azure OpenAI)
   ======================================================================= */

export default function Page2() {
  // Persona/Theme
  const theme = useTheme("default");
  const activeTokens: Tokens = theme.tokens;

// === Scroll-Enable NACH DOM-Load & Fonts, dann 2× rAF für stabiles Layout ===
useEffect(() => {
  let fired = false;
  let raf1 = 0, raf2 = 0;

  const nudge = () => {
    if (fired) return;
    fired = true;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = convoRef.current as HTMLDivElement | null;
        if (!el) return;
        const prev = el.style.overflow;
        el.style.overflow = "hidden";
        el.scrollTop = (el.scrollTop || 0) + 1; // minimaler Impuls
        void el.offsetHeight;                    // Reflow erzwingen
        el.style.overflow = prev || "auto";
      });
    });
  };

  // Wenn Fonts fertig sind, erst dann Layout als stabil ansehen
  const afterFonts = () => {
    if ("fonts" in document && (document as any).fonts?.ready) {
      (document as any).fonts.ready.then(nudge).catch(nudge);
    } else {
      nudge();
    }
  };

  // Warten bis DOM + Ressourcen geladen (Load-Event). Falls schon geladen → direkt weiter.
  if (document.readyState === "complete") {
    afterFonts();
  } else {
    const onLoad = () => { afterFonts(); };
    window.addEventListener("load", onLoad, { once: true });
    // Falls der Browser „complete“ erreicht, ohne echtes load zu feuern:
    const onRS = () => {
      if (document.readyState === "complete") {
        window.removeEventListener("load", onLoad);
        afterFonts();
      }
    };
    document.addEventListener("readystatechange", onRS, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      document.removeEventListener("readystatechange", onRS as any);
    };
  }

  return () => {
    if (raf1) cancelAnimationFrame(raf1);
    if (raf2) cancelAnimationFrame(raf2);
  };
}, []);



  // Breakpoint + Seitenränder
  const { isMobile } = useBreakpoint(768);
  const sideMargin = isMobile ? theme.dock.mobile.side : theme.dock.desktop.side;

  // Refs & Höhenmessung
  const headerRef = useRef<HTMLDivElement>(null);
  const convoRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [dockH, setDockH] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (dockRef.current) setDockH(dockRef.current.offsetHeight || 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (dockRef.current) ro.observe(dockRef.current);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);



  // Initial Scroll "Unlock" — stabiler (double rAF) + Reflow-Nudge
useEffect(() => {
  const el = convoRef.current as HTMLDivElement | null;
  if (!el) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const prev = el.style.overflow;
      el.style.overflow = "hidden";
      el.scrollTop = (el.scrollTop || 0) + 1; // minimaler Nudge
      void el.offsetHeight;                   // Reflow erzwingen
      el.style.overflow = prev || "auto";
    });
  });
}, []);


  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [mode, setMode] = useState<string>("DEFAULT");
// ▼▼ NEU: Footer-Status (nur Anzeige)
type FooterStatus = { modeLabel: string; expertLabel: string };
const [status, setStatus] = useState<FooterStatus>({ modeLabel: "—", expertLabel: "—" });
  // Golden Prompt — micro-motion registers
  const breathRef = useRef<number>(0);            // breath phase accumulator
  const lastMotionRef = useRef<number[]>([]);     // flow memory (last intensities)
  const rafRef = useRef<number | null>(null);     // living continuum loop

  // Living Continuum Engine (perceptual continuity)
  useEffect(() => {
    let mounted = true;
    const tick = (t: number) => {
      if (!mounted) return;
      // Breath coupling (5s cycle; amplitude modulated by typing)
      const typingBias = document.getElementById("gold-input")?.classList.contains("is-typing") ? 1 : 0.35;
      breathRef.current = (t / 1000) % 5; // seconds
      const phase = (breathRef.current / 5) * Math.PI * 2;
      const amp = 0.003 * typingBias; // subtle scale shift
      const dock = document.getElementById("m-input-dock");
      if (dock) {
        dock.style.transform = `translateZ(0) scale(${1 + Math.sin(phase) * amp})`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Persist
  const persistMessages = saveMessages;

  // Initiale Begrüßung / Restore
  useEffect(() => {
    const restored = loadMessages();
    if (Array.isArray(restored) && restored.length) {
      setMessages(restored);
      return;
    }
    setMessages([]);

  }, []);

    // ===============================================================
  // Systemmeldung (für Säule / Overlay / Onboarding)
  // ===============================================================
  const systemSay = useCallback((content: string) => {
    if (!content) return;
    setMessages((prev) => {
      const next = truncateMessages([
        ...(Array.isArray(prev) ? prev : []),
        { role: "assistant", content, format: "markdown" },
      ]);
      persistMessages(next);
      return next;
    });
  }, [persistMessages]);

  // Footer-Status (nur Anzeige in der Statusleiste, keine Bubble)
const [footerStatus, setFooterStatus] = useState<{ modeLabel: string; expertLabel: string }>({
  modeLabel: "—",
  expertLabel: "—",
});

  // ===============================================================
// BRIDGE — Saeule → Chat (Event → echte Nachricht)
// ===============================================================
useEffect(() => {
  const onSystem = (e: Event) => {
    const detail = (e as CustomEvent).detail ?? {};
    const text: string = detail.text ?? "";
    const kind: string = detail.kind ?? "info";
    const meta = detail.meta ?? {};

    // 1) Reine Status-Events: nur Footer-State aktualisieren, KEINE Bubble
    if (kind === "status") {
      const modeLabel = meta.modeLabel ?? detail.modeLabel;
      const expertLabel = meta.expertLabel ?? detail.expertLabel;
      setFooterStatus((s) => ({
        modeLabel: typeof modeLabel === "string" && modeLabel.length ? modeLabel : s.modeLabel,
        expertLabel: typeof expertLabel === "string" && expertLabel.length ? expertLabel : s.expertLabel,
      }));
      return;
    }

    // 2) Modus-Events: Label in den Footer spiegeln (falls geliefert)
    if (kind === "mode") {
      const modeLabel = meta.label ?? meta.modeLabel ?? detail.modeLabel;
      if (typeof modeLabel === "string" && modeLabel.length) {
        setFooterStatus((s) => ({ ...s, modeLabel }));
      }
    }

    // 3) Nur wenn Text vorhanden ist → sichtbare Bubble anhängen
    if (!text) return;

    setMessages((prev) => {
      const role: Role = kind === "mode" ? "system" : "assistant";
      const msg: ChatMessage = { role, content: text, format: "markdown" };
      const next = truncateMessages([...(Array.isArray(prev) ? prev : []), msg]);
      persistMessages(next);
      return next;
    });
  };

  window.addEventListener("mpathy:system-message" as any, onSystem as any);
  return () => window.removeEventListener("mpathy:system-message" as any, onSystem as any);
}, [persistMessages]);


  // ===============================================================
  // Autosrollen ans Ende, wenn am Bottom
  // ===============================================================
  useEffect(() => {
    const el = convoRef.current as HTMLDivElement | null;
    if (!el || !stickToBottom) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [messages, dockH, stickToBottom]);

  // ===============================================================
  // Scroll-Listener zur Bottom-Erkennung
  // ===============================================================
  useEffect(() => {
    const el = convoRef.current as HTMLDivElement | null;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setStickToBottom(distance < 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ===============================================================
  // Lokale Chat-Sendefunktion (ruft echte API)
  // ===============================================================
  async function sendMessageLocal(context: ChatMessage[]): Promise<ChatMessage> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin", // Session mitgeben
      body: JSON.stringify({ messages: context }),
    });
    if (!res.ok) throw new Error("Chat API failed");
    const data = await res.json();
    const assistant = data.assistant ?? data;
    return {
      role: assistant.role ?? "assistant",
      content: assistant.content ?? "",
      format: assistant.format ?? "markdown",
    } as ChatMessage;
  }

  // ===============================================================
  // Prompt-Handler – sendet Text aus Eingabefeld
  // ===============================================================
  const onSendFromPrompt = useCallback(async (text: string) => {
    const trimmed = (text ?? "").trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed, format: "markdown" };
    const optimistic = truncateMessages([...(messages ?? []), userMsg]);
    setMessages(optimistic);
    persistMessages(optimistic);
    setLoading(true);
    setMode("THINKING");

    try {
      const assistant = await sendMessageLocal(optimistic);
      const next = truncateMessages([...(optimistic ?? []), assistant]);
      setMessages(next);
      persistMessages(next);
    } catch {
      const next = truncateMessages([
        ...(optimistic ?? []),
        { role: "assistant", content: "⚠️ Send failed. Please retry.", format: "markdown" },
      ]);
      setMessages(next);
      persistMessages(next);
    } finally {
      setLoading(false);
      setMode("DEFAULT");
    }
  }, [messages, persistMessages]);



  /* =====================================================================
   [ANCHOR:LAYOUT] — Bühne, Container, Radial-Hintergrund
   ===================================================================== */

// Mobile Overlay
const [overlayOpen, setOverlayOpen] = useState(false);

// Farben ausschließlich aus Tokens
const color = activeTokens.color;
const bg0 = color.bg0 ?? "#000000";
const bg1 = color.bg1 ?? "#0c0f12";
const textColor = color.text ?? "#E6F0F3";

// Seitenstil (radial + linear)
const pageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  color: textColor,
  background: [
    "radial-gradient(90rem 60rem at 50% 35%, rgba(34,211,238,0.08), transparent 60%)",
    "radial-gradient(75rem 55rem at 50% 60%, rgba(148,163,184,0.06), transparent 65%)",
    `linear-gradient(180deg, ${bg1}, ${bg0} 60%, #000 100%)`,
  ].join(", "),
};

// Optional: Abstand unten (mobil über visualViewport gepflegt)
const padBottom = `calc(${dockH}px + var(--safe-bottom) + 24px)`;

/* 3.2 — Mobile Header State + Viewport Hook (BEGIN) */
const [mState, setMState] = useState<"idle" | "shrink" | "typing">("idle");

// Keyboard-/Viewport-Handling (setzt --vh / --safe-bottom / --dock-cap dynamisch)
useMobileViewport(typeof document !== "undefined" ? document.body : null);
/* 3.2 — Mobile Header State + Viewport Hook (END) */

/* 3.3 — Scroll → Header shrink (BEGIN) */
useEffect(() => {
  if (!isMobile || !convoRef?.current) return;
  const el = convoRef.current as HTMLElement;
  const onScroll = () => {
    if (mState === "typing") return;
    const y = el.scrollTop || 0;
    setMState(y > 24 ? "shrink" : "idle");
  };
  el.addEventListener("scroll", onScroll, { passive: true });
  return () => el.removeEventListener("scroll", onScroll);
}, [isMobile, mState, convoRef]);
/* 3.3 — Scroll → Header shrink (END) */

/* 3.4 — Focus im Prompt/Dock → Header typing (BEGIN) */
useEffect(() => {
  if (!isMobile) return;
  const onFocusIn = (e: FocusEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && t.closest("#m-input-dock")) setMState("typing");
  };
  const onFocusOut = (e: FocusEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && t.closest("#m-input-dock")) {
      setMState((prev) =>
        prev === "typing"
          ? (convoRef?.current && (convoRef.current as HTMLElement).scrollTop > 24 ? "shrink" : "idle")
          : prev
      );
    }
  };
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  return () => {
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
  };
}, [isMobile, convoRef]);
/* 3.4 — Focus im Prompt/Dock → Header typing (END) */

/* 3.5 — CSS-Variable --header-h je State setzen (BEGIN) */
useEffect(() => {
  if (!isMobile) return;
  const root = document.documentElement;
  const value =
    mState === "typing"
      ? "var(--header-h-typing)"   // 0px
      : mState === "shrink"
      ? "var(--header-h-shrink)"   // 72px
      : "var(--header-h-idle)";    // 96px
  root.style.setProperty("--header-h", value);
}, [isMobile, mState]);
/* 3.5 — CSS-Variable --header-h je State setzen (END) */

return (
  <main style={{ ...pageStyle, display: "flex", flexDirection: "column" }}>
    {/* === HEADER: eigene BLOCK-Section, fixiert oben === */}
    <header
      ref={headerRef}
      role="banner"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: isMobile ? "var(--header-h)" : "224px",
        background: bg0,
        borderBottom: `1px solid ${activeTokens.color.glassBorder ?? "rgba(255,255,255,0.10)"}`,
      }}
    >
      <div
        style={{
          width: "100vw",
          maxWidth: "none",
          margin: 0,
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LogoM size={isMobile ? 120 : 160} active={loading} />
      </div>
    </header>

    {/* === BÜHNE: startet unter dem fixierten Header === */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        marginInline: sideMargin,
        minHeight: 0,
        maxWidth: 1280,
        alignSelf: "center",
        width: "100%",
        paddingTop: isMobile ? "var(--header-h)" : "224px",
      }}
    >
      {/* Bühne: Desktop 2 Spalten (Säule links), Mobile 1 Spalte */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
          alignItems: "start",
          gap: 16,
          flex: 1,
          minHeight: 0,
          overflow: "visible",
          ["--header-offset" as any]: "16px",
        }}
      >
        {/* Säule links */}
        {!isMobile && <SidebarContainer onSystemMessage={systemSay} />}

        {/* Rechte Spalte: Conversation + Dock */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {/* Scrollbarer Chronik-Container (einziger Scroll) */}
          <div
            ref={convoRef as any}
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              pointerEvents: "auto",
              touchAction: "pan-y",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
              paddingTop: 8,
              paddingBottom: padBottom,
              scrollbarGutter: "stable",
            }}
            aria-label={t("conversationAria")}
          >
            <Conversation
              messages={messages}
              tokens={activeTokens}
              padBottom={padBottom}
              scrollRef={convoRef as any}
            />
          </div>

          {/* Prompt Dock (sticky bottom, compact) */}
          <div
            id="m-input-dock"
            ref={dockRef as any}
            role="group"
            aria-label="Chat Eingabeleiste"
            className="gold-dock mob-transition"
            onAnimationEnd={(e) => {
              const el = e.target as HTMLElement;
              if (el.classList.contains("send-ripple")) el.classList.remove("send-ripple");
            }}
            style={{
              position: "sticky",
              bottom: 0,
              zIndex: 50,
              background: bg0,
              padding: "10px 10px calc(10px + var(--safe-bottom))",
              marginTop: 6,
              borderTop: `1px solid ${activeTokens.color.glassBorder ?? "rgba(255,255,255,0.12)"}`,
              backdropFilter: "blur(8px)",
              boxShadow: "0 -6px 24px rgba(0,0,0,.35)",
              overscrollBehavior: "contain",
            }}
          >
            <div className="gold-prompt-wrap">
              <textarea
                id="gold-input"
                aria-label={t("writeMessage")}
                placeholder={t("writeMessage")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={(e) => {
                  const ta = e.currentTarget;
                  ta.style.height = "auto";
                  const cap = Math.min(ta.scrollHeight, Math.round(window.innerHeight * 0.30));
                  ta.style.height = `${cap}px`;
                  ta.classList.add("is-typing");
                }}
                onBlur={(e) => e.currentTarget.classList.remove("is-typing")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) {
                      const dockEl = document.getElementById("m-input-dock");
                      dockEl?.classList.add("send-ripple");
                      void dockEl?.getBoundingClientRect();
                      onSendFromPrompt(input);
                      setInput("");
                      const ta = document.getElementById("gold-input") as HTMLTextAreaElement | null;
                      if (ta) ta.style.height = "auto";
                    }
                  }
                }}
                rows={1}
                className="gold-textarea"
                spellCheck
                autoCorrect="on"
                autoCapitalize="sentences"
              />
              <button
                type="button"
                className="gold-send"
                aria-label={t("send")}
                disabled={loading || !input.trim()}
                onClick={() => {
                  if (!loading && input.trim()) {
                    const dockEl = document.getElementById("m-input-dock");
                    dockEl?.classList.add("send-ripple");
                    void dockEl?.getBoundingClientRect();
                    onSendFromPrompt(input);
                    setInput("");
                    const ta = document.getElementById("gold-input") as HTMLTextAreaElement | null;
                    if (ta) { ta.style.height = "auto"; ta.classList.remove("is-typing"); }
                  }
                }}
              >
                {t("send")}
              </button>
            </div>
          </div>

          {/* Status-Footer (rein visuell, keine Logik) */}
          <div
            aria-label="Statusleiste"
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "8px 10px",
              borderRadius: 12,
              background: "rgba(8,14,18,0.60)",
              border: `1px solid ${activeTokens.color.glassBorder ?? "rgba(255,255,255,0.10)"}`,
              color: activeTokens.color.text,
              fontSize: 12,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0ff", boxShadow: "0 0 8px rgba(0,255,255,.8)" }} />
              {t("statusMode") ?? "Mode"}:&nbsp;
              <strong>{footerStatus.modeLabel || "—"}</strong>
            </span>

            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0ff", boxShadow: "0 0 8px rgba(0,255,255,.8)" }} />
              {t("currentExpert") ?? "Expert"}:&nbsp;
              <strong>{footerStatus.expertLabel || "—"}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Overlay / Onboarding */}
    {isMobile && (
      <>
        <StickyFab onClick={() => setOverlayOpen(true)} label="Menü öffnen" />
        <MobileOverlay
          open={overlayOpen}
          onClose={() => setOverlayOpen(false)}
          onSystemMessage={systemSay}
        />
      </>
    )}
    <OnboardingWatcher active={mode === "ONBOARDING"} onSystemMessage={systemSay} />

    {/* Golden Prompt — minimal global styles & motion */}
    <style jsx global>{`
      .mi-plus-btn { display: none !important; }

      .gold-prompt-wrap {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        align-items: end;
        width: min(920px, 100%);
        margin: 0 auto;
      }
      .gold-textarea {
        width: 100%;
        min-height: 44px;
        max-height: var(--dock-cap);
        resize: none;
        border-radius: 12px;
        padding: 10px 12px;
        line-height: 1.5;
        border: 1px solid ${activeTokens.color.glassBorder ?? "rgba(255,255,255,0.12)"};
        background: rgba(255,255,255,0.04);
        color: ${activeTokens.color.text};
        outline: none;
        transition: box-shadow var(--t-mid, 120ms) var(--ease, cubic-bezier(.2,.6,.2,1)),
                    border-color var(--t-mid, 120ms) var(--ease, cubic-bezier(.2,.6,.2,1));
      }
      .gold-textarea:is(:hover, :focus, .is-typing) {
        box-shadow: 0 0 0 1px ${activeTokens.color.cyanBorder ?? "rgba(34,211,238,0.28)"},
                    0 0 18px rgba(34,211,238,0.18);
        border-color: ${activeTokens.color.cyanBorder ?? "rgba(34,211,238,0.28)"};
      }

      .gold-send {
        min-height: 44px;
        padding: 0 14px;
        border-radius: 12px;
        font-weight: 700;
        border: 1px solid ${activeTokens.color.cyanBorder ?? "rgba(34,211,238,0.28)"};
        background: ${activeTokens.color.cyanGlass ?? "rgba(34,211,238,0.12)"};
        color: ${activeTokens.color.text};
        cursor: pointer;
        transition: transform 120ms var(--ease, cubic-bezier(.2,.6,.2,1)),
                    box-shadow 120ms var(--ease, cubic-bezier(.2,.6,.2,1));
      }
      .gold-send:hover:not(:disabled) { transform: translateY(-1px); }
      .gold-send:active:not(:disabled) { transform: translateY(0); }
      .gold-send:disabled { opacity: .45; cursor: default; }

      .gold-dock.send-ripple {
        animation: gp-inertia 320ms var(--ease, cubic-bezier(.2,.6,.2,1)) 1,
                   gp-ripple 680ms ease-out 1;
      }
      @keyframes gp-inertia {
        0% { transform: translateZ(0) translateY(0); }
        55% { transform: translateZ(0) translateY(-3px); }
        100% { transform: translateZ(0) translateY(0); }
      }
      @keyframes gp-ripple {
        0% { box-shadow: 0 -6px 24px rgba(0,0,0,.35), inset 0 0 0 0 rgba(34,211,238,0.0); }
        15% { box-shadow: 0 -6px 24px rgba(0,0,0,.35), inset 0 0 0 1000px rgba(34,211,238,0.08); }
        100% { box-shadow: 0 -6px 24px rgba(0,0,0,.35), inset 0 0 0 0 rgba(34,211,238,0.0); }
      }
        /* === Golden Prompt: harte Entkoppelung von Legacy input-bar.css ====== */
/* Button darf NIEMALS absolut werden */
#m-input-dock .gold-prompt-wrap { 
  display: grid;
  grid-template-columns: 1fr max-content; /* Button misst sich selbst */
  align-items: center;
  gap: 10px;
}
#m-input-dock .gold-textarea,
#m-input-dock .gold-send {
  position: static !important;
  float: none !important;
  inset: auto !important;
  box-sizing: border-box !important;
}

/* Schrift & Spacing korrigieren (falls Legacy monospace erzwingt) */
#m-input-dock .gold-textarea {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji" !important;
  letter-spacing: 0 !important;
  padding-right: 12px !important; /* Button-Gap sauber */
}

/* Button-Größe + Inline-Layout erzwingen */
#m-input-dock .gold-send {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 44px !important;
  min-width: 92px;
  white-space: nowrap;
}

/* Schutz vor globalen Button/textarea-Resets aus Legacy-CSS */
#m-input-dock button.gold-send,
#m-input-dock textarea.gold-textarea {
  border: initial;
  background-clip: padding-box;
}

    `}</style>
  </main>
);
}