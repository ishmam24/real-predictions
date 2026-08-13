"use client";
// Persistent right-hand rail on the Predict screen (desktop only, via the
// .rp-rail media query). Keeps the deadline, gameweek progress, and the
// mini-league table in view — the "broadcast bug" beside the pitch.
import { useStore, currentGameweek } from "@/lib/store";
import { Countdown } from "./Countdown";

export function StandingsRail() {
  const { leaderboard, predictions } = useStore();
  const rows = leaderboard();

  const total = currentGameweek.fixtureIds.length;
  const done = currentGameweek.fixtureIds.filter((id) => {
    const p = predictions[id];
    return !!p && p.homeScore != null && p.awayScore != null;
  }).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <aside className="rp-rail">
      <div className="panel">
        <p className="rp-eyebrow">Deadline</p>
        <div className="mt-1 font-semibold" style={{ color: "var(--rp-accent)" }}>
          <Countdown to={currentGameweek.deadline} />
        </div>
      </div>

      <div className="panel">
        <p className="rp-eyebrow">Your progress</p>
        <div className="rp-progress"><i style={{ width: `${pct}%` }} /></div>
        <div className="flex justify-between text-xs" style={{ color: "var(--rp-muted)" }}>
          <span>{done} of {total} predicted</span>
          <span className="rp-num">{pct}%</span>
        </div>
      </div>

      <div className="panel">
        <p className="rp-eyebrow" style={{ marginBottom: 8 }}>Standings</p>
        {rows.slice(0, 6).map((r) => {
          const me = r.displayName.endsWith("(you)");
          return (
            <div key={r.userId} className="rp-srow" data-me={me}>
              <span
                className="rp-num text-center font-extrabold"
                style={{ color: me || r.rank <= 3 ? "var(--rp-accent)" : "var(--rp-muted)" }}
              >
                {r.rank}
              </span>
              <span className="flex items-center gap-2 min-w-0">
                <span>{r.avatarEmoji}</span>
                <span className="truncate font-semibold">{r.displayName.replace(" (you)", "")}</span>
              </span>
              <span className="rp-num font-extrabold" style={{ color: "var(--rp-mint)" }}>
                {r.totalPoints}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
