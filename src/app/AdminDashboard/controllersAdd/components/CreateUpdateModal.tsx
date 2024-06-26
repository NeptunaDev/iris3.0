// src/components/CreateUpdateModal.tsx
import React from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

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
};

interface CreateUpdateModalProps {
  open: boolean;
  handleClose: () => void;
  data: { name: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isUpdate: boolean;
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  open,
  handleClose,
  data,
  handleChange,
  handleSubmit,
  isUpdate,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2>{isUpdate ? 'Actualizar' : 'Crear'} Registro</h2>
        <TextField
          label="Nombre"
          name="name"
          value={data.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isUpdate ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateUpdateModal;
