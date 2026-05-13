import React, { useCallback, useState } from 'react';
import { Box, Container, IconButton, Alert, ToggleButton, ToggleButtonGroup, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ButtonAtom, InputAtom, TextAtom } from '../../../../components/atoms';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { logger } from '../../../../utils/logger';
import { loginSuccess } from '../../../../redux/slices/authSlice';
import AppLogo from '../../../../components/molecules/AppLogo';
import { useLoginMutation } from '../../../../services/authApi';

const DIAL_CODES = [
  { code: '+502', label: '🇬🇹 +502' }, { code: '+1', label: '🇺🇸 +1' },
  { code: '+52', label: '🇲🇽 +52' },  { code: '+503', label: '🇸🇻 +503' },
  { code: '+504', label: '🇭🇳 +504' }, { code: '+505', label: '🇳🇮 +505' },
  { code: '+506', label: '🇨🇷 +506' }, { code: '+507', label: '🇵🇦 +507' },
  { code: '+57', label: '🇨🇴 +57' },  { code: '+54', label: '🇦🇷 +54' },
  { code: '+55', label: '🇧🇷 +55' },  { code: '+56', label: '🇨🇱 +56' },
  { code: '+34', label: '🇪🇸 +34' },  { code: '+44', label: '🇬🇧 +44' },
];

type LoginMethod = 'email' | 'phone';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [dialCode, setDialCode] = useState('+502');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validationSchema = Yup.object({
    email: loginMethod === 'email'
      ? Yup.string().email(t('forms.commons.email')).required(t('forms.commons.required'))
      : Yup.string(),
    phoneNumber: loginMethod === 'phone'
      ? Yup.string().min(6).required(t('forms.commons.required'))
      : Yup.string(),
    password: Yup.string()
      .min(6, t('forms.commons.min_length', { min: 6 }))
      .required(t('forms.commons.required')),
  });

  const handleLogin = async (values: any) => {
    try {
      const credential = loginMethod === 'email'
        ? { email: values.email }
        : { phone: `${dialCode}${values.phoneNumber}` };
      const result = await login({ ...credential, password: values.password } as any).unwrap();
      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;
        dispatch(loginSuccess({ user, accessToken, refreshToken }));
        setSuccessMsg(t('auth.login.success'));
        navigate('/home');
      }
    } catch (error: any) {
      logger('error', error, 'Login.tsx.handleLogin', 'Web');
      setErrorMsg(error?.data?.message || t('auth.login.error', 'Login failed'));
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
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
          initialValues={{ email: '', phoneNumber: '', password: '' }}
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
                {/* Email / Phone toggle */}
                <Grid size={{ xs: 12 }}>
                  <ToggleButtonGroup
                    value={loginMethod}
                    exclusive
                    onChange={(_, v) => { if (v) setLoginMethod(v); }}
                    size="small"
                    fullWidth
                  >
                    <ToggleButton value="email" sx={{ textTransform: 'none', flex: 1 }}>
                      {t('auth.login.email_toggle', 'Email')}
                    </ToggleButton>
                    <ToggleButton value="phone" sx={{ textTransform: 'none', flex: 1 }}>
                      {t('auth.login.phone_toggle', 'Phone')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>

                {loginMethod === 'email' ? (
                  <Grid size={{ xs: 12 }}>
                    <InputAtom
                      name="email"
                      type="email"
                      variant="underlined"
                      label={t('auth.login.email')}
                      placeholder={t('auth.login.email')}
                      errorMsg={errors.email}
                      fullWidth
                      sx={{ width: '100%', maxWidth: '328px' }}
                    />
                  </Grid>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>{t('auth.login.dial_code', 'Code')}</InputLabel>
                        <Select value={dialCode} label={t('auth.login.dial_code', 'Code')} onChange={(e) => setDialCode(e.target.value)} MenuProps={{ PaperProps: { style: { maxHeight: 240 } } }}>
                          {DIAL_CODES.map((d) => <MenuItem key={d.code} value={d.code}>{d.label}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <InputAtom
                        name="phoneNumber"
                        type="tel"
                        variant="underlined"
                        label={t('auth.login.phone', 'Phone number')}
                        placeholder="1234 5678"
                        errorMsg={(errors as any).phoneNumber}
                        fullWidth
                      />
                    </Box>
                  </Grid>
                )}

                <Grid size={{xs: 12}}>
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
                <Grid size={{xs: 12}}>
                  {(errorMsg || successMsg) && (
                    <Alert severity={errorMsg ? 'error' : 'success'}>
                      {errorMsg || successMsg}
                    </Alert>
                  )}
                </Grid>
                <Grid size={{xs: 12}}>
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
                <Grid size={{xs: 12}}>
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
                <Box sx={{ height: '191px' }} />
                <Grid size={{xs: 12}}
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
