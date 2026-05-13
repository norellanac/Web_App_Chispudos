import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TextAtom from '../../../../components/atoms/TextAtom';
import { useGetCategoriesQuery } from '../../../../services/categoryApi';
import HorizontalScrollContainer from '../../../../components/organisms/HorizontalScrollContainer';
import { ButtonAtom } from '../../../../components/atoms';
import { Category } from '../../../../types/api/modelTypes';
import { getApiImageUrl } from '../../../../utils/baseEnvironment';

type ListCategoriesProps = {
  handleCategoryClick?: (category: Category) => void;
};

const ListCategories = ({ handleCategoryClick }: ListCategoriesProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCategoriesQuery();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data?.data) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <Typography variant="h6" color="error">
          {t('error.loadingCategories')}
        </Typography>
      </Box>
    );
  }

  const categories = data.data;

  const handleNavigate = () => {
    navigate('/search-services');
  };

  return (
    <HorizontalScrollContainer
      sx={{
        mt: 2,
        mb: 1,
        pl: 3,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
          <TextAtom variant="title" size="large" fontWeight="bold">
            {t('landing.categories.title')}
          </TextAtom>
          {/* <ButtonAtom
            variant="text"
            sx={{ textTransform: 'none', color: 'primary.main', marginLeft: 5 }}
            onClick={handleNavigate}
          >
            <TextAtom variant="label" size="large">
              {t('landing.categories.button')}
            </TextAtom>
          </ButtonAtom> */}
        </Box>
      }
      scrollAmount={300}
    >
      {categories.map((category) => (
        <Card
          key={category.id}
          sx={{
            display: 'flex',
            backgroundColor: 'primary.light',
            textAlign: 'center',
            borderRadius: '32px',
            padding: '5px',
            mx: 1,
            boxShadow: 'none',
            minWidth: '150px',
            maxWidth: '150px',
            flexShrink: 0,
            cursor: 'pointer', // Hace que parezca clickeable
            '&:hover': { backgroundColor: '#EADDFF', color: 'white' }, // Efecto visual
          }}
          onClick={() => handleCategoryClick(category)}
        >
          <CardContent>
            <img
              src={getApiImageUrl(category.icon)}
              alt={category.name}
              width="30"
              height="30"
            />
            <br />
            <TextAtom
              variant="body"
              size="medium"
              color="text.primary"
              sx={{ mt: 1 }}
            >
              {category.name}
            </TextAtom>
          </CardContent>
        </Card>
      ))}
    </HorizontalScrollContainer>
  );
};

export default ListCategories;
