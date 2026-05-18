import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import API from '../api/axios';

const AIRecommendation = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/employees')
      .then(({ data }) => {
        setEmployees(data);
        setSelected(data.map((employee) => employee._id));
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load employees'))
      .finally(() => setFetchLoading(false));
  }, []);

  const chosenEmployees = useMemo(
    () => employees.filter((employee) => selected.includes(employee._id)),
    [employees, selected]
  );

  const toggleSelect = (id) => {
    setSelected((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

  const toggleAll = () => {
    setSelected((current) => current.length === employees.length ? [] : employees.map((employee) => employee._id));
  };

  const handleGenerate = async () => {
    if (!chosenEmployees.length) {
      setError('Select at least one employee for AI analysis');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const { data } = await API.post('/ai/recommend', { employees: chosenEmployees });
      setRecommendation(data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 280 }}><CircularProgress /></Box>;
  }

  return (
    <main className="page-container">
      <Stack spacing={0.5} mb={3}>
        <Typography variant="h4" fontWeight={900}>AI Recommendations</Typography>
        <Typography color="text.secondary">Generate promotion, ranking, training, and feedback insights.</Typography>
      </Stack>

      <Paper className="section-panel" sx={{ p: { xs: 2.5, md: 3 }, mb: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={900}>Select Employees</Typography>
            <Typography variant="body2" color="text.secondary">{chosenEmployees.length} selected out of {employees.length}</Typography>
          </Box>
          <Button variant="outlined" startIcon={<SelectAllIcon />} onClick={toggleAll}>
            {selected.length === employees.length ? 'Clear' : 'Select All'}
          </Button>
        </Stack>

        <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
          {employees.map((employee) => (
            <FormControlLabel
              key={employee._id}
              control={<Checkbox checked={selected.includes(employee._id)} onChange={() => toggleSelect(employee._id)} />}
              label={`${employee.name} (${employee.performanceScore})`}
              sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, px: 1, mr: 0 }}
            />
          ))}
          {!employees.length && <Typography color="text.secondary">Add employee records before generating AI insights.</Typography>}
        </Stack>

        <Button
          variant="contained"
          size="large"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleGenerate}
          disabled={loading || !employees.length}
          sx={{ mt: 2.5 }}
        >
          {loading ? 'Generating Analysis...' : 'Generate AI Insights'}
        </Button>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && (
        <Paper className="section-panel" sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={24} />
            <Typography color="text.secondary">AI is analyzing employee data...</Typography>
          </Stack>
        </Paper>
      )}

      {recommendation && (
        <Paper className="section-panel" sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6" fontWeight={900}>AI Analysis Report</Typography>
          </Stack>
          <pre className="ai-response">{recommendation}</pre>
        </Paper>
      )}
    </main>
  );
};

export default AIRecommendation;

