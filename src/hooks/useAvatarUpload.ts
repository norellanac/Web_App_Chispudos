import { useState } from 'react';
import { useUpdateAvatarMutation } from '../services/userApi';
import { useAppDispatch } from './useAppDispatch';
import { selectAuth, setAuthUserState } from '../redux/slices/authSlice';
import { useAppSelector } from './useAppSelector';

interface UseAvatarUploadProps {
  userId: string;
  maxFileSizeMB?: number;
  validFileTypes?: string[];
}

export const useAvatarUpload = ({
  userId,
  maxFileSizeMB = 5,
  validFileTypes = ['image/jpeg', 'image/png'],
}: UseAvatarUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { user } = useAppSelector(selectAuth);
  const [updateAvatar] = useUpdateAvatarMutation(); 
  const dispatch = useAppDispatch();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validFileTypes.includes(file.type)) {
      setErrorMsg(`Solo se permiten archivos: ${validFileTypes.join(', ')}`);
      return;
    }

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setErrorMsg(`El archivo debe ser menor a ${maxFileSizeMB}MB.`);
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setErrorMsg(null);
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await updateAvatar({ userId, formData }).unwrap();
      dispatch(
        setAuthUserState({
          ...user,
          avatarUrl: response?.data?.avatarUrl,
        }),
      );
      const avatarUrl = response?.avatarUrl;

      if (avatarUrl) {
        setPreviewImage(avatarUrl); 
      }
      setSelectedImage(null);
    } catch (error) {
      setErrorMsg('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    selectedImage,
    previewImage,
    errorMsg,
    isUploading,
    handleImageChange,
    handleSaveImage,
  };
};
