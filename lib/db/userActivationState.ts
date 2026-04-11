import { getDB, STORES } from "@/lib/indexedDB";

export type ActivationItem = {
  id: string;
  visible: boolean;
  enabled: boolean;
  order: number;
  pinned: boolean;
};

export type UserActivationState = {
  id: "user_activation_state";
  version: number;
  items: ActivationItem[];
  activeApp: string | null;
};

function getDefaultActivationState(): UserActivationState {
  return {
    id: "user_activation_state",
    version: 1,
    items: [],
    activeApp: null
  };
}

export async function getUserActivationState(): Promise<UserActivationState> {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.USER_ACTIVATION, "readonly");
    const store = tx.objectStore(STORES.USER_ACTIVATION);

    const request = store.get("user_activation_state");

    request.onsuccess = async () => {
      if (!request.result) {
        const state = getDefaultActivationState();
        await saveUserActivationState(state);
        resolve(state);
      } else {
        resolve(request.result);
      }
    };

    request.onerror = () => reject("Failed to read user_activation_state");
  });
}

export async function saveUserActivationState(
  state: UserActivationState
): Promise<void> {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.USER_ACTIVATION, "readwrite");
    const store = tx.objectStore(STORES.USER_ACTIVATION);

    const request = store.put(state);

    request.onsuccess = () => resolve();
    request.onerror = () => reject("Failed to save user_activation_state");
  });
}