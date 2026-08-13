"use client";
// Leagues — create or join FPL-style private mini-leagues with a code.
// Prototype: leagues live in local component state to demonstrate the flow.
import { useState } from "react";

type League = { id: string; name: string; code: string; members: number };

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "PL" + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([
    { id: "l1", name: "The Office League", code: "PL7K2Q", members: 6 },
  ]);
  const [newName, setNewName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  function createLeague() {
    if (newName.trim().length < 2) return;
    setLeagues((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: newName.trim(), code: randomCode(), members: 1 },
    ]);
    setNewName("");
  }

  function joinLeague() {
    if (joinCode.trim().length < 4) return;
    setLeagues((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "Joined league", code: joinCode.toUpperCase(), members: 4 },
    ]);
    setJoinCode("");
  }

  return (
    <main className="px-4 pt-5">
      <h1 className="text-2xl font-extrabold mb-1">👥 Leagues</h1>
      <p className="text-sm mb-4" style={{ color: "var(--rp-muted)" }}>
        Compete in private mini-leagues with friends.
      </p>

      {/* Your leagues */}
      <div className="flex flex-col gap-2 mb-6">
        {leagues.map((l) => (
          <div key={l.id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{l.name}</p>
              <p className="text-xs" style={{ color: "var(--rp-muted)" }}>{l.members} members</p>
            </div>
            <div className="text-right">
              <p className="text-[10px]" style={{ color: "var(--rp-muted)" }}>Invite code</p>
              <p className="font-mono font-bold tracking-widest" style={{ color: "var(--rp-accent)" }}>{l.code}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create */}
      <div className="card p-4 mb-4">
        <h2 className="font-bold mb-2">Create a league</h2>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="League name"
            className="flex-1 px-3 py-2.5 rounded-xl"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
          />
          <button onClick={createLeague} className="btn-primary px-4 rounded-xl font-semibold">
            Create
          </button>
        </div>
      </div>

      {/* Join */}
      <div className="card p-4">
        <h2 className="font-bold mb-2">Join a league</h2>
        <div className="flex gap-2">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 px-3 py-2.5 rounded-xl tracking-widest"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
          />
          <button onClick={joinLeague} className="px-4 rounded-xl font-semibold" style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)" }}>
            Join
          </button>
        </div>
      </div>
    </main>
  );
}
