// app/functions/system/openSettings.ts

export default async function openSettings() {
  window.dispatchEvent(
    new CustomEvent("mpathy:command", {
      detail: { command: "open_settings" },
    })
  );
}