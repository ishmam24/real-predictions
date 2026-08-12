import type { Team } from "@/lib/types";

// A small coloured chip showing the team's three-letter abbreviation.
// (Real club crests get swapped in once teams sync from football-data.org.)
export function TeamBadge({ team, size = 40 }: { team: Team; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0"
      style={{
        background: team.color,
        width: size,
        height: size,
        fontSize: size * 0.32,
        // subtle ring so dark badges stay visible on dark backgrounds
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.15)",
      }}
      aria-hidden
    >
      {team.tla}
    </span>
  );
}
