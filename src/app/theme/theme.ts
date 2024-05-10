'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
    typography: {
      fontFamily: roboto.style.fontFamily,
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
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      success: {
        main: '#4caf50',
      },
    },
  });

export default theme;
