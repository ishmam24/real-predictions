"use client";
// Predictions screen — a Google-Forms-style wizard: one game per page,
// then a review page before submitting.
import { PredictionWizard } from "@/components/PredictionWizard";

export default function PredictionsPage() {
  return (
    <main>
      <PredictionWizard />
    </main>
  );
}
