// ============================================================================
// Shared auto-settle sweep. Finds finished fixtures whose result hasn't been
// recorded yet, writes the score, and awards result points (POTM stays pending
// until an admin confirms it). Used by two entry points:
//   * /api/cron/settle        — scheduled, authorised by CRON_SECRET
//   * /api/admin/sync-results — on-demand, authorised by an admin session
// Both pass a service-role client so the writes bypass RLS.
//
// See the route/DB comments for why a kickoff+delay gate plus the FPL `finished`
// flag correctly handles "settle ~2h after kickoff" and postponements.
// ============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import { getResultsByMatchId } from "./fpl";

// A match plus stoppage and the brief lag before FPL marks it finished fits
// comfortably in 2 hours, so we don't even look before then.
export const SETTLE_DELAY_MS = 2 * 60 * 60 * 1000;

export type SettleReport = {
  settled: string[];
  skipped: { id: string; reason: string }[];
  checked: number;
};

export async function settleFinishedFixtures(supabase: SupabaseClient): Promise<SettleReport> {
  const settled: string[] = [];
  const skipped: { id: string; reason: string }[] = [];

  // Candidates: mapped to an FPL match and not yet scored.
  const { data: fixtures, error } = await supabase
    .from("fixtures")
    .select("id, external_id, kickoff_time, home_score")
    .not("external_id", "is", null)
    .is("home_score", null);
  if (error) throw new Error(error.message);

  const results = await getResultsByMatchId();
  const now = Date.now();

  for (const f of fixtures ?? []) {
    const kickoff = f.kickoff_time ? Date.parse(f.kickoff_time) : NaN;
    if (Number.isNaN(kickoff) || now < kickoff + SETTLE_DELAY_MS) {
      skipped.push({ id: f.id, reason: "not yet due" });
      continue;
    }
    const r = results.get(f.external_id as number);
    if (!r || !r.finished || r.homeScore == null || r.awayScore == null) {
      skipped.push({ id: f.id, reason: "no finished result" });
      continue;
    }

    const { error: upErr } = await supabase
      .from("fixtures")
      .update({ home_score: r.homeScore, away_score: r.awayScore, status: "finished" })
      .eq("id", f.id);
    if (upErr) {
      skipped.push({ id: f.id, reason: `score write failed: ${upErr.message}` });
      continue;
    }
    const { error: settleErr } = await supabase.rpc("settle_fixture", { p_fixture_id: f.id });
    if (settleErr) {
      skipped.push({ id: f.id, reason: `settle failed: ${settleErr.message}` });
      continue;
    }
    settled.push(f.id);
  }

  return { settled, skipped, checked: fixtures?.length ?? 0 };
}
