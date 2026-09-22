// ─── Auth / User Profiles ────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: 'worker' | 'employer' | 'admin';
  profile_photo: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  bio: string | null;
  verification_status: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkerProfile {
  user_id: string;
  education: string | null;
  skills: string[];
  experience: string | null;
  preferred_categories: string[];
  preferred_radius: number | null;
  available_days: string[];
  preferred_start_time: string | null;
  preferred_end_time: string | null;
  total_jobs_completed: number;
  average_rating: number | null;
}

export interface EmployerProfile {
  user_id: string;
  business_name: string | null;
  business_type: string | null;
  business_description: string | null;
  business_address: string | null;
  latitude: number | null;
  longitude: number | null;
  operating_hours: string | null;
  verification_status: string | null;
  average_rating: number | null;
  total_jobs_posted: number;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  active: boolean;
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export type JobStatus =
  | 'draft'
  | 'published'
  | 'applications_open'
  | 'worker_selected'
  | 'upcoming'
  | 'in_progress'
  | 'completed'
  | 'closed';

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  category_slug: string | null;
  description: string | null;
  responsibilities: string | null;
  required_skills: string[];
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  working_days: string | null;
  payment_type: 'hourly' | 'daily' | 'fixed';
  payment_amount: number | null;
  workers_required: number;
  workers_selected: number;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

// ─── Applications ─────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  job_id: string;
  worker_id: string;
  message: string | null;
  relevant_skills: string | null;
  previous_experience: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  applied_at: string;
  updated_at: string;
}

// ─── Job Completion & Payments ────────────────────────────────────────────────

export interface JobCompletion {
  id: string;
  job_id: string;
  worker_id: string;
  employer_confirmation: boolean;
  worker_confirmation: boolean;
  completed_at: string | null;
  payment_status: 'pending' | 'processing' | 'released' | 'disputed';
}

export interface Earning {
  id: string;
  worker_id: string;
  job_id: string;
  amount: number;
  payment_status: string;
  created_at: string;
}

// ─── Ratings & Reviews ────────────────────────────────────────────────────────

export interface RatingReview {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  review: string | null;
  created_at: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_job_id: string | null;
  read_status: boolean;
  created_at: string;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  job_id: string | null;
  category: string;
  description: string;
  status: string;
  created_at: string;
}

// ─── Composite / Join Types ───────────────────────────────────────────────────

export type JobWithEmployer = Job & {
  employer_profile?: EmployerProfile & {
    profiles?: Profile;
  };
};

export type ApplicationWithWorker = Application & {
  worker_profile?: WorkerProfile;
  profiles?: Profile;
};
