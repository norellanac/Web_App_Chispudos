import React, { useState } from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { DoneAll, Chat, Task, NotInterested, StarRate, MoreVert } from '@mui/icons-material';
import { format } from 'date-fns';
import DEFAULT_IMAGE from '../../../../../assets/images/DEFAULT_IMAGE.png';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { ButtonAtom } from '../../../../../components/atoms';
import { getApiImageUrl } from '../../../../../utils/baseEnvironment';
import { useHasRole } from '../../../../../hooks/useHasRole';
import ReviewForm from '../reviews/ReviewForm';
import { useLabels } from '../../../../../hooks/useLabels';

interface OrderListItemProps {
  order: any;
  onAction: (action: string, orderId: number) => void;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ order, onAction }) => {
  const { id, startDate, details } = order;
  const isMerchant = useHasRole('Merchant');
  const product = details[0]?.productService;
  const { order: O } = useLabels();
  const image = product?.urlImage? getApiImageUrl(product?.urlImage) : DEFAULT_IMAGE;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const ButtonsObjUser = [
    {
      icon: <Chat />,
      title: t('features.businessOrdersPage.actions.chat', 'Chat'),
      action: () => onAction('chat', id),
    },
  ];

  const ButtonsObjMerchant = [
    { icon: <DoneAll />, title: O.statuses.completed, action: () => onAction('complete', id) },
    { icon: <Task />,    title: O.actions.confirm,    action: () => onAction('accept', id) },
    { icon: <NotInterested />, title: O.actions.cancel, action: () => onAction('notInterested', id) },
    { icon: <Chat />,    title: t('features.businessOrdersPage.actions.chat', 'Chat'), action: () => onAction('chat', id) },
  ];

  const ButtonsObj = isMerchant ? ButtonsObjMerchant : ButtonsObjUser;

  return (
  <>
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <img
          alt={product?.name}
          src={image}
          style={{
            width: 50,
            height: 50,
            borderRadius: '5%',
            objectFit: 'cover',
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={product?.name}
        secondary={`${format(new Date(startDate), 'dd/MM/yyyy HH:mm')} — ${details[0]?.comment}`}
      />
      {isMobile ? (
        <>
          <IconButton edge="end" aria-label="more" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {ButtonsObj.map((button, index) => (
              <MenuItem key={index} onClick={() => {
                button.action();
                handleMenuClose();
              }}>
                {button.icon}
                {button.title}
              </MenuItem>
            ))}
            <MenuItem onClick={() => setShowReviewModal(true)}>
              <StarRate />
              {t('features.businessOrdersPage.actions.rate', 'Calificar')}
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Box display="flex" gap={1}>
          {ButtonsObj.map((button, index) => (
            <ButtonAtom
              key={index}
              variant="elevated"
              startIcon={button.icon}
              title={button.title}
              onClick={() => button.action()}
            >
              {button.title}
            </ButtonAtom>
          ))}
          {order?.status == 3 || order?.status == 4 ? (
            <ButtonAtom
              variant="elevated"
              startIcon={<StarRate />}
              title={t('features.businessOrdersPage.actions.rate', 'Leave a review')}
              onClick={() => setShowReviewModal(true)}
            >
              {t('features.businessOrdersPage.actions.rate', 'Calificar')}
            </ButtonAtom>
          ) : null}
        </Box>
      )}
    </ListItem>
      <ReviewForm showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} service={product} />
  </>
  );
};

export default OrderListItem;