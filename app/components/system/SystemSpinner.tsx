'use client'

import React from 'react'

type Props = {
  size?: number
}

export default function SystemSpinner({ size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      role="status"
      aria-label="System working"
      className="system-spinner"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 150"
      />
      <style jsx>{`
        .system-spinner {
          color: var(--color-cyan, #53e9fd);
          animation: spin 1.4s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .system-spinner {
            animation: none;
          }
        }
      `}</style>
    </svg>
  )
}
