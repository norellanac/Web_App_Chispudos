import React, { useState } from 'react';
import { List, ListItem, TextField } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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

export const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  // const dispatch = useAppDispatch();
  const { logoutUser, handleUpdateUserInfo } = useUserEvents();
  const { user } = useAppSelector(selectAuth);
  const navigate = useNavigate();

  const isMerchant = useHasRole('Merchant');

  const [editNameModalOpen, setEditNameModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [lastname, setLastname] = useState(user?.lastname || '');

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
  const handleSaveClick = async () => {
    if (selectedImage) {
      await handleSaveImage();
      handleCloseModal();
    }
  };

  const handleOpenEditNameModal = () => setEditNameModalOpen(true);
  const handleCloseEditNameModal = () => setEditNameModalOpen(false);


  return (
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
      <Grid
        size={{ xs: 12, md: 6, lg: 4, xl: 3 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: { xs: 4, sm: 6 },
          mt: { xs: 4, sm: 6 },
        }}
      >
        <AvatarUpload
          previewImage={previewImage}
          userAvatarUrl={user?.avatarUrl || ''}
          handleImageChange={(e) => {
            handleImageChange(e);
            setModalOpen(true);
          }}
          errorMsg={errorMsg}
        />
        <ModalComponent
          open={modalOpen}
          onClose={handleCloseModal}
          title={t('userProfile.changeProfilePhoto', 'Change profile photo')}
          onConfirm={handleSaveClick}
          confirmButtonText={t('userProfile.updateButton', 'Update')}
          isConfirmButtonLoading={isUploading}
        >
          <AvatarUpload
            previewImage={previewImage}
            userAvatarUrl={user?.avatarUrl || ''}
            handleImageChange={handleImageChange}
            errorMsg={errorMsg}
          />
        </ModalComponent>
        <TextAtom variant="title" size="large">
          {user?.name || 'Name'} {user?.lastname || 'Lastname'}
        </TextAtom>
        <ButtonAtom
          variant="text"
          sx={{ mt: 1, textTransform: 'none' }}
          onClick={handleOpenEditNameModal}
        >
          {t('userProfile.editName', 'Edit Name')}
        </ButtonAtom>
        <ModalComponent
          open={editNameModalOpen}
          onClose={handleCloseEditNameModal}
          title={t('userProfile.editNameTitle', 'Edit Name')}
          onConfirm={() => handleUpdateUserInfo({name, lastname})}
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
        </ModalComponent>
      </Grid>

      <Grid size={{ xs: 12, md: 8, lg: 6, xl: 5 }}>
        <List sx={{ width: '100%' }}>
          <ListItem disablePadding>
            <ButtonAtom
              variant="text"
              fullWidth
              sx={{
                height: '50px',
                justifyContent: 'space-between',
                textTransform: 'none',
                borderRadius: '0',
                borderBottom: '1px solid rgb(226, 226, 230)',
              }}
            >
              <TextAtom variant="title" size="medium">
                {t('userProfile.email', 'Email')}
              </TextAtom>
              <TextAtom variant="title" size="medium">
                {user?.email || 'email'}
              </TextAtom>
            </ButtonAtom>
          </ListItem>
          {['Cambiar contraseña'].map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{ borderBottom: '1px solid rgb(226, 226, 230)' }}
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
                  sx={{ color: '#6750A4' }}
                />
              </ButtonAtom>
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid
        size={{ xs: 12, md: 8, lg: 6, xl: 5 }}
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
            mr: 2,
            mb: 2,
            mx: { xs: 'auto', sm: 0 },
            width: { xs: '75%', sm: '200px' },
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
          onClick={logoutUser}
          sx={{
            fontWeight: 'bold',
            mb: 2,
            mx: { xs: 'auto', sm: 0 },
            width: { xs: '75%', sm: '200px' },
          }}
        >
          <TextAtom
            variant="title"
            size="medium"
            sx={{ cursor: 'pointer', textTransform: 'none', mr: 3, ml: 3 }}
          >
            {t('userProfile.logout', 'Logout')}
          </TextAtom>
        </ButtonAtom>
      </Grid>
    </Grid>
  );
};

export default UserProfile;
