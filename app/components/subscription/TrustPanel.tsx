// components/subscription/TrustPanel.tsx
"use client";
import { useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

export default function TrustPanel(){
  const { t } = useLang();
  const [open, setOpen] = useState<"none"|"export"|"delete">("none");
  return (
    <div className="max-w-xl mx-auto">
      <h4 className="text-xl font-semibold">{t("trust_title")}</h4>
      <p className="text-white/70 mt-1 mb-4">{t("trust_sub")}</p>
      <div className="flex gap-3">
        <button onClick={()=>setOpen("export")} className="rounded-xl px-4 py-2 bg-white text-black">{`Export JSON`}</button>
        <button onClick={()=>setOpen("delete")} className="rounded-xl px-4 py-2 border border-white/20">{`Delete chat`}</button>
      </div>
      {open!=="none" && (
        <div className="mt-4 rounded-xl border border-white/10 p-3 bg-white/5">
          <pre className="text-sm text-white/80 whitespace-pre-wrap">
{open==="export" ? `{\n  "chatId": "abc123",\n  "messages": [...],\n  "ts": "2025-11-08T00:00:00Z"\n}` : "Chat scheduled for deletion. (demo)"}
          </pre>
        </div>
      )}
    </div>
  );
}
