import { useTranslation } from 'react-i18next';
import {
  Grid2 as Grid,
  FormControl,
  IconButton,
  useTheme,
  Box,
  Divider,
  TextField,
  MenuItem,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  InputLabel,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clear, Search } from '@mui/icons-material';
import { ButtonAtom, TextAtom } from '../atoms';
import { ModalComponent } from '../molecules';
import { useProductsServiceFilters } from '../../hooks/useProductsServiceFilters';
import { useProductServiceFilterData } from '../../hooks/useProductServiceFilterData';

const SearchForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const palette = theme.palette;

  const [showSearchModal, setShowSearchModal] = useState(false);


  const {
    filters,
    updateSearchTerm,
    updatePriceRange,
    updateCategories,
    updateLocationIds,
    resetFilters,
    clearFilters,
  } = useProductsServiceFilters();

  const {
    availableLocations,
    availableCategories,
    priceRange,
    totalCount,
    filteredCount,
  } = useProductServiceFilterData();



  const handleSubmit = () => {
    navigate('/search-services');
  };


  const handleModalConfirm = () => {
    // handleSubmit(initialValues);
    setShowSearchModal(false);
  };

  const FormSection = () => (
    <>
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{
          borderRadius: { xs: 5, md: 25 },
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          width: { md: '90%', lg: '65%' },
          minHeight: 85,
          mx: 'auto',
          py: 1,
          my: 1,
          backgroundColor: 'background.paper',
        }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 3 }} mx={{ xs: 2, sm: 2, md: 1 }}>
          <FormControl fullWidth>
            <TextField
              name="textSearch"
              value={filters.searchTerm}
              onChange={(e) => updateSearchTerm(e.target.value)}
              placeholder={t('landing.searchForm.title')}
              aria-label={t('landing.searchForm.textPlaceholder')}
              variant="standard"
              label={t('landing.searchForm.textPlaceholder')}
              sx={{
                ml: 3,
                '& .MuiInput-underline:before': { borderBottom: 'none' },
                '& .MuiInput-underline:after': { borderBottom: 'none' },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
              }}
            />
          </FormControl>
        </Grid>
        <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }} />
        <Grid size={{ xs: 12, sm: 12, md: 3 }} mx={{ xs: 2, sm: 2, md: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="service-multiselect-label">
              {t('landing.searchForm.serviceInput')}
            </InputLabel>
            <Select
              labelId="service-multiselect-label"
              id="service-multiselect"
              variant="standard"
              multiple
              value={filters.categories}
              onChange={(e) => updateCategories(e.target.value)}
              input={
                <OutlinedInput
                  label={t('landing.searchForm.serviceInput')}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&:before': { borderBottom: 'none' },
                    '&:after': { borderBottom: 'none' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                />
              }
              renderValue={(selected) => (availableCategories.reduce((acc, category) => {
                if (selected) {
                  if (selected.includes(category.id)) acc.push(category.name);
                }
                return acc;
              }, [])).join(', ')}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {availableCategories.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  <Checkbox checked={filters?.categories?.indexOf(option.id) > -1} />
                  <ListItemText primary={option.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }} />
        <Grid size={{ xs: 12, sm: 12, md: 3 }} mx={{ xs: 2, sm: 2, md: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="location-multiselect-label">
              {t('landing.searchForm.location')}
            </InputLabel>
            <Select
              labelId="location-multiselect-label"
              id="location-multiselect"
              multiple
              value={filters.locationIds}
              onChange={(e) => updateLocationIds(e.target.value)}
              input={
                <OutlinedInput
                  label={t('landing.searchForm.location')}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&:before': { borderBottom: 'none' },
                    '&:after': { borderBottom: 'none' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                />
              }
              renderValue={(selected) => (
                availableLocations.reduce((acc, location) => {
                  if (selected.includes(location.id)) {
                    acc.push(location.cityName);
                  }
                  return acc;
                }, []).join(', ')
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: 250,
                  },
                },
              }}
            >
              {availableLocations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  <Checkbox checked={filters?.locationIds?.indexOf(location.id) > -1} />
                  <ListItemText primary={location.cityName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Divider orientation='vertical' flexItem sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }} />
        <Grid
          size={{ xs: 12, sm: 12, md: 1 }}
          sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
        >
          <IconButton
            onClick={handleSubmit}
            sx={{
              backgroundColor: palette.primary.main,
              color: palette.common.white,
              '&:hover': {
                backgroundColor: palette.primary.main,
              },
              ml: 5,
            }}
          >
            <Search />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );

  const searchSummarySection = () => (
    <Box
          sx={{
            textAlign: 'center',
            mt: 2,
            color: palette.text.secondary,
            fontSize: '0.875rem',
          }}
        >
          {filters.searchTerm? 
          (<Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
            <TextAtom
              size="small"
              variant="body"
              sx={{ fontWeight: 'bold', color: palette.primary.main, mr: 1 }}
            >
            {`Resulsts for: `}
            <ButtonAtom
              variant="text"
              onClick={() => updateSearchTerm('')}
              endIcon={<Clear sx={{ color: palette.primary.main }} />}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              {`"${filters.searchTerm}"`}
            </ButtonAtom>
            </TextAtom>
            <ButtonAtom
              variant="elevated"
              onClick={clearFilters}
              endIcon={<Clear sx={{ color: palette.primary.main }} />}
              size="small"
              sx={{ textTransform: 'none', ml: 1 }}
            >
              {t('landing.searchForm.clearFilters', 'Clear Filters')}
            </ButtonAtom>
          </Box>)
          : null}
          {`${filteredCount}  items found`}
          { filters.categories.length > 0 ? 
          (<Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
            Selected Categories:
            {filters.categories.map((categoryId) => {
              const category = availableCategories.find((cat) => cat.id === categoryId);
              return <ButtonAtom
                key={categoryId}
                variant="filled"
                size='small'
                endIcon={<IconButton sx={{ color: palette.primary.contrastText }}><Clear /> </IconButton>}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  marginRight: 1,
                }}
                onClick={() => {
                  updateCategories(filters.categories.filter((id) => id !== categoryId));
                }}
              >
                {category ? category.name : t('landing.searchForm.allCategories', 'All Categories')}
              </ButtonAtom>;
            }
            )}
          </Box>) : null}
          { filters.locationIds.length > 0 ? 
          (<Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
            Selected Locations:
            {filters.locationIds.map((locationId) => {
              const location = availableLocations.find((loc) => loc.id === locationId);
              return <ButtonAtom
                key={locationId}
                variant="filled"
                size='small'
                endIcon={<IconButton sx={{ color: palette.primary.contrastText }}><Clear /> </IconButton>}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  marginRight: 1,
                }}
                onClick={() => {
                  updateLocationIds(filters.locationIds.filter((id) => id !== locationId));
                }}
              >
                {location ? location.cityName : t('landing.searchForm.allLocations', 'All Locations')}
              </ButtonAtom>;
            }
            )}
          </Box>) : null}
        </Box>
  );

  return (
    <>
      {/* Desktop */}
      <Box sx={{ display: { md: 'block', sm: 'none', xs: 'none' }, backgroundColor: palette.primary.light, py: 5 }}>
        {FormSection()}
        {searchSummarySection()}
      </Box>
      {/* Mobile/Tablet */}
      <Box sx={{ display: { md: 'none', sm: 'block', xs: 'block' } }}>
        <Grid container spacing={2} sx={{ width: '100%', mx: 0 }}>
          <Grid size={{ xs: 12, sm: 12 }} mx={6} my={1}>
            <ButtonAtom
              fullWidth
              variant="elevated"
              sx={{ width: '100%', height: 50 }}
              onClick={() => setShowSearchModal(true)}
              startIcon={<Search />}
            >
              {t('landing.searchForm.startSearch', 'Start your search')}
            </ButtonAtom>
          </Grid>
        </Grid>
        <ModalComponent
          open={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onConfirm={handleModalConfirm}
          onCancel={clearFilters}
          confirmButtonEndIcon={<Search />}
          title={t('landing.searchForm.modalTitle', 'Search Services')}
          cancelButtonText={t(
            'landing.searchForm.clearFilters',
            'Clear Filters',
          )}
          confirmButtonText={t('landing.searchForm.search', 'Search')}
          isConfirmButtonDisabled={false}
          sx={{ width: '95%', height: 'auto', maxWidth: '100%' }}
        >
          {FormSection()}
          {searchSummarySection()}
        </ModalComponent>
      </Box>
    </>
  );
};

export default SearchForm;
