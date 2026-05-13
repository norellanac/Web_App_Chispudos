import { Box } from '@mui/material';
import TextAtom from '../../../../components/atoms/TextAtom';
import { useTranslation } from 'react-i18next';

interface WelcomeBannerProps {
  userName: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        alignItems: 'center',
        textAlign: 'center',
        mt: 2,
        py: 4,
        px: { xs: 2, md: 4, lg: 4 },
      }}
    >
      <TextAtom
        variant="headline"
        fontWeight="bold"
        sx={{
          fontSize: { xs: '1.8rem', md: '2.2rem', lg: '2.5rem' },
          mb: -1,
          lineHeight: 1.15,
        }}
      >
        {t(
          'welcomeBanner.greeting',
          '¡Hola, {{userName}}! ¿Qué necesitás resolver hoy?',
          { userName },
        )}
      </TextAtom>
    </Box>
  );
};

export default WelcomeBanner;
