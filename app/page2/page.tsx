// ============================================================================
// 📘 INDEX — app/page2/page.tsx (Chat Interface / Payment / Triketon Bridge)
// ----------------------------------------------------------------------------
// PURPOSE
//   Core chat frontend for m-pathy.ai. Handles UI rendering, message flow,
//   persistence, payment gates (FreeGate / Stripe), and Triketon ledger linking.
//
// STRUCTURE OVERVIEW
//   • Imports — React, hooks, UI components, i18n, chatStorage, triketonVerify.
//   • UI Theme — Tokens, Themes, Personas for visual consistency.
//   • Hooks — useBreakpoint(), useAssistantLayout(), useTheme() for layout logic.
//   • Utilities — truncateMessages(), loadMessages(), saveMessages() for LS ops.
//   • Components:
//       Header(), MessageBody(), Bubble(), Conversation(), InputDock()
//       → Form the visual chat experience.
//   • Core React Component: Page2() — orchestrates all subsystems.
//
// CORE RESPONSIBILITIES
//   ▪ Manage chat lifecycle: init, load, save, append, clear (localStorage).
//   ▪ Integrate Triketon ledger: appendTriketonLedgerEntry() per message.
//   ▪ Handle FreeGate and payment flow (401/402/overdraw headers).
//   ▪ Animate assistant typing via chunked content rendering.
//   ▪ Maintain accessibility (ARIA roles, keyboard focus).
//
// STATE FLOW (Page2 component)
//   messages[]        → all user/assistant messages
//   input             → user’s message text
//   loading, mode     → UX state (thinking, idle, depleted)
//   padBottom, dockH  → dynamic layout spacing (Dock height)
//   overlayOpen       → Mobile Onboarding/Sidebar visibility
//   triketonOpen/payload → modal overlay showing cryptographic seal
//
// MAIN FUNCTIONS
//   ──────────────────────────────────────────────────────────────────────────
//   ▪ sendMessageLocal()
//       - POSTs messages to /api/chat
//       - interprets FreeGate & Stripe signals (401→login, 402→checkout)
//       - parses Triketon payload, appends to local ledger
//       - returns assistant ChatMessage with meta (balance/tokens)
//   ▪ onSendFromPrompt()
//       - User input handler; updates state, persists, appends to ledger
//       - Handles animated assistant response streaming (2-char chunks)
//   ▪ systemSay()
//       - Injects assistant/system bubbles (for onboarding, GC events)
//   ▪ verifyLocalTriketonLedger() / verifyOrResetTriketonLedger()
//       - Sanity checks for stored ledger integrity.
//   ▪ onClearChat()
//       - Hard-reset: clears UI + localStorage + triggers reload.
//
// COMPONENTS (UI)
//   ──────────────────────────────────────────────────────────────────────────
//   ▪ Header — sticky top bar with M-icon.
//   ▪ Bubble — user vs assistant message bubbles (dark UI, responsive).
//   ▪ MessageBody — Markdown renderer + syntax highlight + code copy buttons.
//   ▪ Conversation — scrollable chat log (ARIA role="log").
//   ▪ InputDock — send input field, fixed/flow modes, Enter key handling.
//
// BRIDGES
//   ▪ LanguageProvider → maintains global i18n sync.
//   ▪ Navigation + SidebarContainer → integrate with broader app shell.
//   ▪ OnboardingWatcher / MobileOverlay → support onboarding on mobile.
//   ▪ Triketon Overlay → shows seal details (public_key, truth_hash, timestamp).
//
// DATA PERSISTENCE
//   ▪ loadChat(), saveChat(), hardClearChat() via lib/chatStorage.ts
//   ▪ appendTriketonLedgerEntry() adds deterministic ledger entries.
//   ▪ LocalStorage keys:
//       "mpathy:chat:v1", "mpathy:triketon:v1", "mpathy:freegate", "mpathy:thread:default"
//
// FREEGATE / PAYMENT LOGIC
//   ▪ 401 Unauthorized → system prompt: “Please log in to continue.”
//   ▪ 402 Payment Required → redirect to Stripe checkout session.
//   ▪ X-Free-Remaining / X-Free-Limit headers → local counter & last-free warning.
//   ▪ X-Tokens-Overdraw → in-chat “Top-up required” message.
//
// TRIKETON LOGIC
//   ▪ Assistant replies include Triketon payload {truth_hash, public_key, timestamp}.
//   ▪ Each message triggers appendTriketonLedgerEntry() (role-aware).
//   ▪ Ledger entries include device-bound key via getOrCreateDevicePublicKey2048().
//
// ACCESSIBILITY / A11Y
//   ▪ Conversation role="log", aria-live="polite".
//   ▪ InputDock labeled via i18n key t("writeMessage").
//   ▪ Buttons: Copy, Triketon overlay, Close, all have ARIA labels.
//
// VERSIONING / GOVERNANCE
//   ▪ governed by Council13 — Triketon Archive Contract v2
//   ▪ compliant with MEFL + PrimeFocus guidelines (no drift, single truth path)
//   ▪ page2/page.tsx acts as Chat-Layer controller atop chatStorage & Triketon.
//
// ============================================================================

"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo, FormEvent } from "react";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import Image from "next/image";
import hljs from "highlight.js";

import Navigation from "@/app/components/navigation/navigation";
// import MessageInput from "../components/MessageInput";
// import Saeule from "../components/Saeule";
import SidebarContainer from "../components/SidebarContainer";
import MobileOverlay from "../components/MobileOverlay";
import { PromptRoot } from "./PromptRoot";
import { getLocale, setLocale, t } from "@/lib/i18n";
import OnboardingWatcher from "@/components/onboarding/OnboardingWatcher";
import { useMobileViewport } from "@/lib/useMobileViewport";
import { v4 as uuidv4 } from "uuid";
// ⬇︎ Einheitlicher Persistenzpfad: localStorage-basiert
import { loadChat, saveChat, initChatStorage, hardClearChat, appendTriketonLedgerEntry, ensureTriketonLedgerReady, verifyOrResetTriketonLedger, } from '@/lib/chatStorage'
import { computeTruthHash, normalizeForTruthHash } from "@/lib/triketonVerify";




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
        // Desktop: Chat-/Assistant-Spalte = 640px
        desktop: { width: 640, bottom: 300, side: 24 },
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

  // Assistant-Layout: 640px Spalte + 13px Padding bei schmalen Viewports
  const ASSISTANT_MAX_WIDTH = 640;
  const ASSISTANT_SIDE_PADDING = 13;
  const ASSISTANT_NARROW_THRESHOLD =
    ASSISTANT_MAX_WIDTH + ASSISTANT_SIDE_PADDING * 2;

  function useAssistantLayout() {
    const [vw, setVw] = React.useState<number | null>(null);

    React.useEffect(() => {
      if (typeof window === "undefined") return;
      const update = () => setVw(window.innerWidth);
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, []);

    const width = vw ?? ASSISTANT_NARROW_THRESHOLD;
    const isNarrow = width < ASSISTANT_NARROW_THRESHOLD;

    return { isNarrow };
  }
  
/* =======================================================================
   [ANCHOR:HOOKS]  — Breakpoint + Theme Resolution
   ======================================================================= */

function useBreakpoint() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cssVarName = "--bp-mobile";
    let effectiveThreshold = 768;

    try {
      const root = document.documentElement;
      const raw = getComputedStyle(root)
        .getPropertyValue(cssVarName)
        .trim();
      const parsed = parseFloat(raw.replace("px", ""));
      if (!Number.isNaN(parsed) && parsed > 0) {
        effectiveThreshold = parsed;
      }
    } catch {
      // fallback: keep default threshold
    }

    // Tablet-Sync: alle Tablet-Breiten wie Mobile behandeln
    const TABLET_BREAKPOINT = 1024;
    if (effectiveThreshold < TABLET_BREAKPOINT) {
      effectiveThreshold = TABLET_BREAKPOINT;
    }

    const fn = () => setIsMobile(window.innerWidth <= effectiveThreshold);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

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
  meta?: {
    status?: string;
    balanceAfter?: number | null;
    tokensUsed?: number | null;
  };
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

  const onRootClick = React.useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest?.('[data-copy-code="true"]') as HTMLElement | null;
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const block =
        (btn.closest?.(".md-code-block") as HTMLElement | null) ??
        (btn.closest?.(".md-code") as HTMLElement | null);

      const codeEl = block?.querySelector?.("pre code") as HTMLElement | null;
      const text = (codeEl?.textContent ?? "").trimEnd();
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        btn.setAttribute("data-copied", "true");
        window.setTimeout(() => {
          try {
            btn.removeAttribute("data-copied");
          } catch {}
        }, 900);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.style.top = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          document.execCommand("copy");
        } catch {}
        document.body.removeChild(ta);

        btn.setAttribute("data-copied", "true");
        window.setTimeout(() => {
          try {
            btn.removeAttribute("data-copied");
          } catch {}
        }, 900);
      }
    },
    []
  );

  React.useEffect(() => {
    if (!containerRef.current) return;
    try {
      const nodes = containerRef.current.querySelectorAll("pre code");
     nodes.forEach((el) => {
        const codeEl = el as HTMLElement;
        if (codeEl.dataset.hljs) return;

        const cls = codeEl.className || "";
        const m = cls.match(/\blanguage-([a-z0-9_-]+)\b/i);
        const lang = m ? m[1].toLowerCase() : "";
        const raw = codeEl.textContent ?? "";

        try {
          if (lang && hljs.getLanguage(lang)) {
            codeEl.innerHTML = hljs.highlight(raw, { language: lang, ignoreIllegals: true }).value;
          } else {
            codeEl.innerHTML = hljs.highlightAuto(raw).value;
          }
          codeEl.classList.add("hljs");
        } catch {
          try { hljs.highlightElement(codeEl); } catch {}
        }

        codeEl.dataset.hljs = "1";
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
        onClick={onRootClick}
      />
    );
  }

  return (
    <div ref={containerRef} style={{ lineHeight: 1.55 }} onClick={onRootClick}>
      {String(msg.content ?? "")}
    </div>
  );
}


/** Sprechblase mit M-Avatar für Assistant + Copy-Button */
function Bubble({
  msg,
  tokens,
  onOpenTriketon,
}: {
  msg: ChatMessage;
  tokens: Tokens;
  onOpenTriketon?: (payload: any) => void;
}) {

    const isUser = msg.role === "user";
  const { isNarrow } = useAssistantLayout();
  const isNarrowAssistant = !isUser && isNarrow;

  // Basis-Bubble nur für den User
  const bubbleBase: React.CSSProperties = {
    maxWidth: "min(900px, 100%)",
    borderRadius: TOKENS.radius.lg,
    padding: "18px 22px",
    lineHeight: 1.6,
    backdropFilter: "blur(10px)",
    // keine sichtbare Border – Bubble über Hintergrund + Shadow
    border: "none",
    color: tokens.color.text,
    boxShadow: TOKENS.shadow.soft,
  };

  // User rechts: echte Bubble – Säulen-Farbe, Breite kommt vom Inline-Block-Container
  const userBubbleStyle: React.CSSProperties = {
    ...bubbleBase,
    // Bubble füllt den Container, der gleich noch auf 60vw/382px begrenzt wird
    maxWidth: "100%",
    // gleiche Farbe wie die Säule (Smooth Operator)
    background: "#1E2024",
    border: "none",
    // leicht „abgeschnittene“ Ecke oben rechts
    borderTopRightRadius: TOKENS.radius.md,
    boxShadow: tokens.color.text ? TOKENS.shadow.soft : TOKENS.shadow.soft,
  };





  // Assistant links: offene Spalte, viewport-gesteuert
  const assistantStyle: React.CSSProperties = {
    maxWidth: isNarrowAssistant
      ? "100%"
      : `min(${ASSISTANT_MAX_WIDTH}px, 100%)`,
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

  const [triketonHover, setTriketonHover] = useState(false);

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
        flexDirection: isNarrowAssistant ? "column" : "row",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: isNarrowAssistant ? "stretch" : "flex-start",
        gap: isNarrowAssistant ? 8 : 10,
        margin: "6px 0",
        // bei schmalen Viewports rechts/links begrenzen (13px)
        paddingInline: isNarrowAssistant ? ASSISTANT_SIDE_PADDING : 0,
      }}
    >
      {!isUser && (
        <Image
          src="/pictures/m.svg"
          alt="M"
          width={22}
          height={22}
          style={{
            marginTop: isNarrowAssistant ? 0 : 6,
            marginBottom: isNarrowAssistant ? 8 : 0,
            flex: "0 0 22px",
            alignSelf: isNarrowAssistant ? "flex-start" : "auto",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          width: "auto",
        }}
      >
        {isUser ? (
          // Inline-Block-Container: begrenzt die User-Bubble auf 60vw / 382px
          <div
            style={{
              display: "inline-block",
              maxWidth: "min(60vw, 382px)",
              marginRight: 10,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <div style={bubbleStyle}>
              <MessageBody msg={msg} />
            </div>
          </div>
        ) : (
          <div style={bubbleStyle}>
            <MessageBody msg={msg} />
          </div>
        )}

{!isUser && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 4,
              gap: 8,
            }}
          >
            {(() => {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        handleCopyAnswer();
        setCopied(true);
        window.setTimeout(() => setCopied(false), 5000);
      }}
      aria-label="Copy answer"
      style={{
        border: "none",
        borderRadius: 999,
        padding: "2px 10px",
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: copied
          ? "rgba(34,211,238,0.18)"
          : "rgba(15,23,42,0.85)",
        color: copied
          ? tokens.color.cyan ?? "#22d3ee"
          : tokens.color.textMuted ?? "rgba(226,232,240,0.8)",
        cursor: "pointer",
        opacity: 0.9,
        transition: "background 160ms ease, color 160ms ease, opacity 160ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = copied ? "0.9" : "0.85";
      }}
    >
      ⧉ {copied ? "Copied" : "Copy"}
    </button>
  );
})()}


              <button
                type="button"
                onClick={() => {
                  const payload = {
                    id: (msg as any)?.id ?? "",
                    role: (msg as any)?.role ?? "assistant",
                    meta: (msg as any)?.meta ?? null,
                    triketon: (msg as any)?.triketon ?? null,
                  };
                  onOpenTriketon?.(payload);
                }}
                onMouseEnter={() => setTriketonHover(true)}
                onMouseLeave={() => setTriketonHover(false)}
                aria-label="Triketon2048"
                style={{
                  border: `1px solid ${
                    triketonHover
                      ? tokens.color.cyanBorder ?? "rgba(34,211,238,0.28)"
                      : tokens.color.glassBorder ?? "rgba(255,255,255,0.12)"
                  }`,
                  borderRadius: 999,
                  padding: "2px 10px",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: triketonHover
                    ? tokens.color.cyanGlass ?? "rgba(34,211,238,0.12)"
                    : "rgba(15,23,42,0.65)",
                  color: tokens.color.textMuted ?? "rgba(226,232,240,0.8)",
                  cursor: "pointer",
                  opacity: 0.92,
                  pointerEvents: "auto",
                  transition: "background 180ms ease, border-color 180ms ease, opacity 180ms ease",
                }}
                title="Triketon2048"
              >
                Triketon2048
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
  onOpenTriketon,
}: {
  messages: ChatMessage[];
  tokens: Tokens;
  padBottom?: string;
  scrollRef?: React.Ref<HTMLDivElement>;
  onOpenTriketon?: (payload: any) => void;
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
    <Bubble key={i} msg={m} tokens={tokens} onOpenTriketon={onOpenTriketon} />
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
      aria-label={t("writeMessage")}
      data-testid="m-input-form"
    >
      <input
        aria-label={t("writeMessage")}
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
        placeholder={t("writeMessage")}
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
        {t("send")}
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


// Breakpoints
// NOTE: Säulenraster & Overlay arbeiten ab 960px aufwärts mit Desktop-Layout.
// Damit JS-Layout & CSS deckungsgleich bleiben, nutzen wir überall das Token
const { isMobile } = useBreakpoint();
// Single source of truth: alle Breiten ≤ --bp-mobile (min. 1024px) gelten als "mobile-like"
// Wird für Säulen-Overlay, SIMBA+ und Mobile/Tablet-only UI verwendet.
const isMobileLike = isMobile;
const sideMargin = isMobileLike ? theme.dock.mobile.side : theme.dock.desktop.side;
// Refs & Höhenmessung
const headerRef = useRef<HTMLDivElement>(null);

const convoRef = useRef<HTMLDivElement>(null);
const dockRef   = useRef<HTMLDivElement>(null);
const [dockH, setDockH] = useState(0);
// ▼▼▼ EINZEILER HINZUFÜGEN (bleibt) ▼▼▼
const endRef  = useRef<HTMLDivElement>(null);
// zentrale Messung + einheitlicher Fußraum
const [padBottom, setPadBottom] = useState(
  isMobile ? 120 : 80
); // Festen, ungefähren Wert als Fallback/Spacer setzen
const measureDock = useCallback(() => {
  const h = dockRef.current?.offsetHeight ?? 0;
  if (h > 0) document.documentElement.style.setProperty("--dock-h", `${h}px`);
  setDockH(h);
}, []);
useEffect(() => {
  measureDock();
  const ro = new ResizeObserver(measureDock);
  if (dockRef.current) ro.observe(dockRef.current);
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

// 🪶 L11 – Ledger AutoInit & Verify
try {
  if (typeof window !== "undefined") {
    ensureTriketonLedgerReady();        // Ledger Genesis, falls leer
    verifyOrResetTriketonLedger();      // Drift-Check nach Mount
  }
} catch (err) {
  console.warn("[L11] Ledger auto-verify failed:", err);
}

  const restored = loadChat();
  return restored ?? [];
});

// ⬇︎ Guard-Ref: blockiert Autosave während "Clear"
const clearingRef = React.useRef(false);

// ⬇︎ NEU: vorbereiteter Clear-Handler (ohne UI, noch nicht aufgerufen)
// Hard-Clear: UI sofort leeren, Autosave pausieren, Storage wipe + Reload
const onClearChat = React.useCallback(() => {
  clearingRef.current = true;
  try {
    setMessages([]);                  // UI sofort leer
    hardClearChat({ reload: true });  // Storage wipe (neu+legacy+export) + Reload
  } catch (e) {
    console.error("[P4] onClearChat error:", e);
  }
}, []);



// Autosave — pausiert, wenn gerade "Clear" läuft"
useEffect(() => {
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

// GC Step 12 – Combined paid=1 handler (Balance + Success + URL cleanup + Autofocus)
useEffect(() => {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const paid = url.searchParams.get("paid");
  if (paid !== "1") return;

  let cancelled = false;

  const timer = window.setTimeout(async () => {
    if (cancelled) return;

    // 1) Balance abrufen
    try {
      const res = await fetch("/api/me/balance", { method: "GET" });
      await res.json().catch(() => null);
    } catch {
      // Silent – kein Crash, wenn Balance-Fetch fehlschlägt
    }

    if (cancelled) return;

    // 2) Erfolgstoast anzeigen
    try {
      systemSay(
        `**${t("gc_payment_success_title")}**\n\n${t("gc_payment_success_body")}`,
      );


    } catch {
      // Toast ist nice-to-have, darf nie den Flow brechen
    }

    // 3) URL bereinigen, damit paid=1 nicht hängen bleibt
    try {
      url.searchParams.delete("paid");
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {
      // History-Manipulation ist optional
    }

    // 4) Fokus zurück ins Eingabefeld
    const el = document.getElementById("chat-input");
    if (el) el.focus();
  }, 1200); // 1–2 Sekunden Verzögerung nach Return

  return () => {
    cancelled = true;
    window.clearTimeout(timer);
  };
}, []);

const [loading, setLoading] = useState(false);

const [stickToBottom, setStickToBottom] = useState(true);

const [balance, setBalance] = useState<number | null>(null);

// … weiterer Code …



const [mode, setMode] = useState<string>("DEFAULT");

const [triketonOpen, setTriketonOpen] = useState(false);
const [triketonPayload, setTriketonPayload] = useState<any>(null);
const [triketonPinned, setTriketonPinned] = useState(false);
const triketonCloseTimerRef = useRef<number | null>(null);

const openTriketon = useCallback((payload: any) => {
  if (triketonCloseTimerRef.current != null) {
    window.clearTimeout(triketonCloseTimerRef.current);
    triketonCloseTimerRef.current = null;
  }
  setTriketonPayload(payload ?? null);
  setTriketonOpen(true);
}, []);

const closeTriketon = useCallback(() => {
  if (triketonCloseTimerRef.current != null) {
    window.clearTimeout(triketonCloseTimerRef.current);
    triketonCloseTimerRef.current = null;
  }
  setTriketonOpen(false);
  setTriketonPayload(null);
  setTriketonPinned(false);
}, []);

const scheduleCloseTriketon = useCallback(() => {
  if (triketonPinned) return;
  if (triketonCloseTimerRef.current != null) {
    window.clearTimeout(triketonCloseTimerRef.current);
  }
  triketonCloseTimerRef.current = window.setTimeout(() => {
    setTriketonOpen(false);
    setTriketonPayload(null);
  }, 120);
}, [triketonPinned]);


useEffect(() => {
  return () => {};
}, []);


// Preis-ID aus ENV für den Client (nur ID, kein Secret)
const PRICE_1M = process.env.NEXT_PUBLIC_STRIPE_PRICE_1M as string | undefined;


// (entfernt) — lokaler Persistenzblock wurde gestrichen
// Persistenz läuft zentral über lib/chatStorage.ts  → siehe persist.* oben
// … weiterer Code …


// Alias für bestehende Stellen im Code:
const persistMessages = (arr: any[]) => {
  if (!Array.isArray(arr)) return;
  const normalized = arr.map((m) => ({
    id:
      typeof m.id === "string" && m.id.length
        ? m.id
        : (typeof crypto !== "undefined" && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID()
          : uuidv4(),
    ...m,
  }));
  saveChat(normalized);
};
// ── M-Flow Overlay (1. Frame: eventLabel)
type MEvent = "builder" | "onboarding" | "expert" | "mode";
const [frameText, setFrameText] = useState<string | null>(null);

// "de" | "en" | "fr" | ... – folgt dem zentralen Sprachkern
const [locale, setLocaleState] = useState<string>(() => getLocale());

// Reagiere auf mpathy:i18n:change (wird von setLocale() in lib/i18n getriggert)
useEffect(() => {
  if (typeof window === "undefined") return;

  const handleChange = (ev: Event) => {
    try {
      const detail = (ev as CustomEvent<{ locale?: string }>).detail;
      const next = (detail?.locale || getLocale() || "en").toLowerCase();
      if (next && next !== locale) {
        setLocaleState(next);
      }
    } catch {
      // silent – kein Crash im Fehlerfall
    }
  };

  // Initial-Sync (falls Locale schon gesetzt wurde, bevor die Seite gemountet ist)
  setLocaleState(getLocale() || "en");

  window.addEventListener("mpathy:i18n:change", handleChange);
  return () => window.removeEventListener("mpathy:i18n:change", handleChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

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

// Minimal-Provider-Dict nur für Navigation/LanguageSwitcher auf der Chat-Seite.
// Wir brauchen hier KEINE echten Texte, weil page2 keine useLang().t()-Lookups macht.
// Wichtig ist nur, dass der Provider existiert und die Sprache aus dem Kern spiegelt.
const NAV_PROVIDER_DICT: Record<string, Record<string, string>> = {
  en: {},
  de: {},
  fr: {},
  es: {},
  it: {},
  pt: {},
  nl: {},
  ru: {},
  zh: {},
  ja: {},
  ko: {},
  ar: {},
  hi: {},
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

// GC: Marker für temporäre System-Toasts (Golden Conversion)
const GC_MARKER = "[[gc-toast]]";

// ===============================================================
// Systemmeldung (für Säule / Overlay / Onboarding)
// ===============================================================
const systemSay = useCallback((content: string, opts?: { gc?: boolean }) => {
  if (!content) return;

  const isGc = !!opts?.gc;
  const tagged = isGc ? `${GC_MARKER}${content}` : content;

  setMessages((prev) => {
    const base = Array.isArray(prev) ? prev : [];
    const next = truncateMessages([
      ...base,
      { role: "assistant", content: tagged, format: "markdown" },
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

  // (Auto-Remove für GC-Nachrichten vollständig deaktiviert – Nachrichten bleiben persistent)

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
      body: JSON.stringify({ messages: context, locale: getLocale() }),
    });

    // === GC Step 5 – FreeGate/Balance Gates → Login oder Stripe Checkout ===
    if (res.status === 401) {
      try {
        const payload = await res.json().catch(() => ({} as any));
        if (payload?.needs_login) {
          systemSay(
            `**${t("gc_freegate_limit_reached")}**\n\n${t("gc_freegate_login_required")}`,
          );
              return {
        role: "assistant",
        content: t("gc_please_login_to_continue"),
        format: "markdown",
      } as ChatMessage;

        }
      } catch {
        // Parsing/Login-Toast-Fehler niemals den Flow crashen lassen
      }
      throw new Error("Auth required");
    }

    if (res.status === 402) {
      let checkoutUrl = "";
      try {
        const payload = await res.json().catch(() => ({} as any));
        checkoutUrl = payload?.checkout_url || "";
      } catch {}

      if (!checkoutUrl) {
        const mk = await fetch("/api/buy/checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!mk.ok) {
          const j = await mk.json().catch(() => ({}));
          throw new Error(j?.error || "Stripe checkout session failed");
        }
        const j = await mk.json();
        checkoutUrl = j?.url || "";
      }

      if (!checkoutUrl) throw new Error("No checkout URL available");
      window.location.href = checkoutUrl;
      return {
        role: "assistant",
        content: "Opening checkout …",
        format: "markdown",
      } as ChatMessage;
    }



  // === GC: Letzte freie Nachricht → Systemmeldung ======================

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const freeUsedHeader = res.headers.get("X-Free-Used");
      const freeLimitHeader = res.headers.get("X-Free-Limit");
      const freeRemainingHeader2 = res.headers.get("X-Free-Remaining");
      const overdrawHeader = res.headers.get("X-Tokens-Overdraw");

      const payload: any = {};

      if (freeUsedHeader != null) {
        const v = parseInt(freeUsedHeader, 10);
        if (!Number.isNaN(v)) payload.used = v;
      }
      if (freeLimitHeader != null) {
        const v = parseInt(freeLimitHeader, 10);
        if (!Number.isNaN(v)) payload.limit = v;
      }
      if (freeRemainingHeader2 != null) {
        const v = parseInt(freeRemainingHeader2, 10);
        if (!Number.isNaN(v)) payload.remaining = v;
      }
      if (overdrawHeader != null) {
        const v = parseInt(overdrawHeader, 10);
        if (!Number.isNaN(v)) {
          payload.overdraw = v;
          if (v > 0) {
            payload.mustTopUp = true;
          }
        }
      }

      const prevRaw = window.localStorage.getItem("mpathy:freegate");
      let prev: any = {};
      if (prevRaw) {
        try {
          prev = JSON.parse(prevRaw) || {};
        } catch {
          prev = {};
        }
      }

      const next: any = { ...prev, ...payload };

      const prevRemaining =
        typeof prev.remaining === "number" ? prev.remaining : null;
      const nextRemaining =
        typeof next.remaining === "number" ? next.remaining : null;

      const shouldWarnLastFree =
        prevRemaining !== 1 &&
        nextRemaining === 1 &&
        !next.lastFreeWarningShown;

      if (shouldWarnLastFree) {
        try {
          systemSay(t("gc_warning_last_free_message"));
        } catch {}
        next.lastFreeWarningShown = true;
      }

      window.localStorage.setItem("mpathy:freegate", JSON.stringify(next));

    }
  } catch {}

  const overdrawHeader = res.headers.get("X-Tokens-Overdraw");
  if (overdrawHeader != null) {
    const v = parseInt(overdrawHeader, 10);
    if (!Number.isNaN(v) && v > 0) {
      try {
        systemSay(
          `**${t("gc_overdraw_title")}**\n\n${t("gc_overdraw_body")}`,
        );
      } catch {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[GC] Failed to show overdraw notice");
        }
      }
    }
  }

  if (!res.ok) throw new Error("Chat API failed");

  const data = await res.json();

  // FreeGate-Limit: Login erforderlich
  const loginText =
    t("gc_please_login_to_continue") || "Please log in to continue.";

  if (data && data.status === "free_limit_reached") {
    return {
      role: "assistant",
      content: loginText,
      format: "markdown",
    } as ChatMessage;
  }

  const assistant = data.assistant ?? data;
  const content = assistant.content ?? "";

  // Falls der Server KEINEN Text liefert → Login-Text erzwingen
  const safeContent =
  content.trim().length > 0 ? content : loginText

const status =
  data && typeof data.status === 'string' ? data.status : 'ok'

const balanceAfter =
  data && typeof data.balance_after === 'number' ? data.balance_after : null

const tokensUsed =
  data && typeof data.tokens_used === 'number' ? data.tokens_used : null

const rawTriketon = (data as any)?.triketon

const triketon =
  rawTriketon && typeof rawTriketon === 'object'
    ? {
        sealed: true,
        public_key:
          (rawTriketon as any).public_key ??
          (rawTriketon as any).publicKey ??
          '',
        truth_hash:
          (rawTriketon as any).truth_hash ??
          (rawTriketon as any).truthHash ??
          '',
        timestamp:
          (rawTriketon as any).timestamp ??
          (rawTriketon as any).sealed_at ??
          '',
        version: 'v1',
        hash_profile: 'TRIKETON_HASH_V1',
        key_profile: 'TRIKETON_KEY_V1',
        orbit_context: 'chat',
      }
    : undefined

const id =
  typeof crypto !== 'undefined' &&
  typeof (crypto as any).randomUUID === 'function'
    ? (crypto as any).randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`

try {
  if (triketon?.public_key && triketon?.truth_hash && triketon?.timestamp) {
    appendTriketonLedgerEntry({
      id,
      role: "assistant",
      content: safeContent,
      truth_hash: triketon.truth_hash,
      public_key: triketon.public_key,
      timestamp: triketon.timestamp,
      version: "v1", // literal fix
      orbit_context: "chat", // literal fix
      chain_id: "local",
    })
  }
} catch (err) {
  console.warn("[TriketonLedger] Append failed:", err)
}

  return {
    id,
    role: assistant.role ?? "assistant",
    content: safeContent,
    format: assistant.format ?? "markdown",
    meta: { status, balanceAfter, tokensUsed },
    triketon,
  } as any as ChatMessage
}

// ⬆️ Diese schließende Klammer beendet die Message-Builder-Funktion sauber.
// Danach folgt dein React-Code mit useEffect() und return (<LanguageProvider> …)







  // ===============================================================
  // Prompt-Handler – sendet Text aus Eingabefeld 
  // ===============================================================
  const onSendFromPrompt = useCallback(async (text: string) => {
    const trimmed = (text ?? "").trim();
    if (!trimmed) return;

    // Debug ohne Console: /debug storage zeigt Key-Existenz + Länge (ohne Inhalte)
    if (trimmed === "/debug storage") {
      try {
        const kChatV1 = "mpathy:chat:v1";
        const kThread = "mpathy:thread:default";
        const kLegacy = "mpage2_messages_v1";

        const vChat = window.localStorage.getItem(kChatV1);
        const vThread = window.localStorage.getItem(kThread);
        const vLegacy = window.localStorage.getItem(kLegacy);

        systemSay(
          `**Storage Debug**\n\n` +
            `- ${kChatV1}: ${vChat ? vChat.length : 0}\n` +
            `- ${kThread}: ${vThread ? vThread.length : 0}\n` +
            `- ${kLegacy}: ${vLegacy ? vLegacy.length : 0}`,
        );
      } catch {
        systemSay("**Storage Debug**\n\nFailed to read localStorage.");
      }
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: trimmed, format: "markdown" };

       const optimistic = truncateMessages([...(messages ?? []), userMsg]);
    setMessages(optimistic);
    persistMessages(optimistic);

    // ---------------------------------------------------------------------------
    // Step L3 – Ledger Recovery & Dual Append (v1)
    // ---------------------------------------------------------------------------
    try {
      // ------------------------------------------------------------
// Step L5 – Real TruthHash Injection (v1)
// ------------------------------------------------------------

appendTriketonLedgerEntry({
  id: crypto.randomUUID(),
  role: "user",
  content: userMsg.content,
  truth_hash: computeTruthHash(normalizeForTruthHash(userMsg.content)),
  public_key: "local_user",
  timestamp: new Date().toISOString(),
  version: "v1",
  orbit_context: "chat",
  chain_id: "local",
});

      console.debug("[TriketonLedger] user entry appended:", userMsg.content.slice(0, 30));
    } catch (err) {
      console.warn("[TriketonLedger] user append failed:", err);
    }

    // ---------------------------------------------------------------------------
    // Step L4 – Chain Serialization & Recovery (v1)
    // ---------------------------------------------------------------------------
    try {
      const ledgerRaw = window.localStorage.getItem("mpathy:triketon:v1");
      const ledger: any[] = ledgerRaw ? JSON.parse(ledgerRaw) : [];

      const chatSerial = 1; // v1 = Single-Thread (später Multi-Chat-fähig)
      const msgNumber = ledger.length + 1;

    const last = ledger.at(-1) as any;
if (last && (last as any).id === (userMsg as any).id) return; // Duplicate-Guard


      const enriched = {
        ...ledger[ledger.length - 1],
        chat_serial: chatSerial,
        msg_number: msgNumber,
      };

      ledger[ledger.length - 1] = enriched;
      window.localStorage.setItem("mpathy:triketon:v1", JSON.stringify(ledger));

      console.debug(`[TriketonLedger] numbered #${msgNumber} (chat ${chatSerial})`);
    } catch (err) {
      console.warn("[TriketonLedger] numbering failed:", err);
    }

    setLoading(true);
    setMode("THINKING");


    try {
      const assistant = await sendMessageLocal(optimistic);
      if (assistant.content === t("gc_please_login_to_continue")) {
        return;
      }

      // 1) Leere Assistant-Bubble anhängen
setMessages((prev) => {
  const base = Array.isArray(prev) ? prev : [];
  const next = truncateMessages([
    ...base,
    { ...assistant, content: "" },
  ]);
  persistMessages(next);
  return next;
});

// 2) Inhalt schrittweise aufbauen 
const fullText = assistant.content ?? "";
const CHUNK_SIZE = 2;
const TICK_MS = 16;

(async () => {
  for (let i = 0; i < fullText.length; i += CHUNK_SIZE) {
    await new Promise((r) => setTimeout(r, TICK_MS));

    const chunk = fullText.slice(i, i + CHUNK_SIZE);

    setMessages((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      const last = base[base.length - 1];
      if (!last || last.role !== "assistant") return prev;

      const next = truncateMessages([
        ...base.slice(0, -1),
        { ...last, content: last.content + chunk },
      ]);

      persistMessages(next);
      return next;
    });
  }
})();


      const meta = (assistant as any).meta as
        | { status?: string; balanceAfter?: number | null }
        | undefined;

      if (meta && typeof meta.balanceAfter === "number" && Number.isFinite(meta.balanceAfter)) {
        setBalance(meta.balanceAfter);

        if (typeof window !== "undefined") {
          try {
            window.dispatchEvent(
              new CustomEvent("mpathy:tokens:update", {
                detail: { balance: meta.balanceAfter },
              }),
            );
          } catch {
            // Event-Fehler dürfen den Chat nicht stören
          }
        }
      }

      if (meta && meta.status === "depleted_now") {
        try {
          systemSay(
            `**${t("chat.tokens.depleted_title")}**\n\n${t(
              "chat.tokens.depleted_message",
            )}`,
          );
        } catch {
          // UX-Hinweis darf niemals den Chat crashen
        }
      }

    } catch {
      setMessages((prev) => {
        const base = Array.isArray(prev) ? prev : [];
        const next = truncateMessages([
          ...base,
          {
            role: "assistant",
            content: "⚠️ Send failed. Please retry.",
            format: "markdown",
          },
        ]);
        persistMessages(next);
        return next;
      });
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
const openOverlay = useCallback(() => setOverlayOpen(true), []);


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
/* Scroll → Header shrink + Navigation-Override */
useEffect(() => {
  if (!convoRef?.current) return;
  const el = convoRef.current as HTMLElement;

  const onScroll = () => {
    const y = el.scrollTop || 0;

    // Mobile: alter Typing/Idle-State (falls noch genutzt)
    if (isMobile && mState !== "typing") {
      setMState(y > 24 ? "shrink" : "idle");
    }

    // Bridge zur Navigation: Chat-Scroll steuert Nav-Scroll
    if (typeof window !== "undefined") {
      (window as any).__mNavScrollYOverride = y;
      window.dispatchEvent(new Event("scroll"));
    }
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

  /* * RTL-Erkennung – sauber, minimal, garantiert korrekt */
  const isRtl = locale === "ar";

  return (
    <LanguageProvider dict={NAV_PROVIDER_DICT}>

    <main
      className="page2-shell"
      style={{ ...pageStyle, display: "flex", flexDirection: "column" }}
    >

        {/* === GLOBAL NAVIGATION (wie Subscription) ======================= */}
        <header className="page2-nav-shell" ref={headerRef as any}>
          <Navigation />
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
            // Navigation-Abstand wird bereits über headerRef/Layout gesteuert
          }}
        >




           {/* Bühne: Desktop 2 Spalten / Mobile 1 Spalte */}
           <section
        aria-label="Chat layout"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "minmax(0,1fr)"
            : "var(--saeule-w, 277px) minmax(0,1fr)", // HIER SÄULENBREITE EINSTELLEN 1/2 Pltzen und (  :root { --dock-h: 60px; --fab-z: 90; --saeule-w: 275px; } )
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
              top: 0,
              alignSelf: "stretch",
              // Säule = exakt volle Bühne, ohne Safe-Top-Buffer
              height: "100dvh",
              marginTop: 0,
              paddingTop: 0,
              paddingBottom: 0,
              overflow: "visible",
              marginLeft: 0,
            }}
          >
            <SidebarContainer
  onSystemMessage={systemSay}
  onClearChat={onClearChat}
  messages={messages}
/>


          </div>
        )}

            {/* Rechte Spalte: oben Scroll, unten festes Dock */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
  
            height: isMobile ?
undefined : "100dvh",
            /* position: relative und zIndex: 10 werden entfernt, da sie den Fixed-Kontext brechen */
          }}
        >
           <div
            ref={convoRef as any}
            className="chat-stage"
                       style={{
              display: "flex",

              flexDirection: "column",

              /* Oberer Buffer unter der Navi – gesteuert über --chat-safe-top */
              paddingTop: "var(--chat-safe-top)",

              flex: "1 1 auto",
              minHeight: 0,
              overflow: "auto",
   
              pointerEvents: "auto",
              touchAction: "pan-y",

              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",

              paddingBottom: `${padBottom}px`,
              scrollPaddingBottom: `${padBottom}px`,

              // Mobile: kein zusätzliches Seiten-Padding, Desktop behält 12px
              paddingInline: isMobile ? "10px" : "12px",
            }}

          >
                     {/* Chronik wächst im Scroller, Breite = Raumschiff */}
                       <div
              className="chat-stage-inner"
 
              style={{
                flex: 1,
                minHeight: 0,
                paddingTop: 8,
                // Desktop: Bühne wird mittig auf max. 680px begrenzt
                maxWidth: 680,
                margin: "0 auto",
                // Mobile: keine extra Seiten-Paddings, damit nur der äußere Container wirkt
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
                onOpenTriketon={openTriketon}
              />


              {/* stabiler Endanker */}
              <div ref={endRef} style={{ height: 
1 }} aria-hidden="true" />

            </div>
          </div>

                    {/* Dock sitzt stabil unter der Bühne, nutzt weiter padBottom/--dock-h */}
          <div
  data-position-state={!hasMessages ? "intro" : "chat"}
  data-layout={isMobile ? "mobile" : "desktop"}
  className="prompt-root-scene"
  style={{
    position: "fixed",

    bottom: 0,
    // Desktop: Freiraum auf der Säulen-Seite, Dock zentriert im Chat-Bereich
    left: isMobile
      ? 0
      : isRtl
        ? 0
        : "var(--saeule-w, 277px)",
    right: isMobile
      ? 0
      : isRtl
        ? "var(--saeule-w, 277px)"
        : 0,
    zIndex: 90, // <--- MAX Z-INDEX, um die Sichtbarkeit zu garantieren
    display: "flex",
    justifyContent: "center", /* Echte Zentrierung innerhalb dieses Scopes */
    width: isMobile ? "100%" : "auto",
    marginInline: 0,
  }}
>

            <PromptRoot
  t={t}
  hasMessages={hasMessages}
  input={input}
  setInput={setInput}
  loading={loading}
  dockRef={dockRef}
  padBottom={padBottom}
  setPadBottom={setPadBottom}
  compactStatus={compactStatus}
  footerStatus={footerStatus}
  withGate={withGate}
  sendingRef={sendingRef}
  onSendFromPrompt={onSendFromPrompt}
  isMobile={isMobile}
  onToggleSaeule={isMobileLike ? openOverlay : undefined}   // ★ NEU: logische Brücke
/>

          </div>
        </div> {/* /rechte Spalte */}


      </section>   {/* /Grid */}
    </div>     {/* /Bühne */}

    {/* Mobile Overlay / Onboarding */}
    {isMobile && (
  <MobileOverlay
    open={overlayOpen}
    onClose={() => setOverlayOpen(false)}
    onSystemMessage={systemSay}
    onClearChat={onClearChat}
    messages={messages}
  />
)}

    <OnboardingWatcher active={mode === "ONBOARDING"} onSystemMessage={systemSay} />

    {triketonOpen && (
      <div
        role="dialog"
        aria-modal="true"
        onClick={closeTriketon}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.62)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(720px, 100%)",
            borderRadius: TOKENS.radius.lg,
            background: "rgba(15,23,42,0.92)",
            border: `1px solid ${TOKENS.color.glassBorder}`,
            boxShadow: TOKENS.shadow.soft,
            padding: 20,
            color: TOKENS.color.text,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontSize: 20, fontWeight: 650, letterSpacing: "-0.02em" }}>
              {t("triketon.overlay.title")}
            </div>
            <button
              type="button"
              onClick={closeTriketon}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "6px 10px",
                fontSize: 12,
                background: "rgba(148,163,184,0.12)",
                color: "rgba(226,232,240,0.9)",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.5, color: TOKENS.color.textMuted }}>
            {t("triketon.overlay.intro")}
            <br />
            {t("triketon.overlay.explainer")}
            <br />
            {t("triketon.overlay.ownership")}
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <div style={{ padding: 12, borderRadius: TOKENS.radius.md, background: "rgba(2,6,23,0.35)", border: `1px solid ${TOKENS.color.glassBorder}` }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75 }}>
                {t("triketon.overlay.data.public_key")}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, wordBreak: "break-all" }}>
                {triketonPayload?.triketon?.public_key ?? ""}
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: TOKENS.radius.md, background: "rgba(2,6,23,0.35)", border: `1px solid ${TOKENS.color.glassBorder}` }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75 }}>
                {t("triketon.overlay.data.truth_hash")}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, wordBreak: "break-all" }}>
                {triketonPayload?.triketon?.truth_hash ?? ""}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ padding: 12, borderRadius: TOKENS.radius.md, background: "rgba(2,6,23,0.35)", border: `1px solid ${TOKENS.color.glassBorder}` }}>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75 }}>
                  {t("triketon.overlay.data.timestamp")}
                </div>
                <div style={{ marginTop: 6, fontSize: 12, wordBreak: "break-all" }}>
                  {triketonPayload?.triketon?.timestamp ?? ""}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: TOKENS.radius.md, background: "rgba(2,6,23,0.35)", border: `1px solid ${TOKENS.color.glassBorder}` }}>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75 }}>
                  Meta
                </div>
                <pre style={{ marginTop: 8, fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-word", color: "rgba(226,232,240,0.85)" }}>
{JSON.stringify({ id: triketonPayload?.id ?? "", meta: triketonPayload?.meta ?? null }, null, 2)}
                </pre>
              </div>
            </div>

            <div style={{ marginTop: 6, fontSize: 12, color: TOKENS.color.textMuted }}>
              {t("triketon.overlay.closing")}
            </div>
          </div>
        </div>
      </div>
    )}


</main>


  </LanguageProvider>
)
}