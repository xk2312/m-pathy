/*# 📑 FILE INDEX — RecentChatsView.tsx

## FILE

`RecentChatsView.tsx`

## ROLE (1 Satz)

Read-only UI-Komponente zur Anzeige der **letzten Chats** im Archiv, inklusive Metadaten (Serial, Keywords, Message Count, Timestamp) und Navigation in bestehende Chats.

## TOUCH

**NEIN — passiv, read-only**

Diese Datei darf im Rahmen der Injection-Arbeit **nicht verändert** werden.

---

## WHY (Warum diese Datei relevant ist)

* Sie zeigt **bestehende Chats**, nicht neue.
* Sie ist Teil des **ARCHIVE → CHAT**-Navigationspfads.
* Sie definiert, **wie ein Chat geöffnet wird**, wenn er bereits existiert.
* Sie ist wichtig, um klar zu trennen:

  * Öffnen eines bestehenden Chats
  * Erzeugen eines neuen Chats (Injection-Flow)

---

## DANGERS (Absolute No-Gos)

❌ Keine Injection-Logik hier einbauen
❌ Keine Session- oder LocalStorage-Zugriffe ergänzen
❌ Keine Summary- oder Context-Übergabe hier vornehmen
❌ Keine neuen Events dispatchen
❌ Keine Navigation für „neuen Chat“ implementieren

Diese Komponente ist **Anzeige + Navigation**, sonst nichts.

---

## ANCHORS (Relevante Codebereiche)

### 1️⃣ Datenquelle: Recent Chats

```ts
const base = getRecentChats(13)
```

* Bezieht Daten aus `archiveIndex`
* Limitiert auf **13 Chats** (kanonische Zahl)
* Rein lesend

➡️ Kein Einfluss auf Injection.

---

### 2️⃣ Mapping der Chat-Metadaten

```ts
const mapped = base.map((chat) => ({ ... }))
```

* `chat_serial`
* `keywords`
* `messageCount`
* `lastTimestamp`

➡️ Diese Struktur ist **Anzeige-orientiert**, nicht Chat-State.

---

### 3️⃣ Öffnen eines bestehenden Chats

```ts
onOpenChat?.(String(chat.chat_serial))
```

* Wird ausgelöst bei:

  * Klick auf das gesamte Chat-Item
  * Klick auf den „View →“-Button
* Führt **direkt** in einen bestehenden Chat

➡️ Injection darf diesen Pfad **nicht verwenden**.

---

### 4️⃣ UI-Charakteristika

* `MessageSquare` Icon
* Hover-Effekte
* Keine Buttons mit Seiteneffekten

➡️ Rein präsentational.

---

## Relevanz für Injection (klar abgegrenzt)

**Diese Datei ist relevant für:**

* Verständnis des bestehenden Navigationspfads
* Abgrenzung: *Open existing chat* vs. *Create new chat*

**Diese Datei ist NICHT zuständig für:**

* Auswahl von Archiv-Nachrichten
* Summary-Erzeugung
* Session Storage
* Chat-Initialisierung
* Token-Abbuchung

---

## Kurzfazit (für Dev-Team)

`RecentChatsView.tsx` ist **rein passiv**.

➡️ Sie darf **niemals** Teil des Injection-Flows werden.
➡️ Jede Änderung hier birgt Navigations- und UX-Risiken.

**Finger weg – nur lesen, nicht anfassen.**
*/
'use client'

import { useEffect, useState } from 'react'
import { getRecentChats } from '@/lib/archiveIndex'
import { MessageSquare } from 'lucide-react'

type ChatDisplay = {
  chat_serial: number
  keywords: string[]
  messageCount: number
  lastTimestamp: string
}

type Props = {
  onOpenChat?: (chainId: string) => void
  headerLabel: string
  chatLabel: (n: number) => string
  totalMessagesLabel: (count: number) => string
  viewLabel: string
  keywordsLabel: string
}


export default function RecentChatsView({
  onOpenChat,
  headerLabel,
  chatLabel,
  totalMessagesLabel,
  viewLabel,
  keywordsLabel,
}: Props) {
  const [chats, setChats] = useState<ChatDisplay[]>([])

  useEffect(() => {
    const base = getRecentChats(1300)

    const mapped = base.map((chat) => {
  const totalMessages = chat.messages?.length ?? 0
  const pairCount = Math.floor(totalMessages / 2)

  return {
    chat_serial: chat.chat_serial,
    keywords: chat.keywords ?? [],
    messageCount: pairCount,
    lastTimestamp: chat.last_timestamp,
  }
})


    setChats(mapped)
  }, [])

  return (
    <section className="flex flex-col gap-16">
      <div className="text-xs text-text-muted tracking-wide">
  {headerLabel}
</div>


    {chats.map((chat) => (
  <article
    key={chat.chat_serial}
    className="
      group
      rounded-xl
      px-8
      py-7
      -mx-4
      cursor-pointer
      transition
      bg-surface-1
      hover:bg-surface-2
    "
    onClick={() => {
      onOpenChat?.(String(chat.chat_serial))
    }}
  >

          <div className="flex gap-6">
            <div className="pt-1 text-text-muted group-hover:text-text-secondary transition">
              <MessageSquare size={18} />
            </div>

            <div className="flex flex-col gap-5 flex-1">
              <div className="flex items-baseline justify-between gap-6">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <div className="text-sm text-text-primary">
  {chatLabel(chat.chat_serial)}
</div>


                  <div className="text-xs text-text-muted tracking-wide">
  [{totalMessagesLabel(chat.messageCount)} ·{' '}
  {new Date(chat.lastTimestamp).toLocaleDateString()}]
</div>

                </div>

              <button
  type="button"
  className="text-xs text-text-muted opacity-0 group-hover:opacity-100 transition"
  onClick={(e) => {
    e.stopPropagation()
    onOpenChat?.(String(chat.chat_serial))
  }}
>
  {viewLabel} →
</button>


              </div>

              {chat.keywords.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] uppercase tracking-wider text-text-muted">
  {keywordsLabel}
</div>


                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {chat.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs text-text-secondary select-none"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
