"use client";
// Profile — shows the player's identity, stats, and a link to the admin panel.
import Link from "next/link";
import { useStore } from "@/lib/store";
import { teamById } from "@/lib/mock-data";

export default function ProfilePage() {
  const { profile, myTotalPoints, signOut } = useStore();
  if (!profile) return null;
  const team = profile.favouriteTeamId ? teamById(profile.favouriteTeamId) : null;

  return (
    <main className="px-4 pt-5">
      <div className="card p-6 text-center mb-4">
        <div className="text-6xl mb-2">{profile.avatarEmoji}</div>
        <h1 className="text-xl font-extrabold">{profile.displayName}</h1>
        {team && <p className="text-sm" style={{ color: "var(--rp-muted)" }}>{team.name} fan</p>}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)" }}>
          <span style={{ color: "var(--rp-muted)" }}>Total points</span>
          <span className="font-extrabold text-lg" style={{ color: "var(--rp-mint)" }}>{myTotalPoints()}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Link href="/admin" className="card p-4 flex items-center justify-between">
          <span className="font-semibold">🛠️ Admin panel</span>
          <span style={{ color: "var(--rp-muted)" }}>Set fixtures & results →</span>
        </Link>
        <button
          onClick={signOut}
          className="card p-4 text-left font-semibold"
          style={{ color: "var(--rp-accent)" }}
        >
          Sign out
        </button>
      </div>

      <p className="text-center text-xs mt-6" style={{ color: "var(--rp-muted)" }}>
        Prototype build · data saved locally in your browser
      </p>
    </main>
  );
}
