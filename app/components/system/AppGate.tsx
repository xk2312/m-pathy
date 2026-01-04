// app/components/system/AppGate.tsx
"use client"

import { usePathname } from "next/navigation"

type AppGateProps = {
  children: React.ReactNode
}

export default function AppGate({ children }: AppGateProps) {
  const pathname = usePathname()
  const isArchive = pathname.startsWith("/archive")

  if (isArchive) return null

  return <>{children}</>
}
