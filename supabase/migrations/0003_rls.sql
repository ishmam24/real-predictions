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
create or replace function public.fixture_deadline_passed(p_fixture_id text)
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
-- ...but only these columns. Column-level grants stop a user from patching
-- their own is_admin flag (self-granting admin). Admin is granted out-of-band
-- via the SQL editor (service role, which bypasses these grants).
revoke update on public.profiles from authenticated;
grant update (display_name, favourite_team_id, avatar_emoji, avatar_url, onboarded, updated_at)
  on public.profiles to authenticated;

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

-- Helper: is this user a member of this league? SECURITY DEFINER so it reads
-- league_members WITHOUT re-triggering RLS. This is essential — a membership
-- check written directly inside league_members' own SELECT policy would query
-- league_members again and cause infinite RLS recursion in Postgres.
create or replace function public.is_league_member(p_league_id uuid, p_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.league_members
    where league_id = p_league_id and user_id = p_user_id
  );
$$;

-- ---- leagues --------------------------------------------------------------
-- You can read a league if you created it or belong to it.
create policy "read leagues you belong to"
  on public.leagues for select to authenticated
  using (
    created_by = auth.uid()
    or public.is_league_member(id, auth.uid())
  );
-- Anyone signed in can create a league (they become the owner).
create policy "create leagues"
  on public.leagues for insert to authenticated
  with check (created_by = auth.uid());

-- ---- league_members -------------------------------------------------------
-- You can see the member list of leagues you're in (via the definer helper,
-- so this policy does not recurse into league_members).
create policy "read members of my leagues"
  on public.league_members for select to authenticated
  using (public.is_league_member(league_id, auth.uid()));
-- You can add yourself to a league (join). Removing yourself = leave.
create policy "join leagues"
  on public.league_members for insert to authenticated
  with check (user_id = auth.uid());
create policy "leave leagues"
  on public.league_members for delete to authenticated
  using (user_id = auth.uid());

-- ---- league RPCs ----------------------------------------------------------
-- Create a league and auto-join the creator. Generates a unique 6-char code
-- (prefix "PL"). SECURITY DEFINER so the insert + self-membership happen even
-- though the caller cannot yet read the freshly created rows.
create or replace function public.create_league(p_name text)
returns public.leagues
language plpgsql security definer set search_path = public
as $$
declare
  v_uid  uuid := auth.uid();
  v_code text;
  v_row  public.leagues;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'League name too short';
  end if;

  -- retry until we land a unique code. Uses built-in random() (no pgcrypto,
  -- which lives in the extensions schema and isn't on our search_path) over an
  -- unambiguous alphabet (no 0/O/1/I).
  loop
    v_code := 'PL';
    for i in 1..4 loop
      v_code := v_code || substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
                                 floor(random() * 32)::int + 1, 1);
    end loop;
    exit when not exists (select 1 from public.leagues where code = v_code);
  end loop;

  insert into public.leagues (name, code, created_by)
  values (trim(p_name), v_code, v_uid)
  returning * into v_row;

  insert into public.league_members (league_id, user_id)
  values (v_row.id, v_uid);

  return v_row;
end;
$$;

-- Join a league by its invite code. SECURITY DEFINER so a non-member can look
-- the league up by code (the read policy would otherwise hide it) and insert
-- their own membership. Idempotent — re-joining is a no-op.
create or replace function public.join_league_by_code(p_code text)
returns public.leagues
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row public.leagues;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_row from public.leagues
  where code = upper(trim(p_code));

  if v_row is null then
    raise exception 'No league found for that code';
  end if;

  insert into public.league_members (league_id, user_id)
  values (v_row.id, v_uid)
  on conflict (league_id, user_id) do nothing;

  return v_row;
end;
$$;
