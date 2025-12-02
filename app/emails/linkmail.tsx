// app/emails/linkmail.tsx
import * as React from "react";

export type LinkmailEmailProps = {
  /**
   * RFC 5646 language code, e.g. "en", "de", "fr".
   * Used only for <html lang="…">.
   */
  langCode?: string;

  /**
   * Subject line (from lib/i18n.linkmail.ts).
   * Usually set by the mail transport.
   */
  subject?: string;

  /**
   * Headline of the mail body (localized).
   */
  headline: string;

  /**
   * Main body text (link explanation).
   */
  bodyMain: string;

  /**
   * Fallback text before the raw URL.
   */
  bodyFallback: string;

  /**
   * Security / validity notice.
   */
  bodySecurity: string;

  /**
   * CTA button label.
   */
  ctaLabel: string;

  /**
   * The actual magic link URL.
   */
  magicLinkUrl: string;

  /**
   * Footer text (brand + info).
   */
  footer: string;

  /**
   * Optional preview text for inbox.
   */
  previewText?: string;
};

/**
 * Pure HTML template for the magic link mail.
 * All texts come from lib/i18n.linkmail.ts via the mailer.
 */
export default function LinkmailEmail(props: LinkmailEmailProps) {
  const {
    langCode = "en",
    subject,
    headline,
    bodyMain,
    bodyFallback,
    bodySecurity,
    ctaLabel,
    magicLinkUrl,
    footer,
    previewText,
  } = props;

  const effectivePreview =
    previewText || bodyMain || subject || "Your sign-in link for m-pathy";

  return (
    <html lang={langCode}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{subject || headline}</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          backgroundColor: "#020617",
          color: "#e5e7eb",
        }}
      >
        {/* Hidden preview text for supporting clients */}
        <div
          style={{
            display: "none",
            maxHeight: 0,
            overflow: "hidden",
            opacity: 0,
          }}
        >
          {effectivePreview}
        </div>

        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{
            padding: "32px 16px",
          }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  width={480}
                  cellPadding={0}
                  cellSpacing={0}
                  role="presentation"
                  style={{
                    width: "100%",
                    maxWidth: "480px",
                    backgroundColor: "#020617",
                    borderRadius: "18px",
                    border: "1px solid rgba(148,163,184,0.25)",
                    boxShadow: "0 16px 45px rgba(15,23,42,0.85)",
                    padding: "28px 24px 24px",
                  }}
                >
                  <tbody>
                    {/* Brand */}
                    <tr>
                      <td
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "rgba(148,163,184,0.9)",
                          paddingBottom: "12px",
                        }}
                      >
                        m-pathy.ai
                      </td>
                    </tr>

                    {/* Headline */}
                    <tr>
                      <td
                        style={{
                          fontSize: "20px",
                          lineHeight: "1.3",
                          fontWeight: 600,
                          color: "#e5e7eb",
                          paddingBottom: "14px",
                        }}
                      >
                        {headline}
                      </td>
                    </tr>

                    {/* Main body */}
                    <tr>
                      <td
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.6",
                          color: "rgba(209,213,219,0.95)",
                          paddingBottom: "20px",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {bodyMain}
                      </td>
                    </tr>

                    {/* CTA button */}
                    <tr>
                      <td align="center" style={{ paddingBottom: "18px" }}>
                        <a
                          href={magicLinkUrl}
                          style={{
                            display: "inline-block",
                            padding: "10px 22px",
                            borderRadius: "999px",
                            backgroundImage:
                              "linear-gradient(135deg,#22d3ee,#4ade80)",
                            color: "#020617",
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                          }}
                        >
                          {ctaLabel}
                        </a>
                      </td>
                    </tr>

                    {/* Fallback link */}
                    <tr>
                      <td
                        style={{
                          fontSize: "11px",
                          lineHeight: "1.6",
                          color: "rgba(148,163,184,0.95)",
                          paddingTop: "4px",
                        }}
                      >
                        <div style={{ marginBottom: "6px" }}>{bodyFallback}</div>
                        <div
                          style={{
                            wordBreak: "break-all",
                            fontFamily:
                              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                            fontSize: "11px",
                            color: "rgba(148,163,184,0.95)",
                          }}
                        >
                          {magicLinkUrl}
                        </div>
                      </td>
                    </tr>

                    {/* Security note */}
                    <tr>
                      <td
                        style={{
                          fontSize: "11px",
                          lineHeight: "1.6",
                          color: "rgba(148,163,184,0.8)",
                          paddingTop: "14px",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {bodySecurity}
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          fontSize: "11px",
                          lineHeight: "1.6",
                          color: "rgba(148,163,184,0.7)",
                          paddingTop: "16px",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {footer}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

/**
 * Plain-text fallback body for mailers.
 */
export function buildLinkmailTextBody(props: LinkmailEmailProps): string {
  const {
    headline,
    bodyMain,
    bodyFallback,
    bodySecurity,
    ctaLabel,
    magicLinkUrl,
    footer,
  } = props;

  const lines: string[] = [];

  if (headline) {
    lines.push(headline);
    lines.push("");
  }

  if (bodyMain) {
    lines.push(bodyMain);
    lines.push("");
  }

  if (bodyFallback) {
    lines.push(bodyFallback);
  }

  lines.push(`${ctaLabel}: ${magicLinkUrl}`);
  lines.push("");
  if (bodySecurity) {
    lines.push(bodySecurity);
    lines.push("");
  }
  if (footer) {
    lines.push(footer);
  }

  return lines.join("\n");
}
