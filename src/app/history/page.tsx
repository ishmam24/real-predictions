"use client";
// History — past gameweeks, most recent first. Each fixture renders the same
// read-only card as a locked current-gameweek board (predicted vs. final score,
// POTM pick, points earned), just grouped under its own gameweek header.
import { fixtures as allFixtures, gameweeks } from "@/lib/mock-data";
import { useStore, currentGameweek } from "@/lib/store";
import { FixtureCard } from "@/components/FixtureCard";

export default function HistoryPage() {
  const { scoreFor, hydrated } = useStore();

  const pastGameweeks = gameweeks
    .filter((gw) => gw.id !== currentGameweek.id)
    .sort((a, b) => b.number - a.number);

  return (
    <main className="px-4 pt-5 pb-8">
      <h1 className="text-2xl font-extrabold mb-1">📜 History</h1>
      <p className="text-sm mb-4" style={{ color: "var(--rp-muted)" }}>
        Your predictions and final results, gameweek by gameweek.
      </p>

      {!hydrated && (
        <div className="card p-6 text-center text-sm" style={{ color: "var(--rp-muted)" }}>
          Loading…
        </div>
      )}

      {hydrated && pastGameweeks.length === 0 && (
        <div className="card p-6 text-center text-sm" style={{ color: "var(--rp-muted)" }}>
          No past gameweeks yet — this fills in once Gameweek {currentGameweek.number} wraps up.
        </div>
      )}

      {hydrated &&
        pastGameweeks.map((gw) => {
          const gwFixtures = allFixtures.filter((f) => f.gameweekId === gw.id);
          const points = gwFixtures.reduce((sum, f) => sum + (scoreFor(f.id)?.total ?? 0), 0);

          return (
            <section key={gw.id} className="mb-6">
              <div className="card p-4 mb-3 flex items-center justify-between">
                <div>
                  <p className="font-bold">{gw.title}</p>
                  <p className="text-xs" style={{ color: "var(--rp-muted)" }}>
                    {new Date(gw.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <p className="font-extrabold text-lg" style={{ color: "var(--rp-mint)" }}>
                  {points} pts
                </p>
              </div>

              {gwFixtures.map((f, i) => (
                <FixtureCard key={f.id} fixture={f} index={i} total={gwFixtures.length} readOnly />
              ))}
            </section>
          );
        })}
    </main>
  );
}
