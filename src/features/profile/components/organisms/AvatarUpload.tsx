import React, { useState } from 'react';
import { Box, Avatar, IconButton, Typography, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface AvatarUploadProps {
  previewImage: string | null;
  userAvatarUrl: string;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMsg: string | null;
  name?: string;
  lastname?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  previewImage,
  userAvatarUrl,
  handleImageChange,
  errorMsg,
  name = '',
  lastname = '',
}) => {
  const theme = useTheme();
  const [imgError, setImgError] = useState(false);

  const hasImage = !!(previewImage || userAvatarUrl) && !imgError;
  const initials = [name[0], lastname[0]].filter(Boolean).join('').toUpperCase() || '?';

  // Reset error when the source changes (e.g. after a new upload)
  const src = previewImage
    ? previewImage
    : userAvatarUrl
      ? import.meta.env.VITE_BASE_API_URL + userAvatarUrl
      : undefined;

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          textAlign: 'center',
        }}
      >
        <Avatar
          src={hasImage ? src : undefined}
          alt={initials}
          onError={() => setImgError(true)}
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            ...(!hasImage && { bgcolor: theme.palette.primary.light, fontSize: '2rem', fontWeight: 500 }),
          }}
        >
          {!hasImage && initials}
        </Avatar>
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 8,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            width: 32,
            height: 32,
            boxShadow: 2,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <EditIcon fontSize="small" />
          <input
            type="file"
            hidden
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
          />
        </IconButton>
      </Box>
      {errorMsg && <Typography color="error">{errorMsg}</Typography>}
    </Box>
  );
};

export default AvatarUpload;
