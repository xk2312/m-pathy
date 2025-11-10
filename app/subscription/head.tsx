// app/subscription/head.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "m-pathy — Subscription",
  description: "Join the resonant field of creation with your m-pathy subscription.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "m-pathy — Subscription",
    description:
      "Access 1 000 000 tokens for € 14,99 and join the operating system for creation.",
    url: "https://m-pathy.ai/subscription",
    siteName: "m-pathy",
    type: "website",
    images: [
      {
        url: "/og/subscription.jpg",
        width: 1200,
        height: 630,
        alt: "m-pathy Subscription",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "m-pathy — Subscription",
    description: "Access 1 000 000 tokens for € 14,99 and join the operating system for creation.",
    images: ["/og/subscription.jpg"],
  },
};
