import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ButtonAtom, TextAtom } from '../../../../components/atoms';
import SuccessImage from '../../../../assets/images/SuccessImage.svg';

const PasswordUpdateSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/login');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#FFF',
        position: 'relative',
        padding: 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          maxWidth: '483px',
          padding: 0,
          bgcolor: '#fff',
          boxShadow: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ height: '100px' }} />
        <Grid
          container
          spacing={2}
          direction="column"
          justifyContent="center"
          style={{ width: '350px' }}
        >
          <Grid item xs={12}>
            <Container>
              <img
                src={SuccessImage}
                alt="Ilustración de mujer sosteniendo un ícono de check"
                style={{
                  alignSelf: 'center',
                  marginBottom: '20px',
                }}
              />
            </Container>
            <Box>
              <TextAtom
                variant="title"
                size="large"
                sx={{
                  textAlign: 'left',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                {t('auth.updateSuccess.title')}
              </TextAtom>
            </Box>
            <Box>
              <TextAtom
                variant="body"
                size="medium"
                sx={{
                  textAlign: 'left',
                  textTransform: 'none',
                }}
              >
                {t('auth.updateSuccess.body')}
              </TextAtom>
            </Box>
            <Box>
              <ButtonAtom
                variant="filled"
                fullWidth
                onClick={handleSubmit}
                sx={{
                  mt: 2,
                  width: '100%',
                  maxWidth: '328px',
                  textTransform: 'none',
                }}
              >
                {t('auth.updateSuccess.continue')}
              </ButtonAtom>
            </Box>
          </Grid>

          <Box sx={{ height: '191px' }} />
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          ></Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PasswordUpdateSuccess;
