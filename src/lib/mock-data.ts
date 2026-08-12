// ============================================================================
// Mock data for the prototype.
// This stands in for the database so the app runs with zero setup. When we
// connect Supabase, this file gets replaced by real queries — nothing else
// in the UI needs to change.
// ============================================================================
import type { Team, Player, Fixture, Gameweek, LeaderboardRow } from "./types";

export const teams: Team[] = [
  { id: "ars", name: "Arsenal",        tla: "ARS", color: "#EF0107" },
  { id: "new", name: "Newcastle",      tla: "NEW", color: "#241F20" },
  { id: "mci", name: "Man City",       tla: "MCI", color: "#6CABDD" },
  { id: "liv", name: "Liverpool",      tla: "LIV", color: "#C8102E" },
  { id: "che", name: "Chelsea",        tla: "CHE", color: "#034694" },
  { id: "mun", name: "Man United",     tla: "MUN", color: "#DA291C" },
  { id: "tot", name: "Tottenham",      tla: "TOT", color: "#132257" },
  { id: "avl", name: "Aston Villa",    tla: "AVL", color: "#95BFE5" },
  { id: "bha", name: "Brighton",       tla: "BHA", color: "#0057B8" },
  { id: "whu", name: "West Ham",       tla: "WHU", color: "#7A263A" },
];

// A compact squad per team (enough for a realistic POTM picker in the prototype).
export const players: Player[] = [
  // Arsenal
  { id: "ars1", teamId: "ars", name: "Bukayo Saka",       position: "FWD" },
  { id: "ars2", teamId: "ars", name: "Martin Ødegaard",   position: "MID" },
  { id: "ars3", teamId: "ars", name: "Declan Rice",       position: "MID" },
  { id: "ars4", teamId: "ars", name: "William Saliba",    position: "DEF" },
  { id: "ars5", teamId: "ars", name: "Kai Havertz",       position: "FWD" },
  { id: "ars6", teamId: "ars", name: "David Raya",        position: "GK"  },
  // Newcastle
  { id: "new1", teamId: "new", name: "Alexander Isak",    position: "FWD" },
  { id: "new2", teamId: "new", name: "Bruno Guimarães",   position: "MID" },
  { id: "new3", teamId: "new", name: "Anthony Gordon",    position: "FWD" },
  { id: "new4", teamId: "new", name: "Sven Botman",       position: "DEF" },
  { id: "new5", teamId: "new", name: "Nick Pope",         position: "GK"  },
  // Man City
  { id: "mci1", teamId: "mci", name: "Erling Haaland",    position: "FWD" },
  { id: "mci2", teamId: "mci", name: "Phil Foden",        position: "MID" },
  { id: "mci3", teamId: "mci", name: "Rodri",             position: "MID" },
  { id: "mci4", teamId: "mci", name: "Rúben Dias",        position: "DEF" },
  { id: "mci5", teamId: "mci", name: "Ederson",          position: "GK"  },
  // Liverpool
  { id: "liv1", teamId: "liv", name: "Mohamed Salah",     position: "FWD" },
  { id: "liv2", teamId: "liv", name: "Virgil van Dijk",   position: "DEF" },
  { id: "liv3", teamId: "liv", name: "Dominik Szoboszlai",position: "MID" },
  { id: "liv4", teamId: "liv", name: "Luis Díaz",         position: "FWD" },
  { id: "liv5", teamId: "liv", name: "Alisson",          position: "GK"  },
  // Chelsea
  { id: "che1", teamId: "che", name: "Cole Palmer",       position: "MID" },
  { id: "che2", teamId: "che", name: "Enzo Fernández",    position: "MID" },
  { id: "che3", teamId: "che", name: "Nicolas Jackson",   position: "FWD" },
  { id: "che4", teamId: "che", name: "Levi Colwill",      position: "DEF" },
  { id: "che5", teamId: "che", name: "Robert Sánchez",    position: "GK"  },
  // Man United
  { id: "mun1", teamId: "mun", name: "Bruno Fernandes",   position: "MID" },
  { id: "mun2", teamId: "mun", name: "Marcus Rashford",   position: "FWD" },
  { id: "mun3", teamId: "mun", name: "Rasmus Højlund",    position: "FWD" },
  { id: "mun4", teamId: "mun", name: "Lisandro Martínez", position: "DEF" },
  { id: "mun5", teamId: "mun", name: "André Onana",       position: "GK"  },
  // Tottenham
  { id: "tot1", teamId: "tot", name: "Son Heung-min",     position: "FWD" },
  { id: "tot2", teamId: "tot", name: "James Maddison",    position: "MID" },
  { id: "tot3", teamId: "tot", name: "Dejan Kulusevski",  position: "MID" },
  { id: "tot4", teamId: "tot", name: "Cristian Romero",   position: "DEF" },
  { id: "tot5", teamId: "tot", name: "Guglielmo Vicario", position: "GK"  },
  // Aston Villa
  { id: "avl1", teamId: "avl", name: "Ollie Watkins",     position: "FWD" },
  { id: "avl2", teamId: "avl", name: "John McGinn",       position: "MID" },
  { id: "avl3", teamId: "avl", name: "Leon Bailey",       position: "FWD" },
  { id: "avl4", teamId: "avl", name: "Ezri Konsa",        position: "DEF" },
  { id: "avl5", teamId: "avl", name: "Emiliano Martínez", position: "GK"  },
  // Brighton
  { id: "bha1", teamId: "bha", name: "Kaoru Mitoma",      position: "FWD" },
  { id: "bha2", teamId: "bha", name: "Danny Welbeck",     position: "FWD" },
  { id: "bha3", teamId: "bha", name: "Pascal Groß",       position: "MID" },
  { id: "bha4", teamId: "bha", name: "Lewis Dunk",        position: "DEF" },
  { id: "bha5", teamId: "bha", name: "Bart Verbruggen",   position: "GK"  },
  // West Ham
  { id: "whu1", teamId: "whu", name: "Jarrod Bowen",      position: "FWD" },
  { id: "whu2", teamId: "whu", name: "Lucas Paquetá",     position: "MID" },
  { id: "whu3", teamId: "whu", name: "Mohammed Kudus",    position: "FWD" },
  { id: "whu4", teamId: "whu", name: "Kurt Zouma",        position: "DEF" },
  { id: "whu5", teamId: "whu", name: "Alphonse Areola",   position: "GK"  },
];

// The current open gameweek — 5 fixtures, deadline in the near future.
const deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days out

export const currentGameweek: Gameweek = {
  id: "gw1",
  number: 1,
  title: "Opening Weekend",
  deadline: deadline.toISOString(),
  status: "open",
  fixtureIds: ["f1", "f2", "f3", "f4", "f5"],
};

function ko(hoursFromNow: number) {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

export const fixtures: Fixture[] = [
  { id: "f1", gameweekId: "gw1", homeTeamId: "ars", awayTeamId: "new", kickoff: ko(72),  status: "scheduled", homeScore: null, awayScore: null, potmPlayerId: null },
  { id: "f2", gameweekId: "gw1", homeTeamId: "mci", awayTeamId: "liv", kickoff: ko(74),  status: "scheduled", homeScore: null, awayScore: null, potmPlayerId: null },
  { id: "f3", gameweekId: "gw1", homeTeamId: "che", awayTeamId: "mun", kickoff: ko(96),  status: "scheduled", homeScore: null, awayScore: null, potmPlayerId: null },
  { id: "f4", gameweekId: "gw1", homeTeamId: "tot", awayTeamId: "avl", kickoff: ko(98),  status: "scheduled", homeScore: null, awayScore: null, potmPlayerId: null },
  { id: "f5", gameweekId: "gw1", homeTeamId: "bha", awayTeamId: "whu", kickoff: ko(100), status: "scheduled", homeScore: null, awayScore: null, potmPlayerId: null },
];

// A few made-up rivals so the leaderboard looks alive in the prototype.
export const rivalRows: LeaderboardRow[] = [
  { userId: "u_sam",  displayName: "Sam",     avatarEmoji: "🦊", favouriteTeamId: "liv", totalPoints: 41, exactScores: 6, rank: 0 },
  { userId: "u_priya",displayName: "Priya",   avatarEmoji: "🐝", favouriteTeamId: "ars", totalPoints: 38, exactScores: 5, rank: 0 },
  { userId: "u_marco",displayName: "Marco",   avatarEmoji: "🐺", favouriteTeamId: "mci", totalPoints: 33, exactScores: 4, rank: 0 },
  { userId: "u_kemi", displayName: "Kemi",    avatarEmoji: "🦁", favouriteTeamId: "che", totalPoints: 29, exactScores: 3, rank: 0 },
  { userId: "u_dan",  displayName: "Dan",     avatarEmoji: "🐢", favouriteTeamId: "tot", totalPoints: 22, exactScores: 2, rank: 0 },
];

// ---- convenience lookups ---------------------------------------------------
export const teamById = (id: string) => teams.find((t) => t.id === id)!;
export const playerById = (id: string) => players.find((p) => p.id === id);
export const squadFor = (teamId: string) => players.filter((p) => p.teamId === teamId);
export const fixtureById = (id: string) => fixtures.find((f) => f.id === id)!;
