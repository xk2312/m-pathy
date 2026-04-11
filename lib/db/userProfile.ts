import { getDB, STORES } from "./indexedDB";

export type UserProfile = {
  id: "user_profile";
  llm: {
    tone: "simple" | "academic";
    addressing: "du" | "sie";
    username: string;
  };
  system: {
    user_id: string;
    onboarding_status: "not_started" | "in_progress" | "completed" | "needs_repair";
  };
  meta: {
    created_at: string;
    updated_at: string;
  };
};

function getDefaultProfile(): UserProfile {
  const now = new Date().toISOString();

  return {
    id: "user_profile",
    llm: {
      tone: "simple",
      addressing: "du",
      username: ""
    },
    system: {
      user_id: crypto.randomUUID(),
      onboarding_status: "not_started"
    },
    meta: {
      created_at: now,
      updated_at: now
    }
  };
}

export async function getUserProfile(): Promise<UserProfile> {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.USER_PROFILE, "readonly");
    const store = tx.objectStore(STORES.USER_PROFILE);

    const request = store.get("user_profile");

    request.onsuccess = async () => {
      if (!request.result) {
        const profile = getDefaultProfile();
        await saveUserProfile(profile);
        resolve(profile);
      } else {
        resolve(request.result);
      }
    };

    request.onerror = () => reject("Failed to read user_profile");
  });
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const db = await getDB();

  profile.meta.updated_at = new Date().toISOString();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.USER_PROFILE, "readwrite");
    const store = tx.objectStore(STORES.USER_PROFILE);

    const request = store.put(profile);

    request.onsuccess = () => resolve();
    request.onerror = () => reject("Failed to save user_profile");
  });
}