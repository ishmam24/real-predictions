// Supabase client with the SERVICE ROLE key — bypasses Row Level Security.
//
// Server-only. Never import this from a Client Component: the service key must
// never reach the browser. It exists for trusted server jobs that need to write
// rows no end user is allowed to (e.g. the auto-settle cron writing fixture
// scores, which RLS restricts to admins).
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY (and NEXT_PUBLIC_SUPABASE_URL) must be set");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
