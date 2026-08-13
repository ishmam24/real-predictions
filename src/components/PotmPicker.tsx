"use client";
// ============================================================================
// Player of the Match picker.
// Two tabs — home team | away team ("Arsenal | Newcastle"). Each tab shows the
// full club squad, ordered GK → DEF → MID → FWD then alphabetically, with a
// search box to filter a large squad quickly. The selection is a player id, so
// scoring is an exact match against the admin-entered POTM (no spelling drift).
// ============================================================================
import { useMemo, useState } from "react";
import type { Team, Player } from "@/lib/types";

const POS_ORDER: Record<string, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };

function ordered(squad: Player[]) {
  return [...squad].sort(
    (a, b) => (POS_ORDER[a.position] ?? 9) - (POS_ORDER[b.position] ?? 9) || a.name.localeCompare(b.name)
  );
}

export function PotmPicker({
  homeTeam,
  awayTeam,
  homeSquad,
  awaySquad,
  selectedPlayerId,
  onSelect,
  disabled,
}: {
  homeTeam: Team;
  awayTeam: Team;
  homeSquad: Player[];
  awaySquad: Player[];
  selectedPlayerId: string | null;
  onSelect: (playerId: string) => void;
  disabled?: boolean;
}) {
  // Default the open tab to whichever side the currently selected player is on.
  const selectedOnAway = awaySquad.some((p) => p.id === selectedPlayerId);
  const [tab, setTab] = useState<"home" | "away">(selectedOnAway ? "away" : "home");
  const [query, setQuery] = useState("");

  const activeTeam = tab === "home" ? homeTeam : awayTeam;
  const squad = tab === "home" ? homeSquad : awaySquad;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ordered(squad);
    return q ? list.filter((p) => p.name.toLowerCase().includes(q)) : list;
  }, [squad, query]);

  return (
    <div className="rp-potm">
      {/* Tabs: Arsenal | Newcastle */}
      <div className="rp-potm__tabs">
        {(["home", "away"] as const).map((side) => {
          const team = side === "home" ? homeTeam : awayTeam;
          const active = tab === side;
          return (
            <button
              key={side}
              type="button"
              disabled={disabled}
              onClick={() => { setTab(side); setQuery(""); }}
              className="rp-potm__tab"
              style={{
                background: active ? team.color : "var(--rp-surface-2)",
                color: active ? "#fff" : "var(--rp-muted)",
                borderRight: side === "home" ? "1px solid var(--rp-border)" : undefined,
              }}
            >
              {team.name}
            </button>
          );
        })}
      </div>

      <input
        type="text"
        value={query}
        disabled={disabled}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${activeTeam.name} squad (${squad.length})`}
        className="rp-potm__search"
      />

      <ul className="rp-potm__list">
        {rows.length === 0 && <li className="rp-potm__empty">No players match “{query}”.</li>}
        {rows.map((p) => {
          const selected = p.id === selectedPlayerId;
          return (
            <li key={p.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(p.id)}
                className="rp-potm__row"
                style={{ background: selected ? "var(--rp-accent-soft)" : "transparent" }}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="rp-potm__pos">{p.position}</span>
                  <span className="truncate" style={{ color: "var(--rp-text)" }}>{p.name}</span>
                </span>
                {selected && <span style={{ color: "var(--rp-accent)" }} className="font-bold">✓</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
