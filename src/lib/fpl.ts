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

// Uncached fetch — for live data (results, in-play stats) read by the settle
// cron and POTM suggestions, where a stale hour-old snapshot would be wrong.
async function getFresh<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: { "User-Agent": UA }, cache: "no-store" });
  if (!res.ok) throw new Error(`FPL ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

type BootTeam = { id: number; short_name: string; name: string };
type BootEvent = { id: number; name: string; deadline_time: string; is_next: boolean; is_current: boolean };
type BootElement = { id: number; team: number; web_name: string };
type Bootstrap = { teams: BootTeam[]; events: BootEvent[]; elements: BootElement[] };
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

// ----------------------------------------------------------------------------
// Live results — keyed by FPL match id, for the auto-settle cron. Uncached so a
// match that just finished is reflected immediately. Re-reading also returns
// the current kickoff_time, which is how postponements self-correct: a moved
// match simply isn't `finished` yet at its old time and settles after the new.
// ----------------------------------------------------------------------------
export type FplResult = {
  finished: boolean;
  homeScore: number | null;
  awayScore: number | null;
  kickoff: string | null;
};

export async function getResultsByMatchId(): Promise<Map<number, FplResult>> {
  const all = await getFresh<FplFixture[]>("/fixtures/");
  const map = new Map<number, FplResult>();
  for (const f of all) {
    map.set(f.id, {
      finished: f.finished,
      homeScore: f.team_h_score,
      awayScore: f.team_a_score,
      kickoff: f.kickoff_time,
    });
  }
  return map;
}

// ----------------------------------------------------------------------------
// Player of the Match candidates. No official/free feed exposes the actual
// POTM, so we surface the standout performers of a fixture ranked by BPS (the
// Bonus Points System) — the same official stat the Premier League uses to
// award bonus points. The admin confirms the real POTM against the official
// site; these are just suggestions.
// ----------------------------------------------------------------------------
export type PotmCandidate = { fplElementId: number; teamFplId: number; webName: string; bps: number };

type LiveElement = { id: number; stats: { bps: number } };

export async function getPotmCandidates(fplMatchId: number, limit = 5): Promise<PotmCandidate[]> {
  const [boot, fixtures] = await Promise.all([
    get<Bootstrap>("/bootstrap-static/"),
    getFresh<FplFixture[]>("/fixtures/"),
  ]);
  const match = fixtures.find((f) => f.id === fplMatchId);
  if (!match || match.event == null) return [];

  const teamOf = new Map(boot.elements.map((e) => [e.id, e.team] as const));
  const nameOf = new Map(boot.elements.map((e) => [e.id, e.web_name] as const));
  const inMatch = new Set([match.team_h, match.team_a]);

  const live = await getFresh<{ elements: LiveElement[] }>(`/event/${match.event}/live/`);
  return live.elements
    .map((e) => ({
      fplElementId: e.id,
      teamFplId: teamOf.get(e.id) ?? -1,
      webName: nameOf.get(e.id) ?? "",
      bps: e.stats?.bps ?? 0,
    }))
    .filter((c) => inMatch.has(c.teamFplId) && c.bps > 0)
    .sort((a, b) => b.bps - a.bps)
    .slice(0, limit);
}
