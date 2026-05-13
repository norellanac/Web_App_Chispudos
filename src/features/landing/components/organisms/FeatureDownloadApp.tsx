import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Box } from '@mui/material';
import MobileApp from '../../../../assets/images/MobileApp.webp';
import GooglePlay from '../../../../assets/images/GooglePlay.svg';
import AppStore from '../../../../assets/images/Appstore.svg';
import LogoIsotype from '../../../../assets/images/isotipo.svg';
import TextAtom from '../../../../components/atoms/TextAtom';
import { useBranding } from '../../../../hooks/useBranding';

const FeatureDownloadApp = () => {
  const { t } = useTranslation();
  const { config } = useBranding();

  const playStoreUrl = config?.playStoreUrl || null;
  const appStoreUrl = config?.appStoreUrl || null;

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      style={{ padding: '60px 10px 0px 10px' }}
    >
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          <img
            src={LogoIsotype}
            alt={t('downloadSection.appPreviewAlt')}
            style={{ width: '100%', maxWidth: '90px', margin: '20px' }}
          />
        </Grid>
        <TextAtom
          variant="headline"
          size="large"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          {t('landing.downloadSection.title')}
        </TextAtom>
        <TextAtom variant="body" size="medium" color="textSecondary">
          {t('landing.downloadSection.description')}
        </TextAtom>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mt: 1 }}>
          {playStoreUrl ? (
            <a href={playStoreUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={GooglePlay}
                alt="Get it on Google Play"
                style={{ width: '100%', maxWidth: '170px', margin: '30px 15px' }}
              />
            </a>
          ) : (
            <img
              src={GooglePlay}
              alt="Google Play"
              style={{ width: '100%', maxWidth: '170px', margin: '30px 15px', opacity: 0.5 }}
            />
          )}
          {appStoreUrl ? (
            <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={AppStore}
                alt="Download on the App Store"
                style={{ width: '100%', maxWidth: '170px', margin: '0px 15px' }}
              />
            </a>
          ) : (
            <img
              src={AppStore}
              alt="App Store"
              style={{ width: '100%', maxWidth: '170px', margin: '0px 15px', opacity: 0.5 }}
            />
          )}
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <img
          src={MobileApp}
          alt={t('downloadSection.appPreviewAlt')}
          style={{ width: '100%', maxWidth: '600px' }}
        />
      </Grid>
    </Grid>
  );
};

export default FeatureDownloadApp;
