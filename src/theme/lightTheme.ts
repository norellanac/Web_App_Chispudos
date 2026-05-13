'use client';
import { createTheme, Theme } from '@mui/material/styles';
import { textTheme } from './textTheme';
import { BrandingColors } from '../types/branding';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
      light: '#F7F2FA',
      dark: '#6750A4',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71',
      light: '#E8DEF8',
      dark: '#1D192B',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#7D5260',
      light: '#EFB8C8',
      dark: '#31111D',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#B3261E',
      light: '#F2B8B5',
      dark: '#601410',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#49454F',
    },
    action: {
      disabledBackground: '#E3E0E3',
      disabled: '#979598',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '100px',
        },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: '#E3E0E3',
            color: '#979598',
          },
        },
      },
    },
  },
  typography: {
    ...textTheme,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export const createLightTheme = (
  colors: BrandingColors,
  fontFamily?: string,
  buttonBorderRadius?: number,
): Theme =>
  createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: colors.primary,
        light: colors.primaryContainer,
        dark: colors.primary,
        contrastText: colors.onPrimary,
      },
      secondary: {
        main: colors.secondary,
        light: colors.secondaryContainer,
        dark: colors.secondary,
        contrastText: colors.onSecondary,
      },
      tertiary: {
        main: colors.tertiary,
        light: colors.tertiaryContainer,
        dark: colors.tertiary,
        contrastText: colors.onTertiary,
      },
      error: {
        main: colors.error,
        light: colors.errorContainer,
        dark: colors.error,
        contrastText: '#FFFFFF',
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },
      action: {
        disabledBackground: '#E3E0E3',
        disabled: '#979598',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius:
              buttonBorderRadius !== undefined
                ? `${buttonBorderRadius}px`
                : '100px',
          },
          contained: {
            '&.Mui-disabled': {
              backgroundColor: '#E3E0E3',
              color: '#979598',
            },
          },
        },
      },
    },
    typography: {
      ...textTheme,
      ...(fontFamily ? { fontFamily } : {}),
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
