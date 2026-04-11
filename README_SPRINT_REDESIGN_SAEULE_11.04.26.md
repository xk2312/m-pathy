Sprintplan (minimal, linear):

Säule leeren
Onboarding Button als einziges Element setzen
Onboarding Extension bauen (Fragen + Speicherung IndexedDB)
Klassifikation der Daten (LLM vs System vs Meta)
user_registry.json Struktur definieren
Onboarding schreibt erste 5 Icons in user_registry
Wall rendert ausschließlich aus user_registry
Icon-Typen implementieren (system_app / system_function)
Actions der Icons anbinden (Settings, Chat, CSV, JSON, Archiv)
Settings Overlay (editierbares Profil)
LLM Context Injection (nur erlaubte Felder)
Event → Engine → Execution Pfad einbauen (für später, z.B. CORTEX)

→ Danach: System geschlossen, bereit für Erweiterung

FULL TELEMETRY - STATUS
prompt: 20
drift: no

Verständnis: 10/10
Du willst jeden Schritt konkret und umsetzbar, ohne Interpretationsspielraum.

Sinnhaftigkeit: 10/10
Genau notwendig, damit dein Dev-Team ohne Rückfragen arbeiten kann.

Kommentar:

---

## 1. Säule leeren

* Entferne alle statischen UI-Elemente der linken Säule
* Keine Conditional Logic mehr
* Zustand: **leerer Container ohne Inhalte**

---

## 2. Onboarding Button als einziges Element setzen

* Hardcoded Button in Säule
* Action: sendet Command → `echo_onboarding`
* Keine weiteren UI-Elemente erlaubt

---

## 3. Onboarding Extension bauen

* Neue Extension in `registry.json`
* Linearer Flow (Fragen → Antworten → collectedData)
* Speicherung: vollständiges Objekt in IndexedDB (z.B. `user_profile`)
* Abschluss: schreibt in `user_registry.json`

---

## 4. Klassifikation der Daten

Beim Speichern strikt trennen:

```json
{
  "llm": { "tone": "...", "addressing": "du|sie" },
  "system": { "username": "...", "id": "..." },
  "meta": { "created_at": "...", "progress": "..." }
}
```

* Nur `llm` darf später in Prompt

---

## 5. user_registry.json Struktur definieren

* File liegt clientseitig (IndexedDB oder lokal)
* Struktur:

```json
{
  "wall": []
}
```

* Keine Logik, nur Daten

---

## 6. Onboarding schreibt erste 5 Icons

Nach Abschluss:

```json
{
  "wall": [
    { "id": "settings", "type": "system_app" },
    { "id": "new_chat", "type": "system_function" },
    { "id": "csv_export", "type": "system_function" },
    { "id": "json_export", "type": "system_function" },
    { "id": "archive", "type": "system_app" }
  ]
}
```

* Nur IDs, keine UI-Logik

---

## 7. Wall rendert ausschließlich aus user_registry

* UI mapped über `wall[]`
* Kein Fallback, kein Default
* Leere Registry = leere UI

---

## 8. Icon-Typen implementieren

* `system_app` → öffnet Overlay
* `system_function` → führt direkte Aktion aus
* Switch-Case oder Mapping im Frontend

---

## 9. Actions der Icons anbinden

| ID          | Action                |
| ----------- | --------------------- |
| settings    | open_settings_overlay |
| new_chat    | reset_chat            |
| csv_export  | export_csv            |
| json_export | export_json           |
| archive     | open_archive          |

* Keine Engine
* Direkt im Client

---

## 10. Settings Overlay

* Modal / Overlay
* Editierbar: alle Onboarding-Felder
* Save → überschreibt IndexedDB
* Kein Einfluss auf user_registry

---

## 11. LLM Context Injection

* Route liest `user_profile.llm`
* Fügt es als System- oder Hidden Prompt hinzu
* Beispiel:

```json
{
  "tone": "academic",
  "addressing": "du"
}
```

* Kein Zugriff auf system/meta

---

## 12. Event → Engine → Execution Pfad

* UI Event (z.B. file_upload)
* Sendet Event an Backend
* Engine mapped → execution_id
* Route führt `run.sh` aus

→ Kein direkter Shell-Zugriff im UI

---

## Ergebniszustand

* UI = vollständig registry-gesteuert
* Engine = einzige Entscheidungsinstanz
* Extensions = nur Transport
* Execution = zentralisiert

→ System geschlossen, erweiterbar ohne Refactor
