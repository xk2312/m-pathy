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
  useState,
  useRef,
  useCallback,
  useMemo,       // ✅ hinzugefügt
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
          role="listitem"
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
    <form
      id="m-input-dock"
      ref={dockRef as any}
      onSubmit={onSubmit}
      style={dockStyle}
      aria-label="Message input"
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
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        style={{
          height: 44,
          padding: "0 18px",
          border: 0,
          borderRadius: TOKENS.radius.md,
          background: tokens.color.cyan,
          color: "#071015",
          fontWeight: 700,
          cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
          opacity: disabled || !value.trim() ? 0.6 : 1,
          boxShadow: "0 0 18px rgba(34,211,238,0.25)",
          transition: "transform .12s ease",
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        aria-label="Senden"
      >
        Senden
      </button>
    </form>
  );
}

/* =======================================================================
   [ANCHOR:BEHAVIOR] — Chatlogik (Azure OpenAI)
   ======================================================================= */

export default function Page2() {
  // Persona/Theme
  const theme = useTheme("default");
  const activeTokens: Tokens = theme.tokens;

  // Breakpoint + Seitenränder
  const { isMobile } = useBreakpoint(768);
  const sideMargin = isMobile ? theme.dock.mobile.side : theme.dock.desktop.side;

  // Refs & Höhenmessung
  const headerRef = useRef<HTMLDivElement>(null);
  const convoRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLFormElement>(null);
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

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [mode, setMode] = useState<string>("DEFAULT");

  // Persist
  const persistMessages = saveMessages;

  // Initiale Begrüßung / Restore
  useEffect(() => {
    const restored = loadMessages();
    if (Array.isArray(restored) && restored.length) {
      setMessages(restored);
      return;
    }
    setMessages([
      { role: "assistant", content: "Welcome. I'm M. Mother of AI.", format: "markdown" },
    ]);
  }, []);

  // Systemmeldung (für Säule/Overlay/Onboarding)
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

  // Autosrollen ans Ende, wenn am Bottom
  useEffect(() => {
    const el = convoRef.current as HTMLDivElement | null;
    if (!el || !stickToBottom) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [messages, dockH, stickToBottom]);

  // Scroll-Listener zur Bottom-Erkennung
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

  /// app/page2/page.tsx — REPLACE ONLY THIS FUNCTION
async function sendMessageLocal(context: ChatMessage[]): Promise<ChatMessage> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: context }),
  });
  if (!res.ok) throw new Error("Chat API failed");
  const data = await res.json();
  const assistant = (data.assistant ?? data); // route returns either wrapped or raw
  return {
    role: assistant.role ?? "assistant",
    content: assistant.content ?? "",
    format: assistant.format ?? "markdown",
  } as ChatMessage;
}


  // Submit → Senden
  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { role: "user", content: text, format: "markdown" };
    const optimistic = truncateMessages([...(messages ?? []), userMsg]);
    setMessages(optimistic);
    persistMessages(optimistic);
    setInput("");
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
  }, [input, messages, persistMessages]);

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

  // Optional: Abstand unten (falls du ihn in Conversation nutzt)
  const padBottom = `calc(${dockH}px + env(safe-area-inset-bottom, 0px) + 24px)`;

  return (
    <main style={{ ...pageStyle, display: "flex", flexDirection: "column" }}>
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
        }}
      >
        {/* Header-Bereich in page2.tsx */}
<div
  ref={headerRef}
  style={{
    position: "sticky",
    top: 0,
    zIndex: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "32px 0",
    background: "rgba(0, 0, 0, 0.85)", // ⬅️ kräftiger Hintergrund
    backdropFilter: "blur(6px)",       // ⬅️ sorgt für Bühne-Effekt
  }}
>
  <LogoM size={isMobile ? 120 : 160} active={loading} />
</div>



        {/* Bühne: Desktop 2 Spalten (Säule links), Mobile 1 Spalte */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
            gap: 16,
            minHeight: 0,
            flex: 1,
          }}
        >
          {/* Säule links – Desktop statisch */}
          {!isMobile && <SidebarContainer onSystemMessage={systemSay} />}

          {/* Rechte Spalte: Conversation + Dock */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            {/* Scrollbarer Chronik-Container */}
            <div
              ref={convoRef as any}
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                paddingTop: 8,
                paddingBottom: 8,
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

            {/* Eingabe-Dock (im Fluss, mit Mess-Ref) */}
            <InputDock
              tokens={activeTokens}
              isMobile={isMobile}
              onSubmit={onSubmit}
              value={input}
              setValue={setInput}
              disabled={loading}
              dockRef={dockRef as any}
              mode="flow"
            />
          </div>
        </div>
      </div>

      {/* Mobile: FAB + Overlay (Säule als Drawer) */}
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

      {/* Optional aktivierbar */}
      <OnboardingWatcher active={mode === "ONBOARDING"} onSystemMessage={systemSay} />
    </main>
  );
}
