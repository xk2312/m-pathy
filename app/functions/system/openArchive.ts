export default function openArchive() {
  window.dispatchEvent(new CustomEvent("mpathy:archive:open"));
}