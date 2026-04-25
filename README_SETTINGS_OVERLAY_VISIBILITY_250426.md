# README SETTINGS OVERLAY VISIBILITY 250426

## Freeze Status

Dieses Dokument friert den aktuellen stabilen Zustand des Settings Overlay Sichtbarkeits- und Öffnungsflows ein.

Der Stand nach Abschluss dieser Phase:

- Settings Overlay ist auf Desktop sichtbar und öffnet korrekt.
- Settings Overlay ist auf Mobile unter 1024 px sichtbar und öffnet korrekt.
- Archive und Settings verhalten sich im mobilen Overlay-Kontext konsistent.
- Der alte Settings Command Loop ist entfernt.
- Settings folgt nun dem gleichen Architekturprinzip wie Archive.
- Ein globaler OverlayHost ist eingeführt.
- Die nächste Arbeitsphase betrifft nicht mehr Sichtbarkeit, sondern Datenlogik im Settings Overlay.

Empfohlener Commit-Titel für diesen Freeze:

```txt
README freeze settings overlay visibility and architecture
```

---

# 1. Ziel dieses Freezes

Ziel dieser Phase war nicht, die vollständige Settings-Funktionalität zu bauen.

Ziel war ausschließlich:

```txt
Settings Overlay auf Desktop und Mobile zuverlässig sichtbar machen.
```

Zusätzlich sollte der Settings Flow architektonisch an den funktionierenden Archive Flow angepasst werden.

Der eingefrorene Zielzustand lautet:

```txt
Saeule
→ mpathy:command
→ commandDispatcher
→ openSettings.ts
→ mpathy:settings:open
→ SettingsOverlay
```

Damit ist Settings nicht mehr direkt an den Command-Kanal gekoppelt, sondern nutzt wie Archive einen eigenen UI Event.

---

# 2. Kernarchitektur

## 2.1 System Layer

Der System Layer verarbeitet Commands.

Zuständig:

- `Saeule.tsx`
- `registry.json`
- `commandDispatcher.ts`
- ausgelagerte Function-Dateien wie `openSettings.ts` oder `openArchive.ts`

Der zentrale Event im System Layer ist:

```txt
mpathy:command
```

Dieser Event darf Commands transportieren, aber nicht dauerhaft als UI-Öffnungsmechanismus für Overlays missbraucht werden.

---

## 2.2 UI Layer

Der UI Layer öffnet konkrete Overlays.

Für Settings:

```txt
mpathy:settings:open
```

Für Archive:

```txt
mpathy:archive:open
```

Prinzip:

```txt
Command = System Layer
Custom UI Event = UI Layer
```

Diese Trennung war der entscheidende Architekturfix.

---

# 3. Beteiligte Dateien

## 3.1 `Saeule.tsx`

### Aufgabe

`Saeule.tsx` rendert die Icons aus der `user_registry`.

Die Säule ist nicht selbst Settings oder Archive.
Sie löst nur Commands aus.

### Relevantes Prinzip

Beim Klick auf ein Icon wird ein Command dispatcht:

```ts
window.dispatchEvent(
  new CustomEvent("mpathy:command", {
    detail: { command },
  })
);
```

### Erkenntnis

`Saeule.tsx` war nicht der primäre Fehlerort.

Bewiesen wurde:

- Settings Icon war sichtbar.
- Klick auf Settings löste `open_settings` aus.
- Console zeigte Command-Aktivität.
- Der Fehler lag danach im Event- und Overlay-Flow.

---

## 3.2 `registry.json`

### Aufgabe

Die Registry definiert:

- welche Icons existieren
- welche Commands ausgelöst werden
- welche Function durch den Dispatcher ausgeführt wird

### Settings Eintrag

Settings muss über einen Function Path verfügen, damit der Dispatcher `openSettings.ts` ausführen kann.

Zielprinzip:

```json
{
  "id": "settings",
  "command": "open_settings",
  "path": "functions/system/openSettings"
}
```

### Wichtige Erkenntnis

Settings darf nicht direkt im Overlay auf `mpathy:command` hören.

Richtig ist:

```txt
registry command
→ dispatcher
→ function
→ UI event
→ overlay
```

---

## 3.3 `commandDispatcher.ts`

### Aufgabe

Der Dispatcher empfängt `mpathy:command` und führt anhand der Registry die passende Function aus.

### Richtige Rolle

Der Dispatcher ist nicht das Overlay.
Er öffnet kein UI direkt.
Er führt nur die ausgelagerte Funktion aus.

### Settings Flow

```txt
open_settings
→ commandDispatcher
→ openSettings.ts
```

Danach verlässt der Flow den System Layer und wechselt in den UI Layer.

---

## 3.4 `app/functions/system/openArchive.ts`

### Funktionierendes Referenzmuster

Archive war der entscheidende Referenzpfad.

Die Archive Function sieht sinngemäß so aus:

```ts
export default function openArchive() {
  window.dispatchEvent(new CustomEvent("mpathy:archive:open"));
}
```

### Warum wichtig

Archive zeigte das korrekte Muster:

```txt
Function dispatcht nicht denselben Command erneut.
Function dispatcht einen eigenen UI Event.
```

Das wurde später auf Settings übertragen.

---

## 3.5 `app/functions/system/openSettings.ts`

### Fehlerhafter Ausgangszustand

Settings hatte zunächst diese Struktur:

```ts
export default async function openSettings() {
  window.dispatchEvent(
    new CustomEvent("mpathy:command", {
      detail: { command: "open_settings" },
    })
  );
}
```

### Warum das falsch war

Diese Function dispatchte denselben Command erneut.

Dadurch entstand ein Loop:

```txt
open_settings
→ commandDispatcher
→ openSettings.ts
→ open_settings
→ commandDispatcher
→ openSettings.ts
→ ...
```

Das führte zu massiver Verlangsamung und instabilem Verhalten.

### Korrekte Version

```ts
export default function openSettings() {
  window.dispatchEvent(new CustomEvent("mpathy:settings:open"));
}
```

### Bedeutung

Settings ist damit an Archive angeglichen:

```txt
openArchive.ts  → mpathy:archive:open
openSettings.ts → mpathy:settings:open
```

---

## 3.6 `SettingsOverlay.tsx`

### Aufgabe

`SettingsOverlay.tsx` rendert das eigentliche Settings Overlay.

Es verwaltet aktuell:

- `isOpen`
- `registry`
- `draft`
- `loadUserRegistry`
- `saveUserRegistry`
- `handleOpen`
- `handleClose`
- `handleChange`
- `handleSave`

### Aktueller Öffnungsmechanismus

Das Overlay hört auf:

```txt
mpathy:settings:open
```

Zielzustand:

```ts
useEffect(() => {
  log("MOUNT");

  function handleOpen() {
    console.log("[SETTINGS EVENT RECEIVED]");
    log("EVENT → open settings received");
    setIsOpen(true);
  }

  window.addEventListener("mpathy:settings:open", handleOpen);

  (async () => {
    const data = await loadUserRegistry();

    if (!data) {
      warn("INIT → empty registry");
      return;
    }

    setRegistry(data);
    setDraft(data);

    log("INIT → state set", data);
  })();

  return () => {
    window.removeEventListener("mpathy:settings:open", handleOpen);
  };
}, []);
```

### Nicht mehr verwenden

Nicht mehr auf `mpathy:command` hören:

```ts
window.addEventListener("mpathy:command", handleCommand);
```

Das würde Settings wieder falsch an den System Command Kanal koppeln.

### Renderlogik

Das Overlay rendert über `createPortal` in `document.body`.

Wichtiges Prinzip:

```ts
const portalTarget =
  typeof document !== "undefined" ? document.body : null;

if (!portalTarget) return null;
```

Danach wird das Overlay per Portal gerendert.

### Erkenntnis

Portal und z-index waren nicht der Hauptfehler.

Das Problem lag primär in:

1. falschem Event-Kanal
2. nicht stabilem globalem Mounting
3. fehlender Ausrichtung an Archive

---

## 3.7 `OverlayHost.tsx`

### Neue Datei

Der globale OverlayHost wurde eingeführt.

Datei:

```txt
app/components/overlay/OverlayHost.tsx
```

Aktueller Inhalt:

```tsx
"use client";

import SettingsOverlay from "@/components/settings/SettingsOverlay";

export default function OverlayHost() {
  return (
    <>
      <SettingsOverlay />
    </>
  );
}
```

### Warum notwendig

Vorher war Settings stark an Desktop-Strukturen gekoppelt.

Desktop funktionierte, weil Settings über den Desktop-Kontext vorhanden war.
Mobile war instabil, weil der mobile Flow nicht denselben stabilen Mount-Kontext hatte.

Der OverlayHost stellt sicher:

```txt
SettingsOverlay ist global und breakpoint-unabhängig gemountet.
```

### Skalierbares Prinzip

Nicht jedes Overlay einzeln in `page.tsx` mounten.

Falsch:

```txt
page.tsx → SettingsOverlay
page.tsx → ArchiveOverlay
page.tsx → AppXOverlay
```

Richtig:

```txt
page.tsx → OverlayHost
OverlayHost → Overlays
```

Langfristig kann daraus ein registry-driven Overlay-System entstehen.

---

## 3.8 `app/page.tsx`

### Änderung

`OverlayHost` wurde root-nah eingebunden.

Import:

```tsx
import OverlayHost from "@/components/overlay/OverlayHost";
```

Platzierung im Return:

```tsx
</main>

<OverlayHost />

</LanguageProvider>
```

### Warum genau dort

Der OverlayHost muss:

- global verfügbar sein
- außerhalb des Main Content Layers sitzen
- innerhalb bestehender Provider bleiben
- unabhängig von Desktop und Mobile sein

Nicht einbauen in:

- Sidebar
- MobileOverlay
- conditional Branch
- inneres App-Layout

---

## 3.9 `MobileOverlay.tsx`

### Aufgabe

`MobileOverlay.tsx` ist der mobile Drawer.

Er rendert im mobilen Kontext die Säule:

```tsx
<Saeule
  onClearChat={onClearChat}
  messages={messages}
/>
```

### Wichtiges Verhalten

`MobileOverlay` ist nicht Settings.
Es ist nur der mobile Träger für die Säule.

Wenn `open` false ist:

```ts
if (!open) return null;
```

### Erkenntnis

MobileOverlay war nicht der Ort, an dem SettingsOverlay dauerhaft gerendert werden soll.

Das SettingsOverlay gehört in den globalen OverlayHost.

### Aktueller Zustand

Nach den Anpassungen ist das Verhalten konsistent genug eingefroren:

- Settings ist sichtbar auf Mobile.
- Archive ist sichtbar auf Mobile.
- Beide verhalten sich gleich im mobilen Overlay-Kontext.

Wichtig:

Nicht erneut blind an MobileOverlay patchen.
Vor jedem weiteren Patch muss die echte aktuelle Datei geprüft werden.

---

# 4. Fehleranalyse

## 4.1 Fehler: Archive wurde zu spät als Referenz genutzt

Der zentrale Denkfehler war, Settings isoliert zu betrachten.

Richtig wäre von Anfang an gewesen:

```txt
Archive funktioniert.
Settings funktioniert nicht.
Also Archive Flow vollständig lesen.
Dann Settings Flow danebenlegen.
Dann Differenz finden.
```

Die relevante Differenz war:

```txt
Archive dispatcht UI Event.
Settings dispatchte erneut Command.
```

---

## 4.2 Fehler: Settings re-dispatchte denselben Command

Der alte Code in `openSettings.ts` war falsch, weil er `open_settings` erneut dispatchte.

Das erzeugte eine Rekursion.

Dieser Fehler ist entfernt.

---

## 4.3 Fehler: Zu früh über z-index und Layering spekuliert

Es wurde angenommen, dass MobileOverlay Settings verdeckt.

Das war nicht sauber bewiesen.

Später zeigte sich:

- MobileOverlay konnte verschwinden.
- Chat war sichtbar.
- Settings war trotzdem nicht sichtbar.

Damit war reines Layering nicht die alleinige Erklärung.

---

## 4.4 Fehler: Zu früh direktes Mounting in `page.tsx` vorgeschlagen

Der Vorschlag, Settings einzeln in `page.tsx` zu mounten, war nicht skalierbar.

Korrektur:

```txt
Nicht Settings einzeln global mounten.
Sondern OverlayHost einmal global mounten.
```

---

## 4.5 Fehler: Patches ohne vollständigen aktuellen Codezustand

Mehrfach wurde auf alte oder vermutete Codezustände reagiert.

Das führte zu unnötiger Reibung.

Neue Regel für diesen Bereich:

```txt
Kein Patch ohne echten aktuellen Code.
```

---

# 5. Was final richtig gemacht wurde

## 5.1 Settings wurde an Archive angeglichen

Archive:

```ts
window.dispatchEvent(new CustomEvent("mpathy:archive:open"));
```

Settings:

```ts
window.dispatchEvent(new CustomEvent("mpathy:settings:open"));
```

Damit sind beide UI Apps auf demselben Muster.

---

## 5.2 System- und UI-Kanal wurden getrennt

Jetzt gilt:

```txt
mpathy:command = System Layer
mpathy:*:open = UI Layer
```

Das verhindert Loops und macht den Flow nachvollziehbar.

---

## 5.3 OverlayHost wurde eingeführt

Der OverlayHost ist die richtige Skalierungsentscheidung.

Er verhindert, dass jede neue App einzeln in `page.tsx` montiert wird.

---

## 5.4 SettingsOverlay ist breakpoint-unabhängig

Durch den OverlayHost ist Settings nicht mehr abhängig von:

- Desktop Sidebar
- Mobile Drawer
- Breakpoint Branch

---

## 5.5 Sichtbarkeit wurde auf Desktop und Mobile gesichert

Aktueller eingefrorener Zustand:

```txt
Desktop Settings: funktioniert
Mobile Settings: funktioniert
Archive: funktioniert
Mobile Verhalten: konsistent genug
```

---

# 6. Aktueller stabiler Flow

## 6.1 Settings öffnen

```txt
User klickt Settings Icon
→ Saeule dispatcht mpathy:command mit open_settings
→ commandDispatcher empfängt Command
→ commandDispatcher ruft openSettings.ts
→ openSettings.ts dispatcht mpathy:settings:open
→ SettingsOverlay hört den UI Event
→ SettingsOverlay setzt isOpen = true
→ SettingsOverlay rendert per Portal
```

## 6.2 Archive öffnen

```txt
User klickt Archive Icon
→ Saeule dispatcht mpathy:command mit open_archive
→ commandDispatcher empfängt Command
→ commandDispatcher ruft openArchive.ts
→ openArchive.ts dispatcht mpathy:archive:open
→ ArchiveOverlay hört den UI Event
→ ArchiveOverlay öffnet
```

## 6.3 Gemeinsames Prinzip

```txt
Icon
→ Command
→ Dispatcher
→ Function
→ UI Event
→ Overlay
```

---

# 7. Aktueller Zustand des SettingsOverlay Inhalts

Das SettingsOverlay ist aktuell vor allem sichtbar und strukturell vorhanden.

Die echte Datenlogik ist noch nicht final ausgebaut.

Aktuelle bekannte Datenstruktur:

```ts
type UserRegistry = {
  profile?: {
    name?: string;
    tone?: string | number;
  };
  security?: {
    public_key?: string;
  };
  infrastructure?: {
    server?: any;
  };
  items?: string[];
  updated_at?: string;
};
```

Aktuelle Funktionen:

- `loadUserRegistry`
- `saveUserRegistry`
- `handleChange`
- `handleSave`
- `handleClose`

Aktuell ist noch nicht final implementiert:

- echte Felder statt Platzhalter
- editierbare und read-only Felder
- Runtime-Normalisierung
- sauberer Save-Scope

---

# 8. Nächste Phase: Settings Datenlogik

Die nächste Phase soll nicht mehr Sichtbarkeit patchen.

Nächste Phase:

```txt
SettingsOverlay mit echten user_registry Daten verbinden.
```

## 8.1 Voraussichtlich editierbare Felder

```txt
profile.name
profile.tone
infrastructure.server.url
infrastructure.server.api_key
```

## 8.2 Voraussichtlich read-only Felder

```txt
security.public_key
items
updated_at
infrastructure.server.status
```

## 8.3 Noch zu prüfen

`infrastructure.server.status` sollte wahrscheinlich system-managed bleiben.

---

# 9. Runtime-Normalisierung

Die `user_registry` wird als lebendes Runtime JSON behandelt.

Nicht:

```txt
Build ändern
Python ändern
Onboarding ändern
route.ts ändern
```

Sondern:

```txt
Beim Laden normalisieren.
Beim Speichern minimal aktualisieren.
```

Prinzip:

```txt
Wenn Feld fehlt → lokal ergänzen
Wenn Feld existiert → respektieren
```

Beispiel Server Normalisierung:

```ts
function normalizeServer(server: any) {
  if (!server) {
    return {
      url: "",
      api_key: "",
      status: "unknown",
    };
  }

  if (typeof server === "string") {
    return {
      url: server,
      api_key: "",
      status: "unknown",
    };
  }

  return {
    url: server.url ?? "",
    api_key: server.api_key ?? "",
    status: server.status ?? "unknown",
  };
}
```

---

# 10. Was nicht mehr angefasst werden soll

## Nicht tun

- `openSettings.ts` darf nicht wieder `mpathy:command` dispatchen.
- `SettingsOverlay.tsx` darf nicht wieder auf `mpathy:command` hören.
- Settings darf nicht einzeln direkt in `page.tsx` gemountet werden.
- Neue Overlays sollen nicht einzeln in `page.tsx` landen.
- MobileOverlay nicht blind patchen.
- Keine z-index Spekulation ohne echten DOM Beweis.
- Keine Änderungen an Python, Onboarding, Execution oder route.ts für Settings Felder.
- Keine Full-Registry-Rewrites ohne Scope.

## Immer tun

- Erst echten Code prüfen.
- Archive als Referenz verwenden, wenn Overlay-Verhalten unklar ist.
- Event Layer sauber trennen.
- Commit-Titel zu jedem Patch geben.
- Minimal patchen.
- Sichtbarkeits-Freeze respektieren.

---

# 11. Empfohlene nächste Arbeitsschritte

## Schritt 1

Aktuelle komplette Datei anfordern:

```txt
SettingsOverlay.tsx
```

## Schritt 2

Inventur machen:

- Typen
- load
- save
- draft
- handleChange
- handleSave
- Renderstruktur

## Schritt 3

Feldmodell definieren:

```txt
General:
- name editable
- tone editable

Security:
- public_key read-only

Infrastructure:
- server.url editable
- server.api_key editable
- server.status read-only

Danger Zone:
- placeholder / später
```

## Schritt 4

Runtime-Normalisierung einbauen.

## Schritt 5

Platzhalter durch echte Felder ersetzen.

## Schritt 6

Speichern minimal halten:

```txt
unbekannte Felder erhalten
bekannte Felder aktualisieren
updated_at setzen
```

---

# 12. Commit-Historie / relevante Commit-Titel

Verwendete oder passende Commit-Titel aus dieser Phase:

```txt
fix settings overlay event channel to UI-based trigger
connect settings function to dispatcher via registry path
create overlay host component for global overlay mounting
mount overlay host at root level below main to ensure global overlay lifecycle
align settings overlay with archive event pattern
standardize mobile overlay behavior across archive and settings
freeze settings overlay visibility across desktop and mobile
README freeze settings overlay visibility and architecture
```

Empfohlener Commit für dieses Dokument:

```txt
README freeze settings overlay visibility and architecture
```

---

# 13. Finaler Freeze Satz

```txt
Settings Overlay Sichtbarkeit ist gelöst.
Desktop und Mobile sind stabil genug.
Archive und Settings folgen demselben Grundprinzip.
Die nächste Phase beginnt bei Datenlogik, nicht bei Sichtbarkeit.
```
