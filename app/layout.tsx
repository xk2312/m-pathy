import "./global.css";
import './styles/chat-prose.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "GalaxyEducation – TECH Beginner",
  description: "Learn tech basics with M",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-dvh bg-gradient-to-b from-blue-50 via-white to-blue-100 text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
