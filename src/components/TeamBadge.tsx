"use client";
import { useState } from "react";
import type { Team } from "@/lib/types";

// Shows the official club crest (from FPL). Falls back to a coloured chip with
// the three-letter code if the image is missing or fails to load.
export function TeamBadge({ team, size = 40 }: { team: Team; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (team.crestUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={team.crestUrl}
        alt={team.name}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0"
      style={{
        background: team.color,
        width: size,
        height: size,
        fontSize: size * 0.32,
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.15)",
      }}
      aria-hidden
    >
      {team.tla}
    </span>
  );
}
