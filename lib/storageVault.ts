/**
 * MAIOS 2.1 - StorageVault (Nativ & Autark)
 * Fokus: Hybrid-Persistenz ohne externe Module.
 * Beseitigt: Implizite 'any' Typen & Modul-Abhängigkeiten.
 */

const DB_NAME = 'mpathy_maios_vault';
const STORE_NAME = 'kv_store';
const DB_VERSION = 1;

export class StorageVault {
  // Explizite Typisierung der Datenbank-Instanz
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  /**
   * Initialisiert die native IndexedDB
   */
  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      console.debug('[Vault] 🌌 Initialisiere nativen Master-Ledger...');

      if (typeof window === 'undefined' || !window.indexedDB) {
        console.error('[Vault] IndexedDB nicht unterstützt.');
        return reject('IndexedDB not supported');
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        // Sicherer Cast des Request-Resultats
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
          console.info(`[Vault] 🆕 ObjectStore '${STORE_NAME}' erstellt.`);
        }
      };

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.db = db;
        console.debug('[Vault] ✅ Verbindung hergestellt.');
        resolve(db);
      };

      request.onerror = (event: Event) => {
        console.error('[Vault] ❌ Fehler beim Öffnen:', (event.target as IDBOpenDBRequest).error);
        reject('DB Open Failed');
      };
    });
  }

  /**
   * Speichert Daten (Master-Write)
   */
  async put(key: string, value: any): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      // Wir explizit auf 'complete' der Transaktion warten, nicht nur auf das Request-Success
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // WICHTIG: Tiefenkopie des Objekts, um Referenz-Probleme bei asynchronen Schreibvorgängen zu vermeiden
      const dataToSave = JSON.parse(JSON.stringify(value));
      
      const request = store.put(dataToSave, key);

      transaction.oncomplete = () => {
        console.debug(`[Vault] ✅ Transaction Complete: ${key}`);
        resolve();
      };

      transaction.onerror = (event) => {
        console.error(`[Vault] ❌ Transaction Error für ${key}:`, transaction.error);
        reject(transaction.error);
      };

      request.onerror = () => {
        console.error(`[Vault] ❌ Request Error für ${key}`);
      };
    });
  }

  /**
   * Liest Daten aus dem Vault
   */
  async get(key: string): Promise<any> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error(`[Vault] ❌ Fehler beim Lesen von ${key}`);
        reject();
      };
    });
  }
}

// Singleton-Instanz
export const storageVault = new StorageVault();