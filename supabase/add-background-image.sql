-- ============================================================================
-- ADD SITE BACKGROUND IMAGE — run this in Supabase SQL Editor.
-- Safe to run on your existing database.
-- ============================================================================

alter table public.shop_settings
  add column if not exists background_image_url text;

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read site images" on storage.objects;
create policy "Public read site images"
  on storage.objects for select using (bucket_id = 'site-images');

drop policy if exists "Super admins upload site images" on storage.objects;
create policy "Super admins upload site images"
  on storage.objects for insert with check (bucket_id = 'site-images' and public.is_super_admin());

drop policy if exists "Super admins delete site images" on storage.objects;
create policy "Super admins delete site images"
  on storage.objects for delete using (bucket_id = 'site-images' and public.is_super_admin());
