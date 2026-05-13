import React, { useState } from 'react';
import { Box, Container, Grid, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ButtonAtom, InputAtom, TextAtom } from '../../../../components/atoms';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import AppLogo from '../../../../components/molecules/AppLogo';

interface OTPVerificationProps {
  onOtpReceived: (otp: string) => void;
  onNext: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  onNext,
  onOtpReceived,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^[a-zA-Z0-9]{6}$/, t('auth.OTPVerification.otp_error'))
      .required(t('auth.OTPVerification.otp_required')),
  });

  const handleSubmit = async (values: { otp: string }) => {
    try {
      console.log('OTP ingresado:', values.otp);
      onOtpReceived(values.otp);
      onNext();
    } catch (error) {
      console.error('Error al verificar OTP:', error);
      setErrorMsg(t('auth.OTPVerification.error'));
    }
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            mb: '30px',
          }}
        >
          <AppLogo maxWidth="250px" />
        </Box>
        <Box sx={{ height: '100px' }} />
        <Formik
          initialValues={{ otp: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors, handleChange, values }) => (
            <Form style={{ width: '350px' }}>
              <IconButton
                sx={{
                  alignSelf: 'flex-start',
                  marginBottom: '20px',
                  bgcolor: '#f5f5f5',
                }}
                onClick={() => navigate(-1)}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <Grid
                container
                spacing={2}
                direction="column"
                justifyContent="center"
              >
                <Grid item xs={12}>
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
                      {t('auth.OTPVerification.title')}
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
                      {t('auth.OTPVerification.body')}
                    </TextAtom>
                  </Box>

                  <InputAtom
                    name="otp"
                    type="text"
                    variant="outlined"
                    maxLength={6}
                    value={values.otp}
                    onChange={handleChange}
                    placeholder={t('auth.OTPVerification.otp_placeholder')}
                    errorMsg={touched.otp && errors.otp ? errors.otp : errorMsg}
                    fullWidth
                    sx={{
                      marginTop: '20px',
                      width: '100%',
                      maxWidth: '328px',
                      textAlign: 'center',
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ButtonAtom
                    type="submit"
                    variant="filled"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      mt: 2,
                      width: '100%',
                      maxWidth: '328px',
                      textTransform: 'none',
                    }}
                  >
                    {t('auth.OTPVerification.verify_code')}
                  </ButtonAtom>
                </Grid>
                <TextAtom
                  variant="body"
                  size="medium"
                  sx={{
                    textAlign: 'center',
                    textTransform: 'none',
                    marginTop: '20px',
                  }}
                >
                  {t('auth.OTPVerification.did_not_receive')}{' '}
                  <span style={{ color: 'blue', cursor: 'pointer' }}>
                    {t('auth.OTPVerification.resend')}
                  </span>
                </TextAtom>

                <Box sx={{ height: '191px' }} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default OTPVerification;
