import React from 'react';
import { Card, CardContent, CardMedia, Box } from '@mui/material';
import { LocationOn, Star } from '@mui/icons-material';
import ButtonAtom from './ButtonAtom';
import TextAtom from './TextAtom';

type ProfileCardProps = {
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  [key: string]: unknown;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  description,
  image,
  rating,
  reviewCount,
  location,
  ...props
}) => {
  return (
    <Card
      sx={{
        borderRadius: '24px',
        padding: 2,
        maxWidth: 373,
        maxHeight: 321,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      {...props}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={name}
          sx={{
            width: 125,
            height: 100,
            borderRadius: 3,
            marginRight: 2,
            marginTop: 2,
          }}
        />
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <TextAtom variant="title" size="large">
            {name}
          </TextAtom>
          <Box sx={{ display: 'flex', alignItems: 'center', marginY: 0.5 }}>
            <Star sx={{ color: 'gold', marginRight: 0.5 }} />
            <TextAtom variant="title" size="medium">
              {rating} ({reviewCount} reseñas)
            </TextAtom>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ color: 'purple', marginRight: 0.5 }} />
            <TextAtom variant="title" size="medium">
              {location}
            </TextAtom>
          </Box>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'left', marginLeft: 2 }}>
        <CardContent>
          <TextAtom
            variant="title"
            size="large"
            sx={{
              marginY: 1,
              textAlign: 'left',
              width: 300,
            }}
          >
            {description}
          </TextAtom>
          <Box>
            <ButtonAtom
              variant="text"
              onClick={() => {}}
              sx={{
                color: 'purple',
                fontWeight: 'bold',
                textTransform: 'none',
                marginTop: 1,
              }}
            >
              <TextAtom variant="title" size="medium">
                Cotizar
              </TextAtom>
            </ButtonAtom>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ProfileCard;
