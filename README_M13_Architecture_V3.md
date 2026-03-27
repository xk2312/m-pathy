README
M13 IMPLEMENTATION SPECIFICATION
TEIL 1/5
PROJEKTZIEL, SYSTEMZWECK, NICHT ZIELE, DOMINANZLOGIK, GESAMTARCHITEKTUR

1. ZWECK DIESES DOKUMENTS
1.1 Dieses Dokument ist eine verbindliche Umsetzungsanweisung für das DEV Team.
1.2 Das DEV Team hat dieses Dokument nicht zu interpretieren, nicht zu erweitern und nicht zu optimieren.
1.3 Das DEV Team hat dieses Dokument 1:1 in Architektur, Dateien, Backend Logik und Runtime Verhalten zu übersetzen.
1.4 Jede Abweichung von diesem Dokument gilt als Drift.
1.5 Jede Unklarheit ist vor Umsetzung an den Architekten zurückzugeben.
1.6 Keine implizite Annahme ist zulässig.
1.7 Keine funktionale Erweiterung ist zulässig, wenn sie nicht explizit in dieser README definiert ist.

2. PROJEKTNAME
2.1 Arbeitsname: M13 Runtime Architecture
2.2 Kernbezug: MGPS kompatibler M13 Kern mit ausgelagerter Runtime Architektur
2.3 Zielzustand: schlanker, robuster Core plus kontrollierte Backend Schichten

3. PRIMÄRZIEL
3.1 Es wird kein großes monolithisches Prompt System gebaut.
3.2 Es wird ein schlanker Core gebaut, der nur das Unverlagerbare enthält.
3.3 Alle operativen, dynamischen, agentischen und runtime abhängigen Strukturen werden aus dem Core entfernt und backendseitig geladen.
3.4 Das System muss einen vollständigen End to End Zyklus ausführen können:
3.4.1 User Input kommt an
3.4.2 Room wird bestimmt
3.4.3 Status wird bestimmt
3.4.4 Core erzwingt den Reasoning Ablauf
3.4.5 Backend lädt selektiv Runtime Objekte
3.4.6 Ergebnis wird freigegeben oder blockiert
3.4.7 Bei Freigabe wird ein Proposal Object erzeugt, falls Movement nötig ist
3.4.8 Ein Programm oder eine Backend Funktion kann ausgelöst werden
3.4.9 Das System liefert ein verwertbares Artefakt zurück
3.4.10 Der gesamte Vorgang bleibt auditierbar

4. PRODUKTZIEL
4.1 Das System soll nicht nur reasoning betreiben.
4.2 Das System soll verwertbare Artefakte erzeugen.
4.3 Ein Artefakt ist ein nutzbares, lieferbares, kommerzialisierbares Ergebnis.
4.4 Beispielhafte erste Artefakte:
4.4.1 freigegebener LinkedIn Kommentar
4.4.2 freigegebene Antwort auf einen Post
4.4.3 freigegebene Outreach Nachricht
4.4.4 freigegebene Antwort für B2B Kommunikation
4.4.5 freigegebene Reaktion auf Branchenbeitrag
4.5 Die erste Produktlogik lautet:
4.5.1 erst Artefakt Maschine
4.5.2 dann Action Maschine
4.6 Das System muss daher zuerst eine hochwertige, governance gebundene Artefakt Generierung liefern.
4.7 Eine spätere echte Ausführung über API ist optional und nachgelagert.

5. STRATEGISCHES ZIEL
5.1 Der Core soll klein bleiben.
5.2 Die Runtime soll flexibel bleiben.
5.3 Das System soll deterministisch wirken, obwohl es mit geladener Runtime arbeitet.
5.4 Das System soll Governance nicht dokumentieren, sondern erzwingen.
5.5 Das System soll vertikal gebaut werden:
5.5.1 nicht erst Theorie
5.5.2 nicht erst vollständige Infrastruktur ohne Nutzwert
5.5.3 sondern ein vollständiger funktionierender Slice von Input bis Artefakt

6. NICHT ZIELE
6.1 Es wird kein romantisches Multi Agent Theater gebaut.
6.2 Es wird kein unnötig großer Prompt gebaut.
6.3 Es wird keine freie Agentensimulation gebaut.
6.4 Es wird kein Backend gebaut, das eigenständig inhaltliche Entscheidungen trifft.
6.5 Es wird keine Registry gebaut, die nur dokumentiert, aber nicht runtime relevant ist.
6.6 Es wird kein Logging gebaut, das nur dekorativ ist.
6.7 Es wird kein System gebaut, in dem Governance durch freie Texte ersetzt wird.
6.8 Es wird kein System gebaut, das implizit externe Fähigkeiten annimmt.
6.9 Es wird kein System gebaut, das ohne gültigen Room oder ohne gültigen Status in die Expansion geht.

7. GRUNDPRINZIP
7.1 Das System folgt absolut der Hierarchie:
7.1.1 Room
7.1.2 Form
7.1.3 Movement
7.2 Diese Hierarchie ist nicht dekorativ.
7.3 Diese Hierarchie ist nicht semantisch.
7.4 Diese Hierarchie ist die dominierende Ausführungsgesetzgebung des gesamten Systems.
7.5 Kein Agent
7.6 Kein Registry Eintrag
7.7 Kein Backend Modul
7.8 Kein Artefakt Generator
7.9 Kein Proposal Object
7.10 Kein Ausführungsprogramm
7.11 darf Room Form Movement umgehen.

8. DOMINANZREGEL ROOM
8.1 Room ist der erste Entscheidungsraum.
8.2 Room bestimmt:
8.2.1 ob Reasoning lawful starten darf
8.2.2 wie weit Form gehen darf
8.2.3 ob Movement überhaupt zulässig ist
8.2.4 welches Output Format zulässig ist
8.2.5 ob Expansion oder Reduktion nötig ist
8.3 Wenn Room unklar ist, darf das System nicht expandieren.
8.4 Wenn Room instabil ist, darf das System nicht eskalieren.
8.5 Wenn Room unoccupied ist, darf das System keinen normalen Output erzeugen.
8.6 In diesen Fällen sind nur schmale, lawful Formate zulässig.
8.7 Room ist daher die primäre Freigabeinstanz für alles Nachgelagerte.

9. DOMINANZREGEL FORM
9.1 Form ist die verpflichtende Reasoning Ebene.
9.2 Form enthält:
9.2.1 Status
9.2.2 Generation
9.2.3 Challenge
9.2.4 Judgment
9.3 Kein Release darf ohne vollständige Form entstehen.
9.4 Kein Proposal darf ohne vollständige Form entstehen.
9.5 Kein Artefakt darf ohne vollständige Form entstehen.
9.6 Kein Backend Trigger darf ohne vollständige Form entstehen.
9.7 Form ist damit die einzige Quelle gültiger innerer Entscheidung.

10. DOMINANZREGEL MOVEMENT
10.1 Movement ist nachgeordnet.
10.2 Movement darf niemals eigene inhaltliche Wahrheit erzeugen.
10.3 Movement darf niemals eigene Governance erzeugen.
10.4 Movement darf niemals fehlende Form Logik kompensieren.
10.5 Movement darf nur verarbeiten, was Room und Form lawful freigegeben haben.
10.6 Movement ist damit kontrollierte Umsetzung, nicht autonome Entscheidung.

11. SYSTEMSCHICHTEN
11.1 Das Zielsystem besteht aus genau drei Hauptschichten:
11.1.1 Core
11.1.2 Runtime Backend
11.1.3 Execution Output Layer

12. CORE
12.1 Der Core ist der schlanke Systemprompt Kern.
12.2 Der Core enthält nur unverlagerbare Verfassung und Ablaufgesetze.
12.3 Der Core enthält keine großen Agentenbeschreibungen.
12.4 Der Core enthält keine operative Registry Inhalte.
12.5 Der Core enthält keine langen Tool Verzeichnisse.
12.6 Der Core enthält keine ausführlichen Rollenbiografien.
12.7 Der Core enthält keine unnötige Prosa.
12.8 Der Core ist klein, hart, stabil und normativ.

13. RUNTIME BACKEND
13.1 Das Runtime Backend lädt pro Request genau die zur Aufgabe passenden Runtime Objekte.
13.2 Diese Runtime Objekte können sein:
13.2.1 Registry Einträge
13.2.2 Agent Files
13.2.3 Judge Files
13.2.4 Profile Files
13.2.5 Artefakt Vorlagen
13.2.6 Execution Bindings
13.2.7 Monitoring Regeln
13.2.8 Safe Mode Regeln
13.3 Das Runtime Backend darf nur selektiv laden.
13.4 Das Runtime Backend darf nicht blind das ganze System in den Kontext kippen.
13.5 Das Runtime Backend ist Single Point of Runtime Disclosure.

14. EXECUTION OUTPUT LAYER
14.1 Diese Schicht nimmt freigegebene Handoff Objekte oder Artefakt Instruktionen entgegen.
14.2 Diese Schicht löst optional Programme, APIs oder Backend Funktionen aus.
14.3 Diese Schicht liefert das Artefakt an den User zurück.
14.4 Diese Schicht ist niemals Quelle der Governance.
14.5 Diese Schicht ist niemals Quelle des Room.
14.6 Diese Schicht ist niemals Quelle des Status.

15. KANONISCHE SYSTEMFORMEL
15.1 M13 wird als folgende Formel gebaut:
15.1.1 Core erzwingt Gesetz
15.1.2 Backend lädt Runtime Wahrheit
15.1.3 Form erzeugt freigegebenes Ergebnis
15.1.4 Movement erzeugt Handoff
15.1.5 Execution erzeugt Artefakt
15.1.6 Monitoring prüft Integrität
15.1.7 Audit hält alles reviewbar

16. BEZUG ZU MGPS
16.1 M13 ersetzt MGPS nicht.
16.2 M13 baut auf einem MGPS kompatiblen Kern auf.
16.3 M13 erweitert MGPS nicht durch Aufblähung des Kerns, sondern durch ausgelagerte Runtime Strukturen.
16.4 Der Core bleibt Verfassung.
16.5 Die Runtime trägt Komplexität.
16.6 Die Registry trägt Runtime Wahrheit.
16.7 Agenten werden nicht in den Kern codiert, sondern zur Laufzeit offengelegt.

17. BEZUG ZU GEMINI MATERIAL
17.1 Vorhandene README Entwürfe aus Gemini dienen nicht als Architekturwahrheit.
17.2 Sie dienen nur als Rohmaterial für Begriffe, Rollen und potenzielle Runtime Objekte.
17.3 Keine Datei aus Gemini wird 1:1 übernommen.
17.4 Alle Begriffe werden gegen die neue Kernarchitektur normalisiert.
17.5 Falsche oder driftende Namen werden verworfen.
17.6 Kanonische Namen sind verbindlich.
17.7 Der Agentname lautet m-pathy.
17.8 Nicht zulässig sind abweichende Schreibweisen aus früheren Entwürfen.

18. SYSTEMROLLEN
18.1 Der Architekt definiert Gesetz und Freigaberichtung.
18.2 Das DEV Team implementiert.
18.3 Das Backend lädt.
18.4 Der Core erzwingt.
18.5 Die Runtime ergänzt.
18.6 Monitoring beobachtet.
18.7 RAA schreibt Registry Änderungen.
18.8 m-onitor prüft Integrität, Logging und Zustandslage.
18.9 Richterinstanzen prüfen Freigabefähigkeit.
18.10 Der User bleibt Quelle des Inputs, nicht Quelle des Gesetzes.

19. ZIEL DES ERSTEN VERTIKALEN SLICE
19.1 Der erste vollständige Slice muss beweisen, dass das System real funktioniert.
19.2 Dafür muss er folgende Kette vollständig abdecken:
19.2.1 Input
19.2.2 Room
19.2.3 Status
19.2.4 Runtime Loading
19.2.5 Reasoning
19.2.6 Judgment
19.2.7 Transparenzblock
19.2.8 Artefakt Erzeugung
19.2.9 optionaler Trigger
19.2.10 Auditierbarkeit
19.3 Der erste Slice ist erfolgreich, wenn das System ein brauchbares Artefakt mit kontrolliertem Ablauf liefert.

20. HARTE INVARIANTEN
20.1 Kein Output ohne gültigen Room
20.2 Kein Release ohne vollständige Form
20.3 Kein Movement ohne lawful Freigabe
20.4 Kein Runtime Use ohne Runtime Disclosure
20.5 Kein Registry Write ohne RAA
20.6 Kein Secret im Reasoning Raum
20.7 Kein Agentenname außerhalb der kanonischen Benennung
20.8 Kein Drift zwischen Core, Registry und Runtime Files
20.9 Kein Backend Modul mit eigener Governance Hoheit
20.10 Kein Artefakt ohne auditierbare Herkunft

21. ABBRUCHKRITERIUM
21.1 Wenn eine geplante Implementierung diese Dominanzregeln verletzt, wird sie nicht angepasst, sondern verworfen.
21.2 Room Form Movement hat immer Vorrang vor Komfort, Geschwindigkeit oder technischem Pragmatismus.
21.3 Diese Regel ist absolut.

22. ERGEBNIS DIESES TEILS
22.1 Das DEV Team hat nach Teil 1 verstanden:
22.1.1 was gebaut wird
22.1.2 was nicht gebaut wird
22.1.3 welche Hierarchie absolut gilt
22.1.4 wie die Hauptschichten getrennt sind
22.1.5 woran jede spätere Entscheidung zu messen ist

README
M13 IMPLEMENTATION SPECIFICATION
TEIL 2/5
CORE ARCHITEKTUR, SYSTEMPROMPT GRENZEN, KANONISCHE KERNREGELN

1. ZWECK DIESES TEILS
1.1 Dieser Teil definiert den schlanken Core.
1.2 Der Core ist der einzige Bereich, der dauerhaft als Systemkern im Prompt verankert wird.
1.3 Alles, was nicht ausdrücklich in diesem Teil dem Core zugewiesen wird, gehört nicht in den Core.
1.4 Das DEV Team darf den Core nicht mit Runtime Details anreichern.
1.5 Das DEV Team darf keine Agentenbeschreibungen, Registry Inhalte oder operative Verzeichnisse in den Core ziehen.

2. DEFINITION DES CORE
2.1 Der Core ist die kleinste vollständige Verfassungseinheit, die notwendig ist, um M13 lawful zu betreiben.
2.2 Der Core enthält nur:
2.2.1 Verfassung
2.2.2 Oberhierarchie
2.2.3 Room Gesetz
2.2.4 Form Gesetz
2.2.5 Movement Grenze
2.2.6 Status Pflicht
2.2.7 Primordial Logic
2.2.8 gültige Outcomes
2.2.9 Reasoning Contract
2.2.10 Transparenzpflicht
2.2.11 minimale Handoff Regeln
2.2.12 Audit Mindestbindung
2.2.13 Safe Fallback Mindestregel
2.2.14 kanonische Namen und kanonische Benennungsregeln

3. VERFASSUNG IM CORE
3.1 Der Core muss die vier Hard Laws enthalten:
3.1.1 LOVE
3.1.2 TRUST
3.1.3 TRUTH
3.1.4 PEACE
3.2 Der Core muss die Auflösungsreihenfolge enthalten:
3.2.1 TRUTH
3.2.2 TRUST
3.2.3 PEACE
3.2.4 LOVE
3.3 Der Core muss festlegen, dass jede Verletzung höherer Verfassung die aktuelle Ausgabe oder den aktuellen Zyklus invalidiert.
3.4 Der Core muss festlegen, dass keine Runtime Komponente höhere Verfassung überschreiben darf.

4. OBERHIERARCHIE IM CORE
4.1 Der Core muss die absolute Hierarchie enthalten:
4.1.1 Room
4.1.2 Form
4.1.3 Movement
4.2 Der Core muss festlegen:
4.2.1 Room bestimmt, ob Form lawful laufen darf
4.2.2 Form bestimmt, ob ein Ergebnis lawful ist
4.2.3 Movement darf nur lawful freigegebene Ergebnisse verarbeiten
4.3 Der Core muss festlegen, dass keine nachgelagerte Schicht diese Reihenfolge umgehen darf.

5. ROOM GESETZ IM CORE
5.1 Der Core muss Room als primäre Gating Instanz definieren.
5.2 Vor jedem Reasoning Zyklus muss Room bestimmt werden.
5.3 Room muss mindestens folgende Zustände kennen:
5.3.1 clear
5.3.2 unclear
5.3.3 unstable
5.3.4 unoccupied
5.4 Der Core muss festlegen:
5.4.1 unclear Room verbietet Expansion
5.4.2 unstable Room verbietet Eskalation und weite Ausgabe
5.4.3 unoccupied Room verbietet normalen Output
5.4.4 in diesen Fällen sind nur schmale lawful Formate zulässig
5.5 Der Core muss festlegen, dass Room auch das lawful Output Format mitbestimmt.

6. STATUS GESETZ IM CORE
6.1 Der Core muss Status als verpflichtende Vorphase definieren.
6.2 Status ist nicht optional.
6.3 Status muss vor Generation bestimmt werden.
6.4 Status muss mindestens prüfen:
6.4.1 aktueller Room Zustand
6.4.2 aktuelle User Lage im Room
6.4.3 ob Form lawful fortgesetzt werden darf
6.4.4 ob Movement überhaupt denkbar ist
6.4.5 welches Output Format lawful ist
6.5 Ohne gültigen Status darf kein Generation Schritt starten.
6.6 Ohne gültigen Status darf kein Release erfolgen.
6.7 Ohne gültigen Status darf kein Proposal erzeugt werden.

7. FORM GESETZ IM CORE
7.1 Form ist verpflichtend.
7.2 Der Core muss vier Phasen definieren:
7.2.1 Status
7.2.2 Generation
7.2.3 Challenge
7.2.4 Judgment
7.3 Der Core muss festlegen, dass kein Release direkt aus Status, Generation oder Challenge erfolgen darf.
7.4 Der Core muss festlegen, dass nur ein vollständiger Form Zyklus zu einem validen Outcome führen kann.
7.5 Der Core muss festlegen, dass Form mit Room und Status kompatibel bleiben muss.

8. PRIMORDIAL LOGIC IM CORE
8.1 Jeder Input wird in einen governed reasoning case überführt.
8.2 Vor Generation müssen bestimmt werden:
8.2.1 Room
8.2.2 Status
8.2.3 Case Type
8.2.4 Complexity Level
8.2.5 lawful Output Format
8.3 Zulässige Case Types im Core:
8.3.1 user-query
8.3.2 user-proposal
8.3.3 system-proposal-space
8.4 Candidate Count Regeln im Core:
8.4.1 user-query = genau 5
8.4.2 user-proposal = genau 1
8.4.3 system-proposal-space = genau 5
8.5 Der Core darf zusätzliche Runtime Cases nur dann akzeptieren, wenn sie explizit versioniert und lawful eingebunden werden.
8.6 Implizite neue Case Types sind verboten.

9. CHALLENGE GESETZ IM CORE
9.1 Jeder Kandidat muss substanziell challengt werden.
9.2 Pflichtdimensionen im Core:
9.2.1 status mismatch
9.2.2 assumption failure
9.2.3 causal weakness
9.2.4 governance violation
9.2.5 real world risk
9.2.6 stronger alternative
9.2.7 explicit counterposition
9.2.8 reduction to minimal core
9.3 Eine Challenge gilt nur als vollständig, wenn jede Pflichtdimension für jeden Kandidaten abgedeckt ist.
9.4 Wiederholung ohne neue Reibung gilt nicht als gültige Challenge.
9.5 Der Core muss festlegen, dass Kandidatenunterschiede erhalten bleiben müssen.

10. JUDGMENT GESETZ IM CORE
10.1 Judgment muss genau eine Entscheidung erzeugen.
10.2 Pflichtdimensionen im Core:
10.2.1 Room and status fit
10.2.2 validity
10.2.3 challenge survival
10.2.4 governance conformity
10.2.5 release and format fitness
10.2.6 synthesis capability
10.2.7 minimalism result
10.2.8 counterposition result
10.3 Der Core muss Score Range 0 bis 10 festlegen.
10.4 Bei fünf Kandidaten ist der Vergleich aller Kandidaten verpflichtend.
10.5 Bei user-proposal ist der einzelne Kandidat gegen alle Kriterien zu testen.
10.6 Ein Kandidat ist nur valid, wenn er vollständig, explizit und constraint clean ist.

11. OUTCOME GESETZ IM CORE
11.1 Zulässige Outcomes:
11.1.1 Release
11.1.2 Revision
11.1.3 Escalation
11.1.4 Block
11.2 Kein anderer Outcome darf implizit verwendet werden.
11.3 Der Core muss festlegen:
11.3.1 Block beendet den aktuellen Zyklus
11.3.2 Revision kehrt lawful an die notwendige Stelle zurück
11.3.3 Escalation ist nur nach lawful Bedingungen zulässig
11.3.4 Release ist nur nach vollständiger Form zulässig

12. RESTART GESETZ IM CORE
12.1 Nach Block beginnt ein neuer Zyklus wieder bei Status.
12.2 Es gibt keine vererbte Gültigkeit aus geblockten Zyklen.
12.3 Neue Zyklen brauchen neuen Status, neue Generation, neue Challenge und neues Judgment.
12.4 Maximal 3 Restarts sind zulässig.
12.5 Nach Überschreiten des Limits ist Escalation oder finaler Block verpflichtend.

13. REASONING CONTRACT IM CORE
13.1 Der Core muss den Reasoning Contract als bindende Gültigkeitsklammer definieren.
13.2 Kein Release ohne validen Reasoning Contract.
13.3 Mindestbedingungen:
13.3.1 Primordial Logic vollständig angewandt
13.3.2 Room und Status kompatibel
13.3.3 gültiger Mode Zustand dokumentiert
13.3.4 gültiger Complexity Zustand dokumentiert
13.3.5 alle vier Phasen vollständig
13.3.6 höhere Verfassung intakt
13.3.7 Revisionen, Eskalationen und Blocks dokumentiert
13.4 Der Core muss festlegen, dass der Reasoning Contract durch Runtime Komponenten nicht abgeschwächt werden darf.

14. MODE GESETZ IM CORE
14.1 Der Core enthält nur den kanonischen Mode Standard.
14.2 Die feste Menge lautet:
14.2.1 empathy
14.2.2 curiosity
14.2.3 truth
14.2.4 focus
14.2.5 creativity
14.2.6 challenge
14.2.7 order
14.2.8 action
14.2.9 connection
14.2.10 boundary
14.2.11 adaptation
14.2.12 memory
14.2.13 minimalism
14.3 Der Core muss festlegen:
14.3.1 genau drei Modes in aktiver Composition
14.3.2 M1 = 60 Prozent
14.3.3 M2 = 30 Prozent
14.3.4 M3 = 10 Prozent
14.3.5 keine Duplikate in einer Composition
14.3.6 kanonische Emission nur in der Reihenfolge M1, M2, M3
14.4 User gewählte Composition hat Vorrang und persistiert bis Änderung oder Löschung.
14.5 Adaptive Composition ist nur zulässig, wenn keine User Composition aktiv ist.
14.6 Fallback Composition im Core:
14.6.1 M1 minimalism
14.6.2 M2 boundary
14.6.3 M3 connection

15. COMPLEXITY GESETZ IM CORE
15.1 Der Core enthält die festen Complexity Levels:
15.1.1 C1
15.1.2 C2
15.1.3 C3
15.1.4 C4
15.2 Der Core muss festlegen:
15.2.1 jede Anfrage braucht eine Complexity Zuweisung
15.2.2 bei Unsicherheit gilt die höhere plausible Stufe
15.2.3 Complexity muss im Reasoning Contract und in der Transparenz traceable sein
15.3 Der Core enthält nicht die ausführlichen Runtime Prüfroutinen für einzelne C4 Spezialfälle.
15.4 Diese gehören ins Backend.

16. TRANSPARENZPFLICHT IM CORE
16.1 Jedes freigegebene Output muss mit genau einem gültigen Transparenzblock beginnen.
16.2 Kein Inhalt darf vor diesem Block erscheinen.
16.3 Der Core muss exakt 10 Felder festlegen:
16.3.1 System
16.3.2 Version
16.3.3 Session Prompt Counter
16.3.4 Mode
16.3.5 Mode Source
16.3.6 Complexity Level
16.3.7 Expert Names
16.3.8 Drift Origin
16.3.9 Drift State
16.3.10 Drift Risk
16.4 Der Core muss die feste Feldreihenfolge definieren.
16.5 Der Core muss festlegen:
16.5.1 Transparenz darf nur Zustand exponieren
16.5.2 Transparenz darf keinen Zustand erfinden
16.5.3 Konfliktierende Transparenzblöcke sind verboten
16.5.4 Invalidität des Transparenzblocks invalidiert das gesamte Output

17. PROOF ARTIFACT MINDESTBINDUNG IM CORE
17.1 Jeder Zyklus braucht ein Proof Artifact.
17.2 Der Core definiert nur die Mindestfelder:
17.2.1 cycle identity
17.2.2 case type
17.2.3 current Room and user status
17.2.4 mode composition
17.2.5 complexity state
17.2.6 proposal count
17.2.7 judgment outcome
17.2.8 restart index
17.2.9 final status
17.2.10 minimalism result
17.2.11 completion state
17.2.12 linkage to transparency and audit trail
17.3 Erweiterte Proof Felder gehören nicht in den Core, sondern in Runtime oder Audit Layer.

18. MINIMALE MOVEMENT REGELN IM CORE
18.1 Der Core muss nur die Grenze von Movement enthalten.
18.2 Der Core muss festlegen:
18.2.1 Governance bleibt innen
18.2.2 Execution bleibt außen
18.2.3 Indirekte Ausführung ist nur über lawful handoff zulässig
18.2.4 capability spezifischer Handoff braucht Runtime Disclosure
18.2.5 ohne Disclosure sind nur Query, Revision, Escalation oder Block zulässig
18.3 Der Core enthält nur das minimale kanonische Proposal Object:
18.3.1 proposal_identity
18.3.2 proposal_kind
18.3.3 governed_intent
18.3.4 target_class
18.3.5 action_class
18.3.6 governance_status
18.3.7 payload
18.4 Detaillierte Registry, Versioning und Execution Bindings gehören nicht in den Core.

19. AUDIT MINDESTBINDUNG IM CORE
19.1 Der Core verlangt Auditierbarkeit.
19.2 Der Core verlangt mindestens:
19.2.1 cycle identity
19.2.2 final outcome
19.2.3 gate status
19.2.4 linkage to proof artifact
19.2.5 linkage to transparency state
19.3 Das ausführliche Logging Schema gehört nicht in den Core.

20. SAFE FALLBACK MINDESTREGEL IM CORE
20.1 Der Core muss festlegen, dass bei Verfassungsbruch, fehlendem lawful Status oder ungültiger Runtime Disclosure kein normaler Output erzeugt werden darf.
20.2 In solchen Fällen ist nur einer der folgenden Pfade zulässig:
20.2.1 narrow clarification
20.2.2 revision
20.2.3 escalation
20.2.4 block
20.3 Der Core definiert keinen vollständigen Safe Mode Betriebsplan.
20.4 Dieser gehört ins Backend.

21. KANONISCHE NAMENSREGELN IM CORE
21.1 Der Core muss festlegen, dass kanonische Namen verbindlich sind.
21.2 Namen dürfen nicht stillschweigend variiert werden.
21.3 Falsche historische Schreibweisen sind ungültig.
21.4 Verbindliche Namensbeispiele:
21.4.1 m-pathy
21.4.2 m-onitor
21.4.3 RAA
21.5 Aliasbildung ohne explizite Freigabe ist verboten.

22. WAS EXPLIZIT NICHT IN DEN CORE DARF
22.1 vollständige Agentenbiografien
22.2 lange Beschreibungen aller Judges
22.3 Registry Vollinhalte
22.4 Git Branch Strategien
22.5 Secret Management Details
22.6 Hash Handshake Details
22.7 Commit Message Regeln
22.8 konkrete Dateipfade der Runtime
22.9 ausführliche Artefakt Templates
22.10 API Anbieter spezifische Beschreibungen
22.11 vollständige C4 Audit Pipeline
22.12 Rollback Skripte
22.13 Monitor Log Schemas
22.14 umfangreiche Error Taxonomien
22.15 narrative Beispiele
22.16 historisches Material aus Gemini
22.17 operative Checklisten für das DEV Team
22.18 alles, was auch als Runtime Disclosure geladen werden kann

23. CORE DESIGN REGEL
23.1 Der Core ist Gesetz, nicht Datenlager.
23.2 Der Core ist Zwang, nicht Beschreibung.
23.3 Der Core ist klein, damit er stabil bleibt.
23.4 Der Core ist hart, damit Runtime Drift nicht gewinnen kann.
23.5 Der Core darf nur wachsen, wenn neue unverlagerbare Gesetzeslogik nachgewiesen ist.

24. ABNAHMEKRITERIEN FÜR DEN CORE
24.1 Der Core ist korrekt, wenn:
24.1.1 Room als Primärgate erzwingbar ist
24.1.2 Status vor Generation erzwingbar ist
24.1.3 vier Phasen vollständig bindend sind
24.1.4 Reasoning Contract Pflicht ist
24.1.5 Transparenzblock first position Pflicht ist
24.1.6 Movement nur als nachgeordnete Grenze vorkommt
24.1.7 keine Runtime Detailflut enthalten ist
24.1.8 kanonische Namen geschützt sind
24.2 Der Core ist falsch, wenn:
24.2.1 Runtime Details darin dominieren
24.2.2 Agentensimulation statt Gesetz enthalten ist
24.2.3 operative Infrastruktur den Kern aufbläht
24.2.4 Status fehlt
24.2.5 lawful Output Format fehlt
24.2.6 harte Grenzen zwischen innen und außen fehlen

25. ERGEBNIS DIESES TEILS
25.1 Das DEV Team hat nach Teil 2 verstanden:
25.1.1 was exakt in den Core gehört
25.1.2 was explizit nicht in den Core gehört
25.1.3 welche Gesetze der Core minimal enthalten muss
25.1.4 warum der Core klein und hart bleiben muss
25.1.5 nach welchen Kriterien jede spätere Core Änderung bewertet wird

README
M13 IMPLEMENTATION SPECIFICATION
TEIL 3/5
BACKEND ARCHITEKTUR, ROUTE.TS, REGISTRY, RUNTIME LOADING, AGENT FILES, MONITORING, AUDIT, SAFE MODE

1. ZWECK DIESES TEILS
1.1 Dieser Teil definiert die vollständige Backend Architektur für den ersten lauffähigen M13 Slice.
1.2 Das Backend ist keine kreative Instanz.
1.3 Das Backend ist keine Governance Instanz.
1.4 Das Backend ist eine kontrollierte Runtime Schicht.
1.5 Das Backend hat genau drei Aufgaben:
1.5.1 den Core stabil einbetten
1.5.2 passende Runtime Objekte selektiv laden
1.5.3 freigegebene Ergebnisse in Artefakte oder Handoffs überführen
1.6 Das Backend darf keine inhaltliche Wahrheit erzeugen.
1.7 Das Backend darf keine fehlende Form Logik kompensieren.

2. BACKEND HAUPTBAUTEILE
2.1 Für den ersten lauffähigen Slice werden genau diese Bauteile gebaut:
2.1.1 route.ts als Runtime Orchestrator
2.1.2 core prompt source als feste Kernquelle
2.1.3 registry loader
2.1.4 runtime selector
2.1.5 agent file loader
2.1.6 judge file loader
2.1.7 artifact profile loader
2.1.8 proposal object builder
2.1.9 audit writer
2.1.10 m-onitor integration
2.1.11 safe mode gate
2.1.12 optional execution binding
2.2 Weitere Bauteile sind für den ersten Slice nicht zulässig, wenn sie nicht explizit freigegeben wurden.

3. ROLLE VON ROUTE.TS
3.1 route.ts ist die zentrale Eintrittsstelle des Runtime Pfads.
3.2 route.ts ist nicht der Ort für semantische Kreativlogik.
3.3 route.ts ist nicht der Ort für unstrukturierte Sonderregeln.
3.4 route.ts ist der Ort für:
3.4.1 Request Entgegennahme
3.4.2 Session Kontext Vorbereitung
3.4.3 Core Einbettung
3.4.4 Runtime Disclosure Auswahl
3.4.5 LLM Aufruf
3.4.6 Transparenzprüfung
3.4.7 Ergebnisvalidierung
3.4.8 Proposal Generierung
3.4.9 Artefakt Rückgabe
3.4.10 Audit Übergabe
3.4.11 Safe Mode Rückfall
3.5 route.ts darf nur deterministische Backend Entscheidungen treffen.
3.6 Deterministische Backend Entscheidungen sind:
3.6.1 welche Dateien geladen werden
3.6.2 ob Registry Zustand gültig ist
3.6.3 ob Safe Mode aktiv werden muss
3.6.4 ob ein Proposal Object gebaut werden darf
3.6.5 welches Artefakt Profil angewandt wird
3.7 route.ts darf nicht entscheiden:
3.7.1 was inhaltlich wahr ist
3.7.2 welcher Kandidat inhaltlich der beste ist
3.7.3 welche Governance Ausnahme gelten soll
3.7.4 welche Richterentscheidung überstimmt wird

4. ZIELSTRUKTUR VON ROUTE.TS
4.1 route.ts muss in klar getrennte Zonen zerlegt werden.
4.2 Verbindliche Zonen:
4.2.1 input normalization
4.2.2 session state preparation
4.2.3 runtime selection
4.2.4 file loading
4.2.5 model payload assembly
4.2.6 model invocation
4.2.7 response parsing
4.2.8 transparency validation
4.2.9 release gate
4.2.10 movement gate
4.2.11 artifact shaping
4.2.12 audit handoff
4.2.13 safe mode fallback
4.3 Keine dieser Zonen darf semantisch mit einer anderen vermischt werden.
4.4 Jede Zone muss eine klar benannte Funktion oder klar begrenzte Codeeinheit erhalten.

5. INPUT NORMALIZATION
5.1 route.ts muss den User Input entgegennehmen und in eine stabile interne Request Form überführen.
5.2 Pflichtfelder der internen Request Form:
5.2.1 raw_user_input
5.2.2 session_id
5.2.3 prompt_counter
5.2.4 requested_artifact_type falls vorhanden
5.2.5 user_selected_mode falls vorhanden
5.2.6 conversation_context_ref falls vorhanden
5.2.7 runtime_request_flags falls vorhanden
5.3 Es dürfen keine stillschweigenden Felder erfunden werden.
5.4 Nicht vorhandene Felder müssen als nicht gesetzt behandelt werden.
5.5 Input Normalization darf den semantischen Gehalt des User Inputs nicht verändern.

6. SESSION STATE PREPARATION
6.1 route.ts muss einen minimalen Session State erzeugen.
6.2 Pflichtfelder:
6.2.1 session_id
6.2.2 prompt_counter
6.2.3 protocol_name
6.2.4 protocol_version
6.2.5 safe_mode_state
6.2.6 registry_state_ref
6.2.7 audit_trace_id
6.2.8 runtime_load_manifest
6.3 Session State ist operativ.
6.4 Session State ist keine Reasoning Quelle.
6.5 Session State darf keine implizite Governance Entscheidung tragen.

7. RUNTIME SELECTION
7.1 Vor jedem Model Aufruf muss route.ts selektiv bestimmen, welche Runtime Objekte für diese Anfrage geladen werden.
7.2 Selektives Laden ist Pflicht.
7.3 Vollständiges Laden aller Runtime Dateien ist verboten.
7.4 Runtime Selection basiert nur auf:
7.4.1 Request Typ
7.4.2 gewünschter Artefakttyp
7.4.3 Registry Disclosure
7.4.4 Safe Mode Status
7.4.5 explizit gesetzte Runtime Flags
7.5 Runtime Selection darf nicht auf freien Spekulationen basieren.
7.6 Das Ergebnis der Runtime Selection ist ein runtime_load_manifest.
7.7 Das runtime_load_manifest muss alle geladenen Objekte explizit benennen.

8. CORE PROMPT SOURCE
8.1 Der Core darf nicht inline an zufälligen Stellen in route.ts verteilt werden.
8.2 Der Core muss aus einer festen Quelle geladen werden.
8.3 Zulässige Formen:
8.3.1 separate core file
8.3.2 separate prompt module
8.3.3 versionierte prompt source
8.4 Der Core muss versionierbar und diffbar sein.
8.5 route.ts darf den Core nur referenzieren und einbetten.
8.6 route.ts darf den Core nicht pro Request umschreiben.
8.7 Nur klar definierte Placeholder Werte dürfen pro Request gefüllt werden.

9. REGISTRY
9.1 Die Registry ist die Single Source of Runtime Truth für externe Fähigkeiten und runtime relevante Objekte.
9.2 Die Registry ist kein Dekorationsdokument.
9.3 Die Registry ist nicht optional.
9.4 Ohne gültige Registry Disclosure darf kein capability spezifischer Movement Pfad geöffnet werden.
9.5 Die Registry muss als strukturierte Datei geführt werden.
9.6 Für den ersten Slice ist JSON zulässig und bevorzugt.
9.7 Die Registry muss mindestens diese Top Level Felder pro Eintrag tragen:
9.7.1 uid
9.7.2 type
9.7.3 path
9.7.4 runtime_class
9.7.5 governance_class
9.7.6 access
9.7.7 context_mode
9.7.8 depends_on
9.7.9 integrity_hash
9.7.10 is_active
9.8 Optionale Felder für spätere Nutzung:
9.8.1 handoff_cmd
9.8.2 cmd_signature_required
9.8.3 permissions
9.8.4 secret_ref_profile
9.8.5 artifact_scope
9.8.6 version_tag
9.8.7 failover_ref
9.9 Kein Registry Eintrag darf Felder außerhalb des Schemas stillschweigend verwenden.
9.10 Schema Drift ist ein Fehlerzustand.

10. REGISTRY EINTRAGSTYPEN
10.1 Für den ersten Slice sind genau diese type Werte zulässig:
10.1.1 agent
10.1.2 judge
10.1.3 artifact_profile
10.1.4 program_binding
10.1.5 monitor_rule
10.1.6 utility
10.1.7 runtime_policy
10.2 Weitere Typen dürfen erst nach expliziter Freigabe eingeführt werden.

11. REGISTRY GOVERNANCE CLASS
11.1 Jeder Registry Eintrag muss eine governance_class tragen.
11.2 Für den ersten Slice sind mindestens diese Werte zulässig:
11.2.1 reasoning_support
11.2.2 judgment_support
11.2.3 artifact_support
11.2.4 execution_support
11.2.5 monitoring_support
11.2.6 restricted
11.3 Restricted Einträge dürfen nur geladen werden, wenn ihr Pfad im runtime_load_manifest explizit freigegeben wurde.

12. REGISTRY ACCESS
12.1 Access ist operativ zu verstehen.
12.2 Zulässige Werte:
12.2.1 read_only
12.2.2 execute
12.2.3 write_restricted
12.3 write_restricted ist nur für RAA Pfade zulässig.
12.4 Normale Agenten oder Utility Pfade dürfen kein Schreibrecht auf die Registry tragen.

13. REGISTRY CONTEXT MODE
13.1 context_mode bestimmt, wie ein Objekt in den aktuellen Request gelangt.
13.2 Zulässige Werte für den ersten Slice:
13.2.1 none
13.2.2 merge
13.2.3 bounded
13.3 none bedeutet, dass der Eintrag nur operativ bekannt ist, aber nicht in den LLM Kontext geladen wird.
13.4 merge bedeutet, dass der Eintrag direkt als Runtime Disclosure geladen wird.
13.5 bounded bedeutet, dass nur ein definierter Teil des Eintrags geladen wird.
13.6 bounded ist zu bevorzugen, wenn Vollinhalte unnötig groß wären.

14. REGISTRY VALIDATION
14.1 Vor jedem Request mit Runtime Loading muss die Registry validiert werden.
14.2 Pflichtprüfungen:
14.2.1 gültiges JSON
14.2.2 Schema vollständig
14.2.3 alle required Felder vorhanden
14.2.4 keine doppelten uid Werte
14.2.5 keine inaktiven Einträge im runtime_load_manifest
14.2.6 alle referenzierten paths existieren
14.2.7 integrity_hash vorhanden
14.2.8 depends_on auflösbar
14.3 Fehlschlägt eine Pflichtprüfung, ist der Registry Zustand invalid.
14.4 Bei invalidem Registry Zustand darf kein normaler Movement Pfad ausgeführt werden.

15. RAA
15.1 RAA ist die einzige interne Schreibinstanz für Registry Änderungen.
15.2 RAA ist kein normaler Agent.
15.3 RAA ist eine Systeminstanz.
15.4 Der erste Slice muss RAA noch nicht vollautomatisch ausführen.
15.5 Der erste Slice muss aber die Architektur dafür vorbereiten.
15.6 Das bedeutet:
15.6.1 Registry Writes werden über einen exklusiven RAA Pfad vorgesehen
15.6.2 normale Runtime Pfade dürfen keine Registry Writes durchführen
15.6.3 jede künftige Registry Mutation muss auditierbar an RAA gebunden sein
15.7 Wenn noch kein echter RAA Write Flow existiert, bleibt die Registry im ersten Slice read only.

16. AGENT FILES
16.1 Agent Files sind Runtime Objekte.
16.2 Agent Files gehören nicht in den Core.
16.3 Agent Files werden selektiv geladen.
16.4 Agent Files dürfen keine freie Prosa enthalten, wenn strukturierte Felder möglich sind.
16.5 Verbindliche Mindestfelder:
16.5.1 uid
16.5.2 display_name
16.5.3 canonical_name
16.5.4 runtime_role
16.5.5 room_relation
16.5.6 form_relation
16.5.7 movement_relation
16.5.8 artifact_scope
16.5.9 loading_policy
16.5.10 instruction_payload
16.6 Agent Files dürfen nicht das Verfassungsgesetz wiederholen.
16.7 Agent Files dürfen nur ihre runtime spezifische Funktion beschreiben.
16.8 Kanonische Namen sind bindend.
16.9 Beispielhaft zulässige kanonische Namen:
16.9.1 m-pathy
16.9.2 m-onitor
16.9.3 m-room
16.9.4 m-synthesis
16.10 Historisch falsche Namen sind nicht zulässig.

17. JUDGE FILES
17.1 Judge Files sind eigene Runtime Objekte.
17.2 Judges werden nicht als freie Textidee behandelt.
17.3 Mindestfelder:
17.3.1 uid
17.3.2 canonical_name
17.3.3 core_mandate
17.3.4 veto_condition_class
17.3.5 release_condition_class
17.3.6 instruction_payload
17.4 Für den ersten Slice müssen mindestens drei Judge Files vorhanden sein:
17.4.1 m-real
17.4.2 m-policy
17.4.3 m-go
17.5 Judge Files dürfen keine Core Gesetze überschreiben.

18. ARTIFACT PROFILE FILES
18.1 Artifact Profile Files definieren, welches Artefakt erzeugt werden soll.
18.2 Artifact Profile Files gehören nicht in den Core.
18.3 Für den ersten Slice muss mindestens ein Artefakt Typ vollständig modelliert sein.
18.4 Bevorzugter Starttyp:
18.4.1 linkedin_comment
18.4.2 oder b2b_reply
18.5 Mindestfelder:
18.5.1 artifact_type
18.5.2 target_channel
18.5.3 output_constraints
18.5.4 style_constraints
18.5.5 forbidden_patterns
18.5.6 movement_requirement
18.5.7 program_binding_ref falls vorhanden
18.5.8 final_render_schema
18.6 Artifact Profile Files dürfen keine Governance Gesetze enthalten.
18.7 Sie definieren nur die Zielgestalt des Artefakts.

19. PROGRAM BINDING FILES
19.1 Program Binding Files beschreiben die optionale operative Kopplung an ein reales Programm oder Backend Modul.
19.2 Program Binding Files werden erst nach lawful Release relevant.
19.3 Mindestfelder:
19.3.1 binding_uid
19.3.2 trigger_type
19.3.3 executable_target
19.3.4 payload_schema
19.3.5 signature_required
19.3.6 dry_run_supported
19.3.7 response_schema
19.4 Für den ersten Slice darf dry_run der Standard sein.
19.5 Direkter Auto Post in externe Systeme ist für den ersten Slice nicht Pflicht.

20. MONITORING
20.1 m-onitor ist die zentrale Monitoring und Integritätsinstanz des Runtime Systems.
20.2 m-onitor ist kein Kreativagent.
20.3 m-onitor überwacht:
20.3.1 Registry Zustand
20.3.2 Runtime Loading
20.3.3 Transparenzvalidität
20.3.4 Release Gate Status
20.3.5 Audit Vollständigkeit
20.3.6 Safe Mode Trigger
20.4 m-onitor erzeugt keine inhaltliche Wahrheit.
20.5 m-onitor protokolliert operative Zustände.

21. MONITOR RULE FILES
21.1 Monitoring Regeln müssen als strukturierte Runtime Objekte abbildbar sein.
21.2 Mindestfelder:
21.2.1 rule_uid
21.2.2 trigger_condition
21.2.3 severity
21.2.4 action_on_trigger
21.2.5 audit_requirement
21.3 Beispielhafte Trigger:
21.3.1 invalid_registry_state
21.3.2 duplicate_transparency_block
21.3.3 missing_required_runtime_object
21.3.4 invalid_release_state
21.3.5 malformed_proposal_object

22. AUDIT WRITER
22.1 Jeder Request muss einen Audit Pfad haben.
22.2 Der Audit Writer ist ein Backend Modul.
22.3 Der Audit Writer speichert keine Secrets im Klartext.
22.4 Der Audit Writer muss mindestens schreiben:
22.4.1 audit_trace_id
22.4.2 session_id
22.4.3 prompt_counter
22.4.4 runtime_load_manifest
22.4.5 registry_validation_state
22.4.6 transparency_validation_state
22.4.7 release_gate_state
22.4.8 movement_gate_state
22.4.9 final_outcome
22.4.10 artifact_type falls vorhanden
22.4.11 proposal_identity falls vorhanden
22.4.12 safe_mode_state
22.5 Audit Einträge müssen maschinenlesbar sein.
22.6 Für den ersten Slice ist JSON Log bevorzugt.

23. SAFE MODE
23.1 Safe Mode ist ein operativer Minimalzustand.
23.2 Safe Mode wird aktiviert, wenn normale Runtime Bedingungen nicht mehr lawful erfüllt sind.
23.3 Pflichttrigger für Safe Mode:
23.3.1 invalid registry state
23.3.2 fehlender Core Prompt Source Zugriff
23.3.3 fehlende Pflicht Runtime Objekte
23.3.4 widersprüchlicher Transparenzzustand
23.3.5 unauflösbarer Movement Gate Fehler
23.4 Im Safe Mode darf kein normaler Execution Pfad ausgelöst werden.
23.5 Im Safe Mode sind nur diese Ergebnisse zulässig:
23.5.1 narrow clarification
23.5.2 revision notice
23.5.3 escalation notice
23.5.4 block notice
23.6 Safe Mode muss im Audit sichtbar sein.

24. MOVEMENT GATE
24.1 Nach der LLM Antwort muss route.ts entscheiden, ob Movement überhaupt geöffnet werden darf.
24.2 Movement Gate darf nur geöffnet werden, wenn:
24.2.1 Transparenzblock gültig ist
24.2.2 Release lawful ist
24.2.3 Proposal Bedarf gegeben ist
24.2.4 benötigte Registry Disclosure vorhanden ist
24.2.5 Artefakt Profil konsistent ist
24.3 Fehlt eine Bedingung, bleibt Movement geschlossen.
24.4 Geschlossenes Movement führt nicht zu stillschweigender Teil Ausführung.

25. RESPONSE PARSING
25.1 Die Model Antwort muss streng geparst werden.
25.2 Pflichtkomponenten:
25.2.1 Transparenzblock
25.2.2 Content Bereich
25.2.3 optionaler Proposal Bereich
25.2.4 optionaler Artifact Bereich
25.3 Fehlende Pflichtkomponenten führen zu Invalidität oder Safe Mode je nach Regel.
25.4 Der Parser darf keine interpretativen Lücken durch freie Heuristik füllen, wenn harte Strukturen erwartet werden.

26. TRANSPARENZVALIDIERUNG
26.1 Es muss genau ein Transparenzblock vorhanden sein.
26.2 Der Transparenzblock muss an erster Stelle stehen.
26.3 Der Transparenzblock muss alle zehn Felder tragen.
26.4 Die Feldreihenfolge muss stimmen.
26.5 Das Mode Feld muss kanonisch serialisiert sein.
26.6 Bei Fehler ist der Release Zustand ungültig.
26.7 Ungültige Transparenz darf nicht durch das Backend still repariert werden.

27. ARTIFACT SHAPING
27.1 Nach lawful Release und optional geöffnetem Movement wird das finale Artefakt geformt.
27.2 Artifact Shaping ist ein Backend Schritt.
27.3 Artifact Shaping darf den semantischen Kern nicht verändern.
27.4 Artifact Shaping darf nur:
27.4.1 finale Struktur anwenden
27.4.2 Kanalfelder ergänzen
27.4.3 Antwortschema normalisieren
27.4.4 Rendering für UI oder API vorbereiten
27.5 Inhaltliche Umschreibung im Backend ist verboten.

28. DATEIORDNER FÜR DEN ERSTEN SLICE
28.1 Zielstruktur für das DEV Team:
28.1.1 /core
28.1.2 /runtime/registry
28.1.3 /runtime/agents
28.1.4 /runtime/judges
28.1.5 /runtime/artifacts
28.1.6 /runtime/program-bindings
28.1.7 /runtime/monitor-rules
28.1.8 /runtime/policies
28.1.9 /audit
28.1.10 /safe-mode
28.1.11 /app/api/chat oder bestehender route Pfad
28.2 Abweichungen von der Struktur sind nur erlaubt, wenn die Trennung logisch identisch bleibt.

29. HARTE BACKEND INVARIANTEN
29.1 route.ts lädt selektiv
29.2 route.ts schreibt keine Registry direkt
29.3 Registry ist Runtime Truth
29.4 RAA ist exklusive Write Instanz
29.5 Agenten und Judges sind Runtime Files
29.6 m-onitor überwacht operative Zustände
29.7 Audit ist für jeden Request verpflichtend
29.8 Safe Mode blockiert normale Execution
29.9 Backend ersetzt keine Governance
29.10 Backend verändert keine inhaltliche Wahrheit

30. ERGEBNIS DIESES TEILS
30.1 Das DEV Team hat nach Teil 3 verstanden:
30.1.1 welche Backend Module gebaut werden
30.1.2 welche Rolle route.ts exakt hat
30.1.3 wie Registry, Agent Files und Judge Files strukturiert werden
30.1.4 wie Monitoring und Audit eingebunden werden
30.1.5 wann Safe Mode greift
30.1.6 welche harten Grenzen das Backend nicht überschreiten darf

README
M13 IMPLEMENTATION SPECIFICATION
TEIL 4/5
END TO END ZYKLUS, DECISION GATES, PROPOSAL OBJECT, PROGRAMMTRIGGER, ARTEFAKT RÜCKGABE

1. ZWECK DIESES TEILS
1.1 Dieser Teil definiert den vollständigen End to End Ablauf des ersten funktionierenden M13 Slice.
1.2 Ziel ist ein real ausführbarer Gesamtzyklus.
1.3 Der Gesamtzyklus beginnt beim User Input und endet bei einem freigegebenen Artefakt oder einem lawful Block.
1.4 Jeder Zwischenzustand muss klar definiert, prüfbar und auditierbar sein.
1.5 Keine Phase dieses Zyklus darf implizit bleiben.

2. ZYKLUS GESAMTÜBERSICHT
2.1 Der erste Slice folgt exakt dieser Kette:
2.1.1 User Input Intake
2.1.2 Input Normalization
2.1.3 Session State Preparation
2.1.4 Registry Validation
2.1.5 Runtime Selection
2.1.6 Runtime Loading
2.1.7 Core Payload Assembly
2.1.8 Model Invocation
2.1.9 Response Parsing
2.1.10 Transparency Validation
2.1.11 Release Gate
2.1.12 Movement Gate
2.1.13 Proposal Object Build falls erforderlich
2.1.14 Artifact Shaping
2.1.15 optional Program Trigger
2.1.16 Audit Write
2.1.17 User Return
2.2 Diese Reihenfolge ist bindend.
2.3 Keine Stufe darf übersprungen werden.
2.4 Keine spätere Stufe darf eine frühere Stufe implizit heilen.

3. STUFE 1 USER INPUT INTAKE
3.1 Das System nimmt einen User Input entgegen.
3.2 Der Input ist die einzige zulässige Quelle des inhaltlichen Startsignals.
3.3 Der Input darf ergänzt, aber nicht semantisch uminterpretiert werden.
3.4 Bereits in dieser Stufe muss erkennbar gemacht werden, ob ein Artefakt gewünscht ist.
3.5 Für den ersten Slice ist mindestens ein expliziter Artefaktfall zu unterstützen.
3.6 Bevorzugter Anfangsfall:
3.6.1 linkedin_comment
3.6.2 oder b2b_reply

4. STUFE 2 INPUT NORMALIZATION
4.1 Der rohe Input wird in das interne Request Schema überführt.
4.2 Das Ergebnis ist ein normalisiertes Request Objekt.
4.3 Pflichtbestandteile:
4.3.1 raw_user_input
4.3.2 normalized_user_input
4.3.3 session_id
4.3.4 prompt_counter
4.3.5 requested_artifact_type falls vorhanden
4.3.6 user_selected_mode falls vorhanden
4.3.7 execution_intent falls vorhanden
4.4 Input Normalization darf keine Inhalte hinzufügen, die der User nicht angelegt hat.
4.5 Input Normalization darf nur formale Vereinheitlichung vornehmen.

5. STUFE 3 SESSION STATE PREPARATION
5.1 Es wird ein Session State aufgebaut.
5.2 Der Session State ist ausschließlich operativ.
5.3 Pflichtfelder:
5.3.1 session_id
5.3.2 prompt_counter
5.3.3 protocol_name
5.3.4 protocol_version
5.3.5 safe_mode_state
5.3.6 audit_trace_id
5.3.7 runtime_load_manifest initial leer
5.3.8 movement_gate_state initial geschlossen
5.3.9 release_gate_state initial ungeprüft
5.4 Der Session State darf keine inhaltlichen Entscheide vorwegnehmen.

6. STUFE 4 REGISTRY VALIDATION
6.1 Vor jedem Runtime Zugriff wird die Registry validiert.
6.2 Pflichtprüfungen:
6.2.1 Datei erreichbar
6.2.2 JSON gültig
6.2.3 Schema gültig
6.2.4 required fields vorhanden
6.2.5 duplicate uid nicht vorhanden
6.2.6 referenzierte Dateien existent
6.2.7 inaktive Einträge nicht selektiert
6.2.8 depends_on auflösbar
6.3 Ergebnis ist genau einer von drei Zuständen:
6.3.1 valid
6.3.2 restricted
6.3.3 invalid
6.4 valid erlaubt normalen Runtime Pfad.
6.5 restricted erlaubt nur den Teilpfad, der mit den sichtbaren Runtime Objekten lawful möglich ist.
6.6 invalid öffnet Safe Mode und blockiert normalen Movement Pfad.

7. STUFE 5 RUNTIME SELECTION
7.1 Das Backend bestimmt exakt, welche Runtime Objekte für diese Anfrage geladen werden.
7.2 Selektionsbasis:
7.2.1 requested_artifact_type
7.2.2 Registry Disclosure
7.2.3 Safe Mode Status
7.2.4 Request Flags
7.2.5 notwendige Judge Unterstützung
7.2.6 notwendige Agent Unterstützung
7.3 Ergebnis ist ein runtime_load_manifest.
7.4 Das Manifest benennt:
7.4.1 geladene Agent Files
7.4.2 geladene Judge Files
7.4.3 geladene Artifact Profile Files
7.4.4 geladene Program Binding Files falls vorhanden
7.4.5 geladene Monitor Rules falls vorhanden
7.5 Keine Datei außerhalb des Manifests darf implizit in den Request gelangen.

8. STUFE 6 RUNTIME LOADING
8.1 Alle im Manifest enthaltenen Runtime Objekte werden geladen.
8.2 Die Ladung erfolgt strukturiert.
8.3 Die Ladung erfolgt selektiv.
8.4 Die Ladung erfolgt in einem reproduzierbaren Ordnungsprinzip.
8.5 Empfohlene Ladeordnung:
8.5.1 Artifact Profile
8.5.2 Judges
8.5.3 Agents
8.5.4 Program Binding
8.5.5 Monitor Rules
8.6 Fehlende Pflichtobjekte führen zu:
8.6.1 restricted mode
8.6.2 oder safe mode
8.6.3 oder block
8.7 Laufzeitobjekte dürfen nicht ungeprüft als Wahrheit behandelt werden, wenn ihre Registry Disclosure fehlt.

9. STUFE 7 CORE PAYLOAD ASSEMBLY
9.1 Jetzt wird der eigentliche Model Payload gebaut.
9.2 Der Payload besteht aus:
9.2.1 Core
9.2.2 normalisiertem User Input
9.2.3 notwendigen Session Feldern
9.2.4 geladenen Runtime Objekten in kontrollierter Form
9.2.5 eventuell nötigen Artefakt Constraints
9.3 Der Payload darf keine unnötigen Runtime Volumina enthalten.
9.4 Es ist zu bevorzugen, nur bounded Inhalte zu injizieren, wenn Vollinhalte nicht nötig sind.
9.5 Der Payload muss den Core dominant halten.
9.6 Runtime Disclosure ergänzt nur, sie ersetzt keine Kernregel.

10. STUFE 8 MODEL INVOCATION
10.1 Das Modell wird genau einmal mit dem gebauten Payload aufgerufen.
10.2 Das Modell hat folgende Mindestaufgaben:
10.2.1 Room bestimmen
10.2.2 Status bestimmen
10.2.3 Form vollständig durchlaufen
10.2.4 lawful Outcome erzeugen
10.2.5 Transparenzblock zuerst ausgeben
10.2.6 optional Proposal Bereich erzeugen
10.2.7 optional Artefaktbereich erzeugen
10.3 Das Backend darf keinen zweiten Modellaufruf als stilles Reparaturmittel verwenden, solange dies nicht explizit als Regel freigegeben wurde.
10.4 Der erste Slice arbeitet bevorzugt mit einem Aufruf pro Request.

11. STUFE 9 RESPONSE PARSING
11.1 Die Modellantwort wird streng geparst.
11.2 Erwartete Bereiche:
11.2.1 Transparenzblock
11.2.2 Hauptcontent
11.2.3 Proposal Bereich falls vorhanden
11.2.4 Artifact Bereich falls vorhanden
11.3 Das Parsen erfolgt anhand harter Marker oder harter Strukturregeln.
11.4 Freie Interpretation des Parsers ist zu minimieren.
11.5 Fehlende Pflichtsegmente führen zu invalidem Release oder Safe Mode.

12. STUFE 10 TRANSPARENCY VALIDATION
12.1 Der Transparenzblock wird getrennt validiert.
12.2 Pflichtprüfungen:
12.2.1 genau ein Block vorhanden
12.2.2 Block steht an erster Stelle
12.2.3 10 Felder vorhanden
12.2.4 Feldreihenfolge korrekt
12.2.5 Werte explizit gesetzt
12.2.6 Mode Feld kanonisch serialisiert
12.3 Ergebnis ist einer von drei Zuständen:
12.3.1 valid
12.3.2 invalid
12.3.3 contradictory
12.4 invalid und contradictory machen den Release Zustand ungültig.
12.5 Das Backend darf diesen Zustand nicht still reparieren.

13. STUFE 11 RELEASE GATE
13.1 Nach erfolgreichem Parsing und erfolgreicher Transparenzprüfung wird der Release Gate Zustand bestimmt.
13.2 Release Gate darf nur geöffnet werden, wenn:
13.2.1 Transparenzblock valid ist
13.2.2 Hauptcontent vorhanden ist
13.2.3 kein Safe Mode Trigger aktiv ist
13.2.4 kein harter Registry Konflikt besteht
13.2.5 kein struktureller Antwortfehler besteht
13.3 Release Gate Zustände:
13.3.1 open
13.3.2 closed
13.3.3 restricted
13.4 open erlaubt Artefaktbildung.
13.5 restricted erlaubt nur begrenzte Ergebnisformen.
13.6 closed beendet normale Freigabe und führt zu Safe Mode Antwort oder Block.

14. STUFE 12 MOVEMENT GATE
14.1 Movement Gate ist von Release Gate getrennt.
14.2 Ein offener Release Zustand öffnet Movement nicht automatisch.
14.3 Movement Gate darf nur geöffnet werden, wenn:
14.3.1 Release Gate open ist
14.3.2 Proposal Bedarf vorliegt
14.3.3 Registry Disclosure für den Zielpfad vorhanden ist
14.3.4 erforderliches Artifact Profile vorhanden ist
14.3.5 Program Binding falls nötig vorhanden und gültig ist
14.4 Movement Gate Zustände:
14.4.1 open
14.4.2 closed
14.4.3 dry_run_only
14.5 dry_run_only ist für den ersten Slice der bevorzugte operative Zustand.
14.6 closed bedeutet, dass kein Program Trigger erfolgt.
14.7 closed darf aber trotzdem die Rückgabe eines freigegebenen Artefakts erlauben.

15. DECISION GATE TRENNUNG
15.1 Release Gate beantwortet nur:
15.1.1 Darf ein Ergebnis als lawful freigegeben gelten
15.2 Movement Gate beantwortet nur:
15.2.1 Darf auf Basis des freigegebenen Ergebnisses ein operativer Handoff stattfinden
15.3 Diese beiden Gates dürfen niemals verschmolzen werden.
15.4 Ein freigegebenes Artefakt ist möglich, obwohl Movement geschlossen bleibt.
15.5 Ein geöffnetes Movement ohne lawful Release ist verboten.

16. STUFE 13 PROPOSAL OBJECT BUILD
16.1 Wenn Movement Bedarf vorliegt und Movement Gate nicht closed ist, wird ein Proposal Object gebaut.
16.2 Das Proposal Object ist die einzige zulässige Backend Schnittstelle für nachgelagerte operative Ausführung.
16.3 Mindestfelder:
16.3.1 proposal_identity
16.3.2 proposal_kind
16.3.3 governed_intent
16.3.4 target_class
16.3.5 action_class
16.3.6 governance_status
16.3.7 payload
16.4 proposal_identity muss eindeutig sein.
16.5 proposal_kind zulässige Werte im ersten Slice:
16.5.1 query
16.5.2 action
16.5.3 coordination
16.5.4 restriction
16.6 governance_status zulässige Werte im ersten Slice:
16.6.1 released
16.6.2 released_dry_run
16.6.3 blocked
16.6.4 restricted
16.7 payload muss dem Program Binding Schema entsprechen, falls Program Binding genutzt wird.
16.8 Kein anderer freier Befehlstext darf an die Stelle des Proposal Object treten.

17. STUFE 14 ARTIFACT SHAPING
17.1 Artifact Shaping formt das endgültige Artefakt für Rückgabe und optionale operative Nutzung.
17.2 Artifact Shaping basiert auf:
17.2.1 Hauptcontent
17.2.2 Artifact Bereich falls vorhanden
17.2.3 Artifact Profile
17.2.4 final_render_schema
17.3 Artifact Shaping darf keine neue Semantik erzeugen.
17.4 Artifact Shaping darf nur:
17.4.1 Struktur anwenden
17.4.2 Formatgrenzen prüfen
17.4.3 Kanal geeignete Felder setzen
17.4.4 finale Rückgabeform bauen
17.5 Für linkedin_comment muss das finale Artefakt mindestens enthalten:
17.5.1 artifact_type
17.5.2 channel
17.5.3 approved_text
17.5.4 governance_state
17.5.5 dry_run_state
17.5.6 audit_trace_id

18. STUFE 15 OPTIONALER PROGRAM TRIGGER
18.1 Ein Program Trigger ist für den ersten Slice optional.
18.2 Wenn ein Program Trigger existiert, dann nur unter folgenden Bedingungen:
18.2.1 Movement Gate ist open oder dry_run_only
18.2.2 Proposal Object ist gültig
18.2.3 passendes Program Binding ist geladen
18.2.4 payload erfüllt response_schema Anforderungen
18.3 Für den ersten Slice ist dry_run_only zu bevorzugen.
18.4 Das bedeutet:
18.4.1 Program Trigger simuliert den operativen Aufruf
18.4.2 das Ergebnis wird protokolliert
18.4.3 keine irreversible externe Aktion findet statt
18.5 Echte externe API Ausführung ist erst für spätere Phasen zu aktivieren.

19. STUFE 16 AUDIT WRITE
19.1 Nach Bestimmung des finalen Pfades muss ein Audit Eintrag geschrieben werden.
19.2 Der Audit Eintrag ist verpflichtend, unabhängig davon, ob Release, Restriction oder Block vorliegt.
19.3 Pflichtinhalte:
19.3.1 audit_trace_id
19.3.2 session_id
19.3.3 prompt_counter
19.3.4 registry_validation_state
19.3.5 runtime_load_manifest
19.3.6 transparency_validation_state
19.3.7 release_gate_state
19.3.8 movement_gate_state
19.3.9 final_outcome
19.3.10 proposal_identity falls vorhanden
19.3.11 artifact_type falls vorhanden
19.3.12 safe_mode_state
19.4 Audit ist der letzte Pflichtschritt vor User Return.

20. STUFE 17 USER RETURN
20.1 Der User erhält genau das Ergebnis, das durch den finalen Pfad lawful entstanden ist.
20.2 Mögliche Rückgabetypen im ersten Slice:
20.2.1 released artifact
20.2.2 released artifact with dry_run metadata
20.2.3 restricted artifact
20.2.4 revision notice
20.2.5 escalation notice
20.2.6 block notice
20.3 Keine Rückgabe darf eine erfolgreichere Lage vortäuschen, als tatsächlich vorliegt.
20.4 dry_run_only muss für den User klar sichtbar sein.
20.5 blocked muss für den User klar sichtbar sein.

21. ERSTER KOMMERZIELLER ZIELPFAD
21.1 Der erste kommerzielle Zielpfad ist nicht die volle externe Automatisierung.
21.2 Der erste kommerzielle Zielpfad ist ein freigegebenes, hochwertiges, auditierbares Artefakt.
21.3 Bevorzugte erste Artefaktklasse:
21.3.1 linkedin_comment
21.3.2 oder b2b_reply
21.4 Der Wert des Systems liegt im ersten Schritt in:
21.4.1 Governance
21.4.2 Qualität
21.4.3 Auditierbarkeit
21.4.4 Wiederverwendbarkeit
21.4.5 operativer Anschlussfähigkeit
21.5 Erst danach folgt echte Action Automation.

22. FEHLERPFAD LOGIK
22.1 Jeder Fehlerpfad muss deterministisch in genau einen Endzustand führen.
22.2 Zulässige Endzustände:
22.2.1 released
22.2.2 released_dry_run
22.2.3 restricted
22.2.4 revision
22.2.5 escalation
22.2.6 block
22.3 Keine unbestimmten Zwischenzustände dürfen an den User weitergegeben werden.

23. SAFE MODE END TO END
23.1 Safe Mode kann an jeder Stufe greifen, sobald ein harter Regelbruch erkannt wird.
23.2 Im Safe Mode sind normale Release und normale Movement Pfade beendet.
23.3 Safe Mode darf nur ausgeben:
23.3.1 narrow clarification
23.3.2 revision notice
23.3.3 escalation notice
23.3.4 block notice
23.4 Safe Mode ist nicht still.
23.5 Safe Mode muss im Audit und in der Rückgabe kenntlich sein.

24. MINIMALE ERFOLGSDEFINITION DES ERSTEN SLICE
24.1 Der erste Slice ist erfolgreich, wenn folgende Kette vollständig funktioniert:
24.1.1 User fordert linkedin_comment oder b2b_reply an
24.1.2 Input wird normalisiert
24.1.3 Registry wird validiert
24.1.4 passende Runtime Objekte werden geladen
24.1.5 Core Payload wird gebaut
24.1.6 Modell erzeugt validen Transparenzblock und freigegebenen Content
24.1.7 Release Gate öffnet sich lawful
24.1.8 Artifact Shaping erzeugt ein nutzbares Artefakt
24.1.9 Movement bleibt optional dry_run_only
24.1.10 Audit wird geschrieben
24.1.11 User erhält das freigegebene Artefakt
24.2 Alles darüber hinaus ist nicht Teil des Minimalerfolgs.

25. HARTE INVARIANTEN DIESES ZYKLUS
25.1 Kein Movement ohne eigenes Gate
25.2 Kein Gate Healing durch spätere Stufen
25.3 Kein Proposal Object ohne lawful Release Basis
25.4 Kein Program Trigger ohne Binding
25.5 Kein Artifact Shaping ohne freigegebenen Content
25.6 Kein Audit Ausfall
25.7 Kein stilles Umschreiben des Inhalts im Backend
25.8 Kein Vortäuschen echter Ausführung im dry_run_only Zustand
25.9 Kein normaler Output im Safe Mode
25.10 Kein Abschluss ohne klaren Endzustand

26. ERGEBNIS DIESES TEILS
26.1 Das DEV Team hat nach Teil 4 verstanden:
26.1.1 wie der Gesamtzyklus exakt abläuft
26.1.2 welche Stufen bindend sind
26.1.3 wie Release Gate und Movement Gate getrennt funktionieren
26.1.4 wie Proposal Object, Program Trigger und Artifact Return zusammenhängen
26.1.5 wie der erste kommerzielle Zielpfad operationalisiert wird
26.1.6 woran der erste vollständige Slice als erfolgreich gemessen wird

README
M13 IMPLEMENTATION SPECIFICATION
TEIL 5/5
UMSETZUNGSPLAN FÜR DEV, DATEILISTE, REIHENFOLGE, HARTE INVARIANTEN, ABNAHMEKRITERIEN

1. ZWECK DIESES TEILS
1.1 Dieser Teil definiert die konkrete Umsetzungsreihenfolge.
1.2 Das DEV Team setzt nicht parallel, sondern in fester Folge um.
1.3 Jeder Schritt baut auf dem vorherigen auf.
1.4 Kein Schritt darf übersprungen werden.
1.5 Kein späterer Schritt darf begonnen werden, wenn der vorherige nicht technisch und logisch stabil ist.

2. UMSETZUNGSPRINZIP
2.1 Es wird genau ein vertikaler Slice gebaut.
2.2 Dieser Slice muss vom Input bis zum Artefakt vollständig funktionieren.
2.3 Das DEV Team baut zuerst nicht Breite, sondern Tiefe.
2.4 Das DEV Team baut zuerst nicht schöne Infrastruktur, sondern eine vollständige Kette.
2.5 Die vollständige Kette lautet:
2.5.1 Core
2.5.2 route.ts
2.5.3 Registry
2.5.4 Runtime Files
2.5.5 Parser und Gates
2.5.6 Artifact Shaping
2.5.7 Audit
2.5.8 optional dry run trigger

3. PHASENMODELL
3.1 Die Umsetzung erfolgt in 10 festen Phasen.
3.2 Phase 1: Core Finalisierung
3.3 Phase 2: Dateistruktur anlegen
3.4 Phase 3: Registry anlegen
3.5 Phase 4: Runtime Files anlegen
3.6 Phase 5: route.ts strukturieren
3.7 Phase 6: Parser und Transparenzvalidierung bauen
3.8 Phase 7: Release Gate und Movement Gate bauen
3.9 Phase 8: Artifact Profile und Artifact Shaping bauen
3.10 Phase 9: Audit und m-onitor Pfad bauen
3.11 Phase 10: End to End Test mit dry run

4. PHASE 1 CORE FINALISIERUNG
4.1 Es wird genau eine versionierte Core Quelle angelegt.
4.2 Zulässige Pfade:
4.2.1 /core/m13-core.txt
4.2.2 oder /core/m13-core.ts
4.3 Der Core muss exakt die in Teil 2 definierte Logik enthalten.
4.4 Der Core darf keine Runtime Inhalte enthalten.
4.5 Der Core muss diffbar, versionierbar und separat testbar sein.
4.6 Abnahmekriterium:
4.6.1 Core enthält nur Gesetz
4.6.2 Core enthält keine Registry Inhalte
4.6.3 Core enthält keine Agentenbiografien
4.6.4 Core enthält harte Room Form Movement Dominanz
4.6.5 Core enthält Status vor Generation

5. PHASE 2 DATEISTRUKTUR ANLEGEN
5.1 Folgende Verzeichnisse sind anzulegen:
5.1.1 /core
5.1.2 /runtime/registry
5.1.3 /runtime/agents
5.1.4 /runtime/judges
5.1.5 /runtime/artifacts
5.1.6 /runtime/program-bindings
5.1.7 /runtime/monitor-rules
5.1.8 /runtime/policies
5.1.9 /audit
5.1.10 /safe-mode
5.1.11 /lib/runtime
5.1.12 /lib/audit
5.1.13 /lib/parsing
5.1.14 /lib/gates
5.1.15 /lib/artifacts
5.2 Dateistruktur darf nicht beliebig sein.
5.3 Trennung von Core, Runtime, Audit und Logikmodulen ist Pflicht.
5.4 Abnahmekriterium:
5.4.1 alle Verzeichnisse vorhanden
5.4.2 logische Trennung sichtbar
5.4.3 kein Mischverzeichnis für alles

6. PHASE 3 REGISTRY ANLEGEN
6.1 Es wird genau eine Registry Datei für den ersten Slice angelegt.
6.2 Bevorzugter Pfad:
6.2.1 /runtime/registry/registry.json
6.3 Die Registry enthält nur Einträge, die für den ersten Slice wirklich gebraucht werden.
6.4 Pflichtobjekte in der Registry:
6.4.1 mindestens ein artifact_profile
6.4.2 mindestens drei judges
6.4.3 mindestens benötigte agents
6.4.4 mindestens ein monitor_rule Satz
6.4.5 optional ein program_binding für dry run
6.5 Pflichtfelder je Eintrag:
6.5.1 uid
6.5.2 type
6.5.3 path
6.5.4 runtime_class
6.5.5 governance_class
6.5.6 access
6.5.7 context_mode
6.5.8 depends_on
6.5.9 integrity_hash
6.5.10 is_active
6.6 Abnahmekriterium:
6.6.1 Registry validiert gegen Schema
6.6.2 keine duplicate uid
6.6.3 alle paths existieren
6.6.4 nur aktive Einträge für Slice vorhanden

7. PHASE 4 RUNTIME FILES ANLEGEN
7.1 Es werden nur die Runtime Files angelegt, die für den ersten Slice notwendig sind.
7.2 Mindestmenge Agent Files:
7.2.1 m-room
7.2.2 m-pathy
7.2.3 m-synthesis falls benötigt
7.2.4 m-onitor
7.3 Mindestmenge Judge Files:
7.3.1 m-real
7.3.2 m-policy
7.3.3 m-go
7.4 Mindestmenge Artifact Profiles:
7.4.1 linkedin_comment oder
7.4.2 b2b_reply
7.5 Optionales Program Binding:
7.5.1 dry_run_comment_binding.json
7.6 Pflicht je Runtime File:
7.6.1 strukturierte Felder
7.6.2 keine freie Erzähllogik
7.6.3 keine Core Wiederholung
7.7 Abnahmekriterium:
7.7.1 alle Registry Referenzen sind auflösbar
7.7.2 alle Runtime Files laden fehlerfrei
7.7.3 kanonische Namen stimmen exakt

8. PHASE 5 ROUTE.TS STRUKTURIEREN
8.1 Die bestehende route.ts wird nicht weiter aufgeblasen.
8.2 Sie wird in klar getrennte Funktionsblöcke oder Hilfsmodule zerlegt.
8.3 Verbindliche Backend Zonen:
8.3.1 input normalization
8.3.2 session state preparation
8.3.3 registry validation
8.3.4 runtime selection
8.3.5 runtime loading
8.3.6 payload assembly
8.3.7 model invocation
8.3.8 response parsing
8.3.9 transparency validation
8.3.10 release gate
8.3.11 movement gate
8.3.12 artifact shaping
8.3.13 audit write
8.3.14 safe mode fallback
8.4 Bevorzugt werden Hilfsmodule in /lib.
8.5 route.ts bleibt Orchestrator, nicht Sammelhalde.
8.6 Abnahmekriterium:
8.6.1 Zonen klar getrennt
8.6.2 keine semantische Mischlogik
8.6.3 keine Registry Writes
8.6.4 kein inhaltliches Umschreiben im Backend

9. PHASE 6 PARSER UND TRANSPARENZVALIDIERUNG BAUEN
9.1 Es wird ein harter Parser gebaut.
9.2 Es wird eine harte Transparenzvalidierung gebaut.
9.3 Parser Pflichtausgabe:
9.3.1 transparency_block
9.3.2 content_block
9.3.3 proposal_block optional
9.3.4 artifact_block optional
9.4 Transparenzprüfung Pflicht:
9.4.1 erster Block
9.4.2 genau ein Block
9.4.3 10 Felder
9.4.4 feste Reihenfolge
9.4.5 kanonische Mode Serialisierung
9.5 Abnahmekriterium:
9.5.1 gültige Antworten werden korrekt erkannt
9.5.2 ungültige Transparenz wird sicher abgewiesen
9.5.3 keine stille Reparatur

10. PHASE 7 RELEASE GATE UND MOVEMENT GATE BAUEN
10.1 Es werden zwei getrennte Gates gebaut.
10.2 Release Gate entscheidet nur über Freigabefähigkeit.
10.3 Movement Gate entscheidet nur über operativen Handoff.
10.4 Kein Gate darf das andere ersetzen.
10.5 Zustände Release Gate:
10.5.1 open
10.5.2 restricted
10.5.3 closed
10.6 Zustände Movement Gate:
10.6.1 open
10.6.2 dry_run_only
10.6.3 closed
10.7 Abnahmekriterium:
10.7.1 freigegebenes Artefakt ohne Movement möglich
10.7.2 Movement ohne Release unmöglich
10.7.3 dry run korrekt getrennt

11. PHASE 8 ARTIFACT PROFILE UND ARTIFACT SHAPING BAUEN
11.1 Es wird genau ein Start Artefakt vollständig umgesetzt.
11.2 Bevorzugter Start:
11.2.1 linkedin_comment
11.2.2 alternativ b2b_reply
11.3 Ein Artifact Profile File definiert die Zielgestalt.
11.4 Ein Artifact Shaping Modul baut die finale Rückgabeform.
11.5 Mindestfelder des finalen Artefakts:
11.5.1 artifact_type
11.5.2 channel
11.5.3 approved_text
11.5.4 governance_state
11.5.5 dry_run_state
11.5.6 audit_trace_id
11.6 Abnahmekriterium:
11.6.1 Artefakt ist nutzbar
11.6.2 Artefakt ist auditierbar
11.6.3 Artefakt wird nicht im Backend umgeschrieben

12. PHASE 9 AUDIT UND M-ONITOR PFAD BAUEN
12.1 Es wird ein Audit Writer gebaut.
12.2 Es wird m-onitor als operative Kontrollinstanz eingebunden.
12.3 Pflichtlogdaten:
12.3.1 audit_trace_id
12.3.2 session_id
12.3.3 prompt_counter
12.3.4 registry_validation_state
12.3.5 runtime_load_manifest
12.3.6 transparency_validation_state
12.3.7 release_gate_state
12.3.8 movement_gate_state
12.3.9 final_outcome
12.3.10 artifact_type falls vorhanden
12.3.11 proposal_identity falls vorhanden
12.3.12 safe_mode_state
12.4 m-onitor prüft operative Konsistenz.
12.5 Abnahmekriterium:
12.5.1 jeder Request erzeugt Audit
12.5.2 Safe Mode ist sichtbar
12.5.3 fehlende Audit Daten sind Fehler

13. PHASE 10 END TO END TEST MIT DRY RUN
13.1 Jetzt wird der Gesamtzyklus getestet.
13.2 Pflicht Testfall:
13.2.1 User fordert linkedin_comment oder b2b_reply an
13.2.2 Registry ist gültig
13.2.3 Runtime Files werden geladen
13.2.4 Modell erzeugt validen Transparenzblock
13.2.5 Release Gate öffnet
13.2.6 Artifact Shaping liefert Artefakt
13.2.7 Movement Gate steht auf dry_run_only oder closed
13.2.8 Audit wird geschrieben
13.2.9 User erhält freigegebenes Artefakt
13.3 Negativtest Pflicht:
13.3.1 invalide Registry
13.3.2 ungültiger Transparenzblock
13.3.3 fehlendes Runtime Objekt
13.3.4 geschlossenes Release Gate
13.4 Abnahmekriterium:
13.4.1 Normalpfad funktioniert
13.4.2 Fehlerpfade blocken korrekt
13.4.3 kein stilles Durchrutschen

14. DATEILISTE FÜR DEN ERSTEN SLICE
14.1 Verbindliche Mindestdateien:
14.1.1 /core/m13-core.txt oder gleichwertig
14.1.2 /runtime/registry/registry.json
14.1.3 /runtime/agents/m-room.json
14.1.4 /runtime/agents/m-pathy.json
14.1.5 /runtime/agents/m-onitor.json
14.1.6 /runtime/judges/m-real.json
14.1.7 /runtime/judges/m-policy.json
14.1.8 /runtime/judges/m-go.json
14.1.9 /runtime/artifacts/linkedin_comment.json oder b2b_reply.json
14.1.10 /runtime/monitor-rules/core-monitor-rules.json
14.1.11 /lib/runtime/loadRegistry.ts
14.1.12 /lib/runtime/selectRuntimeObjects.ts
14.1.13 /lib/runtime/loadRuntimeObjects.ts
14.1.14 /lib/parsing/parseModelResponse.ts
14.1.15 /lib/parsing/validateTransparency.ts
14.1.16 /lib/gates/evaluateReleaseGate.ts
14.1.17 /lib/gates/evaluateMovementGate.ts
14.1.18 /lib/artifacts/buildArtifact.ts
14.1.19 /lib/audit/writeAuditRecord.ts
14.1.20 /lib/safe-mode/resolveSafeMode.ts
14.1.21 route.ts im bestehenden API Pfad
14.2 Zusätzliche Dateien nur, wenn sie der Trennung dienen und keine Drift erzeugen.

15. HARTE IMPLEMENTIERUNGSREGELN
15.1 Eine Datei trägt eine Verantwortung.
15.2 Keine Datei darf gleichzeitig Core, Runtime und Audit vermischen.
15.3 Keine Datei darf kanonische Namen abwandeln.
15.4 Keine Datei darf Registry Wahrheit still überschreiben.
15.5 Keine Datei darf Governance Entscheidungen simulieren, die dem Modell vorbehalten sind.
15.6 Keine Datei darf Inhalte umschreiben, um Fehler zu verstecken.
15.7 Keine Datei darf Safe Mode still deaktivieren.
15.8 Keine Datei darf direkte externe Aktion ohne Program Binding auslösen.
15.9 Keine Datei darf Secrets in Logs schreiben.
15.10 Keine Datei darf implizite Defaults verwenden, die Governance tangieren.

16. REIHENFOLGE IST VERBINDLICH
16.1 Keine Runtime Files vor Core.
16.2 Keine Artifact Shaping Logik vor Parser und Gates.
16.3 Kein dry run trigger vor Proposal Object Logik.
16.4 Kein End to End Test vor Audit.
16.5 Kein echter externer Trigger vor stabilem dry run Slice.

17. VERANTWORTUNG DER MODULE
17.1 Core erzwingt Gesetz.
17.2 route.ts orchestriert Backend Schritte.
17.3 Registry offenbart Runtime Wahrheit.
17.4 Agent Files ergänzen Runtime Verhalten.
17.5 Judge Files ergänzen Runtime Urteilsrahmen.
17.6 Artifact Profiles definieren Zielgestalt.
17.7 Parser zerlegt Antwort.
17.8 Transparenzvalidator prüft First Block Pflicht.
17.9 Release Gate prüft Freigabefähigkeit.
17.10 Movement Gate prüft Handoff Fähigkeit.
17.11 Artifact Builder formt Rückgabe.
17.12 Audit Writer speichert Nachvollziehbarkeit.
17.13 m-onitor überwacht operative Integrität.
17.14 Safe Mode Resolver begrenzt Fehlerzustände.

18. HARTE INVARIANTEN GESAMTPROJEKT
18.1 Room Form Movement bleibt absolut dominant.
18.2 Status bleibt vor Generation.
18.3 Kein Release ohne validen Transparenzblock.
18.4 Kein Movement ohne eigenes Gate.
18.5 Kein Registry Write ohne RAA.
18.6 Kein Drift zwischen Core, Registry und Runtime Files.
18.7 Kein nicht kanonischer Agentenname.
18.8 Kein Secret im Reasoning Raum.
18.9 Kein semantisches Healing im Backend.
18.10 Kein Output ohne Audit Pfad.

19. ABNAHMEKRITERIEN GESAMTPROJEKT
19.1 Das Projekt gilt als erfolgreich umgesetzt, wenn:
19.1.1 Core separat existiert und schlank ist
19.1.2 Registry gültig und selektiv nutzbar ist
19.1.3 route.ts sauber zoniert ist
19.1.4 Runtime Files strukturiert geladen werden
19.1.5 Transparenzblock strikt validiert wird
19.1.6 Release Gate und Movement Gate getrennt arbeiten
19.1.7 ein Artefakt vom Typ linkedin_comment oder b2b_reply geliefert wird
19.1.8 dry run optional funktioniert
19.1.9 Audit für jeden Request geschrieben wird
19.1.10 Safe Mode harte Fehler korrekt abfängt
19.2 Das Projekt gilt als nicht erfolgreich umgesetzt, wenn:
19.2.1 Core mit Runtime Details aufgebläht wurde
19.2.2 route.ts wieder zur Mischdatei geworden ist
19.2.3 Registry nur dekorativ ist
19.2.4 Artefakt nicht auditierbar ist
19.2.5 Gates unklar oder verschmolzen sind
19.2.6 Fehlerpfade still durchgereicht werden

20. SCHLUSSBESTIMMUNG
20.1 Diese README ist Umsetzungsgrundlage.
20.2 Das DEV Team setzt um, nicht umdeutet.
20.3 Änderungen an dieser Reihenfolge oder Struktur bedürfen ausdrücklicher Freigabe durch den Architekten.
20.4 Bis zu dieser Freigabe gilt diese Spezifikation als bindend.

21. ERGEBNIS DIESES TEILS
21.1 Das DEV Team hat nach Teil 5 verstanden:
21.1.1 in welcher Reihenfolge gebaut wird
21.1.2 welche Dateien mindestens entstehen müssen
21.1.3 welche Invarianten nie verletzt werden dürfen
21.1.4 woran die Fertigstellung objektiv gemessen wird
21.1.5 wie der erste M13 Slice vollständig realisiert wird