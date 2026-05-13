import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserLayout } from '../templates/UserLayout';
import TextAtom from '../atoms/TextAtom';
import ErrorImage from '../../assets/images/ErrorPage/ErrorImage.svg';
// import ServerErrorImage from '../../assets/images/ServerErrorPage/ServerErrorImage.svg';
// import ForbiddenImage from '../../assets/images/ForbiddenPage/ForbiddenImage.svg';
// import UnauthorizedImage from '../../assets/images/UnauthorizedPage/UnauthorizedImage.svg';
// import BadRequestImage from '../../assets/images/BadRequestPage/BadRequestImage.svg';

type ErrorPageProps = {
  errorMsg?: string;
  errorCode?: string;
  errorImage?: string;
  actionText?: string;
  handleCustomAction?: () => void;
};

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorMsg = 'Something went wrong',
  errorCode = '500',
  actionText,
  handleCustomAction,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const errorMessages = {
    '404': t('errorPage.notFoundMessage'),
    '500': t('errorPage.serverErrorMessage'),
    '403': t('errorPage.forbiddenMessage'),
    '401': t('errorPage.unauthorizedMessage'),
    '400': t('errorPage.badRequestMessage'),
  };

  //Aquí se pueden agregar las imágenes personalizadas según cada error
  const errorImages = {
    '404': ErrorImage,
    '500': ErrorImage,
    '403': ErrorImage,
    '401': ErrorImage,
    '400': ErrorImage,
  };

  const message =
    errorMsg || errorMessages[errorCode] || t('errorPage.defaultMessage');
  const errorImage = errorImages[errorCode];

  return (
    <UserLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          backgroundColor: '#F9F5FF',
          padding: 2,
        }}
      >
        <Box
          component="img"
          src={errorImage}
          alt={t('errorPage.notFoundImageAlt')}
          sx={{
            width: { xs: '90%', md: '70%' },
            height: 'auto',
            marginBottom: '2rem',
          }}
        />

        <TextAtom variant="headline" size="large" sx={{ marginBottom: 2 }}>
          {`${errorCode} - ${errorMessages[errorCode]}`}
        </TextAtom>
        <TextAtom variant="body" size="medium" sx={{ marginBottom: 4 }}>
          {message}
        </TextAtom>
        <Button variant="contained" onClick={handleCustomAction || (() => navigate('/'))}>
          { actionText || t('errorPage.goHomeButton')}
        </Button>
      </Box>
    </UserLayout>
  );
};

export default ErrorPage;
