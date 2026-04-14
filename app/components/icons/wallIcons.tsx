import React from "react";

export const wallIcons: Record<string, JSX.Element> = {
  settings: (
    <svg viewBox="0 0 24 24">
      <path d="M12 12.3a3.35 3.35 0 1 0 0-6.7 3.35 3.35 0 0 0 0 6.7Z" stroke="currentColor" strokeWidth="1.6" fill="none"/>
      <path d="M6.4 18.2c.7-2.2 3-3.5 5.6-3.5s4.9 1.3 5.6 3.5" stroke="currentColor" strokeWidth="1.6" fill="none"/>
      <path d="M4.8 12c0-4.4 2.8-7.2 7.2-7.2s7.2 2.8 7.2 7.2-2.8 7.2-7.2 7.2S4.8 16.4 4.8 12Z" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    </svg>
  ),

  archive: (
    <svg viewBox="0 0 24 24">
      <path d="M4.8 7h14.4" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M6.3 7v9.2c0 .95.77 1.7 1.7 1.7h8c.93 0 1.7-.75 1.7-1.7V7" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M5.3 4.9h13.4c.28 0 .5.22.5.5v1.1c0 .28-.22.5-.5.5H5.3a.5.5 0 0 1-.5-.5V5.4c0-.28.22-.5.5-.5Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M10 11.2h4" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),

  cortex: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" fill="none"/>
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M7.6 7.6l1.35 1.35M15.05 15.05l1.35 1.35" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M16.4 7.6l-1.35 1.35M8.95 15.05L7.6 16.4" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),

  csv_download: (
    <svg viewBox="0 0 24 24">
      <path d="M7 4.8h7l4 4v10.4a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.8a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M14 4.8v4h4" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8.2 11.5h7.4M8.2 14.6h2.1M11.5 14.6h2.1" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),

  json_download: (
    <svg viewBox="0 0 24 24">
      <path d="M9.1 6.3c-1.5 0-2.2.8-2.2 2.2v1.8c0 .8-.3 1.4-1 1.7.7.3 1 .9 1 1.7v1.8c0 1.4.7 2.2 2.2 2.2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M14.9 6.3c1.5 0 2.2.8 2.2 2.2v1.8c0 .8.3 1.4 1 1.7-.7.3-1 .9-1 1.7v1.8c0 1.4-.7 2.2-2.2 2.2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M11.2 9.3h1.6M11.2 14.7h1.6" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),

  new_chat: (
    <svg viewBox="0 0 24 24">
      <path d="M6.3 7.2h11.4c.88 0 1.6.72 1.6 1.6v6.2c0 .88-.72 1.6-1.6 1.6h-6.6l-3.8 2.6v-2.6H6.3c-.88 0-1.6-.72-1.6-1.6V8.8c0-.88.72-1.6 1.6-1.6Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 10v4M10 12h4" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
};