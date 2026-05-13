import React from 'react';
import { Typography } from '@mui/material';
import { ModalComponent } from '../../../../../components/molecules';

interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: string | null;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({ open, onClose, onConfirm, action }) => {
  return (
    <ModalComponent
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      cancelButtonText="Cancel"
      confirmButtonText="Confirm"
      title="Confirm Action"
    >
      <Typography variant="body1">
        Are you sure you want to perform the action: {action}?
      </Typography>
    </ModalComponent>
  );
};

export default ConfirmActionModal;