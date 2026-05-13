import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import RecoLogo from './../../assets/images/Reco_logo.png';
import { useNavigate } from 'react-router-dom';
import { useBranding } from '../../hooks/useBranding';

type AppLogoProps = {
  maxWidth?: string;
  sx?: SxProps<Theme>;
};

const AppLogo = ({ maxWidth = '150px', sx }: AppLogoProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { palette } = theme;
  const { getLogoUrl } = useBranding();
  const logoUrl = getLogoUrl();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        cursor: 'pointer',
        ...sx,
      }}
      onClick={() => navigate('/')}
    >
      <img
        src={logoUrl || RecoLogo}
        alt={t('app_name')}
        style={{
          width: '100%',
          maxWidth,
        }}
      />
    </Box>
  );
};

export default AppLogo;
