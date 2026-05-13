import React from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import ServicesCard from '../../../../components/atoms/ServicesCard';
import { useGetProductsQuery } from '../../../../services/productApi';
import DEFAULT_IMAGE from '../../../../assets/images/DEFAULT_IMAGE.png';
import { ButtonAtom, TextAtom } from '../../../../components/atoms';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getApiImageUrl } from '../../../../utils/baseEnvironment';
import HorizontalScrollContainer from '../../../../components/organisms/HorizontalScrollContainer';
import { ProductService } from '../../../../types/api/modelTypes';

type GroupedServicesProps = {
  services?: ProductService[];
  titleText?: string;
};

const GroupedServices: React.FC<GroupedServicesProps> = ({
  services,
  titleText,
}) => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetProductsQuery({
    skip: !!services?.length,
  });
  const navigate = useNavigate();

  const topRatedServices = data?.data?.items
    ?.slice() // Crear una copia del array para evitar modificar el original
    ?.sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0))
    ?.slice(0, 5);

  const handleCardClick = (id: number) => {
    navigate(`/services/${id}`); // Redirigir a la página de detalles con el ID
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !topRatedServices?.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {t('recommendedServices.noServices')}
        </Typography>
      </Box>
    );
  }

  const serviceList = services || [];
  const handleNavigate = () => {
    navigate('/search-services');
  };

  return (
    <HorizontalScrollContainer
      sx={{
        pl: 3,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
          <TextAtom variant="title" size="large" fontWeight="bold">
            {titleText || t('recommendedServices.title')}
          </TextAtom>
          <ButtonAtom
            variant="text"
            sx={{ textTransform: 'none', color: 'primary.main', marginLeft: 2 }}
            onClick={handleNavigate}
          >
            <TextAtom variant="label" size="large">
              {t('recommendedServices.button', 'View all services')}
            </TextAtom>
          </ButtonAtom>
        </Box>
      }
      scrollAmount={300}
      gap={0}
    >
      {serviceList.map((service: ProductService) => (
        <Grid
          size={{ xs: 12, sm: 4, md: 3, lg: 3 }}
          sx={{ p: 2, cursor: 'pointer' }}
          onClick={() => handleCardClick(service.id)}
        >
          <ServicesCard
            name={service.name || 'Servicio sin nombre'}
            image={
              service.urlImage
                ? getApiImageUrl(service?.urlImage)
                : DEFAULT_IMAGE
            }
            price={`Q${service.price} por día`}
            rating={service.averageRating || 0}
            reviewCount={service.reviews?.length || 0}
          />
        </Grid>
      ))}
    </HorizontalScrollContainer>
  );
};

export default GroupedServices;
