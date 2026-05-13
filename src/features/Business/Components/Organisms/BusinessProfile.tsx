import {
  Box,
  Grid,
  Avatar,
  Chip,
  Typography,
  Button,
  useTheme,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLabels } from '../../../../hooks/useLabels';
import TextAtom from '../../../../components/atoms/TextAtom';
import EditIcon from '@mui/icons-material/Edit';
import { useGetProductsQuery } from '../../../../services/productApi';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectAuth } from '../../../../redux/slices/authSlice';
import DEFAULT_IMAGE from '../../../../assets/images/DEFAULT_IMAGE.png';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { ProductService } from '../../../../types/api/modelTypes';
import { clearStepper, setServiceState } from '../../../../redux/slices/serviceStepperSlice';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { UserLayout } from '../../../../components/templates/UserLayout';
import { useHasRole } from '../../../../hooks/useHasRole';

const BusinessProfilePage = () => {
  const { t } = useTranslation();
  const { productService: L } = useLabels();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const userID = useAppSelector(selectAuth)?.user?.id;

  const { data: productsData, isLoading, error } = useGetProductsQuery();
  const allProducts = Array.isArray(productsData?.data?.items)
    ? productsData.data.items
    : [];
  const products = allProducts.filter((product) => product.userId === userID);

  if (products.length < 1 && !isLoading )
    navigate(`/addProduct`);
  // Estado para el producto seleccionado
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  // Seleccionar el producto más reciente por defecto
  useEffect(() => {
    if (products.length > 0 && selectedProductId === null) {
      const mostRecentProduct = products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
      setSelectedProductId(mostRecentProduct.id);
    }
  }, [products, selectedProductId]);

  // Producto actualmente seleccionado
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const getImageUrl = (urlImage: string | null | undefined) => {
    if (urlImage) {
      return `${import.meta.env.VITE_BASE_API_URL}${urlImage}`;
    }
    return DEFAULT_IMAGE;
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;

  const handleEditProduct = (product: ProductService) => {
    dispatch(clearStepper());
    dispatch(setServiceState(product));
    navigate(`/addProduct`);
  }

  return (
    <UserLayout>
    <Box px={{ xs: 4, md: 10, lg: 24 }} py={5}>
      {/* Header */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Box position="relative">
          <Avatar
            src={getImageUrl(selectedProduct?.urlImage)}
            alt={
              selectedProduct?.name ||
              t(
                'businessProfilePage.profile.avatarAlt',
                'Service image or logo',
              )
            }
            sx={{ width: 150, height: 150 }}
          />
          <Button
            onClick={() => handleEditProduct(selectedProduct)}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              minWidth: 'unset',
              padding: '5px',
              borderRadius: '50%',
            }}
          >
            <EditIcon fontSize="small" />
          </Button>
        </Box>

        {/* Título con dropdown */}
        <Box display="flex" alignItems="center" mt={2}>
          <TextAtom
            variant="headline"
            size="small"
            fontWeight="bold"
            sx={{ mr: 2 }}
          >
            {selectedProduct?.name ||
              t('businessProfilePage.profile.noServiceSelected', `No ${L.entityName} selected`)}
          </TextAtom>
          <FormControl size="small" disabled={products.length === 0}>
            <Select
              value={selectedProductId || ''}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              displayEmpty
              renderValue={() => <StorefrontIcon />}
              sx={{ minWidth: 50 }}
            >
              {products.length === 0 ? (
                <MenuItem value="">
                  {t('businessProfilePage.profile.noServiceAvailable', `No ${L.entityName} available`)}
                </MenuItem>
              ) : (
                products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))
              )}
              <MenuItem value="addNew" onClick={() => navigate(`/addProduct`)}>
                {t('businessProfilePage.profile.addNewService', `Add new ${L.entityName}`)}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Typography>
          {L.price}: <strong>Q{selectedProduct?.price || '—'}</strong>
        </Typography>
      </Box>

      {/* Habilidades y experiencia */}
      <Box mb={{ xs: 6, md: 8 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="left"
          mb={1}
        >
          <Box display="flex" alignItems="center">
            <TextAtom variant="title" size="large" fontWeight="bold">
              {L.details}
            </TextAtom>
            <Button
              onClick={() => handleEditProduct(selectedProduct)}
              size="small"
              startIcon={<EditIcon />}
              sx={{ ml: 2, textTransform: 'none' }}
            >
              {t('businessProfilePage.profile.editButton', 'Edit')}
            </Button>
          </Box>
        </Box>
        <Typography>
          {selectedProduct?.description ||
            t('businessProfile.skillsDescription', 'No description available')}
        </Typography>
      </Box>

      {/* Proyectos recientes */}
      <Box mb={{ xs: 6, md: 8 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Box display="flex" alignItems="center">
            <TextAtom variant="title" size="large" fontWeight="bold">
              {t(
                'businessProfilePage.profile.recentsProjects',
                'Recent Projects',
              )}
            </TextAtom>
            <Button
              onClick={() => handleEditProduct(selectedProduct)}
              size="small"
              startIcon={<EditIcon />}
              sx={{ ml: 2, textTransform: 'none' }}
            >
              {t('businessProfilePage.profile.editButton', 'Edit')}
            </Button>
          </Box>
        </Box>

        {/* Placeholder temporal */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          py={4}
          border="1px dashed #ccc"
          borderRadius={2}
        >
          <Typography variant="body1" color="textSecondary" textAlign="center">
            {t(
              'businessProfilePage.profile.noProjects',
              'There are no completed projects available.',
            )}
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            {t(
              'businessProfilePage.profile.projectsComingSoon',
              'You will soon be able to see completed projects here.',
            )}
          </Typography>
        </Box>
      </Box>

      {/* Otras habilidades */}
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Box display="flex" alignItems="center">
            <TextAtom variant="title" size="large" fontWeight="bold">
              {t('businessProfilePage.profile.otherSkills', L.details)}
            </TextAtom>
            <Button
              onClick={() => handleEditProduct(selectedProduct)}
              size="small"
              startIcon={<EditIcon />}
              sx={{ ml: 2, textTransform: 'none' }}
            >
              {t('businessProfilePage.profile.editButton', 'Edit')}
            </Button>
          </Box>
        </Box>

        {/* Mostrar mensaje si no hay habilidades */}
        {!selectedProduct?.details || selectedProduct.details.length === 0 ? (
          <Typography>
            {t('businessProfilePage.profile.noSkills', 'No skills listed')}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {selectedProduct.details.map((detail, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box p={2} border="1px solid #ccc" borderRadius={2}>
                  <Chip
                    label={detail.label}
                    sx={{
                      backgroundColor: '#EADDFF',
                      color: '#6750A4',
                    }}
                  />
                  <Typography fontWeight="bold">{detail.value}</Typography>
                  <Typography>{detail.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
    </UserLayout>
  );
};

export default BusinessProfilePage;
