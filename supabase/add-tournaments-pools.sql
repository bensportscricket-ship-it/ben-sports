-- ============================================================================
-- ADD TOURNAMENTS + POOLS — run this in Supabase SQL Editor.
-- Safe to run on your existing database; does not touch products,
-- announcements, gallery, or existing team registrations (it only adds
-- two new nullable columns to team_registrations).
-- ============================================================================

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  team_limit int not null default 16,
  status text not null default 'open' check (status in ('open', 'locked', 'completed')),
  created_at timestamptz not null default now()
);

alter table public.tournaments enable row level security;

drop policy if exists "Anyone can view tournaments" on public.tournaments;
create policy "Anyone can view tournaments"
  on public.tournaments for select using (true);

drop policy if exists "Only super admins can insert tournaments" on public.tournaments;
create policy "Only super admins can insert tournaments"
  on public.tournaments for insert with check (public.is_super_admin());

drop policy if exists "Only super admins can update tournaments" on public.tournaments;
create policy "Only super admins can update tournaments"
  on public.tournaments for update using (public.is_super_admin());

drop policy if exists "Only super admins can delete tournaments" on public.tournaments;
create policy "Only super admins can delete tournaments"
  on public.tournaments for delete using (public.is_super_admin());

create table if not exists public.tournament_pools (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.tournament_pools enable row level security;

drop policy if exists "Anyone can view pools" on public.tournament_pools;
create policy "Anyone can view pools"
  on public.tournament_pools for select using (true);

drop policy if exists "Only super admins can manage pools" on public.tournament_pools;
create policy "Only super admins can manage pools"
  on public.tournament_pools for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- Link registrations to a tournament, and optionally to a pool once created
alter table public.team_registrations
  add column if not exists tournament_id uuid references public.tournaments(id) on delete set null;

alter table public.team_registrations
  add column if not exists pool_id uuid references public.tournament_pools(id) on delete set null;
