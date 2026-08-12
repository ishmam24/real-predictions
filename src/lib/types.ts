// ============================================================================
// Shared types — these mirror the database schema (supabase/migrations).
// The whole app speaks these types, so when we wire up Supabase later the
// screens don't change, only the data-fetching layer behind them.
// ============================================================================

export type Team = {
  id: string;
  name: string;       // "Arsenal"
  tla: string;        // "ARS"
  color: string;      // brand colour for the badge chip
};

export type Player = {
  id: string;
  teamId: string;
  name: string;
  position: string;   // "FWD", "MID", "DEF", "GK"
};

export type GameweekStatus = "draft" | "open" | "locked" | "completed";

export type Fixture = {
  id: string;
  gameweekId: string;
  homeTeamId: string;
  awayTeamId: string;
  kickoff: string;              // ISO datetime
  status: "scheduled" | "in_play" | "finished";
  homeScore: number | null;     // null until the match finishes
  awayScore: number | null;
  potmPlayerId: string | null;  // actual Player of the Match (admin-entered)
};

export type Gameweek = {
  id: string;
  number: number;
  title: string;
  deadline: string;             // ISO datetime — predictions lock here
  status: GameweekStatus;
  fixtureIds: string[];
};

export type Prediction = {
  fixtureId: string;
  homeScore: number | null;
  awayScore: number | null;
  potmPlayerId: string | null;
  // filled in after results are settled:
  pointsAwarded?: number | null;
  breakdown?: { result: number; potm: number } | null;
};

export type UserProfile = {
  id: string;
  displayName: string;
  favouriteTeamId: string | null;
  avatarEmoji: string;          // simple emoji avatar for the prototype
};

export type LeaderboardRow = {
  userId: string;
  displayName: string;
  avatarEmoji: string;
  favouriteTeamId: string | null;
  totalPoints: number;
  exactScores: number;
  rank: number;
};
