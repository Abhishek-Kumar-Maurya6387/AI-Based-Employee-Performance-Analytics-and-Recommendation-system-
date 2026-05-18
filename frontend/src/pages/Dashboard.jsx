import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BusinessIcon from '@mui/icons-material/Business';
import API from '../api/axios';

const StatCard = ({ icon, label, value, color }) => (
  <Paper className="section-panel" sx={{ p: 2.5, height: '100%' }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ width: 46, height: 46, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: `${color}22`, color }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" fontWeight={900} sx={{ overflowWrap: 'anywhere' }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </Stack>
  </Paper>
);

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/employees')
      .then(({ data }) => setEmployees(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const avgScore = employees.length
      ? (employees.reduce((sum, employee) => sum + Number(employee.performanceScore || 0), 0) / employees.length).toFixed(1)
      : '0.0';
    const departments = [...new Set(employees.map((employee) => employee.department))];

    return {
      avgScore,
      topPerformer: employees[0]?.name || 'N/A',
      departmentCount: departments.length,
    };
  }, [employees]);

  const departmentSummary = useMemo(() => {
    const grouped = employees.reduce((acc, employee) => {
      const department = employee.department || 'Other';
      if (!acc[department]) acc[department] = { count: 0, total: 0 };
      acc[department].count += 1;
      acc[department].total += Number(employee.performanceScore || 0);
      return acc;
    }, {});

    return Object.entries(grouped).map(([department, data]) => ({
      department,
      count: data.count,
      avg: Math.round(data.total / data.count),
    }));
  }, [employees]);

  if (loading) {
    return <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 280 }}><CircularProgress /></Box>;
  }

  return (
    <main className="page-container">
      <Stack spacing={0.5} mb={3}>
        <Typography variant="h4" fontWeight={900}>Dashboard</Typography>
        <Typography color="text.secondary">HR analytics overview, rankings, and department performance.</Typography>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2.5} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<GroupIcon />} label="Total Employees" value={employees.length} color="#38bdf8" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<TrendingUpIcon />} label="Average Score" value={`${stats.avgScore}%`} color="#22c55e" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<WorkspacePremiumIcon />} label="Top Performer" value={stats.topPerformer} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard icon={<BusinessIcon />} label="Departments" value={stats.departmentCount} color="#fb7185" />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper className="section-panel" sx={{ p: 2.5 }}>
            <Typography variant="h6" fontWeight={900} mb={2}>Employee Rankings</Typography>
            <Stack spacing={1.25}>
              {employees.map((employee, index) => (
                <Box key={employee._id} sx={{ display: 'grid', gridTemplateColumns: '42px 1fr auto', gap: 1.5, alignItems: 'center', p: 1.25, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                  <Typography fontWeight={900} color={index < 3 ? 'secondary.main' : 'text.secondary'}>#{index + 1}</Typography>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={800} noWrap>{employee.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{employee.department} · {employee.experience} yrs exp</Typography>
                  </Box>
                  <Typography fontWeight={900} color={employee.performanceScore >= 80 ? 'success.main' : employee.performanceScore >= 60 ? 'secondary.main' : 'error.main'}>
                    {employee.performanceScore}/100
                  </Typography>
                </Box>
              ))}
              {!employees.length && <Typography color="text.secondary" textAlign="center" py={3}>No employee records yet.</Typography>}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper className="section-panel" sx={{ p: 2.5 }}>
            <Typography variant="h6" fontWeight={900} mb={2}>Department Summary</Typography>
            <Stack spacing={2}>
              {departmentSummary.map((item) => (
                <Box key={item.department}>
                  <Stack direction="row" justifyContent="space-between" mb={0.75}>
                    <Typography fontWeight={800}>{item.department}</Typography>
                    <Typography color="text.secondary">{item.count} employees · {item.avg}% avg</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={item.avg} sx={{ height: 8, borderRadius: 2 }} />
                </Box>
              ))}
              {!departmentSummary.length && <Typography color="text.secondary" textAlign="center" py={3}>Add employees to see department analytics.</Typography>}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};

export default Dashboard;
