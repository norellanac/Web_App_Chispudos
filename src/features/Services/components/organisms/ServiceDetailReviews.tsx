import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Grid2 as Grid,
  useTheme,
} from '@mui/material';
import { Rating } from '@mui/material';

interface Review {
  name?: string;
  createdAt: string;
  comment: string;
  rating: number;
}

interface ServiceReviewsProps {
  reviews: Review[];
}

export const ServiceReviews: React.FC<ServiceReviewsProps> = ({ reviews }) => {
  const theme = useTheme();
  const palette = theme.palette;

  const calculateDaysAgo = (createdAt: string): string => {
    const reviewDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - reviewDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `Hace ${diffDays} días`;
  };


  return (
    <Box
      bgcolor={palette.primary.light}
      paddinTop={3}
      padding={2}
      borderRadius="8px"
    >
      <Typography variant="h5" fontWeight="bold" marginBottom="1rem">
        Reseñas
      </Typography>
      <Box>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Box key={index}>
              <Grid
                container
                spacing={2}
                alignItems="flex-start"
                marginBottom={1}
              >
                <Grid item xs={12} sm={2}>
                  <Avatar alt={review.name || 'Usuario'} />
                </Grid>
                <Grid item xs={12} sm={10}>
                  <Typography fontWeight="bold">
                    {review.name || `Usuario Anónimo ${index + 1}`}
                  </Typography>
                  <Typography fontSize="0.9rem" color="gray">
                    {calculateDaysAgo(review.createdAt)}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography>{review.comment}</Typography>
                </Grid>
              </Grid>
              {index < reviews.length - 1 && (
                <Divider sx={{ marginTop: '1rem', marginBottom: '2rem' }} />
              )}
            </Box>
          ))
        ) : (
          <Typography fontSize="1rem" color="gray">
            Este usuario aún no tiene reseñas.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
