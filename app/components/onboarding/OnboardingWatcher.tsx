'use client';
import { useEffect } from "react";
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

export default function OnboardingWatcher({ onSystemMessage, active = true }: Props) {
  useEffect(() => {
    if (!active) return;
    const p = readLocalProfile();
    if (wasOnboarded() && p) {
      onSystemMessage("🔑 Gefundene LocalStorage-Infos:\n" + summarizeProfile(p));
    } else {
      onSystemMessage(onboardingFirstQuestion());
    }
  }, [active, onSystemMessage]);

  return null;
}
//Great