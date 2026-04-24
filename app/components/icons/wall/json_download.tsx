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
        d="M10 10c-.8 0-1.2.4-1.2 1.2v1.2c0 .5-.2.9-.7 1.1.5.2.7.6.7 1.1v1.2c0 .8.4 1.2 1.2 1.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 10c.8 0 1.2.4 1.2 1.2v1.2c0 .5.2.9.7 1.1-.5.2-.7.6-.7 1.1v1.2c0 .8-.4 1.2-1.2 1.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Download arrow */}
      <path
        d="M12 8.5v3.5"
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