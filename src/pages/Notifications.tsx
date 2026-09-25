import { useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Check, CurrencyRupee, Star, Work } from '@mui/icons-material';

type DemoNotification = { id: number; title: string; message: string; time: string; category: string; read: boolean; icon: 'work' | 'payment' | 'rating' };
const initialNotifications: DemoNotification[] = [
  { id: 1, title: 'Your application was accepted', message: 'Shree General Store accepted your application for Store Assistant. Your shift is scheduled for Sep 27, 2:00 PM.', time: 'Today · 10:24 AM', category: 'Application', read: false, icon: 'work' },
  { id: 2, title: 'Payment received', message: '₹750 for your Packing Associate shift at City Mart has been sent to your account.', time: 'Yesterday · 6:15 PM', category: 'Payment', read: false, icon: 'payment' },
  { id: 3, title: 'You received a new review', message: 'Anita from City Mart rated your work 5 stars: “Punctual and careful with every order.”', time: 'Sep 22 · 5:40 PM', category: 'Review', read: true, icon: 'rating' },
  { id: 4, title: 'Application update', message: 'Fresh Food Corner has moved your Counter Assistant application to review.', time: 'Sep 21 · 11:10 AM', category: 'Application', read: true, icon: 'work' },
  { id: 5, title: 'Shift reminder', message: 'Your Packing Associate shift at City Mart starts tomorrow at 9:00 AM. Remember to arrive a few minutes early.', time: 'Sep 21 · 9:00 AM', category: 'Reminder', read: true, icon: 'work' },
];

export default function Notifications() {
  const [items, setItems] = useState(initialNotifications);
  const [tab, setTab] = useState(0);
  const unread = items.filter((item) => !item.read).length;
  const visible = tab === 1 ? items.filter((item) => !item.read) : items;
  const markAllRead = () => setItems((current) => current.map((item) => ({ ...item, read: true })));
  const markRead = (id: number) => setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  const iconFor = (icon: DemoNotification['icon']) => icon === 'payment' ? <CurrencyRupee /> : icon === 'rating' ? <Star /> : <Work />;
  return <Box sx={{ minHeight: '100%', bgcolor: '#f7f9fc', p: { xs: 2, md: 4 } }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}><Box><Typography variant="h4" sx={{ color: '#12395f', fontWeight: 800 }}>Notifications</Typography><Typography color="text.secondary" sx={{ mt: 0.5, mb: { xs: 1, sm: 0 } }}>Updates about your applications, shifts, and payments.</Typography></Box><Button onClick={markAllRead} disabled={unread === 0} startIcon={<Check />} sx={{ color: '#008f85' }}>Mark all as read</Button></Stack>
    <Card elevation={0} sx={{ mt: 3, border: '1px solid #e4e7ec', borderRadius: 3 }}><Tabs value={tab} onChange={(_, value: number) => setTab(value)} sx={{ px: 2, borderBottom: '1px solid #eef0f4', '& .Mui-selected': { color: '#008f85' }, '& .MuiTabs-indicator': { bgcolor: '#00a99d' } }}><Tab label={`All (${items.length})`} /><Tab label={`Unread (${unread})`} /></Tabs><CardContent sx={{ p: 0 }}>
      {visible.map((item) => <Box key={item.id} onClick={() => markRead(item.id)} sx={{ display: 'flex', gap: 1.5, p: { xs: 2, md: 2.5 }, borderBottom: '1px solid #eef0f4', bgcolor: item.read ? '#fff' : '#f1fbfa', cursor: item.read ? 'default' : 'pointer', '&:last-child': { borderBottom: 0 } }}><Avatar sx={{ width: 42, height: 42, bgcolor: item.icon === 'payment' ? '#fff4e5' : item.icon === 'rating' ? '#fff8e7' : '#e9fbf8', color: item.icon === 'payment' ? '#9a5b00' : item.icon === 'rating' ? '#b7791f' : '#008f85' }}>{iconFor(item.icon)}</Avatar><Box sx={{ flex: 1, minWidth: 0 }}><Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}><Typography fontWeight={item.read ? 600 : 800} color="#12395f">{item.title}</Typography>{!item.read && <Box sx={{ width: 9, height: 9, flex: '0 0 auto', mt: 0.8, borderRadius: '50%', bgcolor: '#00a99d' }} />}</Stack><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{item.message}</Typography><Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}><Chip size="small" label={item.category} sx={{ height: 22, bgcolor: '#f2f4f7', color: '#475467', fontWeight: 600 }} /><Typography variant="caption" color="text.secondary">{item.time}</Typography></Stack></Box></Box>)}
      {visible.length === 0 && <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>You’re all caught up.</Typography>}
    </CardContent></Card><Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Sample notifications for preview. Marking these as read only changes this preview.</Typography>
  </Box>;
}
