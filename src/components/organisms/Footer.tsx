import React from 'react';
import { Grid, Box, Typography, IconButton, Divider } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import { useTranslation } from 'react-i18next';
import AppLogo from '../molecules/AppLogo';
import packageJson from '../../../package.json';
import { Link as RouterLink } from 'react-router-dom';
import { useBranding } from '../../hooks/useBranding';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { version } = packageJson;
  const { config } = useBranding();

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Grid item xs={12} textAlign="center">
          <Box padding={8}>
            <AppLogo maxWidth="250px" />
          </Box>

          <Box>
            <IconButton
              href="https://www.instagram.com"
              target="_blank"
              style={{ color: '#0A142F', zIndex: -1 }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://www.pinterest.com"
              target="_blank"
              style={{ color: '#0A142F', zIndex: -1 }}
            >
              <PinterestIcon />
            </IconButton>
            <IconButton
              href="https://www.facebook.com"
              target="_blank"
              style={{ color: '#0A142F', zIndex: -1 }}
            >
              <FacebookIcon />
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} textAlign="center" mt={3} marginBottom="16px">
          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}
          >
            <Typography variant="body2" color="textSecondary">
              <a
                href={config?.termsUrl || '/terms-and-conditions.html'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  fontSize: '0.95em',
                  marginRight: 8,
                }}
              >
                {t('footer.terms', 'Términos y condiciones')}
              </a>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <a
                href={config?.privacyUrl || '/privacy-policy.html'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  fontSize: '0.95em',
                }}
              >
                {t('footer.privacy', 'Política de privacidad')}
              </a>
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box>
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} |{' '}
              <a
                href="https://www.bytecodelatam.com"
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                byteCode |{' '}
              </a>
              {t('footer.copyright')} Version: {version}
            </Typography>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default Footer;
