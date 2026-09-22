import React, { Suspense, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import theme from './theme';

// ─── Context Imports ──────────────────────────────────────────────────────────
// AuthContext and NotificationContext are expected to be provided by the app.
// They are imported lazily-safe here; if they don't exist yet placeholders are used.
let AuthContext: React.Context<{
  user: { role?: string } | null;
  loading?: boolean;
}>;
let NotificationContext: React.Context<unknown>;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AuthContext = require('./contexts/AuthContext').AuthContext;
} catch {
  AuthContext = React.createContext<{ user: { role?: string } | null; loading?: boolean }>({
    user: null,
    loading: false,
  });
}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  NotificationContext = require('./contexts/NotificationContext').NotificationContext;
} catch {
  NotificationContext = React.createContext(null);
}

// ─── Lazy Page Imports ────────────────────────────────────────────────────────

// Public
const LandingPage        = React.lazy(() => import('./pages/LandingPage'));
const LoginPage          = React.lazy(() => import('./pages/LoginPage'));
const SignupPage         = React.lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const VerifyEmailPage    = React.lazy(() => import('./pages/VerifyEmailPage'));

// Worker
const WorkerOnboarding  = React.lazy(() => import('./pages/worker/WorkerOnboarding'));
const WorkerDashboard   = React.lazy(() => import('./pages/worker/WorkerDashboard'));
const NearbyJobs        = React.lazy(() => import('./pages/worker/NearbyJobs'));
const JobDetailPage     = React.lazy(() => import('./pages/worker/JobDetailPage'));
const MyApplications    = React.lazy(() => import('./pages/worker/MyApplications'));
const MyJobs            = React.lazy(() => import('./pages/worker/MyJobs'));
const Earnings          = React.lazy(() => import('./pages/worker/Earnings'));
const WorkerRatings     = React.lazy(() => import('./pages/worker/WorkerRatings'));
const WorkerProfilePage = React.lazy(() => import('./pages/worker/WorkerProfilePage'));

// Employer
const EmployerOnboarding  = React.lazy(() => import('./pages/employer/EmployerOnboarding'));
const EmployerDashboard   = React.lazy(() => import('./pages/employer/EmployerDashboard'));
const PostJob             = React.lazy(() => import('./pages/employer/PostJob'));
const EmployerJobs        = React.lazy(() => import('./pages/employer/EmployerJobs'));
const EmployerJobDetail   = React.lazy(() => import('./pages/employer/EmployerJobDetail'));
const Applicants          = React.lazy(() => import('./pages/employer/Applicants'));
const EmployerProfilePage = React.lazy(() => import('./pages/employer/EmployerProfilePage'));
const EmployerRatings     = React.lazy(() => import('./pages/employer/EmployerRatings'));

// Shared (used by both worker and employer routes)
const Notifications = React.lazy(() => import('./pages/Notifications'));

// Admin
const AdminDashboard  = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers      = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminJobs       = React.lazy(() => import('./pages/admin/AdminJobs'));
const AdminReports    = React.lazy(() => import('./pages/admin/AdminReports'));
const AdminCategories = React.lazy(() => import('./pages/admin/AdminCategories'));

// ─── Suspense Fallback ────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}

// ─── ProtectedRoute ───────────────────────────────────────────────────────────

type Role = 'worker' | 'employer' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

const ROLE_DASHBOARDS: Record<Role, string> = {
  worker:   '/worker/dashboard',
  employer: '/employer/dashboard',
  admin:    '/admin/dashboard',
};

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useContext(AuthContext);

  // Still resolving auth state
  if (loading) {
    return <PageLoader />;
  }

  // Not authenticated → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role as Role | undefined;

  // Role mismatch → redirect to the user's own dashboard
  if (requiredRole && userRole && userRole !== requiredRole) {
    const correctDashboard = ROLE_DASHBOARDS[userRole] ?? '/login';
    return <Navigate to={correctDashboard} replace />;
  }

  return <>{children}</>;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ user: null, loading: false }}>
        <NotificationContext.Provider value={null}>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── Public ──────────────────────────────────────────── */}
                <Route path="/"               element={<LandingPage />} />
                <Route path="/login"          element={<LoginPage />} />
                <Route path="/signup"         element={<SignupPage />} />
                <Route path="/signup/worker"  element={<SignupPage role="worker" />} />
                <Route path="/signup/employer"element={<SignupPage role="employer" />} />
                <Route path="/forgot-password"element={<ForgotPasswordPage />} />
                <Route path="/verify-email"   element={<VerifyEmailPage />} />

                {/* ── Worker ──────────────────────────────────────────── */}
                <Route path="/worker/onboarding"   element={<ProtectedRoute requiredRole="worker"><WorkerOnboarding /></ProtectedRoute>} />
                <Route path="/worker/dashboard"    element={<ProtectedRoute requiredRole="worker"><WorkerDashboard /></ProtectedRoute>} />
                <Route path="/worker/jobs"         element={<ProtectedRoute requiredRole="worker"><NearbyJobs /></ProtectedRoute>} />
                <Route path="/worker/jobs/:id"     element={<ProtectedRoute requiredRole="worker"><JobDetailPage /></ProtectedRoute>} />
                <Route path="/worker/applications" element={<ProtectedRoute requiredRole="worker"><MyApplications /></ProtectedRoute>} />
                <Route path="/worker/my-jobs"      element={<ProtectedRoute requiredRole="worker"><MyJobs /></ProtectedRoute>} />
                <Route path="/worker/earnings"     element={<ProtectedRoute requiredRole="worker"><Earnings /></ProtectedRoute>} />
                <Route path="/worker/ratings"      element={<ProtectedRoute requiredRole="worker"><WorkerRatings /></ProtectedRoute>} />
                <Route path="/worker/profile"      element={<ProtectedRoute requiredRole="worker"><WorkerProfilePage /></ProtectedRoute>} />
                <Route path="/worker/notifications"element={<ProtectedRoute requiredRole="worker"><Notifications /></ProtectedRoute>} />

                {/* ── Employer ────────────────────────────────────────── */}
                <Route path="/employer/onboarding"       element={<ProtectedRoute requiredRole="employer"><EmployerOnboarding /></ProtectedRoute>} />
                <Route path="/employer/dashboard"        element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
                <Route path="/employer/post-job"         element={<ProtectedRoute requiredRole="employer"><PostJob /></ProtectedRoute>} />
                <Route path="/employer/jobs"             element={<ProtectedRoute requiredRole="employer"><EmployerJobs /></ProtectedRoute>} />
                <Route path="/employer/jobs/:id"         element={<ProtectedRoute requiredRole="employer"><EmployerJobDetail /></ProtectedRoute>} />
                <Route path="/employer/applicants/:jobId"element={<ProtectedRoute requiredRole="employer"><Applicants /></ProtectedRoute>} />
                <Route path="/employer/profile"          element={<ProtectedRoute requiredRole="employer"><EmployerProfilePage /></ProtectedRoute>} />
                <Route path="/employer/notifications"    element={<ProtectedRoute requiredRole="employer"><Notifications /></ProtectedRoute>} />
                <Route path="/employer/ratings"          element={<ProtectedRoute requiredRole="employer"><EmployerRatings /></ProtectedRoute>} />

                {/* ── Admin ───────────────────────────────────────────── */}
                <Route path="/admin/dashboard"  element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users"      element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/jobs"       element={<ProtectedRoute requiredRole="admin"><AdminJobs /></ProtectedRoute>} />
                <Route path="/admin/reports"    element={<ProtectedRoute requiredRole="admin"><AdminReports /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute requiredRole="admin"><AdminCategories /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </NotificationContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
