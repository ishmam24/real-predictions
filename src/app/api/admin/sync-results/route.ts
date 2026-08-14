// ============================================================================
// POST /api/admin/sync-results
// Admin-only, on-demand trigger for the same auto-settle sweep the cron runs —
// so an admin can pull in finished results without waiting for the schedule
// (and to exercise the path while testing). Authorised by the admin's session
// (not CRON_SECRET, which must never reach the browser); the sweep itself runs
// with the service role so its writes bypass RLS.
// ============================================================================
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { settleFinishedFixtures } from "@/lib/settle";

export async function POST() {
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

  try {
    const report = await settleFinishedFixtures(createAdminClient());
    return NextResponse.json({ ok: true, ...report });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "settle failed" }, { status: 500 });
  }
}
