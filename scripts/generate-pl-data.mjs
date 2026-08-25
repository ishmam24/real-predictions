// Refreshes the `teams` and `players` blocks in src/lib/mock-data.ts from the
// live FPL API (real current-season clubs with crests, and full squads) —
// e.g. after a transfer window, or to bootstrap a new season. Everything else
// in that file (gameweeks, fixtures) is hand-maintained per gameweek — see
// scripts/publish-gameweek.mjs — and is left untouched here.
// Run: node --experimental-strip-types scripts/generate-pl-data.mjs
import { readFileSync, writeFileSync } from "node:fs";

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

const players = boot.elements
  .map((e) => ({
    id: `p${e.id}`,
    teamId: teamByFplId[e.team],
    name: e.web_name,
    position: POS[e.element_type],
  }))
  .sort((a, b) => a.teamId.localeCompare(b.teamId) || a.name.localeCompare(b.name));

// ---- splice the two blocks into the existing file, leaving the rest as-is ---
const path = new URL("../src/lib/mock-data.ts", import.meta.url);
const src = readFileSync(path, "utf8");

function replaceBlock(text, exportDecl, replacementValue) {
  const start = text.indexOf(exportDecl);
  if (start === -1) throw new Error(`Could not find "${exportDecl}" in mock-data.ts`);
  // Search from AFTER the declaration text, not `start` itself — exportDecl
  // contains a type annotation like "Team[]" whose own brackets would
  // otherwise be mistaken for the start of the array literal.
  const arrayStart = text.indexOf("[", start + exportDecl.length);
  // Walk bracket depth to find the matching close, so nested arrays/objects don't confuse it.
  let depth = 0, i = arrayStart;
  for (; i < text.length; i++) {
    if (text[i] === "[") depth++;
    else if (text[i] === "]") { depth--; if (depth === 0) break; }
  }
  const arrayEnd = i + 1; // include the closing ]
  return text.slice(0, arrayStart) + JSON.stringify(replacementValue, null, 2) + text.slice(arrayEnd);
}

let out = src;
out = replaceBlock(out, "export const teams: Team[] = ", teams);
out = replaceBlock(out, "export const players: Player[] = ", players);

writeFileSync(path, out);
console.log(`Refreshed teams (${teams.length}) and players (${players.length}) in src/lib/mock-data.ts.`);
console.log("gameweeks/fixtures were left untouched — publish new ones by hand + scripts/publish-gameweek.mjs.");
