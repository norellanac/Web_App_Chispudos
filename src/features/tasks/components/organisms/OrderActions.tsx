import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useLabels } from '../../../../hooks/useLabels';
import ChatIcon from '@mui/icons-material/Chat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';

type OrderActionsProps = {
  orderStatus: number;
  userRoles: string[] | null;
  currentMode: 'user' | 'merchant';
  onViewDetails: () => void;
  onChat: () => void;
  onAcceptTask?: () => void;
  onCompleteTask?: () => void;
  onRateService?: () => void;
};

const OrderActions: React.FC<OrderActionsProps> = ({
  orderStatus,
  userRoles,
  currentMode,
  onViewDetails,
  onChat,
  onAcceptTask,
  onCompleteTask,
  onRateService,
}) => {
  const { order: O } = useLabels();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Tooltip title={O.entityName}>
        <IconButton style={{ color: '#019FE9' }} size="small" onClick={onViewDetails}>
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {(userRoles?.includes('user') || userRoles?.includes('merchant')) && (
        <Tooltip title="Chat">
          <IconButton color="primary" size="small" onClick={onChat}>
            <ChatIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {currentMode === 'merchant' && userRoles?.includes('merchant') && orderStatus === 1 && (
        <Tooltip title={O.actions.confirm}>
          <IconButton color="success" size="small" onClick={onAcceptTask}>
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {currentMode === 'merchant' && userRoles?.includes('merchant') && orderStatus === 2 && (
        <Tooltip title={O.statuses.completed}>
          <IconButton color="success" size="small" onClick={onCompleteTask}>
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {currentMode === 'user' && userRoles?.includes('user') && orderStatus === 3 && (
        <Tooltip title={O.statuses.completed}>
          <IconButton color="warning" size="small" onClick={onRateService}>
            <StarIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default OrderActions;
