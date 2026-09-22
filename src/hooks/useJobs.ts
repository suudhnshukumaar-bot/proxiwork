import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Job, Application } from '../lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JobWithEmployer extends Job {
  employer_profiles?: {
    business_name: string | null;
    average_rating: number | null;
    profiles?: { full_name: string | null; city: string | null };
  };
}

export interface ApplicationWithJob extends Application {
  jobs?: JobWithEmployer;
}

// ─── usePublishedJobs ─────────────────────────────────────────────────────────

export function usePublishedJobs(categorySlug?: string) {
  const [jobs, setJobs] = useState<JobWithEmployer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          employer_profiles (
            business_name,
            average_rating,
            profiles ( full_name, city )
          )
        `)
        .in('status', ['published', 'applications_open'])
        .order('created_at', { ascending: false });

      if (categorySlug) {
        query = query.eq('category_slug', categorySlug);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setJobs((data as JobWithEmployer[]) ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
}

// ─── useJobDetail ─────────────────────────────────────────────────────────────

export function useJobDetail(id: string | undefined) {
  const [job, setJob] = useState<JobWithEmployer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('jobs')
      .select(`
        *,
        employer_profiles (
          business_name,
          average_rating,
          profiles ( full_name, city )
        )
      `)
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setJob(data as JobWithEmployer);
        setLoading(false);
      });
  }, [id]);

  return { job, loading, error };
}

// ─── useWorkerApplications ────────────────────────────────────────────────────

export function useWorkerApplications() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error: err } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          *,
          employer_profiles ( business_name, profiles ( full_name, city ) )
        )
      `)
      .eq('worker_id', user.id)
      .order('applied_at', { ascending: false });

    if (err) setError(err.message);
    else setApplications((data as ApplicationWithJob[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  return { applications, loading, error, refetch: fetchApplications };
}

// ─── useWorkerStats ───────────────────────────────────────────────────────────

export function useWorkerStats() {
  const [stats, setStats] = useState({
    totalApplied: 0,
    accepted: 0,
    completed: 0,
    totalEarned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [appRes, earningsRes] = await Promise.all([
        supabase.from('applications').select('status').eq('worker_id', user.id),
        supabase.from('earnings').select('amount').eq('worker_id', user.id),
      ]);

      const apps = appRes.data ?? [];
      const totalEarned = (earningsRes.data ?? []).reduce((sum, e) => sum + Number(e.amount), 0);

      setStats({
        totalApplied: apps.length,
        accepted: apps.filter(a => a.status === 'accepted').length,
        completed: apps.filter(a => a.status === 'completed').length,
        totalEarned,
      });
      setLoading(false);
    })();
  }, []);

  return { stats, loading };
}

// ─── applyToJob ───────────────────────────────────────────────────────────────

export async function applyToJob(
  jobId: string,
  message: string,
): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to apply.' };

  const { error } = await supabase.from('applications').insert({
    job_id: jobId,
    worker_id: user.id,
    message,
    status: 'pending',
  });

  return { error: error?.message ?? null };
}

// ─── useCategories ────────────────────────────────────────────────────────────

export function useCategories() {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; icon: string | null; color: string | null }[]>([]);

  useEffect(() => {
    supabase.from('categories').select('*').eq('active', true).then(({ data }) => {
      setCategories(data ?? []);
    });
  }, []);

  return categories;
}
