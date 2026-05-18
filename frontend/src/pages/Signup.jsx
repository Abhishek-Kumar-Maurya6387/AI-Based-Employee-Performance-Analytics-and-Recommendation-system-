import { useState } from 'react';
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'hr' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/signup', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'grid', placeItems: 'center', px: 2 }}>
      <Paper className="section-panel" sx={{ width: 'min(440px, 100%)', p: { xs: 3, sm: 4 } }}>
        <Stack spacing={1} mb={3}>
          <Typography variant="h4" fontWeight={900}>Create Account</Typography>
          <Typography color="text.secondary">Register as HR or Admin to manage employee analytics.</Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack component="form" spacing={2.2} onSubmit={handleSubmit}>
          <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
          <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required fullWidth inputProps={{ minLength: 6 }} />
          <TextField select label="Role" name="role" value={form.role} onChange={handleChange} fullWidth>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" size="large" startIcon={<PersonAddAltIcon />} disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Have an account? <Box component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 800 }}>Login</Box>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Signup;

