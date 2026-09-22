import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://plygbavchjkvhyfswlgw.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseWdiYXZjaGprdmh5ZnN3bGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDI4NTksImV4cCI6MjEwNTYxODg1OX0.EQ9w2jvtaRMqo1T7ixFLCBO9i9ApydXhWlhwWzK5s2w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
