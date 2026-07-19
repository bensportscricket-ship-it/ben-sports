-- ============================================================================
-- ADD GALLERY — run this in Supabase SQL Editor.
-- Safe to run on your existing database; it does NOT touch products,
-- announcements, or team registrations you've already added.
-- ============================================================================

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
