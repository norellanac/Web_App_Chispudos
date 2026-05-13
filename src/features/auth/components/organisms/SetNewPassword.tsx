import React, { useCallback, useState } from 'react';
import { Box, Container, Grid, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ButtonAtom, InputAtom, TextAtom } from '../../../../components/atoms';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { logger } from '../../../../utils/logger';
import AppLogo from '../../../../components/molecules/AppLogo';
import { useUpdatePasswordMutation } from '../../../../services/authApi';

interface SetNewPasswordProps {
  otp: string;
  onSuccess: () => void;
}

const SetNewPassword: React.FC<SetNewPasswordProps> = ({ otp, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [updatePassword] = useUpdatePasswordMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  console.warn({ otp });

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, t('forms.commons.min_length', { min: 6 }))
      .required(t('forms.commons.required')),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('newPassword'), null],
        t('forms.commons.passwords_must_match'),
      )
      .required(t('forms.commons.required')),
  });

  const handleSubmit = async (
    values: { newPassword: string; confirmPassword: string },
    {
      setSubmitting,
    }: FormikHelpers<{ newPassword: string; confirmPassword: string }>,
  ) => {
    try {
      await updatePassword({ otp, newPassword: values.newPassword }).unwrap();
      onSuccess();
    } catch (error) {
      logger('error', error, 'SetNewPassword.tsx.handleSubmit', 'Web');
      setErrorMsg(t('auth.error.updating_password'));
    }
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
        <Formik
          initialValues={{ newPassword: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form style={{ width: '350px' }}>
              <IconButton
                sx={{
                  alignSelf: 'flex-start',
                  marginBottom: '20px',
                  bgcolor: '#f5f5f5',
                }}
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
                  <TextAtom
                    variant="title"
                    size="large"
                    sx={{
                      textAlign: 'left',
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    {t('auth.SetNewPass.title')}
                  </TextAtom>
                  <Box>
                    <TextAtom
                      variant="body"
                      size="medium"
                      sx={{
                        textAlign: 'left',
                        textTransform: 'none',
                      }}
                    >
                      {t('auth.SetNewPass.body')}
                    </TextAtom>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <InputAtom
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    label={t('auth.SetNewPass.placeholder1')}
                    errorMsg={errors.newPassword || errorMsg}
                    rightIcon={rightIcon}
                    fullWidth
                    sx={{ marginTop: '20px', width: '100%', maxWidth: '328px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputAtom
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    label={t('auth.SetNewPass.placeholder2')}
                    errorMsg={errors.confirmPassword || errorMsg}
                    rightIcon={rightIcon}
                    fullWidth
                    sx={{ width: '100%', maxWidth: '328px' }}
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
                    {t('auth.SetNewPass.update')}
                  </ButtonAtom>
                </Grid>
                <Box sx={{ height: '191px' }} />
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default SetNewPassword;
