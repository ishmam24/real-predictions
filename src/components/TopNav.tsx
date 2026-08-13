"use client";
// Desktop / tablet top navigation (hidden on mobile, where BottomNav takes over).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const tabs = [
  { href: "/", label: "Predict" },
  { href: "/leaderboard", label: "Table" },
  { href: "/leagues", label: "Leagues" },
  { href: "/profile", label: "Profile" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="rp-topnav">
      <Link href="/" className="rp-display flex items-center gap-2 font-extrabold text-sm">
        <span
          className="rp-num grid place-items-center rounded-md"
          style={{ width: 26, height: 26, background: "var(--rp-accent-fill)", color: "var(--rp-on-accent)", fontSize: 12 }}
        >
          RP
        </span>
        Real Predictions
      </Link>

      <nav className="flex gap-1">
        {tabs.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className="px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider"
              style={{
                color: active ? "var(--rp-accent)" : "var(--rp-muted)",
                background: active ? "var(--rp-accent-soft)" : "transparent",
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
