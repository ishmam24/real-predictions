"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Fixed bottom tab bar — the primary navigation on mobile.
const tabs = [
  { href: "/", label: "Predict", icon: "⚽" },
  { href: "/leaderboard", label: "Table", icon: "🏆" },
  { href: "/leagues", label: "Leagues", icon: "👥" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-20"
      style={{
        background: "var(--rp-surface)",
        borderTop: "1px solid var(--rp-border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <ul className="grid grid-cols-4">
        {tabs.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium"
                style={{ color: active ? "var(--rp-accent)" : "var(--rp-muted)" }}
              >
                <span className="text-lg leading-none">{t.icon}</span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
