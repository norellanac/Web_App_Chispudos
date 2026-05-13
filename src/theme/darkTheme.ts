'use client';
import { createTheme, Theme } from '@mui/material/styles';
import { textTheme } from './textTheme';
import { BrandingColors } from '../types/branding';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF',
      light: '#25232A',
      dark: '#D0BCFF',
      contrastText: '#000000',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#4A4458',
      dark: '#49454F',
      contrastText: '#000000',
    },
    tertiary: {
      main: '#EFB8C8',
      light: '#FFD8E4',
      dark: '#633B48',
      contrastText: '#000000',
    },
    error: {
      main: '#F2B8B5',
      light: '#FFDAD6',
      dark: '#8C1D18',
      contrastText: '#000000',
    },
    background: {
      default: '#1C1B1F',
      paper: '#121212',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CAC4D0',
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

export const createDarkTheme = (
  colors: BrandingColors,
  fontFamily?: string,
  buttonBorderRadius?: number,
): Theme =>
  createTheme({
    palette: {
      mode: 'dark',
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
        contrastText: '#000000',
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
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
