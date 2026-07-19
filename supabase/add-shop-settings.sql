-- ============================================================================
-- ADD SHOP SETTINGS — run this in Supabase SQL Editor.
-- Safe to run on your existing database; adds one new table only.
-- ============================================================================

create table if not exists public.shop_settings (
  id int primary key default 1,
  shop_name text default 'BEN SPORTS',
  address text,
  phone text,
  whatsapp text,
  hours text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- Make sure there's always exactly one row to edit
insert into public.shop_settings (id) values (1)
on conflict (id) do nothing;

alter table public.shop_settings enable row level security;

drop policy if exists "Anyone can view shop settings" on public.shop_settings;
create policy "Anyone can view shop settings"
  on public.shop_settings for select using (true);

drop policy if exists "Only super admins can update shop settings" on public.shop_settings;
create policy "Only super admins can update shop settings"
  on public.shop_settings for update using (public.is_super_admin());
