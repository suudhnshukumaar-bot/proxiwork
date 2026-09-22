import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, profile, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Once profile loads after login, redirect to the correct dashboard
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccess && !loading && profile) {
      const dashboards: Record<string, string> = {
        worker: '/worker/dashboard',
        employer: '/employer/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(dashboards[profile.role] ?? '/');
    }
  }, [loginSuccess, loading, profile, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setAuthError(null);
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        throw error;
      }
      
      // Signal that login succeeded; the useEffect above will handle navigation
      // once the profile has been fetched by AuthContext.
      setLoginSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during login';
      setAuthError(message);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left side - Image */}
      <Grid 
        size={{ xs: 12, md: 6 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            backgroundImage: 'url(/proxiwork-community.jpg)', // Image placeholder
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8,
            zIndex: 1
          }} 
        />
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', bgcolor: 'rgba(15, 52, 96, 0.7)', p: 4, borderRadius: 4, backdropFilter: 'blur(8px)' }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Welcome to Proxi<Box component="span" sx={{ color: 'secondary.main' }}>Work</Box>
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Connecting community through local work.
          </Typography>
        </Box>
      </Grid>

      {/* Right side - Form */}
      <Grid 
        size={{ xs: 12, md: 6 }}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: { xs: 2, sm: 4, md: 8 }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 450 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 8px 32px rgba(15, 52, 96, 0.05)'
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to continue to ProxiWork
              </Typography>
            </Box>

            {authError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {authError}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
                <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ fontWeight: 500, color: 'secondary.dark' }}>
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={<LoginIcon />}
                sx={{ 
                  py: 1.5, 
                  mb: 3, 
                  bgcolor: 'secondary.main', 
                  color: '#000',
                  '&:hover': { bgcolor: 'secondary.dark' } 
                }}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/signup" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}