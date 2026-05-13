import React from 'react';
import { Card, CardContent, CardMedia, Box } from '@mui/material';
import { Star } from '@mui/icons-material';
import TextAtom from './TextAtom';

type ServicesCardProps = {
  name: string;
  image: string;
  price: string;
  rating: number;
  reviewCount: number;
  [key: string]: unknown;
};

const ServicesCard: React.FC<ServicesCardProps> = ({
  name,
  image,
  price,
  rating,
  reviewCount,
  ...props
}) => {
  return (
    <Card
      sx={{
        minWidth: 225,
        height: 300,
        borderRadius: '24px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        marginBottom: 3,
      }}
      {...props}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={name}
          sx={{
            width: '100%',
            height: 150,
            objectFit: 'cover',
            marginBottom: 2,
          }}
        />

        <CardContent sx={{ width: '100%' }}>
          <Box>
            <TextAtom variant="title" size="medium" sx={{ fontWeight: 'bold' }}>
              {name}
            </TextAtom>
            <br />
            <TextAtom variant="title" size="small" color="text.secondary">
              {price}
            </TextAtom>
          </Box>

          <Box sx={{ display: 'flex', mt: 1 }}>
            <Star sx={{ color: 'gold', marginRight: 0.5 }} />
            <TextAtom variant="title" size="medium">
              {rating} ({reviewCount} reseñas)
            </TextAtom>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ServicesCard;
