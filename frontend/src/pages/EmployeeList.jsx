import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import API from '../api/axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async (nextFilters = { search, department }) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (nextFilters.department) params.department = nextFilters.department;
      if (nextFilters.search) params.name = nextFilters.search;

      const endpoint = params.department || params.name ? '/employees/search' : '/employees';
      const { data } = await API.get(endpoint, { params });
      setEmployees(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees({ search: '', department: '' });
  }, []);

  const resetFilters = () => {
    setSearch('');
    setDepartment('');
    fetchEmployees({ search: '', department: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;

    try {
      await API.delete(`/employees/${id}`);
      setEmployees((current) => current.filter((employee) => employee._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const openEdit = (employee) => {
    setEditing(employee);
    setScore(employee.performanceScore);
  };

  const handleUpdateScore = async () => {
    setSaving(true);
    setError('');

    try {
      const { data } = await API.put(`/employees/${editing._id}`, {
        performanceScore: Number(score),
      });
      setEmployees((current) => current.map((employee) => employee._id === data._id ? data : employee));
      setEditing(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const scoreColor = (value) => {
    if (value >= 80) return 'success.main';
    if (value >= 60) return 'secondary.main';
    return 'error.main';
  };

  return (
    <main className="page-container">
      <Stack spacing={0.5} mb={3}>
        <Typography variant="h4" fontWeight={900}>Employees</Typography>
        <Typography color="text.secondary">Search, filter, update performance score, and manage employee records.</Typography>
      </Stack>

      <Paper className="section-panel" sx={{ p: 2, mb: 2.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField label="Search by name" value={search} onChange={(event) => setSearch(event.target.value)} fullWidth />
          <TextField label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)} fullWidth />
          <Button variant="contained" startIcon={<SearchIcon />} onClick={() => fetchEmployees()} sx={{ minWidth: 130 }}>
            Search
          </Button>
          <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={resetFilters} sx={{ minWidth: 120 }}>
            Reset
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={2}>
          {employees.map((employee) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={employee._id}>
              <Paper className="section-panel" sx={{ p: 2.25, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6" fontWeight={900} noWrap>{employee.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{employee.email}</Typography>
                  </Box>
                  <Stack direction="row">
                    <Tooltip title="Update score">
                      <IconButton color="primary" onClick={() => openEdit(employee)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete employee">
                      <IconButton color="error" onClick={() => handleDelete(employee._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap my={1.5}>
                  <Chip label={employee.department} size="small" />
                  <Chip label={`${employee.experience} yrs exp`} size="small" variant="outlined" />
                </Stack>

                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap minHeight={34}>
                  {(employee.skills || []).map((skill) => (
                    <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
                  ))}
                  {!employee.skills?.length && <Typography variant="body2" color="text.secondary">No skills added</Typography>}
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography color="text.secondary">Performance</Typography>
                  <Typography fontWeight={900} color={scoreColor(employee.performanceScore)}>
                    {employee.performanceScore}/100
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
          {!employees.length && (
            <Grid size={{ xs: 12 }}>
              <Paper className="section-panel" sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No employees found.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="xs">
        <DialogTitle>Update Performance Score</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" mb={2}>{editing?.name}</Typography>
          <TextField
            label="Performance Score"
            type="number"
            value={score}
            onChange={(event) => setScore(event.target.value)}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateScore} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default EmployeeList;
