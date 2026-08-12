// ============================================================================
// Prominence model — ranks a matchday's fixtures so we can auto-pick the 5
// most compelling games. Pure functions (no I/O), so they're easy to test and
// reuse on the server. Each fixture gets a score plus human-readable tags that
// explain WHY it ranked high (shown on the admin approval screen).
//
// Signals (all weighted, per the game's config):
//   • Club stature     — big clubs pull viewers
//   • Derby / rivalry   — must-watch regardless of form
//   • Top-of-table      — title / European race clashes
//   • Relegation battle — bottom-of-table six-pointers
//   • Competitiveness   — evenly matched sides (avoids blowouts)
// ============================================================================
import { statureOf, isDerby } from "./football-meta";

export type ProminenceInput = {
  id: string;
  homeTla: string;
  awayTla: string;
  homeName: string;
  awayName: string;
  kickoff: string; // ISO
};

// tla -> league position (1..20). Optional: at the season's very start there is
// no table yet, so the model leans on stature + derbies until it fills in.
export type StandingMap = Record<string, number>;

export type ScoredFixture = ProminenceInput & {
  score: number;
  tags: string[];
};

export function scoreFixture(fx: ProminenceInput, standings?: StandingMap): ScoredFixture {
  const tags: string[] = [];
  const sH = statureOf(fx.homeTla);
  const sA = statureOf(fx.awayTla);

  // Base: combined club stature (range 8..24).
  let score = (sH + sA) * 2;

  // Big-club clash bonus.
  if (sH >= 6 && sA >= 6) {
    score += 8;
    tags.push("Big-club clash");
  } else if (sH >= 5 && sA >= 5) {
    score += 4;
    tags.push("Marquee tie");
  }

  // Derby / rivalry.
  if (isDerby(fx.homeTla, fx.awayTla)) {
    score += 12;
    tags.push("Derby");
  }

  const posH = standings?.[fx.homeTla];
  const posA = standings?.[fx.awayTla];
  if (posH && posA) {
    // Top-of-table: both in the top 6, weighted by how high.
    if (posH <= 6 && posA <= 6) {
      score += Math.max(2, 14 - (posH + posA));
      tags.push("Top-of-table");
    }
    // Relegation six-pointer: both in the bottom 6, weighted by how low.
    if (posH >= 15 && posA >= 15) {
      score += Math.max(2, posH + posA - 28);
      tags.push("Relegation six-pointer");
    }
    // Competitiveness: closely-ranked sides make for tighter games.
    const gap = Math.abs(posH - posA);
    if (gap <= 4) {
      score += 5 - gap;
      if (!tags.includes("Top-of-table") && !tags.includes("Relegation six-pointer")) {
        tags.push("Evenly matched");
      }
    }
  }

  return { ...fx, score, tags };
}

// Rank a whole matchday and return the top `count`, most prominent first.
// Ties break toward the earlier kickoff.
export function selectTopFixtures(
  fixtures: ProminenceInput[],
  standings: StandingMap | undefined,
  count = 5
): ScoredFixture[] {
  return fixtures
    .map((f) => scoreFixture(f, standings))
    .sort((a, b) => b.score - a.score || a.kickoff.localeCompare(b.kickoff))
    .slice(0, count);
}
