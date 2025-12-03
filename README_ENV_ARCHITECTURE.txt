========================================================
 M-PATHY – SERVER ENV ARCHITECTURE (STAGING EDITION)
========================================================

Last Update: 2025-12-03  
Author: M 💛  
Purpose: Single Source of Truth für ALLE ENV- und Deploy-Fragen.
Dieses Dokument verhindert Drift, Chaos und Zeitverlust.

--------------------------------------------------------
1. ORTE DER ENV-DATEIEN
--------------------------------------------------------

Lokales Repo (Mac):
- m-pathy-staging/.env.local      (lokale Entwicklung)
- m-pathy-staging/.env            (falls vorhanden)
Diese lokalen Envs haben NICHTS mit Staging zu tun.

Staging-Server (DO Ubuntu):
- /srv/app/shared/.env            ← WICHTIGSTE DATEI
  → Wird vom laufenden Node-Prozess verwendet.
  → Muss alle Secrets enthalten:
        RESEND_API_KEY
        RESEND_FROM_EMAIL
        MAGIC_LINK_SECRET
        DATABASE_URL
        usw.

- /srv/app/shared/env/.env.production
  → Alte / verwaiste Datei. Nicht vom Server genutzt.

--------------------------------------------------------
2. SCHREIBSCHUTZ (.env)
--------------------------------------------------------
Die Datei /srv/app/shared/.env besitzt einen Schutz:

- ansehen:
      lsattr .env   → zeigt "i", wenn immutable

- Schutz entfernen:
      sudo chattr -i .env
      sudo chmod 644 .env

- Schutz wieder aktivieren nach Bearbeitung:
      sudo chmod 600 .env
      sudo chown root:root .env
      sudo chattr +i .env

--------------------------------------------------------
3. UMGANG MIT RESEND
--------------------------------------------------------

Resend verwendet für Absenderadressen die Domain:
    m-pathy.ai

Subdomains (z. B. mail.m-pathy.ai) müssen NICHT verifiziert werden,
sofern man die Adresse NICHT nutzt.

Korrekte Absenderadresse:
    RESEND_FROM_EMAIL=login@m-pathy.ai

FALSCH (führt zu 403 validation_error):
    RESEND_FROM_EMAIL=login@mail.m-pathy.ai

--------------------------------------------------------
4. MAGIC-LINK ROUTE (WICHTIG)
--------------------------------------------------------

Secrets, die zwingend in /srv/app/shared/.env stehen müssen:

    MAGIC_LINK_SECRET=<secret>
    MAGIC_LINK_TTL_MIN=15

    RESEND_API_KEY=<key>
    RESEND_FROM_EMAIL=login@m-pathy.ai

    NEXT_PUBLIC_BASE_URL=https://staging.m-pathy.ai

--------------------------------------------------------
5. DEPLOY & RESTART
--------------------------------------------------------

(1) SSH verbinden:
    ssh deploy@<server-ip>

(2) In shared wechseln:
    cd /srv/app/shared

(3) .env bearbeiten:
    sudo chattr -i .env
    sudo nano .env
    sudo chmod 600 .env
    sudo chattr +i .env

(4) Server rebooten, damit Env geladen wird:
    sudo reboot

--------------------------------------------------------
6. DEBUG CHECKLISTE
--------------------------------------------------------

1) Magic-Link testen und Response ansehen:
   → HAS_RESEND_KEY muss TRUE sein
   → HAS_FROM_EMAIL muss TRUE sein
   → resendClientStatus = "client-loaded"
   → KEIN "validation_error"

2) Resend Dashboard prüfen:
   → Domain: m-pathy.ai = Verified
   → Logs: neue Mail sichtbar

3) IMMER:
   → /srv/app/shared/.env ist Wahrheit
   → NICHT: .env.production in shared/env/

--------------------------------------------------------
7. WICHTIGER MERKSATZ
--------------------------------------------------------

"Staging lädt NUR aus:
    /srv/app/shared/.env
Alles andere ist Dekoration."

========================================================
END OF DOCUMENT
========================================================
