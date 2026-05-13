import React from 'react';
import {
  Modal,
  Box,
  IconButton,
  CircularProgress,
  SxProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonAtom, TextAtom } from '../atoms';

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  title: string;
  children: React.ReactNode;
  confirmButtonText?: string;
  confirmButtonStartIcon?: React.ReactNode;
  confirmButtonEndIcon?: React.ReactNode;
  cancelButtonText?: string;
  isConfirmButtonDisabled?: boolean;
  isConfirmButtonLoading?: boolean;
  hideCancelbutton?: boolean;
  sx?: SxProps;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  open,
  onClose,
  onConfirm,
  onCancel,
  title,
  children,
  confirmButtonText = 'Confirm',
  confirmButtonStartIcon,
  confirmButtonEndIcon,
  cancelButtonText = 'Cancel',
  isConfirmButtonDisabled = false,
  isConfirmButtonLoading = false,
  hideCancelbutton = false,
  sx,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={[{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: 300,
          maxWidth: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }, sx]}
      >

        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 0, top: 0 }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
            position: 'relative',
          }}
        >
          <TextAtom
            variant="title"
            size="medium"
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            {title}
          </TextAtom>
        </Box>
        <Box sx={{ my: 5, textAlign: 'center' }}>{children}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {!hideCancelbutton && (
            <ButtonAtom variant="outlined" onClick={onCancel || onClose}>
              {cancelButtonText}
            </ButtonAtom>
          )}
          {onConfirm && (
            <ButtonAtom
              variant="filled"
              onClick={onConfirm}
              disabled={isConfirmButtonDisabled || isConfirmButtonLoading}
              startIcon={confirmButtonStartIcon}
              endIcon={confirmButtonEndIcon}
            >
              {isConfirmButtonLoading ? (
                <CircularProgress size={24} />
              ) : (
                confirmButtonText
              )}
            </ButtonAtom>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
