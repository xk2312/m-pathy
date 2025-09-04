/**
 * auditLogger.ts
 * ------------------------------------------
 * Mini-Logger für UI-Events (lokal, puffernd).
 * - SSR-safe (no-op ohne window/localStorage)
 * - Safe-Parse & Sanity-Cap (begrenzt Loggröße)
 * - Named + Default Export (Import-kompatibel)
 * ------------------------------------------
 */

export type AuditEvent = {
    name: string;              // z.B. "mode_switch", "ui_overlay"
    ts: string;                // ISO-Zeitstempel
    payload?: Record<string, any>;
  };
  
  const STORAGE_KEY = "mpathy:audit";
  const MAX_EVENTS = 1000; // Sanity-Cap, älteste Einträge werden gekappt
  
  function hasLocalStorage(): boolean {
    try {
      return typeof window !== "undefined" && !!window.localStorage;
    } catch {
      return false;
    }
  }
  
  function safeParse<T>(raw: string, fallback: T): T {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  
  /**
   * Schreibe ein Event ins Audit-Log (no-op bei SSR)
   */
  export function logEvent(name: string, payload: Record<string, any> = {}): AuditEvent | null {
    if (!hasLocalStorage()) return null;
  
    try {
      const entry: AuditEvent = { name, ts: new Date().toISOString(), payload };
      const raw = window.localStorage.getItem(STORAGE_KEY) || "[]";
      const prev = safeParse<AuditEvent[]>(raw, []);
  
      prev.push(entry);
      // Größe begrenzen
      const trimmed = prev.length > MAX_EVENTS ? prev.slice(prev.length - MAX_EVENTS) : prev;
  
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return entry;
    } catch (err) {
      // bewusst leise – Logging darf App nie brechen
      // console.warn("[auditLogger] failed to log", err);
      return null;
    }
  }
  
  /**
   * Hole alle Events (leeres Array bei SSR/Fehler)
   */
  export function getEvents(): AuditEvent[] {
    if (!hasLocalStorage()) return [];
    const raw = window.localStorage.getItem(STORAGE_KEY) || "[]";
    return safeParse<AuditEvent[]>(raw, []);
  }
  
  /**
   * Leere das Audit-Log
   */
  export function clearEvents(): void {
    if (!hasLocalStorage()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  
  /**
   * Debug-Helfer: Events in der Konsole anzeigen
   */
  export function dumpEvents(): void {
    // eslint-disable-next-line no-console
    console.table(getEvents());
  }
  
  /* Optionaler Default-Export (Import-Flexibilität) */
  const audit = { logEvent, getEvents, clearEvents, dumpEvents };
  export default audit;
  