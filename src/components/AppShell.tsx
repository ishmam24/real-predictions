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
  const { userId, profile, hydrated, signOut } = useStore();

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

  // Signed in but no profile loaded yet. Rather than render app content without
  // nav (or a dead blank), show a friendly status with an escape hatch. Normally
  // this resolves in a moment as the profile loads / self-heals.
  if (!profile) {
    return (
      <div className="app-shell">
        <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="text-4xl">⚽️</div>
          <p className="font-semibold">Setting up your account…</p>
          <p className="text-sm" style={{ color: "var(--rp-muted)" }}>
            This should only take a moment. If it doesn&apos;t, sign out and back in.
          </p>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded-xl font-semibold"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)" }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
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
