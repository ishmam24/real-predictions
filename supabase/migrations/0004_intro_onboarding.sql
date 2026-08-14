-- ============================================================================
-- New-user onboarding manual
-- ============================================================================
-- A short 3-screen "how it works" manual is shown once, right after profile
-- setup (profiles.onboarded) and before a player's first prediction. We track
-- whether a user has seen it with a per-user flag so it never re-appears and so
-- it follows the account across devices (localStorage would re-show on a new
-- browser).
-- ============================================================================

alter table public.profiles
  add column if not exists intro_seen boolean not null default false;

-- Existing players are NOT new users — they should not be interrupted by the
-- manual on their next visit. Mark everyone who already exists as having seen
-- it; only accounts created from here on start with intro_seen = false.
update public.profiles set intro_seen = true;

-- A user finishes the manual by flipping their own intro_seen to true. The
-- column-level UPDATE grant in 0003_rls.sql is an allow-list, so intro_seen has
-- to be added to it explicitly (re-issued here in full to stay in sync).
grant update (display_name, favourite_team_id, avatar_emoji, avatar_url, onboarded, intro_seen, updated_at)
  on public.profiles to authenticated;
