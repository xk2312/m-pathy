"use client";

// Root-Startseite = Subscription Page
// Wir re-exportieren die Subscription-Page als neue Startseite (/)

import SubscriptionPage from "./subscription/page";

export default function RootPage() {
  return <SubscriptionPage />;
}
