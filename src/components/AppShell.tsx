"use client";
// Wraps every page in the phone-width shell. If there's no signed-in profile
// yet, it shows the onboarding flow instead of the app.
import { useStore } from "@/lib/store";
import { BottomNav } from "./BottomNav";
import { Onboarding } from "./Onboarding";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, hydrated } = useStore();

  return (
    <div className="app-shell">
      {/* Wait for localStorage to load so we don't flash the wrong screen. */}
      {!hydrated ? null : profile ? (
        <>
          {children}
          <BottomNav />
        </>
      ) : (
        <Onboarding />
      )}
    </div>
  );
}
