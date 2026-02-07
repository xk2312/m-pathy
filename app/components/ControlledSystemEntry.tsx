"use client";

import { useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";
import Turnstile from "@/app/components/turnstile";


export enum MessageType {
  ConsultingInquiry = "consulting_inquiry",
  GovernanceAssessment = "governance_assessment",
  SystemIntegration = "system_integration",
  AuditPreparation = "audit_preparation",
  TechnicalQuestion = "technical_question",
  SupportOrOther = "support_or_other",
}

export const MESSAGE_TYPE_ORDER: readonly MessageType[] = [
  MessageType.ConsultingInquiry,
  MessageType.GovernanceAssessment,
  MessageType.SystemIntegration,
  MessageType.AuditPreparation,
  MessageType.TechnicalQuestion,
  MessageType.SupportOrOther,
];

export const DEFAULT_MESSAGE_TYPE = MessageType.ConsultingInquiry;

type ControlledSystemEntryProps = {
  initialOpen?: boolean;
  defaultMessageType?: MessageType;
};

export default function ControlledSystemEntry({
  initialOpen = false,
  defaultMessageType = DEFAULT_MESSAGE_TYPE,
}: ControlledSystemEntryProps) {
const { lang, t } = useLang();

  const [open, setOpen] = useState<boolean>(initialOpen);

  const [messageType] = useState<MessageType>(
    MESSAGE_TYPE_ORDER.includes(defaultMessageType)
      ? defaultMessageType
      : DEFAULT_MESSAGE_TYPE
  );

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null;

  const [submitResult, setSubmitResult] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!turnstileToken) {
      setSubmitResult("error");
      return;
    }

    setSubmitResult("idle");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      message_type: formData.get("type"),
      message: formData.get("message"),
      email: formData.get("email"),
      company: formData.get("company"),
      role: formData.get("role"),
      source: "controlled-system-entry",
      captcha_token: turnstileToken,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("contact submit failed", err);
      setSubmitResult("error");
      return;
    }

    const data = await res.json();

    if (data?.ok === true) {
      form.reset();
      setSubmitResult("success");
    } else {
      setSubmitResult("error");
    }
  };

  return (
    <section className="pt-[140px] pb-[140px]">
      <div className="page-center max-w-[720px]">

        <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
  {t("maios.contact.eyebrow")}
</div>

<h2 className="text-3xl font-semibold mb-6">
  {t("maios.contact.title")}
</h2>

<p className="text-white/70 mb-8 max-w-[560px]">
  {t("maios.contact.body.0")}
</p>


        <button
  type="button"
  onClick={() => setOpen(!open)}
  className="mt-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/85 transition focus:outline-none cursor-pointer"
  aria-expanded={open}
  aria-controls="controlled-system-entry-form"
>
  <span className="inline-block h-px w-6 bg-white/30" />
  <span>
{open
  ? t("maios.contact.toggle.close")
  : t("maios.contact.toggle.open")}
  </span>
</button>

<div
  id="controlled-system-entry-form"
  className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
    open ? "max-h-[1200px] opacity-100 mt-10" : "max-h-0 opacity-0"
  }`}
>
  <div className="max-w-[560px]">
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label className="block text-sm text-white/60 mb-1">
{t("maios.contact.fields.0")}
        </label>
        <select
          name="type"
          required
          defaultValue={messageType}
          className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30 bg-black cursor-pointer"
        >
          {MESSAGE_TYPE_ORDER.map((type) => (
            <option key={type} value={type}>
{t(`maios.contact.messageTypes.${type}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">
{t("maios.contact.fields.1")}
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t("maios.contact.placeholders.message")}
className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
/>
</div>

<div>
  <label className="block text-sm text-white/60 mb-1">
    {t("maios.contact.fields.2")}
  </label>
  <input
    type="email"
    name="email"
    required
    placeholder={t("maios.contact.placeholders.email")}
    className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
  />
</div>

<div>
  <label className="block text-sm text-white/60 mb-1">
    {t("maios.contact.fields.3")}
  </label>
  <input
    name="company"
    placeholder={t("maios.contact.placeholders.company")}
    className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
  />
</div>

<div>
  <label className="block text-sm text-white/60 mb-1">
    {t("maios.contact.fields.4")}
  </label>

        <input
          name="role"
          placeholder={t("maios.contact.placeholders.role")}
className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
/>
</div>

<div className="mt-6">
  {turnstileSiteKey ? (
    <Turnstile
      siteKey={turnstileSiteKey}
      onSuccess={(token) => setTurnstileToken(token)}
    />
  ) : (
    <p className="text-sm text-red-400">
      {t("maios.contact.feedback.captcha_missing")}
    </p>
  )}
</div>

<button
  type="submit"
  className="
    controlled-entry
    mt-8
    inline-flex items-center justify-center
    px-6 py-3
    border border-white/30
    text-sm font-medium
    text-white/85
    hover:text-white
    hover:border-white/50
    focus:outline-none focus:ring-1 focus:ring-white/30
    transition
    cursor-pointer
  "
>
  {t("maios.contact.actions.submit")}
</button>

{submitResult === "success" && (
  <p className="mt-4 text-sm text-white/70">
    {t("maios.contact.feedback.success")}
  </p>
)}

{submitResult === "error" && (
  <p className="mt-4 text-sm text-red-400">
    {t("maios.contact.feedback.error")}
  </p>
)}

</form>

<div className="mt-12 space-y-2 text-white/60 text-sm">
  {Array.from({ length: 3 }).map((_, i) => (
    <p key={i}>{t(`maios.contact.footer.${i}`)}</p>
  ))}
</div>


          </div>
</div>
      </div>
    </section>
  );
}
