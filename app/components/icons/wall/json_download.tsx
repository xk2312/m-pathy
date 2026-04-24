import React from "react";

export default function JsonDownloadIcon() {
  return (
    <svg viewBox="0 0 24 24">
      {/* File */}
      <path
        d="M7 4.8h7l4 4v10.4a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.8a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />

      {/* Fold */}
      <path
        d="M14 4.8v4h4"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />

      {/* Curly braces */}
      <path
        d="M10 11c-.7 0-1 .3-1 1v1c0 .5-.2.8-.6 1 .4.2.6.5.6 1v1c0 .7.3 1 1 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 11c.7 0 1 .3 1 1v1c0 .5.2.8.6 1-.4.2-.6.5-.6 1v1c0 .7-.3 1-1 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}