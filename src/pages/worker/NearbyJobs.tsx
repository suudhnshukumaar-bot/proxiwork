import { useMemo, useState } from 'react';
import {
  AccessTime, ArrowForward, BusinessCenterOutlined, CalendarMonth,
  CheckCircleOutline, Close, LocationOnOutlined, Search, StorefrontOutlined,
  WorkOutline,
} from '@mui/icons-material';
import {
  Box, Button, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle,
  IconButton, InputAdornment, Stack, TextField, Typography,
} from '@mui/material';
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

type Merchant = {
  name: string;
  location: string;
  distance: string;
  position: [number, number];
};

const jobs: Job[] = [
  { id: 1, title: 'Store Helper', employer: 'Shree General Store', category: 'Retail', duration: '4_hours', pay: 450, payUnit: 'shift', location: 'College Road, Nashik', distance: '0.8 km away', date: 'Today · 2:00 PM – 6:00 PM', posted: 'Posted 2 hours ago' },
  { id: 2, title: 'Packing Assistant', employer: 'City Mart', category: 'Packing', duration: '8_hours', pay: 750, payUnit: 'day', location: 'Canada Corner, Nashik', distance: '1.4 km away', date: 'Tomorrow · 9:00 AM – 5:00 PM', posted: 'Posted 4 hours ago' },
  { id: 3, title: 'Counter Helper', employer: 'Fresh Food Corner', category: 'Food service', duration: '4_hours', pay: 400, payUnit: 'shift', location: 'Indira Nagar, Nashik', distance: '2.1 km away', date: 'Today · 5:00 PM – 9:00 PM', posted: 'Posted yesterday' },
  { id: 4, title: 'Event Setup Crew', employer: 'Cedar Events', category: 'Events', duration: 'whole_day', pay: 900, payUnit: 'day', location: 'Gangapur Road, Nashik', distance: '2.8 km away', date: 'Saturday · 8:00 AM – 6:00 PM', posted: 'Posted yesterday' },
  { id: 5, title: 'Inventory Assistant', employer: 'Nashik Home & Living', category: 'Retail', duration: '8_hours', pay: 800, payUnit: 'day', location: 'Panchavati, Nashik', distance: '3.2 km away', date: 'Oct 1 · 10:00 AM – 6:00 PM', posted: 'Posted 2 days ago' },
  { id: 6, title: 'Grocery Order Packer', employer: 'Daily Basket', category: 'Packing', duration: '4_hours', pay: 425, payUnit: 'shift', location: 'Mumbai Naka, Nashik', distance: '3.7 km away', date: 'Oct 1 · 3:00 PM – 7:00 PM', posted: 'Posted 2 days ago' },
];

const merchants: Merchant[] = [
  { name: 'Shree General Store', location: 'College Road, Nashik', distance: '0.8 km', position: [19.9975, 73.7898] },
  { name: 'City Mart', location: 'Canada Corner, Nashik', distance: '1.4 km', position: [20.0059, 73.7638] },
  { name: 'Fresh Food Corner', location: 'Indira Nagar, Nashik', distance: '2.1 km', position: [19.9882, 73.7646] },
  { name: 'Cedar Events', location: 'Gangapur Road, Nashik', distance: '2.8 km', position: [20.0128, 73.7741] },
  { name: 'Nashik Home & Living', location: 'Panchavati, Nashik', distance: '3.2 km', position: [20.0031, 73.7974] },
  { name: 'Daily Basket', location: 'Mumbai Naka, Nashik', distance: '3.7 km', position: [19.9828, 73.7812] },
  { name: 'Nashik Book Depot', location: 'College Road, Nashik', distance: '0.6 km', position: [19.9991, 73.7827] },
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
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [appliedSearch, setAppliedSearch] = useState({ keyword: '', place: 'Nashik', duration: '' as WorkDuration | '' });

  const openings = useMemo(() => {
    const query = appliedSearch.keyword.trim().toLowerCase();
    const locationQuery = appliedSearch.place.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesKeyword = !query || `${job.title} ${job.employer} ${job.category}`.toLowerCase().includes(query);
      const matchesLocation = !locationQuery || job.location.toLowerCase().includes(locationQuery);
      const matchesDuration = !appliedSearch.duration || job.duration === appliedSearch.duration;
      return matchesKeyword && matchesLocation && matchesDuration;
    });
  }, [appliedSearch]);

  const nearbyMerchants = useMemo(() => {
    const locationQuery = appliedSearch.place.trim().toLowerCase();
    return merchants.filter((merchant) => !locationQuery || merchant.location.toLowerCase().includes(locationQuery));
  }, [appliedSearch.place]);

  const merchantOpenings = (merchant: Merchant) => openings.filter((job) => job.employer === merchant.name);

  const searchForWork = () => {
    setAppliedSearch({ keyword, place, duration });
    setScanComplete(false);
    setScanning(true);
    window.setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
    }, 1600);
  };

  return <Box sx={{ minHeight: '100%', bgcolor: '#EAF5FE', p: { xs: 2, md: 4 } }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 3 }}>
      <Box><Typography variant="h4" sx={{ color: '#12395f', fontWeight: 800 }}>Find Work</Typography><Typography color="text.secondary" sx={{ mt: 0.5 }}>Good work is closer than you think. Find a shift that fits your day.</Typography></Box>
      <Chip icon={<BusinessCenterOutlined />} label={`${jobs.length} sample jobs`} sx={{ bgcolor: '#e9fbf8', color: '#087e75', fontWeight: 700 }} />
    </Stack>

    <Card elevation={0} sx={{ mb: 3, border: '1px solid #e1e8ef', borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ height: 7, background: 'linear-gradient(90deg, #3B80B4 0%, #0AAE9E 100%)' }} />
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ color: '#12395f', fontWeight: 700 }}>Search for work</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4, mb: 2.5 }}>Scan nearby registered shops for work that fits your day.</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField fullWidth label="Job title or category" placeholder="Try ‘shop helper’ or ‘packing’" value={keyword} onChange={(event) => setKeyword(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') searchForWork(); }} InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
          <TextField fullWidth label="Location" placeholder="City or neighborhood" value={place} onChange={(event) => setPlace(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') searchForWork(); }} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlined fontSize="small" /></InputAdornment> }} />
        </Stack>
        <Typography variant="subtitle2" sx={{ color: '#344054', mt: 2.5, mb: 1 }}>How long are you available?</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          {durationOptions.map((option) => {
            const active = duration === option.value;
            return <Card key={option.value} component="button" type="button" onClick={() => setDuration(active ? '' : option.value)} aria-pressed={active} sx={{ flex: 1, p: 1.5, textAlign: 'left', cursor: 'pointer', borderRadius: 2.5, border: active ? '2px solid #0AAE9E' : '1px solid #d4e6f4', bgcolor: active ? '#e9f9f6' : '#F5FAFF', transition: 'all 160ms ease', '&:hover': { borderColor: '#0AAE9E', bgcolor: '#eff9ff' } }}>
              <Stack direction="row" spacing={1.2} alignItems="center"><AccessTime sx={{ color: active ? '#00a99d' : '#0F3460' }} /><Box><Typography fontWeight={700} color="#12395f">{option.label}</Typography><Typography variant="caption" color="text.secondary">{option.helper}</Typography></Box></Stack>
            </Card>;
          })}
        </Stack>
        <Button fullWidth variant="contained" startIcon={<Search />} endIcon={<ArrowForward />} onClick={searchForWork} sx={{ mt: 2.5, py: 1.35, bgcolor: '#00B4A6', fontWeight: 700, '&:hover': { bgcolor: '#008f85' } }}>Search for work</Button>
      </CardContent>
    </Card>

    {scanComplete && <>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
        <Box><Typography variant="h6" fontWeight={700} color="#12395f">Nearby shops</Typography><Typography variant="body2" color="text.secondary">{nearbyMerchants.length} registered {nearbyMerchants.length === 1 ? 'shop' : 'shops'} around {appliedSearch.place || 'you'}</Typography></Box>
        {appliedSearch.duration && <Chip label={durationLabel[appliedSearch.duration]} onDelete={() => { setDuration(''); setAppliedSearch((current) => ({ ...current, duration: '' })); }} sx={{ bgcolor: '#eef7fb', color: '#12395f' }} />}
      </Stack>
      <Box sx={{ position: 'relative', height: { xs: 310, md: 410 }, mb: 2, overflow: 'hidden', border: '1px solid #d9e1ea', borderRadius: 2 }}>
        <MapContainer center={[19.9975, 73.7898]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>, Vantor, Earthstar Geographics, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <TileLayer
            attribution='Road data &copy; Esri, HERE, Garmin, and OpenStreetMap contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
          />
          <TileLayer
            attribution='Place names &copy; Esri, HERE, Garmin, OpenStreetMap contributors, and the GIS user community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          />
          {!scanning && nearbyMerchants.map((merchant) => {
            const available = merchantOpenings(merchant).length > 0;
            return <CircleMarker key={merchant.name} center={merchant.position} radius={9} pathOptions={{ color: '#fff', weight: 3, fillColor: available ? '#00a99d' : '#667085', fillOpacity: 1 }} eventHandlers={{ click: () => setSelectedMerchant(merchant) }}>
              <Tooltip>{merchant.name}</Tooltip>
            </CircleMarker>;
          })}
        </MapContainer>
        {scanning && <Box sx={{ position: 'absolute', inset: 0, zIndex: 500, display: 'grid', placeItems: 'center', bgcolor: 'rgba(10, 24, 34, 0.42)', overflow: 'hidden' }}>
          <Box sx={{ position: 'relative', width: 210, height: 210, display: 'grid', placeItems: 'center' }}>
            {[0, 1, 2, 3].map((ring) => <Box key={ring} sx={{ position: 'absolute', inset: `${ring * 18}px`, border: '2px solid rgba(255,255,255,0.9)', borderRadius: '50%', animation: `scanPulse 1.6s ease-out ${ring * 0.16}s infinite`, '@keyframes scanPulse': { '0%': { transform: 'scale(0.55)', opacity: 0.95 }, '100%': { transform: 'scale(1.65)', opacity: 0 } } }} />)}
            <Box sx={{ position: 'relative', zIndex: 1, width: 54, height: 54, display: 'grid', placeItems: 'center', borderRadius: '50%', color: '#fff', bgcolor: '#00a99d', boxShadow: '0 0 0 8px rgba(0,169,157,0.2)' }}><LocationOnOutlined /></Box>
          </Box>
          <Typography sx={{ position: 'absolute', bottom: 22, color: '#fff', fontWeight: 700 }}>Scanning nearby shops…</Typography>
        </Box>}
      </Box>
      {nearbyMerchants.length > 0 ? <Stack spacing={1}>{nearbyMerchants.map((merchant) => {
        const available = merchantOpenings(merchant).length;
        return <Card key={merchant.name} component="button" type="button" onClick={() => setSelectedMerchant(merchant)} elevation={0} sx={{ width: '100%', p: 0, textAlign: 'left', cursor: 'pointer', border: '1px solid #e4e7ec', borderRadius: 2, '&:hover': { borderColor: '#00a99d', bgcolor: '#f8fdfc' } }}>
          <CardContent sx={{ p: { xs: 1.7, md: 2 }, '&:last-child': { pb: { xs: 1.7, md: 2 } } }}><Stack direction="row" alignItems="center" spacing={1.5}><StorefrontOutlined sx={{ color: '#087e75' }} /><Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={700} color="#12395f">{merchant.name}</Typography><Typography variant="body2" color="text.secondary">{merchant.location} · {merchant.distance}</Typography></Box><Chip size="small" icon={available ? <CheckCircleOutline /> : undefined} label={available ? `${available} ${available === 1 ? 'job' : 'jobs'} available` : 'No work now'} sx={{ color: available ? '#087e75' : '#667085', bgcolor: available ? '#e9fbf8' : '#f2f4f7', '& .MuiChip-icon': { color: '#087e75' } }} /></Stack></CardContent>
        </Card>;
      })}</Stack> : <Card elevation={0} sx={{ p: 3, textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: 2 }}><Search sx={{ color: '#98a2b3', fontSize: 32, mb: 1 }} /><Typography fontWeight={700} color="#12395f">No shops found nearby</Typography><Typography variant="body2" color="text.secondary">Try another city or neighborhood.</Typography></Card>}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>Demo merchant locations and job availability. Satellite imagery and reference layers are provided by Esri.</Typography>
    </>}

    <Dialog open={Boolean(selectedMerchant)} onClose={() => setSelectedMerchant(null)} fullWidth maxWidth="sm">
      {selectedMerchant && <>
        <DialogTitle sx={{ pr: 6 }}><Typography variant="h6" fontWeight={800} color="#12395f">{selectedMerchant.name}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}><LocationOnOutlined sx={{ fontSize: 17, verticalAlign: 'text-bottom', mr: 0.4 }} />{selectedMerchant.location} · {selectedMerchant.distance}</Typography><IconButton aria-label="Close shop details" onClick={() => setSelectedMerchant(null)} sx={{ position: 'absolute', right: 10, top: 10 }}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
          {merchantOpenings(selectedMerchant).length > 0 ? <Stack spacing={1.5}>{merchantOpenings(selectedMerchant).map((job) => <Box key={job.id} sx={{ p: 1.7, border: '1px solid #e4e7ec', borderRadius: 2 }}><Stack direction="row" justifyContent="space-between" spacing={2}><Box><Typography fontWeight={700} color="#12395f">{job.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}><CalendarMonth sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.4 }} />{job.date}</Typography><Chip size="small" icon={<WorkOutline />} label={`${durationLabel[job.duration]} · ${job.category}`} sx={{ mt: 1, bgcolor: '#eef4fa', color: '#12395f' }} /></Box><Typography fontWeight={800} color="#087e75" sx={{ whiteSpace: 'nowrap' }}>₹{job.pay} / {job.payUnit}</Typography></Stack></Box>)}</Stack> : <Box sx={{ py: 2, textAlign: 'center' }}><StorefrontOutlined sx={{ fontSize: 34, color: '#98a2b3', mb: 1 }} /><Typography fontWeight={700} color="#12395f">No work available right now</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>This shop is registered. Check back later for new openings.</Typography></Box>}
        </DialogContent>
      </>}
    </Dialog>
  </Box>;
}
