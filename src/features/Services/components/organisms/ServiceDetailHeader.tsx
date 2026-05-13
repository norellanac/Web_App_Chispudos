import React from 'react';
import { useLabels } from '../../../../hooks/useLabels';
import {
  Box,
  Typography,
  CardMedia,
  useMediaQuery,
  useTheme,
  Grid2 as Grid,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItem,
  Rating,
} from '@mui/material';
import { ButtonAtom, TextAtom } from '../../../../components/atoms';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ServiceHeaderProps {
  title: string;
  providerName: string;
  rating: number;
  image: string;
  onOpenModal: () => void;
}

export const ServiceHeader: React.FC<ServiceHeaderProps> = ({
  title,
  providerName,
  rating,
  image,
  onOpenModal,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { productService: L, order: O } = useLabels();

  return (
    <Box backgroundColor="#E8DEF8" p={2}>
      <Grid container spacing={2}>
        <Grid
          size={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            width: '100%',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ButtonAtom variant='text' onClick={() => navigate('/search-services')} aria-label="Go back" startIcon={<ArrowBack />}>
              <TextAtom
              variant="body"
              size="large"
              marginLeft="0.5rem"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              Regresar
            </TextAtom>
            </ButtonAtom>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant={isMobile ? 'h6' : 'h4'} fontWeight="bold">
              {title || 'Servicio no disponible'}
            </Typography>
          </Box>
          <Box sx={{ width: 48 }} />
        </Grid>

        <Grid
          size={{ xs: 12, md: 3 }}
          offset={{ xs: 0, md: 4 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{
              maxWidth: 250,
              borderRadius: 5,
            }}
          />
        </Grid>

        <Grid
          size={{ xs: 12, sm: 12, md: 3 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar alt={providerName} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={providerName || L.provider}
              secondary={
                <Typography fontWeight="bold">
                  {rating ? (
                    <><span>{rating.toFixed(1)}</span><Rating value={rating} readOnly size="small" /></>
                  ) : (
                    <>{L.rating} —</>
                  )}
                </Typography>
              }
            />
            <ButtonAtom
              variant="filled"
              onClick={onOpenModal}
              sx={{ display: { xs: 'block', md: 'none', lg: 'none' }, m: 0 }}
            >
              {O.actions.create}
            </ButtonAtom>
          </ListItem>

          <ButtonAtom
            fullWidth
            variant="filled"
            onClick={onOpenModal}
            sx={{ display: { xs: 'none', md: 'block', lg: 'block' }, ml: 5, maxWidth: '50%' }}
          >
            Solicitar
          </ButtonAtom>
        </Grid>
      </Grid>
    </Box>
  );
};