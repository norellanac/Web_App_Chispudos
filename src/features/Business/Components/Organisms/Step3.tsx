import { Box, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TextAtom from '../../../../components/atoms/TextAtom';
import InputAtom from '../../../../components/atoms/InputAtom';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';
import CustomStepper from './Stepper';
import { useUpdateProductMutation } from '../../../../services/productApi';
import {
  useGetAllCitiesQuery,
  useGetStatesQuery,
} from '../../../../services/locationsApi';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import {
  selectStepper,
  setServiceState,
} from '../../../../redux/slices/serviceStepperSlice';

const Step3 = () => {
  const { t } = useTranslation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const dispatch = useAppDispatch();
  const { service } = useAppSelector(selectStepper);

  const getDepartamentsCities = (departamentId: number) => {
    return cities?.data.filter((city) => city.stateId === departamentId) || [];
  };

  const getStateOfCity = (cityId: number) => {
    const city = cities?.data.find((c) => c.id === cityId);
    return city ? states?.data.find((s) => s.id === city.stateId) : null;
  };

  const { data: states } = useGetStatesQuery();
  const { data: cities } = useGetAllCitiesQuery();

  const GUATEMALA_DEPARTMENTS = states?.data || [];
  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const payload = {
        type: 1,
        price: service?.price || 0,
        locations: [
          {
            name: 'Main address',
            description: values.mainAddress,
            type: 1,
            cityId: values.city,
            latitude: 0,
            longitude: 0,
          },
          ...values.coverageAreas
            .filter((area) => area.department && area.city)
            .map((area) => ({
              name: 'Service zones',
              description: null,
              type: 2,
              cityId: area.city,
              latitude: 0,
              longitude: 0,
            })),
        ],
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

  const validationSchema = Yup.object().shape({
    mainAddress: Yup.string().required(t('forms.commons.required')),
    department: Yup.number().required(t('forms.commons.required')),
    city: Yup.string().required(t('forms.commons.required')),
    coverageAreas: Yup.array().of(
      Yup.object().shape({
        department: Yup.number(),
        city: Yup.number(),
      }),
    ),
  });

  return (
    <Formik
      initialValues={{
        mainAddress: service?.locations?.[0]?.description || '',
        department: getStateOfCity(service?.locations?.[0]?.cityId)?.id || '' as number | '',
        city: service?.locations?.[0]?.cityId || '' as number | '',
        cityId: service?.locations?.[0]?.cityId || '' as number | '',
        coverageAreas: service?.locations
          ?.filter((location) => location.type === 2)
          .map((location) => ({
            department: getStateOfCity(location.cityId)?.id || '' as number | '',
            city: location.cityId || '' as number | '',
            cityId: location.cityId || null,
          })) || [{ department: '', city: '', cityId: null }],
      }}
      validationSchema={validationSchema}
      onSubmit={handleUpdate}
    >
      {({ values, errors, touched, handleSubmit, setFieldValue, handleChange }) => (
        <Form>
           
          <Box
            alignItems={{ xs: 'center', md: 'flex-start' }}
            px={{ xs: 4, md: 10, lg: 24 }}
          >
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              textAlign="left"
              mb={{ xs: 2, md: 0 }}
              pt={{ xs: 5, sm: 12, md: 12, lg: 18 }}
              pb="28px"
            >
              <TextAtom
                variant="title"
                size="large"
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {t('businessStepper.step3.title')}
              </TextAtom>
              <TextAtom
                variant="display"
                size="medium"
                fontWeight="bold"
                sx={{ mb: 1 }}
                gutterBottom
              >
                {t('businessStepper.step3.heading')}
              </TextAtom>
              <TextAtom variant="body" size="medium" gutterBottom>
                {t('businessStepper.step3.description')}
              </TextAtom>
            </Box>

            <Grid container spacing={4}>
              {/* Dirección Principal */}
              <Grid item xs={12} md={6}>
                <TextAtom variant="title" size="medium" fontWeight="bold">
                  {t('businessStepper.step3.mainDirectionTitle')}
                </TextAtom>
                <InputAtom
                  name="mainAddress"
                  variant="outlined"
                  label={t('businessStepper.step3.textField')}
                  fullWidth
                  margin="normal"
                  error={!!errors.mainAddress && touched.mainAddress}
                  helperText={touched.mainAddress && errors.mainAddress}
                />
                <InputAtom
                  name="department"
                  variant="outlined"
                  label={t('businessStepper.step3.inputDeparment')}
                  placeholder={t('businessStepper.step3.inputDeparment')}
                  fullWidth
                  isSelect
                  margin="normal"
                  error={!!errors.department && touched.department}
                  helperText={touched.department && errors.department}
                  onChange={handleChange}
                  options={GUATEMALA_DEPARTMENTS.map((dept) => ({
                    value: dept.id,
                    label: dept.name,
                  }))}
                  value={[values.department]}
                />
                <InputAtom
                  name="city"
                  variant="outlined"
                  label={t('businessStepper.step3.inputCity')}
                  fullWidth
                  isSelect
                  value={[values.city]}
                  margin="normal"
                  error={!!errors.city && touched.city}
                  helperText={touched.city && errors.city}
                  disabled={!values.department}
                  onChange={handleChange}
                  options={getDepartamentsCities(values.department || 1).map(
                    (city) => ({
                      value: city.id,
                      label: city.name,
                    }),
                  )}
                />
              </Grid>
              
              {/* Áreas de Cobertura */}
              <Grid item xs={12} md={6}>
                <TextAtom variant="title" size="medium" fontWeight="bold">
                  {t('businessStepper.step3.secondDirectionTitle')}
                </TextAtom>
                <TextAtom variant="body" size="medium" gutterBottom>
                  {t('businessStepper.step3.secondDirectionDescription')}
                </TextAtom>
                {values.coverageAreas.map((_, index) => (
                  <Box key={index} mb={4}>
                    <Tooltip
                      title={t('businessStepper.step3.departmentTooltip')}
                    >
                      <InputAtom
                        name={`coverageAreas.${index}.department`}
                        variant="outlined"
                        label={t('businessStepper.step3.inputDeparment')}
                        fullWidth
                        isSelect
                        margin="normal"
                        error={
                          !!errors.coverageAreas?.[index]?.department &&
                          touched.coverageAreas?.[index]?.department
                        }
                        helperText={
                          touched.coverageAreas?.[index]?.department &&
                          errors.coverageAreas?.[index]?.department
                        }
                        onChange={(e) => {
                          setFieldValue(`coverageAreas.${index}.department`, Number(e.target.value));
                          setFieldValue(`coverageAreas.${index}.city`, '');
                          setFieldValue(`coverageAreas.${index}.cityId`, null);
                        }}
                        options={GUATEMALA_DEPARTMENTS.map((dept) => ({
                          value: dept.id,
                          label: dept.name,
                        }))}
                        value={[values.coverageAreas[index].department]}
                      />
                    </Tooltip>
                    <InputAtom
                      name={`coverageAreas.${index}.city`}
                      variant="outlined"
                      label={t('businessStepper.step3.inputCity')}
                      placeholder={t('businessStepper.step3.inputCity')}
                      fullWidth
                      isSelect
                      margin="normal"
                      error={
                        !!errors.coverageAreas?.[index]?.city &&
                        touched.coverageAreas?.[index]?.city
                      }
                      helperText={
                        touched.coverageAreas?.[index]?.city &&
                        errors.coverageAreas?.[index]?.city
                      }
                      disabled={!values.coverageAreas[index].department}
                      onChange={(e) => {
                        const selectedCity = getDepartamentsCities(
                          values.coverageAreas[index].department,
                        ).find((city) => city.id === e.target.value);
                        setFieldValue(
                          `coverageAreas.${index}.city`,
                          e.target.value,
                        );
                        setFieldValue(
                          `coverageAreas.${index}.cityId`,
                          selectedCity ? selectedCity.id : null,
                        );
                      }}
                      options={getDepartamentsCities(
                        values.coverageAreas[index].department,
                      ).map((city) => ({
                        value: city.id,
                        label: city.name,
                      }))}
                      value={
                        [values.coverageAreas[index].city]}
                    />
                    {index > 0 && (
                      <ButtonAtom
                        variant="text"
                        color="error"
                        onClick={() =>
                          setFieldValue(
                            'coverageAreas',
                            values.coverageAreas.filter((_, i) => i !== index),
                          )
                        }
                        sx={{ mt: 1 }}
                        startIcon={<RemoveCircleOutlineIcon />}
                      >
                        {t('forms.commons.remove')}
                      </ButtonAtom>
                    )}
                  </Box>
                ))}
                <ButtonAtom
                  variant="outlined"
                  onClick={() =>
                    setFieldValue('coverageAreas', [
                      ...values.coverageAreas,
                      { department: '', city: '', cityId: null },
                    ])
                  }
                  sx={{ mt: 2 }}
                  startIcon={<AddIcon />}
                >
                  {t('forms.commons.addAnother')}
                </ButtonAtom>
              </Grid>
            </Grid>
          </Box>
          <CustomStepper
            onHandleNext={handleSubmit}
            isNextEnabled={
              !!values.mainAddress &&
              !!values.department &&
              !!values.city &&
              !isUpdating
            }
          />
        </Form>
      )}
    </Formik>
  );
};

export default Step3;
