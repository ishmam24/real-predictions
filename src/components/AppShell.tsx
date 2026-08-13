"use client";
// Responsive shell. The proxy (src/proxy.ts) redirects signed-out users to
// /login, so an unauthenticated render only ever happens on that page — we pass
// its children straight through with no app chrome. Signed-in users who haven't
// finished profile setup get onboarding; everyone else gets the full app with a
// desktop top nav, a centred content column, and a mobile bottom tab bar.
import { useStore } from "@/lib/store";
import { BottomNav } from "./BottomNav";
import { TopNav } from "./TopNav";
import { Onboarding } from "./Onboarding";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { userId, profile, hydrated } = useStore();

  // Wait for the Supabase session + profile to resolve so we don't flash the
  // wrong screen.
  if (!hydrated) {
    return <div className="app-shell" />;
  }

  // Not signed in: this is the /login page — render it without app chrome.
  // (The proxy guarantees only /login is reachable while signed out.)
  if (!userId) {
    return <div className="app-shell">{children}</div>;
  }

  // Signed in but the profile is still resolving (or self-healing). Never render
  // app content without nav — show a neutral placeholder until it loads.
  if (!profile) {
    return <div className="app-shell" />;
  }

  // Authenticated but hasn't set up their profile yet.
  if (!profile.onboarded) {
    return (
      <div className="app-shell">
        <Onboarding />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopNav />
      <div className="app-main">{children}</div>
      <BottomNav />
    </div>
  );
}
