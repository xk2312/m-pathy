'use client';
import { useEffect, useRef } from "react";
import {
  readLocalProfile,
  wasOnboarded,
  summarizeProfile,
  onboardingFirstQuestion,
} from "@/lib/onboarding/profile";

type Props = {
  onSystemMessage: (content: string) => void;
  active?: boolean;
};

// Ein global konstanter Key, damit der Watcher pro Browser nur einmal feuert.
const ONBOARD_FLAG = "mpathy.onboarding.fired";

export default function OnboardingWatcher({ onSystemMessage, active = true }: Props) {
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;

    // Schutz: in derselben Session nicht doppelt auslösen
    if (hasFiredRef.current) {
      console.debug("[OnboardingWatcher] skipped (session ref)");
      return;
    }

    // Schutz: pro Browser (localStorage) nur einmal
    const alreadyFired = window.localStorage.getItem(ONBOARD_FLAG) === "1";
    if (alreadyFired) {
      console.debug("[OnboardingWatcher] skipped (localStorage)");
      return;
    }

    const p = readLocalProfile();
    const onboarded = wasOnboarded();

    if (onboarded && p) {
      onSystemMessage("🔑 Gefundene LocalStorage-Infos:\n" + summarizeProfile(p));
    } else {
      onSystemMessage(onboardingFirstQuestion());
    }

    // Markiere sofort – verhindert Race mit page.tsx und schnelle Remounts
    hasFiredRef.current = true;
    try {
      window.localStorage.setItem(ONBOARD_FLAG, "1");
    } catch (e) {
      console.warn("[OnboardingWatcher] localStorage set failed", e);
    }
  }, [active, onSystemMessage]);

  return null;
}
