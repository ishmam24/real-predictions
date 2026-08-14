// ============================================================================
// GET /api/cron/settle
// Auto-settles finished fixtures. Meant to be hit on a schedule (Vercel Cron,
// pg_cron, or any external scheduler). vercel.json runs it once daily because
// the Vercel Hobby plan caps crons at daily; a match therefore settles on the
// next daily run after it finishes (worst case ~24h later). On a paid plan you
// can raise the frequency for near-real-time settlement — the logic is unchanged:
//
//   * We only look at a fixture once it is past kickoff + SETTLE_DELAY_MS, so we
//     never settle one mid-match.
//   * Authoritative "is it over?" comes from the FPL `finished` flag, not the
//     clock — extra time / stoppages won't settle early.
//   * Postponements self-correct: a moved match isn't `finished` at its old time
//     and its kickoff (re-read from FPL each run) shifts, so it settles after the
//     NEW kickoff instead.
//
// Scores are written and result points awarded immediately; POTM stays pending
// until an admin confirms it on /admin. The actual work lives in
// settleFinishedFixtures() so the admin "Sync now" button can reuse it.
// ============================================================================
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { settleFinishedFixtures } from "@/lib/settle";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await settleFinishedFixtures(createAdminClient());
    return NextResponse.json({ ok: true, ...report });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "settle failed" }, { status: 500 });
  }
}
