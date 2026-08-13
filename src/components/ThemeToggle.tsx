"use client";
// Light/dark toggle. The choice is stored in localStorage and applied to
// <html data-theme>, which overrides the OS preference. A tiny inline script
// in the root layout applies the saved choice before first paint (no flash).
import { useEffect, useState } from "react";

type Mode = "light" | "dark";

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode | null>(null);

  // One-time sync from an external store (the DOM/localStorage the pre-paint
  // script already applied), so the set-state-in-effect rule doesn't apply.
  useEffect(() => {
    const saved = document.documentElement.dataset.theme as Mode | undefined;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setMode(saved ?? (prefersDark ? "dark" : "light"));
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("rp_theme", next);
    } catch {
      /* ignore private-mode storage errors */
    }
  }

  const isDark = mode === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid place-items-center rounded-md text-sm"
      style={{
        width: 32,
        height: 32,
        border: "1px solid var(--rp-border)",
        background: "var(--rp-surface)",
        color: "var(--rp-text)",
      }}
    >
      {/* Render nothing until we know the mode, to avoid a wrong-icon flash. */}
      {mode == null ? "" : isDark ? "☀" : "☾"}
    </button>
  );
}
