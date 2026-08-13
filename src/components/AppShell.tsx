"use client";
// Responsive shell. Signed-out users see onboarding; signed-in users get the
// app with a desktop top nav, a centred content column, and a mobile bottom
// tab bar.
import { useStore } from "@/lib/store";
import { BottomNav } from "./BottomNav";
import { TopNav } from "./TopNav";
import { Onboarding } from "./Onboarding";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, hydrated } = useStore();

  return (
    <div className="app-shell">
      {/* Wait for localStorage to load so we don't flash the wrong screen. */}
      {!hydrated ? null : profile ? (
        <>
          <TopNav />
          <div className="app-main">{children}</div>
          <BottomNav />
        </>
      ) : (
        <Onboarding />
      )}
    </div>
  );
}
