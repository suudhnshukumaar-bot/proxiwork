import { useState } from 'react';
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
  Stack,
  Card,
  CardContent,
  CardActionArea,
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, WorkOutline, BusinessCenter } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'worker' | 'employer' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setAuthError(null);
      setAuthSuccess(null);
      if (!selectedRole) {
        setAuthError('Please select a role.');
        return;
      }

      const { error: signUpError, userId, hasSession } = await signUp(data.email, data.password, selectedRole);

      if (signUpError) {
        throw signUpError;
      }

      if (!hasSession) {
        setAuthSuccess('Check your email for a confirmation link. After confirming your address, sign in to continue.');
        return;
      }

      // Use the userId returned directly from signUp — avoids getUser() race condition
      if (userId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: `${data.firstName} ${data.lastName}`.trim() })
          .eq('id', userId);

        if (profileError) {
          console.error('[Signup] profile update error:', profileError.message);
        }
      }

      navigate(selectedRole === 'employer' ? '/employer/onboarding' : '/worker/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during signup';
      setAuthError(message);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left side - Image panel */}
      <Grid
        size={{ xs: 12, md: 5 }}
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
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'url(/proxiwork-community.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8,
            zIndex: 1
          }}
        />
        <Box sx={{
          position: 'relative', zIndex: 2, textAlign: 'center',
          bgcolor: 'rgba(15, 52, 96, 0.7)', p: 4, borderRadius: 4,
          backdropFilter: 'blur(8px)'
        }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Join Proxi<Box component="span" sx={{ color: 'secondary.main' }}>Work</Box>
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Find local opportunities or hire nearby talent.
          </Typography>
        </Box>
      </Grid>

      {/* Right side - Form / Role Selection */}
      <Grid
        size={{ xs: 12, md: 7 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: { xs: 2, sm: 4, md: 8 }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: selectedRole ? 500 : 700 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: selectedRole ? 6 : 8 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 8px 32px rgba(15, 52, 96, 0.05)'
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                {selectedRole ? 'Create an Account' : 'Choose Your Role'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {selectedRole
                  ? `Sign up as a ${selectedRole === 'worker' ? 'ProxiTasker' : 'Employer'} to get started.`
                  : 'How would you like to use ProxiWork?'}
              </Typography>
            </Box>

            {!selectedRole ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    borderWidth: 2,
                    borderColor: 'divider',
                    transition: '0.2s',
                    '&:hover': { borderColor: 'secondary.main', transform: 'translateY(-4px)' }
                  }}
                >
                  <CardActionArea onClick={() => setSelectedRole('worker')} sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', py: 5 }}>
                      <WorkOutline sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h5" gutterBottom fontWeight="bold">I am a ProxiTasker</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Find flexible local jobs, offer your skills, and earn money in your community.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>

                <Card
                  variant="outlined"
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    borderWidth: 2,
                    borderColor: 'divider',
                    transition: '0.2s',
                    '&:hover': { borderColor: 'secondary.main', transform: 'translateY(-4px)' }
                  }}
                >
                  <CardActionArea onClick={() => setSelectedRole('employer')} sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', py: 5 }}>
                      <BusinessCenter sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h5" gutterBottom fontWeight="bold">I am an Employer</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Post jobs, find reliable local workers, and manage your tasks efficiently.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Stack>
            ) : (
              <>
                {authError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {authError}
                  </Alert>
                )}
                {authSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {authSuccess}
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoComplete="given-name"
                        autoFocus
                        {...register('firstName')}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        autoComplete="family-name"
                        {...register('lastName')}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={<PersonAdd />}
                    sx={{
                      py: 1.5,
                      mt: 4,
                      mb: 2,
                      bgcolor: 'secondary.main',
                      color: '#000',
                      '&:hover': { bgcolor: 'secondary.dark' }
                    }}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="text"
                      onClick={() => setSelectedRole(null)}
                      sx={{ mb: 2, color: 'text.secondary' }}
                    >
                      ← Change Role
                    </Button>
                  </Box>
                </form>
              </>
            )}

            <Box sx={{ textAlign: 'center', mt: selectedRole ? 0 : 4 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}