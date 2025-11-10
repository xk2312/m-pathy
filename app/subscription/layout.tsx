// app/subscription/layout.tsx
import React from "react";

export default function SubscriptionLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-black text-white">
      <main
        className="
          mx-auto w-full
          px-[10px] py-[20px]
          lg:px-[90px] lg:py-[90px]
          space-y-[70px]
        "
      >
        {children}
      </main>
    </div>
  );
}
