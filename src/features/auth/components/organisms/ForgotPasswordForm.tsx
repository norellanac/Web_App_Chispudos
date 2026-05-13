import React, { useState } from 'react';
import { Box, Container, Grid, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ButtonAtom, InputAtom, TextAtom } from '../../../../components/atoms';
import AppLogo from '../../../../components/molecules/AppLogo';
import { useRequestPasswordResetMutation } from '../../../../services/authApi';

interface ForgotPasswordFormProps {
  handleSecondScreen: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  handleSecondScreen,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [requestPasswordReset, { isLoading, isError }] =
    useRequestPasswordResetMutation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('forms.commons.email'))
      .required(t('forms.commons.required')),
  });

  const handlePasswordReset = async (values: { email: string }) => {
    try {
      const result = await requestPasswordReset(values).unwrap();
      setSuccessMsg(t('auth.forget_pass.success_message'));
      setErrorMsg('');
      handleSecondScreen();
    } catch (error) {
      setErrorMsg(t('auth.forget_pass.error_message'));
    }
  };

  const handleBackToLogin = () => {
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
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={handlePasswordReset}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form style={{ width: '350px' }}>
              <IconButton
                sx={{
                  alignSelf: 'flex-start',
                  marginBottom: '20px',
                  bgcolor: '#f5f5f5',
                }}
                onClick={handleBackToLogin}
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
                      {t('auth.forget_pass.title')}
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
                      {t('auth.forget_pass.body')}
                    </TextAtom>
                  </Box>
                  <InputAtom
                    name="email"
                    type="email"
                    variant="outlined"
                    label={t('auth.forget_pass.emailTitle')}
                    placeholder={t('auth.forget_pass.emailText')}
                    errorMsg={errors.email || errorMsg}
                    fullWidth
                    sx={{
                      marginTop: '20px',
                      width: '100%',
                      maxWidth: '328px',
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ButtonAtom
                    type="submit"
                    variant="filled"
                    fullWidth
                    disabled={isSubmitting || isLoading}
                    sx={{
                      mt: 2,
                      width: '100%',
                      maxWidth: '328px',
                      textTransform: 'none',
                    }}
                  >
                    {t('auth.forget_pass.resetPassword')}
                  </ButtonAtom>
                </Grid>
                {successMsg && (
                  <Grid item xs={12}>
                    <TextAtom
                      variant="body"
                      size="medium"
                      sx={{
                        color: 'green',
                        textAlign: 'center',
                        marginTop: '10px',
                      }}
                    >
                      {successMsg}
                    </TextAtom>
                  </Grid>
                )}
                {errorMsg && (
                  <Grid item xs={12}>
                    <TextAtom
                      variant="body"
                      size="medium"
                      sx={{
                        color: 'red',
                        textAlign: 'center',
                        marginTop: '10px',
                      }}
                    >
                      {errorMsg}
                    </TextAtom>
                  </Grid>
                )}
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
                />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ForgotPasswordForm;
