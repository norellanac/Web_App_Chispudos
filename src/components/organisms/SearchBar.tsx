import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Slider,
  Checkbox,
  ListItemText,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TextAtom from '../atoms/TextAtom';
import ButtonAtom from '../atoms/ButtonAtom';
import { Delete, ExpandMore } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { useSearchServicesFormData } from '../../context/SearchContext';
import { useGetProductsQuery } from '../../services/productApi';


const SearchBar = () => {
  const { t } = useTranslation();
  const { searchData = {}, updateSearchData } = useSearchServicesFormData();

  const [priceRange, setPriceRange] = useState<number[]>([
    searchData.price?.min || 0,
    searchData.price?.max || 500,
  ]);

  const { data: products } = useGetProductsQuery();

  const services = useMemo(() => {
    return Array.from(
      new Set(
        products?.data?.items.flatMap(
          (product) => product.categories?.map((c) => c.name) || [],
        ),
      ),
    );
  }, [products]);

  const locations = useMemo(() => {
    return Array.from(new Set(products?.data?.items.map((product) => product.location)));
  }, [products]);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    updateSearchData('price', {
      min: (newValue as number[])[0],
      max: (newValue as number[])[1],
    });
  };

  const clearForm = (resetForm: () => void) => {
    resetForm();
    setPriceRange([0, 500]);
    updateSearchData('textSearch', '');
    updateSearchData('categories', []);
    updateSearchData('location', []);
    updateSearchData('price', { min: 0, max: 500 });
  };

  const validationSchema = Yup.object().shape({
    textSearch: Yup.string()
      .min(3, t('errors.minLength', { length: 3 }))
      .nullable(),
    service: Yup.array().of(Yup.string()).nullable(),
    location: Yup.array().of(Yup.string()).nullable(),
  });

  return (
    <Container
      sx={{
        py: 4,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header"
        >Filtrar Busqueda</AccordionSummary>
        <AccordionDetails>
          <Formik
            initialValues={{
              textSearch: searchData.textSearch || '',
              service: searchData.service || [],
              location: searchData.location || [],
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const searchObject = {
                ...values,
                price: { min: priceRange[0], max: priceRange[1] },
              };

              updateSearchData('textSearch', values.textSearch);
              updateSearchData('categories', values.service);
              updateSearchData('location', values.location);

              console.log('Search Object:', searchObject);
            }}
          >
            {({
              values,
              handleChange,
              setFieldValue,
              errors,
              touched,
              resetForm,
            }) => (
              <Form>
                <Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextAtom
                        variant="display"
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {t('landing.searchForm.title')}
                      </TextAtom>
                      <TextAtom variant="body" size="large">
                        {t('landing.searchForm.body')}
                      </TextAtom>

                      <FormControl fullWidth>
                        <TextField
                          name="textSearch"
                          value={values.textSearch}
                          onChange={(e) => {
                            handleChange(e);
                            updateSearchData('textSearch', e.target.value);
                          }}
                          placeholder={t('landing.searchForm.textPlaceholder')}
                        />
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>
                          {t('landing.searchForm.serviceInput')}
                        </InputLabel>
                        <Select
                          name="service"
                          multiple
                          value={values.service}
                          onChange={(e) => {
                            setFieldValue('service', e.target.value);
                            updateSearchData('categories', e.target.value);
                          }}
                          renderValue={(selected) => selected.join(', ')}
                        >
                          {services.map((service) => (
                            <MenuItem key={service} value={service}>
                              <Checkbox
                                checked={values.service.includes(service)}
                              />
                              <ListItemText primary={service} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>{t('landing.searchForm.location')}</InputLabel>
                        <Select
                          name="location"
                          multiple
                          value={values.location}
                          onChange={(e) => {
                            setFieldValue('location', e.target.value);
                            updateSearchData('location', e.target.value);
                          }}
                          renderValue={(selected) => selected.join(', ')}
                        >
                          {locations.map((location) => (
                            <MenuItem key={location} value={location}>
                              <Checkbox
                                checked={values.location.includes(location)}
                              />
                              <ListItemText primary={location} />
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.location && errors.location && (
                          <Box sx={{ color: 'red', fontSize: '0.8em', mt: 1 }}>
                            {errors.location}
                          </Box>
                        )}
                      </FormControl>

                      <Box>
                        <TextAtom variant="body" size="large">
                          {t('landing.searchForm.priceRange')}
                        </TextAtom>
                        <Slider
                          aria-labelledby="price-range-slider"
                          value={priceRange}
                          onChange={handlePriceChange}
                          valueLabelDisplay="auto"
                          min={0}
                          max={500}
                          step={50}
                        />
                      </Box>

                      <ButtonAtom
                        variant="outlined"
                        type="button"
                        onClick={() => clearForm(resetForm)}
                        fullWidth
                        sx={{
                          width: '300px',
                          textTransform: 'none',
                        }}
                      >
                        <Delete sx={{ mr: 1 }} />
                        {t('services.searchBar.clearFilters')}
                      </ButtonAtom>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default SearchBar;
