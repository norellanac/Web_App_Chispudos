import { Box } from '@mui/material';
import TextAtom from '../../../../components/atoms/TextAtom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
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
          'heroSection.title',
          'Encuentra profesionales recomendados por gente real',
        )}
      </TextAtom>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <TextAtom variant="title" size="medium" color="secondary">
          {t(
            'heroSection.subtitle',
            'Plomeros, electricistas, mecánicos y más — todos de confianza y verificados por la comunidad.',
          )}
        </TextAtom>
      </Box>
    </Box>
  );
};

export default HeroSection;
