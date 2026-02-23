/**
 * MAIOS 2.1 - StorageVault (Nativ & Autark)
 * Fokus: Hybrid-Persistenz ohne externe Module.
 * Ziel: IndexedDB ist Master, LocalStorage ist Cache, keine Reduktion durch LS moeglich.
 */

const DB_NAME = 'mpathy_maios_vault';
const STORE_NAME = 'kv_store';
const DB_VERSION = 1;

type VaultStrategy =
  | 'overwrite'
  | 'singleton'
  | 'max_number'
  | 'merge_object'
  | 'merge_by_id'
  | 'merge_by_chat_id';

type AnyRecord = Record<string, unknown>;

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function deepClone<T>(value: T): T {
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
}

function isRecord(v: unknown): v is AnyRecord {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function asNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim().length > 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function getIdLike(obj: AnyRecord): string | null {
  const id = obj['id'];
  if (typeof id === 'string' && id.trim().length > 0) return id;
  return null;
}

function getChatIdLike(obj: AnyRecord): string | null {
  const chatId = obj['chat_id'];
  if (typeof chatId === 'string' && chatId.trim().length > 0) return chatId;
  return null;
}

function mergeByKey(
  existing: unknown,
  incoming: unknown,
  keyOf: (obj: AnyRecord) => string | null
): unknown {
  const a = Array.isArray(existing) ? existing : [];
  const b = Array.isArray(incoming) ? incoming : [];

  const map = new Map<string, AnyRecord>();

  for (const item of a) {
    if (!isRecord(item)) continue;
    const k = keyOf(item);
    if (!k) continue;
    map.set(k, item);
  }

  for (const item of b) {
    if (!isRecord(item)) continue;
    const k = keyOf(item);
    if (!k) continue;
    if (!map.has(k)) map.set(k, item);
  }

  return Array.from(map.values());
}

function mergeObject(existing: unknown, incoming: unknown): unknown {
  const a = isRecord(existing) ? existing : {};
  const b = isRecord(incoming) ? incoming : {};
  return { ...a, ...b };
}

function applyStrategy(strategy: VaultStrategy, existing: unknown, incoming: unknown): unknown {
  if (strategy === 'overwrite') {
    return incoming;
  }

  if (strategy === 'singleton') {
    if (existing !== undefined && existing !== null) return existing;
    return incoming;
  }

  if (strategy === 'max_number') {
    const a = asNumber(existing);
    const b = asNumber(incoming);
    if (a === null && b === null) return existing ?? incoming;
    if (a === null) return b as number;
    if (b === null) return a as number;
    return Math.max(a, b);
  }

  if (strategy === 'merge_object') {
    return mergeObject(existing, incoming);
  }

  if (strategy === 'merge_by_id') {
    return mergeByKey(existing, incoming, getIdLike);
  }

  if (strategy === 'merge_by_chat_id') {
    return mergeByKey(existing, incoming, getChatIdLike);
  }

  return incoming;
}

function resolveStrategy(key: string): VaultStrategy {
  if (key === 'mpathy:chat:chain_id') return 'overwrite';

  if (key === 'mpathy:triketon:device_public_key_2048') return 'singleton';

  if (key === 'mpathy:archive:chat_counter') return 'max_number';

  if (key === 'mpathy:archive:chat_map') return 'merge_object';

  if (key === 'mpathy:archive:pairs:v1') return 'merge_by_id';

  if (key === 'mpathy:archive:v1') return 'merge_by_chat_id';

  if (key === 'mpathy:triketon:v1') return 'merge_by_id';

  return 'overwrite';
}

function shouldHydrateToLS(key: string): boolean {
  return (
    key === 'mpathy:triketon:device_public_key_2048' ||
    key === 'mpathy:archive:chat_counter' ||
    key === 'mpathy:archive:chat_map'
  );
}

function isLsMissingOrEmpty(key: string): boolean {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return true;
    const trimmed = raw.trim();
    if (trimmed.length === 0) return true;

    const parsed = safeJsonParse(trimmed);
    if (parsed === null) return true;

    if (Array.isArray(parsed)) return parsed.length === 0;
    if (isRecord(parsed)) return Object.keys(parsed).length === 0;

    if (typeof parsed === 'string') return parsed.trim().length === 0;
    if (typeof parsed === 'number') return false;

    return false;
  } catch {
    return true;
  }
}

function writeLsRaw(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[Vault] LS write failed for ${key}`, e);
  }
}



export class StorageVault {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase>;

 constructor() {
  this.dbPromise = this.initDB();
  this.initTriketonMirror();
  this.initArchiveMirror();
  this.initHydrationBridge();

}

private initArchiveMirror(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('mpathy:archive:updated', async () => {
    try {
      const keys = [
        'mpathy:archive:v1',
        'mpathy:archive:pairs:v1',
        'mpathy:archive:chat_map',
        'mpathy:archive:chat_counter'
      ];

      for (const key of keys) {
        const raw = window.localStorage.getItem(key);
        if (!raw) continue;

        const parsed = safeJsonParse(raw);
        if (parsed === null) continue;

        await this.put(key, parsed);
      }

    } catch (err) {
      console.error('[VaultMirror] Archive mirror failed:', err);
    }
  });
}

  private initTriketonMirror(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('mpathy:triketon:updated', async () => {
      try {
        const rawLedger = window.localStorage.getItem('mpathy:triketon:v1');
        if (rawLedger) {
          const parsedLedger = safeJsonParse(rawLedger);
          if (Array.isArray(parsedLedger)) {
            await this.put('mpathy:triketon:v1', parsedLedger);
          }
        }

        const deviceKey = window.localStorage.getItem('mpathy:triketon:device_public_key_2048');
        if (deviceKey && deviceKey.trim().length > 0) {
          await this.put('mpathy:triketon:device_public_key_2048', deviceKey.trim());
        }
      } catch (err) {
        console.error('[VaultMirror] Triketon mirror failed:', err);
      }
    });
  }

  private initHydrationBridge(): void {
    if (typeof window === 'undefined') return;

    const hydrateOnce = async (): Promise<void> => {
      try {
        const keys = [
          'mpathy:triketon:v1',
          'mpathy:triketon:device_public_key_2048',
          'mpathy:archive:chat_counter',
          'mpathy:archive:chat_map',
          'mpathy:archive:pairs:v1',
          'mpathy:archive:v1',
        ];

        for (const key of keys) {
          if (!shouldHydrateToLS(key)) continue;
          if (!isLsMissingOrEmpty(key)) continue;

          const fromVault = await this.get(key);
          if (fromVault === undefined || fromVault === null) continue;

          writeLsRaw(key, fromVault);
        }
      } catch (e) {
        console.warn('[Vault] Hydration bridge failed', e);
      }
    };

    void hydrateOnce();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      console.debug('[Vault] Initializing native master ledger...');

      if (typeof window === 'undefined' || !window.indexedDB) {
        console.error('[Vault] IndexedDB not supported.');
        return reject('IndexedDB not supported');
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
          console.info(`[Vault] ObjectStore created: ${STORE_NAME}`);
        }
      };

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.db = db;
        console.debug('[Vault] Connected.');
        resolve(db);
      };

      request.onerror = (event: Event) => {
        console.error('[Vault] Open failed:', (event.target as IDBOpenDBRequest).error);
        reject('DB Open Failed');
      };
    });
  }

  private async getInternal(key: string): Promise<unknown> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error(`[Vault] Read failed: ${key}`);
        reject();
      };
    });
  }

  private async putInternal(key: string, value: unknown): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const dataToSave = deepClone(value);
      store.put(dataToSave, key);

      transaction.oncomplete = () => {
        console.debug(`[Vault] Stored: ${key}`);
        resolve();
      };

      transaction.onerror = () => {
        console.error(`[Vault] Store failed: ${key}`, transaction.error);
        reject(transaction.error);
      };
    });
  }

 async put(key: string, value: unknown): Promise<void> {
  const strategy = resolveStrategy(key);

  const incoming = deepClone(value);
  const existing = await this.getInternal(key);

  // 1️⃣ chain_id → LS gewinnt immer
  if (key === 'mpathy:chat:chain_id') {
    await this.putInternal(key, incoming);
    return;
  }

  // 2️⃣ Singleton (Public Key)
  if (strategy === 'singleton') {
    if (existing !== undefined && existing !== null) {
      if (isLsMissingOrEmpty(key)) {
        writeLsRaw(key, existing);
      }
      return;
    }
    await this.putInternal(key, incoming);
    return;
  }

  // 3️⃣ Archive & Ledger → nur LS → IDB Merge (keine LS Hydration)
  if (
    key === 'mpathy:archive:v1' ||
    key === 'mpathy:archive:pairs:v1' ||
    key === 'mpathy:triketon:v1'
  ) {
    const next = applyStrategy(strategy, existing, incoming);
    await this.putInternal(key, next);
    return;
  }

  // 3b️⃣ chat_map → IDB merge, aber LS darf bei Missing aus IDB wiederhergestellt werden
  if (key === 'mpathy:archive:chat_map') {
    const next = applyStrategy(strategy, existing, incoming);
    await this.putInternal(key, next);

    if (isLsMissingOrEmpty(key)) {
      writeLsRaw(key, next);
    }
    return;
  }

   // 4️⃣ chat_counter → inkrementiere nur wenn LS fehlt, sonst nur absichern (max)
  if (key === 'mpathy:archive:chat_counter') {
    const map = await this.getInternal('mpathy:archive:chat_map');
    let next = 0;

    if (map && typeof map === 'object' && !Array.isArray(map)) {
      next = Object.keys(map as Record<string, unknown>).length;
    }

    await this.putInternal(key, next);
    writeLsRaw(key, next);
    return;
  }

  // Fallback
  await this.putInternal(key, incoming);
}

  async get(key: string): Promise<unknown> {
    return this.getInternal(key);
  }
}

export const storageVault = new StorageVault();