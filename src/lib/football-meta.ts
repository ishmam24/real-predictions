// ============================================================================
// Static football metadata used by the prominence model.
// Keyed by the three-letter code (tla) that football-data.org returns for each
// club, so it maps cleanly onto live API data.
// ============================================================================

// Club stature tiers (higher = bigger draw). These are stable across seasons;
// live standings handle the dynamic form/table context separately.
export const CLUB_STATURE: Record<string, number> = {
  // Big Six
  ARS: 6, CHE: 6, LIV: 6, MCI: 6, MUN: 6, TOT: 6,
  // Elevated / big spenders
  NEW: 5,
  // Established top-half sides
  AVL: 4, WHU: 4, BHA: 4, EVE: 4,
  // Solid mid-table
  CRY: 3, FUL: 3, BOU: 3, BRE: 3, WOL: 3, NFO: 3,
  // Typically promoted / smaller
  LEE: 2, BUR: 2, SUN: 2, IPS: 2, LUT: 2, SOU: 2, SHU: 2, NOR: 2, WBA: 2,
};
export const DEFAULT_STATURE = 3;

export function statureOf(tla: string): number {
  return CLUB_STATURE[tla] ?? DEFAULT_STATURE;
}

// Rivalries as unordered pairs. A derby is must-watch regardless of form.
const RIVALRIES: [string, string][] = [
  ["LIV", "EVE"], // Merseyside
  ["ARS", "TOT"], // North London
  ["MCI", "MUN"], // Manchester
  ["NEW", "SUN"], // Tyne–Wear
  ["LIV", "MUN"], // North West / historic
  ["ARS", "CHE"], // London
  ["CHE", "TOT"], // London
  ["WHU", "TOT"], // London
  ["CRY", "BHA"], // M23
  ["AVL", "WOL"], // West Midlands
  ["FUL", "CHE"], // West London
  ["NEW", "MUN"], // historic
];

const rivalrySet = new Set(RIVALRIES.map(([a, b]) => [a, b].sort().join("|")));

export function isDerby(a: string, b: string): boolean {
  return rivalrySet.has([a, b].sort().join("|"));
}
