import React from "react";

type ArchiveIconProps = {
  className?: string;
};

export default function ArchiveIcon({ className }: ArchiveIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      {/* Lid */}
      <path
        d="M4 6h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Box */}
      <rect
        x="5"
        y="6"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {/* Inner label line */}
      <path
        d="M9 11h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}