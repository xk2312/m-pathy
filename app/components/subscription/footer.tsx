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

        {/* COLUMN 2 – LEGAL LINKS */}
        <div className="footer-col">
          <a className="footer-link" href="/imprint">{t.link_imprint}</a>
          <a className="footer-link" href="/privacy">{t.link_privacy}</a>
          <a className="footer-link" href="/legal">{t.link_legal}</a>
          <a className="footer-link" href="/terms">{t.link_terms}</a>
          <a className="footer-link" href="/refund">{t.link_refund}</a>
        </div>

        {/* COLUMN 3 – PAYMENT + STATUS */}
        <div className="footer-col">
          <p className="footer-note">{t.stripe_secure}</p>
          <p className="footer-note">{t.no_subscription}</p>
          <p className="footer-note">{t.no_hidden_fees}</p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-copy">
        {t.copyright}
      </div>
    </footer>
  );
}
