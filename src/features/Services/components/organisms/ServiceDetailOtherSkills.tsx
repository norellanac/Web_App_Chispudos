import React from 'react';
import { Box, Typography, Chip, Grid } from '@mui/material';
import { TextAtom } from '../../../../components/atoms';

interface Detail {
  label: string;
  value: string;
  description: string;
}

interface ServiceOtherSkillsProps {
  skills: Detail[];
}

export const ServiceOtherSkills: React.FC<ServiceOtherSkillsProps> = ({
  skills,
}) => {
  return (
    <Box>
      <TextAtom variant="headline" size="small" fontWeight="bold">
        Otras Habilidades
      </TextAtom>
      <Box marginBottom={2} />
      {skills.length > 0 ? (
        <Grid container spacing={3}>
          {skills.map((skill, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Chip
                label={skill.label}
                variant="outlined"
                sx={{ marginBottom: '0.5rem' }}
              />
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {skill.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {skill.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" marginTop="1rem">
          Este comercio aún no ha agregado otras habilidades o servicios.
        </Typography>
      )}
    </Box>
  );
};
