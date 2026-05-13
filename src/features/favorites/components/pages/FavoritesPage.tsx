import { Box, Button, Grid } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { UserLayout } from '../../../../components/templates/UserLayout';
import { TextAtom } from '../../../../components/atoms';
import { useTranslation } from 'react-i18next';
import ServiceCard from '../../../Services/components/organisms/ServiceCard';
import { useEffect, useState } from 'react';
import { ProductService } from '../../../../types/api/modelTypes';
import DEFAULT_IMAGE from '../../../../assets/images/DEFAULT_IMAGE.png';
import { useNavigate } from 'react-router-dom';

export const FavoritesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [favoriteServices, setFavoriteServices] = useState<ProductService[]>(
    [],
  );

  const getFullImageUrl = (url: string | null) => {
    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    return url?.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  // 🛠 Obtener favoritos desde localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteServices');
    if (storedFavorites) {
      setFavoriteServices(JSON.parse(storedFavorites));
    }
  }, []);

  // 🗑 Eliminar servicio de favoritos
  const removeFromFavorites = (id: string) => {
    const updatedFavorites = favoriteServices.filter(
      (service) => service.id !== id,
    );
    setFavoriteServices(updatedFavorites);
    localStorage.setItem('favoriteServices', JSON.stringify(updatedFavorites));
  };

  return (
    <UserLayout>
      <Box>
        <Box
          sx={{
            backgroundColor: '#F3ECFF',
            paddingBottom: 5,
            width: '100vw',
            px: { xs: 3, sm: 20, md: 20 },
          }}
        >
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingTop: 5,
                cursor: 'pointer',
              }}
            >
              <TextAtom
                variant="title"
                size="large"
                fontWeight={'bold'}
                sx={{ marginLeft: 1 }}
              >
                {t('favoritesPage.title')}
              </TextAtom>
            </Box>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ padding: '20px' }}>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {favoriteServices.length > 0 ? (
            favoriteServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <ServiceCard
                productService={service}
                  isFavorite={true} // 🔥 Siempre es favorito aquí
                  onToggleFavorite={removeFromFavorites} // 🗑 Remueve de favoritos
                />
              </Grid>
            ))
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FavoriteBorderIcon
                sx={{
                  fontSize: '100px',
                  color: 'rgba(0, 0, 0, 0.3)',
                  marginBottom: '1rem',
                }}
              />
              <TextAtom variant="title" size="medium" fontWeight="bold">
                Aún no tienes servicios favoritos guardados.
              </TextAtom>
              <TextAtom
                variant="body"
                size="medium"
                color="text.secondary"
                sx={{ marginTop: '0.5rem', marginBottom: '1rem' }}
              >
                Explora nuestros servicios y guarda tus favoritos para acceder a
                ellos fácilmente.
              </TextAtom>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/search-services')}
              >
                Explorar servicios
              </Button>
            </Box>
          )}
        </Grid>
      </Box>
    </UserLayout>
  );
};

export default FavoritesPage;
