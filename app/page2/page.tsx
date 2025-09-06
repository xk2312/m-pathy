"use client";

/**
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
        <span style={{
          position: "absolute",
          left: -9999,
          width: 1, height: 1, overflow: "hidden"
        }}>
          M
        </span>
      </div>
    </header>
  );
}


/** Sprechblase mit M-Avatar für Assistant */
// --- Markdown Mini-Renderer (XSS-safe: erst escapen, dann Muster ersetzen)
function mdToHtml(src: string): string {
  const esc = String(src)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Überschriften
  const withHeadings = esc
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>");

  // Fett/Kursiv/Code inline
  const withInline = withHeadings
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+?)`/g, "<code>$1</code>");

  // Einfache Listen
  const withLists = withInline
    .replace(/^(?:- |\* )(.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)(?:(?:\r?\n)?(?!<li>))/gs, "<ul>$1</ul>\n");

  // Absätze (doppelte Zeilenumbrüche)
  return withLists
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^/, "<p>").replace(/$/, "</p>");
}

// --- Body einer Nachricht: entscheidet Markdown vs. Plaintext
function MessageBody({ msg }: { msg: ChatMessage }) {
  const isMd = (msg as any).format === "markdown";
  if (isMd) {
    return (
      <div
        // Nur generiertes, zuvor escaptes HTML einfügen
        dangerouslySetInnerHTML={{ __html: mdToHtml(String(msg.content ?? "")) }}
        style={{ lineHeight: 1.55 }}
      />
    );
  }
  return <div style={{ lineHeight: 1.55 }}>{String(msg.content ?? "")}</div>;
}

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


/** Nachrichtenliste */

function Conversation({
  messages,
  tokens,
  padBottom = "12px",
  scrollRef,
}: {
  messages: ChatMessage[];
  tokens: Tokens;
  padBottom?: string;
  scrollRef?: React.Ref<HTMLDivElement>; // neu
}) {
  return (
    <section
      ref={scrollRef as any} // <— HIER die Ref an die echte Scroll-Section
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        paddingTop: 12,
        paddingBottom: padBottom,
        scrollbarWidth: "thin",
      }}
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
    // ✔︎ Fallback auf zentrale TOKENS (aus CONFIG)
    const activeTokens: Tokens = (theme as any)?.tokens ?? TOKENS;
  
    // Breakpoint + Seitenränder nach Vorgabe
    const { isMobile } = useBreakpoint(768);
  
    // Höhen-Messung für scrollbare Conversation
    const headerRef = React.useRef<HTMLDivElement>(null);
    const convoRef  = React.useRef<HTMLDivElement>(null); // wird an <Conversation scrollRef> gereicht
    const [vh, setVh] = useState(0);
    const [headerH, setHeaderH] = useState(0);
    const [dockH, setDockH] = useState(0);
  
    useEffect(() => {
      const measure = () => {
        setVh(window.innerHeight);
        setHeaderH(headerRef.current?.offsetHeight || 0);
        const dockEl = document.getElementById("m-input-dock");
        setDockH((dockEl as HTMLElement | null)?.offsetHeight || 0);
      };
      measure();
  
      window.addEventListener("resize", measure);
      const ro = new ResizeObserver(measure);
      if (headerRef.current) ro.observe(headerRef.current);
      const dockEl = document.getElementById("m-input-dock");
      if (dockEl) ro.observe(dockEl);
  
      return () => {
        window.removeEventListener("resize", measure);
        ro.disconnect();
      };
    }, []);
  
    const sideMargin =
      isMobile
        ? (theme as any)?.dock?.mobile?.side ?? 12
        : (theme as any)?.dock?.desktop?.side ?? 24;
  
    // ── Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
  
    // Persist aus UTILS verwenden
    const persistMessages = saveMessages;
  
    // Initiale Begrüßung (mit Restore aus LocalStorage, falls vorhanden)
    useEffect(() => {
      const restored = loadMessages();
      if (Array.isArray(restored) && restored.length) {
        setMessages(restored);
        return;
      }
      setMessages([
        { role: "assistant", content: "Welcome. I'm M. Mother of AI.", format: "markdown" } as ChatMessage,
      ]);
    }, []);
  
    // Systemmeldung → hängt Bubble an (wird via Sidebar-Prop genutzt)
    const systemSay = useCallback((content: string) => {
      if (!content) return;
      setMessages((prev) => {
        const next = truncateMessages([
          ...(Array.isArray(prev) ? prev : []),
          { role: "assistant", content, format: "markdown" } as ChatMessage,
        ]);
        persistMessages(next);
        return next;
      });
    }, [persistMessages]);
  
    // (Deaktiviert) CustomEvent-Brücke – vermeiden von Doppel-Bubbles
    // useEffect(() => {
    //   const handler = (e: Event) => {
    //     const ce = e as CustomEvent<any>;
    //     const msg =
    //       typeof ce.detail === "string"
    //         ? ce.detail
    //         : (ce.detail && typeof ce.detail.text === "string" ? ce.detail.text : "");
    //     if (msg) systemSay(msg);
    //   };
    //   window.addEventListener("mpathy:system-message", handler as EventListener);
    //   return () => {
    //     window.removeEventListener("mpathy:system-message", handler as EventListener);
    //   };
    // }, [systemSay]);
  
    // Autoscroll: nach jeder neuen Nachricht ans Ende
    useEffect(() => {
      const el = convoRef.current;
      if (!el) return;
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }, [messages, dockH]);
  
    // Wandelt beliebige Content-Formen in einen gültigen Textstring um
    function toSafeContent(value: unknown): string {
      if (typeof value === "string") return value;
      if (Array.isArray(value)) {
        return value.map(v => (typeof v === "string" ? v : JSON.stringify(v))).join("\n");
      }
      if (value && typeof value === "object") {
        try {
          // @ts-ignore – häufiges Muster: { text: "..." }
          if (typeof (value as any).text === "string") return (value as any).text;
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      }
      return String(value ?? "");
    }
  
    // Einheitliche Sendelogik (mit sanftem 1x-Retry; kein Doppel-Append)
    async function handleSend(userText: string, retried = false): Promise<void> {
      const t = userText.trim();
      if (!t || loading) return;
  
      // Beim Retry KEINE zweite User-Bubble anhängen
      const next: ChatMessage[] = retried
        ? messages
        : [...messages, { role: "user", content: t } as ChatMessage];
  
      if (!retried) {
        setMessages(next);
        persistMessages(next);
      }
      setLoading(true);
  
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map((m) => ({
              role: m.role,
              content: toSafeContent((m as any).content),
            })),
            temperature: 0.7,
          }),
        });
  
        // Einmaliger, sanfter Retry bei Transport-/Antwortfehlern
        if (!res.ok) {
          if (!retried) {
            console.warn("[chat] retry after non-OK response …");
            await new Promise(r => setTimeout(r, 300));
            return handleSend(userText, true);
          }
          throw new Error(await res.text());
        }
  
        let data: any = null;
        try {
          data = await res.json();
        } catch {
          if (!retried) {
            console.warn("[chat] retry after JSON parse …");
            await new Promise(r => setTimeout(r, 200));
            return handleSend(userText, true);
          }
          throw new Error("Antwort unlesbar");
        }
  
        const normalizedRole: Role =
          (data && typeof data.role === "string" && (["user","assistant","system"] as const).includes(data.role as Role))
            ? (data.role as Role)
            : "assistant";
  
        // Nur antworten, wenn nach Normalisierung echter Text vorhanden ist
        const raw = (data as any)?.content ?? (data as any)?.reply ?? "";
        const replyText = toSafeContent(raw);
        const hasContent = typeof replyText === "string" && replyText.trim().length > 0;
  
        const reply: ChatMessage | null = hasContent
          ? { role: normalizedRole, content: replyText, format: "markdown" as const }
          : null;
  
        setMessages((m) => {
          const merged = reply ? truncateMessages([...m, reply]) : m; // keine leere Bubble
          persistMessages(merged);
          return merged;
        });
      } catch (err: any) {
        setMessages((m) => {
          const merged = truncateMessages([
            ...m,
            { role: "assistant", content: `⚠️ Verbindung: ${err?.message || "Unbekannt"}` },
          ]);
          persistMessages(merged);
          return merged;
        });
      } finally {
        setLoading(false);
      }
    }
  
    async function sendMessage(e: FormEvent) {
      e.preventDefault();
      const t = input.trim();
      if (!t) return;
      setInput("");
      await handleSend(t);
    }
  
    /* =======================================================================
       [ANCHOR:LAYOUT] — Bühne, Container, Radial-Hintergrund
       ======================================================================= */
  
    // UI-State (nur fürs Mobile-Overlay)
    const [overlayOpen, setOverlayOpen] = useState(false);
  
    // Farben ausschließlich aus activeTokens
    const color = activeTokens.color;
    const bg0 = color.bg0 ?? "#000000";
    const bg1 = color.bg1 ?? "#0b1220";
    const textColor = color.text ?? "#ffffff";
  
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
          {/* Header */}
          <div
            ref={headerRef}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "24px 0",
            }}
          >
            <LogoM size={isMobile ? 120 : 160} active={loading} />
          </div>
  
          {/* Bühne: 2 Spalten */}
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
  
            {/* Rechte Spalte */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
              }}
            >
              {/* Chronik (scrollbar) */}
              <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
                <Conversation
                  messages={messages}
                  tokens={activeTokens}
                  padBottom={`calc(${dockH}px + env(safe-area-inset-bottom, 0px) + 24px)`}
                  scrollRef={convoRef}
                />
              </div>
  
              {/* Eingabe-Dock (Mess-Anker) */}
              <div
                id="m-input-dock"
                role="group"
                aria-label="Chat Eingabeleiste"
                style={{
                  position: "sticky",
                  bottom: 0,
                  paddingTop: 8,
                  background: "transparent",
                }}
              >
                <MessageInput onSend={handleSend} disabled={loading} />
              </div>
            </div>
          </div>
        </div>
  
        {/* Mobile: FAB + Overlay */}
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
      </main>
    );
  }
  //I ♥️ M