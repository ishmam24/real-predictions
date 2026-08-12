// ============================================================================
// football-data.org client (server-side only — uses a secret API token).
// Free tier covers Premier League fixtures, scores, and standings, which is
// everything the prominence model needs. Get a free token at
// https://www.football-data.org/client/register and set it in .env.local:
//   FOOTBALL_DATA_API_TOKEN=your_token_here
// ============================================================================
import type { ProminenceInput, StandingMap } from "./prominence";

const BASE = "https://api.football-data.org/v4";
const COMPETITION = "PL"; // Premier League

export function hasToken(): boolean {
  return !!process.env.FOOTBALL_DATA_API_TOKEN;
}

async function api<T>(path: string): Promise<T> {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  if (!token) throw new Error("FOOTBALL_DATA_API_TOKEN is not set");
  const res = await fetch(`${BASE}${path}`, {
    headers: { "X-Auth-Token": token },
    // Cache for an hour — fixtures/standings don't change minute-to-minute,
    // and this keeps us well within the free-tier rate limit.
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`football-data.org ${path} -> ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// --- Response shapes (only the fields we use) -------------------------------
type ApiTeam = { tla: string; shortName: string; name: string };
type ApiMatch = {
  id: number;
  matchday: number;
  utcDate: string;
  status: string;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
};
type ApiStandingRow = { position: number; team: { tla: string } };

// Current league table as a { tla -> position } map. Empty at season start.
export async function getStandings(): Promise<StandingMap> {
  const data = await api<{ standings: { type: string; table: ApiStandingRow[] }[] }>(
    `/competitions/${COMPETITION}/standings`
  );
  const total = data.standings.find((s) => s.type === "TOTAL") ?? data.standings[0];
  const map: StandingMap = {};
  for (const row of total?.table ?? []) map[row.team.tla] = row.position;
  return map;
}

// All fixtures of the next upcoming matchday, shaped for the prominence model.
export async function getNextMatchdayFixtures(): Promise<{
  matchday: number | null;
  fixtures: ProminenceInput[];
}> {
  const data = await api<{ matches: ApiMatch[] }>(
    `/competitions/${COMPETITION}/matches?status=SCHEDULED`
  );
  if (!data.matches.length) return { matchday: null, fixtures: [] };

  // The soonest matchday still to be played.
  const nextMatchday = Math.min(...data.matches.map((m) => m.matchday));
  const fixtures = data.matches
    .filter((m) => m.matchday === nextMatchday)
    .map<ProminenceInput>((m) => ({
      id: String(m.id),
      homeTla: m.homeTeam.tla,
      awayTla: m.awayTeam.tla,
      homeName: m.homeTeam.shortName || m.homeTeam.name,
      awayName: m.awayTeam.shortName || m.awayTeam.name,
      kickoff: m.utcDate,
    }));

  return { matchday: nextMatchday, fixtures };
}
