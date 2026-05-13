import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Box, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ProductService } from '../../../../types/api/modelTypes';
import { TextAtom } from '../../../../components/atoms';
import { ButtonAtom } from '../../../../components/atoms';
import { getApiImageUrl } from '../../../../utils/baseEnvironment';
import { useLabels } from '../../../../hooks/useLabels';

interface ServiceCardProps {
  onClick?: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  productService: ProductService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ onClick, isFavorite, productService, onToggleFavorite }) => {
  const { productService: L, order: O } = useLabels();

  return (
    <Card
      sx={{
        maxWidth: 400,
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        borderRadius: '24px',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <IconButton
        sx={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          backgroundColor: isFavorite ? 'error.main' : 'rgba(0,0,0,0.6)',
          color: 'white', border: '2px solid white',
          '&:hover': { backgroundColor: isFavorite ? 'error.dark' : 'rgba(0,0,0,0.8)' },
        }}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(productService.id.toString()); }}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CardMedia
          component="img"
          image={getApiImageUrl(productService?.urlImage)}
          alt={`${productService.name || L.entityName} image`}
          sx={{ height: { xs: 140, sm: 160, md: 180, lg: 200 }, objectFit: 'cover' }}
        />
      </Box>

      <CardContent sx={{ px: 5, flexGrow: 1 }}>
        <TextAtom variant="body" size="medium">
          {productService.user?.name
            ? `${productService.user.name} ${productService.user.lastname ?? ''}`
            : L.provider}
        </TextAtom>
        <br />
        <TextAtom variant="title" size="large" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
          {productService.name || L.entityName}
        </TextAtom>
        <br />
        <TextAtom variant="body" size="medium" color="text.secondary">
          {productService.description}
        </TextAtom>
        <br />
        <TextAtom variant="body" size="medium" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          {L.location}: {productService.locations?.[0]?.description || '—'}
        </TextAtom>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <StarIcon fontSize="medium" sx={{ color: 'gold', mr: 0.5 }} />
          <TextAtom variant="body" size="medium">
            {productService.averageRating || 0} | {productService.reviews?.length ?? 0} {L.rating}
          </TextAtom>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 4, py: 2 }}>
        <ButtonAtom
          variant="outlined"
          type="button"
          size="medium"
          color="primary"
          fullWidth
          onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}
        >
          {O.actions.create}
        </ButtonAtom>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;
