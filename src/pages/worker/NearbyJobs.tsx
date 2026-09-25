import { useMemo, useState } from 'react';
import {
  AccessTime, ArrowForward, BusinessCenterOutlined, CalendarMonth,
  LocationOnOutlined, Search, VerifiedOutlined,
} from '@mui/icons-material';
import {
  Box, Button, Card, CardContent, Chip, InputAdornment, Stack,
  TextField, Typography,
} from '@mui/material';

type WorkDuration = '4_hours' | '8_hours' | 'whole_day';
type Job = {
  id: number;
  title: string;
  employer: string;
  category: string;
  duration: WorkDuration;
  pay: number;
  payUnit: string;
  location: string;
  distance: string;
  date: string;
  posted: string;
};

const jobs: Job[] = [
  { id: 1, title: 'Store Helper', employer: 'Shree General Store', category: 'Retail', duration: '4_hours', pay: 450, payUnit: 'shift', location: 'College Road, Nashik', distance: '0.8 km away', date: 'Today · 2:00 PM – 6:00 PM', posted: 'Posted 2 hours ago' },
  { id: 2, title: 'Packing Assistant', employer: 'City Mart', category: 'Packing', duration: '8_hours', pay: 750, payUnit: 'day', location: 'Canada Corner, Nashik', distance: '1.4 km away', date: 'Tomorrow · 9:00 AM – 5:00 PM', posted: 'Posted 4 hours ago' },
  { id: 3, title: 'Counter Helper', employer: 'Fresh Food Corner', category: 'Food service', duration: '4_hours', pay: 400, payUnit: 'shift', location: 'Indira Nagar, Nashik', distance: '2.1 km away', date: 'Today · 5:00 PM – 9:00 PM', posted: 'Posted yesterday' },
  { id: 4, title: 'Event Setup Crew', employer: 'Cedar Events', category: 'Events', duration: 'whole_day', pay: 900, payUnit: 'day', location: 'Gangapur Road, Nashik', distance: '2.8 km away', date: 'Saturday · 8:00 AM – 6:00 PM', posted: 'Posted yesterday' },
  { id: 5, title: 'Inventory Assistant', employer: 'Nashik Home & Living', category: 'Retail', duration: '8_hours', pay: 800, payUnit: 'day', location: 'Panchavati, Nashik', distance: '3.2 km away', date: 'Oct 1 · 10:00 AM – 6:00 PM', posted: 'Posted 2 days ago' },
  { id: 6, title: 'Grocery Order Packer', employer: 'Daily Basket', category: 'Packing', duration: '4_hours', pay: 425, payUnit: 'shift', location: 'Mumbai Naka, Nashik', distance: '3.7 km away', date: 'Oct 1 · 3:00 PM – 7:00 PM', posted: 'Posted 2 days ago' },
];

const durationOptions: { value: WorkDuration; label: string; helper: string }[] = [
  { value: '4_hours', label: '4 hours', helper: 'Short, flexible shifts' },
  { value: '8_hours', label: '8 hours', helper: 'Full working shift' },
  { value: 'whole_day', label: 'Whole day', helper: 'Day-long opportunities' },
];

const durationLabel: Record<WorkDuration, string> = {
  '4_hours': '4 hours', '8_hours': '8 hours', whole_day: 'Whole day',
};

export default function NearbyJobs() {
  const [keyword, setKeyword] = useState('');
  const [place, setPlace] = useState('Nashik');
  const [duration, setDuration] = useState<WorkDuration | ''>('');
  const [searched, setSearched] = useState(false);
  const [appliedSearch, setAppliedSearch] = useState({ keyword: '', place: 'Nashik', duration: '' as WorkDuration | '' });

  const results = useMemo(() => {
    const query = appliedSearch.keyword.trim().toLowerCase();
    const locationQuery = appliedSearch.place.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesKeyword = !query || `${job.title} ${job.employer} ${job.category}`.toLowerCase().includes(query);
      const matchesLocation = !locationQuery || job.location.toLowerCase().includes(locationQuery);
      const matchesDuration = !appliedSearch.duration || job.duration === appliedSearch.duration;
      return matchesKeyword && matchesLocation && matchesDuration;
    });
  }, [appliedSearch]);

  const searchForWork = () => {
    setAppliedSearch({ keyword, place, duration });
    setSearched(true);
  };

  return <Box sx={{ minHeight: '100%', bgcolor: '#f7f9fc', p: { xs: 2, md: 4 } }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 3 }}>
      <Box><Typography variant="h4" sx={{ color: '#12395f', fontWeight: 800 }}>Find Work</Typography><Typography color="text.secondary" sx={{ mt: 0.5 }}>Good work is closer than you think. Find a shift that fits your day.</Typography></Box>
      <Chip icon={<BusinessCenterOutlined />} label={`${jobs.length} sample jobs`} sx={{ bgcolor: '#e9fbf8', color: '#087e75', fontWeight: 700 }} />
    </Stack>

    <Card elevation={0} sx={{ mb: 3, border: '1px solid #e1e8ef', borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ height: 7, background: 'linear-gradient(90deg, #0F3460 0%, #00B4A6 100%)' }} />
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ color: '#12395f', fontWeight: 700 }}>Search for work</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4, mb: 2.5 }}>Tell us what kind of work you’re looking for.</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField fullWidth label="Job title or category" placeholder="Try ‘shop helper’ or ‘packing’" value={keyword} onChange={(event) => setKeyword(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') searchForWork(); }} InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
          <TextField fullWidth label="Location" placeholder="City or neighborhood" value={place} onChange={(event) => setPlace(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') searchForWork(); }} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlined fontSize="small" /></InputAdornment> }} />
        </Stack>
        <Typography variant="subtitle2" sx={{ color: '#344054', mt: 2.5, mb: 1 }}>How long are you available?</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          {durationOptions.map((option) => {
            const active = duration === option.value;
            return <Card key={option.value} component="button" type="button" onClick={() => setDuration(active ? '' : option.value)} aria-pressed={active} sx={{ flex: 1, p: 1.5, textAlign: 'left', cursor: 'pointer', borderRadius: 2.5, border: active ? '2px solid #00B4A6' : '1px solid #d9e1ea', bgcolor: active ? '#effbf9' : '#fff', transition: 'all 160ms ease', '&:hover': { borderColor: '#00B4A6', bgcolor: '#f6fdfc' } }}>
              <Stack direction="row" spacing={1.2} alignItems="center"><AccessTime sx={{ color: active ? '#00a99d' : '#0F3460' }} /><Box><Typography fontWeight={700} color="#12395f">{option.label}</Typography><Typography variant="caption" color="text.secondary">{option.helper}</Typography></Box></Stack>
            </Card>;
          })}
        </Stack>
        <Button fullWidth variant="contained" startIcon={<Search />} endIcon={<ArrowForward />} onClick={searchForWork} sx={{ mt: 2.5, py: 1.35, bgcolor: '#00B4A6', fontWeight: 700, '&:hover': { bgcolor: '#008f85' } }}>Search for work</Button>
      </CardContent>
    </Card>

    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
      <Box><Typography variant="h6" fontWeight={700} color="#12395f">{searched ? 'Search results' : 'Opportunities near you'}</Typography><Typography variant="body2" color="text.secondary">{results.length ? `${results.length} ${results.length === 1 ? 'job' : 'jobs'}${appliedSearch.place.trim() ? ` around ${appliedSearch.place.trim()}` : ''}` : 'Try changing the title, location, or shift length.'}</Typography></Box>
      {appliedSearch.duration && <Chip label={durationLabel[appliedSearch.duration]} onDelete={() => { setDuration(''); setAppliedSearch((current) => ({ ...current, duration: '' })); }} sx={{ bgcolor: '#eef7fb', color: '#12395f' }} />}
    </Stack>

    {results.length > 0 ? <Stack spacing={1.7}>{results.map((job) => <Card key={job.id} elevation={0} sx={{ border: '1px solid #e4e7ec', borderRadius: 3, transition: 'box-shadow 160ms ease, transform 160ms ease', '&:hover': { boxShadow: '0 8px 24px rgba(15,52,96,0.08)', transform: 'translateY(-1px)' } }}><CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}><Box sx={{ minWidth: 0 }}><Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap"><Typography variant="h6" fontWeight={700} color="#12395f">{job.title}</Typography><VerifiedOutlined sx={{ color: '#00a99d', fontSize: 19 }} /></Stack><Typography fontWeight={600} sx={{ mt: 0.25 }}>{job.employer}</Typography><Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 1.4 }}><Typography variant="body2" color="text.secondary"><LocationOnOutlined sx={{ fontSize: 17, verticalAlign: 'text-bottom', mr: 0.35 }} />{job.location} · {job.distance}</Typography><Typography variant="body2" color="text.secondary"><CalendarMonth sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.4 }} />{job.date}</Typography></Stack></Box><Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={0.6}><Typography variant="h6" fontWeight={800} color="#087e75">₹{job.pay}<Typography component="span" variant="body2" color="text.secondary" fontWeight={400}> / {job.payUnit}</Typography></Typography><Typography variant="caption" color="text.secondary">{job.posted}</Typography></Stack></Stack>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.7 }}><Chip size="small" label={job.category} sx={{ bgcolor: '#eef4fa', color: '#12395f', fontWeight: 600 }} /><Chip size="small" icon={<AccessTime sx={{ fontSize: '16px !important' }} />} label={durationLabel[job.duration]} sx={{ bgcolor: '#f2f4f7', color: '#475467' }} /></Stack>
    </CardContent></Card>)}</Stack> : <Card elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: 3 }}><Search sx={{ color: '#98a2b3', fontSize: 34, mb: 1 }} /><Typography fontWeight={700} color="#12395f">No matching work found</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Try a broader job title or another nearby location.</Typography><Button onClick={() => { setKeyword(''); setPlace(''); setDuration(''); }} sx={{ mt: 1.5, color: '#008f85' }}>Clear search</Button></Card>}

    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Sample job listings for preview. Search and map services can be connected next.</Typography>
  </Box>;
}
