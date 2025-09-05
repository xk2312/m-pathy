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
import MessageBody from "../components/MessageBody";
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

   export type Tokens = {
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
  
  export const TOKENS: Tokens = {
    radius: { sm: 10, md: 12, lg: 16 },
    shadow: {
      soft: "0 14px 40px rgba(0,0,0,0.35)",
      glowCyan: "0 0 28px rgba(34,211,238,0.12)",
    },
    color: {
      bg0: "#000",             // tiefe Bühne
      bg1: "#0c0f12",          // Zenith-Glow
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
  
  export type Theme = {
    name: string;
    tokens: Tokens;
    dock: {
      desktop: { width: number; bottom: number; side: number };
      mobile: { widthCalc: string; bottom: number; side: number };
    };
  };
  
  export const THEMES: Record<string, Theme> = {
    m_default: {
      name: "m_default",
      tokens: TOKENS,
      dock: {
        desktop: { width: 600, bottom: 300, side: 24 },   // ← Bühne fix
        mobile: { widthCalc: "calc(100% - 20px)", bottom: 50, side: 10 },
      },
    },
  };
  
  // Personas mappen auf Themes
  export const PERSONAS: Record<string, { theme: keyof typeof THEMES }> = {
    default: { theme: "m_default" },
  };
  
  // -----------------------------------------------------------------------
  // Council-Module Mapping: Buttons → SystemCommands
  // (wird von Saeule.tsx via onSystemMessage getriggert)
  export const COUNCIL_COMMANDS: Record<string, string> = {
    LUX: "INIT LUX-Anchor",                          // siehe LUX.pdf:contentReference[oaicite:5]{index=5}
    JURAXY: "INITIATE JURAXY-1/13",                  // siehe JURAXY.pdf:contentReference[oaicite:6]{index=6}
    DATAMASTER: "START DataMaster Session",          // siehe DataMaster.pdf:contentReference[oaicite:7]{index=7}
    CHEMOMASTER: "START ChemoMaster 2.0 Loop",       // siehe ChemoMaster.pdf:contentReference[oaicite:8]{index=8}
    SHADOWMASTER: "TRIGGER_SHADOW_ANALYSIS",         // siehe ShadowMaster.pdf:contentReference[oaicite:9]{index=9}
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
       return Array.isArray((parsed as any)?.messages) ? (parsed as any).messages as ChatMessage[] : [];
     } catch {
       return [];
     }
   }
   
   function saveMessages(messages: ChatMessage[]): void {
     if (typeof window === "undefined") return;
     try {
       window.localStorage.setItem(
         LS_KEY,
         JSON.stringify({ messages, updatedAt: Date.now() })
       );
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
  height,
}: {
  messages: ChatMessage[];
  tokens: Tokens;
  height: number; // <— dynamische Höhe
}) {
  return (
    <section
      style={{
        height,
        overflowY: "auto",
        paddingTop: 12,
        paddingBottom: 12,
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
    const convoRef  = React.useRef<HTMLDivElement>(null);
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
        { role: "assistant", content: "Welcome. I'm M. Mother of AI." } as ChatMessage,
      ]);
    }, []);
  
    // Systemmeldung → hängt Bubble an (wird auch vom Säulen-Event genutzt)
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
  
    // CustomEvent-Brücke: Saeule.tsx -> Page2 (Buttons feuern SystemMessage)
    useEffect(() => {
      const handler = (e: Event) => {
        const ce = e as CustomEvent<string>;
        systemSay(ce?.detail ?? "");
      };
      window.addEventListener("mpathy:system-message", handler as EventListener);
      return () => {
        window.removeEventListener("mpathy:system-message", handler as EventListener);
      };
    }, [systemSay]);
  
    // Einheitliche Sendelogik
    async function handleSend(text: string): Promise<void> {
      const t = text.trim();
      if (!t || loading) return;
  
      const next: ChatMessage[] = [...messages, { role: "user", content: t } as ChatMessage];
      setMessages(next);
      persistMessages(next);
      setLoading(true);
  
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
            temperature: 0.7,
          }),
        });
  
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
  
        const normalizedRole: Role =
          (data && typeof data.role === "string" && (["user","assistant","system"] as const).includes(data.role as Role))
            ? (data.role as Role)
            : "assistant";
  
        const reply: ChatMessage =
          data && typeof data.content === "string"
            ? { role: normalizedRole, content: data.content }
            : { role: "assistant", content: String(data?.reply ?? "") || "…" };
  
        setMessages((m) => {
          const merged = truncateMessages([...m, reply]);
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
      <main style={{ ...pageStyle, display: "flex", flexDirection: "column", height: "100dvh" }}>
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
            <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
              {/* Chronik (scrollbar) */}
              <div
                ref={convoRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  paddingTop: 12,
                  paddingBottom: `calc(${dockH}px + env(safe-area-inset-bottom, 0px) + 24px)`,
                  scrollbarWidth: "thin",
                }}
              >
                <div>
                  {messages.map((m, i) => (
                    <Bubble key={i} msg={m} tokens={activeTokens} />
                  ))}
                </div>
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
  