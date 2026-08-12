"use client";
// ============================================================================
// Prototype store: keeps the current user, their predictions, and (for the
// admin demo) match results in the browser's localStorage so everything works
// without a backend. Mirrors the DB scoring so points feel real.
// When Supabase is wired in, this file becomes thin wrappers around real
// queries; the components using it won't change.
// ============================================================================
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Prediction, UserProfile, LeaderboardRow } from "./types";
import { rivalRows, fixtures as baseFixtures, currentGameweek } from "./mock-data";

type ResultsMap = Record<
  string,
  { homeScore: number; awayScore: number; potmPlayerId: string | null }
>;
type PredictionsMap = Record<string, Prediction>;

type Store = {
  profile: UserProfile | null;
  predictions: PredictionsMap;
  results: ResultsMap;
  submittedGameweeks: string[];
  hydrated: boolean;
  onboard: (p: Omit<UserProfile, "id">) => void;
  signOut: () => void;
  savePrediction: (p: Prediction) => void;
  submitGameweek: (gameweekId: string) => void;
  isSubmitted: (gameweekId: string) => boolean;
  setResult: (fixtureId: string, homeScore: number, awayScore: number, potmPlayerId: string | null) => void;
  clearResult: (fixtureId: string) => void;
  scoreFor: (fixtureId: string) => { result: number; potm: number; total: number } | null;
  myTotalPoints: () => number;
  leaderboard: () => LeaderboardRow[];
};

const StoreContext = createContext<Store | null>(null);

const KEYS = {
  profile: "rp_profile",
  predictions: "rp_predictions",
  results: "rp_results",
  submitted: "rp_submitted",
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const outcome = (h: number, a: number) => Math.sign(h - a);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [predictions, setPredictions] = useState<PredictionsMap>({});
  const [results, setResults] = useState<ResultsMap>({});
  const [submittedGameweeks, setSubmittedGameweeks] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once, after mount. We intentionally render the empty
  // state on the server/first paint and then hydrate from storage on the client
  // to avoid an SSR/client mismatch — a deliberate one-time sync from an external
  // store, so the set-state-in-effect rule doesn't apply here.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setProfile(load<UserProfile | null>(KEYS.profile, null));
    setPredictions(load<PredictionsMap>(KEYS.predictions, {}));
    setResults(load<ResultsMap>(KEYS.results, {}));
    setSubmittedGameweeks(load<string[]>(KEYS.submitted, []));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  }, [profile, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.predictions, JSON.stringify(predictions));
  }, [predictions, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.results, JSON.stringify(results));
  }, [results, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(KEYS.submitted, JSON.stringify(submittedGameweeks));
  }, [submittedGameweeks, hydrated]);

  const onboard = useCallback((p: Omit<UserProfile, "id">) => {
    setProfile({ id: "me", ...p });
  }, []);

  const signOut = useCallback(() => {
    setProfile(null);
    setPredictions({});
    setSubmittedGameweeks([]);
    window.localStorage.removeItem(KEYS.profile);
    window.localStorage.removeItem(KEYS.predictions);
    window.localStorage.removeItem(KEYS.submitted);
  }, []);

  const savePrediction = useCallback((p: Prediction) => {
    setPredictions((prev) => ({ ...prev, [p.fixtureId]: p }));
  }, []);

  const submitGameweek = useCallback((gameweekId: string) => {
    setSubmittedGameweeks((prev) => (prev.includes(gameweekId) ? prev : [...prev, gameweekId]));
  }, []);

  const isSubmitted = useCallback(
    (gameweekId: string) => submittedGameweeks.includes(gameweekId),
    [submittedGameweeks]
  );

  const setResult = useCallback(
    (fixtureId: string, homeScore: number, awayScore: number, potmPlayerId: string | null) => {
      setResults((prev) => ({ ...prev, [fixtureId]: { homeScore, awayScore, potmPlayerId } }));
    },
    []
  );

  const clearResult = useCallback((fixtureId: string) => {
    setResults((prev) => {
      const next = { ...prev };
      delete next[fixtureId];
      return next;
    });
  }, []);

  // Same rules as settle_fixture() in the database.
  const scoreFor = useCallback(
    (fixtureId: string) => {
      const pred = predictions[fixtureId];
      const res = results[fixtureId];
      if (!pred || !res || pred.homeScore === null || pred.awayScore === null) return null;

      let result = 0;
      if (pred.homeScore === res.homeScore && pred.awayScore === res.awayScore) {
        result = 3; // exact score
      } else if (outcome(pred.homeScore, pred.awayScore) === outcome(res.homeScore, res.awayScore)) {
        result = 1; // correct outcome only
      }
      const potm =
        res.potmPlayerId && pred.potmPlayerId === res.potmPlayerId ? 2 : 0;
      return { result, potm, total: result + potm };
    },
    [predictions, results]
  );

  const myTotalPoints = useCallback(() => {
    return currentGameweek.fixtureIds.reduce((sum, fid) => {
      const s = scoreFor(fid);
      return sum + (s ? s.total : 0);
    }, 0);
  }, [scoreFor]);

  const leaderboard = useCallback((): LeaderboardRow[] => {
    const me: LeaderboardRow | null = profile
      ? {
          userId: profile.id,
          displayName: profile.displayName + " (you)",
          avatarEmoji: profile.avatarEmoji,
          favouriteTeamId: profile.favouriteTeamId,
          totalPoints: myTotalPoints(),
          exactScores: currentGameweek.fixtureIds.filter((f) => scoreFor(f)?.result === 3).length,
          rank: 0,
        }
      : null;
    const rows = [...rivalRows, ...(me ? [me] : [])]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((r, i) => ({ ...r, rank: i + 1 }));
    return rows;
  }, [profile, myTotalPoints, scoreFor]);

  const value: Store = {
    profile,
    predictions,
    results,
    submittedGameweeks,
    hydrated,
    onboard,
    signOut,
    savePrediction,
    submitGameweek,
    isSubmitted,
    setResult,
    clearResult,
    scoreFor,
    myTotalPoints,
    leaderboard,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export { baseFixtures, currentGameweek };
