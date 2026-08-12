// ============================================================================
// GET /api/admin/suggest-gameweek
// Returns the auto-picked top 5 fixtures for the next matchday, plus the full
// ranked list and reason tags. Uses live football-data.org data when a token
// is configured; otherwise falls back to the sample matchday so the feature is
// fully demoable. (Admin-only auth is added when Supabase auth is wired in.)
// ============================================================================
import { NextResponse } from "next/server";
import { selectTopFixtures, scoreFixture } from "@/lib/prominence";
import { hasToken, getStandings, getNextMatchdayFixtures } from "@/lib/football-data";
import { sampleMatchday, sampleStandings } from "@/lib/sample-matchday";

export async function GET() {
  let source: "live" | "sample" = "sample";
  let matchday: number | null = null;
  let fixtures = sampleMatchday;
  let standings = sampleStandings;

  let droppedInvalid = 0;

  if (hasToken()) {
    try {
      const [table, next] = await Promise.all([getStandings(), getNextMatchdayFixtures()]);
      if (next.fixtures.length) {
        source = "live";
        matchday = next.matchday;
        standings = table;

        // Integrity guard: the free feed sometimes lists fixtures with clubs
        // that aren't actually in the PL (stale/placeholder opponents). Only
        // trust a fixture when BOTH teams appear in the current standings.
        // If the table is empty (pre-season), we can't validate, so accept all.
        const plTeams = new Set(Object.keys(table));
        const clean =
          plTeams.size > 0
            ? next.fixtures.filter((f) => plTeams.has(f.homeTla) && plTeams.has(f.awayTla))
            : next.fixtures;
        droppedInvalid = next.fixtures.length - clean.length;
        fixtures = clean;
      }
    } catch (err) {
      // Fall back to the sample if the API is down/rate-limited — never break
      // the admin screen just because the feed hiccuped.
      console.error("suggest-gameweek: live fetch failed, using sample:", err);
    }
  }

  const ranked = fixtures
    .map((f) => scoreFixture(f, standings))
    .sort((a, b) => b.score - a.score);
  const top5 = selectTopFixtures(fixtures, standings, 5);

  return NextResponse.json({ source, matchday, droppedInvalid, top5, ranked });
}
