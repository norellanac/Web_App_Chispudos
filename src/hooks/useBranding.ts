import { useAppSelector } from './useAppSelector';
import { selectBranding } from '../redux/slices/brandingSlice';

export const useBranding = () => {
  const { config, isLoaded } = useAppSelector(selectBranding);
  const baseUrl = import.meta.env.VITE_BASE_API_URL || '';

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${baseUrl}${path}`;
  };

  const getLogoUrl = (): string => getImageUrl(config?.logoUrl) || '';

  return { config, isLoaded, getImageUrl, getLogoUrl };
};
