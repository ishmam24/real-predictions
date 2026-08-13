"use client";
// ============================================================================
// Prediction board — the "Broadcast Deck" Predict screen. Every fixture in the
// gameweek is shown at once as a scoreboard card you fill in place; there's no
// step-through wizard. Predictions autosave as you go. "Confirm" submits them
// and then stays DISABLED until you change a pick, at which point it re-enables
// as "Update picks". After the deadline the cards render read-only.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import type { Fixture } from "@/lib/types";
import { fixtures as allFixtures } from "@/lib/mock-data";
import { useStore, currentGameweek } from "@/lib/store";
import { FixtureCard } from "./FixtureCard";

export function PredictionBoard() {
  const { predictions, submitGameweek, hydrated, saveError } = useStore();

  const fixtures = allFixtures.filter((f) => f.gameweekId === currentGameweek.id);
  const total = fixtures.length;

  // The deadline is far off in the prototype, so a one-shot read is fine here.
  const [now] = useState(() => Date.now());
  const deadlinePassed = now >= new Date(currentGameweek.deadline).getTime();

  const isComplete = (f: Fixture) => {
    const p = predictions[f.id];
    return !!p && p.homeScore != null && p.awayScore != null;
  };
  const done = fixtures.filter(isComplete).length;
  const allComplete = done === total;

  // A fingerprint of the current picks. When it differs from the last submitted
  // fingerprint, the picks are "dirty" and the button re-enables.
  const currentKey = JSON.stringify(
    fixtures.map((f) => {
      const p = predictions[f.id];
      return p ? [p.homeScore ?? null, p.awayScore ?? null, p.potmPlayerId ?? null] : null;
    })
  );
  const [submittedKey, setSubmittedKey] = useState<string | null>(null);

  // If a full set of picks was already saved when the player arrives, treat it
  // as already-submitted so the button starts disabled until they change one.
  const inited = useRef(false);
  useEffect(() => {
    if (inited.current || !hydrated) return;
    inited.current = true;
    if (allComplete) setSubmittedKey(currentKey);
  }, [hydrated, allComplete, currentKey]);

  const submittedUnchanged = submittedKey !== null && submittedKey === currentKey;

  async function handleSubmit() {
    try {
      await submitGameweek(currentGameweek.id);
      setSubmittedKey(currentKey);
    } catch {
      // The store surfaces the failure via saveError; keep the button active.
    }
  }

  return (
    <div className="rp-board">
      <div className="rp-board-head">
        <h1 className="rp-display">Gameweek {currentGameweek.number}</h1>
        {!deadlinePassed && (
          <span className="s">Predict all {total} · {done} done</span>
        )}
      </div>

      {saveError && (
        <div className="rp-banner" style={{ color: "#ff6b6b" }}>
          <span>⚠️</span>
          <span>{saveError}</span>
        </div>
      )}

      {submittedUnchanged && !deadlinePassed && (
        <div className="rp-banner">
          <span>✅</span>
          <span>Predictions in — edit any pick to update before the deadline.</span>
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
          onClick={handleSubmit}
          disabled={!allComplete || submittedUnchanged}
          className="btn-primary rp-confirm rp-display"
        >
          {!allComplete
            ? `Predict all ${total} to confirm`
            : submittedUnchanged
              ? "Picks submitted ✓"
              : submittedKey
                ? "Update picks →"
                : `Confirm ${total} picks →`}
        </button>
      )}
    </div>
  );
}
