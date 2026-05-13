import { useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TextAtom from '../../../../components/atoms/TextAtom';
import { useGetCategoriesQuery } from '../../../../services/categoryApi';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import {
  selectStepper,
  setServiceState,
} from '../../../../redux/slices/serviceStepperSlice';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import CustomStepper from './Stepper';
import { useUpdateProductMutation } from '../../../../services/productApi';
import { getApiImageUrl } from '../../../../utils/baseEnvironment';

export default function Step2() {
  const { data, isLoading, error } = useGetCategoriesQuery();
  const dispatch = useAppDispatch();
  const { service } = useAppSelector(selectStepper);
  const categories = data?.data || [];
  const [selectedCategories, setSelectedCategories] = useState<{ id: any }[]>(
    service?.categories?.map((category) => category.id) || [],
  );
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { t } = useTranslation();

  const handleSelectCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c === category.id)
        ? prev.filter((c) => c !== category.id)
        : [...prev, category.id],
    );
  };

  const handleSubmitCategories = async () => {
    const responseUpdateProduct = await updateProduct({
      productId: service?.id,
      productData: {
        type: 1,
        categories: selectedCategories,
      },
    }).unwrap();
    console.error('responseUpdateProduct', responseUpdateProduct);
    if (responseUpdateProduct.success) {
      dispatch(setServiceState(responseUpdateProduct?.productService));
    }
  };

  const isNextEnabled = selectedCategories.length > 0 || isUpdating;

  if (isLoading) return t('APIs.categories.loading');
  if (error) return t('APIs.categories.error');

  return (
    <Box
      alignItems={{ xs: 'center', md: 'flex-start' }}
      width="100%"
      px={{ xs: 4, md: 10, lg: 24 }}
      textAlign="center"
      p={3}
    >
      <Box
        flex={1}
        width={{ xs: '100%', md: 'auto' }}
        textAlign={{ xs: 'left', md: 'left' }}
        mb={{ xs: 2, md: 0 }}
        display="flex"
        flexDirection="column"
        pt={{ xs: 12, sm: 12, md: 12, lg: 12 }}
        mr={{ md: 5, lg: 5 }}
      >
        <TextAtom variant="title" size="large" fontWeight="bold" sx={{ mb: 1 }}>
          {t('businessStepper.step2.title')}
        </TextAtom>
        <TextAtom
          variant="display"
          size="medium"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          {t('businessStepper.step2.heading')}
        </TextAtom>
        <TextAtom variant="body" size="medium" color="textSecondary" mb={4}>
          {t('businessStepper.step2.description')}
        </TextAtom>
      </Box>

      <Box sx={{ maxHeight: 375, overflowY: 'auto', pr: 1 }}>
        <Grid container spacing={2} justifyContent="left">
          {categories.map((category) => (
            <Grid item key={category.id} xs={6} sm={4} md={3}>
              <Paper
                onClick={() => handleSelectCategory(category)}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: 0,
                  backgroundColor: selectedCategories.some(
                    (c) => c === category.id,
                  )
                    ? '#D0BCFF'
                    : '#F3ECFF',
                  cursor: 'pointer',
                  borderRadius: 4,
                  '&:hover': { backgroundColor: '#E6D8FF' },
                  height: '100px',
                }}
              >
                <img
                  src={getApiImageUrl(category.icon)}
                  alt={category.name}
                  style={{ width: 40, height: 40 }}
                />
                <TextAtom variant="body" size="medium" color="#2E1A47" mt={1}>
                  {category.name}
                </TextAtom>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <CustomStepper
        onHandleNext={handleSubmitCategories}
        isNextEnabled={isNextEnabled}
      />
    </Box>
  );
}
