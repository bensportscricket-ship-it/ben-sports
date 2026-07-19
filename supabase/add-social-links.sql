-- ============================================================================
-- ADD SOCIAL LINKS — run this in Supabase SQL Editor.
-- Safe to run on your existing database; adds columns to shop_settings only.
-- ============================================================================

alter table public.shop_settings add column if not exists facebook_url text;
alter table public.shop_settings add column if not exists instagram_url text;
alter table public.shop_settings add column if not exists youtube_url text;
alter table public.shop_settings add column if not exists x_url text;
