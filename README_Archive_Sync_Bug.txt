Hier ist die forensische Dokumentation des aktuellen Systemzustands. Diese README dient als „Blackbox-Rekorder“ und technisches Manifest, um den Ist-Zustand von MAIOS 2.1 nach dem Reset-Fail sauber zu fixieren und die architektonischen Bruchstellen zu benennen.

---

# 📑 FORENSIC AUDIT & SYSTEM STATE: MAIOS 2.1 ARCHIVE

**Dokumentations-Level:** Architekt (M) / Forensik-Modus

**Status:** `INCONSISTENT_HYDRATION`

**Datum:** 2026-02-17

---

## 1. EXEKUTIVE ZUSAMMENFASSUNG (DER FEHLERBEFUND)

Das System leidet unter einem **totalen Synchronisationsbruch während der Initialphase**. Nach einem Full-Reset (Löschen von LS, SS und IDB) findet keine koordinierte Wiederherstellung der Daten statt. Während die Wahrheit (Triketon-Ledger) asynchron eintrifft, führt das Archiv-System bereits eine Projektion auf Basis von Null-Daten aus und persistiert diesen „Zustand des Nichts“ in die IndexedDB. Ein Reload behebt die Anzeige im Browser, heilt aber nicht die korrumpierte Datenstruktur in der IDB.

---

## 2. FORENSISCHE DATEI-ANALYSE (IST-ZUSTAND)

### 2.1 `lib/triketonSync.ts` (Das modifizierte Tor)

Diese Datei wurde im letzten Schritt erweitert, um die Lücke zwischen Server-Verifikation und Frontend-Reaktion zu schließen.

* **Rolle:** Bindeglied zwischen der Python-Engine (`triketon2048.py`) und dem LocalStorage.
* **Änderung:** Implementierung eines `dispatchEvent` vom Typ `mpathy:triketon:append`.
* **Befund:** Die Datei funktioniert nun als Trigger-Quelle für Live-Prompts, ist aber beim Initial-Boot (Kaltstart) wirkungslos, da sie auf einen API-Response wartet, der beim reinen Seitenaufruf ohne Prompt nicht erfolgt.

### 2.2 `lib/archivePairProjection.ts` (Die Korruptionsquelle)

* **Rolle:** Erzeugt aus dem Triketon-Ledger Q&A-Paare für die Suche und den Kontext.
* **Schwachstelle:** In Zeile 108 wird `writeLS(PAIRS_KEY, pairs)` ohne Guard-Klausel ausgeführt.
* **Forensischer Befund:** Wenn der Ledger beim Start noch leer ist, ist `pairs = []`. Die Funktion schreibt dieses leere Array hart in den LocalStorage. Da die IDB-Spiegelung an diesen Key gekoppelt ist, wird die IDB mit einem „Empty-State“ überschrieben, noch bevor die Synchronisation greifen kann.

### 2.3 `lib/archiveProjection.ts` (Der verzögerte Konsument)

* **Rolle:** Wandelt den Triketon-Ledger in eine für Menschen lesbare Chat-Struktur um.
* **Befund:** Diese Datei verhält sich reaktiv korrekt, leidet aber unter dem „First-Load-Vakuum“. Sie findet beim ersten Boot nach Reset keinen Key `mpathy:triketon:v1` vor und bricht die Projektion ab.

### 2.4 `ArchiveInit.tsx` & `ArchiveOverlay.tsx` (Der UI-Host)

* **Rolle:** Einstiegspunkt für das Rendering des Archivs.
* **Befund:** Das Overlay mountet die Initialisierungskomponente sofort. Es findet keine Prüfung statt, ob das System „Ready“ oder „In-Sync“ ist. Das System rendert ein leeres Interface, was den Nutzer zum manuellen Reload zwingt.

---

---

## 3. DAS PHÄNOMEN „RELOAD ≠ LÖSUNG“

Der beobachtete Effekt, dass ein Reload das Archiv im Browser füllt, aber die IDB leer lässt, offenbart die **asynchrone Diskrepanz**:

1. **Phase 1 (Reset & Load):** Der Browser löscht alles. Die App lädt. `archivePairProjection` schreibt `[]` in den LS. Die IDB übernimmt das `[]`.
2. **Phase 2 (Background Sync):** Irgendwann nach dem ersten Load wird der Ledger `mpathy:triketon:v1` im Hintergrund befüllt (Quelle noch unklar). Da kein Event gefeuert wird, bleibt die UI leer.
3. **Phase 3 (Reload):** Der Nutzer drückt F5. Jetzt sind die Daten im LS vorhanden. `archiveProjection.ts` liest sie und zeigt sie an.
4. **Der Defekt:** Da die Paare in Phase 1 bereits als „leer“ markiert wurden und kein neuer Trigger für die Paargenerierung erfolgte, bleibt die IDB auf dem Stand von Phase 1.

---

## 4. ARCHITEKTONISCHE BLINDSTELLEN (MISSING LINKS)

Die Forensik zeigt, dass ein entscheidendes Element in der Kette fehlt: **Die Hydrierungs-Logik**.

Es existiert kein Code-Teil, der:

1. Nach einem Reset den Vault (IDB) validiert.
2. Den Ledger aus dem Vault zurück in den LocalStorage schaufelt.
3. Nach diesem Schaufelvorgang ein globales `mpathy:triketon:ready` Signal sendet.

Stattdessen verlässt sich das System auf „Glück“ beim Reload. In MAIOS 2.1 ist das ein inakzeptabler Zustand.

---

## 5. TECHNISCHES PROTOKOLL DER ÄNDERUNGEN

### Modifikation 1: `triketonSync.ts`

* **Intent:** Live-Event-Triggering.
* **Code:** Einführung von `window.dispatchEvent(new CustomEvent('mpathy:triketon:append'))`.
* **Resultat:** Verifikation wird nun live erkannt, Kaltstart bleibt unberührt.

### Modifikation 2: Storage-Logic (Geplant, noch nicht final)

* **Intent:** Guard-Klauseln für Schreibvorgänge.
* **Analyse:** Ein Schreibstopp für leere Arrays ist zwingend erforderlich, um die IDB vor Korruption zu schützen.

---

## 6. STATUS QUO: IST-MATRIX

| Feature | Status | Risiko-Level |
| --- | --- | --- |
| **Truth-Hash Generation** | 🟢 STABLE (`triketon2048.py`) | Niedrig |
| **Live-Sync (Prompt)** | 🟢 STABLE (`triketonSync.ts` patched) | Niedrig |
| **Initial-Boot (Reset)** | 🔴 BROKEN | Hoch (Datenverlust-Anschein) |
| **IDB-Persistenz** | 🟡 DEGRADED (Empty Overwrite) | Mittel |
| **UI-Feedback** | 🟡 LAGGING (Reload required) | Mittel |

---

## 7. FAZIT DER FORENSIK

Wir haben den „Point of Failure“ identifiziert. Das Problem ist nicht die Logik der Projektion an sich, sondern die **Ereignislosigkeit der Wiederherstellung**. Das System „weiß“ nicht, dass es nach einem Reset wieder Daten hat.

**Empfehlung des COUNCIL13:**
Das System benötigt eine zentrale `HydrationEngine`. Diese muss den Vault auslesen und nach Abschluss ein einziges, unmissverständliches Signal an alle Projektoren senden. Der aktuelle Zustand, in dem jeder Projektor beim Start „auf gut Glück“ in einen potenziell leeren LocalStorage greift, muss beendet werden.

---

*Ende der forensischen Dokumentation.* *Diese Datei dient als Grundlage für die kommende Korrektur des Initial-Boot-Vorgangs.*