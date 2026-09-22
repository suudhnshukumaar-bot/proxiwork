import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import {
  WorkOutline,
  StorefrontOutlined,
  LocationOnOutlined,
  AccessTimeOutlined,
  AttachMoneyOutlined,
  VerifiedUserOutlined,
  StarOutlined,
  CheckCircleOutlined,
  PeopleOutlined,
  BusinessCenterOutlined,
  DeliveryDiningOutlined,
  HeadsetMicOutlined,
  InventoryOutlined,
  KeyboardOutlined,
  PointOfSaleOutlined,
  LocalShippingOutlined,
  EventOutlined,
  SupportAgentOutlined,
  MenuOutlined,
  CloseOutlined,
  ArrowForwardOutlined,
  ThumbUpOutlined,
  SecurityOutlined,
  SpeedOutlined,
} from '@mui/icons-material';

const PRIMARY = '#0F3460';
const SECONDARY = '#00B4A6';
const PRIMARY_DARK = '#0a2444';
const PRIMARY_LIGHT = '#1a4a8a';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Categories', href: '#categories' },
  { label: 'For Workers', href: '#for-workers' },
  { label: 'For Employers', href: '#for-employers' },
];

const STATS = [
  { value: '500+', label: 'Jobs Posted' },
  { value: '1,000+', label: 'Workers' },
  { value: '50+', label: 'Cities' },
];

const WORKER_STEPS = [
  { icon: <WorkOutline fontSize="large" />, title: 'Create Profile', desc: 'Sign up and build your profile with your skills, experience, and availability.' },
  { icon: <AccessTimeOutlined fontSize="large" />, title: 'Set Availability', desc: 'Choose when you want to work — morning, evening, weekends, whatever fits your life.' },
  { icon: <LocationOnOutlined fontSize="large" />, title: 'Find Nearby Jobs', desc: 'Browse flexible jobs from local businesses right in your neighbourhood.' },
  { icon: <AttachMoneyOutlined fontSize="large" />, title: 'Apply & Earn', desc: 'Apply in one tap, get hired fast, and get paid promptly for your work.' },
];

const EMPLOYER_STEPS = [
  { icon: <BusinessCenterOutlined fontSize="large" />, title: 'Post a Job', desc: 'Describe the role, set your requirements, hours, and pay rate in minutes.' },
  { icon: <PeopleOutlined fontSize="large" />, title: 'Receive Applications', desc: 'Qualified local workers apply directly to your listing.' },
  { icon: <CheckCircleOutlined fontSize="large" />, title: 'Select Workers', desc: 'Review profiles, ratings, and experience, then choose the best fit.' },
  { icon: <StorefrontOutlined fontSize="large" />, title: 'Get Help', desc: 'Your worker shows up ready. Focus on running your business.' },
];

const CATEGORIES = [
  { label: 'Shop Helper', icon: <StorefrontOutlined />, color: '#4CAF50' },
  { label: 'Event Helper', icon: <EventOutlined />, color: '#9C27B0' },
  { label: 'Data Entry', icon: <KeyboardOutlined />, color: '#2196F3' },
  { label: 'Delivery', icon: <DeliveryDiningOutlined />, color: '#FF9800' },
  { label: 'Packing', icon: <InventoryOutlined />, color: '#795548' },
  { label: 'Receptionist', icon: <HeadsetMicOutlined />, color: '#E91E63' },
  { label: 'Customer Support', icon: <SupportAgentOutlined />, color: '#00BCD4' },
  { label: 'Sales', icon: <PointOfSaleOutlined />, color: '#FF5722' },
  { label: 'Inventory', icon: <LocalShippingOutlined />, color: '#607D8B' },
  { label: 'Other', icon: <WorkOutline />, color: '#9E9E9E' },
];

const WORKER_BENEFITS = [
  { icon: <AccessTimeOutlined />, title: 'Flexible Hours', desc: 'Work when you want. Pick shifts that suit your schedule.' },
  { icon: <LocationOnOutlined />, title: 'Local Opportunities', desc: 'Jobs near you — no long commutes, more time for life.' },
  { icon: <AttachMoneyOutlined />, title: 'Fast Payments', desc: 'Get paid quickly after your shift ends.' },
  { icon: <StarOutlined />, title: 'Build Your Reputation', desc: 'Grow your rating and unlock higher-paying gigs.' },
];

const EMPLOYER_BENEFITS = [
  { icon: <SpeedOutlined />, title: 'Hire in Hours', desc: 'Post a job and have applicants the same day.' },
  { icon: <VerifiedUserOutlined />, title: 'Verified Workers', desc: 'All workers are ID-verified and reviewed by the community.' },
  { icon: <ThumbUpOutlined />, title: 'Quality Guaranteed', desc: 'Ratings and reviews ensure you get the best candidates.' },
  { icon: <SecurityOutlined />, title: 'Secure & Compliant', desc: 'Built-in agreements and dispute support so you're protected.' },
];

const TESTIMONIALS = [
  { name: 'Maria S.', role: 'Worker', text: 'ProxiWork helped me pick up extra shifts near my home. I love how easy it is to apply and get paid.', rating: 5, avatar: 'M' },
  { name: 'David R.', role: 'Employer', text: 'I needed an extra hand for our weekend sale. Found a great worker within 2 hours of posting. Incredible.', rating: 5, avatar: 'D' },
  { name: 'Priya K.', role: 'Worker', text: 'As a student I need flexible work. ProxiWork is perfect — I choose my own hours around my classes.', rating: 5, avatar: 'P' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
      {/* ── NAVBAR ── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(15,52,96,0.08)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: PRIMARY, letterSpacing: '-0.5px', cursor: 'pointer' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Proxi
              <Box component="span" sx={{ color: SECONDARY }}>
                Work
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: SECONDARY,
                  ml: '2px',
                  verticalAlign: 'super',
                }}
              />
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  sx={{ color: PRIMARY, fontWeight: 500, textTransform: 'none', fontSize: '0.95rem' }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: PRIMARY,
                  color: PRIMARY,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: SECONDARY,
                  '&:hover': { bgcolor: '#009e91' },
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                  boxShadow: 'none',
                }}
              >
                Get Started
              </Button>
            </Box>
          ) : (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: PRIMARY }}>
              <MenuOutlined />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* ── MOBILE DRAWER ── */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 270, pt: 2, px: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: PRIMARY }}>
              Proxi<Box component="span" sx={{ color: SECONDARY }}>Work</Box>
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><CloseOutlined /></IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            {NAV_LINKS.map((link) => (
              <ListItem key={link.label} disablePadding>
                <Button
                  fullWidth
                  onClick={() => scrollTo(link.href)}
                  sx={{ justifyContent: 'flex-start', color: PRIMARY, textTransform: 'none', fontWeight: 500, py: 1 }}
                >
                  {link.label}
                </Button>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => { navigate('/login'); setDrawerOpen(false); }}
              sx={{ borderColor: PRIMARY, color: PRIMARY, fontWeight: 600, textTransform: 'none', borderRadius: 2 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => { navigate('/signup'); setDrawerOpen(false); }}
              sx={{ bgcolor: SECONDARY, '&:hover': { bgcolor: '#009e91' }, fontWeight: 600, textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* ── HERO ── */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 50%, ${PRIMARY_LIGHT} 100%)`,
          pt: { xs: 8, md: 14 },
          pb: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative blobs */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(0,180,166,0.12)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -120, left: -60, width: 350, height: 350, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Chip
              label="🚀 Now live in 50+ cities"
              sx={{ bgcolor: 'rgba(0,180,166,0.2)', color: '#7de8e1', fontWeight: 600, mb: 3, fontSize: '0.85rem' }}
            />
            <Typography
              variant="h1"
              fontWeight={900}
              sx={{
                color: '#fff',
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4.2rem' },
                lineHeight: 1.1,
                letterSpacing: '-1.5px',
                mb: 3,
              }}
            >
              Find Flexible Work{' '}
              <Box component="span" sx={{ color: SECONDARY }}>Near You</Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.78)',
                fontWeight: 400,
                maxWidth: 620,
                mx: 'auto',
                mb: 5,
                fontSize: { xs: '1.05rem', md: '1.25rem' },
                lineHeight: 1.6,
              }}
            >
              Connect with nearby businesses that need temporary help. Work on your schedule, earn on your terms.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', mb: 8 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup/worker')}
                endIcon={<ArrowForwardOutlined />}
                sx={{
                  bgcolor: SECONDARY,
                  '&:hover': { bgcolor: '#009e91' },
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  borderRadius: 3,
                  px: 4,
                  py: 1.6,
                  boxShadow: `0 8px 24px rgba(0,180,166,0.35)`,
                }}
              >
                Find Work
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/signup/employer')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.6)',
                  color: '#fff',
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  borderRadius: 3,
                  px: 4,
                  py: 1.6,
                }}
              >
                Post a Job
              </Button>
            </Box>

            {/* Stats */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                gap: { xs: 3, sm: 6 },
              }}
            >
              {STATS.map((stat) => (
                <Box key={stat.label} sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight={800} sx={{ color: SECONDARY, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{stat.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── HOW IT WORKS – WORKERS ── */}
      <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="For Workers" sx={{ bgcolor: `${SECONDARY}1a`, color: SECONDARY, fontWeight: 700, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} sx={{ color: PRIMARY, fontSize: { xs: '1.9rem', md: '2.5rem' }, mb: 1.5 }}>
              Start Earning in 4 Steps
            </Typography>
            <Typography sx={{ color: '#64748b', maxWidth: 520, mx: 'auto', fontSize: '1.05rem' }}>
              From sign-up to your first paycheck — it's simple, fast, and local.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {WORKER_STEPS.map((step, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid rgba(15,52,96,0.08)',
                    borderRadius: 3,
                    p: 1,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 8px 32px rgba(15,52,96,0.1)' },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        bgcolor: `${SECONDARY}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: SECONDARY,
                        position: 'relative',
                      }}
                    >
                      {step.icon}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: PRIMARY,
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {i + 1}
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: PRIMARY, mb: 1 }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {step.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup/worker')}
              sx={{ bgcolor: SECONDARY, '&:hover': { bgcolor: '#009e91' }, fontWeight: 700, textTransform: 'none', borderRadius: 3, px: 4, py: 1.4, boxShadow: 'none' }}
            >
              Sign Up as a Worker
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── HOW IT WORKS – EMPLOYERS ── */}
      <Box id="for-employers" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip label="For Employers" sx={{ bgcolor: `${PRIMARY}14`, color: PRIMARY, fontWeight: 700, mb: 2 }} />
            <Typography variant="h3" fontWeight={800} sx={{ color: PRIMARY, fontSize: { xs: '1.9rem', md: '2.5rem' }, mb: 1.5 }}>
              Hire Local Help Quickly
            </Typography>
            <Typography sx={{ color: '#64748b', maxWidth: 520, mx: 'auto', fontSize: '1.05rem' }}>
              Get the flexible workforce you need, right when you need it.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {EMPLOYER_STEPS.map((step, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid rgba(15,52,96,0.08)',
                    borderRadius: 3,
                    p: 1,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 8px 32px rgba(15,52,96,0.1)' },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        bgcolor: `${PRIMARY}12`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: PRIMARY,
                        position: 'relative',
                      }}
                    >
                      {step.icon}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          bgcolor: SECONDARY,
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {i + 1}
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: PRIMARY, mb: 1 }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {step.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup/employer')}
              sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: PRIMARY_DARK }, fontWeight: 700, textTransform: 'none', borderRadius: 3, px: 4, py: 1.4, boxShadow: 'none' }}
            >
              Post Your First Job
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── JOB CATEGORIES ── */}
      <Box id="categories" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: PRIMARY, fontSize: { xs: '1.9rem', md: '2.5rem' }, mb: 1.5 }}>
              Browse Job Categories
            </Typography>
            <Typography sx={{ color: '#64748b', maxWidth: 500, mx: 'auto', fontSize: '1.05rem' }}>
              From retail to events — find flexible work across a range of roles near you.
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {CATEGORIES.map((cat) => (
              <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={cat.label}>
                <Card
                  elevation={0}
                  onClick={() => navigate('/signup/worker')}
                  sx={{
                    border: '1px solid rgba(15,52,96,0.07)',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: cat.color,
                      boxShadow: `0 6px 24px ${cat.color}28`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3, px: 2 }}>
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 2.5,
                        bgcolor: `${cat.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 1.5,
                        color: cat.color,
                      }}
                    >
                      {cat.icon}
                    </Box>
                    <Typography fontWeight={600} sx={{ color: PRIMARY, fontSize: '0.88rem' }}>
                      {cat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── BENEFITS ── */}
      <Box id="for-workers" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" fontWeight={800} sx={{ color: PRIMARY, fontSize: { xs: '1.9rem', md: '2.5rem' }, mb: 1.5 }}>
              Why Choose ProxiWork?
            </Typography>
          </Box>
          <Grid container spacing={6}>
            {/* Workers */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  bgcolor: `${SECONDARY}0e`,
                  borderRadius: 4,
                  p: { xs: 3, md: 5 },
                  border: `1px solid ${SECONDARY}28`,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: SECONDARY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <WorkOutline />
                  </Box>
                  <Typography variant="h5" fontWeight={800} sx={{ color: PRIMARY }}>
                    For Workers
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {WORKER_BENEFITS.map((b) => (
                    <Box key={b.title} sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${SECONDARY}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: SECONDARY, flexShrink: 0 }}>
                        {b.icon}
                      </Box>
                      <Box>
                        <Typography fontWeight={700} sx={{ color: PRIMARY, mb: 0.4 }}>{b.title}</Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{b.desc}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            {/* Employers */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  bgcolor: `${PRIMARY}06`,
                  borderRadius: 4,
                  p: { xs: 3, md: 5 },
                  border: `1px solid ${PRIMARY}14`,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <StorefrontOutlined />
                  </Box>
                  <Typography variant="h5" fontWeight={800} sx={{ color: PRIMARY }}>
                    For Employers
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {EMPLOYER_BENEFITS.map((b) => (
                    <Box key={b.title} sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${PRIMARY}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PRIMARY, flexShrink: 0 }}>
                        {b.icon}
                      </Box>
                      <Box>
                        <Typography fontWeight={700} sx={{ color: PRIMARY, mb: 0.4 }}>{b.title}</Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{b.desc}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── TRUST & SAFETY / TESTIMONIALS ── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: '#f8fafc',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Chip
              icon={<VerifiedUserOutlined style={{ fontSize: 16 }} />}
              label="Trusted by Thousands"
              sx={{ bgcolor: `${SECONDARY}1a`, color: SECONDARY, fontWeight: 700, mb: 2 }}
            />
            <Typography variant="h3" fontWeight={800} sx={{ color: PRIMARY, fontSize: { xs: '1.9rem', md: '2.5rem' }, mb: 1.5 }}>
              Real People. Real Results.
            </Typography>
            <Typography sx={{ color: '#64748b', maxWidth: 500, mx: 'auto', fontSize: '1.05rem' }}>
              Workers and employers across the country trust ProxiWork every day.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid size={{ xs: 12, md: 4 }} key={t.name}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid rgba(15,52,96,0.08)',
                    borderRadius: 3,
                    p: 1,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <StarOutlined key={i} sx={{ color: '#f59e0b', fontSize: 18 }} />
                      ))}
                    </Box>
                    <Typography sx={{ color: '#334155', lineHeight: 1.7, mb: 3, fontSize: '0.95rem', fontStyle: 'italic' }}>
                      "{t.text}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: PRIMARY, width: 40, height: 40, fontWeight: 700 }}>{t.avatar}</Avatar>
                      <Box>
                        <Typography fontWeight={700} sx={{ color: PRIMARY, fontSize: '0.9rem' }}>{t.name}</Typography>
                        <Typography sx={{ color: SECONDARY, fontSize: '0.8rem', fontWeight: 600 }}>{t.role}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Safety badges */}
          <Box sx={{ mt: 7, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {[
              { icon: <VerifiedUserOutlined />, label: 'ID Verified Workers' },
              { icon: <SecurityOutlined />, label: 'Secure Payments' },
              { icon: <ThumbUpOutlined />, label: 'Community Ratings' },
              { icon: <SupportAgentOutlined />, label: '24/7 Support' },
            ].map((badge) => (
              <Chip
                key={badge.label}
                icon={React.cloneElement(badge.icon as React.ReactElement<any>, { style: { fontSize: 16, color: SECONDARY } })}
                label={badge.label}
                variant="outlined"
                sx={{ borderColor: `${SECONDARY}40`, color: PRIMARY, fontWeight: 600, py: 2.5, px: 1 }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── FINAL CTA ── */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(0,180,166,0.12)', pointerEvents: 'none' }} />
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h2"
              fontWeight={900}
              sx={{ color: '#fff', fontSize: { xs: '2rem', md: '3rem' }, mb: 2, letterSpacing: '-1px' }}
            >
              Ready to Get Started?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', mb: 5, maxWidth: 480, mx: 'auto' }}>
              Join thousands of workers and employers already using ProxiWork to get things done locally.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup/worker')}
                sx={{ bgcolor: SECONDARY, '&:hover': { bgcolor: '#009e91' }, fontWeight: 700, textTransform: 'none', fontSize: '1rem', borderRadius: 3, px: 4, py: 1.6, boxShadow: `0 8px 24px rgba(0,180,166,0.4)` }}
              >
                Find Work Near Me
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/signup/employer')}
                sx={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }, fontWeight: 700, textTransform: 'none', fontSize: '1rem', borderRadius: 3, px: 4, py: 1.6 }}
              >
                Post a Job Today
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ bgcolor: '#0d1b2a', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#fff', mb: 1.5 }}>
                Proxi<Box component="span" sx={{ color: SECONDARY }}>Work</Box>
                <Box component="span" sx={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', bgcolor: SECONDARY, ml: '2px', verticalAlign: 'super' }} />
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 280 }}>
                The local flexible-work marketplace connecting people with nearby merchants who need temporary help.
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography fontWeight={700} sx={{ color: '#fff', mb: 2 }}>Platform</Typography>
              {['How It Works', 'Categories', 'Pricing', 'FAQ'].map((l) => (
                <Typography key={l} sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', mb: 1, cursor: 'pointer', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}>{l}</Typography>
              ))}
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography fontWeight={700} sx={{ color: '#fff', mb: 2 }}>Workers</Typography>
              {['Find Jobs', 'Sign Up', 'Worker Guide', 'Support'].map((l) => (
                <Typography key={l} sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', mb: 1, cursor: 'pointer', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}>{l}</Typography>
              ))}
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography fontWeight={700} sx={{ color: '#fff', mb: 2 }}>Employers</Typography>
              {['Post a Job', 'Sign Up', 'Employer Guide', 'Contact Sales'].map((l) => (
                <Typography key={l} sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', mb: 1, cursor: 'pointer', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}>{l}</Typography>
              ))}
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography fontWeight={700} sx={{ color: '#fff', mb: 2 }}>Legal</Typography>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
                <Typography key={l} sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', mb: 1, cursor: 'pointer', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}>{l}</Typography>
              ))}
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 4 }} />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} ProxiWork. All rights reserved.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
              Made with ♥ for local communities
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
