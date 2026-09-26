import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { AccessTime, ArrowForward, CalendarMonth, CurrencyRupee, Star, Work } from '@mui/icons-material';

const navy = '#12395f';
const teal = '#00a99d';
const demoJobs = [
  { title: 'Store Assistant', company: 'Shree General Store', date: 'Today · 2:00 PM – 6:00 PM', pay: '₹500', status: 'Confirmed' },
  { title: 'Event Setup Helper', company: 'Cedar Events', date: 'Tomorrow · 9:00 AM – 5:00 PM', pay: '₹900', status: 'Upcoming' },
];

function SummaryCard({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: ReactNode }) {
  return <Card elevation={0} sx={{ height: '100%', border: '1px solid #e4e7ec', borderRadius: 3 }}><CardContent>
    <Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="h5" sx={{ color: navy, fontWeight: 800, mt: 1 }}>{value}</Typography></Box><Avatar sx={{ bgcolor: '#e9fbf8', color: teal }}>{icon}</Avatar></Stack>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{hint}</Typography>
  </CardContent></Card>;
}

export default function WorkerDashboard() {
  return <Box sx={{ minHeight: '100%', bgcolor: '#EAF5FE', p: { xs: 2, md: 4 } }}>
    <Box sx={{ position: 'relative', overflow: 'hidden', mb: 3, p: { xs: 2.5, md: 3 }, minHeight: 110, borderRadius: 4, color: '#fff', background: 'linear-gradient(115deg, #2878B5 0%, #2585A5 66%, #11927F 100%)', boxShadow: '0 18px 44px rgba(15,52,96,.13)', '@keyframes drift': { '0%,100%': { transform: 'translateY(0) rotate(-7deg)' }, '50%': { transform: 'translateY(-11px) rotate(2deg)' } }, '@keyframes orbit': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } }, '@media (prefers-reduced-motion: reduce)': { '& .dashboard-orbit, & .dashboard-float': { animation: 'none !important' } } }}>
      <Box className="dashboard-orbit" aria-hidden="true" sx={{ position: 'absolute', width: 270, height: 270, right: { xs: -140, md: 110 }, top: -95, border: '1px solid rgba(255,255,255,.2)', borderRadius: '50%', animation: 'orbit 28s linear infinite', '&:before': { content: '""', position: 'absolute', width: 12, height: 12, top: 34, left: 35, borderRadius: '50%', bgcolor: '#6ce6d7', boxShadow: '0 0 22px #6ce6d7' } }} />
      <Box className="dashboard-float" sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', right: { sm: 30, md: 60 }, top: 26, p: 1.4, borderRadius: 3, bgcolor: 'rgba(255,255,255,.13)', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(12px)', transform: 'rotate(-5deg)', animation: 'drift 5s ease-in-out infinite' }}><Stack direction="row" spacing={1} alignItems="center"><Avatar sx={{ bgcolor: '#c9fff2', color: '#087e75', width: 34, height: 34 }}><Star fontSize="small" /></Avatar><Box><Typography variant="caption" sx={{ opacity: .8, display: 'block' }}>Your reputation</Typography><Typography fontWeight={800}>4.8 ★ <Typography component="span" variant="caption" sx={{ opacity: .8 }}>Excellent</Typography></Typography></Box></Stack></Box>
      <Typography variant="overline" sx={{ position: 'relative', zIndex: 1, letterSpacing: 2, color: '#a8eee3', fontWeight: 700 }}>YOUR WORKSPACE · READY TO GROW</Typography>
    </Box>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
      <Box><Typography variant="h4" sx={{ color: navy, fontWeight: 800 }}>Hii!! ProxiTasker</Typography><Typography color="text.secondary" sx={{ mt: 0.5 }}>Here’s what’s happening with your work this week.</Typography></Box>
      <Button component={RouterLink} to="/worker/jobs" variant="contained" endIcon={<ArrowForward />} sx={{ bgcolor: teal, '&:hover': { bgcolor: '#008f85' } }}>Find work</Button>
    </Stack>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><SummaryCard label="This month" value="₹8,450" hint="Across 12 completed shifts" icon={<CurrencyRupee />} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><SummaryCard label="Jobs completed" value="12" hint="You’re building a great record" icon={<Work />} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><SummaryCard label="Average rating" value="4.8 / 5" hint="From 9 employer reviews" icon={<Star />} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><SummaryCard label="Hours this week" value="18 hrs" hint="Across 3 work days" icon={<AccessTime />} /></Grid>
    </Grid>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 7 }}><Card elevation={0} sx={{ border: '1px solid #e4e7ec', borderRadius: 3 }}><CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}><Box><Typography variant="h6" sx={{ color: navy, fontWeight: 700 }}>Your upcoming work</Typography><Typography variant="body2" color="text.secondary">Keep track of your confirmed shifts.</Typography></Box><CalendarMonth sx={{ color: teal }} /></Stack>
        {demoJobs.map((job) => <Box key={job.title} sx={{ py: 2, borderBottom: '1px solid #eef0f4', '&:last-child': { borderBottom: 0, pb: 0 } }}><Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}><Box><Typography fontWeight={700} color={navy}>{job.title}</Typography><Typography variant="body2" sx={{ mt: 0.3 }}>{job.company}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>{job.date}</Typography></Box><Stack alignItems="flex-end" spacing={0.8}><Typography fontWeight={800} color={teal}>{job.pay}</Typography><Chip size="small" label={job.status} sx={{ bgcolor: '#e9fbf8', color: '#008f85', fontWeight: 700 }} /></Stack></Stack></Box>)}
      </CardContent></Card></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><Card elevation={0} sx={{ height: '100%', border: '1px solid #e4e7ec', borderRadius: 3 }}><CardContent sx={{ p: { xs: 2, md: 3 } }}><Typography variant="h6" sx={{ color: navy, fontWeight: 700 }}>Recent activity</Typography><Stack spacing={2.2} sx={{ mt: 2 }}>
        {[['Application accepted', 'Shree General Store · Store Assistant', 'Today, 10:24 AM'], ['Payment received', '₹750 from City Mart', 'Yesterday, 6:15 PM'], ['New review', '“Punctual and helpful throughout the shift.”', 'Sep 22']].map(([title, detail, time]) => <Stack key={title} direction="row" spacing={1.5} alignItems="flex-start"><Avatar sx={{ width: 10, height: 10, mt: 0.8, bgcolor: teal }} /><Box sx={{ flex: 1 }}><Typography variant="body2" fontWeight={700}>{title}</Typography><Typography variant="body2" color="text.secondary">{detail}</Typography></Box><Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{time}</Typography></Stack>)}
      </Stack><Button component={RouterLink} to="/worker/notifications" sx={{ mt: 2, color: teal, px: 0 }}>View notifications <ArrowForward sx={{ ml: 0.7, fontSize: 17 }} /></Button></CardContent></Card></Grid>
    </Grid>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Sample dashboard information for preview. Your real activity will appear here when connected.</Typography>
  </Box>;
}
