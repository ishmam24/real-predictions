"use client";
// Predictions screen — the wizard in the main column, with a persistent
// standings rail alongside it on wide screens.
import { PredictionWizard } from "@/components/PredictionWizard";
import { StandingsRail } from "@/components/StandingsRail";

export default function PredictionsPage() {
  return (
    <div className="rp-rail-layout">
      <main>
        <PredictionWizard />
      </main>
      <StandingsRail />
    </div>
  );
}
