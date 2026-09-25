-- Limit profile tables to the owner. The previous authenticated-wide SELECT
-- policies exposed contact and work-profile data to every signed-in account.
DROP POLICY IF EXISTS "profiles_public_select" ON public.profiles;

DROP POLICY IF EXISTS "worker_profiles_select" ON public.worker_profiles;
CREATE POLICY "worker_profiles_select_own" ON public.worker_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "employer_profiles_select" ON public.employer_profiles;
CREATE POLICY "employer_profiles_select_own" ON public.employer_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users may add a notification to their own inbox, but not someone else's.
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
CREATE POLICY "notifications_insert_own" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Never allow public sign-up metadata to grant an admin role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN NEW.raw_user_meta_data->>'role' = 'employer' THEN 'employer'
      ELSE 'worker'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- The browser profile form must not let users promote themselves or change roles.
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() = OLD.id THEN
    RAISE EXCEPTION 'Profile roles cannot be changed by the account owner';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_role ON public.profiles;
CREATE TRIGGER protect_profile_role
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_change();
