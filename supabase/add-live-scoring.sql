-- ============================================================================
-- ADD LIVE SCORING — run this in Supabase SQL Editor.
-- Safe to run on your existing database.
-- ============================================================================

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references public.tournaments(id) on delete set null,
  team_a text not null,
  team_b text not null,
  team_a_score int not null default 0,
  team_a_wickets int not null default 0,
  team_a_overs numeric not null default 0,
  team_b_score int not null default 0,
  team_b_wickets int not null default 0,
  team_b_overs numeric not null default 0,
  current_innings text not null default 'team_a' check (current_innings in ('team_a', 'team_b')),
  target int,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'completed')),
  result text,
  created_at timestamptz not null default now()
);

alter table public.matches enable row level security;

drop policy if exists "Anyone can view matches" on public.matches;
create policy "Anyone can view matches"
  on public.matches for select using (true);

-- Scorers = super_admin or team_admin
create or replace function public.is_scorer()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('super_admin', 'team_admin')
  );
$$ language sql security definer stable;

drop policy if exists "Scorers can insert matches" on public.matches;
create policy "Scorers can insert matches"
  on public.matches for insert with check (public.is_scorer());

drop policy if exists "Scorers can update matches" on public.matches;
create policy "Scorers can update matches"
  on public.matches for update using (public.is_scorer());

drop policy if exists "Scorers can delete matches" on public.matches;
create policy "Scorers can delete matches"
  on public.matches for delete using (public.is_scorer());
