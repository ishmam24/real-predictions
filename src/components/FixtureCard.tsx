"use client";
// A single fixture: enter a predicted scoreline, pick Player of the Match,
// and (after results settle) see the points earned with a breakdown.
import { useState } from "react";
import type { Fixture } from "@/lib/types";
import { teamById, squadFor, playerById } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { TeamBadge } from "./TeamBadge";
import { PotmPicker } from "./PotmPicker";

export function FixtureCard({ fixture, locked }: { fixture: Fixture; locked: boolean }) {
  const { predictions, savePrediction, scoreFor, results } = useStore();
  const home = teamById(fixture.homeTeamId);
  const away = teamById(fixture.awayTeamId);
  const existing = predictions[fixture.id];

  const [homeScore, setHomeScore] = useState<string>(
    existing?.homeScore != null ? String(existing.homeScore) : ""
  );
  const [awayScore, setAwayScore] = useState<string>(
    existing?.awayScore != null ? String(existing.awayScore) : ""
  );
  const [potm, setPotm] = useState<string | null>(existing?.potmPlayerId ?? null);
  const [potmOpen, setPotmOpen] = useState(false);

  const score = scoreFor(fixture.id);
  const settled = !!results[fixture.id];

  function commit(next: Partial<{ h: string; a: string; p: string | null }>) {
    const h = next.h ?? homeScore;
    const a = next.a ?? awayScore;
    const p = next.p !== undefined ? next.p : potm;
    savePrediction({
      fixtureId: fixture.id,
      homeScore: h === "" ? null : Number(h),
      awayScore: a === "" ? null : Number(a),
      potmPlayerId: p,
    });
  }

  const selectedPlayer = potm ? playerById(potm) : null;
  const kickoff = new Date(fixture.kickoff).toLocaleString(undefined, {
    weekday: "short", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-xs mb-3" style={{ color: "var(--rp-muted)" }}>
        <span>{kickoff}</span>
        {settled && score && (
          <span
            className="font-bold px-2 py-0.5 rounded-full"
            style={{ background: "var(--rp-mint)", color: "#04231a" }}
          >
            +{score.total} pts
          </span>
        )}
      </div>

      {/* Scoreline row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TeamBadge team={home} />
          <span className="font-semibold truncate">{home.name}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            className="score-input w-11 h-12 text-center text-xl font-bold rounded-xl"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
            inputMode="numeric" type="number" min={0} placeholder="–"
            value={homeScore} disabled={locked}
            onChange={(e) => { setHomeScore(e.target.value); commit({ h: e.target.value }); }}
          />
          <span style={{ color: "var(--rp-muted)" }}>:</span>
          <input
            className="score-input w-11 h-12 text-center text-xl font-bold rounded-xl"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
            inputMode="numeric" type="number" min={0} placeholder="–"
            value={awayScore} disabled={locked}
            onChange={(e) => { setAwayScore(e.target.value); commit({ a: e.target.value }); }}
          />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="font-semibold truncate text-right">{away.name}</span>
          <TeamBadge team={away} />
        </div>
      </div>

      {/* Actual result, once settled */}
      {settled && (
        <div className="text-center text-xs mt-2" style={{ color: "var(--rp-muted)" }}>
          Final: {results[fixture.id].homeScore}–{results[fixture.id].awayScore}
          {results[fixture.id].potmPlayerId && (
            <> · POTM {playerById(results[fixture.id].potmPlayerId!)?.name}</>
          )}
        </div>
      )}

      {/* POTM picker */}
      <div className="mt-3">
        <button
          type="button"
          disabled={locked}
          onClick={() => setPotmOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm"
          style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)" }}
        >
          <span style={{ color: "var(--rp-muted)" }}>⭐ Player of the Match</span>
          <span className="font-semibold flex items-center gap-1">
            {selectedPlayer ? selectedPlayer.name : "Pick"}
            <span style={{ color: "var(--rp-muted)" }}>{potmOpen ? "▲" : "▼"}</span>
          </span>
        </button>

        {potmOpen && !locked && (
          <div className="mt-2">
            <PotmPicker
              homeTeam={home}
              awayTeam={away}
              homeSquad={squadFor(home.id)}
              awaySquad={squadFor(away.id)}
              selectedPlayerId={potm}
              onSelect={(pid) => { setPotm(pid); commit({ p: pid }); setPotmOpen(false); }}
            />
          </div>
        )}
      </div>

      {/* Points breakdown after settling */}
      {settled && score && (
        <div className="flex gap-2 mt-3 text-xs">
          <Chip label="Result" value={score.result} />
          <Chip label="POTM" value={score.potm} />
        </div>
      )}
    </div>
  );
}

function Chip({ label, value }: { label: string; value: number }) {
  return (
    <span
      className="px-2 py-1 rounded-lg font-medium"
      style={{
        background: value > 0 ? "var(--rp-mint)" : "var(--rp-surface-2)",
        color: value > 0 ? "#04231a" : "var(--rp-muted)",
        border: "1px solid var(--rp-border)",
      }}
    >
      {label} +{value}
    </span>
  );
}
