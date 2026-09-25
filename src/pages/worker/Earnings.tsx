import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { ArrowDownward, ArrowUpward, CurrencyRupee } from '@mui/icons-material';

const payments = [
  { role: 'Packing Associate', employer: 'City Mart', date: 'Sep 22, 2026', amount: '₹750', status: 'Paid' },
  { role: 'Counter Assistant', employer: 'Fresh Food Corner', date: 'Sep 19, 2026', amount: '₹450', status: 'Paid' },
  { role: 'Store Assistant', employer: 'Shree General Store', date: 'Today, Sep 26', amount: '₹500', status: 'Pending' },
];

function Stat({ title, amount, note }: { title: string; amount: string; note: string }) {
  return <Card elevation={0} sx={{ height: '100%', border: '1px solid #e4e7ec', borderRadius: 3 }}><CardContent><Typography variant="body2" color="text.secondary">{title}</Typography><Typography variant="h5" fontWeight={800} color="#12395f" sx={{ mt: 1 }}>{amount}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>{note}</Typography></CardContent></Card>;
}

export default function Earnings() {
  return <Box sx={{ minHeight: '100%', bgcolor: '#f7f9fc', p: { xs: 2, md: 4 } }}>
    <Typography variant="h4" sx={{ color: '#12395f', fontWeight: 800 }}>Earnings</Typography><Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>A clear view of your work income and recent payments.</Typography>
    <Grid container spacing={2} sx={{ mb: 3 }}><Grid size={{ xs: 12, sm: 6, lg: 4 }}><Stat title="Earned this month" amount="₹8,450" note="12 completed shifts" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 4 }}><Stat title="Payments received" amount="₹7,500" note="Deposited to your account" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 4 }}><Stat title="Pending payment" amount="₹950" note="Expected after shift confirmation" /></Grid></Grid>
    <Card elevation={0} sx={{ border: '1px solid #e4e7ec', borderRadius: 3 }}><CardContent sx={{ p: { xs: 2, md: 3 } }}><Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}><Box><Typography variant="h6" color="#12395f" fontWeight={700}>Recent payments</Typography><Typography variant="body2" color="text.secondary">Your latest shift earnings.</Typography></Box><CurrencyRupee sx={{ color: '#00a99d' }} /></Stack>
      {payments.map((payment) => <Stack key={payment.role} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ py: 2, borderBottom: '1px solid #eef0f4', '&:last-child': { borderBottom: 0, pb: 0 } }}><Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: payment.status === 'Paid' ? '#e9fbf8' : '#fff4e5', color: payment.status === 'Paid' ? '#008f85' : '#9a5b00', display: 'grid', placeItems: 'center' }}>{payment.status === 'Paid' ? <ArrowDownward fontSize="small" /> : <ArrowUpward fontSize="small" />}</Box><Box><Typography fontWeight={700} color="#12395f">{payment.role}</Typography><Typography variant="body2" color="text.secondary">{payment.employer} · {payment.date}</Typography></Box></Stack><Stack direction="row" spacing={1.5} alignItems="center"><Typography fontWeight={800}>{payment.amount}</Typography><Chip size="small" label={payment.status} sx={{ bgcolor: payment.status === 'Paid' ? '#e9fbf8' : '#fff4e5', color: payment.status === 'Paid' ? '#008f85' : '#9a5b00', fontWeight: 700 }} /></Stack></Stack>)}
    </CardContent></Card><Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Sample earnings for preview only; no actual payments are shown here.</Typography>
  </Box>;
}
