"use client";
// ============================================================================
// Prediction wizard — a Google-Forms-style flow.
//   • One game per page: pick the scoreline + Player of the Match
//   • Move through all 5 fixtures with Next / Back
//   • A final Review page shows every pick before you Submit
// Predictions autosave to the store as you go, so nothing is lost; "Submit"
// locks them in for the gameweek (still editable until the deadline).
// ============================================================================
import { useState, useEffect } from "react";
import type { Fixture } from "@/lib/types";
import { teamById, squadFor, playerById } from "@/lib/mock-data";
import { useStore, currentGameweek } from "@/lib/store";
import { fixtures as allFixtures } from "@/lib/mock-data";
import { TeamBadge } from "./TeamBadge";
import { PotmPicker } from "./PotmPicker";
import { Countdown } from "./Countdown";

// A stable clock that ticks on an interval (Date.now() in the render body is
// impure; reading it via state keeps the component pure and predictable).
function useClock(intervalMs = 30000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function PredictionWizard() {
  const { predictions, submitGameweek, isSubmitted } = useStore();
  const now = useClock();
  const fixtures = allFixtures.filter((f) => f.gameweekId === currentGameweek.id);
  const deadlinePassed = now >= new Date(currentGameweek.deadline).getTime();
  const submitted = isSubmitted(currentGameweek.id);

  const total = fixtures.length;
  const [step, setStep] = useState(0);         // 0..total-1 = fixtures, total = review
  const [editing, setEditing] = useState(false);

  // If already submitted (and not actively editing), show the confirmation summary.
  const showSummary = submitted && !editing;

  const complete = (f: Fixture) => {
    const p = predictions[f.id];
    return !!p && p.homeScore != null && p.awayScore != null;
  };
  const allComplete = fixtures.every(complete);

  function goReview() {
    setStep(total);
  }

  if (deadlinePassed) {
    return <LockedSummary fixtures={fixtures} />;
  }

  if (showSummary) {
    return (
      <SubmittedSummary
        fixtures={fixtures}
        onEdit={() => { setEditing(true); setStep(0); }}
      />
    );
  }

  // ----- Review page -----
  if (step === total) {
    return (
      <ReviewPage
        fixtures={fixtures}
        onEditFixture={(i) => setStep(i)}
        onBack={() => setStep(total - 1)}
        allComplete={allComplete}
        onSubmit={() => { submitGameweek(currentGameweek.id); setEditing(false); }}
      />
    );
  }

  // ----- Fixture step -----
  const fixture = fixtures[step];
  return (
    <FixtureStep
      key={fixture.id}
      fixture={fixture}
      index={step}
      total={total}
      canProceed={complete(fixture)}
      onBack={step === 0 ? undefined : () => setStep(step - 1)}
      onNext={() => (step === total - 1 ? goReview() : setStep(step + 1))}
      isLast={step === total - 1}
    />
  );
}

// ---------------------------------------------------------------------------
// A single fixture page: matchup, scoreline, POTM picker.
// ---------------------------------------------------------------------------
function FixtureStep({
  fixture, index, total, canProceed, onBack, onNext, isLast,
}: {
  fixture: Fixture; index: number; total: number; canProceed: boolean;
  onBack?: () => void; onNext: () => void; isLast: boolean;
}) {
  const { predictions, savePrediction } = useStore();
  const home = teamById(fixture.homeTeamId);
  const away = teamById(fixture.awayTeamId);
  const existing = predictions[fixture.id];

  const [h, setH] = useState(existing?.homeScore != null ? String(existing.homeScore) : "");
  const [a, setA] = useState(existing?.awayScore != null ? String(existing.awayScore) : "");
  const [potm, setPotm] = useState<string | null>(existing?.potmPlayerId ?? null);

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

  const kickoff = new Date(fixture.kickoff).toLocaleString(undefined, {
    weekday: "long", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-4 pb-28">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--rp-muted)" }}>
          <span>Game {index + 1} of {total}</span>
          <Countdown to={currentGameweek.deadline} />
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--rp-border)" }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${((index + 1) / (total + 1)) * 100}%`, background: "var(--rp-accent)" }} />
        </div>
      </div>

      {/* Matchup */}
      <p className="text-center text-xs mb-4" style={{ color: "var(--rp-muted)" }}>{kickoff}</p>
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamBadge team={home} size={64} />
          <span className="font-bold text-center text-sm">{home.name}</span>
        </div>
        <span className="px-3 text-sm font-bold" style={{ color: "var(--rp-muted)" }}>vs</span>
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamBadge team={away} size={64} />
          <span className="font-bold text-center text-sm">{away.name}</span>
        </div>
      </div>

      {/* Scoreline */}
      <p className="text-center text-sm font-semibold mb-2">Your predicted score</p>
      <div className="flex items-center justify-center gap-3 mb-8">
        <input value={h} onChange={(e) => { setH(e.target.value); commit({ h: e.target.value }); }}
          type="number" min={0} inputMode="numeric" placeholder="–"
          className="score-input w-20 h-20 text-center text-4xl font-extrabold rounded-2xl"
          style={{ background: "var(--rp-surface)", border: "2px solid var(--rp-border)", color: "var(--rp-text)" }} />
        <span className="text-2xl font-bold" style={{ color: "var(--rp-muted)" }}>:</span>
        <input value={a} onChange={(e) => { setA(e.target.value); commit({ a: e.target.value }); }}
          type="number" min={0} inputMode="numeric" placeholder="–"
          className="score-input w-20 h-20 text-center text-4xl font-extrabold rounded-2xl"
          style={{ background: "var(--rp-surface)", border: "2px solid var(--rp-border)", color: "var(--rp-text)" }} />
      </div>

      {/* POTM */}
      <p className="text-center text-sm font-semibold mb-1">⭐ Player of the Match <span style={{ color: "var(--rp-muted)" }}>(+2 pts)</span></p>
      <p className="text-center text-xs mb-3" style={{ color: "var(--rp-muted)" }}>Pick from either squad</p>
      <PotmPicker
        homeTeam={home} awayTeam={away}
        homeSquad={squadFor(home.id)} awaySquad={squadFor(away.id)}
        selectedPlayerId={potm}
        onSelect={(pid) => { setPotm(pid); commit({ p: pid }); }}
      />

      {/* Nav */}
      <div className="flex gap-3 mt-8">
        {onBack && (
          <button onClick={onBack} className="px-5 py-3 rounded-xl font-semibold"
            style={{ background: "var(--rp-surface)", border: "1px solid var(--rp-border)" }}>
            ← Back
          </button>
        )}
        <button onClick={onNext} disabled={!canProceed}
          className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-40"
          style={{ background: "var(--rp-accent)" }}>
          {canProceed ? (isLast ? "Review picks →" : "Next game →") : "Enter a score to continue"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Review page — every pick at a glance, edit any, then submit.
// ---------------------------------------------------------------------------
function ReviewPage({
  fixtures, onEditFixture, onBack, onSubmit, allComplete,
}: {
  fixtures: Fixture[]; onEditFixture: (i: number) => void; onBack: () => void;
  onSubmit: () => void; allComplete: boolean;
}) {
  const { predictions } = useStore();
  return (
    <div className="px-5 pt-5 pb-28">
      <h1 className="text-2xl font-extrabold mb-1">Review your picks</h1>
      <p className="text-sm mb-5" style={{ color: "var(--rp-muted)" }}>
        Check everything, then submit. You can still edit until the deadline.
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {fixtures.map((f, i) => {
          const p = predictions[f.id];
          const home = teamById(f.homeTeamId);
          const away = teamById(f.awayTeamId);
          const done = p && p.homeScore != null && p.awayScore != null;
          const potmName = p?.potmPlayerId ? playerById(p.potmPlayerId)?.name : null;
          return (
            <button key={f.id} onClick={() => onEditFixture(i)}
              className="card p-4 text-left flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <TeamBadge team={home} size={24} />
                  <span>{done ? `${p!.homeScore} – ${p!.awayScore}` : "—"}</span>
                  <TeamBadge team={away} size={24} />
                </div>
                <p className="text-xs mt-1" style={{ color: potmName ? "var(--rp-muted)" : "var(--rp-accent)" }}>
                  {potmName ? `⭐ ${potmName}` : "No Player of the Match picked"}
                </p>
              </div>
              <span className="text-xs font-semibold" style={{ color: "var(--rp-accent)" }}>Edit</span>
            </button>
          );
        })}
      </div>

      {!allComplete && (
        <p className="text-center text-xs mb-3" style={{ color: "var(--rp-accent)" }}>
          Some games still need a score — tap one to finish.
        </p>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-xl font-semibold"
          style={{ background: "var(--rp-surface)", border: "1px solid var(--rp-border)" }}>
          ← Back
        </button>
        <button onClick={onSubmit} disabled={!allComplete}
          className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-40"
          style={{ background: "var(--rp-accent)" }}>
          Submit predictions
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// After submitting — confirmation + editable summary.
// ---------------------------------------------------------------------------
function SubmittedSummary({ fixtures, onEdit }: { fixtures: Fixture[]; onEdit: () => void }) {
  const { predictions } = useStore();
  return (
    <div className="px-5 pt-8 pb-28">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">✅</div>
        <h1 className="text-2xl font-extrabold">Predictions in!</h1>
        <p className="text-sm mt-1" style={{ color: "var(--rp-muted)" }}>
          Gameweek {currentGameweek.number} locked in. Edit any time before the deadline.
        </p>
        <div className="mt-2"><Countdown to={currentGameweek.deadline} /></div>
      </div>

      <PicksList fixtures={fixtures} predictions={predictions} />

      <button onClick={onEdit}
        className="w-full mt-6 py-3 rounded-xl font-semibold text-white"
        style={{ background: "var(--rp-accent)" }}>
        Edit predictions
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// After the deadline — read-only, with points once results are settled.
// ---------------------------------------------------------------------------
function LockedSummary({ fixtures }: { fixtures: Fixture[] }) {
  const { predictions } = useStore();
  return (
    <div className="px-5 pt-8 pb-28">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🔒</div>
        <h1 className="text-2xl font-extrabold">Predictions locked</h1>
        <p className="text-sm mt-1" style={{ color: "var(--rp-muted)" }}>
          Gameweek {currentGameweek.number} is underway. Points appear as results come in.
        </p>
      </div>
      <PicksList fixtures={fixtures} predictions={predictions} />
    </div>
  );
}

function PicksList({ fixtures, predictions }: { fixtures: Fixture[]; predictions: Record<string, import("@/lib/types").Prediction> }) {
  return (
    <div className="flex flex-col gap-2">
      {fixtures.map((f) => {
        const p = predictions[f.id];
        const home = teamById(f.homeTeamId);
        const away = teamById(f.awayTeamId);
        const potmName = p?.potmPlayerId ? playerById(p.potmPlayerId)?.name : null;
        return (
          <div key={f.id} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <TeamBadge team={home} size={24} />
              <span>{p && p.homeScore != null ? `${p.homeScore} – ${p.awayScore}` : "—"}</span>
              <TeamBadge team={away} size={24} />
            </div>
            <span className="text-xs" style={{ color: "var(--rp-muted)" }}>
              {potmName ? `⭐ ${potmName}` : "No POTM"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
