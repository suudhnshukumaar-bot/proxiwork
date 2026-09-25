import { useState } from 'react';
import { Box, Card, CardContent, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import { AccessTime, LocationOn } from '@mui/icons-material';

const applications = [
  { role: 'Retail Store Assistant', company: 'Shree General Store', place: 'College Road, Nashik', shift: '4 hours · Oct 1, 2:00 PM', pay: '₹500 / shift', status: 'Accepted', tone: 'success' },
  { role: 'Packing Associate', company: 'City Mart', place: 'Canada Corner, Nashik', shift: '8 hours · Oct 3, 9:00 AM', pay: '₹750 / shift', status: 'Under review', tone: 'warning' },
  { role: 'Weekend Event Helper', company: 'Cedar Events', place: 'Gangapur Road, Nashik', shift: 'Whole day · Oct 5, 8:00 AM', pay: '₹900 / day', status: 'Under review', tone: 'warning' },
  { role: 'Counter Assistant', company: 'Fresh Food Corner', place: 'Indira Nagar, Nashik', shift: '4 hours · Sep 25, 4:00 PM', pay: '₹450 / shift', status: 'Not selected', tone: 'default' },
];
const toneSx = { success: { bgcolor: '#e9fbf8', color: '#008f85' }, warning: { bgcolor: '#fff4e5', color: '#9a5b00' }, default: { bgcolor: '#f2f4f7', color: '#667085' } };

export default function MyApplications() {
  const [tab, setTab] = useState(0);
  const visible = tab === 1 ? applications.filter((item) => item.status === 'Under review') : tab === 2 ? applications.filter((item) => item.status !== 'Under review') : applications;
  return <Box sx={{ minHeight: '100%', bgcolor: '#f7f9fc', p: { xs: 2, md: 4 } }}>
    <Typography variant="h4" sx={{ color: '#12395f', fontWeight: 800 }}>My Applications</Typography><Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Follow the status of jobs you’ve applied for.</Typography>
    <Tabs value={tab} onChange={(_, value: number) => setTab(value)} sx={{ mb: 2, '& .Mui-selected': { color: '#008f85' }, '& .MuiTabs-indicator': { bgcolor: '#00a99d' } }}><Tab label={`All (${applications.length})`} /><Tab label="In review (2)" /><Tab label="Updates (2)" /></Tabs>
    <Stack spacing={2}>{visible.map((item) => <Card key={item.role} elevation={0} sx={{ border: '1px solid #e4e7ec', borderRadius: 3 }}><CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}><Box><Typography variant="h6" fontWeight={700} color="#12395f">{item.role}</Typography><Typography fontWeight={600} sx={{ mt: 0.4 }}>{item.company}</Typography><Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt: 1.5 }}><Typography variant="body2" color="text.secondary"><LocationOn sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.4 }} />{item.place}</Typography><Typography variant="body2" color="text.secondary"><AccessTime sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.4 }} />{item.shift}</Typography></Stack></Box><Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1}><Typography fontWeight={800} color="#008f85">{item.pay}</Typography><Chip size="small" label={item.status} sx={{ ...toneSx[item.tone as keyof typeof toneSx], fontWeight: 700 }} /></Stack></Stack>
    </CardContent></Card>)}</Stack>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>These sample applications are for preview only.</Typography>
  </Box>;
}
