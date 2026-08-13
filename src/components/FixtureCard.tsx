"use client";
// ============================================================================
// Broadcast scoreboard fixture card — one match rendered like a TV matchday
// graphic: matchup, editable score boxes (the leading side lit in signal
// lime), and a Player-of-the-Match footer that expands the squad picker.
// Predictions autosave to the store on every change. When `readOnly` (after
// the deadline) the same card renders locked, showing the final result and
// points earned once the fixture has been settled.
// ============================================================================
import { useState } from "react";
import type { Fixture } from "@/lib/types";
import { teamById, squadFor, playerById } from "@/lib/mock-data";
import { stadiumOf } from "@/lib/football-meta";
import { useStore } from "@/lib/store";
import { TeamBadge } from "./TeamBadge";
import { PotmPicker } from "./PotmPicker";

export function FixtureCard({
  fixture,
  index,
  total,
  readOnly = false,
}: {
  fixture: Fixture;
  index: number;
  total: number;
  readOnly?: boolean;
}) {
  const { predictions, savePrediction, scoreFor, results } = useStore();
  const home = teamById(fixture.homeTeamId);
  const away = teamById(fixture.awayTeamId);
  const existing = predictions[fixture.id];

  const [h, setH] = useState(existing?.homeScore != null ? String(existing.homeScore) : "");
  const [a, setA] = useState(existing?.awayScore != null ? String(existing.awayScore) : "");
  const [potm, setPotm] = useState<string | null>(existing?.potmPlayerId ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const score = scoreFor(fixture.id);
  const settled = !!results[fixture.id];

  function commit(next: Partial<{ h: string; a: string; p: string | null }>) {
    const nh = next.h ?? h;
    const na = next.a ?? a;
    const np = next.p !== undefined ? next.p : potm;
    savePrediction({
      fixtureId: fixture.id,
      homeScore: nh === "" ? null : Number(nh),
      awayScore: na === "" ? null : Number(na),
      potmPlayerId: np,
    });
  }

  const hn = h === "" ? null : Number(h);
  const an = a === "" ? null : Number(a);
  const homeLead = hn != null && an != null && hn > an;
  const awayLead = hn != null && an != null && an > hn;

  const potmName = potm ? playerById(potm)?.name : null;
  const kickoff = new Date(fixture.kickoff).toLocaleString(undefined, {
    weekday: "short", hour: "2-digit", minute: "2-digit",
  });
  const venue = stadiumOf(home.tla); // home team plays at their own ground

  return (
    <div className="rp-fx">
      <div className="rp-fx__meta">
        <span className="pill">{venue ? `${kickoff} · ${venue}` : kickoff}</span>
        {settled && score ? (
          <span className="pill pts">+{score.total} PTS</span>
        ) : (
          <span className="pill">Tie {index + 1} of {total}</span>
        )}
      </div>

      <div className="rp-fx__core">
        <div className="rp-fx__side">
          <TeamBadge team={home} size={34} />
          <span className="rp-display nm">{home.name}</span>
        </div>

        <div className="rp-scores">
          <input
            aria-label={`${home.name} score`}
            className={`rp-sbox rp-num score-input ${homeLead ? "lead" : ""}`}
            inputMode="numeric" type="number" min={0} placeholder="–"
            value={h} disabled={readOnly}
            onChange={(e) => { setH(e.target.value); commit({ h: e.target.value }); }}
          />
          <span className="colon">:</span>
          <input
            aria-label={`${away.name} score`}
            className={`rp-sbox rp-num score-input ${awayLead ? "lead" : ""}`}
            inputMode="numeric" type="number" min={0} placeholder="–"
            value={a} disabled={readOnly}
            onChange={(e) => { setA(e.target.value); commit({ a: e.target.value }); }}
          />
        </div>

        <div className="rp-fx__side away">
          <TeamBadge team={away} size={34} />
          <span className="rp-display nm">{away.name}</span>
        </div>
      </div>

      {/* Final result once the fixture is settled. */}
      {settled && (
        <div className="text-center text-xs pb-2" style={{ color: "var(--rp-muted)" }}>
          Final {results[fixture.id].homeScore}–{results[fixture.id].awayScore}
          {results[fixture.id].potmPlayerId && (
            <> · POTM {playerById(results[fixture.id].potmPlayerId!)?.name}</>
          )}
        </div>
      )}

      <button
        type="button"
        disabled={readOnly}
        onClick={() => setPickerOpen((o) => !o)}
        className={`rp-fx__foot ${potmName ? "" : "empty"}`}
      >
        <span className="star">★</span>
        <span className="who">{potmName ?? "Add Player of the Match"}</span>
        {potmName && <span className="pts">+2 PTS</span>}
        {!readOnly && <span className="act">{pickerOpen ? "Close" : potmName ? "Change" : "Pick"}</span>}
      </button>

      {pickerOpen && !readOnly && (
        <div className="rp-picker">
          <PotmPicker
            homeTeam={home}
            awayTeam={away}
            homeSquad={squadFor(home.id)}
            awaySquad={squadFor(away.id)}
            selectedPlayerId={potm}
            onSelect={(pid) => { setPotm(pid); commit({ p: pid }); setPickerOpen(false); }}
          />
        </div>
      )}
    </div>
  );
}
