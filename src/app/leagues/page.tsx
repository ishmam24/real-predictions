"use client";
// ============================================================================
// Leagues — create or join FPL-style private mini-leagues, each with its own
// standings table. Backed by Supabase: create_league / join_league_by_code
// RPCs and the league_leaderboard() function (see supabase/migrations).
// ============================================================================
import { useState } from "react";
import { useStore } from "@/lib/store";
import { teamById } from "@/lib/mock-data";
import type { LeagueStanding } from "@/lib/types";

export default function LeaguesPage() {
  const { leagues, createLeague, joinLeague } = useStore();

  const [newName, setNewName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  async function onCreate() {
    if (newName.trim().length < 2 || busy) return;
    setBusy("create");
    setError(null);
    setFlash(null);
    try {
      const league = await createLeague(newName.trim());
      setNewName("");
      setFlash(`Created “${league.name}” — invite code ${league.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create league.");
    } finally {
      setBusy(null);
    }
  }

  async function onJoin() {
    if (joinCode.trim().length < 4 || busy) return;
    setBusy("join");
    setError(null);
    setFlash(null);
    try {
      const league = await joinLeague(joinCode.trim());
      setJoinCode("");
      setFlash(`Joined “${league.name}”.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not join — check the code.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="px-4 pt-5">
      <h1 className="text-2xl font-extrabold mb-1">👥 Leagues</h1>
      <p className="text-sm mb-4" style={{ color: "var(--rp-muted)" }}>
        Compete in private mini-leagues with friends.
      </p>

      {flash && (
        <div className="card p-3 mb-3 text-sm" style={{ color: "var(--rp-mint)" }}>{flash}</div>
      )}
      {error && (
        <div className="card p-3 mb-3 text-sm" style={{ color: "#ff6b6b" }}>{error}</div>
      )}

      {/* Your leagues */}
      <div className="flex flex-col gap-2 mb-6">
        {leagues.length === 0 && (
          <div className="card p-5 text-center text-sm" style={{ color: "var(--rp-muted)" }}>
            You&apos;re not in any leagues yet. Create one and share the code, or join a friend&apos;s below.
          </div>
        )}
        {leagues.map((l) => (
          <LeagueCard key={l.id} id={l.id} name={l.name} code={l.code} members={l.members} isOwner={l.isOwner} />
        ))}
      </div>

      {/* Create */}
      <div className="card p-4 mb-4">
        <h2 className="font-bold mb-2">Create a league</h2>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="League name"
            className="flex-1 px-3 py-2.5 rounded-xl"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
          />
          <button onClick={onCreate} disabled={busy === "create"} className="btn-primary px-4 rounded-xl font-semibold">
            {busy === "create" ? "…" : "Create"}
          </button>
        </div>
      </div>

      {/* Join */}
      <div className="card p-4">
        <h2 className="font-bold mb-2">Join a league</h2>
        <div className="flex gap-2">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 px-3 py-2.5 rounded-xl tracking-widest"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
          />
          <button onClick={onJoin} disabled={busy === "join"} className="px-4 rounded-xl font-semibold" style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)" }}>
            {busy === "join" ? "…" : "Join"}
          </button>
        </div>
      </div>
    </main>
  );
}

function LeagueCard({
  id,
  name,
  code,
  members,
  isOwner,
}: {
  id: string;
  name: string;
  code: string;
  members: number;
  isOwner: boolean;
}) {
  const { leagueLeaderboard } = useStore();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<LeagueStanding[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = !open;
    setOpen(next);
    // Re-fetch every time it's opened, not just the first time — otherwise a
    // fixture settled after the initial load would leave stale points showing
    // for the rest of the session.
    if (next) {
      setLoading(true);
      try {
        setRows(await leagueLeaderboard(id));
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="card overflow-hidden">
      <button onClick={toggle} className="w-full p-4 flex items-center justify-between text-left">
        <div>
          <p className="font-semibold">
            {name} {isOwner && <span className="text-[10px] align-middle" style={{ color: "var(--rp-muted)" }}>· owner</span>}
          </p>
          <p className="text-xs" style={{ color: "var(--rp-muted)" }}>{members} member{members === 1 ? "" : "s"}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px]" style={{ color: "var(--rp-muted)" }}>Invite code</p>
          <p className="font-mono font-bold tracking-widest" style={{ color: "var(--rp-accent)" }}>{code}</p>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid var(--rp-border)" }}>
          {loading && (
            <p className="px-4 py-3 text-sm" style={{ color: "var(--rp-muted)" }}>Loading standings…</p>
          )}
          {!loading && rows && rows.length === 0 && (
            <p className="px-4 py-3 text-sm" style={{ color: "var(--rp-muted)" }}>No members yet.</p>
          )}
          {!loading &&
            rows &&
            rows.map((r) => {
              const isMe = r.displayName.endsWith("(you)");
              const team = r.favouriteTeamId ? teamById(r.favouriteTeamId) : null;
              return (
                <div
                  key={r.userId}
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{ background: isMe ? "var(--rp-surface-2)" : "transparent", borderTop: "1px solid var(--rp-border)" }}
                >
                  <span className="w-6 text-center font-bold" style={{ color: r.rank <= 3 ? "var(--rp-accent)" : "var(--rp-muted)" }}>
                    {r.rank}
                  </span>
                  <span className="text-xl">{r.avatarEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{r.displayName.replace(" (you)", "")}</p>
                    {team && <p className="text-xs" style={{ color: "var(--rp-muted)" }}>{team.name} fan</p>}
                  </div>
                  <span className="font-extrabold" style={{ color: "var(--rp-mint)" }}>{r.totalPoints}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
