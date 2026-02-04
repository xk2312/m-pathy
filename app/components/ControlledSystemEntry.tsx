"use client";

import { useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as maiosDict } from "@/lib/i18n.maios";

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
  const { lang } = useLang();
  const safeLang = (lang in maiosDict ? lang : "en") as keyof typeof maiosDict;
  const t = maiosDict[safeLang];

  const [open, setOpen] = useState<boolean>(initialOpen);
  const [messageType] = useState<MessageType>(
    MESSAGE_TYPE_ORDER.includes(defaultMessageType)
      ? defaultMessageType
      : DEFAULT_MESSAGE_TYPE
  );

  return (
    <section className="pt-[140px] pb-[140px]">
      <div className="page-center max-w-[720px]">

        <div className="mb-6 text-xs uppercase tracking-wide text-white/40">
          Controlled system entry
        </div>

        <h2 className="text-3xl font-semibold mb-6">
          {t.contact.title}
        </h2>

        <p className="text-white/70 mb-8 max-w-[560px]">
          {t.contact.body[0]}
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
    {open ? "Close message form" : "Open message form"}
  </span>
</button>

<div
  id="controlled-system-entry-form"
  className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
    open ? "max-h-[1200px] opacity-100 mt-10" : "max-h-0 opacity-0"
  }`}
>
  <div className="max-w-[560px]">

            <form
              action="/api/contact"
              method="post"
              className="space-y-6"
            >
              <div>
                <label className="block text-sm text-white/60 mb-1">
                  {t.contact.fields[0]}
                </label>
               <select
  name="type"
  required
  defaultValue={messageType}
className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30 bg-black cursor-pointer"
>
  {MESSAGE_TYPE_ORDER.map((type) => (
    <option key={type} value={type}>
      {type.replace(/_/g, " ")}
    </option>
  ))}
</select>

              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">
                  {t.contact.fields[1]}
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">
                  {t.contact.fields[2]}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">
                  {t.contact.fields[3]}
                </label>
                <input
                  name="company"
                  className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">
                  {t.contact.fields[4]}
                </label>
                <input
                  name="role"
                  className="w-full bg-transparent border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-white/30"
                />
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
  Send message
</button>



            </form>

            <div className="mt-12 space-y-2 text-white/60 text-sm">
              {t.contact.footer.map((line: string, i: number) => (
                <p key={i}>{line}</p>
              ))}
            </div>

          </div>
</div>
      </div>
    </section>
  );
}
