import DEFAULT_IMAGE from '../assets/images/DEFAULT_IMAGE.png';
export const getApiImageUrl = ((itemUrl: string) => {
    const baseUrl = import.meta.env.VITE_BASE_API_URL;
    if (!itemUrl) 
      return DEFAULT_IMAGE;
    return itemUrl?.startsWith('http') ? itemUrl :
     `${baseUrl + itemUrl}`;
  });

   