import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, Stack, TextField, Typography,
} from '@mui/material';
import { AccessTime, AccountCircleOutlined, EditOutlined, LocationOnOutlined, SchoolOutlined, WorkOutline } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

type WorkerDetails = {
  education: string | null;
  experience: string | null;
  skills: string[] | null;
  preferred_categories: string[] | null;
  total_jobs_completed: number;
  average_rating: number | null;
};

type ProfileForm = {
  full_name: string;
  phone: string;
  city: string;
  address: string;
  bio: string;
  education: string;
  experience: string;
  skills: string;
  categories: string;
};

const emptyForm: ProfileForm = {
  full_name: '', phone: '', city: '', address: '', bio: '',
  education: '', experience: '', skills: '', categories: '',
};

const splitTags = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

export default function WorkerProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [worker, setWorker] = useState<WorkerDetails | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase.from('worker_profiles').select('education,experience,skills,preferred_categories,total_jobs_completed,average_rating').eq('user_id', user.id).maybeSingle();
      if (!active) return;
      if (error) {
        setNotice({ type: 'error', text: 'Could not load your work details. You can still update your basic profile.' });
      } else {
        setWorker(data as WorkerDetails | null);
      }
      setLoading(false);
    };
    void loadProfile();
    return () => { active = false; };
  }, [user?.id]);

  useEffect(() => {
    setForm({
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      city: profile?.city ?? '',
      address: profile?.address ?? '',
      bio: profile?.bio ?? '',
      education: worker?.education ?? '',
      experience: worker?.experience ?? '',
      skills: worker?.skills?.join(', ') ?? '',
      categories: worker?.preferred_categories?.join(', ') ?? '',
    });
  }, [profile, worker]);

  const displayName = profile?.full_name?.trim() || user?.user_metadata?.full_name || 'Your name';
  const initials = useMemo(() => displayName.split(/\s+/).map((part: string) => part[0]).slice(0, 2).join('').toUpperCase(), [displayName]);
  const updateField = (field: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const saveProfile = async () => {
    if (!user?.id) {
      setNotice({ type: 'error', text: 'Sign in again to save profile changes.' });
      return;
    }
    setSaving(true);
    setNotice(null);
    const { error: profileError } = await supabase.from('profiles').update({
      full_name: form.full_name.trim() || null,
      phone: form.phone.trim() || null,
      city: form.city.trim() || null,
      address: form.address.trim() || null,
      bio: form.bio.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);
    if (profileError) {
      setNotice({ type: 'error', text: profileError.message || 'Unable to save your profile right now.' });
      setSaving(false);
      return;
    }

    const { error: workerError } = await supabase.from('worker_profiles').upsert({
      user_id: user.id,
      education: form.education.trim() || null,
      experience: form.experience.trim() || null,
      skills: splitTags(form.skills),
      preferred_categories: splitTags(form.categories),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (workerError) {
      setNotice({ type: 'error', text: `Basic profile saved, but work details could not be saved: ${workerError.message}` });
      setSaving(false);
      await refreshProfile();
      return;
    }

    setWorker((current) => ({
      education: form.education.trim() || null,
      experience: form.experience.trim() || null,
      skills: splitTags(form.skills),
      preferred_categories: splitTags(form.categories),
      total_jobs_completed: current?.total_jobs_completed ?? 0,
      average_rating: current?.average_rating ?? null,
    }));
    await refreshProfile();
    setEditing(false);
    setSaving(false);
    setNotice({ type: 'success', text: 'Your profile has been saved.' });
  };

  const cancelEditing = () => {
    setForm({
      full_name: profile?.full_name ?? '', phone: profile?.phone ?? '', city: profile?.city ?? '',
      address: profile?.address ?? '', bio: profile?.bio ?? '', education: worker?.education ?? '',
      experience: worker?.experience ?? '', skills: worker?.skills?.join(', ') ?? '', categories: worker?.preferred_categories?.join(', ') ?? '',
    });
    setEditing(false);
    setNotice(null);
  };

  return <Box sx={{ minHeight: '100%', bgcolor: '#f7f9fc', p: { xs: 2, md: 4 } }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 3 }}>
      <Box><Typography variant="h4" sx={{ color: '#12395f', fontWeight: 800 }}>My Profile</Typography><Typography color="text.secondary" sx={{ mt: 0.5 }}>Your details help local employers get to know you.</Typography></Box>
      {!editing && <Button variant="contained" startIcon={<EditOutlined />} onClick={() => setEditing(true)} sx={{ bgcolor: '#00B4A6', '&:hover': { bgcolor: '#008f85' } }}>Edit profile</Button>}
    </Stack>

    {notice && <Alert severity={notice.type} onClose={() => setNotice(null)} sx={{ mb: 2 }}>{notice.text}</Alert>}

    <Card elevation={0} sx={{ overflow: 'hidden', border: '1px solid #e4e7ec', borderRadius: 3, mb: 3 }}>
      <Box sx={{ height: { xs: 120, md: 170 }, background: 'linear-gradient(120deg, #0f3460 0%, #17607a 55%, #00b4a6 100%)', position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.14, backgroundImage: 'radial-gradient(circle at 15% 130%, #fff 0 22%, transparent 22.4%), radial-gradient(circle at 88% -20%, #fff 0 28%, transparent 28.4%)' }} />
      </Box>
      <CardContent sx={{ px: { xs: 2, md: 4 }, pb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mt: { xs: -5, md: -6 }, position: 'relative' }}>
          <Avatar sx={{ width: 96, height: 96, border: '4px solid white', bgcolor: '#00B4A6', color: 'white', fontWeight: 800, fontSize: 30, boxShadow: '0 4px 14px rgba(15,52,96,0.16)' }}>{initials || <AccountCircleOutlined />}</Avatar>
          <Box sx={{ flex: 1, pt: { xs: 0, sm: 5 } }}><Typography variant="h5" fontWeight={800} color="#12395f">{displayName}</Typography><Typography color="text.secondary">Worker · {profile?.city || 'Add your city'}</Typography></Box>
          <Stack direction="row" spacing={1} sx={{ pt: { xs: 0, sm: 5 } }}><Chip icon={<WorkOutline />} label={`${worker?.total_jobs_completed ?? 0} jobs completed`} sx={{ bgcolor: '#e9fbf8', color: '#087e75', fontWeight: 700 }} />{worker?.average_rating != null && <Chip label={`★ ${Number(worker.average_rating).toFixed(1)} rating`} sx={{ bgcolor: '#fff7e6', color: '#936000', fontWeight: 700 }} />}</Stack>
        </Stack>
      </CardContent>
    </Card>

    {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#00B4A6' }} /></Box> : <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Card elevation={0} sx={{ border: '1px solid #e4e7ec', borderRadius: 3, height: '100%' }}><CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={700} color="#12395f" sx={{ mb: 1 }}>Introduction</Typography>
          {editing ? <TextField fullWidth multiline minRows={3} label="About you" placeholder="Tell employers a little about yourself" value={form.bio} onChange={updateField('bio')} helperText="A short introduction about your strengths and the work you enjoy." /> : <Typography color={profile?.bio ? 'text.primary' : 'text.secondary'} sx={{ mb: 2 }}>{profile?.bio || 'Add a short introduction so employers can learn about you.'}</Typography>}
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            {editing ? <>
              <TextField fullWidth label="Full name" value={form.full_name} onChange={updateField('full_name')} />
              <TextField fullWidth label="Phone" value={form.phone} onChange={updateField('phone')} />
              <TextField fullWidth label="City" value={form.city} onChange={updateField('city')} />
              <TextField fullWidth label="Area / address" value={form.address} onChange={updateField('address')} />
            </> : <>
              <Stack direction="row" spacing={1.5} alignItems="center"><AccountCircleOutlined color="action" /><Typography>{profile?.phone || 'Add a contact number'}</Typography></Stack>
              <Stack direction="row" spacing={1.5} alignItems="center"><LocationOnOutlined color="action" /><Typography>{[profile?.address, profile?.city, profile?.pincode].filter(Boolean).join(', ') || 'Add your location'}</Typography></Stack>
              <Stack direction="row" spacing={1.5} alignItems="center"><Typography color="text.secondary" sx={{ width: 24, textAlign: 'center' }}>@</Typography><Typography sx={{ overflowWrap: 'anywhere' }}>{profile?.email || user?.email || 'Email not available'}</Typography></Stack>
            </>}
          </Stack>
        </CardContent></Card>
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <Card elevation={0} sx={{ border: '1px solid #e4e7ec', borderRadius: 3 }}><CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={700} color="#12395f" sx={{ mb: 2 }}>Work details</Typography>
          {editing ? <Stack spacing={2}><TextField fullWidth label="Education" value={form.education} onChange={updateField('education')} placeholder="e.g. Higher Secondary Certificate" /><TextField fullWidth label="Experience" value={form.experience} onChange={updateField('experience')} placeholder="e.g. 1 year in retail assistance" /><TextField fullWidth label="Skills" value={form.skills} onChange={updateField('skills')} placeholder="Customer service, packing, cash handling" helperText="Separate skills with commas." /><TextField fullWidth label="Preferred work categories" value={form.categories} onChange={updateField('categories')} placeholder="Retail, Food service, Events" helperText="Separate categories with commas." /></Stack> : <Stack spacing={2.5}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start"><SchoolOutlined color="action" sx={{ mt: 0.2 }} /><Box><Typography variant="body2" color="text.secondary">Education</Typography><Typography>{worker?.education || 'Add your education'}</Typography></Box></Stack>
            <Stack direction="row" spacing={1.5} alignItems="flex-start"><WorkOutline color="action" sx={{ mt: 0.2 }} /><Box><Typography variant="body2" color="text.secondary">Experience</Typography><Typography>{worker?.experience || 'Add your relevant experience'}</Typography></Box></Stack>
            <Stack direction="row" spacing={1.5} alignItems="flex-start"><AccessTime color="action" sx={{ mt: 0.2 }} /><Box sx={{ flex: 1 }}><Typography variant="body2" color="text.secondary">Skills</Typography>{worker?.skills?.length ? <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.8 }}>{worker.skills.map((skill) => <Chip key={skill} size="small" label={skill} sx={{ bgcolor: '#eef7fb', color: '#12395f' }} />)}</Stack> : <Typography>Add skills to help employers find you</Typography>}</Box></Stack>
            <Stack direction="row" spacing={1.5} alignItems="flex-start"><WorkOutline color="action" sx={{ mt: 0.2 }} /><Box sx={{ flex: 1 }}><Typography variant="body2" color="text.secondary">Interested in</Typography>{worker?.preferred_categories?.length ? <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.8 }}>{worker.preferred_categories.map((category) => <Chip key={category} size="small" label={category} variant="outlined" />)}</Stack> : <Typography>Add the types of work you prefer</Typography>}</Box></Stack>
          </Stack>}
          {editing && <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3 }}><Button onClick={cancelEditing} disabled={saving} sx={{ color: '#667085' }}>Cancel</Button><Button variant="contained" onClick={saveProfile} disabled={saving} sx={{ bgcolor: '#00B4A6', '&:hover': { bgcolor: '#008f85' } }}>{saving ? 'Saving…' : 'Save changes'}</Button></Stack>}
        </CardContent></Card>
      </Grid>
    </Grid>}
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Your profile details are visible to employers when you apply for work.</Typography>
  </Box>;
}
