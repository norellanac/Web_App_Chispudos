import { Box, Grid, useTheme, Button, IconButton } from '@mui/material';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import TextAtom from '../../../../components/atoms/TextAtom';
import InputAtom from '../../../../components/atoms/InputAtom';
import constructionWorker from '../../../../assets/images/stepper/step4_constructionWorker.svg';
import { useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ButtonAtom } from '../../../../components/atoms';
import CustomStepper from './Stepper';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import {
  selectStepper,
  setServiceState,
} from '../../../../redux/slices/serviceStepperSlice';
import { useUpdateProductMutation } from '../../../../services/productApi';

const Step4 = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const dispatch = useAppDispatch();
  const { service } = useAppSelector(selectStepper);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const validationSchema = Yup.object().shape({
    skills: Yup.array().of(
      Yup.object().shape({
        tagsTextField: Yup.string().required(t('forms.commons.required')),
        titleTextField: Yup.string().required(t('forms.commons.required')),
        descriptionTextField: Yup.string(),
      }),
    ),
  });

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const payload = {
        type: 1,
        price: service?.price || 0,
        id: service?.id,
        details: values.skills.map((skill) => ({
          label: skill.tagsTextField,
          value: skill.titleTextField,
          description: skill.descriptionTextField,
        })),
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
        skills: service?.details?.map((detail) => ({
          tagsTextField: detail.label,
          titleTextField: detail.value,
          descriptionTextField: detail.description || '',
        })) || [{ tagsTextField: '', titleTextField: '', descriptionTextField: '' }],
      }}
      validationSchema={validationSchema}
      onSubmit={handleUpdate}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        handleSubmit,
      }) => (
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
              pt={{ xs: 5, sm: 12, md: 8, lg: 8 }}
              pb="28px"
            >
              <TextAtom
                variant="title"
                size="large"
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {t('businessStepper.step4.title')}
              </TextAtom>
              <TextAtom
                variant="display"
                size="medium"
                fontWeight="bold"
                sx={{ mb: 1 }}
                gutterBottom
              >
                {t('businessStepper.step4.heading')}
              </TextAtom>
              <TextAtom variant="body" size="medium" gutterBottom>
                {t('businessStepper.step4.description')}
              </TextAtom>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ maxHeight: 500, overflowY: 'auto', pr: 1 }}>
                  <FieldArray name="skills">
                    {({ push, remove }) => (
                      <>
                        {values.skills.map((_, index) => (
                          <Grid container spacing={4} key={index}>
                            <Grid item xs={12} md={12}>
                              <Box mb={3}>
                                <TextAtom
                                  variant="title"
                                  size="small"
                                  fontWeight="bold"
                                >
                                  {t('businessStepper.step4.tagsInput')}
                                </TextAtom>
                                <InputAtom
                                  name={`skills.${index}.tagsTextField`}
                                  variant="outlined"
                                  label={t(
                                    'businessStepper.step4.tagsTextField',
                                  )}
                                  fullWidth
                                  required
                                  error={
                                    touched.skills?.[index]?.tagsTextField &&
                                    Boolean(
                                      errors.skills?.[index]?.tagsTextField,
                                    )
                                  }
                                  helperText={
                                    touched.skills?.[index]?.tagsTextField &&
                                    errors.skills?.[index]?.tagsTextField
                                  }
                                  sx={{ mb: 1 }}
                                />
                                <TextAtom variant="title" size="small">
                                  {t('businessStepper.step4.tagsExample')}{' '}
                                  <Chip
                                    label={t(
                                      'businessStepper.step4.electrician',
                                    )}
                                  />{' '}
                                  <Chip
                                    label={t('businessStepper.step4.plumber')}
                                  />
                                </TextAtom>
                              </Box>

                              <TextAtom
                                variant="title"
                                size="small"
                                fontWeight="bold"
                              >
                                {t('businessStepper.step4.titleInput')}
                              </TextAtom>
                              <InputAtom
                                name={`skills.${index}.titleTextField`}
                                variant="outlined"
                                label={t(
                                  'businessStepper.step4.titleTextField',
                                )}
                                fullWidth
                                required
                                error={
                                  touched.skills?.[index]?.titleTextField &&
                                  Boolean(
                                    errors.skills?.[index]?.titleTextField,
                                  )
                                }
                                helperText={
                                  touched.skills?.[index]?.titleTextField &&
                                  errors.skills?.[index]?.titleTextField
                                }
                                sx={{ mb: 2 }}
                              />

                              <TextAtom
                                variant="title"
                                size="small"
                                fontWeight="bold"
                              >
                                {t('businessStepper.step4.descriptionInput')}
                              </TextAtom>
                              <InputAtom
                                name={`skills.${index}.descriptionTextField`}
                                variant="outlined"
                                multiline
                                rows={3}
                                label={t(
                                  'businessStepper.step4.descriptionTextField',
                                )}
                                fullWidth
                              />

                              <Box display="flex" justifyContent="left" pb={4}>
                                {values.skills.length > 1 && (
                                  <ButtonAtom
                                    variant="text"
                                    onClick={() => remove(index)}
                                    color="error"
                                    startIcon={<RemoveCircleOutlineIcon />}
                                  >
                                    {t('businessStepper.step4.deleteSkill')}
                                  </ButtonAtom>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        ))}

                        <Box display="flex" justifyContent="left">
                          <Button
                            onClick={() =>
                              push({
                                tagsTextField: '',
                                titleTextField: '',
                                descriptionTextField: '',
                              })
                            }
                            variant="outlined"
                            startIcon={<AddIcon />}
                          >
                            {t('businessStepper.step4.addSkill')}
                          </Button>
                        </Box>
                      </>
                    )}
                  </FieldArray>
                </Box>
              </Grid>

              {isLargeScreen && (
                <Grid item xs={12} md={6}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                  >
                    <img
                      src={constructionWorker}
                      alt="Image of a Construction Worker"
                    />
                  </Box>
                </Grid>
              )}
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

export default Step4;
