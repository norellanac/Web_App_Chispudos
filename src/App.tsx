import { useEffect } from 'react';
import AppRoutes from './routes/routes';
import { Provider, useDispatch } from 'react-redux';
import { persistor, store } from './redux/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@emotion/react';
import { themes, createThemes } from './theme';
import { CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import { fetchBranding, selectBranding } from './redux/slices/brandingSlice';
import { useSelector } from 'react-redux';

function BrandingLoader() {
  const dispatch = useDispatch();
  const { config } = useSelector(selectBranding);

  useEffect(() => {
    dispatch(fetchBranding() as any);
  }, [dispatch]);

  useEffect(() => {
    if (config?.copyOverrides) {
      Object.entries(config.copyOverrides).forEach(([lang, keys]) => {
        i18n.addResourceBundle(lang, 'translation', keys, true, true);
      });
    }
  }, [config]);

  useEffect(() => {
    if (config?.appName) {
      document.title = config.tagline
        ? `${config.appName} | ${config.tagline}`
        : config.appName;
    }
  }, [config]);

  const activeTheme = config
    ? createThemes(
        config.colorsLight,
        config.colorsDark,
        config.fontFamily,
        config.buttonBorderRadius,
      ).light
    : themes.light;

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrandingLoader />
        </PersistGate>
      </Provider>
    </I18nextProvider>
  );
}

export default App;
