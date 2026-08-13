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

  const [h, setH] = useState(settled ? String(settled.homeScore) : "");
  const [a, setA] = useState(settled ? String(settled.awayScore) : "");
  const [potm, setPotm] = useState<string | null>(settled?.potmPlayerId ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const canSettle = h !== "" && a !== "";

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm">{home.name} v {away.name}</span>
        {settled && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--rp-mint)", color: "#04231a" }}>
            Settled
          </span>
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
