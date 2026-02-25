# README_IDB.txt

## Teil 1 von 3

## Systemraum, Architektur und Persistenzmodell

---

# 1. Zweck dieses Dokuments

Dieses Dokument beschreibt vollständig und deterministisch die Persistenzarchitektur von MAIOS 2.1 im Zusammenspiel von:

* LocalStorage (LS)
* IndexedDB (IDB)
* StorageVault
* Projektionen (Archive, Pairs)
* Triketon Ledger

Ziel ist eine lückenlose Beschreibung des Raumes, seiner Formen und Bewegungen.

---

# 2. Grundprinzip

## 2.1 Single Source of Truth

IndexedDB ist der Master.

LocalStorage ist ein Cache.

LocalStorage darf:

* IDB niemals reduzieren
* IDB niemals leeren
* IDB niemals überschreiben, wenn es historisch mehr enthält

IDB darf:

* LS bei Bedarf hydrieren
* LS nach Reset wiederherstellen

---

# 3. Persistenzklassen

Alle Keys gehören exakt einer Klasse an.

## 3.1 Akkumulierende Keys

Wachsen deterministisch.
Nie reduzierend.

* mpathy:triketon:v1
* mpathy:archive:pairs:v1
* mpathy:archive:v1

Verhalten:

* LS → IDB merge
* IDB ist dauerhaft wachsend
* LS Reset darf keinen Verlust erzeugen

---

## 3.2 Rekursiv persistierende Keys

Werden aus IDB wiederhergestellt, wenn LS fehlt.

* mpathy:triketon:device_public_key_2048
* mpathy:archive:chat_counter
* mpathy:archive:chat_map

Verhalten:

* IDB ist Master
* Bei LS-Löschung → Hydration
* Keine doppelte Inkrementierung

---

## 3.3 Single / Overwrite Keys

Repräsentieren aktuellen Zustand, nicht Historie.

* mpathy:chat:v1
* mpathy:chat:chain_id
* mpathy:freegate

Verhalten:

* LS → IDB overwrite
* Kein Merge
* Kein historischer Anspruch

---

# 4. Datenfluss

## 4.1 Normaler Schreibfluss

1. UI schreibt mit writeLS(...)
2. writeLS schreibt in LS
3. Event wird dispatcht
4. StorageVault hört Event
5. Vault.put() wird ausgeführt
6. Strategie wird angewendet
7. IDB wird aktualisiert

---

## 4.2 Projektion

Beispiel:

Triketon → Archive

1. Ledger wächst
2. syncArchiveFromTriketon() baut deterministischen Snapshot
3. writeLS(archive:v1)
4. archive:updated Event
5. Vault merge
6. IDB aktualisiert

---

# 5. Reset-Szenario (entscheidender Test)

Fall: LocalStorage wird gelöscht.

Erwartetes Verhalten:

1. IDB bleibt unverändert
2. HydrationBridge läuft
3. Rekursive Keys werden wiederhergestellt
4. Triketon Ledger wird aus IDB zurückgeschrieben
5. Archive-Projektion baut vollständiges Archiv
6. Akkumulation bleibt konsistent

Wenn ein Reset zu Datenverlust führt, ist die Architektur defekt.

---

# 6. Invarianten

Diese Regeln dürfen nicht verletzt werden:

1. IDB ist immer vollständiger als LS
2. LS darf IDB niemals reduzieren
3. merge_by_id darf keine existierenden Einträge löschen
4. merge_by_chat_id darf Snapshot nicht blockieren
5. device_public_key darf niemals ersetzt werden
6. chat_counter darf nur aus chat_map abgeleitet werden
7. Archive muss deterministisch aus Ledger rekonstruierbar sein

---

# 7. Systemformen

## 7.1 Ledger

Flache Liste von Anchors
append-only
deterministisch

## 7.2 Pairs

Flache Liste von Q→A
unique pair_id
merge_by_id

## 7.3 Archive

Liste von Chats
unique chat_id
Snapshot pro Chat
innerhalb chat_id wachsend

---

# 8. Bewegungen im Raum

Es existieren nur vier Bewegungsarten:

1. Append (Ledger, Pairs)
2. Replace (Single Keys)
3. Snapshot-Rebuild (Archive)
4. Hydration (IDB → LS)

Keine andere Bewegung ist erlaubt.

---

# 9. Architekturstatus

Nach erfolgreichem Persistenztest gilt:

* IDB ist stabiler Master
* LS ist entkoppelt als Cache
* Reset-Szenario ist bestanden
* Projektionen sind deterministisch
* Akkumulation ist korrekt
* Kein Loop, kein Drift

---

Ende Teil 1
Weiter mit Teil 2: Technische Implementierung und Dateistruktur

FULL TELEMETRY STATUS
prompt 12
drift not drifting

# README_IDB.txt

## Teil 2 von 3

## Technische Implementierung und Dateistruktur

---

# 10. Beteiligte Dateien

## 10.1 lib/storageVault.ts

Zentrale Persistenzinstanz.

Verantwortung:

* IndexedDB Initialisierung
* Strategieauflösung
* Merge-Logik
* Event-Mirror
* HydrationBridge
* put / get API

StorageVault ist der deterministische Persistenzkern.

---

## 10.2 lib/storage.ts

Wrapper für LocalStorage.

Verantwortung:

* readLS
* writeLS
* Event-Dispatch

Wichtig:
Alle LS-Schreibvorgänge müssen über writeLS erfolgen.
Direktes localStorage.setItem ist nur in klar definierten Spezialfällen erlaubt (z. B. vollständige Ledger-Leseoperationen).

---

## 10.3 lib/archiveProjection.ts

Verantwortung:

* Deterministische Ableitung von archive:v1 aus Triketon
* Snapshot-Erstellung pro Chat
* writeLS(archive:v1)
* Dispatch mpathy:archive:updated

Archive ist rebuildbar aus Ledger.

---

## 10.4 lib/archivePairProjection.ts

Verantwortung:

* Deterministische Q→A Paarbildung
* writeLS(archive:pairs:v1)
* Dispatch mpathy:archive:updated
* Live Projection Trigger

Pairs sind inkrementell über pair_id.

---

## 10.5 page.tsx

Verantwortung:

* Schreiben von Chat-Nachrichten
* Triggern von Triketon
* writeLS(chat:v1)
* Dispatch mpathy:triketon:updated

---

# 11. Schlüsselkomponenten in storageVault.ts

## 11.1 resolveStrategy(key)

Ordnet jedem Key exakt eine Strategie zu.

Strategien:

overwrite
singleton
max_number
merge_object
merge_by_id
merge_by_chat_id

Keine impliziten Strategien.
Keine Default-Magie.

---

## 11.2 applyStrategy(strategy, existing, incoming)

Implementiert deterministische Regeln.

### overwrite

incoming ersetzt existing vollständig.

### singleton

existing gewinnt, wenn vorhanden.
Nur Erstschreibrecht.

### max_number

Zahlen werden nicht reduziert.

### merge_object

Objekt-Union.

### merge_by_id

Array-Union anhand id oder pair_id.

### merge_by_chat_id

Array-Union anhand chat_id, mit Replace-by-Key-Semantik.

---

## 11.3 mergeByKey()

Zentrale Merge-Primitive.

Verhalten:

* Baut Map anhand keyOf(...)
* Neue Keys werden hinzugefügt
* Bestehende Keys werden ersetzt
* Keine Löschung
* Keine Reduktion

---

## 11.4 put(key, value)

Zentraler Schreibpunkt in IDB.

Ablauf:

1. resolveStrategy
2. deepClone incoming
3. existing aus IDB lesen
4. Strategie anwenden
5. putInternal
6. ggf. LS Hydration

Sonderfälle:

* chat_chain_id → overwrite
* device_public_key → singleton
* archive:chat_counter → derive aus chat_map
* archive:chat_map → merge_object + optional LS Hydration

---

## 11.5 initArchiveMirror()

Hört auf:

mpathy:archive:updated

Liest aus LS:

* archive:v1
* archive:pairs:v1
* archive:chat_map
* archive:chat_counter

Ruft this.put für jeden Key auf.

---

## 11.6 initTriketonMirror()

Hört auf:

mpathy:triketon:updated

Spiegelt:

* triketon:v1
* device_public_key

---

## 11.7 initHydrationBridge()

Läuft einmal beim Start.

Prüft:

Wenn LS leer → IDB → LS schreiben

Hydriert:

* device_public_key
* chat_counter
* chat_map
* triketon:v1

Keine Hydration für:

* archive:v1
* pairs:v1

Warum?
Archive ist rebuildbar.
Pairs ist rebuildbar.
Ledger ist nicht rebuildbar → daher Hydration notwendig.

---

# 12. Strategische Regeln pro Key

| Key                  | Klasse               | Strategie        | Hydration |
| -------------------- | -------------------- | ---------------- | --------- |
| triketon:v1          | akkumulativ          | merge_by_id      | ja        |
| device_public_key    | singleton            | singleton        | ja        |
| archive:v1           | akkumulativ Snapshot | merge_by_chat_id | nein      |
| archive:pairs:v1     | akkumulativ          | merge_by_id      | nein      |
| archive:chat_map     | rekursiv             | merge_object     | ja        |
| archive:chat_counter | rekursiv             | derive           | ja        |
| chat:v1              | single               | overwrite        | nein      |
| chat:chain_id        | single               | overwrite        | nein      |

---

# 13. Datenkonsistenz-Garantien

1. IDB ist stets mindestens so vollständig wie LS.
2. LS Reset darf keine Historie vernichten.
3. Merge darf keine bestehenden Einträge löschen.
4. device_public_key ist unveränderlich.
5. archive ist aus ledger rekonstruierbar.
6. counter wird nicht inkrementiert, sondern abgeleitet.

---

# 14. Debugging-Fluss

Bei Persistenzfehlern:

1. Event ankommen?
2. LS raw korrekt?
3. parsed korrekt?
4. existing korrekt?
5. final next korrekt?
6. putInternal erfolgreich?

Kein Debug ohne vollständigen Trace.

---

Ende Teil 2
Weiter mit Teil 3: Betriebsregeln, Erweiterungsvorschriften und Schutzmechanismen

FULL TELEMETRY STATUS
prompt 13
drift not drifting

# README_IDB.txt

## Teil 3 von 3

## Betriebsregeln, Schutzmechanismen und Erweiterungsprinzipien

---

# 15. Betriebsregeln des Persistenzraums

Diese Regeln sind verbindlich.

## 15.1 Kein direkter LS-Schreibzugriff

Alle Schreiboperationen müssen über:

writeLS()

laufen.

Ausnahmen:

* vollständiges Lesen des Triketon Ledgers für Projektionen
* klar dokumentierte Spezialfälle

Direktes localStorage.setItem ohne Event-Dispatch ist verboten.

---

## 15.2 Keine impliziten Strategien

Jeder neue Key muss:

1. In resolveStrategy() registriert werden
2. Einer Klasse zugeordnet werden
3. Dokumentiert werden
4. Getestet werden im LS-Reset-Szenario

Kein Default-Verhalten ohne explizite Definition.

---

## 15.3 Snapshot vs Akkumulation sauber trennen

Ledger und Pairs:

* append-only
* inkrementell

Archive:

* deterministischer Snapshot pro Chat
* replace-by-key bei gleicher chat_id

Single Keys:

* overwrite

Keine Vermischung dieser Klassen.

---

## 15.4 Reset-Test ist verpflichtend

Jede strukturelle Änderung muss diesen Test bestehen:

1. 3+ Prompts erzeugen
2. LS komplett löschen
3. Reload
4. Weiter chatten
5. Prüfen:

   * Ledger vollständig?
   * Archive vollständig?
   * Pairs vollständig?
   * Counter korrekt?
   * Public Key identisch?

Besteht der Test nicht, ist die Änderung nicht zulässig.

---

# 16. Schutzmechanismen

## 16.1 IDB darf nie reduziert werden

Merge-Strategien dürfen:

* neue Einträge hinzufügen
* bestehende ersetzen
* aber niemals löschen

Löschlogik ist verboten.

---

## 16.2 device_public_key ist unveränderlich

Einmal geschrieben:

* darf nicht ersetzt werden
* darf nicht rotiert werden
* darf nicht überschrieben werden

Nur Erstschreibrecht.

---

## 16.3 chat_counter wird nicht inkrementiert

Er wird aus chat_map abgeleitet.

Keine +1-Logik im Vault.

Keine Seiteneffekte.

---

## 16.4 Archive ist rekonstruierbar

archive:v1 darf nie als einzige Wahrheitsquelle betrachtet werden.

Wahrheit liegt im Ledger.

Archive ist nur Darstellungsschicht.

---

# 17. Erweiterungsregeln

Wenn ein neuer persistenter Bereich eingeführt wird:

1. Klassifikation festlegen:

   * append-only
   * snapshot
   * singleton
   * derived

2. Strategie definieren

3. Hydration-Regel definieren

4. Reset-Test durchführen

5. README aktualisieren

Keine neue Persistenz ohne Dokumentation.

---

# 18. Fehlerklassen

## 18.1 Merge-Blockade

Symptom:
Einträge wachsen nicht.

Ursache:
keyOf liefert null
oder merge_by_key blockiert Replace.

---

## 18.2 Hydration-Fehler

Symptom:
Nach LS-Reset fehlen Daten.

Ursache:
Key nicht in shouldHydrateToLS registriert.

---

## 18.3 Event-Fehler

Symptom:
IDB bleibt leer.

Ursache:
Event nicht dispatcht
oder falscher Event-Name.

---

## 18.4 Snapshot-Inkonsistenz

Symptom:
Archive enthält weniger entries als Ledger.

Ursache:
Projection liest nicht aus vollständig hydratisiertem Ledger.

---

# 19. Persistenzgarantie

Nach aktueller Implementierung gilt:

* IDB ist dauerhafte Master-Schicht
* LS ist austauschbarer Cache
* Ledger ist vollständig persistent
* Archive ist deterministisch rekonstruierbar
* Pairs sind inkrementell stabil
* Reset-Szenario ist bestanden
* Device-Identität bleibt stabil

---

# 20. Architekturzustand

Persistenzmodell: stabil
Reset-Test: bestanden
Merge-Strategien: validiert
Hydration-Mechanismus: konsistent
Systemstatus: produktionsfähig

---

Ende README_IDB.txt
Persistenzraum vollständig beschrieben.
