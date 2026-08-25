// ============================================================================
// Publish any gameweeks/fixtures from src/lib/mock-data.ts that the live DB
// doesn't have yet. Safe to re-run:
//   * gameweeks are upserted (id, number, title, deadline, status) — no
//     fixture-level data lives there, so this can never touch scores.
//   * fixtures are only ever INSERTed, never upserted/updated — an existing
//     fixture (which may already carry a settled score) is left untouched;
//     only fixtures whose id isn't in the DB yet get added.
//
// Usage (reads SUPABASE creds from .env.local):
//   node --experimental-strip-types scripts/publish-gameweek.mjs
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set.
// ============================================================================
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { gameweeks, fixtures } from "../src/lib/mock-data.ts";

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
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// ---- gameweeks: upsert, no fixture-level columns here so it's always safe ----
const gwRows = gameweeks.map((gw) => ({
  id: gw.id,
  number: gw.number,
  title: gw.title,
  deadline: gw.deadline,
  status: gw.status,
}));
const { error: gwErr } = await supabase.from("gameweeks").upsert(gwRows, { onConflict: "id" });
if (gwErr) throw gwErr;
console.log(`Upserted ${gwRows.length} gameweek(s): ${gwRows.map((g) => `${g.id} (${g.status})`).join(", ")}`);

// ---- fixtures: insert-only, so an already-settled fixture is never touched ----
const { data: existing, error: exErr } = await supabase.from("fixtures").select("id");
if (exErr) throw exErr;
const existingIds = new Set((existing ?? []).map((r) => r.id));

const newFixtures = fixtures.filter((f) => !existingIds.has(f.id));
if (newFixtures.length === 0) {
  console.log("No new fixtures to insert — DB already has every fixture from mock-data.ts.");
  process.exit(0);
}

const fxRows = newFixtures.map((f) => ({
  id: f.id,
  external_id: f.externalId ?? null,
  gameweek_id: f.gameweekId,
  home_team_id: f.homeTeamId,
  away_team_id: f.awayTeamId,
  kickoff_time: f.kickoff,
  status: f.status,
}));
const { error: fxErr } = await supabase.from("fixtures").insert(fxRows);
if (fxErr) throw fxErr;
console.log(`Inserted ${fxRows.length} new fixture(s): ${fxRows.map((f) => f.id).join(", ")}`);
