// app/subscription/head.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "m-pathy Subscription | Governance-First AI Workspace",
  description:
    "m-pathy is a professional AI workspace for regulated environments. Operate AI under deterministic governance, full system transparency, and verifiable control.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "m-pathy | Professional AI Workspace under Governance",
    description:
      "Operate AI in a controlled system space. m-pathy provides governance-first AI usage with explicit system states, telemetry, and verifiable control. Built on MAIOS.",
    url: "https://m-pathy.ai/subscription",
    siteName: "m-pathy.ai",
    type: "website",
    images: [
      {
        url: "/og/subscription.jpg",
        width: 1200,
        height: 630,
        alt: "m-pathy governance-first AI workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "m-pathy | Governance-First AI Workspace",
    description:
      "Professional AI workspace for regulated contexts. Deterministic governance, system transparency, and verifiable AI operation powered by MAIOS.",
    images: ["/og/subscription.jpg"],
  },
};
