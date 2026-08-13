"use client";
// Predictions screen — the scoreboard board in the main column, with a
// persistent standings rail alongside it on wide screens.
import { PredictionBoard } from "@/components/PredictionBoard";
import { StandingsRail } from "@/components/StandingsRail";

export default function PredictionsPage() {
  return (
    <div className="rp-rail-layout">
      <main>
        <PredictionBoard />
      </main>
      <StandingsRail />
    </div>
  );
}
