README_AOE_LANDINGPAGE_28_04_26

---

**Projektüberblick:**  
Wir entwickeln ein modulares, eigenständiges AEO-Diagnose- und Transformationstool für AI-optimierte Webpräsenzen. Die Lösung besteht aus zwei Extensions – Analyse und Textgenerator – und wird als hybride Landingpage mit fokussiertem Chat-Interface umgesetzt. Ziel ist es, Webseiten automatisiert auf AI-Readiness zu prüfen, Optimierungspotentiale verständlich aufzuzeigen und direkt die Transformation anzubieten.

---

**1. Komponenten**

- **AEO-Analyse-Extension**
  - Prüft Webseiten nach festen AEO-Kriterien (Crawlability, strukturierte Daten, Entities, rechtliche Lesbarkeit, AI-Extraktionsfähigkeit u.v.m.).
  - Läuft komplett im Backend (Python).
  - Liefert strukturierte Analyse-Ergebnisse (JSON).

- **AEO-Textgenerator-Extension**
  - Nimmt die Analyse-Daten entgegen.
  - Generiert mit Hilfe eines LLM (z.B. GPT) einen kompakten, verständlichen Report mit Empfehlungen.
  - Bietet die Möglichkeit, direkt AI-optimierten, C6-geprüften Content zu erzeugen.

- **Hybride Landingpage (Frontend)**
  - Task-fokussiertes, schlankes Chat-Interface.
  - User gibt URL ein, erhält Diagnose und kann direkt den Content-Generator nutzen.
  - Optional: PDF-Report, Leadformular, Demo-Transformation.

- **API/Modularchitektur**
  - Beide Extensions sind eigenständig und können auf m-pathy.ai oder als OEM/Whitelabel-Lösung genutzt werden.
  - Leicht an andere Systeme oder Websites anbindbar.

---

**2. Nutzerflow (Landingpage)**

1. User besucht die Landingpage und gibt eine URL ein.
2. Backend analysiert die Seite und extrahiert relevante AEO-Daten.
3. LLM generiert einen Kurzbericht aus den Analyse-Ergebnissen.
4. User erhält Score, Hauptkritikpunkte und Empfehlungen im Chat.
5. Call-to-Action: „Jetzt AI-ready werden“ (Wechsel zum Textgenerator).
6. Optional: Download-Report, Beratung anfordern, Demo-Content testen.

---

**3. Technologiestack**

- **Backend:** Python (requests, BeautifulSoup/lxml, eigene Parser, OpenAI/GPT-API)
- **Frontend:** React/Vue/Svelte o.ä. mit Chat-UI, REST-API-Anbindung
- **Deployment:** Containerbasiert (Docker), skalierbar
- **Sicherheit:** Rate-Limit, DSGVO-konform, sichere Datenverarbeitung

---

**4. USP & Vision**

- Diagnose und Lösung aus einer Hand: Von der AI-Readiness-Analyse bis zur Transformation in geprüften, AI-optimierten Content.
- Modular und unabhängig nutzbar (Plattform, API, Whitelabel).
- Moderne, dialogbasierte UX für maximale Nutzerbindung.
- Zukunftssicher und auf Erweiterbarkeit (weitere Checks, Features) ausgelegt.

---

**5. Dateiname:**  
README_AOE_LANDINGPAGE_28_04_26

---

**Letztes Update:** 28.04.2026