import React, { useCallback, useState } from 'react';
import { Box, Container, IconButton, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Form, Formik, FormikHelpers, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ButtonAtom, InputAtom, TextAtom } from '../../../../components/atoms';
import { logger } from '../../../../utils/logger';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AppLogo from '../../../../components/molecules/AppLogo';
import { useSignupMutation } from '../../../../services/authApi';
import { useLoginMutation } from '../../../../services/authApi';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { loginSuccess } from '../../../../redux/slices/authSlice';
import FacebookLoginButton from './FacebookLoginButton';

type SignupValues = {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { t } = useTranslation();
  const [onSignup] = useSignupMutation();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('forms.commons.email'))
      .required(t('forms.commons.required')),
    password: Yup.string()
      .min(6, t('forms.commons.min_length', { min: 6 }))
      .required(t('forms.commons.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required(t('forms.commons.required')),
    acceptTerms: Yup.boolean().oneOf(
      [true],
      'Debes aceptar los términos y condiciones',
    ),
  });

  const handleLogin = async (values: SignupValues) => {
    try {
      const result = await login(values).unwrap();
      if (result.success) {
        const { token, user } = result.data;
        dispatch(loginSuccess({ user, token }));
        setSuccessMsg(t('auth.login.success'));
        navigate('/home');
      } else {
        setErrorMsg(result.message);
      }
    } catch (error) {
      logger('error', error, 'Login.tsx.handleLogin', 'Web');
      setErrorMsg(error.data.message);
    }
  };

  const handleSignup = async (values: SignupValues) => {
    try {
      const signupResponse = await onSignup(values).unwrap();
      setSuccessMsg(t('auth.register.signup_success'));
      if (signupResponse.success) {
        handleLogin(values);
      }
    } catch (error) {
      logger('error', error, 'Signup.tsx.handleSignup', 'Web');
      setErrorMsg(error.data.message);
    }
  };

  const handleSubmit = async (
    values: SignupValues,
    { setSubmitting }: FormikHelpers<SignupValues>,
  ) => {
    await handleSignup(values);
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
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
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
                    autoComplete="email"
                    variant="underlined"
                    label={t('auth.register.emailLabel')}
                    placeholder={t('auth.register.emailLabel')}
                    errorMsg={errors.email}
                    fullWidth
                    sx={{ width: '100%', maxWidth: '328px' }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <InputAtom
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    rightIcon={rightIcon}
                    variant="underlined"
                    label={t('auth.register.passwordLabel')}
                    placeholder={t('auth.register.passwordLabel')}
                    errorMsg={errors.password}
                    fullWidth
                    sx={{ width: '100%', maxWidth: '328px' }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <InputAtom
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    rightIcon={rightIcon}
                    variant="underlined"
                    label={t('auth.register.confirmPasswordLabel')}
                    placeholder={t('auth.register.confirmPasswordLabel')}
                    errorMsg={errors.confirmPassword}
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
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    <Field
                      type="checkbox"
                      name="acceptTerms"
                      style={{ marginRight: 8 }}
                    />
                    <TextAtom variant="body" size="medium">
                      Acepto los
                      <ButtonAtom
                        type="button"
                        variant="text"
                        onClick={() => navigate('/terms-&-conditions')}
                        sx={{
                          textTransform: 'none',
                          p: 0.5,
                          ml: 0.5,
                          minWidth: 'auto',
                          display: 'inline',
                        }}
                      >

                        Términos y Condiciones
                      </ButtonAtom>
                    </TextAtom>
                  </Box>
                  {errors.acceptTerms && (
                    <Box sx={{ mt: 1 }}>
                      <TextAtom
                        variant="body"
                        size="small"
                        sx={{ color: 'error.main' }}
                      >
                        {errors.acceptTerms}
                      </TextAtom>
                    </Box>
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
                    {t('auth.register.signup_title_button')}
                  </ButtonAtom>
                </Grid>

                <Box sx={{ height: '45%' }} />
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
                <Grid
                  size={{ xs: 12 }}
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
                    {t('auth.register.have_an_account')}
                    <ButtonAtom
                      type="button"
                      variant="text"
                      onClick={() => navigate('/login')}
                      sx={{ ml: 1, textTransform: 'none', fontSize: 'inherit' }}
                    >
                      {t('auth.register.login_title_button')}
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

export default Signup;
