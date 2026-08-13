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
  favourite_team_id text,
  avatar_url        text,
  avatar_emoji      text,                     -- simple emoji avatar chosen at onboarding
  is_admin          boolean not null default false,
  onboarded         boolean not null default false,  -- finished profile setup (name/team/avatar)
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- teams: the Premier League clubs. Synced from football-data.org so the roster
-- always matches the current season (promotions/relegations handled by the API).
-- external_id maps a row to that API's team id.
-- ----------------------------------------------------------------------------
create table public.teams (
  id          text primary key,            -- stable slug, e.g. "ars" (matches the app's ids)
  external_id integer unique,              -- football-data.org / FPL team id
  name        text not null,               -- e.g. "Arsenal FC"
  short_name  text not null,               -- e.g. "Arsenal"
  tla         text,                        -- three-letter abbr, e.g. "ARS"
  color       text,                        -- brand colour (badge fallback / accents)
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
  id          text primary key,            -- stable slug, e.g. "p452"
  external_id integer unique,              -- football-data.org / FPL player id
  team_id     text not null references public.teams(id) on delete cascade,
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
  id          text primary key,            -- stable slug, e.g. "gw1"
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
  id            text primary key,          -- stable slug, e.g. "f1"
  external_id   integer unique,            -- football-data.org / FPL match id
  gameweek_id   text not null references public.gameweeks(id) on delete cascade,
  home_team_id  text not null references public.teams(id),
  away_team_id  text not null references public.teams(id),
  kickoff_time  timestamptz not null,
  status        fixture_status not null default 'scheduled',
  home_score    integer,                   -- null until the match finishes
  away_score    integer,
  potm_player_id text references public.players(id),  -- manual, null until entered
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
  fixture_id            text not null references public.fixtures(id) on delete cascade,
  predicted_home_score  integer not null check (predicted_home_score >= 0),
  predicted_away_score  integer not null check (predicted_away_score >= 0),
  predicted_potm_player_id text references public.players(id),
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
