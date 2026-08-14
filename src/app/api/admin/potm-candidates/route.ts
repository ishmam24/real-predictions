// ============================================================================
// GET /api/admin/potm-candidates?fixture=<fixtureId>
// Admin-only. Suggests Player-of-the-Match candidates for a settled fixture:
// the standout performers ranked by BPS (the official Bonus Points System),
// pulled from the FPL live feed. There is no free/official feed for the ACTUAL
// POTM, so the admin confirms the real one against premierleague.com — these
// are just a shortlist to pick from.
//
// FPL element ids map to our player ids as `p<elementId>` (see the seed in
// scripts/generate-pl-data.mjs), so we can return them as our own Player rows,
// filtered to players that exist in our squads.
// ============================================================================
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPotmCandidates } from "@/lib/fpl";
import { playerById, teamById } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Admins only" }, { status: 403 });
  }

  const fixtureId = request.nextUrl.searchParams.get("fixture");
  if (!fixtureId) {
    return NextResponse.json({ error: "Missing ?fixture" }, { status: 400 });
  }

  const { data: fixture } = await supabase
    .from("fixtures")
    .select("id, external_id")
    .eq("id", fixtureId)
    .maybeSingle();
  if (!fixture?.external_id) {
    // Not yet mapped to an FPL match (needs the external_id backfill) — no data.
    return NextResponse.json({ candidates: [] });
  }

  const raw = await getPotmCandidates(fixture.external_id as number);

  // Keep only candidates that exist in our squads; shape them as our Player rows
  // plus the bps that ranked them.
  const candidates = raw
    .map((c) => {
      const player = playerById(`p${c.fplElementId}`);
      if (!player) return null;
      const team = teamById(player.teamId);
      return {
        id: player.id,
        name: player.name,
        teamId: player.teamId,
        teamName: team?.name ?? "",
        position: player.position,
        bps: c.bps,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return NextResponse.json({ candidates });
}
