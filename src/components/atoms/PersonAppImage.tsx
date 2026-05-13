import React from 'react';
import initialScreenImage from './../../assets/images/intro_sliders/intro_1.png';

type PersonAppImageProps = {
  imageSrc?: string;
};

export const PersonAppImage: React.FC<PersonAppImageProps> = ({
  imageSrc = initialScreenImage,
}) => {
  return (
    <img
      src={imageSrc}
      alt="Initial screen"
      style={{
        borderRadius: '5%',
        width: '90%',
      }}
    />
  );
};
