/*** =======================================================================
 *  INVENTUS INDEX — app/components/AccountPanel.tsx
 *  Account-Overlay · Status / E-Mail / Token-Stand (Read-Only View)
 * =======================================================================
 *
 *  [ANCHOR:0] IMPORTS & BASIS
 *    – React-Client-Component mit useLang() + i18n.accountpanel.
 *    – Keine eigenen Fetches; alle Daten kommen via Props vom Parent.
 *
 *  [ANCHOR:1] PROPS (AccountPanelProps)
 *    – open: Sichtbarkeit des Overlays.
 *    – email: User-E-Mail oder null (Gast/Unknown).
 *    – balance: numerischer Token-Stand oder null (nicht geladen / Fehler).
 *    – onClose, onLogout, isMobile: reine UI-/Control-Parameter.
 *
 *  [ANCHOR:2] LANGUAGE-BINDING
 *    – useLang() + accountDict[lang] → tAccount.* Texte.
 *    – Steuert Labels für Status, Tokens, Loading, FreeGate-Hinweis.
 *
 *  [ANCHOR:3] ESC & FOKUS
 *    – ESC schließt Panel per onClose().
 *    – Fokus wird beim Öffnen auf das Panel gesetzt (A11y / UX).
 *
 *  [ANCHOR:4] LABEL-BILDUNG (TOKEN HOTSPOT)
 *    – emailLabel: E-Mail oder tAccount.email.unknown, falls leer/null.
 *    – balanceLabel:
 *        · Wenn typeof balance === "number" && Number.isFinite(balance):
 *            → balance.toLocaleString("de-DE").
 *        · Sonst: tAccount.tokens.loading (z. B. „… lädt“).
 *    – 0 Tokens sind gültig und werden als "0" angezeigt.
 *    – Jeder nicht-numerische Zustand (null/NaN/undefined) führt zu
 *      permanentem Loading-Text – sichtbar bei fehlgeschlagenem Ledger-Read.
 *
 *  [ANCHOR:5] CONTENT-BLOCKS
 *    – Status-Block: tAccount.status.label + tAccount.status.loggedIn.
 *    – Token-Block: tAccount.tokens.label + balanceLabel.
 *    – Info-Block: tAccount.info.freegate (statischer FreeGate-Hinweis).
 *    – Footer: Logout-Button (tAccount.button.logout).
 *
 *  [ANCHOR:6] LAYOUT
 *    – Backdrop (fixed, halbtransparent, zIndex 999).
 *    – Panel-Layout:
 *        · Desktop: rechts oben, feste Breite, border/shadow per CSS-Token.
 *        · Mobile: Bottom-Sheet, 75vh, scrollfähig.
 *
 *  TOKEN-RELEVANZ (SUMMARY)
 *    – AccountPanel.tsx ist reine Anzeige für den Token-Stand.
 *    – Zeigt Zahlen nur, wenn der Parent eine gültige number für balance
 *      liefert; andernfalls bleibt der UI-State im Loading-Label.
 *    – Der aktuell beobachtete „… lädt“-Effekt deutet darauf hin, dass
 *      /api/me/balance entweder null/NaN zurückliefert oder im Fehlerpfad
 *      landet, obwohl der Kauf via Stripe/Webhook korrekt durchläuft.
 *
 *  INVENTUS NOTE
 *    – Reine Inventur & Sichtbarmachung: Dieses Component verhält sich
 *      deterministisch, der Kern-Konflikt liegt im Zusammenspiel von
 *      User-Identität ↔ Ledger ↔ Balance-API, nicht im Rendering selbst.
 * ======================================================================= */

"use client";

import React, { useEffect, useRef } from "react";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as accountDict } from "@/lib/i18n.accountpanel";

type AccountPanelProps = {
  open: boolean;
  email: string | null;
  balance: number | null;
  onClose: () => void;
  onLogout: () => void;
  isMobile: boolean;
};

export default function AccountPanel(props: AccountPanelProps) {
  const { open, email, balance, onClose, onLogout, isMobile } = props;

  const panelRef = useRef<HTMLDivElement | null>(null);
  const { lang } = useLang();
  const locale = accountDict[lang] ?? accountDict.en;
  const tAccount = locale.account;


  // ESC schließt Overlay
  useEffect(() => {
    if (!open) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, onClose]);

  // Fokus ins Panel setzen, wenn geöffnet
  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const emailLabel =
    email && email.trim().length > 0 ? email : tAccount.email.unknown;
  const balanceLabel =
    typeof balance === "number" && Number.isFinite(balance)
      ? balance.toLocaleString("de-DE")
      : tAccount.tokens.loading;

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.45)",
    zIndex: 999,
  };

  const basePanelStyle: React.CSSProperties = {
    background: "var(--account-panel-bg)",
    padding: "var(--account-panel-pad)",
    color: "var(--account-title-fg)",
    borderRadius: isMobile ? "24px 24px 0 0" : "16px",
    boxShadow: "var(--account-shadow)",
    border: "1px solid var(--account-border)",
    zIndex: 1000,
    outline: "none",
  };

  const desktopPanelStyle: React.CSSProperties = {
    position: "fixed",
    right: 24,
    top: "calc(var(--nav-safe-top) + 16px)",
    width: "var(--account-panel-w)",
    maxWidth: "calc(100% - 32px)",
  };

  const mobilePanelStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    height: "75vh",
    maxHeight: "75vh",
    overflowY: "auto",
  };

  const panelStyle: React.CSSProperties = {
    ...basePanelStyle,
    ...(isMobile ? mobilePanelStyle : desktopPanelStyle),
  };

  return (
    <div
      style={backdropStyle}
      onClick={onClose}
      aria-hidden="true"
    >
            <div
        ref={panelRef}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-label={tAccount.aria.dialogLabel}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <header style={{ marginBottom: 16 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: "var(--account-title-fg)",
            }}
          >
            {tAccount.title}
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 14,
              color: "var(--account-muted-fg)",
              wordBreak: "break-all",
            }}
          >
            {tAccount.loggedInAs} {emailLabel}
          </p>
        </header>

        {/* Body */}
        <section
          style={{
            fontSize: 14,
            color: "var(--account-muted-fg)",
          }}
        >
          <div
            style={{
              padding: "8px 0 16px",
              borderBottom: "1px solid var(--account-border)",
              marginBottom: 16,
            }}
          >
                        <div style={{ marginBottom: 4 }}>{tAccount.status.label}</div>
            <div style={{ color: "var(--account-title-fg)" }}>
              {tAccount.status.loggedIn}
            </div>

          </div>

          <div
            style={{
              paddingBottom: 8,
              borderBottom: "1px solid var(--account-border)",
              marginBottom: 16,
            }}
          >
                        <div style={{ marginBottom: 4 }}>{tAccount.tokens.label}</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: "var(--account-title-fg)",
              }}
            >
              {balanceLabel}
            </div>

          </div>

                    <p style={{ margin: 0 }}>
            {tAccount.info.freegate}
          </p>
        </section>

        {/* Footer */}
        <footer style={{ marginTop: 24 }}>
          <button
            type="button"
            onClick={onLogout}
            style={{
              width: "100%",
              height: 42,
              borderRadius: 10,
              border: "1px solid var(--account-border)",
              background: "transparent",
              color: "var(--account-title-fg)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {tAccount.button.logout}
          </button>
        </footer>

      </div>
    </div>
  );
}
