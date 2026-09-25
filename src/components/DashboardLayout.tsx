import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Chip, Badge, Tooltip
} from '@mui/material';
import {
  LogoutOutlined, PersonOutline, DashboardOutlined, WorkOutline,
  BusinessCenterOutlined, PeopleOutlined, NotificationsOutlined,
  PaidOutlined, StarOutline, PostAddOutlined, AssignmentIndOutlined,
  CategoryOutlined, FlagOutlined, AdminPanelSettingsOutlined,
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const PRIMARY = '#0F3460';
const SECONDARY = '#00B4A6';

const WORKER_LINKS = [
  { label: 'Dashboard',    icon: <DashboardOutlined />,    path: '/worker/dashboard' },
  { label: 'Find Jobs',    icon: <WorkOutline />,         path: '/worker/jobs' },
  { label: 'Applications', icon: <AssignmentIndOutlined />, path: '/worker/applications' },
  { label: 'My Jobs',      icon: <BusinessCenterOutlined />, path: '/worker/my-jobs' },
  { label: 'Earnings',     icon: <PaidOutlined />,        path: '/worker/earnings' },
  { label: 'Ratings',      icon: <StarOutline />,         path: '/worker/ratings' },
  { label: 'Profile',      icon: <PersonOutline />,       path: '/worker/profile' },
  { label: 'Notifications', icon: <NotificationsOutlined />, path: '/worker/notifications' },
];

const EMPLOYER_LINKS = [
  { label: 'Dashboard',     icon: <DashboardOutlined />,    path: '/employer/dashboard' },
  { label: 'Post Job',      icon: <PostAddOutlined />,      path: '/employer/post-job' },
  { label: 'My Jobs',       icon: <BusinessCenterOutlined />, path: '/employer/jobs' },
  { label: 'Profile',       icon: <PersonOutline />,        path: '/employer/profile' },
  { label: 'Ratings',       icon: <StarOutline />,          path: '/employer/ratings' },
  { label: 'Notifications', icon: <NotificationsOutlined />, path: '/employer/notifications' },
];

const ADMIN_LINKS = [
  { label: 'Dashboard',  icon: <AdminPanelSettingsOutlined />, path: '/admin/dashboard' },
  { label: 'Users',      icon: <PeopleOutlined />,              path: '/admin/users' },
  { label: 'Jobs',       icon: <WorkOutline />,                 path: '/admin/jobs' },
  { label: 'Categories', icon: <CategoryOutlined />,            path: '/admin/categories' },
  { label: 'Reports',    icon: <FlagOutlined />,                path: '/admin/reports' },
];

interface DashboardLayoutProps { children: React.ReactNode; }

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut, user } = useAuth();
  const { unreadCount } = useNotifications();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const role = (profile?.role ?? 'worker') as 'worker' | 'employer' | 'admin';
  const navLinks = role === 'admin' ? ADMIN_LINKS : role === 'employer' ? EMPLOYER_LINKS : WORKER_LINKS;

  const handleSignOut = async () => { await signOut(); navigate('/login'); };
  const roleBadgeColor = role === 'admin' ? '#d32f2f' : role === 'employer' ? '#1976d2' : SECONDARY;
  const initials = (profile?.full_name ?? user?.email ?? 'U').trim().charAt(0).toUpperCase();
  const currentTitle = navLinks.find(l => l.path === location.pathname)?.label
    ?? location.pathname.startsWith('/worker/jobs/') ? 'Job Details'
    : location.pathname.startsWith('/employer/jobs/') ? 'Job Details'
    : location.pathname.startsWith('/employer/applicants/') ? 'Applicants'
    : 'Dashboard';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ── Sidebar ── */}
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? 260 : 68,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? 260 : 68,
            boxSizing: 'border-box',
            bgcolor: PRIMARY,
            color: '#fff',
            border: 'none',
            overflowX: 'hidden',
            transition: 'width 0.2s ease',
          },
        }}
      >
        <Toolbar sx={{ justifyContent: drawerOpen ? 'space-between' : 'center', px: 2 }}>
          {drawerOpen && (
            <Typography variant="h6" fontWeight={800}>
              Proxi<span style={{ color: SECONDARY }}>Work</span>
            </Typography>
          )}
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)} sx={{ color: '#fff' }}>
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ p: 2 }}>
          <Chip
            label={role?.toUpperCase()}
            size="small"
            sx={{ bgcolor: roleBadgeColor, color: '#fff', fontWeight: 700 }}
          />
        </Box>
        <List>
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <ListItem key={link.path} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => navigate(link.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    px: 2.5,
                    bgcolor: active ? 'rgba(0,180,166,0.15)' : 'transparent',
                    borderLeft: active ? `3px solid ${SECONDARY}` : '3px solid transparent',
                    color: active ? SECONDARY : 'rgba(255,255,255,0.75)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 2 : 'auto', color: 'inherit' }}>
                    {link.icon}
                  </ListItemIcon>
                  {drawerOpen && (
                    <ListItemText
                      primary={link.label}
                      sx={{ '.MuiListItemText-primary': { fontWeight: active ? 700 : 500, fontSize: '0.92rem' } }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* ── Main Content ── */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <AppBar
          position="sticky"
          sx={{
            bgcolor: '#fff',
            color: PRIMARY,
            boxShadow: 'none',
            borderBottom: '1px solid rgba(15,52,96,0.08)',
          }}
        >
          <Toolbar>
            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
              {currentTitle}
            </Typography>

            <Tooltip title="Notifications">
              <IconButton onClick={() => navigate(`/${role}/notifications`)} sx={{ mr: 1 }}>
                <Badge badgeContent={unreadCount} color="error" max={99}>
                  <NotificationsOutlined />
                </Badge>
              </IconButton>
            </Tooltip>

            <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: PRIMARY, fontWeight: 700, fontSize: '0.9rem' }}>
                {initials}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={profileAnchor}
              open={!!profileAnchor}
              onClose={() => setProfileAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                onClick={() => { setProfileAnchor(null); navigate(`/${role}/profile`); }}
              >
                <PersonOutline sx={{ mr: 2, fontSize: 20 }} /> Profile
              </MenuItem>
              <MenuItem
                onClick={() => { setProfileAnchor(null); handleSignOut(); }}
              >
                <LogoutOutlined sx={{ mr: 2, fontSize: 20 }} /> Sign Out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
