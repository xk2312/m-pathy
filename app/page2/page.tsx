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

import React, { useEffect, useMemo, useState, FormEvent, useRef } from "react";
import Image from "next/image"; // ⬅️ oben bei den Imports sicherstellen
import LogoM from "../components/LogoM";
import MessageBody from '../components/MessageBody';
import MessageInput from '../components/MessageInput';
import Saeule from "../components/Saeule";
import SidebarContainer from "../components/SidebarContainer";
import MobileOverlay from "../components/MobileOverlay";
import StickyFab from "../components/StickyFab";


/* =======================================================================
   [ANCHOR:CONFIG]  — Design Tokens, Themes, Personas, System Prompt
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
      desktop: { width: 600, bottom: 300, side: 24 },   // ← Deine Vorgaben
      mobile: { widthCalc: "calc(100% - 20px)", bottom: 50, side: 10 },
    },
  },
};

// Personas können hier später andere Themes mappen
const PERSONAS: Record<string, { theme: keyof typeof THEMES }> = {
  default: { theme: "m_default" },
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
   [ANCHOR:UTILS]  — kleine Helfer
   ======================================================================= */

   function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
  }
  
  /** LocalStorage – schlank & failsafe */
  const LS_KEY = "mpathy:thread:default";
  const MAX_HISTORY = 200;
  
  function truncate<T>(arr: T[]): T[] {
    return arr.length > MAX_HISTORY ? arr.slice(arr.length - MAX_HISTORY) : arr;
  }
  function loadMessages(): any[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray((parsed as any)?.messages) ? (parsed as any).messages : [];
    } catch { return []; }
  }
  function saveMessages(messages: unknown[]): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify({ messages, updatedAt: Date.now() }));
    } catch {/* stiller Fail */}
  }
  
  

/* =======================================================================
   [ANCHOR:COMPONENTS]  — UI-Bausteine
   ======================================================================= */

   type Role = 'user' | 'assistant' | 'system';
   type ChatMessage = {
     role: Role;
     content: string;
     format?: 'plain' | 'markdown' | 'html';
   };   

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
   [ANCHOR:BEHAVIOR]  — Chatlogik (Azure OpenAI)
   ======================================================================= */
 
export default function Page2() {
  // Persona/Theme
  const theme = useTheme("default");
  const tokens = theme.tokens;

  // Breakpoint + Seitenränder nach Vorgabe
  const { isMobile } = useBreakpoint(768);
  // Höhen-Messung für scrollbare Conversation
const headerRef = React.useRef<HTMLDivElement>(null);
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
  
  const sideMargin = isMobile ? theme.dock.mobile.side : theme.dock.desktop.side;

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Initiale Begrüßung
  useEffect(() => {
    const initial = loadMessages();
    if (initial && initial.length > 0) {
      setMessages(initial as ChatMessage[]);
    } else {
      setMessages([{ role: "assistant", content: "Welcome. I am M. Mother of AI.", format: "markdown" }]);
    }
  }, []);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  if (saveTimer.current) clearTimeout(saveTimer.current);
  saveTimer.current = setTimeout(() => saveMessages(messages), 150);
  return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
}, [messages]);


async function sendMessage(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  // 1) Text primär aus dem Event/FormData lesen (von handleSend geliefert),
  //    Fallback: aktueller State `input`
  let text = input.trim();
  try {
    const form = e.currentTarget as HTMLFormElement | null;
    if (form) {
      const fd = new FormData(form);
      const fromForm =
        (fd.get("message") || fd.get("input") || "")?.toString().trim();
      if (fromForm) text = fromForm;
    }
  } catch {
    /* stiller Fallback auf State */
  }

  // 2) Guard: nur senden, wenn wirklich Text da ist und nicht bereits geladen wird
  if (!text || loading) return;

  // 3) User-Bubble sofort anhängen (⚠️ Rolling Window mit truncate)
  const userMsg: ChatMessage = { role: "user", content: text, format: "markdown" };
  const next: ChatMessage[] = [...messages, userMsg]; // für history/API stabil
  setMessages(prev => truncate([...(prev ?? []), userMsg]));
  setInput("");
  setLoading(true);

  try {
    // 4) Verlauf für die API (stabil aus `next`)
    const history: ChatMessage[] = [...next];

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history.map((m) => ({ role: m.role, content: m.content })),
        temperature: 0.7,
        protocol: "GPTX",
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();

    const reply: ChatMessage =
      data && typeof data.role === "string" && typeof data.content === "string"
        ? { ...(data as any), format: "markdown" }
        : { role: "assistant", content: String(data?.reply ?? "") || "…", format: "markdown" };

    // (✅) Reply anhängen mit truncate
    setMessages(prev => truncate([...(prev ?? []), reply]));

  } catch (err: any) {
    // (✅) Fehlerhinweis anhängen mit truncate
    setMessages(prev => truncate([
      ...(prev ?? []),
      { role: "assistant", content: `△ Verbindung: ${err?.message || "Unbekannt"}`, format: "markdown" }
    ]));

  } finally {
    setLoading(false);
  }
}

 // Adapter: MessageInput → nutzt DEINE bestehende sendMessage-Pipeline (FormEvent- oder State-basiert)
const handleSend = React.useCallback(async (text: string) => {
  console.log('[PAGE] handleSend:start', { text });

  // (A) globalen State befüllen – falls sendMessage aus 'input' liest
  setInput(text);

  // (B) einen Render-Tick abwarten, damit 'input' sicher aktualisiert ist
  await new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 0);
  });

  // (C) ein minimales Formular erzeugen – falls sendMessage FormData(e.currentTarget) liest
  const form = document.createElement('form');
  // wir decken die gängigen Feldnamen ab; wenn dein sendMessage keins davon nutzt, ist es egal
  const f1 = document.createElement('input'); f1.type = 'hidden'; f1.name = 'input';   f1.value = text;
  const f2 = document.createElement('input'); f2.type = 'hidden'; f2.name = 'message'; f2.value = text;
  form.appendChild(f1); form.appendChild(f2);

  // (D) Fake-Event mit preventDefault + currentTarget/target befüllen
  const fakeEvent = {
    preventDefault: () => {},
    currentTarget: form,
    target: form,
  } as unknown as FormEvent<HTMLFormElement>;

  console.log('[PAGE] call sendMessage');
  await sendMessage(fakeEvent);          // ⬅️ DEINE bestehende Funktion, unverändert

  // (E) optional: globalen Sicht-Input leeren (MessageInput leert sich selbst bereits)
  setInput('');
  console.log('[PAGE] sendMessage:done');
}, [sendMessage, setInput]);



  // Scroll-Ref für den Chronik-Container
  const convoRef = useRef<HTMLDivElement | null>(null);

  // Prüft, ob der User „nahe“ am unteren Rand ist (damit wir ihn beim Lesen nicht nerven)
  const isNearBottom = () => {
    const el = convoRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 160; // ~160px Toleranz
  };
  // Scrollt bei neuen Messages nach unten – aber nur, wenn der User nicht weit nach oben gescrolled hat
    useEffect(() => {
      const el = convoRef.current;
      if (!el) return;
      if (isNearBottom()) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    }, [messages.length]);

    // Beim ersten Mount einmal an den Boden springen (ohne Animation)
    useEffect(() => {
      const el = convoRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, []);




  /* ======================================================================
   [ANCHOR:LAYOUT]  — Bühne, Container, Radial-Hintergrund
   ===================================================================== */

const [overlayOpen, setOverlayOpen] = useState(false);

const pageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  color: tokens.color.text,
  background: `
    radial-gradient(90rem 60rem at 50% 35%, rgba(34,211,238,0.08), transparent 60%),
    radial-gradient(75rem 55rem at 50% 60%, rgba(148,163,184,0.06), transparent 65%),
    linear-gradient(180deg, ${tokens.color.bg1}, ${tokens.color.bg0} 60%, #000 100%)
  `,
};

return (
  <main
    style={{
      ...pageStyle,
      display: "flex",
      flexDirection: "column",
      height: "100dvh",
    }}
  >
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        marginLeft: sideMargin,
        marginRight: sideMargin,
        minHeight: 0,          // wichtig für Flex + Overflow
        maxWidth: 1280,        // optional: bremst extreme Breiten
        alignSelf: "center",   // optional: zentriert den Content
      }}
    >
      {/* Header: zentriertes M */}
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

      {/* UNTERER TEIL: 2-Spalten – links Säule/Container, rechts Chat */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
          gap: 16,
          minHeight: 0,
          flex: 1,
        }}
      >
        {/* Säule links (Desktop statisch via SidebarContainer; Mobile via Overlay) */}
        {!isMobile && <SidebarContainer />}

        {/* Rechte Spalte */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* Scrollbarer Chronik-Container */}
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
                <Bubble key={i} msg={m} tokens={tokens} />
              ))}
            </div>
          </div>

          {/* Eingabeleiste fuer unten rechts */}
          <div style={{ paddingTop: 8 }}>
            <MessageInput onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </div>
    </div>

    {/* Mobile: Sticky-FAB öffnet Overlay */}
    {isMobile && (
      <>
        <StickyFab onClick={() => setOverlayOpen(true)} label="Menü öffnen" />
        <MobileOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
      </>
    )}
  </main>
);
}