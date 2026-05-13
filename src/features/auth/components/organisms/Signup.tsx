import React, { useCallback, useState } from 'react';
import {
  Box,
  Container,
  IconButton,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Form, Formik, FormikHelpers, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ButtonAtom, InputAtom, TextAtom } from '../../../../components/atoms';
import { logger } from '../../../../utils/logger';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AppLogo from '../../../../components/molecules/AppLogo';
import { useSignupMutation, useLoginMutation } from '../../../../services/authApi';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { loginSuccess } from '../../../../redux/slices/authSlice';
import { useBranding } from '../../../../hooks/useBranding';

const DIAL_CODES = [
  { code: '+502', label: '🇬🇹 +502 Guatemala' },
  { code: '+1',   label: '🇺🇸 +1 USA / Canada' },
  { code: '+52',  label: '🇲🇽 +52 Mexico' },
  { code: '+503', label: '🇸🇻 +503 El Salvador' },
  { code: '+504', label: '🇭🇳 +504 Honduras' },
  { code: '+505', label: '🇳🇮 +505 Nicaragua' },
  { code: '+506', label: '🇨🇷 +506 Costa Rica' },
  { code: '+507', label: '🇵🇦 +507 Panama' },
  { code: '+57',  label: '🇨🇴 +57 Colombia' },
  { code: '+58',  label: '🇻🇪 +58 Venezuela' },
  { code: '+54',  label: '🇦🇷 +54 Argentina' },
  { code: '+55',  label: '🇧🇷 +55 Brazil' },
  { code: '+56',  label: '🇨🇱 +56 Chile' },
  { code: '+34',  label: '🇪🇸 +34 Spain' },
  { code: '+44',  label: '🇬🇧 +44 UK' },
  { code: '+49',  label: '🇩🇪 +49 Germany' },
];

type LoginMethod = 'email' | 'phone';

type SignupValues = {
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  isMerchant: boolean;
  acceptTerms: boolean;
};

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [dialCode, setDialCode] = useState('+502');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { t } = useTranslation();
  const [onSignup] = useSignupMutation();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { config } = useBranding();

  const validationSchema = Yup.object({
    email: loginMethod === 'email'
      ? Yup.string().email(t('forms.commons.email')).required(t('forms.commons.required'))
      : Yup.string(),
    phoneNumber: loginMethod === 'phone'
      ? Yup.string().min(6, t('forms.commons.min_length', { min: 6 })).required(t('forms.commons.required'))
      : Yup.string(),
    password: Yup.string().min(6, t('forms.commons.min_length', { min: 6 })).required(t('forms.commons.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], t('auth.register.passwords_must_match', 'Passwords must match'))
      .required(t('forms.commons.required')),
    acceptTerms: Yup.boolean().oneOf([true], t('auth.register.accept_terms_required', 'You must accept the terms')),
  });

  const togglePasswordVisibility = useCallback(() => setShowPassword((p) => !p), []);
  const rightIcon = (
    <IconButton onClick={togglePasswordVisibility} onMouseDown={(e) => e.preventDefault()} edge="end">
      {showPassword ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  );

  const handleLogin = async (credential: { email?: string; phone?: string }, password: string) => {
    try {
      const result = await login({ ...credential, password } as any).unwrap();
      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;
        dispatch(loginSuccess({ user, accessToken, refreshToken }));
        navigate('/home');
      }
    } catch (error: any) {
      logger('error', error, 'Signup.handleLogin', 'Web');
      setErrorMsg(error?.data?.message || t('auth.login.error'));
    }
  };

  const handleSignup = async (values: SignupValues) => {
    setErrorMsg('');
    try {
      const credential = loginMethod === 'email'
        ? { email: values.email.trim() }
        : { phone: `${dialCode}${values.phoneNumber.trim()}` };

      const signupResponse = await onSignup({
        ...credential,
        password: values.password,
        isMerchant: values.isMerchant,
      } as any).unwrap();

      if (signupResponse.success) {
        setSuccessMsg(t('auth.register.signup_success', 'Account created!'));
        await handleLogin(credential, values.password);
      } else {
        setErrorMsg((signupResponse as any).message);
      }
    } catch (error: any) {
      logger('error', error, 'Signup.handleSignup', 'Web');
      const msg = error?.data?.errors?.[0] || error?.data?.message || t('auth.register.error');
      setErrorMsg(msg);
    }
  };

  const handleSubmit = async (values: SignupValues, { setSubmitting }: FormikHelpers<SignupValues>) => {
    await handleSignup(values);
    setSubmitting(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#FFF', padding: 0 }}
    >
      <Box sx={{ width: '100%', maxWidth: '483px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 2 }}>
        <Box sx={{ mb: 3 }}>
          <AppLogo maxWidth="200px" />
        </Box>

        <Formik
          initialValues={{ email: '', phoneNumber: '', password: '', confirmPassword: '', isMerchant: false, acceptTerms: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, values, setFieldValue }) => (
            <Form style={{ width: '350px' }}>
              <Grid container spacing={2} direction="column">

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
                      {t('auth.register.email_toggle', 'Email')}
                    </ToggleButton>
                    <ToggleButton value="phone" sx={{ textTransform: 'none', flex: 1 }}>
                      {t('auth.register.phone_toggle', 'Phone')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>

                {loginMethod === 'email' ? (
                  <Grid size={{ xs: 12 }}>
                    <InputAtom
                      name="email"
                      type="email"
                      autoComplete="email"
                      variant="underlined"
                      label={t('auth.register.emailLabel', 'Email')}
                      placeholder={t('auth.register.emailLabel', 'Email')}
                      errorMsg={errors.email}
                      fullWidth
                      sx={{ width: '100%', maxWidth: '328px' }}
                    />
                  </Grid>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>{t('auth.register.dial_code', 'Code')}</InputLabel>
                        <Select
                          value={dialCode}
                          label={t('auth.register.dial_code', 'Code')}
                          onChange={(e) => setDialCode(e.target.value)}
                          MenuProps={{ PaperProps: { style: { maxHeight: 240 } } }}
                        >
                          {DIAL_CODES.map((d) => (
                            <MenuItem key={d.code} value={d.code}>{d.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <InputAtom
                        name="phoneNumber"
                        type="tel"
                        variant="underlined"
                        label={t('auth.register.phoneLabel', 'Phone number')}
                        placeholder="1234 5678"
                        errorMsg={errors.phoneNumber}
                        fullWidth
                      />
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <InputAtom
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    rightIcon={rightIcon}
                    variant="underlined"
                    label={t('auth.register.passwordLabel', 'Password')}
                    placeholder={t('auth.register.passwordLabel', 'Password')}
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
                    label={t('auth.register.confirmPasswordLabel', 'Confirm password')}
                    placeholder={t('auth.register.confirmPasswordLabel', 'Confirm password')}
                    errorMsg={errors.confirmPassword}
                    fullWidth
                    sx={{ width: '100%', maxWidth: '328px' }}
                  />
                </Grid>

                {/* Merchant toggle */}
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.isMerchant}
                        onChange={(e) => setFieldValue('isMerchant', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {t('auth.register.merchant_toggle', 'I want to offer services')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('auth.register.merchant_description', 'You will be able to publish your services and receive orders')}
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', mt: 1 }}
                  />
                </Grid>

                {/* Terms */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
                    <Field type="checkbox" name="acceptTerms" style={{ marginRight: 8 }} />
                    <TextAtom variant="body" size="medium">
                      {t('auth.register.accept_terms_prefix', 'I agree to the')}
                    </TextAtom>
                    <a
                      href={config?.termsUrl || '/terms-and-conditions.html'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <ButtonAtom
                        type="button"
                        variant="text"
                        sx={{ textTransform: 'none', p: 0.5, minWidth: 'auto' }}
                      >
                        {t('auth.register.terms_of_service', 'Terms')}
                      </ButtonAtom>
                    </a>
                    <TextAtom variant="body" size="medium" sx={{ mx: 0.5 }}>
                      {t('auth.register.and', 'and')}
                    </TextAtom>
                    <a
                      href={config?.privacyUrl || '/privacy-policy.html'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      <ButtonAtom
                        type="button"
                        variant="text"
                        sx={{ textTransform: 'none', p: 0.5, minWidth: 'auto' }}
                      >
                        {t('auth.register.privacy_policy', 'Privacy Policy')}
                      </ButtonAtom>
                    </a>
                  </Box>
                  {errors.acceptTerms && (
                    <TextAtom variant="body" size="small" sx={{ color: 'error.main', textAlign: 'center', display: 'block' }}>
                      {errors.acceptTerms}
                    </TextAtom>
                  )}
                </Grid>

                {(errorMsg || successMsg) && (
                  <Grid size={{ xs: 12 }}>
                    <Alert severity={errorMsg ? 'error' : 'success'}>{errorMsg || successMsg}</Alert>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <ButtonAtom type="submit" variant="filled" fullWidth disabled={isSubmitting} sx={{ mt: 1, width: '100%', maxWidth: '328px', textTransform: 'none' }}>
                    {t('auth.register.signup_title_button', 'Create account')}
                  </ButtonAtom>
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <TextAtom variant="body" size="small" sx={{ textAlign: 'center' }}>
                    {t('auth.register.have_an_account', 'Already have an account?')}
                    <ButtonAtom type="button" variant="text" onClick={() => navigate('/login')} sx={{ ml: 1, textTransform: 'none', fontSize: 'inherit' }}>
                      {t('auth.register.login_title_button', 'Log in')}
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
