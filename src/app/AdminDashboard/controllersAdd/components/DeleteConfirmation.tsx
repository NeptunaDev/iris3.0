// src/components/DeleteConfirmation.tsx
import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  justifyContent: 'center', 
  alignItems: 'center'
};

interface DeleteConfirmationProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  handleClose,
  handleDelete,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h3" gutterBottom >
          ¿Está seguro de que desea eliminar este registro?
        </Typography>
        <Button variant="contained" color="primary" onClick={handleDelete}>
          Sí
        </Button>
        <Button variant="contained" color="warning" onClick={handleClose} sx={{ ml: 2 }}>
          No
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmation;
