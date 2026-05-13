import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ButtonAtom, TextAtom } from '../../../../components/atoms';

const FeatureGuarantee: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        backgroundColor: '#FFF9E9',
        borderRadius: '40px',
        alignContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginX: 2,
      }}
    >
      <TextAtom
        variant="body"
        sx={{
          color: '#019FE9',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          margin: 5,
        }}
      >
        {t('landing.guarantee.category')}
      </TextAtom>
      <TextAtom
        variant="display"
        size="medium"
        sx={{ fontWeight: 'bold', margin: 5 }}
      >
        {t('landing.guarantee.tittle')}
      </TextAtom>
      <Box sx={{ margin: 5 }}>
        <ButtonAtom variant="filled">
          {t('landing.guarantee.button')}
        </ButtonAtom>
      </Box>
    </Box>
  );
};

export default FeatureGuarantee;
