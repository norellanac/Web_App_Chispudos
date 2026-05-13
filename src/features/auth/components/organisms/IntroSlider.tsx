import React, { useState, useEffect } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { PersonAppImage, TextAtom } from '../../../../components/atoms';
import introSliderImg1 from '../../../../assets/images/intro_sliders/intro_1.png';
import introSliderImg2 from '../../../../assets/images/intro_sliders/intro_2.png';
import introSliderImg3 from '../../../../assets/images/intro_sliders/intro_3.png';
import introSliderImg4 from '../../../../assets/images/intro_sliders/intro_4.png';
import { useSelector } from 'react-redux';
import { selectBranding } from '../../../../redux/slices/brandingSlice';

const BASE_API_URL = (import.meta.env.VITE_BASE_API_URL || '').replace(/\/$/, '');

// i18next-parser-start
// t('auth.slider_intro.title_1', 'Find the expert you need in minutes.')
// t('auth.slider_intro.title_2', 'Hire easily and without complications.')
// t('auth.slider_intro.title_3', 'Based on user ratings who bought their services.')
// t('auth.slider_intro.title_4', 'Explore, compare and schedule in a few steps.')
// i18next-parser-end

const LOCAL_SLIDES = [
  { title: 'auth.slider_intro.title_1', image: introSliderImg1 },
  { title: 'auth.slider_intro.title_2', image: introSliderImg2 },
  { title: 'auth.slider_intro.title_3', image: introSliderImg3 },
  { title: 'auth.slider_intro.title_4', image: introSliderImg4 },
];

const IntroSlider: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { palette } = theme;
  const [currentSlide, setCurrentSlide] = useState(0);
  const { config } = useSelector(selectBranding);

  const slides = config?.introSlides?.length
    ? config.introSlides.map((s) => ({
        title: s.title,
        image: s.imageUrl.startsWith('http') ? s.imageUrl : `${BASE_API_URL}${s.imageUrl}`,
        isUrl: true,
      }))
    : LOCAL_SLIDES.map((s) => ({ ...s, isUrl: false }));

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid
      item
      xs={12}
      md={6}
      lg={8}
      sx={{
        backgroundColor: '#F4F4F4',
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        position: 'relative',
        height: '100%',
      }}
    >
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          color: palette.primary.main,
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <TextAtom
          variant="headline"
          size="small"
          sx={{
            mb: 2,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            letterSpacing: '0.5px',
            fontWeight: 'bold',
          }}
        >
          {slides[currentSlide].isUrl
            ? slides[currentSlide].title
            : t(slides[currentSlide].title)}
        </TextAtom>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        {slides[currentSlide].isUrl ? (
          <img
            src={slides[currentSlide].image as string}
            alt={slides[currentSlide].title}
            style={{ maxWidth: 340, maxHeight: 340, objectFit: 'contain' }}
          />
        ) : (
          <PersonAppImage imageSrc={slides[currentSlide].image} />
        )}
      </Box>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          color: palette.primary.main,
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {slides.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor:
                currentSlide === index
                  ? palette.primary.main
                  : palette.secondary.light,
              mx: 1,
            }}
          />
        ))}
      </Box>
    </Grid>
  );
};

export default IntroSlider;
