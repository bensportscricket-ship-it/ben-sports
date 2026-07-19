-- ============================================================================
-- BEN SPORTS — Supabase schema
-- Run this once in your Supabase project: Dashboard -> SQL Editor -> New query
-- ============================================================================

-- 1. PROFILES ----------------------------------------------------------------
-- One row per auth user. Role defaults to 'member' and can ONLY be changed
-- by editing the table directly (Table Editor) or via SQL as the project
-- owner. There is no app code path that lets a user set their own role.
create table if not exists public.profiles (
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
-- Note: role changes must be done by the project owner in the Table Editor,
-- not through this policy. If you want to strictly forbid role edits by the
-- user themselves at the DB level too, remove the update policy above and
-- manage profiles only from the Supabase dashboard.

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'member');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper used by policies below to check if the current user is a super admin
create or replace function public.is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$ language sql security definer stable;

-- 2. PRODUCTS -----------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view products"
  on public.products for select
  using (true);

create policy "Only super admins can insert products"
  on public.products for insert
  with check (public.is_super_admin());

create policy "Only super admins can update products"
  on public.products for update
  using (public.is_super_admin());

create policy "Only super admins can delete products"
  on public.products for delete
  using (public.is_super_admin());

-- 3. PRODUCT COMMENTS ----------------------------------------------------------
create table if not exists public.product_comments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_email text,
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.product_comments enable row level security;

create policy "Anyone can view comments"
  on public.product_comments for select
  using (true);

create policy "Logged in users can post comments"
  on public.product_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments, admins can delete any"
  on public.product_comments for delete
  using (auth.uid() = user_id or public.is_super_admin());

-- 4. ANNOUNCEMENTS --------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text,
  message text not null,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "Anyone can view announcements"
  on public.announcements for select
  using (true);

create policy "Only super admins can insert announcements"
  on public.announcements for insert
  with check (public.is_super_admin());

create policy "Only super admins can delete announcements"
  on public.announcements for delete
  using (public.is_super_admin());

-- 5. STORAGE BUCKETS -------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('announcement-images', 'announcement-images', true)
on conflict (id) do nothing;

-- Anyone can view images (public buckets), only super admins can upload/delete
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Super admins upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_super_admin());

create policy "Super admins delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_super_admin());

create policy "Public read announcement images"
  on storage.objects for select
  using (bucket_id = 'announcement-images');

create policy "Super admins upload announcement images"
  on storage.objects for insert
  with check (bucket_id = 'announcement-images' and public.is_super_admin());

create policy "Super admins delete announcement images"
  on storage.objects for delete
  using (bucket_id = 'announcement-images' and public.is_super_admin());

-- 6. TEAM REGISTRATIONS (self sign-up for teams & players from the site) ------
create table if not exists public.team_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  team_name text not null,
  captain_name text not null,
  contact_email text not null,
  contact_phone text,
  players jsonb not null default '[]',  -- [{ "name": "...", "age": 0, "role": "batter" }]
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.team_registrations enable row level security;

-- A logged-in user can submit a registration and see only their own
create policy "Users can view their own registrations"
  on public.team_registrations for select
  using (auth.uid() = user_id or public.is_super_admin());

create policy "Logged in users can register a team"
  on public.team_registrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own pending registration"
  on public.team_registrations for update
  using (auth.uid() = user_id and status = 'pending');

create policy "Only super admins can change status or delete"
  on public.team_registrations for delete
  using (public.is_super_admin());

create policy "Super admins can update any registration"
  on public.team_registrations for update
  using (public.is_super_admin());

-- ============================================================================
-- 7. MAKE YOURSELF THE SUPER ADMIN
-- After you have signed up once on the live site with your own email,
-- come back here and run (replace with your real email):
--
--   update public.profiles set role = 'super_admin' where email = 'you@example.com';
--
-- ============================================================================
