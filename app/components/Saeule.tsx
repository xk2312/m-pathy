"use client";
import styles from "./Saeule.module.css";

export default function Saeule() {
  // Fallback-Inhalt – wird später gern mit echtem Verlauf gefüttert
  const items = [{ id: "cur", title: "Aktueller Chat", ts: Date.now() }];

  return (
    <aside className={styles.saeule} aria-label="Säule – Chatübersicht" data-test="saeule">
      <div className={styles.head}>
        <div className={styles.title}>Säule</div>
        <div className={styles.badge}>L1 · Free</div>
      </div>

      <div className={styles.sectionTitle}>Verlauf</div>
      <ul className={styles.list}>
        {items.map(it => (
          <li key={it.id} className={styles.entry} title={it.title}>
            <div className={styles.entryTitle}>{it.title}</div>
            <div className={styles.entryMeta}>{new Date(it.ts).toLocaleString()}</div>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={() => {
            try {
              const raw = localStorage.getItem("mpathy:thread:default") || "{}";
              const blob = new Blob([raw], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "mpathy-thread.json"; a.click();
              URL.revokeObjectURL(url);
            } catch {}
          }}
        >
          Export
        </button>
        <button className={styles.buttonGhost} onClick={() => alert("Levels coming soon")}>
          Levels
        </button>
      </div>
    </aside>
  );
}
