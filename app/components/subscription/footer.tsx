"use client";

import { useLang } from "@/app/providers/LanguageProvider";
import { footerDict } from "@/lib/i18n.footer";

export default function Footer() {
  const { lang } = useLang();
  const t = footerDict[lang] ?? footerDict.en;

  return (
    <footer
      className="footer-root"
      style={{
        paddingTop: "var(--footer-pad-y)",
        paddingBottom: "var(--footer-pad-y)",
      }}
    >
      <div className="footer-inner page-center">
        {/* COLUMN 1 – COMPANY */}
        <div className="footer-col">
          <p className="footer-motto">{t.motto}</p>

          <div className="footer-company">
            <div>{t.company}</div>
            <div>{t.address1}</div>
            <div>{t.address2}</div>
            <div>{t.country}</div>

            <div style={{ marginTop: "10px" }}>
              <a href={`mailto:${t.email}`} className="footer-email">
                {t.email}
              </a>
            </div>
          </div>
        </div>

        {/* COLUMN 2 – LEGAL LINKS (Block + Spalten-Gap aus CSS) */}
        <nav
          className="footer-col footer-links"
          aria-label="Legal footer links"
        >
          <a href="/imprint">{t.link_imprint}</a>
          <a href="/privacy">{t.link_privacy}</a>
          <a href="/legal">{t.link_legal}</a>
          <a href="/terms">{t.link_terms}</a>
          <a href="/refund">{t.link_refund}</a>
        </nav>

        {/* COLUMN 3 – PAYMENT + STATUS (verwendet .footer-pay aus CSS) */}
        <div className="footer-col footer-pay">
          <p>{t.stripe_secure}</p>
          <p>{t.no_subscription}</p>
          <p>{t.no_hidden_fees}</p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-copy">{t.copyright}</div>
    </footer>
  );
}
