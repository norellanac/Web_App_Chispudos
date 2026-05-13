import React from 'react';
import { Box, Avatar, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface AvatarUploadProps {
  previewImage: string | null;
  userAvatarUrl: string;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMsg: string | null;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  previewImage,
  userAvatarUrl,
  handleImageChange,
  errorMsg,
}) => {
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
          src={
            previewImage
              ? previewImage
              : import.meta.env.VITE_BASE_API_URL + userAvatarUrl
          }
          alt="Avatar"
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: '#6750A4',
            color: 'white',
            width: 32,
            height: 32,
            boxShadow: 2,
            '&:hover': {
              backgroundColor: '#55379A',
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
