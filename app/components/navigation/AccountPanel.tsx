"use client";

import React, { useEffect, useRef } from "react";

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

  const emailLabel = email && email.trim().length > 0 ? email : "Unbekannte E-Mail";
  const balanceLabel =
    typeof balance === "number" && Number.isFinite(balance)
      ? balance.toLocaleString("de-DE")
      : "… lädt";

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
        aria-label="Account"
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
            Dein Account
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 14,
              color: "var(--account-muted-fg)",
              wordBreak: "break-all",
            }}
          >
            Angemeldet als: {emailLabel}
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
            <div style={{ marginBottom: 4 }}>Status</div>
            <div style={{ color: "var(--account-title-fg)" }}>Eingeloggt</div>
          </div>

          <div
            style={{
              paddingBottom: 8,
              borderBottom: "1px solid var(--account-border)",
              marginBottom: 16,
            }}
          >
            <div style={{ marginBottom: 4 }}>Deine Tokens</div>
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
            Du bist eingeloggt und nutzt dein Token-Konto. FreeGate gilt nur für
            anonyme Nutzer.
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
            Abmelden
          </button>
        </footer>
      </div>
    </div>
  );
}
