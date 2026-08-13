-- Combined schema for Real Predictions — paste into the Supabase SQL Editor and Run.
-- Generated from supabase/migrations/*.sql (order matters).

-- ============================================================
-- supabase/migrations/0001_schema.sql
-- ============================================================
-- ============================================================================
-- Real Predictions — Core Schema
-- ============================================================================
-- A Premier League prediction game. Players predict 5 fixtures per gameweek
-- and earn points:
--   * Exact score        -> 3 points
--   * Correct outcome    -> 1 point  (win/draw/loss direction, not exact)
--   * Correct POTM       -> 2 points (Player of the Match)
-- Exact score supersedes the outcome point (you get 3, not 3+1).
-- POTM is independent (+2 on top). Max per fixture = 5, per gameweek = 25.
-- ============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles: one row per user, linked to Supabase's built-in auth.users table.
-- Supabase handles passwords/Google login in auth.users; this holds the
-- game-specific profile info we collect during onboarding.
-- ----------------------------------------------------------------------------
create table public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  display_name      text not null,
  -- FK to teams is added after the teams table is created (see below).
  favourite_team_id uuid,
  avatar_url        text,
  is_admin          boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- teams: the Premier League clubs. Synced from football-data.org so the roster
-- always matches the current season (promotions/relegations handled by the API).
-- external_id maps a row to that API's team id.
-- ----------------------------------------------------------------------------
create table public.teams (
  id          uuid primary key default gen_random_uuid(),
  external_id integer unique,              -- football-data.org team id
  name        text not null,               -- e.g. "Arsenal FC"
  short_name  text not null,               -- e.g. "Arsenal"
  tla         text,                        -- three-letter abbr, e.g. "ARS"
  crest_url   text,                         -- club badge image
  created_at  timestamptz not null default now()
);

-- profiles.favourite_team_id references teams, but teams is created after
-- profiles above; add the FK now that teams exists.
alter table public.profiles
  add constraint profiles_favourite_team_fk
  foreign key (favourite_team_id) references public.teams(id) on delete set null;

-- ----------------------------------------------------------------------------
-- players: squad members, used for Player of the Match predictions. Both the
-- user's prediction and the actual POTM reference a player_id, so scoring is an
-- exact id match (no fragile "Saka" vs "Bukayo Saka" string comparison).
-- Synced from football-data.org squads.
-- ----------------------------------------------------------------------------
create table public.players (
  id          uuid primary key default gen_random_uuid(),
  external_id integer unique,              -- football-data.org player id
  team_id     uuid not null references public.teams(id) on delete cascade,
  name        text not null,
  position    text,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- gameweeks: a round of exactly 5 fixtures the admin selects one week ahead.
-- deadline is when predictions lock (typically first kickoff of the round).
-- ----------------------------------------------------------------------------
create type gameweek_status as enum ('draft', 'open', 'locked', 'completed');

create table public.gameweeks (
  id          uuid primary key default gen_random_uuid(),
  number      integer not null unique,     -- Gameweek 1, 2, 3...
  title       text,                        -- optional label, e.g. "Opening Weekend"
  deadline    timestamptz not null,        -- predictions lock at this time
  status      gameweek_status not null default 'draft',
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- fixtures: the individual matches inside a gameweek (5 per gameweek).
-- Scores auto-fill from football-data.org; POTM is entered manually by admin.
-- ----------------------------------------------------------------------------
create type fixture_status as enum ('scheduled', 'in_play', 'finished');

create table public.fixtures (
  id            uuid primary key default gen_random_uuid(),
  external_id   integer unique,            -- football-data.org match id
  gameweek_id   uuid not null references public.gameweeks(id) on delete cascade,
  home_team_id  uuid not null references public.teams(id),
  away_team_id  uuid not null references public.teams(id),
  kickoff_time  timestamptz not null,
  status        fixture_status not null default 'scheduled',
  home_score    integer,                   -- null until the match finishes
  away_score    integer,
  potm_player_id uuid references public.players(id),  -- manual, null until entered
  result_settled_at timestamptz,           -- set when scores+POTM finalize scoring
  created_at    timestamptz not null default now(),
  constraint different_teams check (home_team_id <> away_team_id)
);

create index fixtures_gameweek_idx on public.fixtures(gameweek_id);

-- ----------------------------------------------------------------------------
-- predictions: one row per user per fixture. Editable until the deadline.
-- points_awarded stays null until the fixture result is settled.
-- ----------------------------------------------------------------------------
create table public.predictions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  fixture_id            uuid not null references public.fixtures(id) on delete cascade,
  predicted_home_score  integer not null check (predicted_home_score >= 0),
  predicted_away_score  integer not null check (predicted_away_score >= 0),
  predicted_potm_player_id uuid references public.players(id),
  points_awarded        integer,           -- null until settled; then 0..5
  points_breakdown      jsonb,             -- e.g. {"result":3,"potm":2} for transparency
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (user_id, fixture_id)             -- one prediction per user per fixture
);

create index predictions_user_idx on public.predictions(user_id);
create index predictions_fixture_idx on public.predictions(fixture_id);

-- ----------------------------------------------------------------------------
-- leagues: FPL-style private mini-leagues. Anyone can create one; friends join
-- with the short code. Every player is also on the implicit global leaderboard.
-- ----------------------------------------------------------------------------
create table public.leagues (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  code        text not null unique,        -- short join code, e.g. "PL7K2Q"
  created_by  uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table public.league_members (
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

-- ----------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up. Supabase fires
-- this trigger on auth.users insert; we read the display_name the app passed in
-- the signup metadata (falling back to the email prefix).
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- supabase/migrations/0002_scoring.sql
-- ============================================================
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
create or replace function public.settle_fixture(p_fixture_id uuid)
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

-- ----------------------------------------------------------------------------
-- Leaderboard: total points per player, ranked. Recomputed live from settled
-- predictions — cheap because it's just a SUM over an indexed column.
-- Exposed as a view so the app can `select * from leaderboard`.
-- ----------------------------------------------------------------------------
create or replace view public.leaderboard as
select
  pr.user_id,
  prof.display_name,
  prof.avatar_url,
  prof.favourite_team_id,
  coalesce(sum(pr.points_awarded), 0)                                as total_points,
  count(*) filter (where pr.points_breakdown->>'result' = '3')      as exact_scores,
  count(*) filter (where pr.points_awarded is not null)             as settled_predictions,
  rank() over (order by coalesce(sum(pr.points_awarded), 0) desc)   as rank
from public.predictions pr
join public.profiles prof on prof.id = pr.user_id
group by pr.user_id, prof.display_name, prof.avatar_url, prof.favourite_team_id;

-- Per-league leaderboard: same idea, scoped to members of one league.
-- Usage: select * from league_leaderboard(:league_id)
create or replace function public.league_leaderboard(p_league_id uuid)
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  total_points bigint,
  rank bigint
)
language sql stable
as $$
  select
    pr.user_id,
    prof.display_name,
    prof.avatar_url,
    coalesce(sum(pr.points_awarded), 0) as total_points,
    rank() over (order by coalesce(sum(pr.points_awarded), 0) desc) as rank
  from public.league_members lm
  join public.profiles prof on prof.id = lm.user_id
  left join public.predictions pr on pr.user_id = lm.user_id
  where lm.league_id = p_league_id
  group by pr.user_id, prof.display_name, prof.avatar_url;
$$;

-- ============================================================
-- supabase/migrations/0003_rls.sql
-- ============================================================
-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================
-- With RLS on, the database itself enforces who can see/change each row, even
-- if someone talks to it directly with the public API key. Nothing is readable
-- or writable unless a policy below explicitly allows it.
-- ============================================================================

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Helper: has the gameweek containing this fixture passed its deadline?
create or replace function public.fixture_deadline_passed(p_fixture_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select now() >= gw.deadline
  from public.fixtures f
  join public.gameweeks gw on gw.id = f.gameweek_id
  where f.id = p_fixture_id;
$$;

-- Turn RLS on for every table.
alter table public.profiles       enable row level security;
alter table public.teams          enable row level security;
alter table public.players        enable row level security;
alter table public.gameweeks      enable row level security;
alter table public.fixtures       enable row level security;
alter table public.predictions    enable row level security;
alter table public.leagues        enable row level security;
alter table public.league_members enable row level security;

-- ---- profiles -------------------------------------------------------------
-- Anyone signed in can read profiles (needed to show names on the leaderboard).
create policy "profiles readable by authenticated"
  on public.profiles for select to authenticated using (true);
-- You may only edit your own profile.
create policy "update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ---- reference data: teams / players / gameweeks / fixtures ---------------
-- Everyone signed in can read them; only admins can change them.
create policy "teams readable"    on public.teams    for select to authenticated using (true);
create policy "teams admin write" on public.teams    for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "players readable"    on public.players for select to authenticated using (true);
create policy "players admin write" on public.players for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "gameweeks readable"    on public.gameweeks for select to authenticated using (true);
create policy "gameweeks admin write" on public.gameweeks for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "fixtures readable"    on public.fixtures for select to authenticated using (true);
create policy "fixtures admin write" on public.fixtures for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- predictions ----------------------------------------------------------
-- You can always read your own predictions.
create policy "read own predictions"
  on public.predictions for select to authenticated
  using (user_id = auth.uid());
-- You can read OTHERS' predictions only after that fixture's deadline, so no
-- one can copy before predictions lock.
create policy "read others after deadline"
  on public.predictions for select to authenticated
  using (public.fixture_deadline_passed(fixture_id));
-- You can create your own prediction only before the deadline.
create policy "insert own before deadline"
  on public.predictions for insert to authenticated
  with check (user_id = auth.uid() and not public.fixture_deadline_passed(fixture_id));
-- You can edit your own prediction only before the deadline.
create policy "update own before deadline"
  on public.predictions for update to authenticated
  using (user_id = auth.uid() and not public.fixture_deadline_passed(fixture_id))
  with check (user_id = auth.uid() and not public.fixture_deadline_passed(fixture_id));

-- ---- leagues --------------------------------------------------------------
-- You can read a league if you created it or belong to it.
create policy "read leagues you belong to"
  on public.leagues for select to authenticated
  using (
    created_by = auth.uid()
    or exists (select 1 from public.league_members m
               where m.league_id = id and m.user_id = auth.uid())
  );
-- Anyone signed in can create a league (they become the owner).
create policy "create leagues"
  on public.leagues for insert to authenticated
  with check (created_by = auth.uid());

-- ---- league_members -------------------------------------------------------
-- You can see the member list of leagues you're in.
create policy "read members of my leagues"
  on public.league_members for select to authenticated
  using (
    exists (select 1 from public.league_members m
            where m.league_id = league_members.league_id and m.user_id = auth.uid())
  );
-- You can add yourself to a league (join). Removing yourself = leave.
create policy "join leagues"
  on public.league_members for insert to authenticated
  with check (user_id = auth.uid());
create policy "leave leagues"
  on public.league_members for delete to authenticated
  using (user_id = auth.uid());

