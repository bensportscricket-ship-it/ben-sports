-- ============================================================================
-- SECURE PROFILE ROLES — run this in Supabase SQL Editor.
-- ============================================================================
-- Why: the "Users can update their own profile" policy in schema.sql only
-- checks that auth.uid() = id — it never checks that `role` stays the same.
-- Right now, any logged-in member can open the browser console and run:
--
--   supabase.from('profiles').update({ role: 'super_admin' }).eq('id', myId)
--
-- ...and grant themselves super admin, because Row Level Security allows it.
-- This adds a trigger that silently reverts any role change attempted by
-- someone who isn't already a super admin — closing that hole without
-- touching the existing policy or breaking normal profile updates.
-- ============================================================================

create or replace function public.prevent_self_role_escalation()
returns trigger as $$
begin
  if new.role is distinct from old.role and not public.is_super_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists prevent_role_escalation on public.profiles;
create trigger prevent_role_escalation
  before update on public.profiles
  for each row execute procedure public.prevent_self_role_escalation();
