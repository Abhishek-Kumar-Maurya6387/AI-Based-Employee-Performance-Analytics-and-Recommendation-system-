import { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'grid', placeItems: 'center', px: 2 }}>
      <Paper className="section-panel" sx={{ width: 'min(420px, 100%)', p: { xs: 3, sm: 4 } }}>
        <Stack spacing={1} mb={3}>
          <Typography variant="h4" fontWeight={900}>HR Login</Typography>
          <Typography color="text.secondary">Access employee analytics and AI recommendations.</Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack component="form" spacing={2.2} onSubmit={handleSubmit}>
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
          <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth />
          <Button type="submit" variant="contained" size="large" startIcon={<LoginIcon />} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No account? <Box component={Link} to="/signup" sx={{ color: 'primary.main', fontWeight: 800 }}>Create one</Box>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;

