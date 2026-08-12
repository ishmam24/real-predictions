// ============================================================================
// Fantasy Premier League API client (server-side).
// Free, no API key, run by the Premier League itself — so teams and fixtures
// are authoritative and current-season. Undocumented/unofficial, so we send a
// browser User-Agent and cache aggressively to be a good citizen.
// ============================================================================
import type { ProminenceInput, StandingMap } from "./prominence";

const API = "https://fantasy.premierleague.com/api";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 3600 }, // 1h cache — fixtures don't change minute-to-minute
  });
  if (!res.ok) throw new Error(`FPL ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

type BootTeam = { id: number; short_name: string; name: string };
type BootEvent = { id: number; name: string; deadline_time: string; is_next: boolean; is_current: boolean };
type Bootstrap = { teams: BootTeam[]; events: BootEvent[] };
type FplFixture = {
  id: number;
  event: number | null;
  team_h: number;
  team_a: number;
  kickoff_time: string | null;
  finished: boolean;
  team_h_score: number | null;
  team_a_score: number | null;
};

// Build a { tla -> position } table from finished results (empty pre-season, so
// the prominence model leans on club stature + derbies until games are played).
function buildStandings(fixtures: FplFixture[], tlaOf: Map<number, string>): StandingMap {
  const rec = new Map<string, { pts: number; gd: number }>();
  const bump = (tla: string, pts: number, gd: number) => {
    const r = rec.get(tla) ?? { pts: 0, gd: 0 };
    r.pts += pts;
    r.gd += gd;
    rec.set(tla, r);
  };
  for (const f of fixtures) {
    if (!f.finished || f.team_h_score == null || f.team_a_score == null) continue;
    const h = tlaOf.get(f.team_h)!;
    const a = tlaOf.get(f.team_a)!;
    const diff = f.team_h_score - f.team_a_score;
    bump(h, diff > 0 ? 3 : diff === 0 ? 1 : 0, diff);
    bump(a, diff < 0 ? 3 : diff === 0 ? 1 : 0, -diff);
  }
  const sorted = [...rec.entries()].sort((x, y) => y[1].pts - x[1].pts || y[1].gd - x[1].gd);
  const table: StandingMap = {};
  sorted.forEach(([tla], i) => (table[tla] = i + 1));
  return table;
}

// The next gameweek's fixtures (for the prominence model) plus a live table.
export async function getNextGameweek(): Promise<{
  matchday: number | null;
  fixtures: ProminenceInput[];
  standings: StandingMap;
}> {
  const [boot, allFixtures] = await Promise.all([
    get<Bootstrap>("/bootstrap-static/"),
    get<FplFixture[]>("/fixtures/"),
  ]);

  const tlaOf = new Map(boot.teams.map((t) => [t.id, t.short_name] as const));
  const nameOf = new Map(boot.teams.map((t) => [t.id, t.name] as const));
  const standings = buildStandings(allFixtures, tlaOf);

  const event =
    boot.events.find((e) => e.is_next) ??
    boot.events.find((e) => e.is_current) ??
    boot.events[0];
  if (!event) return { matchday: null, fixtures: [], standings };

  const fixtures = allFixtures
    .filter((f) => f.event === event.id)
    .map<ProminenceInput>((f) => ({
      id: String(f.id),
      homeTla: tlaOf.get(f.team_h)!,
      awayTla: tlaOf.get(f.team_a)!,
      homeName: nameOf.get(f.team_h)!,
      awayName: nameOf.get(f.team_a)!,
      kickoff: f.kickoff_time ?? "",
    }));

  return { matchday: event.id, fixtures, standings };
}
