"use client";
// ============================================================================
// Prediction board — the "Broadcast Deck" Predict screen. Every fixture in the
// gameweek is shown at once as a scoreboard card you fill in place; there's no
// step-through wizard. Predictions autosave as you go, and "Confirm" locks them
// in (still editable until the deadline). After the deadline the cards render
// read-only via FixtureCard's `readOnly` mode.
// ============================================================================
import { useState } from "react";
import type { Fixture } from "@/lib/types";
import { fixtures as allFixtures } from "@/lib/mock-data";
import { useStore, currentGameweek } from "@/lib/store";
import { FixtureCard } from "./FixtureCard";

export function PredictionBoard() {
  const { predictions, submitGameweek, isSubmitted } = useStore();

  const fixtures = allFixtures.filter((f) => f.gameweekId === currentGameweek.id);
  const total = fixtures.length;

  // The deadline is far off in the prototype, so a one-shot read is fine here.
  const [now] = useState(() => Date.now());
  const deadlinePassed = now >= new Date(currentGameweek.deadline).getTime();
  const submitted = isSubmitted(currentGameweek.id);

  const isComplete = (f: Fixture) => {
    const p = predictions[f.id];
    return !!p && p.homeScore != null && p.awayScore != null;
  };
  const done = fixtures.filter(isComplete).length;
  const allComplete = done === total;

  return (
    <div className="rp-board">
      <div className="rp-board-head">
        <h1 className="rp-display">Gameweek {currentGameweek.number}</h1>
        {!deadlinePassed && (
          <span className="s">Predict all {total} · {done} done</span>
        )}
      </div>

      {submitted && !deadlinePassed && (
        <div className="rp-banner">
          <span>✅</span>
          <span>Predictions in — edit any time before the deadline.</span>
        </div>
      )}

      {deadlinePassed && (
        <div className="rp-banner">
          <span>🔒</span>
          <span>Gameweek locked. Points appear as results come in.</span>
        </div>
      )}

      {fixtures.map((f, i) => (
        <FixtureCard
          key={f.id}
          fixture={f}
          index={i}
          total={total}
          readOnly={deadlinePassed}
        />
      ))}

      {!deadlinePassed && (
        <button
          type="button"
          onClick={() => submitGameweek(currentGameweek.id)}
          disabled={!allComplete}
          className="btn-primary rp-confirm rp-display"
        >
          {allComplete
            ? submitted
              ? "Update picks →"
              : `Confirm ${total} picks →`
            : `Predict all ${total} to confirm`}
        </button>
      )}
    </div>
  );
}
