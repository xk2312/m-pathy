export default function openSettings() {
  window.dispatchEvent(new CustomEvent("mpathy:settings:open"));
}