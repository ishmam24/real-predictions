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
