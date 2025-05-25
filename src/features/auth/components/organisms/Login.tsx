import React, { useCallback, useState } from 'react';
import { Box, Container, IconButton, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ButtonAtom, InputAtom, TextAtom } from '../../../../components/atoms';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { logger } from '../../../../utils/logger';
import { loginSuccess } from '../../../../redux/slices/authSlice';
import { LoginValues } from '../../../../types/api/apiRequests';
import AppLogo from '../../../../components/molecules/AppLogo';
import { useLoginMutation } from '../../../../services/authApi';
import FacebookLoginButton from './FacebookLoginButton';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('forms.commons.email'))
      .required(t('forms.commons.required')),
    password: Yup.string()
      .min(6, t('forms.commons.min_length', { min: 6 }))
      .required(t('forms.commons.required')),
  });

  const handleLogin = async (values: LoginValues) => {
    try {
      const result = await login(values).unwrap();
      if (result.success) {
        const { token, user } = result.data;
        dispatch(loginSuccess({ user, token }));
        setSuccessMsg(t('auth.login.success'));
        navigate('/home');
      }
    } catch (error) {
      logger('error', error, 'Login.tsx.handleLogin', 'Web');
      setErrorMsg(error.data.message);
    }
  };

  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>,
  ) => {
    await handleLogin(values);
    setSubmitting(false);
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const rightIcon = (
    <IconButton
      onClick={togglePasswordVisibility}
      onMouseDown={(e) => e.preventDefault()}
      edge="end"
    >
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  );


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
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form style={{ width: '350px' }}>
              <Grid
                container
                spacing={2}
                direction="column"
                justifyContent="center"
              >
                <Grid size={{ xs: 12 }}>
                  <InputAtom
                    name="email"
                    type="email"
                    variant="underlined"
                    label={t('auth.login.email')}
                    placeholder={t('auth.login.email')}
                    errorMsg={errors.email || errorMsg}
                    fullWidth
                    sx={{ width: '100%', maxWidth: '328px' }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <InputAtom
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    variant="underlined"
                    label={t('auth.login.password')}
                    placeholder={t('auth.login.password')}
                    errorMsg={errors.password || errorMsg}
                    rightIcon={rightIcon}
                    fullWidth
                    sx={{ width: '100%', maxWidth: '328px' }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {(errorMsg || successMsg) && (
                    <Alert severity={errorMsg ? 'error' : 'success'}>
                      {errorMsg || successMsg}
                    </Alert>
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
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
                    {t('auth.login.title')}
                  </ButtonAtom>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <ButtonAtom
                    type="button"
                    variant="text"
                    fullWidth
                    onClick={() => navigate('/password-recovery')}
                    sx={{
                      width: '100%',
                      maxWidth: '328px',
                      textTransform: 'none',
                    }}
                  >
                    {t('auth.login.forgot_password')}
                  </ButtonAtom>
                </Grid>
                <Box sx={{ height: '45%' }} />
                <Box>
                  <FacebookLoginButton
                    onLoginSuccess={(data) => {
                      console.log('Facebook login success:', data);
                      dispatch(loginSuccess(data));
                      navigate('/home');
                    }}
                    onLoginFailure={(err) => {
                      console.error('Facebook login failed:', err);
                      setErrorMsg(t('auth.login.facebook_error'));
                    }
                    }
                  />
                </Box>
                <Grid size={{ xs: 12 }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <TextAtom
                    variant="body"
                    size="small"
                    sx={{
                      textAlign: 'center',
                      textTransform: 'none',
                      fontSize: 'inherit',
                    }}
                  >
                    {t('auth.login.dont_have_account')}
                    <ButtonAtom
                      type="button"
                      variant="text"
                      disabled={isSubmitting || isLoading}
                      onClick={() => navigate('/register')}
                      sx={{ ml: 1, textTransform: 'none', fontSize: 'inherit' }}
                    >
                      {t('auth.login.register')}
                    </ButtonAtom>
                  </TextAtom>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
