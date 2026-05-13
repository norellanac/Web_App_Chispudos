import React from 'react';
import { TextAtom } from '../atoms';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import okIcon from '../../assets/images/ok_icon-01.svg'
import { useHasRole } from '../../hooks/useHasRole';

interface EmptySectionProps {
  title?: string; // Title text
  description?: string; // Description text
  imageIconPath?: string; // Path to the image icon
  height?: string | number; // Height of the section
  borderColor?: string; // Border color
}

const EmptySection: React.FC<EmptySectionProps> = ({
  title = '',
  description = '',
  imageIconPath: icon = okIcon,
  height = '20%',
  borderColor = 'primary.light',
}) => {
  const { t } = useTranslation();
  const isMerchant = useHasRole('Merchant');

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={height}
      textAlign="center"
      gap={2}
      sx={{
        border: '2px dashed',
        borderColor: borderColor,
        borderRadius: 2,
        padding: 3,
      }}
    >
      <TextAtom variant="body" size="medium" fontWeight="bold">
        {isMerchant ? t('components.molecules.emptySection.merchantTitle', 'No records to show for Professionals') : t('components.molecules.emptySection.userTitle', 'No records to show for users')}
        </TextAtom>
      {icon && (
        <img
          src={icon}
          alt="Empty Section Icon"
            style={{
                maxHeight: '100px',
                maxWidth: '100px',
                width: 'auto',
            }}
        />
      )}

      <TextAtom variant="body" size="medium" fontWeight="bold">
          {title || t('components.molecules.emptySection.title', 'No records to show')}
        </TextAtom>

      <TextAtom variant="body" color="text.secondary" size="small">
          {description || t('components.molecules.emptySection.description', 'Please add some records to see them here.')}
        </TextAtom>
    </Box>
  );
};

export default EmptySection;