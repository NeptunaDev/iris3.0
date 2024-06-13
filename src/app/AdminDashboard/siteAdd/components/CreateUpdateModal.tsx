import React from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface CreateUpdateModalProps {
  open: boolean;
  handleClose: () => void;
  data: {
    name: string;
    _id: string;
    siteId: string;
    type: string;
    idOrganization: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => void;
  handleSelectChange: (event: SelectChangeEvent<{ value: unknown }>) => void; // Updated type
  handleTypeChange: (event: SelectChangeEvent<string>) => void;
  handleSubmit: () => void;
  isUpdate: boolean;
  organizations: { id: string; name: string; _id: string }[];
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  open,
  handleClose,
  data,
  handleChange,
  handleSelectChange,
  handleTypeChange,
  handleSubmit,
  isUpdate,
  organizations,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <h2>{isUpdate ? "Actualizar" : "Crear"} Site</h2>
        <TextField
          label="Nombre"
          name="name"
          value={data.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Organización</InputLabel>
          <Select
            label="Organización"
            name="idOrganization"
            value={data.idOrganization}
            onChange={handleSelectChange}
          >
            {organizations.map((org) => (
              <MenuItem key={org._id} value={org._id}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="ID Sitio"
          name="siteId"
          value={data.siteId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo</InputLabel>
          <Select
            label="Tipo"
            name="type"
            value={data.type}
            onChange={handleTypeChange}
          >
            <MenuItem value="Ubiquiti">Ubiquiti</MenuItem>
            <MenuItem value="Meraki">Meraki</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isUpdate ? "Actualizar" : "Crear"}
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateUpdateModal;
