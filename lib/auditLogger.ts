/**
 * auditLogger.ts
 * ------------------------------------------
 * Mini-Logger für UI-Events (lokal, puffernd).
 * Speichert Events in localStorage, optional
 * erweiterbar für Telemetrie/Backend.
 * ------------------------------------------
 */

export type AuditEvent = {
    name: string;              // z.B. "mode_switch"
    ts: string;                // ISO-Zeitstempel
    payload?: Record<string, any>;
  };
  
  const STORAGE_KEY = "mpathy:audit";
  
  /**
   * Schreibe ein Event ins Audit-Log
   */
  export function logEvent(name: string, payload: Record<string, any> = {}): AuditEvent | null {
    try {
      // Sicherstellen, dass localStorage existiert (z. B. nicht beim SSR)
      if (typeof window === "undefined" || !window.localStorage) {
        console.warn("[auditLogger] localStorage not available (SSR mode?)");
        return null;
      }
  
      const entry: AuditEvent = { name, ts: new Date().toISOString(), payload };
      const raw = window.localStorage.getItem(STORAGE_KEY) || "[]";
      const prev: AuditEvent[] = JSON.parse(raw);
  
      prev.push(entry);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
  
      return entry;
    } catch (err) {
      console.warn("[auditLogger] failed to log", err);
      return null;
    }
  }
  
  /**
   * Hole alle Events aus dem Audit-Log
   */
  export function getEvents(): AuditEvent[] {
    try {
      if (typeof window === "undefined" || !window.localStorage) return [];
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }
  
  /**
   * Leere das Audit-Log
   */
  export function clearEvents() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }
  
  /**
   * Debug-Helfer: Events in der Konsole anzeigen
   */
  export function dumpEvents() {
    console.table(getEvents());
  }
  