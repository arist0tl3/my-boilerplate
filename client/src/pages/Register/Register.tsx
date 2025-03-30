import { ReactElement, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  Stack,
  Typography,
  LinearProgress,
  useColorScheme,
} from '@mui/joy';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useRegisterMutation } from '../../generated';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register(): ReactElement {
  const { mode, setMode } = useColorScheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const toggleColorMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      // Password complexity validation
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password);

      const requirements = [];

      if (formData.password.length < minLength) {
        requirements.push(`at least ${minLength} characters`);
      }
      if (!hasUpperCase) {
        requirements.push('an uppercase letter');
      }
      if (!hasLowerCase) {
        requirements.push('a lowercase letter');
      }
      if (!hasNumbers) {
        requirements.push('a number');
      }
      if (!hasSpecialChar) {
        requirements.push('a special character');
      }

      if (requirements.length > 0) {
        newErrors.password = `Password must contain ${requirements.join(', ')}`;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [register, { loading }] = useRegisterMutation({
    refetchQueries: ['CurrentUser'],
    onError: (error) => {
      setServerError(error.message);
    },
    update: (cache, { data }) => {
      if (data?.register.success) {
        localStorage.setItem('auth_token', data.register.token || '');
      } else {
        setServerError(data?.register.error || 'An error occurred');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await register({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
        },
      });

      if (response.data?.register.success) {
        // Successful registration, redirect to home or dashboard
        navigate('/');
      } else {
        setServerError(response.data?.register.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    }
  };

  // Add this function to calculate password strength
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;

    let strength = 0;

    // Length contribution (up to 25%)
    strength += Math.min(password.length * 2.5, 25);

    // Complexity contribution (up to 75%)
    if (/[A-Z]/.test(password)) strength += 15; // uppercase
    if (/[a-z]/.test(password)) strength += 15; // lowercase
    if (/\d/.test(password)) strength += 15; // numbers
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 15; // special chars
    if (password.length >= 12) strength += 15; // bonus for length >= 12

    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength: number): 'danger' | 'warning' | 'success' => {
    if (strength < 30) return 'danger';
    if (strength < 60) return 'warning';
    return 'success';
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Moderate';
    if (strength < 80) return 'Strong';
    return 'Very Strong';
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  // Add this function to check if form is valid
  const isFormValid = (): boolean => {
    // Basic validation for required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return false;
    }

    // Email format validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return false;
    }

    // Password validation
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password);

    if (formData.password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return false;
    }

    // Password matching validation
    if (formData.password !== formData.confirmPassword) {
      return false;
    }

    return true;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        minHeight: '100vh',
        bgcolor: 'background.surface',
      }}
    >
      {/* Left side - Image */}
      <Box
        sx={{
          flex: { xs: '0 0 auto', md: '0 0 50%' },
          height: { xs: '0vh', md: '100vh' },
          position: 'relative',
          backgroundImage: 'url(https://source.unsplash.com/random?collaboration)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            level="h1"
            sx={{
              color: 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              fontWeight: 'bold',
              textAlign: 'center',
              px: 2,
            }}
          >
            Join Our Community
          </Typography>
        </Box>
      </Box>

      {/* Right side - Form */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '0 0 50%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
          overflowY: 'auto',
          maxHeight: { xs: 'auto', md: '100vh' },
        }}
      >
        {/* Theme toggle button */}
        <IconButton
          onClick={toggleColorMode}
          sx={{
            position: 'absolute',
            top: { xs: 8, md: 16 },
            right: { xs: 8, md: 16 },
            bgcolor: 'background.surface',
            boxShadow: 'sm',
            zIndex: 10,
          }}
        >
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
            boxShadow: 'md',
            borderRadius: 'lg',
          }}
        >
          <Typography level="h4" component="h1" sx={{ mb: 2, textAlign: 'center' }}>
            Create Account
          </Typography>

          {serverError && (
            <Typography color="danger" sx={{ mb: 2, textAlign: 'center' }}>
              {serverError}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl error={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" fullWidth />
                {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
              </FormControl>

              <FormControl error={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  fullWidth
                />
                {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
              </FormControl>

              <FormControl error={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" fullWidth />
                {formData.password && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography level="body-xs">Password strength:</Typography>
                      <Typography level="body-xs" textColor={getStrengthColor(passwordStrength)}>
                        {getStrengthLabel(passwordStrength)}
                      </Typography>
                    </Box>
                    <LinearProgress determinate value={passwordStrength} color={getStrengthColor(passwordStrength)} />
                  </Box>
                )}
                {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
              </FormControl>

              <FormControl error={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  fullWidth
                />
                {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
              </FormControl>

              <Button type="submit" loading={loading} fullWidth disabled={!isFormValid()} color={isFormValid() ? 'primary' : 'neutral'}>
                Sign Up
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Typography level="body-sm" sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Sign in
            </Link>
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}

export default Register;
