import { Avatar, Box, Grid, TextField, Typography } from '@mui/material';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import TextAtom from '../../../../components/atoms/TextAtom';
import { ChevronLeft, CalendarToday, AccessTime } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCreateOrderMutation } from '../../../../services/ordersApi';
import { useState } from 'react';
import { selectAuth } from '../../../../redux/slices/authSlice';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { ModalComponent } from '../../../../components/molecules';
import { getApiImageUrl } from '../../../../utils/baseEnvironment';

const TaskDetailInput = ({
  date,
  dateTime,
  time,
  userText,
  setUserText,
  service,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [createOrder] = useCreateOrderMutation();
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAppSelector(selectAuth);

  const handleConfirm = async () => {
    const body = {
      userId: user?.id,
      totalAmount: service.price,
      status: 1, //active /complted/ //cancel
      comment: 'This is a test order',
      startDate: dateTime,
      endDate: '2025-02-20T00:00:00.000Z',
      details: [
        {
          productServiceId: service.id,
          quantity: 1,
          price: service.price,
          discount: 0,
          charge: 0,
          comment: userText,
        },
      ],
    };
    await createOrder(body);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/tasks');
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: '#F3ECFF',
          paddingBottom: 2,
          width: '100vw',
          px: { xs: 3, sm: 20, md: 20 },
          pt: 4,
        }}
      >
        <Grid
          size={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ButtonAtom variant='text' onClick={() => navigate(-1)} aria-label="Go back" startIcon={<ChevronLeft />}>
              <TextAtom
                variant="body"
                size="large"
                marginLeft="0.5rem"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                Detalles
              </TextAtom>
            </ButtonAtom>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography fontWeight="bold">
              {service?.name || 'Servicio'}
            </Typography>
          </Box>
          <Box sx={{ width: 48 }} />
        </Grid>
      </Box>

      <Box sx={{ py: {sx: 8, sm: 8, md: 4 }, px: { xs: 3, sm: 20, md: 20 } }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={getApiImageUrl(service?.urlImage)}
                alt={service?.name}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px',
                }}
              />
              <TextAtom variant="title" size="medium">
                {service?.name || 'Servicio'}
              </TextAtom>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <TextAtom
                variant="title"
                size="large"
                sx={{ fontWeight: 'bold' }}
                gutterBottom
              >
                {t('services.serviceDetails.title')}
              </TextAtom>
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextAtom variant="body" size="large" gutterBottom>
                {t('services.serviceDetails.description')}
              </TextAtom>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextAtom
              variant="title"
              size="large"
              sx={{ fontWeight: 'bold' }}
              gutterBottom
            >
              {t('services.serviceDetails.time')}
            </TextAtom>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarToday sx={{ marginRight: 1 }} />
              <TextAtom variant="body" size="medium">
                {date}
              </TextAtom>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ marginRight: 1 }} />
              <TextAtom variant="body" size="medium">
                {time}
              </TextAtom>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {userText && (
        <Box
        sx={{ display: 'flex', alignItems: 'center', mx: {xs: 4, md:20, lg: 20}, my: 5 }}
      >
        <Avatar
          src={getApiImageUrl(user?.avatarUrl)}
          alt="User Profile"
          sx={{ width: 50, height: 50, marginRight: 2 }}
        />
        <Box
          sx={{
            backgroundColor: '#F9F5FF',
            borderRadius: '16px',
            padding: '1rem',
            maxWidth: '100%',
          }}
        >
          <TextAtom variant="body" size="medium" gutterBottom>
            {userText || t('services.serviceDetails.emptyMessage')}
          </TextAtom>
        </Box>
      </Box>
      )}

      <Grid item xs={12} md={12} sx={{ px: { xs: 3, sm: 20, md: 20 } }}>
        <TextField
          label={t('services.serviceDetails.label')}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          sx={{ marginY: '1rem' }}
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2,
            paddingBottom: 10,
          }}
        >
          <ButtonAtom
            variant="filled"
            color="primary"
            onClick={handleConfirm}
            disabled={!userText.trim()}
          >
            {t('services.serviceDetails.buttonInput')}
          </ButtonAtom>
        </Box>
      </Grid>
      <ModalComponent
        open={openModal}
        onConfirm={handleCloseModal}
        onClose={handleCloseModal}
        hideCancelbutton
        title={t('services.serviceDetails.confirmationTitle', 'You have scheduled with {{serviceName}}', { serviceName: service?.name })}
        confirmButtonText={t('services.serviceDetails.continueButton')}

      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            src={getApiImageUrl(service?.urlImage)}
            alt="Service Profile"
            sx={{ width: 70, height: 70 }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            textAlign: 'center',
            pt: 5,
          }}
        >
          <TextAtom variant="body" size="medium">
            {t('services.serviceDetails.confirmationMessage')}
          </TextAtom>
        </Box>
      </ModalComponent>
    </Box>
  );
};

export default TaskDetailInput;
