import { getUserProfile } from "@/lib/db/userProfile";
import { getUserActivationState } from "@/lib/db/userActivationState";

export type InitialSystemState = {
  profile: Awaited<ReturnType<typeof getUserProfile>>;
  activation: Awaited<ReturnType<typeof getUserActivationState>>;
  onboardingStatus: "not_started" | "in_progress" | "completed" | "needs_repair";
  isOnboardingRequired: boolean;
};

import registry from "@/registry/registry.json";

function validateActivationState(activation: any) {
  const validIds = new Set(
    registry.registry.entries
      .filter((e: any) => e.ui?.ui_surface === "wall")
      .map((e: any) => e.id)
  );

  const cleanedItems = activation.items.filter((item: any) =>
    validIds.has(item.id)
  );

  return {
    ...activation,
    items: cleanedItems
  };
}

export async function loadInitialSystemState(): Promise<InitialSystemState> {
  const profile = await getUserProfile();
  const rawActivation = await getUserActivationState();

 let activation = validateActivationState(rawActivation);

const onboardingStatus = profile.system.onboarding_status;

const isOnboardingRequired =
  onboardingStatus !== "completed";

if (
  onboardingStatus === "completed" &&
  activation.items.length === 0
) {
  const defaultIds = registry.registry.entries
    .filter((e: any) => e.ui?.ui_surface === "wall")
    .filter((e: any) => e.ui?.default_visible === true)
    .map((e: any) => e.id);

  activation = {
    ...activation,
    items: defaultIds.map((id: string, index: number) => ({
      id,
      visible: true,
      enabled: true,
      order: index,
      pinned: false
    }))
  };
}

return {
  profile,
  activation,
  onboardingStatus,
  isOnboardingRequired
};
}