import { darkTheme, createDarkTheme } from './darkTheme';
import { lightTheme, createLightTheme } from './lightTheme';
import { BrandingColors } from '../types/branding';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export const createThemes = (
  colorsLight: BrandingColors,
  colorsDark: BrandingColors,
  fontFamily?: string,
  buttonBorderRadius?: number,
) => ({
  light: createLightTheme(colorsLight, fontFamily, buttonBorderRadius),
  dark: createDarkTheme(colorsDark, fontFamily, buttonBorderRadius),
});
