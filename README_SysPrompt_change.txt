Alles klar.
Hier ist ein **kompaktes, sauberes README**, das du beim **nächsten Systemprompt-Tausch** einfach wieder vorlegst.
Es ist **praxisnah**, **forensisch korrekt** und verhindert exakt das Chaos von heute.

---

# 📘 README — Systemprompt austauschen (MAIOS / GPTX)

## Zweck

Dieses Dokument beschreibt **den einzig korrekten Weg**, um den **aktiven Systemprompt** von *m-pathy* (Main oder Staging) auszutauschen, ohne Drift, Caches oder falsche Dateien zu erwischen.

---

## 🧠 Grundprinzip (wichtig)

Der **Chat-Backend-Endpoint** (`/api/chat`) lädt den Systemprompt **NICHT** aus ENV und **NICHT** aus `shared/prompts`, sondern **ausschließlich** aus:

```
/srv/m-pathy/<PROTOCOL>.txt
```

Für MAIOS ist das:

```
/srv/m-pathy/GPTX.txt
```

Alles andere (ENV, shared/prompts, Releases) ist **sekundär** oder **UI-bezogen**.

---

## ✅ Die eine Wahrheit

Wenn der Chat MAIOS sprechen soll, **muss diese Datei MAIOS enthalten**:

```
/srv/m-pathy/GPTX.txt
```

---

## 🔁 Standard-Ablauf: Systemprompt tauschen (Main ODER Staging)

### 1) Auf den Zielserver einloggen

* **Main**: m-core / production
* **Staging**: staging-server

```bash
ssh deploy@<SERVER-IP>
```

---

### 2) Bestehenden Prompt sichern

```bash
sudo cp -a /srv/m-pathy/GPTX.txt /srv/m-pathy/GPTX.txt.bak.$(date +%Y%m%d%H%M%S)
```

---

### 3) Neuen Systemprompt einspielen (MAIOS)

Quelle ist z. B. der gepflegte MAIOS-Prompt:

```
/srv/app/shared/GPTX.txt
```

Kopieren:

```bash
sudo cp -a /srv/app/shared/GPTX.txt /srv/m-pathy/GPTX.txt
```

Kurz prüfen:

```bash
sudo head -n 5 /srv/m-pathy/GPTX.txt
```

---

### 4) Service neu starten

```bash
sudo systemctl restart mpathy
```

---

### 5) Funktionstest (lokal)

```bash
curl -sS http://127.0.0.1:3000/api/chat \
  -H 'content-type: application/json' \
  -d '{"protocol":"GPTX","messages":[{"role":"user","content":"wer bist du? antworte exakt mit einem Satz."}]}'
```

**Erwartung:**
Antwort identifiziert sich als **MAIOS**.

---

## ❌ Häufige Fehler (vermeiden)

* ❌ Nur `/srv/app/shared/prompts/GPTX.txt` ändern
* ❌ Nur ENV-Variablen ändern
* ❌ Release-Dateien (`/srv/app/current/...`) anfassen
* ❌ Symlinks ohne klare Richtung bauen

Diese führen **nicht** zum Ziel.

---

## 🔐 Sicherheit

* API-Keys dürfen **nicht** in Logs oder Chats landen
* Nach Debug-Sessions ggf. **Keys rotieren**

---

## 🧭 Merksatz

> **Der Chat liest, was in `/srv/m-pathy/GPTX.txt` steht.
> Alles andere ist Kosmetik.**

---

Wenn du willst, kann ich dir daraus auch eine **README.md** oder eine **1-seitige Cheat-Card** machen.
