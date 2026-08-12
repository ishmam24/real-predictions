"use client";
// ============================================================================
// Player of the Match picker.
// Two tabs — home team | away team — laid out as "Arsenal | Newcastle".
// Tapping a tab shows that club's squad; tapping a player selects them.
// The selection is a player id, so scoring is an exact match against the
// admin-entered POTM (no name-spelling issues).
// ============================================================================
import { useState } from "react";
import type { Team, Player } from "@/lib/types";

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

  const squad = tab === "home" ? homeSquad : awaySquad;
  const activeTeam = tab === "home" ? homeTeam : awayTeam;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--rp-border)" }}>
      {/* Tabs: Arsenal | Newcastle */}
      <div className="grid grid-cols-2 text-sm font-semibold">
        {(["home", "away"] as const).map((side) => {
          const team = side === "home" ? homeTeam : awayTeam;
          const active = tab === side;
          return (
            <button
              key={side}
              type="button"
              disabled={disabled}
              onClick={() => setTab(side)}
              className="py-2.5 transition-colors"
              style={{
                background: active ? activeTeam.color : "var(--rp-surface-2)",
                color: active ? "#fff" : "var(--rp-muted)",
                borderRight: side === "home" ? "1px solid var(--rp-border)" : undefined,
              }}
            >
              {team.name}
            </button>
          );
        })}
      </div>

      {/* Squad list for the active tab */}
      <ul className="max-h-56 overflow-y-auto divide-y" style={{ borderColor: "var(--rp-border)" }}>
        {squad.map((p) => {
          const selected = p.id === selectedPlayerId;
          return (
            <li key={p.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(p.id)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left"
                style={{ background: selected ? "var(--rp-surface-2)" : "transparent" }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: "var(--rp-border)", color: "var(--rp-muted)" }}
                  >
                    {p.position}
                  </span>
                  <span style={{ color: "var(--rp-text)" }}>{p.name}</span>
                </span>
                {selected && (
                  <span style={{ color: "var(--rp-accent)" }} className="font-bold">✓</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
