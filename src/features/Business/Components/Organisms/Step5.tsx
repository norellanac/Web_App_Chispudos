import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLabels } from '../../../../hooks/useLabels';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TextAtom from '../../../../components/atoms/TextAtom';
import InputAtom from '../../../../components/atoms/InputAtom';
import dollarImage from '../../../../assets/images/stepper/step5_dollarImage.svg';
import CustomStepper from './Stepper';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import {
  selectStepper,
  setServiceState,
} from '../../../../redux/slices/serviceStepperSlice';
import { useUpdateProductMutation } from '../../../../services/productApi';

const Step5 = () => {
  const { t } = useTranslation();
  const { productService: L } = useLabels();
  const dispatch = useAppDispatch();
  const { service } = useAppSelector(selectStepper);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const validationSchema = Yup.object().shape({
    price: Yup.number()
      .typeError(t('forms.commons.mustBeNumber'))
      .required(t('forms.commons.required')),
  });

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const payload = {
        price: values.price,
      };
      console.log('Enviando payload:', payload);

      const response = await updateProduct({
        productId: service.id,
        productData: payload,
      }).unwrap();
      console.log('Respuesta del backend:', response);
      dispatch(setServiceState(response.productService));
    } catch (err) {
      console.error('Error al procesar:', err);
      if (err.data) {
        console.error('Detalles del error:', err.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        price: service?.price,
      }}
      validationSchema={validationSchema}
      onSubmit={handleUpdate}
    >
      {({ errors, touched, isSubmitting, isValid, handleSubmit }) => (
        <Form>
          <Box px={{ xs: 4, md: 10, lg: 24 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  flex={1}
                  display="flex"
                  flexDirection="column"
                  textAlign="left"
                  pt={{ xs: 5, sm: 12, md: 8, lg: 16 }}
                >
                  <TextAtom
                    variant="title"
                    size="large"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    {t('businessStepper.step5.title')}
                    <TextAtom variant="title" size="medium" sx={{ mb: 1 }}>
                      {t('businessStepper.step5.subtitle')}
                    </TextAtom>
                  </TextAtom>
                  <TextAtom
                    variant="display"
                    size="medium"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                    gutterBottom
                  >
                    {t('businessStepper.step5.heading')}
                  </TextAtom>
                  <TextAtom variant="body" size="medium" sx={{ pb: 5 }}>
                    {t('businessStepper.step5.description')}
                  </TextAtom>
                  <Box mb={3}>
                    <InputAtom
                      name="price"
                      variant="outlined"
                      label={t('businessStepper.step5.priceTextField', L.price)}
                      fullWidth
                      required
                      error={touched.price && Boolean(errors.price)}
                      helperText={touched.price && errors.price}
                      sx={{ mb: 1 }}
                    />
                    <TextAtom variant="title" size="small">
                      {t('businessStepper.step5.note')}
                    </TextAtom>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  mt={{ xs: -4, sm: 0, md: 12, lg: 16 }}
                >
                  <img
                    src={dollarImage}
                    alt="Illustration of a dollar sign with RecoApp colors"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <CustomStepper
            onHandleNext={handleSubmit}
            isNextEnabled={isValid && !isSubmitting && !isUpdating}
          />
        </Form>
      )}
    </Formik>
  );
};

export default Step5;
