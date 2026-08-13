// Generates src/lib/mock-data.ts from the live FPL API: real current-season
// teams (with crest URLs), squads, and the next gameweek's fixtures with the
// top-5 auto-picked by the prominence model. Run: node scripts/generate-pl-data.mjs
import { writeFileSync } from "node:fs";
import { selectTopFixtures } from "../src/lib/prominence.ts";

const UA = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36" };
const api = "https://fantasy.premierleague.com/api";

const POS = { 1: "GK", 2: "DEF", 3: "MID", 4: "FWD" };
const COLORS = {
  ars: "#EF0107", avl: "#95BFE5", bou: "#DA291C", bre: "#E30613", bha: "#0057B8",
  che: "#034694", cov: "#59B7E4", cry: "#1B458F", eve: "#003399", ful: "#1a1a1a",
  hul: "#F5A12D", ips: "#3A64A3", lee: "#1D428A", liv: "#C8102E", mci: "#6CABDD",
  mun: "#DA291C", new: "#241F20", nfo: "#DD0000", tot: "#132257", sun: "#EB172B",
};
// PNG path covers every club (some promoted teams 403 on the SVG path).
const crest = (code) => `https://resources.premierleague.com/premierleague/badges/70/t${code}.png`;

const boot = await (await fetch(`${api}/bootstrap-static/`, { headers: UA })).json();

// Teams: id = lowercase short_name (keeps existing references like "ars" valid).
const teams = boot.teams.map((t) => ({
  id: t.short_name.toLowerCase(),
  name: t.name,
  tla: t.short_name,
  color: COLORS[t.short_name.toLowerCase()] ?? "#3d3d3d",
  crestUrl: crest(t.code),
}));
const teamByFplId = Object.fromEntries(boot.teams.map((t) => [t.id, t.short_name.toLowerCase()]));

// Next (or current) gameweek.
const event = boot.events.find((e) => e.is_next) || boot.events.find((e) => e.is_current) || boot.events[0];

// All fixtures of that gameweek, mapped for the prominence model.
const allFx = await (await fetch(`${api}/fixtures/?event=${event.id}`, { headers: UA })).json();
const candidates = allFx.map((f) => ({
  id: String(f.id),
  homeTla: boot.teams.find((t) => t.id === f.team_h).short_name,
  awayTla: boot.teams.find((t) => t.id === f.team_a).short_name,
  homeName: boot.teams.find((t) => t.id === f.team_h).name,
  awayName: boot.teams.find((t) => t.id === f.team_a).name,
  kickoff: f.kickoff_time,
  _h: teamByFplId[f.team_h],
  _a: teamByFplId[f.team_a],
}));

// Auto-pick the 5 most prominent (no standings pre-season -> stature + derbies).
const top5 = selectTopFixtures(candidates, undefined, 5);

const fixtures = top5.map((f, i) => ({
  id: `f${i + 1}`,
  gameweekId: "gw1",
  homeTeamId: f._h,
  awayTeamId: f._a,
  kickoff: f.kickoff,
  status: "scheduled",
  homeScore: null,
  awayScore: null,
  potmPlayerId: null,
}));

// Squads only for the teams in the 5 fixtures (enough for the POTM picker).
const fixtureTeamIds = new Set(fixtures.flatMap((f) => [f.homeTeamId, f.awayTeamId]));
const players = boot.elements
  .filter((e) => fixtureTeamIds.has(teamByFplId[e.team]))
  .map((e) => ({
    id: `p${e.id}`,
    teamId: teamByFplId[e.team],
    name: e.web_name,
    position: POS[e.element_type],
  }))
  .sort((a, b) => a.teamId.localeCompare(b.teamId) || a.name.localeCompare(b.name));

const currentGameweek = {
  id: "gw1",
  number: event.id,
  title: event.name,
  deadline: event.deadline_time,
  status: "open",
  fixtureIds: fixtures.map((f) => f.id),
};

const rivalRows = [
  { userId: "u_sam",   displayName: "Sam",   avatarEmoji: "🦊", favouriteTeamId: "liv", totalPoints: 41, exactScores: 6, rank: 0 },
  { userId: "u_priya", displayName: "Priya", avatarEmoji: "🐝", favouriteTeamId: "ars", totalPoints: 38, exactScores: 5, rank: 0 },
  { userId: "u_marco", displayName: "Marco", avatarEmoji: "🐺", favouriteTeamId: "mci", totalPoints: 33, exactScores: 4, rank: 0 },
  { userId: "u_kemi",  displayName: "Kemi",  avatarEmoji: "🦁", favouriteTeamId: "che", totalPoints: 29, exactScores: 3, rank: 0 },
  { userId: "u_dan",   displayName: "Dan",   avatarEmoji: "🐢", favouriteTeamId: "tot", totalPoints: 22, exactScores: 2, rank: 0 },
];

const out = `// ============================================================================
// AUTO-GENERATED from the live FPL API by scripts/generate-pl-data.mjs
// Real current-season Premier League teams (with crests), squads, and the
// upcoming gameweek's fixtures (top 5 auto-picked by the prominence model).
// Regenerate with: node scripts/generate-pl-data.mjs
// This stands in for the database in the prototype; Supabase replaces it later.
// ============================================================================
import type { Team, Player, Fixture, Gameweek, LeaderboardRow } from "./types";

export const teams: Team[] = ${JSON.stringify(teams, null, 2)};

export const players: Player[] = ${JSON.stringify(players, null, 2)};

export const currentGameweek: Gameweek = ${JSON.stringify(currentGameweek, null, 2)};

export const fixtures: Fixture[] = ${JSON.stringify(fixtures, null, 2)};

export const rivalRows: LeaderboardRow[] = ${JSON.stringify(rivalRows, null, 2)};

// ---- convenience lookups ---------------------------------------------------
export const teamById = (id: string) => teams.find((t) => t.id === id)!;
export const playerById = (id: string) => players.find((p) => p.id === id);
export const squadFor = (teamId: string) => players.filter((p) => p.teamId === teamId);
export const fixtureById = (id: string) => fixtures.find((f) => f.id === id)!;
`;

writeFileSync(new URL("../src/lib/mock-data.ts", import.meta.url), out);
console.log(`Wrote src/lib/mock-data.ts`);
console.log(`Gameweek ${currentGameweek.number} "${currentGameweek.title}" deadline ${currentGameweek.deadline}`);
console.log("Auto-picked fixtures:");
top5.forEach((f) => console.log(`  ${f.homeName} v ${f.awayName}  (${f.score}) [${f.tags.join(", ")}]`));
console.log(`Squads: ${players.length} players across ${fixtureTeamIds.size} teams`);
