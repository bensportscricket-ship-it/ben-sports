-- ============================================================================
-- ADD MATCH COMMENTARY — run this in Supabase SQL Editor.
-- Safe to run on your existing database; adds one nullable column.
-- ============================================================================

alter table public.matches
  add column if not exists commentary jsonb not null default '[]';
