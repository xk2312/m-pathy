# README_MONITOR_AI (DE)

## Zweck

Dieses Dokument hält die aktuelle kanonische Definition der Monitor AI innerhalb des m-pathy Systems fest.

Es konsolidiert die Architekturentscheidungen, Verhaltensregeln, Matching-Logik, Overlay-Integration, Nutzersteuerung und den dedizierten Monitor-Systemprompt exakt so, wie sie im Gespräch definiert wurden.

Das Ziel von Monitor ist nicht, den Nutzer wie der Haupt-Assistant zu unterstützen.
Das Ziel von Monitor ist es zu erkennen, wann eine bestehende Systemfähigkeit aus der Registry hochrelevant für die aktuelle Arbeit des Nutzers ist und einen kontrollierten Systemwachstumsmoment auszulösen.

---

## 1. Kernposition von Monitor

Monitor ist kein Chat-Feature.
Monitor ist nicht Teil der Assistant-Stimme.
Monitor ist keine passive UI-Dekoration.

Monitor ist eine separate Systemkomponente mit genau einer spezialisierten Aufgabe:

- den aktuellen Arbeitskontext beobachten  
- diesen Kontext mit der Registry vergleichen  
- erkennen, ob genau ein bestehendes Programm mit hoher Sicherheit passt  
- eine gezielte Aktivierungsmöglichkeit auslösen  

Kernformel:

- Registry = Möglichkeit  
- Monitor = Entscheidung  
- Wall = Sichtbarkeit  

---

## 2. Warum Monitor existiert

Die Wall soll nicht zufällig wachsen.

Ohne Monitor:

- bleibt die Wall statisch  
- bleibt Aktivierung manuell  
- erlebt der Nutzer isolierte Tools  

Mit Monitor:

- erkennt das System Kontext  
- schlägt Wachstum im richtigen Moment vor  
- wird die Wall zu einer lebendigen Systemoberfläche  

---

## 3. UX-Entscheidung

### Abgelehnt: im Assistant-Text
- zerstört Systemtrennung  
- wirkt wie Werbung  
- erhöht Komplexität  

### Abgelehnt: fester Platz in der Wall
- passiv  
- wird ignoriert  

### Gewählt: Overlay
- klare Trennung  
- hochwertig  
- skalierbar  

---

## 4. Architektur

Monitor läuft außerhalb der Route.

Assistant:
- denkt  
- antwortet  

Monitor:
- erkennt  
- matched  
- triggert  

→ Multi-Agent System

---

## 5. Stateless Prinzip

Monitor ist zustandslos:

- kein Gedächtnis  
- nur Snapshot  
- keine Historie  

Intervall:
- Standard 9 Nachrichten  

---

## 6. Erste 3 Trigger

Immer aktiv:

- Research Mode  
- C6 Challenge  
- Capsula13  

Danach:
- Settings sichtbar  

---

## 7. Datenzugriff

- letzte 2 Nachrichtenpaare  
- Registry (aktive Programme)  

---

## 8. Matching-Prinzip

Nicht:
„Was könnte helfen?“

Sondern:
„Was macht der User gerade?“  

---

## 9. Matching-Logik

1. Intent erkennen  
2. Programme filtern  
3. Match bewerten  
4. genau 1 Match  
5. Kontext prüfen  
6. Cooldown  

---

## 10. Qualitätsregel

Lieber kein Trigger als ein falscher.

---

## 11. Verboten

- Halluzination  
- Mehrfachvorschläge  
- Erklärungen  
- Marketing  

---

## 12. Flow

User → Assistant → Monitor → Overlay → Entscheidung → Wall wächst  

---

## 13. Overlay

- klein  
- präzise  
- nicht störend  

---

## 14. Handoff

```json
{
  "command": "echo-monitor",
  "program": "echo-<program>"
}
```

---

## 15. Monitor Service

- eigener Service  
- eigenes Modell  
- eigener Prompt  

---

## 16. Systemprompt

```text
SYSTEM: MONITOR v1.0

ROLE
Du bist der Monitor des m-pathy Systems.

Du entscheidest nur, ob ein Trigger stattfinden soll.

INPUT
- letzte 2 Nachrichtenpaare
- registry
- session_counter

RULES
- nur aktueller Intent
- muss aktiv sein
- genau ein Match

OUTPUT

{
  "trigger": true,
  "program": "<id>",
  "confidence": "high"
}

oder

{
  "trigger": false
}
```

---

## 17. Bedeutung

Monitor macht aus m-pathy:

→ System statt Chat

---

## 18. Zusammenfassung

Monitor ist:

- separat  
- stateless  
- zyklisch  
- präzise  
- konservativ  
