// ============================================================================
// GET /api/admin/suggest-gameweek
// Returns the auto-picked top 5 fixtures for the next gameweek, plus the full
// ranked list and reason tags. Data comes from the Fantasy Premier League API
// (official, free, current-season). Falls back to a bundled sample if the feed
// is unreachable, so the admin screen never breaks.
// (Admin-only auth is added when Supabase auth is wired in.)
// ============================================================================
import { NextResponse } from "next/server";
import { selectTopFixtures, scoreFixture } from "@/lib/prominence";
import { getNextGameweek } from "@/lib/fpl";
import { sampleMatchday, sampleStandings } from "@/lib/sample-matchday";

export async function GET() {
  let source: "live" | "sample" = "sample";
  let matchday: number | null = null;
  let fixtures = sampleMatchday;
  let standings = sampleStandings;

  try {
    const gw = await getNextGameweek();
    if (gw.fixtures.length) {
      source = "live";
      matchday = gw.matchday;
      fixtures = gw.fixtures;
      standings = gw.standings;
    }
  } catch (err) {
    // Never break the admin screen just because the feed hiccuped.
    console.error("suggest-gameweek: FPL fetch failed, using sample:", err);
  }

  const ranked = fixtures
    .map((f) => scoreFixture(f, standings))
    .sort((a, b) => b.score - a.score);
  const top5 = selectTopFixtures(fixtures, standings, 5);

  return NextResponse.json({ source, matchday, top5, ranked });
}
