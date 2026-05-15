import React, { useState } from 'react';
import { List, ListItem, TextField, Alert, Snackbar, useTheme, Paper, FormControl, InputLabel, Select, MenuItem, Box, Chip } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutIcon from '@mui/icons-material/Logout';
import Grid from '@mui/material/Grid2';
import { ButtonAtom, TextAtom } from '../../../../components/atoms';
import {
  selectAuth,
} from '../../../../redux/slices/authSlice';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAvatarUpload } from '../../../../hooks/useAvatarUpload';
import { ModalComponent } from '../../../../components/molecules';
import AvatarUpload from '../organisms/AvatarUpload';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHasRole } from '../../../../hooks/useHasRole';
import { useUserEvents } from '../../../auth/hooks/authHooks';
import { DIAL_CODES } from '../../../../utils/dialCodes';
import EditIcon from '@mui/icons-material/Edit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d[\d\s\-().]{3,}$/;

export const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { logoutUser, handleUpdateUserInfo } = useUserEvents();
  const { user } = useAppSelector(selectAuth);
  const navigate = useNavigate();

  const isMerchant = useHasRole('Merchant');

  // Edit profile modal state
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dialCode, setDialCode] = useState('+502');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  // Avatar modal state
  const [modalOpen, setModalOpen] = useState(false);
  const {
    selectedImage,
    previewImage,
    errorMsg,
    isUploading,
    handleImageChange,
    handleSaveImage,
  } = useAvatarUpload({ userId: user?.id?.toString() || '' });

  const handleCloseModal = () => setModalOpen(false);
  const handleSaveAvatarClick = async () => {
    if (selectedImage) {
      await handleSaveImage();
      handleCloseModal();
    }
  };

  const handleOpenEditProfileModal = () => {
    setName(user?.name || '');
    setLastname(user?.lastname || '');
    setEmail(user?.email || '');
    const rawPhone = user?.phone || '';
    const matched = DIAL_CODES.find((d) => rawPhone.startsWith(d.code));
    if (matched) {
      setDialCode(matched.code);
      setPhone(rawPhone.slice(matched.code.length));
    } else {
      setDialCode('+502');
      setPhone(rawPhone);
    }
    setFieldErrors({});
    setSubmitError('');
    setEditProfileModalOpen(true);
  };
  const handleCloseEditProfileModal = () => setEditProfileModalOpen(false);

  const validateFields = (): boolean => {
    const errors: Record<string, string> = {};

    if (email && !EMAIL_REGEX.test(email)) {
      errors.email = t('userProfile.emailInvalid', 'Invalid email format');
    }
    if (phone && !PHONE_REGEX.test(phone)) {
      errors.phone = t('userProfile.phoneInvalid', 'Invalid phone format');
    }
    if (!email.trim() && !phone.trim()) {
      errors.email = t('userProfile.emailPhoneRequired', 'At least email or phone is required');
      errors.phone = t('userProfile.emailPhoneRequired', 'At least email or phone is required');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateFields()) return;
    setSubmitError('');
    try {
      await handleUpdateUserInfo({
        name: name.trim() || null,
        lastname: lastname.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() ? `${dialCode}${phone.trim()}` : null,
      });
      setSuccessOpen(true);
      handleCloseEditProfileModal();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string }; message?: string };
      const msg =
        apiErr?.data?.message ||
        apiErr?.message ||
        t('userProfile.updateError', 'Failed to update profile');
      setSubmitError(msg);
    }
  };


  return (
    <>
    <Grid
      container
      spacing={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        mb: 12,
      }}
    >
      {/* Avatar section */}
      <Grid size={{ xs: 10, md: 8, lg: 6, xl: 5 }} sx={{ mt: { xs: 3, sm: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Box
            sx={{
              height: 80,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -7, pb: 3, px: 2 }}>
            <AvatarUpload
              previewImage={previewImage}
              userAvatarUrl={user?.avatarUrl || ''}
              name={user?.name || ''}
              lastname={user?.lastname || ''}
              handleImageChange={(e) => { handleImageChange(e); setModalOpen(true); }}
              errorMsg={errorMsg}
            />
            <TextAtom variant="headline" size="small" sx={{ mt: 1, fontWeight: 700 }}>
              {user?.name || 'Name'} {user?.lastname || 'Lastname'}
            </TextAtom>
            <Chip
              label={isMerchant ? t('userProfile.roleMerchant', 'Professional') : t('userProfile.roleUser', 'User')}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mt: 1, fontWeight: 600 }}
            />
            <ButtonAtom
              variant="text"
              endIcon={<EditIcon fontSize="small" />}
              sx={{ mt: 1.5, textTransform: 'none', color: theme.palette.text.secondary, width: '30%' }}
              onClick={handleOpenEditProfileModal}
            >
              {t('userProfile.editProfile', 'Edit Profile')}
            </ButtonAtom>
          </Box>
        </Paper>

        <ModalComponent
          open={modalOpen}
          onClose={handleCloseModal}
          title={t('userProfile.changeProfilePhoto', 'Change profile photo')}
          onConfirm={handleSaveAvatarClick}
          confirmButtonText={t('userProfile.updateButton', 'Update')}
          isConfirmButtonLoading={isUploading}
        >
          <AvatarUpload
            previewImage={previewImage}
            userAvatarUrl={user?.avatarUrl || ''}
            name={user?.name || ''}
            lastname={user?.lastname || ''}
            handleImageChange={handleImageChange}
            errorMsg={errorMsg}
          />
        </ModalComponent>

        <ModalComponent
          open={editProfileModalOpen}
          onClose={handleCloseEditProfileModal}
          title={t('userProfile.editProfileTitle', 'Edit Profile')}
          onConfirm={handleSaveProfile}
          confirmButtonText={t('userProfile.save', 'Save')}
        >
          <TextField
            label={t('userProfile.name', 'Name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label={t('userProfile.lastname', 'Lastname')}
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label={t('userProfile.email', 'Email')}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: '' }));
            }}
            fullWidth
            margin="dense"
            type="email"
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', mt: 1 }}>
            <FormControl size="small" sx={{ minWidth: 110, mb: '3px' }}>
              <InputLabel>{t('auth.login.dial_code', 'Code')}</InputLabel>
              <Select
                value={dialCode}
                label={t('auth.login.dial_code', 'Code')}
                onChange={(e) => setDialCode(e.target.value)}
                MenuProps={{ PaperProps: { style: { maxHeight: 240 } } }}
              >
                {DIAL_CODES.map((d) => (
                  <MenuItem key={d.code} value={d.code}>{d.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t('userProfile.phone', 'Phone')}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setFieldErrors((prev) => ({ ...prev, phone: '' }));
              }}
              fullWidth
              type="tel"
              error={!!fieldErrors.phone}
              helperText={fieldErrors.phone}
            />
          </Box>
          {submitError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {submitError}
            </Alert>
          )}
        </ModalComponent>
      </Grid>

      {/* Profile info list */}
      <Grid size={{ xs: 10, md: 8, lg: 6, xl: 5 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
        <List sx={{ width: '100%' }}>
          <ListItem
            disablePadding
            sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <ButtonAtom
              variant="text"
              fullWidth
              onClick={handleOpenEditProfileModal}
              sx={{
                height: '50px',
                justifyContent: 'space-between',
                textTransform: 'none',
                borderRadius: '0',
              }}
            >
              <TextAtom variant="title" size="medium">
                {t('userProfile.email', 'Email')}
              </TextAtom>
              <TextAtom variant="title" size="medium" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                {user?.email || '—'}
              </TextAtom>
            </ButtonAtom>
          </ListItem>
          <ListItem
            disablePadding
            sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <ButtonAtom
              variant="text"
              fullWidth
              onClick={handleOpenEditProfileModal}
              sx={{
                height: '50px',
                justifyContent: 'space-between',
                textTransform: 'none',
                borderRadius: '0',
              }}
            >
              <TextAtom variant="title" size="medium">
                {t('userProfile.phone', 'Phone')}
              </TextAtom>
              <TextAtom variant="title" size="medium" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                {user?.phone || 'Not provided'}
              </TextAtom>
            </ButtonAtom>
          </ListItem>
          <ListItem
            disablePadding
          >
            <ButtonAtom
              onClick={() => navigate('/password-recovery')}
              variant="text"
              fullWidth
              sx={{
                height: '50px',
                justifyContent: 'space-between',
                textTransform: 'none',
              }}
            >
              <TextAtom variant="title" size="medium">
                {t('userProfile.changePassword', 'Change password')}
              </TextAtom>
              <ArrowForwardIosIcon
                fontSize="small"
                sx={{ color: 'primary.main' }}
              />
            </ButtonAtom>
          </ListItem>
        </List>
        </Paper>
      </Grid>

      {/* Action buttons */}
      <Grid
        size={{ xs: 10, md: 8, lg: 6, xl: 5 }}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-end' },
          gap: 2,
          mt: { xs: 4, sm: 4 },
          mb: { xs: 4, sm: 4 },
          textAlign: { xs: 'center', sm: 'right' },
        }}
      >
        <ButtonAtom
          variant="outlined"
          onClick={() => handleUpdateUserInfo({roles: isMerchant ? [2] : [2, 3]})}
          sx={{
            fontWeight: 'bold',
            mb: 2,
            mx: { xs: 'auto', sm: 0 },
            width: { xs: '100%', sm: '300px' },
          }}
        >
          <TextAtom
            variant="title"
            size="medium"
            sx={{ cursor: 'pointer', textTransform: 'none' }}
          >
            {isMerchant
              ? t('userProfile.switchToUser', 'Switch to User')
              : t('userProfile.switchToMerchant', 'Become a Professional')}
          </TextAtom>
        </ButtonAtom>

        <ButtonAtom
          variant="filled"
          startIcon={<LogoutIcon fontSize="small" />}
          onClick={logoutUser}
          sx={{
            fontWeight: 'bold',
            mb: 2,
            mx: { xs: 'auto', sm: 0 },
            width: { xs: '100%', sm: '200px' },
          }}
        >
          <TextAtom
            variant="title"
            size="medium"
            sx={{ cursor: 'pointer', textTransform: 'none' }}
          >
            {t('userProfile.logout', 'Sign out')}
          </TextAtom>
        </ButtonAtom>
      </Grid>
    </Grid>

    <Snackbar
      open={successOpen}
      autoHideDuration={3000}
      onClose={() => setSuccessOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="success" onClose={() => setSuccessOpen(false)}>
        {t('userProfile.updateSuccess', 'Profile updated successfully')}
      </Alert>
    </Snackbar>
    </>
  );
};

export default UserProfile;
