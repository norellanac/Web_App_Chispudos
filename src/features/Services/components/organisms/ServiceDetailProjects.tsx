import React from 'react';
import { Box, Typography } from '@mui/material';
import { TextAtom } from '../../../../components/atoms';

interface Project {
  title: string;
  img: string;
}

interface ServiceProjectsProps {
  projects?: Project[];
}

export const ServiceProjects: React.FC<ServiceProjectsProps> = ({
  projects = [],
}) => {
  if (!projects.length) {
    return (
      <Box marginBottom={4}>
        <TextAtom
          variant="headline"
          size="small"
          fontWeight="bold"
          marginBottom={1}
        >
          Proyectos recientes
        </TextAtom>
        <Box marginBottom={1} />
        <TextAtom
          variant="body"
          size="large"
          color="textSecondary"
          marginBottom={1}
        >
          No hay proyectos disponibles en este momento.
        </TextAtom>
      </Box>
    );
  }

  return (
    <Box marginY="6rem" marginLeft={16}>
      <TextAtom
        variant="title"
        size="large"
        fontWeight="bold"
        marginBottom="1rem"
      >
        Proyectos recientes
      </TextAtom>
      <Box display="flex" gap="1rem" flexWrap="wrap">
        {projects.map((project) => (
          <Card
            key={project.title}
            sx={{
              width: '200px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardMedia
              component="img"
              image={project.img}
              alt={project.title}
              sx={{ height: '120px', objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="body1" textAlign="center">
                {project.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
