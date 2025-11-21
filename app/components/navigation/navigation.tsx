// app/components/navigation/navigation.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoM from "@/components/LogoM";
import LanguageSwitcher from "@/app/components/navigation/LanguageSwitcher";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as navDict } from "@/lib/i18n.navigation";

type OrbitState = "arrival" | "whisper";

export default function Navigation() {
  const { lang } = useLang();
  const pathname = usePathname();

  const [orbitState, setOrbitState] = useState<OrbitState>("arrival");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // prefers-reduced-motion respektieren
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setReducedMotion(mq.matches);
    };

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

    // Scroll-Listener für Arrival ↔ Whisper (nur transform/opacity)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const getY = () => {
      const w = window as any;
      // Chat-Seite: Override durch internen Scroller
      if (typeof w.__mNavScrollYOverride === "number") {
        return w.__mNavScrollYOverride as number;
      }
      // Default: normales Window-Scrolling (Subscription, Landing)
      return window.scrollY;
    };

    const handleScroll = () => {
      const y = getY();

      // Hysterese: ab ~160px runter → Whisper, zurück nach oben <110px → Arrival
      if (y > 160 && orbitState !== "whisper") {
        setOrbitState("whisper");
      } else if (y < 110 && orbitState !== "arrival") {
        setOrbitState("arrival");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [orbitState, reducedMotion]);


  const locale = navDict[lang] ?? navDict.en;
  const links = locale.nav.links;

  const isWhisper = !reducedMotion && orbitState === "whisper";

  const navHeight = isWhisper
    ? "var(--nav-height-sm)"
    : "var(--nav-height-lg)";

  const logoSize = isWhisper ? 40 : 56;

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Chat-Layout: schmale Navi, bündig mit der linken Säule
  const isChatLayout =
    pathname?.startsWith("/chat") ||
    pathname?.startsWith("/page2") ||
    false;

  const headerStyle: React.CSSProperties = isChatLayout
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
          // Chat: Navi vollständig an die rechte Bühne koppeln
          maxWidth: isChatLayout ? "none" : "var(--page-inner-max)",
          margin: isChatLayout ? "0" : undefined,
          paddingInline: isChatLayout
            ? "var(--stage-pad, 48px)"
            : "var(--page-pad-inline)",
          height: navHeight,
          transform: isWhisper
            ? "translateY(-6px) scale(0.95)"
            : "translateY(0) scale(1)",
          opacity: isWhisper ? 0.92 : 1,
          background:
            "radial-gradient(circle at top, rgba(15,23,42,0.9), rgba(0,0,0,0.4))",
          backdropFilter: "blur(18px)",
          boxShadow: isWhisper ? "var(--nav-orbit-glow)" : "none",
          borderBottom: "1px solid rgba(148,163,184,0.20)",
          transition:
            "transform var(--nav-motion-medium), opacity var(--nav-motion-medium), background-color var(--nav-motion-fast), box-shadow var(--nav-motion-medium)",
        }}
      >


        {/* LEFT – Mobile Orb + Desktop Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Orb / Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex md:hidden items-center justify-center rounded-full border px-3 py-1 text-xs uppercase tracking-wide text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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

        {/* CENTER – Links (nur Desktop) */}
        <nav
          className="hidden md:flex items-center gap-4 text-xs sm:text-sm"
          aria-label={locale.nav.aria.menu}
        >
          <NavLink
            href="/subscription"
            label={links.subscription}
            active={isActive("/subscription")}
          />
          <NavLink href="/chat" label={links.chat} active={isActive("/chat")} />
          {/* Account-Link ist vorbereitet, kann später aktiviert werden */}
          {/* <NavLink href="/account" label={links.account} active={isActive("/account")} /> */}
        </nav>

        {/* RIGHT – Language Tail (Desktop + Mobile-Sheet inside) */}
        <div className="flex items-center justify-end min-w-[96px]">
          <LanguageSwitcher />
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          MOBILE NAV SHEET (md:hidden)
          ───────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[50] md:hidden bg-black/70 backdrop-blur-sm flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={locale.nav.aria.menu}
        >
          {/* Tap-Zone oben zum Schließen */}
          <div
            className="flex-1"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sheet unten mit Links */}
          <div
            className="bg-black/92 backdrop-blur-lg border-t border-white/10 rounded-t-2xl p-4"
            style={{
              transform: "translateY(0)",
              transition: reducedMotion
                ? "none"
                : "opacity var(--nav-motion-medium), transform var(--nav-motion-medium)",
            }}
          >
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
              {/* Account-Link vorbereitet, später aktivierbar */}
              {/* <li>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex w/full items-center justify-between px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/5"
                >
                  <span className="uppercase tracking-wide text-[11px]">
                    {links.account}
                  </span>
                </Link>
              </li> */}
            </ul>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="mt-4 w-full text-center py-2 text-sm text-white/70 rounded-xl bg-white/5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
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
