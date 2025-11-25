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

import LogoM from "@/components/LogoM";
import LanguageSwitcher from "@/app/components/navigation/LanguageSwitcher";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as navDict } from "@/lib/i18n.navigation";

export default function Navigation() {
  const { lang } = useLang();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      // Desktop ab 768px – einheitliche Layout-Quelle
      setIsDesktop(window.innerWidth >= 768);
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

  const headerStyle: React.CSSProperties = isChatLayout && isDesktop
    ? {
        position: "fixed",
        top: 0,
        left: "var(--saeule-w, 320px)",
        right: 0,
        zIndex: 40,
      }
    : {
        position: "fixed",
        top: 0,
        insetInline: 0,
        zIndex: 40,
      };

  return (
    <header style={headerStyle} aria-label="Main site navigation">
      <div
        className="mx-auto flex items-center justify-between"
        style={{
          maxWidth: isChatLayout ? "none" : "var(--page-inner-max)",
          margin: isChatLayout ? "0" : undefined,
          paddingInline: isChatLayout
            ? "var(--stage-pad, 48px)"
            : "var(--page-pad-inline)",

          // *** STATIC MODE ***
          height: navHeight,
          transform: "none",
          opacity: 1,
          boxShadow: "none",

          // *** Hintergrund identisch zum Chat-Bereich ***
          background: "rgba(15,16,21,0.92)",
          backdropFilter: "blur(18px)",

          // Keine Linie (nahtloser Übergang)
          borderBottom: "none",

          // Kein Motion-System mehr
          transition: "none",
        }}
      >
        {/* LEFT – Mobile Button & Desktop Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex md:hidden items-center justify-center rounded-full border px-3 py-1 text-xs uppercase tracking-wide text-white/80 hover:text-white"
            aria-label="Open main menu"
            aria-expanded={menuOpen}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <LogoM size={32} active={false} variant="minimal" />
              </div>
              <span className="text-[11px]">Menu</span>
            </div>
          </button>

          {/* Desktop Logo */}
          <div className="hidden md:flex items-center gap-3">
            <LogoM size={logoSize} active={false} variant="minimal" />
          </div>
        </div>

        {/* CENTER – Desktop Links */}
        <nav
          className="hidden md:flex items-center gap-4 text-xs sm:text-sm"
          aria-label={locale.nav.aria.menu}
        >
          <NavLink
            href="/subscription"
            label={links.subscription}
            active={isActive("/subscription")}
          />
          <NavLink
            href="/chat"
            label={links.chat}
            active={isActive("/chat")}
          />
        </nav>

        {/* RIGHT – LanguageSwitcher */}
        <div className="flex items-center justify-end min-w-[96px]">
          <LanguageSwitcher />
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[50] md:hidden bg-black/70 backdrop-blur-sm flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={locale.nav.aria.menu}
        >
          <div className="flex-1" onClick={() => setMenuOpen(false)} />

          <div className="bg-black/92 backdrop-blur-lg border-t border-white/10 rounded-t-2xl p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/subscription"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/5"
                >
                  <span className="uppercase tracking-wide text-[11px]">
                    {links.subscription}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/5"
                >
                  <span className="uppercase tracking-wide text-[11px]">
                    {links.chat}
                  </span>
                </Link>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="mt-4 w-full text-center py-2 text-sm text-white/70 rounded-xl bg-white/5 hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
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
}
