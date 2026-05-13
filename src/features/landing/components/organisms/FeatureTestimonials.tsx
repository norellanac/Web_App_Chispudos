import React, { useState } from 'react';
import { Box, Avatar, IconButton, Rating } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/material/styles';
import TextAtom from '../../../../components/atoms/TextAtom';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  margin: '20px auto',
  position: 'relative',
  width: '85%',
  [theme.breakpoints.down('sm')]: {
    margin: '10px auto',
    width: '95%',
    padding: theme.spacing(2),
  },
}));

const CircleButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid #CBCBCB',
  color: '#191825',
  width: '70px',
  height: '70px',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

const Dots = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1),
  },
}));

const Dot = styled(Box)(({ active }) => ({
  width: '15px',
  height: '15px',
  borderRadius: '50%',
  backgroundColor: active ? '#019FE9' : '#ccc',
  margin: '10px',
}));

const Testimonials = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: t('landing.testimonials.feedback.0.name'),
      title: t('landing.testimonials.feedback.0.title'),
      comment: t('landing.testimonials.feedback.0.comment'),
      image: 'src/assets/images/AnaF.webp',
    },
    {
      name: t('landing.testimonials.feedback.1.name'),
      title: t('landing.testimonials.feedback.1.title'),
      comment: t('landing.testimonials.feedback.1.comment'),
      image: 'src/assets/images/Juan.webp',
    },
    {
      name: t('landing.testimonials.feedback.2.name'),
      title: t('landing.testimonials.feedback.2.title'),
      comment: t('landing.testimonials.feedback.2.comment'),
      image: 'src/assets/images/Sofia.webp',
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <StyledContainer
      sx={{
        backgroundColor: '#FFF9E9',
        width: '100vw',
        maxWidth: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        mt: 5,
        py: 10,
      }}
    >
      <Box>
        <TextAtom
          variant="label"
          size="large"
          sx={{
            color: '#019FE9',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {t('landing.testimonials.title')}
        </TextAtom>
      </Box>

      <TextAtom
        variant="headline"
        size="large"
        sx={{ fontWeight: 'bold', padding: '30px 0px', marginBottom: 2 }}
      >
        {t('landing.testimonials.subtitle')}
      </TextAtom>

      <Box display="flex" justifyContent="center" alignItems="center">
        <CircleButton onClick={handlePrev} aria-label="prev">
          <ArrowBackIosIcon />
        </CircleButton>

        <Box mx={2}>
          <Avatar
            alt={testimonials[currentIndex].name}
            src={testimonials[currentIndex].image}
            sx={{ width: 90, height: 90, margin: 'auto' }}
          />

          <Box>
            <TextAtom
              variant="title"
              size="medium"
              sx={{ color: '#FF7043', display: 'inline' }}
            >
              {testimonials[currentIndex].name}
            </TextAtom>

            <TextAtom
              variant="body"
              size="large"
              sx={{ color: 'secondary', display: 'inline' }}
            >
              {' '}
              / {testimonials[currentIndex].title}
            </TextAtom>
          </Box>

          <Box>
            {' '}
            <Rating value={5} readOnly />{' '}
          </Box>

          <TextAtom
            variant="body"
            size="medium"
            sx={{ color: '#5F5F5F', marginTop: 2 }}
          >
            {testimonials[currentIndex].comment}
          </TextAtom>
        </Box>

        <CircleButton onClick={handleNext} aria-label="next">
          <ArrowForwardIosIcon />
        </CircleButton>
      </Box>

      <Dots>
        {testimonials.map((_, index) => (
          <Dot key={index} active={index === currentIndex} />
        ))}
      </Dots>
    </StyledContainer>
  );
};

export default Testimonials;
