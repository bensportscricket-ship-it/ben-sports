-- ============================================================================
-- ADD CONTACT MESSAGES — run this in Supabase SQL Editor.
-- Safe to run on your existing database.
-- Fixes the Contact page, which was previously inserting into a 'teams'
-- table that doesn't exist in your schema (every submission was silently
-- failing, and the email/message fields weren't even being saved).
-- ============================================================================

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  team_name text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can send a contact message" on public.contact_messages;
create policy "Anyone can send a contact message"
  on public.contact_messages for insert with check (true);

drop policy if exists "Only super admins can view contact messages" on public.contact_messages;
create policy "Only super admins can view contact messages"
  on public.contact_messages for select using (public.is_super_admin());

drop policy if exists "Only super admins can update contact messages" on public.contact_messages;
create policy "Only super admins can update contact messages"
  on public.contact_messages for update using (public.is_super_admin());

drop policy if exists "Only super admins can delete contact messages" on public.contact_messages;
create policy "Only super admins can delete contact messages"
  on public.contact_messages for delete using (public.is_super_admin());
