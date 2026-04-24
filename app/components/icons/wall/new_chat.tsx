import React from "react";

export default function NewChatIcon() {
  return (
    <svg viewBox="0 0 24 24">
      {/* Circle */}
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />

      {/* Plus */}
      <path
        d="M12 9v6M9 12h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}