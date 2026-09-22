import { createTheme } from '@mui/material/styles';

// Step 1: base theme so we can call augmentColor
let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F3460', // dark blue
    },
    secondary: {
      main: '#FFC107', // bold yellow
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
  },
});

// Step 2: full theme with augmentColor for custom status colors
theme = createTheme(theme, {
  palette: {
    pending: theme.palette.augmentColor({
      color: { main: '#ed6c02' },
      name: 'pending',
    }),
    accepted: theme.palette.augmentColor({
      color: { main: '#2e7d32' },
      name: 'accepted',
    }),
    rejected: theme.palette.augmentColor({
      color: { main: '#d32f2f' },
      name: 'rejected',
    }),
    completed: theme.palette.augmentColor({
      color: { main: '#1976d2' },
      name: 'completed',
    }),
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none' as const,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme: t }: { theme: typeof theme }) => ({
          boxShadow: 'none',
          border: `1px solid ${t.palette.divider}`,
          borderRadius: t.shape.borderRadius,
        }),
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme: t }: { theme: typeof theme }) => ({
          boxShadow: 'none',
          borderBottom: `1px solid ${t.palette.divider}`,
        }),
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined' as const,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export default theme;

// Module augmentation for custom palette colors
declare module '@mui/material/styles' {
  interface Palette {
    pending: Palette['primary'];
    accepted: Palette['primary'];
    rejected: Palette['primary'];
    completed: Palette['primary'];
  }
  interface PaletteOptions {
    pending?: PaletteOptions['primary'];
    accepted?: PaletteOptions['primary'];
    rejected?: PaletteOptions['primary'];
    completed?: PaletteOptions['primary'];
  }
}
