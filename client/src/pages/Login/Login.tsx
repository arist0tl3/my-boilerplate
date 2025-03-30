import { ReactElement, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, Divider, FormControl, FormHelperText, FormLabel, Input, Link, Stack, Typography } from '@mui/joy';
import { useLoginMutation } from '../../generated';

interface LoginFormData {
  email: string;
  password: string;
}

function Login(): ReactElement {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [login, { loading }] = useLoginMutation({
    refetchQueries: ['CurrentUser'],
    onError: (error) => {
      setServerError(error.message);
    },
    update: (cache, { data }) => {
      if (data?.login.success) {
        localStorage.setItem('auth_token', data.login.token || '');
      } else {
        setServerError(data?.login.error || 'An error occurred');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    login({
      variables: {
        input: {
          email: formData.email,
          password: formData.password,
        },
      },
    });
  };

  // Add this function to check if form is valid
  const isFormValid = (): boolean => {
    // Basic validation for required fields
    if (!formData.email || !formData.password) {
      return false;
    }

    // Email format validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return false;
    }

    return true;
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        p: 2,
        bgcolor: 'background.surface',
      }}
    >
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
          Sign In
        </Typography>

        {serverError && (
          <Typography color="danger" sx={{ mb: 2, textAlign: 'center' }}>
            {serverError}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
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
              {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
            </FormControl>

            <Button type="submit" loading={loading} fullWidth disabled={!isFormValid()} color={isFormValid() ? 'primary' : 'neutral'}>
              Sign In
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Typography level="body-sm" sx={{ textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link component={RouterLink} to="/register">
            Sign up
          </Link>
        </Typography>
      </Card>
    </Box>
  );
}

export default Login;
