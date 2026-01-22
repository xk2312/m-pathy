'use client'

import {
  writeArchiveChatContext,
  clearArchiveChatContext,
  clearArchiveSelection,
} from './storage'



/* ======================================================
   TYPES
   ====================================================== */

type ArchivePairLike = {
  user: { content?: string }
  assistant: { content?: string }
}

type StartChatEventDetail = {
  pairs: ArchivePairLike[]
}

/* ======================================================
   UTILS (CLEAN · LOCAL CONTEXT MODE)
   ====================================================== */

function buildSummaryText(pairs: ArchivePairLike[]): string {
  console.info('[ARCHIVE][S1] building archive summary · pairs:', pairs.length);

  if (!Array.isArray(pairs) || pairs.length === 0) {
    console.warn('[ARCHIVE][S1.1] no pairs provided');
    return '';
  }

  const SYSTEM_HINT =
    'Below is verified conversation history. Continue naturally based on it.';

  // 🔹 Verlustfreie, rein textuelle Zusammenführung aller Paare
  const merged = pairs
    .map((p, i) => {
      const user =
        typeof p.user?.content === 'string' ? p.user.content.trim() : '';
      const assistant =
        typeof p.assistant?.content === 'string'
          ? p.assistant.content.trim()
          : '';
      return `PAIR ${i + 1}\nUSER:\n${user}\n\nASSISTANT:\n${assistant}`;
    })
    .join('\n\n');

  const summary = [SYSTEM_HINT, merged].join('\n\n').trim();

  console.info('[ARCHIVE][S2] summary text built · length:', summary.length);
  return summary;
}





/* ======================================================
   MAIN FLOW - SINGLE ENTRY POINT (CLEAN · LOCAL)
   ====================================================== */

function handleStartChat(e: Event) {
  console.info('[ARCHIVE][F0] start-chat event received');

  const event = e as CustomEvent<StartChatEventDetail>;
  const pairs = Array.isArray(event.detail?.pairs)
    ? event.detail.pairs
    : [];

  console.info('[ARCHIVE][F1] pairs count:', pairs.length);

  try {
    // 🪶 Lokale Zusammenfassung erstellen (ohne API)
    const summary = buildSummaryText(pairs);

    if (!summary || summary.length === 0) {
      console.warn('[ARCHIVE][F1.1] empty summary - aborting');
      return;
    }

    // 🧭 Übergabe an Chat-Kontext
    writeArchiveChatContext(summary);
    console.info('[ARCHIVE][F3] summary written to session storage');

     // 🔑 Kanonischer Übergabepunkt → Chat übernimmt
    window.dispatchEvent(
      new CustomEvent('mpathy:archive:prepared', {
        detail: { source: 'archive' },
      })
    );
    console.info('[ARCHIVE][F4] archive prepared event dispatched');

    // 🕒 Spinner sichtbar halten, dann Archiv schließen
    setTimeout(() => {
      console.info('[ARCHIVE][F5] auto-closing archive after delay');
      window.dispatchEvent(new CustomEvent('mpathy:archive:close'));

      // 🧹 SessionStorage nach Archiv-Schluss säubern
      try {
        clearArchiveChatContext();
        clearArchiveSelection();
        console.info('[ARCHIVE][F6] session storage cleared (selection + context)');
      } catch (cleanupErr) {
        console.warn('[ARCHIVE][F6-WARN] cleanup failed:', cleanupErr);
      }
    }, 3000);
  } catch (err) {
    console.error('[ARCHIVE][ERROR]', err);
  }
}


/* ======================================================
   LISTENER ATTACH
   ====================================================== */

if (
  typeof window !== 'undefined' &&
  window.location.pathname.startsWith('/chat')
) {
  window.addEventListener(
    'mpathy:archive:start-chat',
    handleStartChat
  );
}

