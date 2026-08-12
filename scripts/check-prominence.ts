// Sanity check for the prominence model. Run: npx tsx scripts/check-prominence.ts
import { selectTopFixtures, scoreFixture, type ProminenceInput, type StandingMap } from "../src/lib/prominence";

// A plausible mid-season matchday.
const fixtures: ProminenceInput[] = [
  { id: "1", homeTla: "MCI", awayTla: "ARS", homeName: "Man City",   awayName: "Arsenal",     kickoff: "2026-01-10T12:30:00Z" },
  { id: "2", homeTla: "LIV", awayTla: "EVE", homeName: "Liverpool",  awayName: "Everton",     kickoff: "2026-01-10T15:00:00Z" },
  { id: "3", homeTla: "MUN", awayTla: "TOT", homeName: "Man United", awayName: "Tottenham",   kickoff: "2026-01-10T15:00:00Z" },
  { id: "4", homeTla: "CHE", awayTla: "NEW", homeName: "Chelsea",    awayName: "Newcastle",   kickoff: "2026-01-10T17:30:00Z" },
  { id: "5", homeTla: "BHA", awayTla: "AVL", homeName: "Brighton",   awayName: "Aston Villa", kickoff: "2026-01-11T14:00:00Z" },
  { id: "6", homeTla: "BUR", awayTla: "SHU", homeName: "Burnley",    awayName: "Sheffield Utd", kickoff: "2026-01-11T14:00:00Z" },
  { id: "7", homeTla: "FUL", awayTla: "CRY", homeName: "Fulham",     awayName: "Crystal Palace", kickoff: "2026-01-11T14:00:00Z" },
  { id: "8", homeTla: "WOL", awayTla: "BOU", homeName: "Wolves",     awayName: "Bournemouth", kickoff: "2026-01-11T14:00:00Z" },
  { id: "9", homeTla: "BRE", awayTla: "WHU", homeName: "Brentford",  awayName: "West Ham",    kickoff: "2026-01-11T16:30:00Z" },
  { id: "10", homeTla: "NFO", awayTla: "LUT", homeName: "Nott'm Forest", awayName: "Luton",   kickoff: "2026-01-12T20:00:00Z" },
];

const standings: StandingMap = {
  MCI: 1, ARS: 2, LIV: 3, TOT: 4, MUN: 5, NEW: 6, CHE: 7, AVL: 8, BHA: 9, WHU: 10,
  FUL: 11, CRY: 12, BRE: 13, WOL: 14, BOU: 15, EVE: 16, NFO: 17, BUR: 18, SHU: 19, LUT: 20,
};

console.log("=== Full ranking (with live standings) ===");
fixtures
  .map((f) => scoreFixture(f, standings))
  .sort((a, b) => b.score - a.score)
  .forEach((f) => {
    console.log(`${String(f.score).padStart(3)}  ${f.homeName} v ${f.awayName}  [${f.tags.join(", ")}]`);
  });

console.log("\n=== AUTO-PICKED TOP 5 ===");
selectTopFixtures(fixtures, standings, 5).forEach((f, i) => {
  console.log(`${i + 1}. ${f.homeName} v ${f.awayName}  (${f.score})  [${f.tags.join(", ")}]`);
});

console.log("\n=== Same matchday, NO standings yet (season opener) ===");
selectTopFixtures(fixtures, undefined, 5).forEach((f, i) => {
  console.log(`${i + 1}. ${f.homeName} v ${f.awayName}  (${f.score})  [${f.tags.join(", ")}]`);
});
