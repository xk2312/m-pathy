export function openArchive() {
  window.dispatchEvent(new CustomEvent("mpathy:archive:open"));
}