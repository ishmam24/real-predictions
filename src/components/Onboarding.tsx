"use client";
// ============================================================================
// Onboarding — profile setup, shown once after a new account is created.
// Auth itself now lives on /login; by the time this renders the user is signed
// in and just needs to choose a display name, avatar, favourite team, and
// (optionally) join a friend's league by code. On finish we write the profile
// to Supabase and mark it onboarded, which drops the player into the app.
// ============================================================================
import { useState } from "react";
import { useStore } from "@/lib/store";
import { teams } from "@/lib/mock-data";
import { TeamBadge } from "./TeamBadge";

const AVATARS = ["⚽", "🦊", "🐝", "🐺", "🦁", "🐢", "🐉", "🦅", "🐬", "🐼", "🚀", "👑"];

export function Onboarding() {
  const { onboard } = useStore();

  const [displayName, setDisplayName] = useState("");
  const [favouriteTeamId, setFavouriteTeamId] = useState<string | null>(null);
  const [avatarEmoji, setAvatarEmoji] = useState("⚽");
  const [leagueCode, setLeagueCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canFinish = displayName.trim().length >= 2 && !busy;

  async function finish() {
    if (!canFinish) return;
    setBusy(true);
    setError(null);
    try {
      await onboard({
        displayName: displayName.trim(),
        favouriteTeamId,
        avatarEmoji,
        leagueCode: leagueCode.trim() || undefined,
      });
      // AppShell switches to the app once the profile is marked onboarded.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 py-10" style={{ background: "var(--rp-ground)" }}>
      {/* Brand header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">⚽️</div>
        <h1 className="rp-display text-3xl font-extrabold text-white">Real Predictions</h1>
        <p className="text-sm mt-1" style={{ color: "#9fb0c2" }}>
          Predict the Premier League. Beat your mates.
        </p>
      </div>

      <div className="card p-6 mt-2 w-full max-w-md mx-auto">
        <h2 className="font-bold text-lg mb-4">Set up your profile</h2>

        {/* Display name */}
        <label className="block text-sm font-medium mb-1">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="What should the table call you?"
          className="w-full px-3 py-2.5 rounded-xl mb-4"
          style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
        />

        {/* Avatar */}
        <label className="block text-sm font-medium mb-2">Avatar</label>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatarEmoji(a)}
              className="aspect-square rounded-xl text-xl flex items-center justify-center"
              style={{
                background: avatarEmoji === a ? "var(--rp-accent)" : "var(--rp-surface-2)",
                border: "1px solid var(--rp-border)",
              }}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Favourite team */}
        <label className="block text-sm font-medium mb-2">Favourite team <span style={{ color: "var(--rp-muted)" }}>(optional)</span></label>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {teams.map((t) => (
            <button
              key={t.id}
              onClick={() => setFavouriteTeamId(favouriteTeamId === t.id ? null : t.id)}
              className="flex items-center justify-center py-1 rounded-xl"
              style={{
                background: favouriteTeamId === t.id ? "var(--rp-surface-2)" : "transparent",
                border: favouriteTeamId === t.id ? "2px solid var(--rp-accent)" : "1px solid var(--rp-border)",
              }}
            >
              <TeamBadge team={t} size={32} />
            </button>
          ))}
        </div>

        {/* League code */}
        <label className="block text-sm font-medium mb-1">League code <span style={{ color: "var(--rp-muted)" }}>(optional)</span></label>
        <input
          value={leagueCode}
          onChange={(e) => setLeagueCode(e.target.value.toUpperCase())}
          placeholder="Join a friends' league, e.g. PL7K2Q"
          className="w-full px-3 py-2.5 rounded-xl mb-5 tracking-widest"
          style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
        />

        {error && <p className="text-sm mb-3" style={{ color: "#ff6b6b" }}>{error}</p>}

        <button
          disabled={!canFinish}
          onClick={finish}
          className="btn-primary w-full py-3 rounded-xl font-semibold"
        >
          {busy ? "Setting up…" : "Enter the game →"}
        </button>
      </div>
    </div>
  );
}
