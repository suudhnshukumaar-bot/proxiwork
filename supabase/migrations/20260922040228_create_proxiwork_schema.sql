/*
# ProxiWork - Complete Schema Migration

## Overview
Creates the full database schema for the ProxiWork local flexible-work marketplace.

## Tables Created

### profiles
Core user profile linked to auth.users. Stores name, email, phone, role (worker/employer/admin),
address, location coordinates, bio, and verification status.

### worker_profiles
Extended profile for workers: education, skills, experience, preferred categories,
work radius, and availability (days + hours).

### employer_profiles
Extended profile for employers: business name, type, description, address,
location, operating hours, and verification status.

### categories
Job categories (shop helper, event helper, data entry, etc.) with icon and color.

### jobs
Job postings: title, category, description, required skills, location, schedule,
payment type/amount, workers required, status, and soft-delete timestamp.

### applications
Worker applications for jobs: message, status (pending/accepted/rejected/withdrawn).

### job_completions
Tracks completion confirmations from both employer and worker, and payment status.

### earnings
Worker earnings per completed job, with payment status.

### ratings_reviews
Post-completion mutual ratings (1-5 stars + optional text).

### notifications
In-app notifications for both roles, with type, read status, and optional job link.

### reports
Safety reports (fake job, harassment, etc.) with admin review status.

## Security
RLS is enabled on all tables. Policies are scoped to authenticated users.
Workers can read their own profile and see public job listings. Employers manage own jobs.
Admin role identified via profiles.role = 'admin'.
*/

-- Enable PostGIS for geo queries (if not already)
-- We use a simple lat/lng distance formula instead to avoid extension dependencies

-- ─── PROFILES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  role text NOT NULL DEFAULT 'worker' CHECK (role IN ('worker','employer','admin')),
  profile_photo text,
  address text,
  city text,
  pincode text,
  latitude double precision,
  longitude double precision,
  bio text,
  verification_status text NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified','pending','verified','rejected')),
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Public select for job applicant cards / employer cards
DROP POLICY IF EXISTS "profiles_public_select" ON profiles;
CREATE POLICY "profiles_public_select" ON profiles FOR SELECT TO authenticated
  USING (true);

-- ─── WORKER PROFILES ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS worker_profiles (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  education text,
  skills text[] DEFAULT '{}',
  experience text,
  preferred_categories text[] DEFAULT '{}',
  preferred_radius integer DEFAULT 5,
  available_days text[] DEFAULT '{}',
  preferred_start_time time,
  preferred_end_time time,
  total_jobs_completed integer NOT NULL DEFAULT 0,
  average_rating numeric(3,2),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "worker_profiles_select" ON worker_profiles;
CREATE POLICY "worker_profiles_select" ON worker_profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "worker_profiles_insert" ON worker_profiles;
CREATE POLICY "worker_profiles_insert" ON worker_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "worker_profiles_update" ON worker_profiles;
CREATE POLICY "worker_profiles_update" ON worker_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "worker_profiles_delete" ON worker_profiles;
CREATE POLICY "worker_profiles_delete" ON worker_profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ─── EMPLOYER PROFILES ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employer_profiles (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text,
  business_type text,
  business_description text,
  business_address text,
  latitude double precision,
  longitude double precision,
  operating_hours text,
  verification_status text NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified','pending','verified','rejected')),
  average_rating numeric(3,2),
  total_jobs_posted integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "employer_profiles_select" ON employer_profiles;
CREATE POLICY "employer_profiles_select" ON employer_profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "employer_profiles_insert" ON employer_profiles;
CREATE POLICY "employer_profiles_insert" ON employer_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "employer_profiles_update" ON employer_profiles;
CREATE POLICY "employer_profiles_update" ON employer_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "employer_profiles_delete" ON employer_profiles;
CREATE POLICY "employer_profiles_delete" ON employer_profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ─── CATEGORIES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  color text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select" ON categories;
CREATE POLICY "categories_select" ON categories FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "categories_insert_admin" ON categories;
CREATE POLICY "categories_insert_admin" ON categories FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "categories_update_admin" ON categories;
CREATE POLICY "categories_update_admin" ON categories FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "categories_delete_admin" ON categories;
CREATE POLICY "categories_delete_admin" ON categories FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ─── JOBS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  category_slug text NOT NULL,
  description text,
  responsibilities text,
  required_skills text[] DEFAULT '{}',
  location_name text,
  latitude double precision,
  longitude double precision,
  start_date date,
  end_date date,
  start_time time,
  end_time time,
  working_days integer DEFAULT 1,
  payment_type text NOT NULL DEFAULT 'hourly' CHECK (payment_type IN ('hourly','daily','fixed')),
  payment_amount numeric(10,2) NOT NULL DEFAULT 0,
  workers_required integer NOT NULL DEFAULT 1,
  workers_selected integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','applications_open','worker_selected','upcoming','in_progress','completed','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jobs_employer_id_idx ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS jobs_category_slug_idx ON jobs(category_slug);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs_select_published" ON jobs;
CREATE POLICY "jobs_select_published" ON jobs FOR SELECT TO authenticated
  USING (
    status NOT IN ('draft') OR
    employer_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "jobs_insert_employer" ON jobs;
CREATE POLICY "jobs_insert_employer" ON jobs FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = employer_id AND
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('employer','admin')
  );

DROP POLICY IF EXISTS "jobs_update_employer" ON jobs;
CREATE POLICY "jobs_update_employer" ON jobs FOR UPDATE TO authenticated
  USING (
    employer_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    employer_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "jobs_delete_employer" ON jobs;
CREATE POLICY "jobs_delete_employer" ON jobs FOR DELETE TO authenticated
  USING (
    employer_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- ─── APPLICATIONS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text,
  relevant_skills text,
  previous_experience text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','withdrawn')),
  applied_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id, worker_id)
);

CREATE INDEX IF NOT EXISTS applications_job_id_idx ON applications(job_id);
CREATE INDEX IF NOT EXISTS applications_worker_id_idx ON applications(worker_id);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "applications_select" ON applications;
CREATE POLICY "applications_select" ON applications FOR SELECT TO authenticated
  USING (
    worker_id = auth.uid() OR
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "applications_insert_worker" ON applications;
CREATE POLICY "applications_insert_worker" ON applications FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = worker_id AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'worker'
  );

DROP POLICY IF EXISTS "applications_update" ON applications;
CREATE POLICY "applications_update" ON applications FOR UPDATE TO authenticated
  USING (
    worker_id = auth.uid() OR
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    worker_id = auth.uid() OR
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "applications_delete" ON applications;
CREATE POLICY "applications_delete" ON applications FOR DELETE TO authenticated
  USING (worker_id = auth.uid());

-- ─── JOB COMPLETIONS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  employer_confirmation boolean DEFAULT false,
  worker_confirmation boolean DEFAULT false,
  completed_at timestamptz,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','processing','released','disputed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id, worker_id)
);

ALTER TABLE job_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_completions_select" ON job_completions;
CREATE POLICY "job_completions_select" ON job_completions FOR SELECT TO authenticated
  USING (
    worker_id = auth.uid() OR
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "job_completions_insert" ON job_completions;
CREATE POLICY "job_completions_insert" ON job_completions FOR INSERT TO authenticated
  WITH CHECK (
    worker_id = auth.uid() OR
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid())
  );

DROP POLICY IF EXISTS "job_completions_update" ON job_completions;
CREATE POLICY "job_completions_update" ON job_completions FOR UPDATE TO authenticated
  USING (
    worker_id = auth.uid() OR
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    worker_id = auth.uid() OR
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "job_completions_delete" ON job_completions;
CREATE POLICY "job_completions_delete" ON job_completions FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ─── EARNINGS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','processing','released')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS earnings_worker_id_idx ON earnings(worker_id);

ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "earnings_select" ON earnings;
CREATE POLICY "earnings_select" ON earnings FOR SELECT TO authenticated
  USING (
    worker_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "earnings_insert" ON earnings;
CREATE POLICY "earnings_insert" ON earnings FOR INSERT TO authenticated
  WITH CHECK (
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "earnings_update" ON earnings;
CREATE POLICY "earnings_update" ON earnings FOR UPDATE TO authenticated
  USING (
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "earnings_delete" ON earnings;
CREATE POLICY "earnings_delete" ON earnings FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ─── RATINGS & REVIEWS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ratings_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewed_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS ratings_reviewed_user_idx ON ratings_reviews(reviewed_user_id);

ALTER TABLE ratings_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ratings_select" ON ratings_reviews;
CREATE POLICY "ratings_select" ON ratings_reviews FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "ratings_insert" ON ratings_reviews;
CREATE POLICY "ratings_insert" ON ratings_reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reviewer_id AND reviewer_id != reviewed_user_id);

DROP POLICY IF EXISTS "ratings_update" ON ratings_reviews;
CREATE POLICY "ratings_update" ON ratings_reviews FOR UPDATE TO authenticated
  USING (auth.uid() = reviewer_id) WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "ratings_delete" ON ratings_reviews;
CREATE POLICY "ratings_delete" ON ratings_reviews FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info','success','warning','error','application','job','payment','rating')),
  related_job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  read_status boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select" ON notifications;
CREATE POLICY "notifications_select" ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_insert" ON notifications;
CREATE POLICY "notifications_insert" ON notifications FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "notifications_update" ON notifications;
CREATE POLICY "notifications_update" ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_delete" ON notifications;
CREATE POLICY "notifications_delete" ON notifications FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ─── REPORTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('fake_job','incorrect_information','suspicious_activity','payment_issue','harassment','other')),
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','resolved','dismissed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reports_select" ON reports;
CREATE POLICY "reports_select" ON reports FOR SELECT TO authenticated
  USING (
    reporter_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "reports_insert" ON reports;
CREATE POLICY "reports_insert" ON reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "reports_update_admin" ON reports;
CREATE POLICY "reports_update_admin" ON reports FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "reports_delete_admin" ON reports;
CREATE POLICY "reports_delete_admin" ON reports FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ─── SEED CATEGORIES ──────────────────────────────────────────────────────────
INSERT INTO categories (name, slug, icon, color) VALUES
  ('Shop Helper', 'shop-helper', 'StorefrontOutlined', '#1976d2'),
  ('Event Helper', 'event-helper', 'EventOutlined', '#9c27b0'),
  ('Data Entry', 'data-entry', 'ComputerOutlined', '#0288d1'),
  ('Delivery', 'delivery', 'DeliveryDiningOutlined', '#ed6c02'),
  ('Packing', 'packing', 'InventoryOutlined', '#2e7d32'),
  ('Receptionist', 'receptionist', 'RecordVoiceOverOutlined', '#1565c0'),
  ('Customer Support', 'customer-support', 'SupportAgentOutlined', '#00695c'),
  ('Sales/Promotion', 'sales-promotion', 'CampaignOutlined', '#c62828'),
  ('Inventory Assistance', 'inventory-assistance', 'WarehouseOutlined', '#6a1b9a'),
  ('Other', 'other', 'WorkOutlined', '#546e7a')
ON CONFLICT (slug) DO NOTHING;

-- ─── FUNCTION: auto-create profile on signup ─────────────────────────────────
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
    COALESCE(NEW.raw_user_meta_data->>'role', 'worker')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
