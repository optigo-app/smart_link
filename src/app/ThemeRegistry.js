'use client';

import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: '#2563eb',
      light: '#eff6ff',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <EmotionThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </EmotionThemeProvider>
  );
}