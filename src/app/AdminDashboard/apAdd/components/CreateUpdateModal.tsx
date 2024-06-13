// src/components/CreateUpdateModal.tsx
import React from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

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
  data: { _id: string; idSite: string; mac: string; createdAt: string; updatedAt: string; __v: number };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => void;
  handleSubmit: () => void;
  isUpdate: boolean;
  siteOptions: string[];
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  open,
  handleClose,
  data,
  handleChange,
  handleSubmit,
  isUpdate,
  siteOptions
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2>{isUpdate ? 'Actualizar AP' : 'Crear AP'}</h2>
        <FormControl fullWidth margin="normal">
          <InputLabel>ID del Sitio</InputLabel>
          <Select
          label="ID del Sitio"
          name="idSite"
          value={data.idSite}
          onChange={handleChange}
          fullWidth
          disabled={isUpdate}
        >
          {siteOptions.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
        <TextField
          label="MAC"
          name="mac"
          value={data.mac}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
          {isUpdate ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateUpdateModal;
