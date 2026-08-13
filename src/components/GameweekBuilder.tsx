"use client";
// ============================================================================
// Auto-pick the gameweek: calls /api/admin/suggest-gameweek, shows the 5
// most prominent fixtures (with reason tags) plus the rest of the ranked
// matchday, and lets the admin approve or swap before publishing.
// This is the "auto-pick + one-tap approve" flow.
// ============================================================================
import { useState } from "react";

type Scored = {
  id: string;
  homeName: string;
  awayName: string;
  homeTla: string;
  awayTla: string;
  kickoff: string;
  score: number;
  tags: string[];
};
type Suggestions = {
  source: "live" | "sample";
  matchday: number | null;
  top5: Scored[];
  ranked: Scored[];
};

export function GameweekBuilder() {
  const [data, setData] = useState<Suggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [approved, setApproved] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setApproved(false);
    try {
      const res = await fetch("/api/admin/suggest-gameweek");
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json: Suggestions = await res.json();
      setData(json);
      setSelected(new Set(json.top5.map((f) => f.id)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 5) next.add(id);
      return next;
    });
  }

  return (
    <div className="card p-4 mb-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold">⚡ Auto-pick gameweek</h2>
        {data && (
          <span className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-muted)" }}>
            {data.source === "live" ? "live data" : "sample data"}
          </span>
        )}
      </div>
      <p className="text-xs mb-3" style={{ color: "var(--rp-muted)" }}>
        Ranks the next matchday by prominence and pre-selects the top 5. Tap to swap any, then approve.
      </p>

      {!data && (
        <button onClick={generate} disabled={loading}
          className="btn-primary w-full py-3 rounded-xl font-semibold">
          {loading ? "Ranking fixtures…" : "Generate suggestions"}
        </button>
      )}

      {error && (
        <p className="text-xs mt-2" style={{ color: "var(--rp-accent)" }}>{error}</p>
      )}

      {data && (
        <>
          <p className="text-xs mb-2" style={{ color: "var(--rp-muted)" }}>
            {data.matchday ? `Matchday ${data.matchday} · ` : ""}{selected.size}/5 selected
          </p>
          <ul className="flex flex-col gap-2">
            {data.ranked.map((f) => {
              const on = selected.has(f.id);
              return (
                <li key={f.id}>
                  <button onClick={() => toggle(f.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-2"
                    style={{
                      background: on ? "var(--rp-surface-2)" : "transparent",
                      border: on ? "2px solid var(--rp-accent)" : "1px solid var(--rp-border)",
                    }}>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{f.homeName} v {f.awayName}</p>
                      {f.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {f.tags.map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{ background: "var(--rp-border)", color: "var(--rp-muted)" }}>{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold" style={{ color: "var(--rp-muted)" }}>{f.score}</span>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: on ? "var(--rp-accent-fill)" : "transparent", color: on ? "var(--rp-on-accent)" : "var(--rp-muted)", border: on ? "none" : "1px solid var(--rp-border)" }}>
                        {on ? "✓" : "+"}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            disabled={selected.size !== 5}
            onClick={() => setApproved(true)}
            className="w-full mt-3 py-3 rounded-xl font-semibold text-white disabled:opacity-40"
            style={{ background: "var(--rp-mint)", color: "#04231a" }}>
            {selected.size === 5 ? "Approve & publish these 5" : `Select ${5 - selected.size} more`}
          </button>

          {approved && (
            <p className="text-xs mt-2 text-center" style={{ color: "var(--rp-mint)" }}>
              ✅ Approved. (Prototype: publishing to the live gameweek connects with Supabase.)
            </p>
          )}
        </>
      )}
    </div>
  );
}
