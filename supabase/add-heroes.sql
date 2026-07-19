-- ============================================================================
-- ADD HEROES — run this in Supabase SQL Editor.
-- Safe to run on your existing database; it does NOT touch products,
-- announcements, gallery, or matches you've already added.
-- Turns the Heroes page from 3 fixed cards into an admin-managed list of
-- hero cards, each with its own photo, category, name, team, and stat line.
-- ============================================================================

create table if not exists public.heroes (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'Player of the Tournament',
  name text not null,
  team text,
  stats text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.heroes enable row level security;

drop policy if exists "Anyone can view heroes" on public.heroes;
create policy "Anyone can view heroes"
  on public.heroes for select using (true);

drop policy if exists "Only super admins can insert heroes" on public.heroes;
create policy "Only super admins can insert heroes"
  on public.heroes for insert with check (public.is_super_admin());

drop policy if exists "Only super admins can update heroes" on public.heroes;
create policy "Only super admins can update heroes"
  on public.heroes for update using (public.is_super_admin());

drop policy if exists "Only super admins can delete heroes" on public.heroes;
create policy "Only super admins can delete heroes"
  on public.heroes for delete using (public.is_super_admin());

insert into storage.buckets (id, name, public)
values ('hero-images', 'hero-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read hero images" on storage.objects;
create policy "Public read hero images"
  on storage.objects for select using (bucket_id = 'hero-images');

drop policy if exists "Super admins upload hero images" on storage.objects;
create policy "Super admins upload hero images"
  on storage.objects for insert with check (bucket_id = 'hero-images' and public.is_super_admin());

drop policy if exists "Super admins delete hero images" on storage.objects;
create policy "Super admins delete hero images"
  on storage.objects for delete using (bucket_id = 'hero-images' and public.is_super_admin());
