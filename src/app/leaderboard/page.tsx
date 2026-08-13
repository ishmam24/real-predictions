"use client";
// Leaderboard — FPL-style ranked table of everyone's total points.
import { useStore } from "@/lib/store";
import { teamById } from "@/lib/mock-data";

export default function LeaderboardPage() {
  const { leaderboard } = useStore();
  const rows = leaderboard();

  return (
    <main className="px-4 pt-5">
      <h1 className="text-2xl font-extrabold mb-1">🏆 The Table</h1>
      <p className="text-sm mb-4" style={{ color: "var(--rp-muted)" }}>
        Global standings — every player, ranked by total points.
      </p>

      {rows.length === 0 && (
        <div className="card p-6 text-center" style={{ color: "var(--rp-muted)" }}>
          No players on the board yet — be the first to make a prediction.
        </div>
      )}

      <div className="card overflow-hidden">
        {rows.map((r, i) => {
          const isMe = r.displayName.endsWith("(you)");
          const team = r.favouriteTeamId ? teamById(r.favouriteTeamId) : null;
          return (
            <div
              key={r.userId}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--rp-border)",
                background: isMe ? "var(--rp-surface-2)" : "transparent",
              }}
            >
              <span
                className="w-7 text-center font-bold"
                style={{ color: r.rank <= 3 ? "var(--rp-accent)" : "var(--rp-muted)" }}
              >
                {r.rank}
              </span>
              <span className="text-2xl">{r.avatarEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{r.displayName}</p>
                {team && (
                  <p className="text-xs" style={{ color: "var(--rp-muted)" }}>{team.name} fan</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-extrabold text-lg leading-none" style={{ color: "var(--rp-mint)" }}>
                  {r.totalPoints}
                </p>
                <p className="text-[10px]" style={{ color: "var(--rp-muted)" }}>{r.exactScores} exact</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
