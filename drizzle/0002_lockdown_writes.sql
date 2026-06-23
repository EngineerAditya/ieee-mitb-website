-- ════════════════════════════════════════════════════════════════════════
-- Write lockdown: the ONLY way to mutate data is the trusted server (service
-- role / direct postgres connection, which authorizes via assertAdmin()).
-- No public API key — anon OR authenticated — may write to ANY table.
-- This closes the privilege-escalation hole where a logged-in user could
-- `UPDATE profiles SET role='admin'` on their own row.
-- ════════════════════════════════════════════════════════════════════════

-- 1) Revoke ALL client-side write privileges on every existing public table.
--    (SELECT is kept; reads stay gated by RLS.)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public
  FROM anon, authenticated;

-- 2) Same for any tables created in the future.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLES FROM anon, authenticated;

-- 3) Drop the over-permissive self-update policy on profiles (it allowed a user
--    to change their own `role` column → admin escalation).
DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;

-- 4) Defense-in-depth: even if grants/policies are loosened later, block any
--    role change unless performed by a privileged server role or an admin.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND current_user NOT IN ('postgres', 'supabase_admin', 'service_role')
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized to change role';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_role_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();
