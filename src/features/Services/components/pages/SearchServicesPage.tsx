import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLayout } from '../../../../components/templates/UserLayout';
import { Box, Typography } from '@mui/material';
import ServicesList from '../organisms/ServicesList';
import { ProductService } from '../../../../types/api/modelTypes';
import SearchForm from '../../../../components/organisms/SearchForm';
import GroupedServices from '../../../home/components/organisms/GroupedServices';
import { useProductServiceFilterData } from '../../../../hooks/useProductServiceFilterData';

export const SearchServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
      filteredServices: filteredResults,
    } = useProductServiceFilterData();

    const allServices = filteredResults || [];

  const [favorites, setFavorites] = useState<ProductService[]>(() => {
    return JSON.parse(localStorage.getItem('favoriteServices') || '[]');
  });

  
  const toggleFavorite = (service: ProductService) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.id === service.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== service.id);
    } else {
      updatedFavorites = [...favorites, service];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteServices', JSON.stringify(updatedFavorites));
  };



  return (
    <UserLayout>
      {/* <SearchBar /> */}
      <SearchForm />
      <Box sx={{ padding: 4 }}>
        {filteredResults.length > 0 ? (
          <ServicesList
            professionals={filteredResults}
            favorites={favorites.map((fav) => fav.id)} // Pasar solo los IDs de favoritos
            onToggleFavorite={(id) => {
              const service = filteredResults.find((s) => s.id === id);
              if (service) toggleFavorite(service);
            }}
            onServiceClick={(id) => navigate(`/services/${id}`)}
          />
        ) : (
          <Typography variant="h6" color="textSecondary">
            No se encontraron resultados.
          </Typography>
        )}
      </Box>
      <GroupedServices />
    </UserLayout>
  );
};

export default SearchServicesPage;
