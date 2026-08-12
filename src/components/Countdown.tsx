"use client";
// Small live countdown to the prediction deadline.
import { useEffect, useState } from "react";

export function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const diff = new Date(to).getTime() - now;
  if (diff <= 0) return <span className="font-semibold">🔒 Locked</span>;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const label = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return <span className="font-semibold">⏳ Locks in {label}</span>;
}
