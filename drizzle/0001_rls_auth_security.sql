-- ════════════════════════════════════════════════════════════════════════
-- RLS, auth wiring, and security helpers
-- ════════════════════════════════════════════════════════════════════════
-- Drizzle owns the `public` tables but NOT Supabase's `auth` schema, so the
-- profiles↔auth.users link, signup trigger, and admin helper live here.
-- RLS is defense-in-depth: the trusted server (Drizzle via the service role /
-- direct connection) bypasses RLS, while any anon/authenticated access through
-- the Supabase API is constrained by the policies below.

-- ── profiles ↔ auth.users ───────────────────────────────────────────────
ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_id_auth_users_fk"
  FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

-- Auto-create a profile row whenever a new auth user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Admin check used by write policies.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── Enable RLS on every table ───────────────────────────────────────────
ALTER TABLE "societies"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "society_members"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_members"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE "articles"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "event_gallery_photos"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "announcements"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "newsletter_subscribers" ENABLE ROW LEVEL SECURITY;

-- ── Public read of published content ────────────────────────────────────
CREATE POLICY "events_public_read" ON "events"
  FOR SELECT USING (status = 'published');

CREATE POLICY "articles_public_read" ON "articles"
  FOR SELECT USING (status = 'published');

CREATE POLICY "announcements_public_read" ON "announcements"
  FOR SELECT USING (status = 'published');

CREATE POLICY "event_gallery_public_read" ON "event_gallery_photos"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "events" e
      WHERE e.id = event_id AND e.status = 'published'
    )
  );

-- ── Reference data: fully public read ───────────────────────────────────
CREATE POLICY "societies_public_read"       ON "societies"       FOR SELECT USING (true);
CREATE POLICY "society_members_public_read" ON "society_members" FOR SELECT USING (true);
CREATE POLICY "team_members_public_read"    ON "team_members"    FOR SELECT USING (true);

-- ── Admin full control on content tables ────────────────────────────────
CREATE POLICY "societies_admin_all" ON "societies"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "society_members_admin_all" ON "society_members"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "team_members_admin_all" ON "team_members"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "events_admin_all" ON "events"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "articles_admin_all" ON "articles"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "event_gallery_admin_all" ON "event_gallery_photos"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "announcements_admin_all" ON "announcements"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── Inbox: admin-only read/manage (inserts go through trusted server) ────
CREATE POLICY "contact_messages_admin_read" ON "contact_messages"
  FOR SELECT USING (public.is_admin());
CREATE POLICY "contact_messages_admin_manage" ON "contact_messages"
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "newsletter_admin_read" ON "newsletter_subscribers"
  FOR SELECT USING (public.is_admin());
CREATE POLICY "newsletter_admin_manage" ON "newsletter_subscribers"
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── profiles: self-access + admin oversight ─────────────────────────────
CREATE POLICY "profiles_self_or_admin_read" ON "profiles"
  FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_self_update" ON "profiles"
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_admin_manage" ON "profiles"
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
