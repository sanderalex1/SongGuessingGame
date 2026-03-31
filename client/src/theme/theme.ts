import { createTheme } from '@mui/material/styles';

const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: { main: '#D4A017', contrastText: '#1a1a1a' },
            secondary: { main: '#e6b422' },
            background: { default: '#1a1a1a', paper: '#222222' },
            text: { primary: '#ffffff', secondary: '#b3b3b3' },
          }
        : {
            primary: { main: '#D4A017', contrastText: '#fff' },
            secondary: { main: '#b8860b' },
            background: { default: '#f5f5f0', paper: '#ffffff' },
            text: { primary: '#1a1a1a', secondary: '#535353' },
          }),
    },
    typography: {
      fontFamily: '"Arial", "Helvetica", sans-serif',
      h1: { fontFamily: '"Anton", sans-serif', fontWeight: 400, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
      h2: { fontFamily: '"Anton", sans-serif', fontWeight: 400, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
      h3: { fontFamily: '"Anton", sans-serif', fontWeight: 400, letterSpacing: '0.02em', textTransform: 'uppercase' as const },
      h4: { fontFamily: '"Anton", sans-serif', fontWeight: 400, letterSpacing: '0.02em' },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' as const },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 4, padding: '10px 24px', fontSize: '0.95rem' },
          containedPrimary: {
            background: '#D4A017',
            color: '#1a1a1a',
            '&:hover': { background: '#b8860b' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } },
        },
      },
    },
  });

export default getTheme;
