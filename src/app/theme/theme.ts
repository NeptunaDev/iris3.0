'use client';
import { Inter } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const colors = {
  dark: "#0C0C0C",
  surface: "#ffffff",
  surfaceMiddle: "",
  darkGray: "#424242",
  surfaceLight: "#ECECEC",
  surfaceDark: "#DADADA"
}

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '35px',
      fontWeight: 700,
      lineHeight: 1.5
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.5
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.5
    },
    h4: {
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
      light: '#B0B0B0',
      dark: '#0d47a1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00DC0D',
      light: '#EC2000',
      dark: '#FFAA00',
      contrastText: '#fff',
    },
    error: {
      main: '#F51100',
    },
    warning: {
      main: '#ff9800',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#115293',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ECECEC',
        },
      },
    },
  },
});

export default theme;
