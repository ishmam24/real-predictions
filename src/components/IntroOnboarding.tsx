"use client";
// ============================================================================
// IntroOnboarding — the 3-screen "how it works" manual shown once to a new
// player, AFTER profile setup and BEFORE their first prediction. AppShell gates
// on profile.introSeen; the final "Start Predicting" button calls finishIntro()
// which flips that flag so the manual never returns.
//
// Committed-dark hero styling (var(--rp-ground)) to match Onboarding.tsx, so
// the whole first-run flow feels like one piece.
// ============================================================================
import { useState } from "react";
import { useStore } from "@/lib/store";

type Screen = { key: string; render: () => React.ReactNode };

export function IntroOnboarding() {
  const { finishIntro } = useStore();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  const screens: Screen[] = [
    {
      key: "how",
      render: () => (
        <>
          <div className="text-5xl mb-5">🗓️</div>
          <h2 className="rp-display text-2xl font-extrabold text-white mb-3">Five picks a week</h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "#9fb0c2" }}>
            Each gameweek we pick the five biggest Premier League fixtures. Call the
            scoreline for every one before the deadline — once the first match kicks
            off, your picks lock in.
          </p>
        </>
      ),
    },
    {
      key: "scoring",
      render: () => (
        <>
          <div className="text-5xl mb-5">🎯</div>
          <h2 className="rp-display text-2xl font-extrabold text-white mb-3">How you score</h2>
          <p className="text-[15px] leading-relaxed mb-5" style={{ color: "#9fb0c2" }}>
            Points land the moment a match is settled. Nail the details and climb the table.
          </p>
          <div className="flex flex-col gap-2.5 text-left">
            <ScoreRow pts="3" label="Exact scoreline" sub="Both numbers spot on" />
            <ScoreRow pts="2" label="Player of the Match" sub="Called the standout performer" />
            <ScoreRow pts="1" label="Correct result" sub="Right win, draw or loss" />
          </div>
        </>
      ),
    },
    {
      key: "pitch",
      render: () => (
        <>
          <div className="text-5xl mb-5">🏃</div>
          <h2 className="rp-display text-2xl font-extrabold text-white mb-3">
            Compete with your friends
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "#9fb0c2" }}>
            Predict the fixtures, show off your ball knowledge, and pick the Player of
            the Match. Build a mini-league, settle the debate, and see who really knows
            ball.
          </p>
        </>
      ),
    },
  ];

  const isLast = step === screens.length - 1;

  async function next() {
    if (isLast) {
      setBusy(true);
      try {
        await finishIntro();
        // AppShell reveals the app once introSeen flips to true.
      } catch {
        setBusy(false);
      }
      return;
    }
    setStep((s) => Math.min(s + 1, screens.length - 1));
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 py-10" style={{ background: "var(--rp-ground)" }}>
      {/* Brand header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">⚽️</div>
        <h1 className="rp-display text-xl font-extrabold text-white">Real Predictions</h1>
      </div>

      {/* Skippable manual — but every screen is quick, so we lead with the tour. */}
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-md mx-auto">
        <div className="card p-7 w-full">{screens[step].render()}</div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {screens.map((s, i) => (
            <span
              key={s.key}
              className="rounded-full transition-all"
              style={{
                width: i === step ? 22 : 8,
                height: 8,
                background: i === step ? "var(--rp-accent-fill)" : "var(--rp-border)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md mx-auto mt-6 flex items-center gap-3">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            className="px-4 py-3 rounded-xl font-semibold"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
          >
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          disabled={busy}
          onClick={next}
          className="btn-primary flex-1 py-3 rounded-xl font-semibold"
        >
          {isLast ? (busy ? "Setting up…" : "Start Predicting →") : "Next"}
        </button>
      </div>
    </div>
  );
}

function ScoreRow({ pts, label, sub }: { pts: string; label: string; sub: string }) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
      style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)" }}
    >
      <span
        className="flex items-center justify-center w-9 h-9 rounded-lg font-extrabold shrink-0"
        style={{ background: "var(--rp-accent-fill)", color: "var(--rp-on-accent)" }}
      >
        {pts}
      </span>
      <span className="flex flex-col">
        <span className="font-semibold text-sm" style={{ color: "var(--rp-text)" }}>{label}</span>
        <span className="text-xs" style={{ color: "var(--rp-muted)" }}>{sub}</span>
      </span>
    </div>
  );
}
