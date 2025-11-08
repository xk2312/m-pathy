// components/subscription/ModesAuto.tsx
"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";

const MODES = ["CALM","RESEARCH","COUNCIL","PLAY","ORACLE","JOY","VISION","EMPATHY","LOVE","WISDOM","TRUTH","PEACE","FLOW"];

export default function ModesAuto(){
  const { t } = useLang();
  const [i,setI] = useState(0);
  useEffect(()=>{
    const id = setInterval(()=>setI(x=>(x+1)%MODES.length), 3000);
    return ()=>clearInterval(id);
  }, []);
  return (
    <div className="max-w-xl mx-auto">
      <p className="text-white/70 mb-3">{t("modes_hint")}</p>
      <div className="rounded-2xl border border-white/10 p-4">
        <div className="text-2xl font-semibold">{MODES[i]}</div>
      </div>
    </div>
  );
}
