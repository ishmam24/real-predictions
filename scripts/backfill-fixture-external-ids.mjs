// ============================================================================
// One-time backfill: populate public.fixtures.external_id for fixtures that
// were seeded before the seed carried it.
//
// The auto-settle cron (/api/cron/settle) matches our fixtures to live FPL
// results by external_id (the FPL match id). Fixtures created by the current
// generator already carry it; this script fills it in for an already-seeded DB.
//
// It matches each of our fixtures to an FPL fixture by (home TLA, away TLA)
// within the same FPL gameweek — no reliance on teams.external_id being seeded.
//
// Usage (reads SUPABASE creds from .env.local):
//   node scripts/backfill-fixture-external-ids.mjs
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set.
// ============================================================================
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Minimal .env.local loader (no dotenv dependency in this project).
function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // no .env.local — rely on the ambient environment
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (in .env.local).");
  process.exit(1);
}

const FPL = "https://fantasy.premierleague.com/api";
const UA = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120 Safari/537.36" };
const fpl = async (path) => {
  const res = await fetch(`${FPL}${path}`, { headers: UA });
  if (!res.ok) throw new Error(`FPL ${path} -> ${res.status}`);
  return res.json();
};

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// Our fixtures + the TLAs of their teams.
const { data: fixtures, error: fxErr } = await supabase
  .from("fixtures")
  .select("id, external_id, home_team_id, away_team_id, home:home_team_id(tla), away:away_team_id(tla)");
if (fxErr) throw fxErr;

// FPL bootstrap (team id -> short_name) + all fixtures.
const boot = await fpl("/bootstrap-static/");
const tlaOf = new Map(boot.teams.map((t) => [t.id, t.short_name]));
const allFpl = await fpl("/fixtures/");

// Index FPL matches by "HOMETLA-AWAYTLA".
const byPair = new Map();
for (const f of allFpl) {
  const key = `${tlaOf.get(f.team_h)}-${tlaOf.get(f.team_a)}`;
  byPair.set(key, f.id);
}

let updated = 0;
for (const fx of fixtures) {
  if (fx.external_id) continue; // already set
  const key = `${fx.home?.tla}-${fx.away?.tla}`;
  const fplId = byPair.get(key);
  if (!fplId) {
    console.warn(`No FPL match for ${fx.id} (${key})`);
    continue;
  }
  const { error } = await supabase.from("fixtures").update({ external_id: fplId }).eq("id", fx.id);
  if (error) throw error;
  console.log(`${fx.id} (${key}) -> external_id ${fplId}`);
  updated++;
}

console.log(`Done — ${updated} fixture(s) backfilled.`);
