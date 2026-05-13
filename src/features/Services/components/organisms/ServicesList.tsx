import React from 'react';
import { Grid2 as Grid, Typography, Box } from '@mui/material';
import ServiceCard from './ServiceCard';
import { ProductService } from '../../../../types/api/modelTypes';

interface ServicesListProps {
  professionals: ProductService[];
  favorites: string[] | number[] ; // IDs
  onServiceClick: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  professionals,
  favorites,
  onServiceClick,
  onToggleFavorite,
}) => {
  if (!professionals.length) {
    return (
      <Box sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No se encontraron servicios relacionados con los filtros aplicados.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      {professionals.map((service: ProductService) => (
        <Grid  size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
          <ServiceCard
            productService={service}
            isFavorite={favorites.includes(service.id)}
            onToggleFavorite={() => onToggleFavorite(service.id)}
            onClick={() => onServiceClick(service.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ServicesList;
