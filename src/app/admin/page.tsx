"use client";
// ============================================================================
// Admin panel (prototype).
// In production this is gated to admins (profiles.is_admin) and lets you:
//   1. Build the gameweek by picking 5 fixtures a week ahead
//   2. Enter final scores (these will auto-fill from football-data.org)
//   3. Enter Player of the Match manually, then settle -> points are awarded
// For now it focuses on entering results so you can watch scoring + the table
// update live.
// ============================================================================
import { useState } from "react";
import Link from "next/link";
import { fixtures } from "@/lib/mock-data";
import { teamById, squadFor } from "@/lib/mock-data";
import { useStore, currentGameweek } from "@/lib/store";
import { PotmPicker } from "@/components/PotmPicker";
import { GameweekBuilder } from "@/components/GameweekBuilder";

// One suggested Player-of-the-Match candidate (from /api/admin/potm-candidates).
type PotmCandidate = { id: string; name: string; teamName: string; position: string; bps: number };

export default function AdminPage() {
  const { profile } = useStore();
  const gwFixtures = fixtures.filter((f) => f.gameweekId === currentGameweek.id);

  if (profile && !profile.isAdmin) {
    return (
      <main className="px-4 pt-5">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/profile" style={{ color: "var(--rp-muted)" }}>←</Link>
          <h1 className="text-2xl font-extrabold">🛠️ Admin</h1>
        </div>
        <div className="card p-6 mt-3 text-center">
          <p className="font-semibold mb-1">Admins only</p>
          <p className="text-sm" style={{ color: "var(--rp-muted)" }}>
            Your account doesn&apos;t have admin access.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pt-5">
      <div className="flex items-center gap-2 mb-1">
        <Link href="/profile" style={{ color: "var(--rp-muted)" }}>←</Link>
        <h1 className="text-2xl font-extrabold">🛠️ Admin</h1>
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--rp-muted)" }}>
        Build the gameweek automatically, then enter results & Player of the Match.
      </p>

      {/* Step 1: auto-pick the 5 fixtures */}
      <GameweekBuilder />

      {/* Pull finished results from FPL on demand (same sweep the cron runs). */}
      <SyncResultsButton />

      {/* Step 2: enter results for the current gameweek */}
      <h2 className="font-bold mb-2">📝 Enter results — Gameweek {currentGameweek.number}</h2>
      <div className="flex flex-col gap-3">
        {gwFixtures.map((f) => (
          <AdminFixtureRow key={f.id} fixtureId={f.id} />
        ))}
      </div>
    </main>
  );
}

function AdminFixtureRow({ fixtureId }: { fixtureId: string }) {
  const { results, setResult, clearResult } = useStore();
  const fixture = fixtures.find((f) => f.id === fixtureId)!;
  const home = teamById(fixture.homeTeamId);
  const away = teamById(fixture.awayTeamId);
  const settled = results[fixtureId];
  // Scores are in but POTM hasn't been confirmed yet — the state the auto-settle
  // cron leaves a finished match in until an admin picks the Player of the Match.
  const potmPending = !!settled && !settled.potmPlayerId;

  const [h, setH] = useState(settled ? String(settled.homeScore) : "");
  const [a, setA] = useState(settled ? String(settled.awayScore) : "");
  const [potm, setPotm] = useState<string | null>(settled?.potmPlayerId ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Suggested POTM candidates (top performers by BPS from FPL).
  const [candidates, setCandidates] = useState<PotmCandidate[] | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidateError, setCandidateError] = useState<string | null>(null);

  const canSettle = h !== "" && a !== "";

  async function suggestPotm() {
    setLoadingCandidates(true);
    setCandidateError(null);
    try {
      const res = await fetch(`/api/admin/potm-candidates?fixture=${fixtureId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Couldn't load suggestions");
      setCandidates(json.candidates ?? []);
    } catch (e) {
      setCandidateError(e instanceof Error ? e.message : "Couldn't load suggestions");
    } finally {
      setLoadingCandidates(false);
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm">{home.name} v {away.name}</span>
        {settled && (
          potmPending ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--rp-accent-soft)", color: "var(--rp-accent)" }}>
              Result in · POTM pending
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--rp-mint)", color: "#04231a" }}>
              Settled
            </span>
          )
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-sm w-24 text-right truncate">{home.name}</span>
        <input value={h} onChange={(e) => setH(e.target.value)} type="number" min={0} inputMode="numeric"
          className="score-input w-11 h-11 text-center text-lg font-bold rounded-xl"
          style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }} />
        <span style={{ color: "var(--rp-muted)" }}>:</span>
        <input value={a} onChange={(e) => setA(e.target.value)} type="number" min={0} inputMode="numeric"
          className="score-input w-11 h-11 text-center text-lg font-bold rounded-xl"
          style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }} />
        <span className="text-sm w-24 truncate">{away.name}</span>
      </div>

      {/* Suggested POTM — top performers by BPS. Confirm the real one against
          the official Premier League site, then tap to fill it in. */}
      <div className="mb-2">
        <button onClick={suggestPotm} disabled={loadingCandidates}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg"
          style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-accent)" }}>
          {loadingCandidates ? "Finding…" : "✨ Suggest POTM"}
        </button>
        {candidateError && <span className="text-xs ml-2" style={{ color: "var(--rp-live)" }}>{candidateError}</span>}
        {candidates && candidates.length === 0 && !candidateError && (
          <span className="text-xs ml-2" style={{ color: "var(--rp-muted)" }}>No suggestions yet (needs a finished match).</span>
        )}
        {candidates && candidates.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {candidates.map((c) => (
              <button key={c.id} onClick={() => setPotm(c.id)}
                className="text-xs px-2.5 py-1 rounded-full"
                title={`${c.teamName} · BPS ${c.bps}`}
                style={{
                  background: potm === c.id ? "var(--rp-accent-fill)" : "var(--rp-surface-2)",
                  color: potm === c.id ? "var(--rp-on-accent)" : "var(--rp-text)",
                  border: "1px solid var(--rp-border)",
                }}>
                {c.name} <span style={{ opacity: 0.6 }}>· {c.bps}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setPickerOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm mb-2"
        style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)" }}>
        <span style={{ color: "var(--rp-muted)" }}>⭐ Player of the Match</span>
        <span className="font-semibold">
          {potm ? squadFor(home.id).concat(squadFor(away.id)).find((p) => p.id === potm)?.name : "Pick"} {pickerOpen ? "▲" : "▼"}
        </span>
      </button>
      {pickerOpen && (
        <PotmPicker homeTeam={home} awayTeam={away} homeSquad={squadFor(home.id)} awaySquad={squadFor(away.id)}
          selectedPlayerId={potm} onSelect={(pid) => { setPotm(pid); setPickerOpen(false); }} />
      )}

      <div className="flex gap-2 mt-3">
        <button
          disabled={!canSettle}
          onClick={() => setResult(fixtureId, Number(h), Number(a), potm)}
          className="btn-primary flex-1 py-2.5 rounded-xl font-semibold">
          {settled ? "Update result" : "Settle result"}
        </button>
        {settled && (
          <button onClick={() => { clearResult(fixtureId); setH(""); setA(""); setPotm(null); }}
            className="px-4 rounded-xl font-semibold" style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)" }}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// Triggers the same finished-results sweep the scheduled cron runs, but on
// demand and authorised by the admin session. Handy for testing and for pulling
// results in immediately after full time.
function SyncResultsButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function sync() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/sync-results", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Sync failed");
      const n = json.settled?.length ?? 0;
      setMsg(n ? `Settled ${n} fixture${n === 1 ? "" : "s"} — enter Player of the Match below.` : "No new finished results to pull in yet.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-4 mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="font-semibold text-sm">Auto-pull results</p>
        <p className="text-xs" style={{ color: "var(--rp-muted)" }}>
          Fetches finished scores from the live feed and awards result points. Runs automatically ~2h after each kickoff.
        </p>
        {msg && <p className="text-xs mt-1" style={{ color: "var(--rp-text)" }}>{msg}</p>}
      </div>
      <button onClick={sync} disabled={busy}
        className="btn-primary px-4 py-2.5 rounded-xl font-semibold shrink-0">
        {busy ? "Syncing…" : "Sync now"}
      </button>
    </div>
  );
}
