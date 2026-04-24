import React from "react";

export default function CsvDownloadIcon() {
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

      {/* CSV rows */}
      <path
        d="M8.5 11.5h7M8.5 14h7M8.5 16.5h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Download arrow */}
      <path
        d="M12 8.5v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10.5 11l1.5 1.5L13.5 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}