import React, { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MainImage from '../../../../assets/images/intro_sliders/intro_1.png';
import TextAtom from '../../../../components/atoms/TextAtom';
import ButtonAtom from '../../../../components/atoms/ButtonAtom';

const RequestForm = () => {
  const { t } = useTranslation();

  // Estado local para manejar el formulario
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    taskDescription: '',
    location: '',
  });

  // Función para manejar los cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Lista de categorías (se deben obtener de la API)
  const categories = [
    { value: 'plumber', label: t('categories.plumber') },
    { value: 'mechanic', label: t('categories.mechanic') },
    { value: 'electrician', label: t('categories.electrician') },
    { value: 'mason', label: t('categories.mason') },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 4,
        padding: '20px 0px 100px',
      }}
    >
      {/* Sección del formulario */}
      <Box sx={{ width: '40%' }}>
        {/* Título del formulario */}
        <TextAtom
          variant="title"
          size="medium"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          {t('form.title')}
        </TextAtom>

        {/* Subtítulo */}
        <TextAtom variant="title" size="small" sx={{ mb: 4 }}>
          {t('form.subtitle')}
        </TextAtom>

        {/* Categoría */}
        <TextField
          select
          label={t('form.category')}
          name="category"
          value={formData.category}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Título */}
        <TextField
          label={t('form.titlePlaceholder')}
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        {/* Descripción */}
        <TextField
          label={t('form.descriptionPlaceholder')}
          name="taskDescription"
          value={formData.taskDescription}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        {/* Ubicación */}
        <TextField
          label={t('form.locationPlaceholder')}
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        {/* Botón de enviar */}
        <ButtonAtom
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: 'primary.main',
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
          }}
        >
          <TextAtom variant="button" size="medium">
            {t('form.submit')}
          </TextAtom>
        </ButtonAtom>
      </Box>

      <Box sx={{ position: 'relative', width: '45%' }}>
        <img
          src={MainImage}
          alt={t('form.professionals')}
          style={{ width: '85%' }}
        />
      </Box>
    </Box>
  );
};

export default RequestForm;
