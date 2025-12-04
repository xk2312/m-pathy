/***

* =========================================================
* M — NAVIGATION MASTER (Fixed Header · Chat-Aware Layout)
* =========================================================
*
* INDEX (Sprunganker):
*
* [ANCHOR:IMPORTS]
* ```
   – React, useState/useEffect, usePathname
  ```
* ```
   – LogoM, LanguageSwitcher, useLang, navDict (i18n.navigation)
  ```
*
* [ANCHOR:STATE-HOOKS]
* ```
   – menuOpen (Mobile-Sheet sichtbar/geschlossen)
  ```
* ```
   – isDesktop (Breakpoint-Erkennung via window.innerWidth)
  ```
*
* [ANCHOR:LAYOUT-DETECTOR]
* ```
   – useEffect: Resize-Listener, Desktop ab 768px
  ```
* ```
   – Cleanup des Event-Handlers
  ```
*
* [ANCHOR:LOCALE-LINKS]
* ```
   – locale aus navDict[lang] mit Fallback en
  ```
* ```
   – links = locale.nav.links (subscription/chat)
  ```
* ```
   – aria-Labels aus locale.nav.aria.menu
  ```
*
* [ANCHOR:ROUTE-ACTIVE-HELPER]
* ```
   – isActive(href): Root-/Prefix-Matching je Route
  ```
*
* [ANCHOR:CHAT-LAYOUT-MODE]
* ```
   – isChatLayout: true für /chat und /page2
  ```
* ```
   – beeinflusst Header-Breite und Padding
  ```
*
* [ANCHOR:HEADER-STYLE]
* ```
   – headerStyle für Chat-Layout (fixed, left = --saeule-w)
  ```
* ```
   – Default-Layout: fixed, insetInline 0
  ```
* ```
   – zIndex 40 für Navi-Ebene
  ```
*
* ---
* ```
       MAIN HEADER · STATIC NAV-CONTAINER
  ```
* ---
*
* [ANCHOR:HEADER-INNER-CONTAINER]
* ```
   – zentrales Flex-Layout: mx-auto, justify-between
  ```
* ```
   – maxWidth abhängig von isChatLayout
  ```
* ```
   – paddingInline: stage-pad vs. page-pad-inline
  ```
* ```
   – Höhe, Hintergrund, Blur, kein Border, keine Motion
  ```
*
* [ANCHOR:LEFT-BLOCK]
* ```
   – Wrapper für Mobile-Button + Desktop-Logo
  ```
*
* [ANCHOR:MOBILE-MENU-BUTTON]
* ```
   – md:hidden, zeigt LogoM klein + „Menu“-Label
  ```
* ```
   – aria-label & aria-expanded = menuOpen
  ```
*
* [ANCHOR:DESKTOP-LOGO]
* ```
   – hidden md:flex
  ```
* ```
   – LogoM mit logoSize, variant \"minimal\"
  ```
*
* [ANCHOR:CENTER-DESKTOP-LINKS]
* ```
   – <nav> nur ab md sichtbar
  ```
* ```
   – Links: /subscription, /chat
  ```
* ```
   – aria-label = locale.nav.aria.menu
  ```
*
* [ANCHOR:RIGHT-LANGUAGE-SWITCHER]
* ```
   – LanguageSwitcher im rechten Align-Container
  ```
* ```
   – min-w Breite für stabilen Abschluss
  ```
*
* ---
* ```
        MOBILE BOTTOM SHEET · OVERLAY MENU
  ```
* ---
*
* [ANCHOR:MOBILE-SHEET-OVERLAY]
* ```
   – full-screen fixed, md:hidden
  ```
* ```
   – bg-black/70 + backdrop-blur-sm
  ```
*
* [ANCHOR:MOBILE-SHEET-DISMISS]
* ```
   – flex-1 Klickarea zum Schließen (onClick → setMenuOpen(false))
  ```
*
* [ANCHOR:MOBILE-SHEET-PANEL]
* ```
   – unterer Panel: bg-black/92, Blur, Border-Top, rounded-t-2xl
  ```
* ```
   – Padding, Ul-Liste mit Links
  ```
*
* [ANCHOR:MOBILE-SHEET-LINKS]
* ```
   – zwei Listeneinträge: /subscription und /chat
  ```
* ```
   – Klick schließt Menü, uppercase Labels, hover-bg
  ```
*
* [ANCHOR:MOBILE-SHEET-CLOSE-BUTTON]
* ```
   – Vollbreite-Button „Close“, oben abgerundet, leichte Hover-Stufe
  ```
*
* ---
* ```
             NAVLINK SUBCOMPONENT
  ```
* ---
*
* [ANCHOR:NAVLINK-PROPS]
* ```
   – href, label, active optional
  ```
*
* [ANCHOR:NAVLINK-LAYOUT]
* ```
   – Link als inline-flex, gap-1, horizontale Paddings
  ```
* ```
   – aria-current=\"page\" bei active=true
  ```
*
* [ANCHOR:NAVLINK-LABEL]
* ```
   – span mit text-white/70 → hover:text-white
  ```
* ```
   – fontSize 0.78rem, starke Letter-Spacing, uppercase
  ```
*
* [ANCHOR:NAVLINK-ACTIVE-UNDERLINE]
* ```
   – absolute Linie unter dem Label (left/right, bottom-Offset)
  ```
* ```
   – linearer Gradient von transparent → Licht → transparent
  ```
*
* ---
* ```
                    PHILOSOPHY
  ```
* ---
*
* [ANCHOR:PHILOSOPHY]
* ```
   – Navigation als fixed Orbit über Content
  ```
* ```
   – Chat-Layout: nach rechts versetzte Bühne (Säule wird respektiert)
  ```
* ```
   – Mobile: Orb-Style Bottom Sheet, keine komplexe Motion
  ```
* ```
   – Sprache & Routen kommen aus i18n.navigation (navDict)
  ```
*
* =========================================================
* END OF INDEX
* =========================================================
  */


// app/components/navigation/navigation.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LanguageSwitcher from "@/app/components/navigation/LanguageSwitcher";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as navDict } from "@/lib/i18n.navigation";
import AccountPanel from "@/app/components/navigation/AccountPanel";


export default function Navigation() {
  const { lang } = useLang();
  const pathname = usePathname();

  const [isDesktop, setIsDesktop] = useState(false);
  const [authState, setAuthState] = useState<"guest" | "verifying" | "logged">(
    "guest",
  );
  const [accountOpen, setAccountOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [accountBalance, setAccountBalance] = useState<number | null>(null);

  // Session-Status von Server holen (Cookie-basiert)
  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) return;
        const data = (await res.json()) as {
          ok?: boolean;
          authenticated?: boolean;
          email?: string;
        };
        if (cancelled) return;

        if (data?.ok && data.authenticated) {
          setAuthState("logged");
          setAuthEmail(data.email ?? null);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("auth_verifying");
          }
        } else {
          setAuthState((prev) => (prev === "logged" ? "guest" : prev));
          setAuthEmail(null);
        }
      } catch {
        // schweigend – fällt auf guest zurück
      }
    };

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [pathname]);


  // Verifying-Flag aus localStorage lesen (wird später vom Magic-Link-POST gesetzt)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = window.localStorage.getItem("auth_verifying");
    if (flag === "1") {
      setAuthState("verifying");
    }
  }, []);

  // Balance nur laden, wenn eingeloggt
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (authState !== "logged") {
      setAccountBalance(null);
      return;
    }

    let cancelled = false;

    const loadBalance = async () => {
      try {
        const res = await fetch("/api/me/balance");
        if (!res.ok) return;
        const data = (await res.json()) as { balance?: number };
        if (cancelled) return;
        if (typeof data.balance === "number") {
          setAccountBalance(data.balance);
        } else {
          setAccountBalance(null);
        }
      } catch {
        if (!cancelled) {
          setAccountBalance(null);
        }
      }
    };

    loadBalance();

    return () => {
      cancelled = true;
    };
  }, [authState]);

    useEffect(() => {
    if (typeof window === "undefined") return;


    const handleResize = () => {
      // Desktop ab 768px – einheitliche Layout-Quelle
      setIsDesktop(window.innerWidth >= 1024);
    };


    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  // *** SMALL VARIANT als Default ***
  const navHeight = "var(--nav-height-sm)"; // fix
  const logoSize = 40; // fix

   // Sprache laden
  const locale = navDict[lang] ?? navDict.en;
  const links = locale.nav.links;

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };


  // Chat-Layout bündelt rechts
  const isChatLayout =
    pathname?.startsWith("/chat") ||
    pathname?.startsWith("/page2") ||
    false;

  // Chat-Speziallayout nur am Desktop (Säule rechts/links je nach Sprache),
  // Mobile verhält sich wie Subscription.
  const isChatStageLayout = isChatLayout && isDesktop;

  // Einzige RTL-Sprache aktuell: Arabisch
  const isRTL = lang === "ar";

    const headerStyle: React.CSSProperties = isChatStageLayout
    ? isRTL
      ? {
          // RTL: Säule steht rechts → Navi nimmt die linke Bühne
          position: "fixed",
          top: 0,
          left: 0,
          right: "var(--saeule-w, 320px)",
          zIndex: 40,
        }
      : {
          // LTR: Säule steht links → Navi nimmt die rechte Bühne
          position: "fixed",
          top: 0,
          left: "var(--saeule-w, 320px)",
          right: 0,
          zIndex: 40,
        }
    : {
        // Nicht-Chat-Layouts: volle Breite
        position: "fixed",
        top: 0,
        insetInline: 0,
        zIndex: 40,
      };

  const accountStateDict = locale.nav.account_state;

  const loginLabel =
    authState === "logged"
      ? accountStateDict.account
      : authState === "verifying"
        ? accountStateDict.verifying
        : accountStateDict.login;

  // Auth-UI-Texte (Prompt + Alerts) aus i18n.navigation
  const authText = locale.nav.auth ?? navDict.en.nav.auth;



  const handleLogout = async () => {
    try {
      await fetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors – wir fallen lokal auf guest zurück
    }

    setAuthState("guest");
    setAuthEmail(null);
    setAccountBalance(null);
    setAccountOpen(false);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("auth_verifying");
      } catch {
        // ignorieren
      }
      window.location.reload();
    }
  };

  // Living Horizon – Desktop + Chat only
  useEffect(() => {
    if (!isChatStageLayout) return;
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    // ...
  }, [isChatStageLayout]);

  return (
    <>
      <header style={headerStyle} aria-label="Main site navigation">
        <div
          className="mx-auto flex items-center justify-between"
          style={{
            maxWidth: isChatStageLayout ? "none" : "var(--page-inner-max)",
            margin: isChatStageLayout ? "0" : undefined,
            paddingInline: isChatStageLayout
              ? "var(--stage-pad, 48px)"
              : isDesktop
                ? "18px"
                : "var(--page-pad-inline)",

            // *** STATIC MODE ***
            height: navHeight,
            transform: "none",
            opacity: 1,

            // Equilibrium Veil – nav shares the chat background,
            // the only separation is a 1px luminous horizon
            background:
              "linear-gradient(180deg, #080C15 0%, #060813 38%, #04050A 100%)",
            backdropFilter: "none",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            boxShadow: "0 1px 0 rgba(0,0,0,0.25)",

            // Kein Motion-System mehr
            transition: "none",
          }}
        >
          {/* LEFT – Brand (m-pathy) + Subscribe */}
                   <div
            className="flex items-center gap-5"
            style={isChatStageLayout ? { marginLeft: "-10px" } : undefined}
          >
            <Link
              href="/"
              aria-label="Home"
              className="inline-flex items-center"
            >          {/* LEFT – Brand (m-pathy) + Chat */}
                   <div
            className="flex items-center gap-5"
            style={isChatStageLayout ? { marginLeft: "-10px" } : undefined}
          >
            <Link
              href="/"
              aria-label="Home"
              className="inline-flex items-center"
            >
              <span
                className="text-white/80 hover:text-white transition-colors"

                style={{
                  fontSize: "0.88rem",
                  letterSpacing: "0.10em",
                  textTransform: "none",
                  fontWeight: 650,
                  lineHeight: 1,
                  paddingBottom: "2px",
                  whiteSpace: "nowrap",
                }}
              >
                m-pathy
              </span>
            </Link>
            <NavLink
              href="/page2"
              label={links.subscription}
              active={isActive("/page2")}
            />
          </div>

              <span
                className="text-white/80 hover:text-white transition-colors"

                style={{
                  fontSize: "0.88rem",
                  letterSpacing: "0.10em",
                  textTransform: "none",
                  fontWeight: 650,
                  lineHeight: 1,
                  paddingBottom: "2px",
                  whiteSpace: "nowrap",
                }}
              >
                m-pathy
              </span>
            </Link>
            <NavLink
              href="/page2"
              label={links.subscription}
              active={isActive("/subscription")}
            />
          </div>

          {/* RIGHT – Language + Login */}
          <div className="flex items-center justify-end gap-3 min-w-[180px]">
            <LanguageSwitcher />
              <button
              type="button"
              aria-label={loginLabel}
              className="inline-flex items-center justify-center rounded-full border border-white/20 h-8 text-[0.78rem] tracking-[0.08em] uppercase text-white/75 hover:text-white hover:border-white/60 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300/60 focus:ring-offset-0 disabled:opacity-60"
              style={{
                paddingInline: "var(--nav-button-pad-inline)",
                cursor: "pointer",
              }}
              disabled={authState === "verifying"}
              onClick={async () => {
                if (authState === "logged") {
                  setAccountOpen(true);
                  return;
                }

                           if (typeof window === "undefined") return;

              const email = window.prompt(authText.promptEmail);
              if (!email) return;

              try {
                window.localStorage.setItem("auth_verifying", "1");
                setAuthState("verifying");

                const res = await fetch("/auth/magic-link", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email, lang }),
                });

                if (!res.ok) {
                  // Fehler → zurück auf guest
                  window.localStorage.removeItem("auth_verifying");
                  setAuthState("guest");
                  window.alert(authText.sendError);
                } else {
                  // Erfolg: Header zeigt "Check mail"
                  window.alert(authText.sendSuccess);
                }
              } catch {
                window.localStorage.removeItem("auth_verifying");
                setAuthState("guest");
                window.alert(authText.unexpectedError);
              }

              }}
            >
              {loginLabel}
            </button>

          </div>
        </div>
      </header>

      <AccountPanel
        open={authState === "logged" && accountOpen}
        email={authEmail}
        balance={accountBalance}
        onClose={() => setAccountOpen(false)}
        onLogout={handleLogout}
        isMobile={!isDesktop}
      />
    </>
  );
}



type NavLinkProps = {
  href: string;
  label: string;
  active?: boolean;
};

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center gap-1 px-2 py-1"
      aria-current={active ? "page" : undefined}
    >
      <span
        className="text-white/70 hover:text-white transition-colors"
        style={{
          fontSize: "0.78rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-1 right-1 -bottom-[2px] h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(148,163,184,0), rgba(148,163,184,0.70), rgba(148,163,184,0))",
          }}
        />
      )}
    </Link>
  );

  return null as any; // this line does not exist – only for context
}

<style jsx global>{`
  /* Living Horizon – global CSS variables */
  :root {
    --horizon-opacity: 0.04;
  }

  /* Apply opacity from JS-controlled variable */
  header[aria-label="Main site navigation"] > div {
    border-bottom-color: rgba(255,255,255,var(--horizon-opacity));
  }

  /* Zero-Line Arrival */
  .horizon-arrive header[aria-label="Main site navigation"] > div {
    animation: horizonReveal 160ms cubic-bezier(.25,.1,.25,1);
  }

  @keyframes horizonReveal {
    0% {
      border-bottom-color: rgba(255,255,255,0);
      box-shadow: 0 1px 0 rgba(0,0,0,0);
    }
    100% {
      border-bottom-color: rgba(255,255,255,var(--horizon-opacity));
      box-shadow: 0 1px 0 rgba(0,0,0,0.25);
    }
  }

  /* Horizon Breathe */
  .horizon-breathe header[aria-label="Main site navigation"] > div {
    animation: horizonBreathe 220ms ease-out;
  }

  @keyframes horizonBreathe {
    0% { border-bottom-color: rgba(255,255,255,var(--horizon-opacity)); }
    50% { border-bottom-color: rgba(255,255,255,0.045); }
    100% { border-bottom-color: rgba(255,255,255,var(--horizon-opacity)); }
  }

  /* Reduced Motion Safe */
  @media (prefers-reduced-motion: reduce) {
    .horizon-arrive header[aria-label="Main site navigation"] > div,
    .horizon-breathe header[aria-label="Main site navigation"] > div {
      animation: none !important;
    }
  }
`}</style>
