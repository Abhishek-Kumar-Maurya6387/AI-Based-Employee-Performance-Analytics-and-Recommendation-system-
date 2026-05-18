import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import API from '../api/axios';

const initialForm = {
  name: '',
  email: '',
  department: '',
  skills: [],
  performanceScore: '',
  experience: '',
};

const AddEmployee = () => {
  const [form, setForm] = useState(initialForm);
  const [skillInput, setSkillInput] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill || form.skills.includes(skill)) return;
    setForm({ ...form, skills: [...form.skills, skill] });
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((item) => item !== skill) });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await API.post('/employees', {
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      setSuccess('Employee added successfully.');
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <Stack spacing={0.5} mb={3}>
        <Typography variant="h4" fontWeight={900}>Add Employee</Typography>
        <Typography color="text.secondary">Store employee details, skills, performance score, and experience.</Typography>
      </Stack>

      <Paper className="section-panel" sx={{ p: { xs: 2.5, md: 3 }, maxWidth: 820 }}>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Employee Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Department" name="department" value={form.department} onChange={handleChange} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField label="Score" name="performanceScore" type="number" value={form.performanceScore} onChange={handleChange} required fullWidth inputProps={{ min: 0, max: 100 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField label="Experience" name="experience" type="number" value={form.experience} onChange={handleChange} required fullWidth inputProps={{ min: 0, step: 0.5 }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField
                  label="Add Skill"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  fullWidth
                />
                <Button variant="outlined" onClick={addSkill} startIcon={<AddCircleIcon />} sx={{ minWidth: 120 }}>
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={1.5}>
                {form.skills.map((skill) => (
                  <Chip key={skill} label={skill} color="primary" onDelete={() => removeSkill(skill)} />
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={<AddCircleIcon />}>
                {loading ? 'Saving...' : 'Add Employee'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </main>
  );
};

export default AddEmployee;
