import React from 'react';
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useTranslation } from 'react-i18next';
import TextAtom from '../../../../components/atoms/TextAtom';
import { useGetCategoriesQuery } from '../../../../services/categoryApi';
import { getApiImageUrl } from '../../../../utils/baseEnvironment';

const CategoriesSection: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { data, error, isLoading } = useGetCategoriesQuery();

  const categories = data?.data || [];

  if (isLoading) return <p>{t('loading')}</p>;
  if (error) return <p>{t('errorFetchingCategories')}</p>;

  return (
    <Container sx={{ py: 3 }}>
      <Grid
        container
        spacing={2}
        justifyContent={isSmallScreen ? 'center' : 'flex-start'}
        textAlign={isSmallScreen ? 'center' : 'left'}
      >
        <Grid item xs={12} md={3}>
          <Box sx={{ marginTop: '80px', width: '100%' }}>
            <TextAtom
              variant="body"
              size="large"
              sx={{
                color: '#019FE9',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              {t('landing.highDemand.category')}
            </TextAtom>
          </Box>
          <Box sx={{ mt: 1 }}>
            <TextAtom
              variant="headline"
              size="large"
              sx={{ fontWeight: 'bold' }}
            >
              {t('landing.highDemand.title')}
            </TextAtom>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <Swiper spaceBetween={16} slidesPerView={isSmallScreen ? 1.5 : 2.5}>
            {categories.map((category) => (
              <SwiperSlide
                key={category.id}
                style={{
                  width: '350px',
                  height: '400px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 6,
                    borderRadius: '24px',
                    boxShadow: '4px 4px 15px rgba(0, 0, 0, 0.1)',
                    bgcolor: '#fff',
                    margin: '20px',
                  }}
                >
                  <img
                    src={getApiImageUrl(category.icon)}
                    alt={category.name}
                    style={{ height: '80px', marginBottom: '16px' }}
                  />
                  <TextAtom
                    variant="body"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {t(
                      `landing.categories.${category.name.toUpperCase()}.category`,
                      { defaultValue: category.name },
                    )}
                  </TextAtom>
                  <TextAtom
                    variant="body"
                    size="small"
                    sx={{ color: 'text.secondary', mt: 1 }}
                  >
                    {t(
                      `categories.${category.name.toLowerCase()}.description`,
                      { defaultValue: category.description },
                    )}
                  </TextAtom>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CategoriesSection;
