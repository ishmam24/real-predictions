// A realistic sample matchday used as a fallback so the auto-pick feature is
// fully demoable before a football-data.org API token is configured. Once the
// token is set, live data replaces this automatically.
import type { ProminenceInput, StandingMap } from "./prominence";

export const sampleMatchday: ProminenceInput[] = [
  { id: "s1", homeTla: "MCI", awayTla: "ARS", homeName: "Man City",   awayName: "Arsenal",     kickoff: "2026-01-10T12:30:00Z" },
  { id: "s2", homeTla: "LIV", awayTla: "EVE", homeName: "Liverpool",  awayName: "Everton",     kickoff: "2026-01-10T15:00:00Z" },
  { id: "s3", homeTla: "MUN", awayTla: "TOT", homeName: "Man United", awayName: "Tottenham",   kickoff: "2026-01-10T15:00:00Z" },
  { id: "s4", homeTla: "CHE", awayTla: "NEW", homeName: "Chelsea",    awayName: "Newcastle",   kickoff: "2026-01-10T17:30:00Z" },
  { id: "s5", homeTla: "BHA", awayTla: "AVL", homeName: "Brighton",   awayName: "Aston Villa", kickoff: "2026-01-11T14:00:00Z" },
  { id: "s6", homeTla: "BUR", awayTla: "SHU", homeName: "Burnley",    awayName: "Sheffield Utd", kickoff: "2026-01-11T14:00:00Z" },
  { id: "s7", homeTla: "FUL", awayTla: "CRY", homeName: "Fulham",     awayName: "Crystal Palace", kickoff: "2026-01-11T14:00:00Z" },
  { id: "s8", homeTla: "WOL", awayTla: "BOU", homeName: "Wolves",     awayName: "Bournemouth", kickoff: "2026-01-11T14:00:00Z" },
  { id: "s9", homeTla: "BRE", awayTla: "WHU", homeName: "Brentford",  awayName: "West Ham",    kickoff: "2026-01-11T16:30:00Z" },
  { id: "s10", homeTla: "NFO", awayTla: "LUT", homeName: "Nott'm Forest", awayName: "Luton",   kickoff: "2026-01-12T20:00:00Z" },
];

export const sampleStandings: StandingMap = {
  MCI: 1, ARS: 2, LIV: 3, TOT: 4, MUN: 5, NEW: 6, CHE: 7, AVL: 8, BHA: 9, WHU: 10,
  FUL: 11, CRY: 12, BRE: 13, WOL: 14, BOU: 15, EVE: 16, NFO: 17, BUR: 18, SHU: 19, LUT: 20,
};
