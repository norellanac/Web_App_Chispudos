import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLayout } from '../../../../components/templates/UserLayout';
import { Box, Grid2 as Grid, CircularProgress, TextField } from '@mui/material';
import { ServiceHeader } from '../organisms/ServiceDetailHeader';
import { ServiceSkills } from '../organisms/ServiceDetailSkills';
import { ServiceProjects } from '../organisms/ServiceDetailProjects';
import { ServiceReviews } from '../organisms/ServiceDetailReviews';
import { ServiceOtherSkills } from '../organisms/ServiceDetailOtherSkills';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useTranslation } from 'react-i18next';
import { useDateValidation } from '../../../../hooks/useDateValidation';
import CustomError from '../../../../utils/CustomError';
import { ModalComponent } from '../../../../components/molecules';
import { useGetProductByIdQuery } from '../../../../services/productApi';
import DEFAULT_IMAGE from '../../../../assets/images/DEFAULT_IMAGE.png';

export const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useGetProductByIdQuery(id!);
  const service = data?.data;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isDateEnabled } = useDateValidation({
    disabledDates: [
      new Date(2025, 0, 1),
      new Date(2025, 4, 1),
      new Date(2025, 5, 30),
      new Date(2025, 7, 15),
      new Date(2025, 8, 15),
      new Date(2025, 9, 20),
      new Date(2025, 10, 1),
      new Date(2025, 11, 25),
    ],
    disableWeekends: true,
    customValidation: (date) => {
      const month = date.getMonth();
      const day = date.getDate();
      if (month === 3 && day >= 17 && day <= 20) {
        return false;
      }
      return true;
    },
  });

  const handleConfirm = () => {
    if (selectedDateTime) {
      navigate('/service-details', {
        state: {
          dateTime: selectedDateTime.toISOString(),
          serviceTitle: service.name,
          service,
        },
      });
    } else {
      alert('Please select a date and time.');
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleGoBack = () => {
    navigate('/search-services');
  };

  if (isLoading) {
    return (
      <UserLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </UserLayout>
    );
  }

  if (isError) {
    throw new CustomError(
      error?.originalStatus,
      error?.data,
      'Go Back',
      () => navigate('/'),
    );
  }

  const title = service.name || 'Service not available';
  const providerName = `${service.user?.name || 'Unknown'} ${service.user?.lastname || ''}`;
  const { description } = service;
  const rating = service.averageRating || 0;
  const image = service.urlImage
    ? `${import.meta.env.VITE_BASE_API_URL}${service.urlImage}`
    : DEFAULT_IMAGE;

  return (
    <UserLayout>
      <ServiceHeader
        title={title}
        providerName={providerName}
        rating={rating}
        image={image}
        onOpenModal={handleOpenModal}
      />
      <Grid container>
        <Grid size={{ xs: 12, md: 9 }}>
          <Box py={4} px={{ xs: 2, sm: 4, md: 18 }}>
            <ServiceSkills description={description || ''} />
            <ServiceProjects projects={service.recentProjects || []} />
            <ServiceOtherSkills skills={service.details || []} />
          </Box>
        </Grid>
        <Grid item size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              paddingTop: { xs: '0rem', sm: '0rem', md: '2rem' },
              mx: { xs: 0, sm: 0, md: 4 },
            }}
          >
            <ServiceReviews reviews={service.reviews || []} />
          </Box>
        </Grid>
      </Grid>

      <ModalComponent
        open={openModal}
        onClose={handleCloseModal}
        title={t('services.serviceDetails.dateModalTitle')}
        onConfirm={handleConfirm}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date & Time"
            value={selectedDateTime}
            onChange={(newValue) => setSelectedDateTime(newValue)}
            shouldDisableDate={(date) =>
              !isDateEnabled(date.toDate()) || date.isBefore(dayjs(), 'day')
            }
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
      </ModalComponent>
    </UserLayout>
  );
};

export default ServiceDetailPage;
