export default function SubscriptionLayout({
  children,
}: { children: React.ReactNode }) {
  // Elternstruktur wird zentral in page.tsx definiert (70 px Rhythmus etc.)
  return (
    <div className="min-h-dvh bg-black text-white">
      {children}
    </div>
  );
}
