-- ============================================================================
-- Scoring engine
-- ============================================================================
-- Points are calculated ONCE per fixture, when the admin settles the result,
-- not on every leaderboard view. That keeps the app fast no matter how many
-- players there are.
--
-- Rules (per fixture, per player):
--   result points:
--     exact score (both numbers match)        -> 3
--     correct outcome only (same W/D/L)        -> 1
--     wrong                                    -> 0
--   POTM points:
--     predicted player == actual POTM          -> 2
--     otherwise                                -> 0
--   total = result + POTM   (0..5)
-- ============================================================================

-- Sign helper: -1 away win, 0 draw, +1 home win.
create or replace function public.match_outcome(home int, away int)
returns int
language sql immutable
as $$ select sign(home - away)::int $$;

-- Settle a single fixture: compute and store points for every prediction on it.
-- Call this after entering home_score, away_score, and potm_player_id.
create or replace function public.settle_fixture(p_fixture_id text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  f record;
begin
  select * into f from public.fixtures where id = p_fixture_id;

  if f is null then
    raise exception 'Fixture % not found', p_fixture_id;
  end if;

  if f.home_score is null or f.away_score is null then
    raise exception 'Fixture % has no score yet', p_fixture_id;
  end if;

  update public.predictions p
  set
    points_awarded = result_pts + potm_pts,
    points_breakdown = jsonb_build_object('result', result_pts, 'potm', potm_pts),
    updated_at = now()
  from (
    select
      pr.id,
      -- result points: exact (3) supersedes correct-outcome (1)
      case
        when pr.predicted_home_score = f.home_score
         and pr.predicted_away_score = f.away_score then 3
        when public.match_outcome(pr.predicted_home_score, pr.predicted_away_score)
           = public.match_outcome(f.home_score, f.away_score) then 1
        else 0
      end as result_pts,
      -- POTM points: +2 only if predicted and matches the actual POTM
      case
        when f.potm_player_id is not null
         and pr.predicted_potm_player_id = f.potm_player_id then 2
        else 0
      end as potm_pts
    from public.predictions pr
    where pr.fixture_id = p_fixture_id
  ) calc
  where p.id = calc.id;

  update public.fixtures
    set status = 'finished', result_settled_at = now()
  where id = p_fixture_id;
end;
$$;

-- Undo a settlement: clear the fixture's scores/POTM and wipe the points from
-- every prediction on it. SECURITY DEFINER because an admin cannot edit other
-- players' prediction rows under RLS. Called by the admin "Reset" action.
create or replace function public.unsettle_fixture(p_fixture_id text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can reset a result';
  end if;

  update public.predictions
    set points_awarded = null, points_breakdown = null, updated_at = now()
  where fixture_id = p_fixture_id;

  update public.fixtures
    set home_score = null, away_score = null, potm_player_id = null,
        status = 'scheduled', result_settled_at = null
  where id = p_fixture_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- Leaderboard: total points per player, ranked. Recomputed live from settled
-- predictions — cheap because it's just a SUM over an indexed column.
-- Exposed as a view so the app can `select * from leaderboard`.
-- ----------------------------------------------------------------------------
-- Left join FROM profiles so every onboarded player appears, even on 0 points
-- (a global leaderboard should list everyone, not only those who have scored).
create or replace view public.leaderboard as
select
  prof.id                                                            as user_id,
  prof.display_name,
  prof.avatar_emoji,
  prof.favourite_team_id,
  coalesce(sum(pr.points_awarded), 0)                                as total_points,
  count(*) filter (where pr.points_breakdown->>'result' = '3')      as exact_scores,
  count(*) filter (where pr.points_awarded is not null)             as settled_predictions,
  rank() over (order by coalesce(sum(pr.points_awarded), 0) desc)   as rank
from public.profiles prof
left join public.predictions pr on pr.user_id = prof.id
where prof.onboarded
group by prof.id, prof.display_name, prof.avatar_emoji, prof.favourite_team_id;

-- The global board is public-by-design: let signed-in users read everyone's totals.
grant select on public.leaderboard to authenticated;

-- Per-league leaderboard: same idea, scoped to members of one league.
-- security definer so it can sum EVERY member's settled points (prediction RLS
-- would otherwise hide other members' rows from the caller).
-- Usage: select * from league_leaderboard(:league_id)
create or replace function public.league_leaderboard(p_league_id uuid)
returns table (
  user_id uuid,
  display_name text,
  avatar_emoji text,
  favourite_team_id text,
  total_points bigint,
  rank bigint
)
language sql stable
security definer set search_path = public
as $$
  select
    lm.user_id,
    prof.display_name,
    prof.avatar_emoji,
    prof.favourite_team_id,
    coalesce(sum(pr.points_awarded), 0) as total_points,
    rank() over (order by coalesce(sum(pr.points_awarded), 0) desc) as rank
  from public.league_members lm
  join public.profiles prof on prof.id = lm.user_id
  left join public.predictions pr on pr.user_id = lm.user_id
  where lm.league_id = p_league_id
  group by lm.user_id, prof.display_name, prof.avatar_emoji, prof.favourite_team_id;
$$;
