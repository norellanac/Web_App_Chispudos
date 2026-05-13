import { Box, Grid2 } from '@mui/material';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import * as Yup from 'yup';
import { ButtonAtom, InputAtom, TextAtom } from '../../../../components/atoms';

const validationSchema = Yup.object({
  username: Yup.string()
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    )
    .required('Username is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const LandingForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
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
        {t('auth.slider_intro.title_1')}
      </TextAtom>
      <TextAtom
        variant="headline"
        size="medium"
        sx={{
          mb: 2,
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          letterSpacing: '0.5px',
        }}
      >
        {t('auth.initialTitle')}
      </TextAtom>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            navigate('/home');
          } catch {
            setFieldError('username', t('loginScreen.errorOccurred'));
            setFieldError('password', t('loginScreen.errorOccurred'));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, touched, errors }) => (
          <Grid2 container spacing={5}>
            <Grid2 size={{ xs: 6, sm: 6, md: 12 }}>
              <InputAtom
                name="username"
                variant="outlined"
                label={t('auth.login.email')}
                placeholder={t('auth.login.email')}
                leftIcon={<AccountCircleIcon />}
                error={touched.username && !!errors.username}
                helperText={errors.username}
                sx={{ my: 4 }}
              />
              <InputAtom
                name="username"
                variant="outlined"
                label={t('auth.login.email')}
                placeholder={t('auth.login.email')}
                error={touched.username && !!errors.username}
                helperText={errors.username}
              />
            </Grid2>
            <Grid2 size={{ xs: 6, sm: 6, md: 12 }}>
              <InputAtom
                name="password"
                type="password"
                variant="outlined"
                label={t('auth.login.password')}
                placeholder={t('auth.login.password')}
                error={touched.password && !!errors.password}
                helperText={errors.password}
              />
              <ButtonAtom
                type="submit"
                variant="filled"
                fullWidth
                disabled={isSubmitting}
                onClick={() => console.log('Button clicked!')}
                sx={{
                  mt: 2,
                  width: '100%',
                  maxWidth: '328px',
                  textTransform: 'none',
                }}
              >
                {t('auth.login.title')}
              </ButtonAtom>
            </Grid2>
          </Grid2>
        )}
      </Formik>
    </Box>
  );
};
