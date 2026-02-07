import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAIOS | Governance Infrastructure for AI Execution",
  description:
    "MAIOS is a system-level governance infrastructure that enforces control, responsibility, and verifiability before AI outputs are produced. It operates independently of AI models and providers in regulated and liability-sensitive environments.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MAIOS | Governance Infrastructure for AI Execution",
    description:
      "MAIOS enforces governance as a technical precondition for AI execution. Control, responsibility, and verifiability are ensured before any AI output is produced.",
    url: "https://m-pathy.ai/maios",
    siteName: "m-pathy.ai",
    type: "website",
    images: [
      {
        url: "/og/maios.jpg",
        width: 1200,
        height: 630,
        alt: "MAIOS governance infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAIOS | Governance Infrastructure for AI Execution",
    description:
      "System-level governance infrastructure for controlled AI execution in regulated and liability-sensitive environments.",
    images: ["/og/maios.jpg"],
  },
};
