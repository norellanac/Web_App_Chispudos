import { themes } from './../theme/index';
import { CssBaseline, ThemeProvider as MUIThemeProvider } from '@mui/material';
import React, { createContext, useContext, useMemo } from 'react';

type ThemeContextProps = {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
};
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
}> = ({ children, themeMode, toggleTheme }) => {
  const theme = useMemo(() => themes[themeMode], [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
export const useTheme = () => useContext(ThemeContext);
