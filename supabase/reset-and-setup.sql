-- ============================================================================
-- BEN SPORTS — FULL RESET & REBUILD
-- Run this ONCE in Supabase SQL Editor. It removes the old/conflicting
-- Gemini-built tables and rebuilds everything fresh on the new schema.
-- Safe to run even if some of these tables don't exist.
-- ============================================================================

-- 1. Remove old/conflicting tables and functions ------------------------------
drop table if exists public.product_reviews cascade;
drop table if exists public.product_comments cascade;
drop table if exists public.products cascade;
drop table if exists public.cricket_matches cascade;
drop table if exists public.fixtures cascade;
drop table if exists public.teams cascade;
drop table if exists public.team_registrations cascade;
drop table if exists public.announcements cascade;
drop table if exists public.profiles cascade;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.is_super_admin();

-- 2. PROFILES ------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'member' check (role in ('member', 'team_admin', 'super_admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are readable by anyone logged in"
  on public.profiles for select
  using (auth.uid() is not null);

create policy "Users can update their own profile, but not their role"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'member');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill profiles for anyone who already signed up before this reset
insert into public.profiles (id, email, role)
select id, email, 'member' from auth.users
on conflict (id) do nothing;

create or replace function public.is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$ language sql security definer stable;

-- 3. PRODUCTS -------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view products"
  on public.products for select using (true);

create policy "Only super admins can insert products"
  on public.products for insert with check (public.is_super_admin());

create policy "Only super admins can update products"
  on public.products for update using (public.is_super_admin());

create policy "Only super admins can delete products"
  on public.products for delete using (public.is_super_admin());

-- 4. PRODUCT COMMENTS -------------------------------------------------------------
create table public.product_comments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_email text,
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.product_comments enable row level security;

create policy "Anyone can view comments"
  on public.product_comments for select using (true);

create policy "Logged in users can post comments"
  on public.product_comments for insert with check (auth.uid() = user_id);

create policy "Users can delete their own comments, admins can delete any"
  on public.product_comments for delete
  using (auth.uid() = user_id or public.is_super_admin());

-- 5. ANNOUNCEMENTS ------------------------------------------------------------------
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text,
  message text not null,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "Anyone can view announcements"
  on public.announcements for select using (true);

create policy "Only super admins can insert announcements"
  on public.announcements for insert with check (public.is_super_admin());

create policy "Only super admins can delete announcements"
  on public.announcements for delete using (public.is_super_admin());

-- 6. TEAM REGISTRATIONS -----------------------------------------------------------
create table public.team_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  team_name text not null,
  captain_name text not null,
  contact_email text not null,
  contact_phone text,
  players jsonb not null default '[]',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.team_registrations enable row level security;

create policy "Users can view their own registrations"
  on public.team_registrations for select
  using (auth.uid() = user_id or public.is_super_admin());

create policy "Logged in users can register a team"
  on public.team_registrations for insert with check (auth.uid() = user_id);

create policy "Users can update their own pending registration"
  on public.team_registrations for update
  using (auth.uid() = user_id and status = 'pending');

create policy "Super admins can update any registration"
  on public.team_registrations for update using (public.is_super_admin());

create policy "Only super admins can delete registrations"
  on public.team_registrations for delete using (public.is_super_admin());

-- 7. STORAGE BUCKETS ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('announcement-images', 'announcement-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
drop policy if exists "Super admins upload product images" on storage.objects;
drop policy if exists "Super admins delete product images" on storage.objects;
drop policy if exists "Public read announcement images" on storage.objects;
drop policy if exists "Super admins upload announcement images" on storage.objects;
drop policy if exists "Super admins delete announcement images" on storage.objects;

create policy "Public read product images"
  on storage.objects for select using (bucket_id = 'product-images');

create policy "Super admins upload product images"
  on storage.objects for insert with check (bucket_id = 'product-images' and public.is_super_admin());

create policy "Super admins delete product images"
  on storage.objects for delete using (bucket_id = 'product-images' and public.is_super_admin());

create policy "Public read announcement images"
  on storage.objects for select using (bucket_id = 'announcement-images');

create policy "Super admins upload announcement images"
  on storage.objects for insert with check (bucket_id = 'announcement-images' and public.is_super_admin());

create policy "Super admins delete announcement images"
  on storage.objects for delete using (bucket_id = 'announcement-images' and public.is_super_admin());

-- 7. GALLERY -----------------------------------------------------------------
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  caption text,
  image_url text not null,
  created_at timestamptz not null default now()
);

alter table public.gallery_images enable row level security;

drop policy if exists "Anyone can view gallery images" on public.gallery_images;
create policy "Anyone can view gallery images"
  on public.gallery_images for select using (true);

drop policy if exists "Only super admins can insert gallery images" on public.gallery_images;
create policy "Only super admins can insert gallery images"
  on public.gallery_images for insert with check (public.is_super_admin());

drop policy if exists "Only super admins can delete gallery images" on public.gallery_images;
create policy "Only super admins can delete gallery images"
  on public.gallery_images for delete using (public.is_super_admin());

insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read gallery images" on storage.objects;
create policy "Public read gallery images"
  on storage.objects for select using (bucket_id = 'gallery-images');

drop policy if exists "Super admins upload gallery images" on storage.objects;
create policy "Super admins upload gallery images"
  on storage.objects for insert with check (bucket_id = 'gallery-images' and public.is_super_admin());

drop policy if exists "Super admins delete gallery images" on storage.objects;
create policy "Super admins delete gallery images"
  on storage.objects for delete using (bucket_id = 'gallery-images' and public.is_super_admin());

-- ============================================================================
-- DONE. Now make yourself super admin (replace with your real email):
--
--   update public.profiles set role = 'super_admin' where email = 'you@example.com';
--
-- ============================================================================
