import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#38bdf8' },
    secondary: { main: '#f59e0b' },
    success: { main: '#22c55e' },
    error: { main: '#fb7185' },
    background: {
      default: '#101317',
      paper: '#171c22',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

