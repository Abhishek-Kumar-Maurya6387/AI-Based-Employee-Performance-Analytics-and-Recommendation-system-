import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Employees', path: '/employees', icon: <GroupIcon /> },
  { label: 'Add', path: '/add-employee', icon: <PersonAddAltIcon /> },
  { label: 'AI Insights', path: '/ai-recommend', icon: <AutoAwesomeIcon /> },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(18, 22, 30, 0.96)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <Toolbar sx={{ gap: 1.5 }}>
        <AutoGraphIcon color="primary" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1 }}>
            EmpAnalytics AI
          </Typography>
          {user && (
            <Typography variant="caption" color="text.secondary">
              {user.name} · {user.role.toUpperCase()}
            </Typography>
          )}
        </Box>

        {user && (
          <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.75 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  {item.label}
                </Button>
              ))}
              <Tooltip title="Logout">
                <IconButton color="error" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton color="inherit" onClick={(event) => setAnchorEl(event.currentTarget)}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={() => setAnchorEl(null)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.icon}
                      {item.label}
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogout}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                    <LogoutIcon />
                    Logout
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

