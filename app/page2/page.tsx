"use client";

/***
 * =========================================================
 *  M — PAGE2 MASTER (Single-File Design/Behavior - Control)
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
import hljs from "highlight.js";

import MTheater from "@/components/MTheater";
import { M_CURRENT_VARIANT } from "@/config/mLogoConfig";
import LogoM from "@/components/LogoM";
import MessageInput from "../components/MessageInput";
import Saeule from "../components/Saeule";
import SidebarContainer from "../components/SidebarContainer";
import MobileOverlay from "../components/MobileOverlay";
import StickyFab from "../components/StickyFab";
import { t } from "@/lib/i18n";
import OnboardingWatcher from "@/components/onboarding/OnboardingWatcher"; // ← NEU
import { useMobileViewport } from "@/lib/useMobileViewport";
// ⬇︎ Einheitlicher Persistenzpfad: localStorage-basiert
import { loadChat, saveChat, clearChat,initChatStorage, makeClearHandler, hardClearChat  } from "@/lib/chatStorage";

// Kompatibler Alias – damit restlicher Code unverändert bleiben kann
const persist = {
  save: saveChat,
  load: loadChat,
  // bisheriger „cut“-Semantik (120) beibehalten:
  cut : (arr: any[], max = 120) => Array.isArray(arr) ? arr.slice(-max) : [],
};

// ——— Theme-Token-Typen (global, einmalig) ———
type ColorTokens = { bg0?: string; bg1?: string; text?: string };
type ThemeTokens = { color?: ColorTokens; [k: string]: any };

// Gibt z. B. "de", "fr", "es", "en" zurück
function getBrowserLang(): string {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || (navigator as any).userLanguage || "en";
  return lang.split("-")[0].toLowerCase(); // "de-DE" -> "de"
}
/* =======================================================================
   [ANCHOR:I18N] — Sprachlabels für Button-Events
   ======================================================================= */

// Typdefinition für alle Events, die M ansteuern kann
type MEvent = "builder" | "onboarding" | "expert" | "mode";

// Übersetzungen pro Sprache
const LABELS: Record<string, Record<MEvent, string>> = {
  en: {
    builder: "Builder",
    onboarding: "Onboarding",
    expert: "Expert",
    mode: "Mode",
  },
  de: {
    builder: "Bauen",
    onboarding: "Onboarding",
    expert: "Experte",
    mode: "Modus",
  },
  fr: {
    builder: "Créer",
    onboarding: "Démarrage",
    expert: "Expert",
    mode: "Mode",
  },
  es: {
    builder: "Construir",
    onboarding: "Inicio",
    expert: "Experto",
    mode: "Modo",
  },
  it: {
    builder: "Costruire",
    onboarding: "Avvio",
    expert: "Esperto",
    mode: "Modalità",
  },
};

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
          className="chat-row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            margin: "14px 0 18px",
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

/* --- Markdown Mini-Renderer mit Codeblöcken & Copy-Buttons --- */
function mdToHtml(src: string): string {
  const raw = String(src ?? "");

  // 0) Fenced Code Blocks (```lang\n...\n```) → Platzhalter
  const codeBlocks: string[] = [];
  const withTokens = raw.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_m, lang, body) => {
      const language = (lang || "").trim().toLowerCase();
      const codeEsc = String(body ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const cls = language ? ` class="language-${language}"` : "";
      const idx = codeBlocks.length;

      const html =
        `<div class="md-code-block" data-code-block="true">` +
        `<button type="button" class="md-code-copy" data-copy-code="true" aria-label="Copy code">` +
        `⧉` +
        `</button>` +
        `<pre><code${cls}>${codeEsc}</code></pre>` +
        `</div>`;

      codeBlocks.push(html);
      return `@@CODE_BLOCK_${idx}@@`;
    }
  );

  // 1) Escapen des restlichen Textes
  const esc = withTokens
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

  // 4) Unordered lists (zusammenhängende -/* Blöcke)
  out = out.replace(
    /(^|\n)((?:[-*]\s+.*(?:\n|$))+)/g,
    (_m: string, prefix: string, block: string) => {
      const items = block
        .trimEnd()
        .split("\n")
        .filter(Boolean)
        .map((line: string) => line.replace(/^[-*]\s+/, ""))
        .map((text: string) => `<li>${text}</li>`)
        .join("");
      return `${prefix}<ul>${items}</ul>\n`;
    }
  );

  // 5) GitHub-Style Tabellen → echte <table>
  out = out.replace(
    /(^|\n)(\|[^\n]+\|\s*\n\|[\s:\-\|]+\|\s*\n(?:\|[^\n]+\|\s*\n)+)/g,
    (_m: string, prefix: string, block: string) => {
      const lines = block
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 3) return block;

      const header = lines[0];
      const align = lines[1];
      const rows = lines.slice(2);

      const split = (line: string) =>
        line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

      const hCells = split(header);
      const aCells = split(align).map((s) => {
        const left = /^:\-+/.test(s);
        const right = /\-+:$/.test(s);
        return right && left ? "center" : right ? "right" : "left";
      });

      const thead = `<thead><tr>${hCells
        .map(
          (c, i) =>
            `<th scope="col" style="text-align:${aCells[i] ?? "left"}">${c}</th>`
        )
        .join("")}</tr></thead>`;

      const tbody = `<tbody>${rows
        .map((r) => {
          const cells = split(r);
          return `<tr>${cells
            .map(
              (c, i) =>
                `<td style="text-align:${aCells[i] ?? "left"}">${c}</td>`
            )
            .join("")}</tr>`;
        })
        .join("")}</tbody>`;

      return `${prefix}<div class="md-table-wrap"><table class="gptm-table">${thead}${tbody}</table></div>\n`;
    }
  );

  // 6) Absätze – Code-Platzhalter wieder einsetzen
  const blocks = out.split(/\n{2,}/);
  const rendered = blocks
    .map((b) => {
      const t = b.trim();
      if (!t) return "";

      const m = /^@@CODE_BLOCK_(\d+)@@$/.exec(t);
      if (m) {
        const idx = Number(m[1]);
        return codeBlocks[idx] ?? "";
      }

      if (
        /^<(h1|h2|h3|ul|ol|pre|blockquote|table|hr)\b/i.test(t) ||
        t.startsWith('<div class="md-table-wrap"') ||
        t.startsWith('<div class="md-code-block"')
      ) {
        return t;
      }
      return `<p>${t}</p>`;
    })
    .join("\n");

  return rendered;
}



/** Body einer Nachricht: entscheidet Markdown vs. Plaintext + Syntax-Highlighting */
function MessageBody({ msg }: { msg: ChatMessage }) {
  const isMd = (msg as any).format === "markdown";
  const html = isMd ? mdToHtml(String(msg.content ?? "")) : null;
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    try {
      const nodes = containerRef.current.querySelectorAll("pre code");
      nodes.forEach((el) => {
        const codeEl = el as HTMLElement;
        if (!codeEl.dataset.hljs) {
          hljs.highlightElement(codeEl);
          codeEl.dataset.hljs = "1";
        }
      });
    } catch {
      // niemals die App crashen lassen
    }
  }, [html]);

  if (isMd) {
    return (
      <div
        ref={containerRef}
        className="markdown"
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
        style={{ lineHeight: 1.55 }}
      />
    );
  }

  return (
    <div ref={containerRef} style={{ lineHeight: 1.55 }}>
      {String(msg.content ?? "")}
    </div>
  );
}

/** Sprechblase mit M-Avatar für Assistant + Copy-Button */
function Bubble({
  msg,
  tokens,
}: {
  msg: ChatMessage;
  tokens: Tokens;
}) {
  const isUser = msg.role === "user";

  // Basis-Bubble nur für den User
  const bubbleBase: React.CSSProperties = {
    maxWidth: "min(900px, 100%)",
    borderRadius: TOKENS.radius.lg,
    padding: "18px 22px",
    lineHeight: 1.6,
    backdropFilter: "blur(10px)",
    border: "1px solid",
    color: tokens.color.text,
    boxShadow: TOKENS.shadow.soft,
  };

  // User rechts: echte Bubble
  const userBubbleStyle: React.CSSProperties = {
    ...bubbleBase,
    maxWidth: "min(620px, 100%)",
    marginLeft: "auto",
    marginRight: 0,
    background: tokens.color.cyanGlass,
    borderColor: tokens.color.cyanBorder,
  };

  // Assistant links: komplett offen, nur Text – keine Bubble
  const assistantStyle: React.CSSProperties = {
    maxWidth: "min(900px, 100%)",
    lineHeight: 1.6,
    color: tokens.color.text,
    background: "transparent",
    border: "none",
    boxShadow: "none",
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
  };

  const bubbleStyle: React.CSSProperties = isUser
    ? userBubbleStyle
    : assistantStyle;



  const handleCopyAnswer = () => {
    const text = String(msg.content ?? "");
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div
      role="group"
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

           <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          width: isUser ? "100%" : "auto",
        }}
      >
        <div style={bubbleStyle}>
          <MessageBody msg={msg} />
        </div>


        {!isUser && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 4,
            }}
          >
            <button
              type="button"
              onClick={handleCopyAnswer}
              aria-label="Copy answer"
              style={{
                border: "none",
                borderRadius: 999,
                padding: "2px 10px",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "rgba(15,23,42,0.85)",
                color: tokens.color.textMuted ?? "rgba(226,232,240,0.8)",
                cursor: "pointer",
                opacity: 0.85,
              }}
            >
              ⧉ Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



/** Conversation-Ansicht.
 *  Hinweis: Der EINZIGE Scrollport ist der Eltern-Container (rechte Spalte).
 *  Diese <section> bekommt NUR Layout/Abstand – KEIN eigenes overflow.
 */
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
  /* === EINFÜGEN START: sichtbarer Fußraum + Anti-Collapse === */
  style={{ paddingBottom: padBottom, marginBottom: 0 }}
  /* === EINFÜGEN ENDE ======================================= */
>
  {messages.map((m, i) => (
    <Bubble key={i} msg={m} tokens={tokens} />
  ))}
    <div className="chat-end-spacer" style={{ height: padBottom }} aria-hidden />
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
const dockRef   = useRef<HTMLDivElement>(null);
const [dockH, setDockH] = useState(0);
// ▼▼▼ EINZEILER HINZUFÜGEN (bleibt) ▼▼▼
const endRef  = useRef<HTMLDivElement>(null);

// zentrale Messung + einheitlicher Fußraum
const [padBottom, setPadBottom] = useState(0);

const measureDock = useCallback(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const h = dockRef.current?.offsetHeight ?? 0;
      setDockH(h);
      setPadBottom(h);                           // einzige Fußraum-Quelle
      document.documentElement.style.setProperty("--dock-h", `${h}px`);
    });
  });
}, []);

useEffect(() => {
  measureDock();
  const ro = new ResizeObserver(measureDock);
  if (dockRef.current) ro.observe(dockRef.current);
  if (headerRef.current) ro.observe(headerRef.current);
  const onWinResize = () => measureDock();
  window.addEventListener("resize", onWinResize);

  // iOS Safari (Keyboard/URL-Bar): visualViewport-Sync
  const vv = (window as any).visualViewport as VisualViewport | undefined;
  const onVV = () => measureDock();
  vv?.addEventListener("resize", onVV);
  vv?.addEventListener("scroll", onVV);

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", onWinResize);
    vv?.removeEventListener("resize", onVV);
    vv?.removeEventListener("scroll", onVV);
  };
}, [measureDock]);


// ▼▼▼ NEU: Dock-Höhe als CSS-Variable für Styles/Footroom setzen ▼▼▼
useEffect(() => {
  document.documentElement.style.setProperty("--dock-h", `${dockH}px`);
}, [dockH]);
//// === EINFÜGEN START: Mobile-Keyboard -> Kompaktmodus ===================
const [compactStatus, setCompactStatus] = useState(false);

useEffect(() => {
  if (!('visualViewport' in window)) return;
  const vv = window.visualViewport!;
  const onChange = () => {
    const keyboardOpen = (window.innerHeight - vv.height) > 120; // heuristik
    setCompactStatus(keyboardOpen);
  };
  vv.addEventListener('resize', onChange);
  vv.addEventListener('scroll', onChange);
  onChange();
  return () => {
    vv.removeEventListener('resize', onChange);
    vv.removeEventListener('scroll', onChange);
  };
}, []);
//// === EINFÜGEN ENDE ======================================================
 
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
const [messages, setMessages] = React.useState<any[]>(() => {
  initChatStorage();
  const restored = loadChat();
  return restored ?? [];
});

// ⬇︎ Guard-Ref: blockiert Autosave während "Clear"
const clearingRef = React.useRef(false);

// ⬇︎ NEU: vorbereiteter Clear-Handler (ohne UI, noch nicht aufgerufen)
// Hard-Clear: UI sofort leeren, Autosave pausieren, Storage wipe + Reload
const onClearChat = React.useCallback(() => {
  console.log("[P4] onClearChat entered");
  clearingRef.current = true;
  try {
    setMessages([]);                  // UI sofort leer
    hardClearChat({ reload: true });  // Storage wipe (neu+legacy+export) + Reload
    console.log("[P4] hardClearChat called");
  } catch (e) {
    console.error("[P4] onClearChat error:", e);
  }
}, []);



// Autosave — pausiert, wenn gerade "Clear" läuft
useEffect(() => {
  console.log("[P6] autosave fired", {
    clearing: clearingRef.current,
    len: Array.isArray(messages) ? messages.length : "n/a",
  });
  if (clearingRef.current) return;
  if (Array.isArray(messages)) {
    saveChat(messages);
  }
}, [messages]);



// … weiterer Code …

const [input, setInput] = useState("");

// Prefill via URL (?prefill=...), rein clientseitig (kein Next-Hook → SSG-sicher)
useEffect(() => {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams(window.location.search);
  const raw = sp.get("prefill");
  if (!raw) return;

  let text = raw;
  try { text = decodeURIComponent(raw); } catch {}
  setInput(text);

  // Fokus non-blocking, falls es ein Textfeld mit dieser ID gibt
  requestAnimationFrame(() => {
    document.getElementById("chat-input")?.focus();
  });
}, []);

const [loading, setLoading] = useState(false);
const [stickToBottom, setStickToBottom] = useState(true);


// … weiterer Code …


const [mode, setMode] = useState<string>("DEFAULT");

// Preis-ID aus ENV für den Client (nur ID, kein Secret)
const PRICE_1M = process.env.NEXT_PUBLIC_STRIPE_PRICE_1M as string | undefined;

// (entfernt) — lokaler Persistenzblock wurde gestrichen
// Persistenz läuft zentral über lib/chatStorage.ts  → siehe persist.* oben
// … weiterer Code …


// Alias für bestehende Stellen im Code:
const persistMessages = saveMessages;

// ── M-Flow Overlay (1. Frame: eventLabel)
type MEvent = "builder" | "onboarding" | "expert" | "mode";
const [frameText, setFrameText] = useState<string | null>(null);

// Browser-Sprache -> "de" | "en" | "fr" | ...
const locale = getBrowserLang();
// ▼ Sync globaler i18n-Status mit Browser-Sprache (Client-only)
useEffect(() => {
  try {
    const root = document.documentElement;
    const prev = (root.getAttribute("lang") || "").toLowerCase();
    const next = (locale || "en").toLowerCase();
    if (next && prev !== next) {
      root.setAttribute("lang", next);
      window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: next } }));
    }
  } catch { /* silent */ }
}, [locale]);


// Labels (du hast LABELS am [ANCHOR:I18N], wir nutzen es hier nur)
const getLabel = (evt: MEvent) =>
  (LABELS[locale] && LABELS[locale][evt]) || LABELS.en[evt];

// --- helpers for labels ---
const cap = (s: string) =>
  String(s || "").replace(/\s+/g, " ").trim().replace(/^./, c => c.toUpperCase());

const slug = (s: string) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // accents off
    .replace(/[^a-z0-9]+/g, " ")                      // keep words
    .trim()
    .replace(/\s+/g, "-");                             // words -> slug

// --- localized labels for known modes ---
const MODE_LABELS: Record<string, Record<string, string>> = {
  en: { calm:"Calm", truth:"Truth", oracle:"Oracle", balance:"Balance", power:"Power", loop:"Loop", body:"Body", ocean:"Ocean", minimal:"Minimal" },
  de: { calm:"Ruhe", truth:"Wahrheit", oracle:"Orakel", balance:"Balance", power:"Kraft", loop:"Schleife", body:"Körper", ocean:"Ozean", minimal:"Minimal" },
  fr: { calm:"Calme", truth:"Vérité", oracle:"Oracle", balance:"Équilibre", power:"Puissance", loop:"Boucle", body:"Corps", ocean:"Océan", minimal:"Minimal" },
  es: { calm:"Calma", truth:"Verdad", oracle:"Oráculo", balance:"Equilibrio", power:"Poder", loop:"Bucle", body:"Cuerpo", ocean:"Océano", minimal:"Minimal" },
  it: { calm:"Calma", truth:"Verità", oracle:"Oracolo", balance:"Equilibrio", power:"Potenza", loop:"Loop", body:"Corpo", ocean:"Oceano", minimal:"Minimo" },
};

const tMode = (raw: string) => {
  const key = slug(raw);                        // "Calm", "CALM", etc. -> "calm"
  const table = MODE_LABELS[locale] || MODE_LABELS.en;
  return table[key] || cap(raw);                // fallback: raw pretty-cased
};


// UI-zentrale Routine: eventLabel → READY
const runMFlow = useCallback(async (evt: MEvent, labelOverride?: string) => {
  // Prefix nach Browsersprache
  const LOAD_PREFIX: Record<string, string> = { en: "Load", de: "Lade", fr: "Charger", es: "Cargar", it: "Carica" };
  const prefix = LOAD_PREFIX[locale] ?? LOAD_PREFIX.en;

  const baseLabel = (() => {
    // Fallbacks für reine Events
    if (!labelOverride) {
      if (evt === "builder")      return getLabel("builder");      // z. B. „Bauen“
      if (evt === "onboarding")   return getLabel("onboarding");
      if (evt === "mode")         return getLabel("mode");
      if (evt === "expert")       return getLabel("expert");
    }
    return labelOverride!.trim();
  })();

  // „Load …“ bzw. Sonderfall „set default“
  const frame = (evt === "mode" && /^default$/i.test(baseLabel))
    ? (locale === "de" ? "Setze Default" : "Set default")
    : `${prefix} ${baseLabel}`;

  // 1) Frame 1 (Text) + Denken starten
  setFrameText(frame);
  try { setLoading(true); } catch {}

  // 2) Frame sichtbar halten
  await new Promise(r => setTimeout(r, 900));

  // 3) Ausblenden Frame 1, M denkt noch
  setFrameText(null);
  await new Promise(r => setTimeout(r, 700));

  // 4) READY (LogoM übernimmt die Ready-Phase, wenn loading=false)
  try { setLoading(false); } catch {}
}, [locale, setLoading]);


/* -----------------------------------------------------------------------
   Sehr defensive Browser-Hooks (nur Client, mit Try/Catch & harten Guards)
   ----------------------------------------------------------------------- */

// Globale Click-Delegation: startet M-Flow inkl. konkretem Label (Mode/Expert)
useEffect(() => {
  function onGlobalClick(e: MouseEvent) {
    const el = (e.target as HTMLElement)?.closest?.("[data-m-event]") as HTMLElement | null;
    if (!el) return;

    const evt = el.getAttribute("data-m-event") as MEvent | null;
    if (!evt) return;

    // Label nur von genau diesem Element ableiten (kein Fallback/Text-Scan)
    const raw =
      el.getAttribute("data-m-label") ||
      el.getAttribute("aria-label") ||
      el.textContent ||
      "";
    const label = evt === "mode" ? tMode(raw) : (evt === "expert" ? cap(raw) : undefined);

    runMFlow(evt, label);
  }

  document.addEventListener("click", onGlobalClick);
  return () => document.removeEventListener("click", onGlobalClick);
}, [runMFlow, locale]);


  // Globale Click-Delegation: jedes Element mit data-m-event triggert runMFlow
  useEffect(() => {
    function onGlobalClick(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest?.("[data-m-event]") as HTMLElement | null;
      if (!el) return;
      const evt = el.getAttribute("data-m-event") as MEvent | null;
      if (!evt) return;
      runMFlow(evt);
    }
    document.addEventListener("click", onGlobalClick);
    return () => document.removeEventListener("click", onGlobalClick);
  }, [runMFlow]);

  // ▼ Auswahl-Delegation (Dropdowns/Listboxen/Comboboxen → Label an runMFlow)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const onChange = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;

      // Nur echte Auswahlen mit change-Event
      if (!el.matches("select,[role='listbox'],[role='combobox']")) return;

      const host = (el.closest("[data-m-event]") as HTMLElement) || (el as any);
      const evt = host.getAttribute("data-m-event") as MEvent | null;
      if (!evt) return;

      let label = "";
      if ((el as HTMLSelectElement).selectedOptions?.length) {
        label = (el as HTMLSelectElement).selectedOptions[0].textContent?.trim() || "";
      } else {
        label = host.getAttribute("data-m-label") || host.textContent?.trim() || "";
      }
      runMFlow(evt, label || undefined);
    };

    document.addEventListener("change", onChange);
    return () => document.removeEventListener("change", onChange);
  }, [runMFlow]);

  // Auto-Tagging: finde gängige Buttons/Links & vergebe data-m-event (einmalig)
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    // … (dein Auto-Tagging Code folgt hier)
  }, []);


// Auto-Tagging: finde gängige Buttons/Links & vergebe data-m-event (einmalig)
useEffect(() => {
  // SSR-Schutz
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const MAP: Record<string, MEvent> = {
    "jetzt bauen": "builder",
    "builder": "builder",
    "onboarding": "onboarding",
    "start onboarding": "onboarding",
    "expert": "expert",
    "experte": "expert",
    "mode": "mode",
    "modus": "mode",
  };

  const norm = (s: string) => (s || "").trim().toLowerCase();

  // Helper: für mode/expert sichtbaren Namen als data-m-label setzen
  const ensureLabel = (el: HTMLElement) => {
    const evtType = el.getAttribute("data-m-event");
    if ((evtType === "mode" || evtType === "expert") && !el.hasAttribute("data-m-label")) {
      const raw =
        (el.textContent ||
          el.getAttribute("aria-label") ||
          el.getAttribute("title") ||
          "")!.trim();
      if (raw) el.setAttribute("data-m-label", raw);
    }
  };

  // nach initialem Paint (vermeidet SSR/CSR-Mismatch)
  let id = 0;
  id = window.requestAnimationFrame(() => {
    try {
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>('button, a, [role="button"], [data-action]')
      );

      for (const el of candidates) {
        try {
          if (el.hasAttribute("data-m-event")) {
            ensureLabel(el);
            continue;
          }

          const txt = norm(
            el.textContent ||
              el.getAttribute("aria-label") ||
              el.getAttribute("title") ||
              ""
          );
          if (!txt) continue;

          // exakter Treffer
          if (MAP[txt]) {
            el.setAttribute("data-m-event", String(MAP[txt]));
            ensureLabel(el);
            continue;
          }

          // Teiltreffer (z. B. "jetzt bauen!")
          const hit = Object.keys(MAP).find((key) => txt.includes(key));
          if (hit) {
            el.setAttribute("data-m-event", String(MAP[hit as keyof typeof MAP]));
            ensureLabel(el);
          }
        } catch {
          // einzelnen Problem-Knoten ignorieren
        }
      }
    } catch {
      // niemals die App crashen lassen
    }
  });

  return () => {
    if (id) window.cancelAnimationFrame(id);
  };
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

  // ▼ immer ans Ende scrollen – Desktop sofort, Mobile mit kurzem Settle
const scrollToBottom = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (isMobile && endRef.current) {
        // iOS/Mobile: stabil gegen Keyboard/visualViewport-Jank
        endRef.current.scrollIntoView({ block: "end" });
      } else {
        const el = convoRef.current as HTMLDivElement | null;
        if (el) el.scrollTop = el.scrollHeight;
      }
      setStickToBottom(true);
    });
  });
};

// Mobile kurz „settlen“ lassen, Desktop sofort
if (isMobile) {
  setTimeout(scrollToBottom, 90); // 60–120ms sweet spot
} else {
  scrollToBottom();
}



  // ▼ Antwort ist da → Puls beenden (deine bestehende Logik)
  setLoading(false);
  setMode("DEFAULT");
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

    const wasAtEnd = stickToBottom;

    // 1) Footer-Status aktualisieren
    if (kind === "status") {
      const modeLabel = meta.modeLabel ?? detail.modeLabel;
      const expertLabel = meta.expertLabel ?? detail.expertLabel;
      setFooterStatus((s) => ({
        modeLabel: typeof modeLabel === "string" && modeLabel.length ? modeLabel : s.modeLabel,
        expertLabel: typeof expertLabel === "string" && expertLabel.length ? expertLabel : s.expertLabel,
      }));

      // Puls NUR starten, wenn explizit busy:true gesetzt ist
const busy = (meta?.busy ?? (detail as any)?.busy) === true;
if (busy) {
  try { setLoading(true); } catch {}
}


      if (wasAtEnd) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const el = convoRef.current as HTMLDivElement | null;
            if (el) el.scrollTop = el.scrollHeight;
            setStickToBottom(true);
          });
        });
      }
      return;
    }

    // 2) Initialer System-/Mode-Bubble: Puls EIN
   if (kind === "mode") {
  // Nur updaten, wenn eindeutig ein Moduswechsel signalisiert wird
  const hasModeId =
    typeof (meta?.modeId ?? (detail as any)?.modeId) === "string";

  if (hasModeId) {
    const modeLabel =
      (meta?.label ?? meta?.modeLabel ?? (detail as any)?.modeLabel) as
        | string
        | undefined;
    if (modeLabel && modeLabel.length) {
      setFooterStatus((s) => ({ ...s, modeLabel }));
    }
  }

  // Denken beginnt beim Moduswechsel
  try { setLoading(true); } catch {}
}


    // 3) Falls eine Antwort signalisiert wird (reply/info), Puls AUS — auch wenn kein Text kommt
    if (kind === "reply" || kind === "info") {
      try { setLoading(false); } catch {}
    }

    // 4) Ohne Text keine Bubble anhängen (aber der obige loading-Fix greift bereits)
    if (!text) return;

    // 5) Sichtbare Bubble anhängen
    setMessages((prev) => {
      const role: Role = kind === "mode" ? "system" : "assistant";
      const msg: ChatMessage = { role, content: text, format: "markdown" };
      const next = truncateMessages([...(Array.isArray(prev) ? prev : []), msg]);
      persistMessages(next);
      return next;
    });

    // 6) Bei jeder sichtbaren Nicht-"mode"-Antwort sicherheitshalber Puls AUS
    if (kind !== "mode") {
      try { setLoading(false); } catch {}
    }

    requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const el = convoRef.current as HTMLDivElement | null;
    if (el) el.scrollTop = el.scrollHeight;
    setStickToBottom(true);
  });
});

  };

  window.addEventListener("mpathy:system-message" as any, onSystem as any);
  return () => window.removeEventListener("mpathy:system-message" as any, onSystem as any);
}, [persistMessages, stickToBottom]);


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
    credentials: "same-origin",
    body: JSON.stringify({ messages: context }),
  });

  // === FreeGate 402 → Stripe Checkout ===
  if (res.status === 402) {
    let checkoutUrl = "";
    try {
      const payload = await res.json().catch(() => ({} as any));
      // Falls Server bereits eine fertige URL liefert, nimm die.
      checkoutUrl = payload?.checkout_url || "";
    } catch { /* ignore */ }

    // Wenn keine URL mitkam, erzeuge eine Session über unsere eigene Route.
    if (!checkoutUrl) {
      const priceId =
        process.env.NEXT_PUBLIC_STRIPE_PRICE_1M ||
        (globalThis as any).__NEXT_PUBLIC_STRIPE_PRICE_1M; // Fallback

      if (!priceId || !String(priceId).startsWith("price_")) {
        throw new Error("Checkout unavailable (missing NEXT_PUBLIC_STRIPE_PRICE_1M)");
      }

      const mk = await fetch("/api/buy/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (!mk.ok) {
        const j = await mk.json().catch(() => ({}));
        throw new Error(j?.error || "Stripe checkout session failed");
      }
      const j = await mk.json();
      checkoutUrl = j?.url || "";
    }

    if (!checkoutUrl) throw new Error("No checkout URL available");
    // Sofort zur Kasse
    window.location.href = checkoutUrl;
    // Wir geben hier eine neutrale “pending”-Nachricht zurück, falls der Redirect blockiert wurde.
    return { role: "assistant", content: "Opening checkout …", format: "markdown" } as ChatMessage;
  }

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

// Prompt-Modus: Launch (zentriert) vs. Flight (unten angedockt)
const hasMessages = (messages?.length ?? 0) > 0;

// Farben ausschließlich aus Tokens
const color = activeTokens.color;
const bg0 = color.bg0 ?? "#000000";
const bg1 = color.bg1 ?? "#0c0f12";
const textColor = color.text ?? "#E6F0F3";

// Seitenstil (radial + linear) – neutral, nur Grau/Schwarz
const pageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  color: textColor,
  background: [
    // sanfte Vignette oben
    "radial-gradient(110rem 70rem at 50% 0%, rgba(24, 27, 33, 0.85), transparent 60%)",
    // sanfte Vignette unten
    "radial-gradient(110rem 70rem at 50% 100%, rgba(8, 10, 14, 0.95), transparent 65%)",
    // Grundverlauf: nur bg1 → bg0 → tiefes Schwarz
    `linear-gradient(180deg, ${bg1}, ${bg0} 60%, #000000 100%)`,
  ].join(", "),
};


// Mobile Header State + Viewport Hook
const [mState, setMState] = useState<"idle" | "shrink" | "typing">("idle");
useMobileViewport(typeof document !== "undefined" ? document.body : null);
/* Scroll → Header shrink */
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

/* Focus im Prompt/Dock → Header typing */
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

/* CSS-Variable --header-h je State setzen */
useEffect(() => {
  if (!isMobile) return;
  const root = document.documentElement;
  const value =
    mState === "typing"
      ? "var(--header-h-typing)"
      : mState === "shrink"
      ? "var(--header-h-shrink)"
      : "var(--header-h-idle)";
  root.style.setProperty("--header-h", value);
}, [isMobile, mState]);

/* Dock-Höhe → --dock-h (für FAB-Offset & Spacer vorm Dock) */
useEffect(() => {
  const h = dockRef.current?.offsetHeight || 0;
  document.documentElement.style.setProperty("--dock-h", `${h}px`);
}, [dockH]);
/* Dedupe-Gate gegen doppelte Auslösung (Touch→Click, Key→Click etc.) */
const clickGateRef = useRef<number>(0);
const withGate = (fn: () => void) => {
  const now = Date.now();
  if (now - clickGateRef.current < 350) return; // innerhalb 350ms: ignorieren
  clickGateRef.current = now;
  fn();
};
/* ⬇︎ NEU: Laufzeit-Gate gegen Mehrfachsendungen */
const sendingRef = useRef(false);
return (
  <main style={{ ...pageStyle, display: "flex", flexDirection: "column" }}>
    
   {/* === HEADER ===================================================== */}
<header
  ref={headerRef}
  role="banner"
  style={{
    position: "fixed",
    top: 0,
    // Desktop: Header beginnt rechts neben der Säule
    left: isMobile ? 0 : "var(--saeule-w, 320px)",
    right: isMobile ? 0 : undefined,
    width: isMobile ? "100%" : "calc(100vw - var(--saeule-w, 320px))",
    zIndex: 100,
    // ▼ Höhe auf 60 % der bisherigen Werte
    height: isMobile ? "calc(var(--header-h) * 0.6)" : "calc(224px * 0.6)",
    background: [
      "linear-gradient(180deg, rgba(12, 14, 18, 0.98), rgba(4, 6, 10, 0.98))",
    ].join(", "),
    borderBottom: `1px solid ${
      activeTokens.color.glassBorder ?? "rgba(148, 163, 184, 0.35)"
    }`,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.75)",
  }}
>


    
    <div
    style={{
      width: "100%",
      maxWidth: "var(--stage-max, 900px)",
      margin: "0 auto",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      // Desktop: Logo-Bühne = gleiche Stage wie Chat/Prompt
      paddingLeft: isMobile ? "12px" : "var(--stage-pad, 48px)",
      paddingRight: isMobile ? "12px" : "var(--stage-pad, 48px)",
    }}
  >
    <MTheater>


  <LogoM size={160} active={loading} variant={M_CURRENT_VARIANT} />

  {frameText && (
    <div
      aria-live="polite"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
        fontWeight: 700,
        letterSpacing: "0.6px",
        fontSize: 18,
        color: "#60E6FF",
        textShadow: "0 0 12px rgba(96,230,255,.45)",
        opacity: 0.95,
        transition: "opacity 220ms ease",
      }}
    >
      {frameText}
    </div>
  )}
</MTheater>

      </div>
</header>

     {/* === BÜHNE ====================================================== */}
<div
  style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    // Full-left: Bühne hängt direkt an der Viewport-Wand
    marginInline: 0,
    minHeight: 0,
    maxWidth: "none",
    alignSelf: "stretch",
    width: "100%",
    // ⬇️ Mobile & Desktop beide auf 60 % des ursprünglichen Header-Werts
    paddingTop: isMobile ? "calc(var(--header-h) * 0.6)" : "calc(224px * 0.6)",
  }}
>

           {/* Bühne: Desktop 2 Spalten / Mobile 1 Spalte */}
      <section
        aria-label="Chat layout"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "minmax(0,1fr)"
            : "minmax(260px, 320px) minmax(0,1fr)",
          alignItems: "start",
          gap: 16,
          minHeight: 0,
          overflow: "visible",
          width: "100%",     // ⬅️ Bühne nutzt die komplette Breite
          marginLeft: 0,     // ⬅️ kein seitlicher Offset
          marginRight: 0,
        }}
      >


        {/* Säule links */}
        {!isMobile && (
          <div
            style={{
              position: "sticky",
              top: 16,
              alignSelf: "stretch",

              // Säule soll komplett von oben bis unten reichen
              height: "calc(100dvh - 16px)",

              // nach oben in den Logo-Bereich ziehen
              marginTop: "-calc(224px * 0.6)",
              paddingTop: "calc(224px * 0.6 + 16px)",

              // kleiner Fußraum unten
              paddingBottom: "16px",

              // Säule darf optisch voll „atmen“ (Glow, Schatten)
              overflow: "visible",

              // ⬅️ explizit an den linken Rand legen
              marginLeft: 0,
            }}
          >

    <SidebarContainer
      onSystemMessage={systemSay}
      onClearChat={onClearChat}
      /* canClear={canClear} */
    />
  </div>
)}




        <div
          ref={convoRef as any}
          className="chat-stage"
          style={{
            display: "flex",
            flexDirection: "column",


            /* Harte, verlässliche Block-Höhe relativ zum Viewport */
            flex: "0 1 auto",
            height: isMobile
              ? undefined
              : "calc(100dvh - (224px * 0.6) - var(--dock-h, 60px))",

            minHeight: 0,
            overflow: "auto",
            pointerEvents: "auto",
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",

            paddingBottom: `${padBottom}px`,
            scrollPaddingBottom: `${padBottom}px`,

            paddingInline: isMobile
              ? "max(12px, env(safe-area-inset-left)) max(12px, env(safe-area-inset-right))"
              : "12px",
          }}
        >

          {/* Chronik wächst im Scroller */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              paddingTop: isMobile ? "calc(var(--header-h) * 0.6 + 8px)" : 8,
              paddingLeft: isMobile ? 0 : undefined,
              paddingRight: isMobile ? 0 : undefined,
              scrollbarGutter: "stable",
            }}
            aria-label={t("conversationAria")}
          >

            <Conversation
              messages={messages}
              tokens={activeTokens}
              padBottom={`${padBottom}px`}
              scrollRef={convoRef as any}
            />

            {/* stabiler Endanker */}
            <div ref={endRef} style={{ height: 1 }} aria-hidden="true" />
          </div>

                    {/* === BOTTOM STACK: Prompt, dann Icons + Status ================= */}
          <div
            id="m-input-dock"
            ref={dockRef as any}
            className={`m-bottom-stack gold-dock ${
              hasMessages ? "gold-dock--flight" : "gold-dock--launch"
            }`}
            role="group"
            aria-label="Chat Eingabe & Status"
          >


            <div className="gold-prompt-wrap">
              <textarea
                id="gold-input"
                className="gold-textarea"
                aria-label={t("writeMessage")}
                placeholder={t("writeMessage")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => {
                  if (typeof requestAnimationFrame !== "undefined") {
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => {
                        const h = dockRef.current?.offsetHeight || 0;
                        document.documentElement.style.setProperty("--dock-h", `${h}px`);
                        setPadBottom(h);
                      })
                    );
                  }
                }}
                onInput={(e) => {
                  const ta = e.currentTarget;
                  ta.style.height = "auto";
                  const cap = Math.min(
                    ta.scrollHeight,
                    Math.round((window?.innerHeight || 0) * 0.30)
                  );
                  ta.style.height = `${Math.max(44, cap)}px`;
                  ta.classList.add("is-typing");

                  if (typeof requestAnimationFrame !== "undefined") {
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => {
                        const h = dockRef.current?.offsetHeight || 0;
                        document.documentElement.style.setProperty("--dock-h", `${h}px`);
                        setPadBottom(h);
                      })
                    );
                  }
                }}
                onBlur={(e) => {
                  const ta = e.currentTarget;
                  ta.classList.remove("is-typing");
                  ta.style.height = "44px";
                  const h = dockRef.current?.offsetHeight || 0;
                  document.documentElement.style.setProperty("--dock-h", `${h}px`);
                  setPadBottom(h);
                }}
                onKeyDown={(e) => {
                  const ev: any = e;
                  const isComposing = !!ev.isComposing || !!ev.nativeEvent?.isComposing;

                  if (
                    e.key !== "Enter" ||
                    e.shiftKey ||
                    e.repeat ||
                    isComposing ||
                    loading ||
                    !input.trim()
                  ) return;

                  e.preventDefault();

                  if (sendingRef.current) return;
                  sendingRef.current = true;

                  withGate(() => {
                    const dockEl = document.getElementById("m-input-dock");
                    dockEl?.classList.add("send-ripple");
                    void dockEl?.getBoundingClientRect();

                    onSendFromPrompt(input);
                    setInput("");

                    const ta = document.getElementById("gold-input") as HTMLTextAreaElement | null;
                    if (ta) {
                      ta.style.height = "44px";
                      ta.classList.remove("is-typing");
                    }

                    const h = dockRef.current?.offsetHeight || 0;
                    document.documentElement.style.setProperty("--dock-h", `${h}px`);
                    setPadBottom(h);
                  });

                  setTimeout(() => { sendingRef.current = false; }, 400);
                }}
                rows={1}
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
                  if (loading || !input.trim() || sendingRef.current) return;
                  sendingRef.current = true;

                  withGate(() => {
                    const dockEl = document.getElementById("m-input-dock");
                    dockEl?.classList.add("send-ripple");
                    void dockEl?.getBoundingClientRect();

                    onSendFromPrompt(input);
                    setInput("");

                    const ta = document.getElementById("gold-input") as HTMLTextAreaElement | null;
                    if (ta) {
                      ta.style.height = "44px";
                      ta.classList.remove("is-typing");
                    }

                    const h = dockRef.current?.offsetHeight || 0;
                    document.documentElement.style.setProperty("--dock-h", `${h}px`);
                    setPadBottom(h);
                  });

                  setTimeout(() => { sendingRef.current = false; }, 400);
                }}
              >
                {t("send")}
              </button>
            </div>

            <div
              className="gold-bar"
              data-compact={compactStatus ? 1 : 0}
            >
              <div className="gold-tools" aria-label={t('promptTools') ?? 'Prompt tools'}>
                <button type="button" aria-label={t('comingUpload')} className="gt-btn">📎</button>
                <button type="button" aria-label={t('comingVoice')} className="gt-btn">🎙️</button>
                <button type="button" aria-label={t('comingFunctions')} className="gt-btn">⚙️</button>
              </div>

              <div className="gold-stats">
                <div className="stat">
                  <span className="dot" />
                  <span className="label">Mode</span>
                  <strong>{footerStatus.modeLabel || "—"}</strong>
                </div>
                <div className="stat">
                  <span className="dot" />
                  <span className="label">Expert</span>
                  <strong>{footerStatus.expertLabel || "—"}</strong>
                </div>
              </div>
            </div>
          </div>
          {/* === /BOTTOM STACK ========================================= */}
        </div> {/* /Scroller */}
      </section>   {/* /Grid */}
    </div>     {/* /Bühne */}


    {/* Mobile Overlay / Onboarding */}
    {isMobile && (
      <>
        <StickyFab onClick={() => setOverlayOpen(true)} label="Menü öffnen" />
        <MobileOverlay
          open={overlayOpen}
          onClose={() => setOverlayOpen(false)}
          onSystemMessage={systemSay}
          onClearChat={onClearChat}       // ← NEU: Clear-Handler durchreichen

          />
      </>
    )}
    <OnboardingWatcher active={mode === "ONBOARDING"} onSystemMessage={systemSay} />


    {/* === Golden Prompt — Styles ==================================== */}
<style jsx global>{`
  html, body {
    background:#000;
    margin:0;
    padding:0;

    /* Desktop: Seite ist ein fester Viewport, kein Y-Scroll.
       Der einzige Scrollport bleibt die rechte Chat-Spalte. */
    height:100dvh;
    min-height:100dvh;
    overflow-x:hidden;
    overflow-y:hidden;
  }
  main {
    /* Main folgt dem gleichen Schema wie das Root */
    height:100dvh;
    min-height:100dvh;
  }


  :root { --dock-h: 60px; --fab-z: 90; --saeule-w: 320px; }
  .mi-plus-btn { display: none !important; }

  /* Dock niemals transformieren im Flight-Modus (Sticky + Transform = Bug) */
  #m-input-dock.gold-dock--flight { transform: none !important; }


  /* Dock Container — robust: immer fixed (Desktop & Mobile) */
  /* Desktop: Launch-Modus – Prompt als „Raumschiff“ mittig im Cockpit */
  @media (min-width: 769px){
    #m-input-dock.gold-dock--launch{
      top: 50%;
      bottom: auto;
      left: var(--saeule-w, 320px);
      right: 0;
      transform: translateY(-50%);
      display:flex;
      justify-content:center;
      padding-inline: 24px;
    }

    #m-input-dock.gold-dock--launch .gold-prompt-wrap,
    #m-input-dock.gold-dock--launch .gold-bar{
      width: min(
        720px,
        calc(100vw - var(--saeule-w, 320px) - 48px)
      );
      margin-inline: 0;
    }
  }

 /* Desktop: Flight-Modus – Dock zentriert in der rechten Bühne */
@media (min-width: 769px){
  #m-input-dock.gold-dock--flight{
    left: auto;
    right: auto;
    bottom: var(--safe-bottom, 0px);

    width: auto;
    max-width: calc(
      var(--stage-max, 900px) + var(--stage-pad, 48px) * 2
    );
    margin-left: auto;
    margin-right: auto;
  }
}


 #m-input-dock.m-bottom-stack{
  background: rgba(8,14,18,0.90);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255,255,255,0.10);
  box-shadow: 0 -4px 18px rgba(0,0,0,.40);
  padding: 10px 10px calc(10px + var(--safe-area-inset-bottom,0px));
  overscroll-behavior: contain;
  width: 100%;
  margin: 0;
  border-radius: 0;
}

/* 🔒 Desktop: Dock nicht mehr full-width, sondern auf Stage begrenzt */
@media (min-width: 769px){
  #m-input-dock.m-bottom-stack{
    width: auto;
    max-width: calc(
      var(--stage-max, 900px) + var(--stage-pad, 48px) * 2
    );
    margin-left: auto;
    margin-right: auto;
  }
}


  /* Kinder dürfen animieren */
  .gold-prompt-wrap,
  .gold-bar { will-change: transform; }

  /* Prompt Grid */
  .gold-prompt-wrap{
    display:grid; grid-template-columns: 1fr max-content;
    gap:10px; align-items:stretch;
    width:min(1100px, calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right) - 16px));
    margin:0 auto;
  }

  /* Desktop: Cockpit-Breite = Viewport minus Säule */
  @media (min-width: 769px){

      @media (min-width: 769px){

    /* 🎯 Gemeinsame Bühnenbegrenzung */
    :root {
      --stage-max: 820px;       /* etwas kleinere Bühne für Chat & Prompt */
      --stage-pad: 48px;        /* Luft rechts/links innerhalb der Bühne */
    }


     #m-input-dock.m-bottom-stack{
      /* Desktop: Hintergrund-Streifen ausblenden,
         damit nur der schmale Prompt sichtbar ist */
      background: transparent;
      border-top: none;
      box-shadow: none;
      padding-left: 0;
      padding-right: 0;
    }

    /* 🎯 Prompt & Gold-Bar: einheitliche, zentrierte Bühne */
    .gold-prompt-wrap,
    .gold-bar{
      width: min(
        var(--stage-max),
        calc(100vw - var(--saeule-w, 320px) - var(--stage-pad) * 2)
      );
      margin-left: auto;
      margin-right: auto;
      max-width: var(--stage-max);
    }

    /* 🎯 Chat-Bühne rechts: gleiche Stage wie Prompt */
    .chat-stage{
      width: min(
        var(--stage-max),
        calc(100vw - var(--saeule-w, 320px) - var(--stage-pad) * 2)
      );
      margin-left: auto;
      margin-right: auto;
      max-width: var(--stage-max);
    }

    /* 🎯 Grid-Ausfransen verhindern */
    .gold-prompt-wrap{
      grid-template-columns: 1fr max-content;
      max-width: var(--stage-max);
    }
  }


  .gold-textarea{
    width:100%; min-height:44px;
 max-height:var(--dock-cap,30vh);
    resize:none; border-radius:12px; padding:10px 12px; line-height:1.5;
    border:1px solid ${activeTokens.color.glassBorder ?? "rgba(255,255,255,0.12)"};
    background:rgba(255,255,255,0.04); color:${activeTokens.color.text};
    outline:none; background-clip: padding-box;
    transition: box-shadow 120ms cubic-bezier(.2,.6,.2,1), border-color 120ms cubic-bezier(.2,.6,.2,1);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial !important;
  }
  .gold-textarea:is(:hover,:focus,.is-typing){
    box-shadow: 0 0 0 1px ${activeTokens.color.cyanBorder ?? "rgba(34,211,238,0.28)"},
                0 0 18px rgba(34,211,238,0.18);
    border-color: ${activeTokens.color.cyanBorder ?? "rgba(34,211,238,0.28)"};
  }

  .gold-send{
    height:44px; min-width:96px; white-space:nowrap;
    padding:0 16px; border-radius:12px; font-weight:700;
    border:1px solid ${activeTokens.color.cyanBorder ?? "rgba(34,211,238,0.28)"};
    background:${activeTokens.color.cyanGlass ?? "rgba(34,211,238,0.12)"};
    color:${activeTokens.color.text}; cursor:pointer; background-clip: padding-box;
    transition: transform 120ms cubic-bezier(.2,.6,.2,1), box-shadow 120ms cubic-bezier(.2,.6,.2,1);
    display:inline-flex; align-items:center; justify-content:center;
  }
  .gold-send:hover:not(:disabled){ transform: translateY(-1px); }
  .gold-send:active:not(:disabled){ transform: translateY(0); }
  .gold-send:disabled{ opacity:.45; cursor:default; }

  /* Icons + Status unter Prompt */
  .gold-bar{
    width:min(1100px, calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right) - 16px));
    margin:3px auto 0 auto;
    display:flex; align-items:center; justify-content:flex-start; gap:12px;
  }
  .gold-tools{ display:flex; gap:8px; }
  .gt-btn{
    display:inline-flex; align-items:center; justify-content:center;
    height:36px; min-width:36px; padding:0 12px;
    border-radius:10px; border:1px solid rgba(49,65,86,.7);
    background:#0b1220; color:#e6f0f3; font-weight:700;
    transition:transform 120ms cubic-bezier(.2,.6,.2,1);
  }
  .gt-btn:active{ transform:scale(.98); }

  /* Statuschips: Mode / Expert */
  .gold-stats {
    display: flex;
    gap: 14px;
    align-items: center;
    margin-left: 12px;
    min-width:0;
  }
  .gold-stats .stat {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 10px; border-radius: 999px;
    background: rgba(255, 255, 255, .06);
    border: 1px solid rgba(255, 255, 255, .10);
    backdrop-filter: blur(6px);
    max-width:100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  }
  .gold-stats .dot { width: 8px; height: 8px; border-radius: 50%; background: #42f6ff; box-shadow: 0 0 8px currentColor; flex: 0 0 8px; }
  .gold-stats .label { opacity: .75; letter-spacing: .02em; }
  .gold-stats strong { font-weight: 600; }

  /* Fallback für sichtbares Chat-Ende – neutralisiert, da Fußraum via paddingBottom kommt */
  .chat-end-spacer{
    height: 0;
    pointer-events: none;
  }

  /* Mobile: Dock edge-to-edge + Safe-Area + Status rechts (übereinander) */
  @media (max-width: 768px){
    #m-input-dock.m-bottom-stack{
      left: max(0px, env(safe-area-inset-left));
      right: max(0px, env(safe-area-inset-right));
      bottom: max(0px, env(safe-area-inset-bottom));
      padding: 8px max(8px, env(safe-area-inset-left))
               calc(8px + env(safe-area-inset-bottom))
               max(8px, env(safe-area-inset-right));
      background: rgba(8,14,18,0.90) !important;
      border-top: 1px solid rgba(255,255,255,0.10) !important;
      box-shadow: 0 -2px 14px rgba(0,0,0,.55) !important;
      z-index: 90 !important;
    }
    .gold-prompt-wrap,
    .gold-bar{
      width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right) - 16px);
      margin-left: auto; margin-right: auto;
    }

    /* Tools links, Mode/Expert rechts übereinander */
    .gold-bar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      column-gap:10px;
      flex-wrap:nowrap;
    }
    .gold-tools{ flex:0 0 auto; }

    .gold-stats{
      flex:1 1 auto;
      display:flex;
      flex-direction:column;     /* übereinander */
      align-items:flex-end;      /* rechtsbündig */
      gap:6px;
      min-width:160px;
      max-width:60vw;
      min-height:0;
    }
    .gold-stats .stat{
      padding:3px 8px; gap:6px;
      max-width:100%;
    }
    .gold-stats .dot{ width:6px; height:6px; flex:0 0 6px; }
    .gold-stats .label{ font-size:12px; opacity:.8; letter-spacing:.01em; }
    .gold-stats strong{ font-size:12px; font-weight:600; letter-spacing:.01em; }

    /* Kompaktmodus bei offenem Keyboard / sehr wenig Höhe */
    .gold-bar[data-compact="1"]{ row-gap:6px; }
    @media (max-height: 560px){
      .gold-bar[data-compact="1"] .gold-stats{ display:none; }
      #m-input-dock.m-bottom-stack{
        padding: 6px max(8px, env(safe-area-inset-left))
                 calc(6px + env(safe-area-inset-bottom))
                 max(8px, env(safe-area-inset-right));
      }
      .gold-prompt-wrap{ grid-template-columns: 1fr max-content; gap:6px; }
    }
  }

  /* Ripple / Inertia */
  .gold-dock.send-ripple{
    animation: gp-inertia 320ms cubic-bezier(.2,.6,.2,1) 1, gp-ripple 680ms ease-out 1;
  }
  @keyframes gp-inertia{ 0%{transform:translateY(0)} 55%{transform:translateY(-3px)} 100%{transform:translateY(0)} }
  @keyframes gp-ripple{
    0%{ box-shadow: 0 -4px 18px rgba(0,0,0,.40), inset 0 0 0 0 rgba(34,211,238,0); }
    15%{ box-shadow: 0 -4px 18px rgba(0,0,0,.40), inset 0 0 0 1000px rgba(34,211,238,0.08); }
    100%{ box-shadow: 0 -4px 18px rgba(0,0,0,.40), inset 0 0 0 0 rgba(34,211,238,0); }
  }

  /* Entkopplung von Legacy input-bar.css */
  #m-input-dock .gold-prompt-wrap,
  #m-input-dock .gold-textarea,
  #m-input-dock .gold-send{
    position: static !important; float: none !important; inset: auto !important; box-sizing: border-box !important;
  }

  /* FAB über Dock */
  .sticky-fab, [data-sticky-fab], button[aria-label="Menü öffnen"]{
    bottom: calc(var(--dock-h, 60px) + 12px) !important;
    z-index: var(--fab-z) !important;
  }

  /* Desktop: Margin-Collapse-Guard am Listenende */
  @media (min-width: 769px){
    section[role="log"]{ border-bottom: 0.1px solid transparent; }
    section[role="log"] > *:last-child{ margin-bottom: 0 !important; }
  }

  /* ▼ Mobile-Override: Root & Main nicht starr machen */
  @media (max-width: 768px){
    html, body{
      height: auto;         /* Root darf mitschrumpfen */
      min-height: 100svh;   /* sichtbarer Viewport (iOS-freundlich) */
      overflow-y: auto;     /* kein globales Freeze */
    }
    main{
      height: auto;         /* Main nicht mehr 100dvh erzwingen */
      min-height: 100svh;   /* genug Höhe, aber elastisch */
      overflow: hidden;     /* Scroll bleibt delegiert an rechts */
    }
    /* iOS Auto-Zoom vermeiden */
    #gold-input, .gold-textarea{ font-size:16px; }
  }
`}</style>
</main>
);
}
