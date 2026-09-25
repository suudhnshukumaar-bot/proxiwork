import { useState } from 'react';
import { Box, Card, CardContent, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import { AccessTime, LocationOn } from '@mui/icons-material';

const jobs = [
  { role: 'Store Assistant', company: 'Shree General Store', place: 'College Road, Nashik', date: 'Today · 2:00 PM – 6:00 PM', pay: '₹500', status: 'Confirmed', group: 'upcoming' },
  { role: 'Event Setup Helper', company: 'Cedar Events', place: 'Gangapur Road, Nashik', date: 'Tomorrow · 9:00 AM – 5:00 PM', pay: '₹900', status: 'Confirmed', group: 'upcoming' },
  { role: 'Packing Associate', company: 'City Mart', place: 'Canada Corner, Nashik', date: 'Sep 22 · 9:00 AM – 5:00 PM', pay: '₹750', status: 'Completed', group: 'completed' },
  { role: 'Counter Assistant', company: 'Fresh Food Corner', place: 'Indira Nagar, Nashik', date: 'Sep 19 · 4:00 PM – 8:00 PM', pay: '₹450', status: 'Completed', group: 'completed' },
];

export default function MyJobs() {
  const [tab, setTab] = useState(0);
  const visible = tab === 1 ? jobs.filter((job) => job.group === 'upcoming') : tab === 2 ? jobs.filter((job) => job.group === 'completed') : jobs;
  return <Box sx={{ minHeight: '100%', bgcolor: '#f7f9fc', p: { xs: 2, md: 4 } }}>
    <Typography variant="h4" sx={{ color: '#12395f', fontWeight: 800 }}>My Jobs</Typography><Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Your confirmed shifts and completed work.</Typography>
    <Tabs value={tab} onChange={(_, value: number) => setTab(value)} sx={{ mb: 2, '& .Mui-selected': { color: '#008f85' }, '& .MuiTabs-indicator': { bgcolor: '#00a99d' } }}><Tab label={`All (${jobs.length})`} /><Tab label="Upcoming (2)" /><Tab label="Completed (2)" /></Tabs>
    <Stack spacing={2}>{visible.map((job) => <Card key={job.role} elevation={0} sx={{ border: '1px solid #e4e7ec', borderRadius: 3 }}><CardContent sx={{ p: { xs: 2, md: 2.5 } }}><Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}><Box><Typography variant="h6" fontWeight={700} color="#12395f">{job.role}</Typography><Typography fontWeight={600} sx={{ mt: 0.4 }}>{job.company}</Typography><Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 1.5 }}><Typography variant="body2" color="text.secondary"><LocationOn sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.4 }} />{job.place}</Typography><Typography variant="body2" color="text.secondary"><AccessTime sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.4 }} />{job.date}</Typography></Stack></Box><Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1}><Typography fontWeight={800} color="#008f85">{job.pay}</Typography><Chip size="small" label={job.status} sx={{ bgcolor: job.group === 'upcoming' ? '#e9fbf8' : '#f2f4f7', color: job.group === 'upcoming' ? '#008f85' : '#667085', fontWeight: 700 }} /></Stack></Stack></CardContent></Card>)}</Stack>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>These sample shifts are for preview only.</Typography>
  </Box>;
}
