const DB_NAME = "mpathy_db";
const DB_VERSION = 1;

const STORES = {
  USER_PROFILE: "user_profile",
  USER_ACTIVATION: "user_activation_state",
  CHAT_ARCHIVE: "chat_archive"
};

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject("IndexedDB failed to open");
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.USER_PROFILE)) {
        db.createObjectStore(STORES.USER_PROFILE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORES.USER_ACTIVATION)) {
        db.createObjectStore(STORES.USER_ACTIVATION, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORES.CHAT_ARCHIVE)) {
        db.createObjectStore(STORES.CHAT_ARCHIVE, { keyPath: "id" });
      }
    };
  });
}

export async function getDB(): Promise<IDBDatabase> {
  return initDB();
}

export { STORES };