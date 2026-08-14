"use client";
// ============================================================================
// Store: the app's data layer, backed by Supabase.
//
// Reference data (teams, players, fixtures, the current gameweek) stays in
// mock-data.ts — it is static per season and the database is SEEDED from the
// exact same source (scripts/generate-seed-sql.mjs), so the ids line up and the
// fixture/player foreign keys on predictions resolve. Everything the *user*
// generates — their profile, predictions, settled results, the leaderboard, and
// private leagues — lives in Supabase and is loaded here.
//
// The hook surface (predictions/results maps, scoreFor, leaderboard(), etc.) is
// deliberately unchanged from the prototype so the screen components did not
// have to change.
// ============================================================================
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { Prediction, UserProfile, LeaderboardRow, League, LeagueStanding } from "./types";
import { fixtures as baseFixtures, currentGameweek } from "./mock-data";
import { createClient } from "./supabase/client";

const DEFAULT_AVATAR = "⚽";

type ResultsMap = Record<
  string,
  { homeScore: number; awayScore: number; potmPlayerId: string | null }
>;
type PredictionsMap = Record<string, Prediction>;

type Store = {
  userId: string | null;
  profile: UserProfile | null;
  saveError: string | null;
  predictions: PredictionsMap;
  results: ResultsMap;
  leagues: League[];
  hydrated: boolean;
  onboard: (p: {
    displayName: string;
    favouriteTeamId: string | null;
    avatarEmoji: string;
    leagueCode?: string;
  }) => Promise<void>;
  finishIntro: () => Promise<void>;
  signOut: () => Promise<void>;
  savePrediction: (p: Prediction) => Promise<void>;
  submitGameweek: (gameweekId: string) => Promise<void>;
  isSubmitted: (gameweekId: string) => boolean;
  setResult: (
    fixtureId: string,
    homeScore: number,
    awayScore: number,
    potmPlayerId: string | null
  ) => Promise<void>;
  clearResult: (fixtureId: string) => Promise<void>;
  scoreFor: (fixtureId: string) => { result: number; potm: number; total: number } | null;
  myTotalPoints: () => number;
  leaderboard: () => LeaderboardRow[];
  createLeague: (name: string) => Promise<League>;
  joinLeague: (code: string) => Promise<League>;
  leagueLeaderboard: (leagueId: string) => Promise<LeagueStanding[]>;
};

const StoreContext = createContext<Store | null>(null);

const outcome = (h: number, a: number) => Math.sign(h - a);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [predictions, setPredictions] = useState<PredictionsMap>({});
  const [results, setResults] = useState<ResultsMap>({});
  const [leaderboardRows, setLeaderboardRows] = useState<LeaderboardRow[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [hydrated, setHydrated] = useState(false);
  // Set when a prediction write to the DB fails, so the UI can stop pretending
  // the pick was saved. Cleared on the next successful save.
  const [saveError, setSaveError] = useState<string | null>(null);

  // ---- loaders -------------------------------------------------------------
  const loadProfile = useCallback(
    async (uid: string): Promise<UserProfile | null> => {
      const sel = "id, display_name, favourite_team_id, avatar_emoji, is_admin, onboarded, intro_seen";
      let { data } = await supabase.from("profiles").select(sel).eq("id", uid).maybeSingle();
      if (!data) {
        // Self-heal: an authenticated user with no profile row (e.g. an account
        // created before the signup trigger existed, or orphaned by a DB reset).
        // Create a minimal row so the app isn't stranded without nav.
        const { data: auth } = await supabase.auth.getUser();
        const fallback = auth.user?.email?.split("@")[0] ?? "Player";
        await supabase.from("profiles").insert({ id: uid, display_name: fallback });
        ({ data } = await supabase.from("profiles").select(sel).eq("id", uid).maybeSingle());
      }
      if (!data) return null;
      return {
        id: data.id,
        displayName: data.display_name,
        favouriteTeamId: data.favourite_team_id,
        avatarEmoji: data.avatar_emoji ?? DEFAULT_AVATAR,
        isAdmin: data.is_admin,
        onboarded: data.onboarded,
        introSeen: data.intro_seen ?? false,
      };
    },
    [supabase]
  );

  const loadPredictions = useCallback(
    async (uid: string) => {
      const { data } = await supabase
        .from("predictions")
        .select("fixture_id, predicted_home_score, predicted_away_score, predicted_potm_player_id")
        .eq("user_id", uid);
      const map: PredictionsMap = {};
      (data ?? []).forEach((r) => {
        map[r.fixture_id] = {
          fixtureId: r.fixture_id,
          homeScore: r.predicted_home_score,
          awayScore: r.predicted_away_score,
          potmPlayerId: r.predicted_potm_player_id,
        };
      });
      setPredictions(map);
    },
    [supabase]
  );

  // Settled results, read off the fixtures table (any fixture that has a score).
  const loadResults = useCallback(async () => {
    const { data } = await supabase
      .from("fixtures")
      .select("id, home_score, away_score, potm_player_id")
      .not("home_score", "is", null);
    const map: ResultsMap = {};
    (data ?? []).forEach((r) => {
      map[r.id] = {
        homeScore: r.home_score,
        awayScore: r.away_score,
        potmPlayerId: r.potm_player_id,
      };
    });
    setResults(map);
  }, [supabase]);

  const loadLeaderboard = useCallback(
    async (uid: string | null) => {
      const { data } = await supabase
        .from("leaderboard")
        .select("user_id, display_name, avatar_emoji, favourite_team_id, total_points, exact_scores, rank")
        .order("rank", { ascending: true });
      const rows: LeaderboardRow[] = (data ?? []).map((r) => ({
        userId: r.user_id,
        displayName: r.user_id === uid ? `${r.display_name} (you)` : r.display_name,
        avatarEmoji: r.avatar_emoji ?? DEFAULT_AVATAR,
        favouriteTeamId: r.favourite_team_id,
        totalPoints: Number(r.total_points),
        exactScores: Number(r.exact_scores),
        rank: Number(r.rank),
      }));
      setLeaderboardRows(rows);
    },
    [supabase]
  );

  const loadLeagues = useCallback(
    async (uid: string) => {
      // My memberships, with the league embedded via the FK.
      const { data: memberships } = await supabase
        .from("league_members")
        .select("league_id, leagues(id, name, code, created_by)")
        .eq("user_id", uid);

      const myLeagues = (memberships ?? [])
        .map((m) => m.leagues as unknown as { id: string; name: string; code: string; created_by: string } | null)
        .filter((l): l is { id: string; name: string; code: string; created_by: string } => !!l);

      const ids = myLeagues.map((l) => l.id);
      // Member counts for those leagues (RLS lets me read members of my leagues).
      const counts: Record<string, number> = {};
      if (ids.length) {
        const { data: allMembers } = await supabase
          .from("league_members")
          .select("league_id")
          .in("league_id", ids);
        (allMembers ?? []).forEach((m) => {
          counts[m.league_id] = (counts[m.league_id] ?? 0) + 1;
        });
      }

      setLeagues(
        myLeagues.map((l) => ({
          id: l.id,
          name: l.name,
          code: l.code,
          members: counts[l.id] ?? 1,
          isOwner: l.created_by === uid,
        }))
      );
    },
    [supabase]
  );

  const loadAll = useCallback(
    async (uid: string) => {
      const prof = await loadProfile(uid);
      setProfile(prof);
      await Promise.all([
        loadPredictions(uid),
        loadResults(),
        loadLeaderboard(uid),
        loadLeagues(uid),
      ]);
    },
    [loadProfile, loadPredictions, loadResults, loadLeaderboard, loadLeagues]
  );

  const clearAll = useCallback(() => {
    setProfile(null);
    setPredictions({});
    setResults({});
    setLeaderboardRows([]);
    setLeagues([]);
  }, []);

  // ---- auth lifecycle ------------------------------------------------------
  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      if (!active) return;
      setUserId(uid);
      if (uid) await loadAll(uid);
      if (active) setHydrated(true);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        loadAll(uid);
      } else {
        clearAll();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadAll, clearAll]);

  // ---- profile / auth actions ---------------------------------------------
  const onboard = useCallback(
    async (p: {
      displayName: string;
      favouriteTeamId: string | null;
      avatarEmoji: string;
      leagueCode?: string;
    }) => {
      if (!userId) return;
      await supabase
        .from("profiles")
        .update({
          display_name: p.displayName,
          favourite_team_id: p.favouriteTeamId,
          avatar_emoji: p.avatarEmoji,
          onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (p.leagueCode && p.leagueCode.trim().length >= 4) {
        await supabase.rpc("join_league_by_code", { p_code: p.leagueCode.trim() });
      }

      const prof = await loadProfile(userId);
      setProfile(prof);
      await Promise.all([loadLeagues(userId), loadLeaderboard(userId)]);
    },
    [supabase, userId, loadProfile, loadLeagues, loadLeaderboard]
  );

  // Mark the 3-screen onboarding manual as seen so it never shows again. Called
  // by the "Start Predicting" button at the end of the manual.
  const finishIntro = useCallback(async () => {
    if (!userId) return;
    // Optimistic: flip locally so the app reveals immediately, no round-trip flash.
    setProfile((prev) => (prev ? { ...prev, introSeen: true } : prev));
    const { error } = await supabase
      .from("profiles")
      .update({ intro_seen: true, updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) console.error("finishIntro failed", error);
  }, [supabase, userId]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    clearAll();
    window.location.assign("/login");
  }, [supabase, clearAll]);

  // ---- predictions ---------------------------------------------------------
  const savePrediction = useCallback(
    async (p: Prediction) => {
      // Optimistic local update so the board stays snappy.
      setPredictions((prev) => ({ ...prev, [p.fixtureId]: p }));
      if (!userId) return;
      // The DB requires both scores; only persist a complete pick.
      if (p.homeScore == null || p.awayScore == null) return;
      const { error } = await supabase.from("predictions").upsert(
        {
          user_id: userId,
          fixture_id: p.fixtureId,
          predicted_home_score: p.homeScore,
          predicted_away_score: p.awayScore,
          predicted_potm_player_id: p.potmPlayerId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,fixture_id" }
      );
      if (error) {
        console.error("savePrediction failed", error);
        setSaveError("Couldn't save your pick to the server. Check your connection and try again.");
      } else {
        setSaveError(null);
      }
    },
    [supabase, userId]
  );

  const submitGameweek = useCallback(
    async (gameweekId: string) => {
      if (!userId) return;
      const fixtureIds =
        gameweekId === currentGameweek.id ? currentGameweek.fixtureIds : [];
      const rows = fixtureIds
        .map((fid) => predictions[fid])
        .filter((p): p is Prediction => !!p && p.homeScore != null && p.awayScore != null)
        .map((p) => ({
          user_id: userId,
          fixture_id: p.fixtureId,
          predicted_home_score: p.homeScore,
          predicted_away_score: p.awayScore,
          predicted_potm_player_id: p.potmPlayerId,
          updated_at: new Date().toISOString(),
        }));
      if (rows.length) {
        const { error } = await supabase
          .from("predictions")
          .upsert(rows, { onConflict: "user_id,fixture_id" });
        if (error) {
          console.error("submitGameweek failed", error);
          setSaveError("Couldn't submit your picks to the server. Check your connection and try again.");
          throw error;
        }
        setSaveError(null);
      }
    },
    [supabase, userId, predictions]
  );

  const isSubmitted = useCallback(
    (gameweekId: string) => {
      const fixtureIds =
        gameweekId === currentGameweek.id ? currentGameweek.fixtureIds : [];
      if (!fixtureIds.length) return false;
      return fixtureIds.every((fid) => {
        const p = predictions[fid];
        return !!p && p.homeScore != null && p.awayScore != null;
      });
    },
    [predictions]
  );

  // ---- admin results -------------------------------------------------------
  const setResult = useCallback(
    async (fixtureId: string, homeScore: number, awayScore: number, potmPlayerId: string | null) => {
      await supabase
        .from("fixtures")
        .update({ home_score: homeScore, away_score: awayScore, potm_player_id: potmPlayerId })
        .eq("id", fixtureId);
      await supabase.rpc("settle_fixture", { p_fixture_id: fixtureId });
      await Promise.all([loadResults(), loadLeaderboard(userId)]);
    },
    [supabase, userId, loadResults, loadLeaderboard]
  );

  const clearResult = useCallback(
    async (fixtureId: string) => {
      await supabase.rpc("unsettle_fixture", { p_fixture_id: fixtureId });
      setResults((prev) => {
        const next = { ...prev };
        delete next[fixtureId];
        return next;
      });
      await loadLeaderboard(userId);
    },
    [supabase, userId, loadLeaderboard]
  );

  // Same rules as settle_fixture() in the database — used to preview points live.
  const scoreFor = useCallback(
    (fixtureId: string) => {
      const pred = predictions[fixtureId];
      const res = results[fixtureId];
      if (!pred || !res || pred.homeScore == null || pred.awayScore == null) return null;

      let result = 0;
      if (pred.homeScore === res.homeScore && pred.awayScore === res.awayScore) {
        result = 3; // exact score
      } else if (outcome(pred.homeScore, pred.awayScore) === outcome(res.homeScore, res.awayScore)) {
        result = 1; // correct outcome only
      }
      const potm = res.potmPlayerId && pred.potmPlayerId === res.potmPlayerId ? 2 : 0;
      return { result, potm, total: result + potm };
    },
    [predictions, results]
  );

  const myTotalPoints = useCallback(() => {
    const mine = leaderboardRows.find((r) => r.userId === userId);
    return mine ? mine.totalPoints : 0;
  }, [leaderboardRows, userId]);

  const leaderboard = useCallback(() => leaderboardRows, [leaderboardRows]);

  // ---- leagues -------------------------------------------------------------
  const createLeague = useCallback(
    async (name: string): Promise<League> => {
      const { data, error } = await supabase.rpc("create_league", { p_name: name });
      if (error) throw error;
      if (userId) await loadLeagues(userId);
      const row = data as { id: string; name: string; code: string; created_by: string };
      return { id: row.id, name: row.name, code: row.code, members: 1, isOwner: true };
    },
    [supabase, userId, loadLeagues]
  );

  const joinLeague = useCallback(
    async (code: string): Promise<League> => {
      const { data, error } = await supabase.rpc("join_league_by_code", { p_code: code });
      if (error) throw error;
      if (userId) await loadLeagues(userId);
      const row = data as { id: string; name: string; code: string; created_by: string };
      return {
        id: row.id,
        name: row.name,
        code: row.code,
        members: 1,
        isOwner: row.created_by === userId,
      };
    },
    [supabase, userId, loadLeagues]
  );

  const leagueLeaderboard = useCallback(
    async (leagueId: string): Promise<LeagueStanding[]> => {
      const { data } = await supabase.rpc("league_leaderboard", { p_league_id: leagueId });
      return ((data ?? []) as Array<{
        user_id: string;
        display_name: string;
        avatar_emoji: string | null;
        favourite_team_id: string | null;
        total_points: number;
        rank: number;
      }>).map((r) => ({
        userId: r.user_id,
        displayName: r.user_id === userId ? `${r.display_name} (you)` : r.display_name,
        avatarEmoji: r.avatar_emoji ?? DEFAULT_AVATAR,
        favouriteTeamId: r.favourite_team_id,
        totalPoints: Number(r.total_points),
        rank: Number(r.rank),
      }));
    },
    [supabase, userId]
  );

  const value: Store = {
    userId,
    profile,
    saveError,
    predictions,
    results,
    leagues,
    hydrated,
    onboard,
    finishIntro,
    signOut,
    savePrediction,
    submitGameweek,
    isSubmitted,
    setResult,
    clearResult,
    scoreFor,
    myTotalPoints,
    leaderboard,
    createLeague,
    joinLeague,
    leagueLeaderboard,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export { baseFixtures, currentGameweek };
