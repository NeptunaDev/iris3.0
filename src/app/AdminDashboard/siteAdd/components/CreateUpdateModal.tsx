import React, { ChangeEvent, ChangeEventHandler, Dispatch } from "react";
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
  Grid,
  Stack,
} from "@mui/material";
import { DataItem, Organization } from "../page";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadious: "20px",
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
    host: string;
    port: string;
    username: string;
    password: string;
    sslverify: string;
  };
  setCurrentData: Dispatch<React.SetStateAction<DataItem>>;
  handleSubmit: () => void;
  isUpdate: boolean;
  organizations: Organization[];
}

const CreateUpdateModal: React.FC<CreateUpdateModalProps> = ({
  open,
  handleClose,
  data,
  setCurrentData,
  handleSubmit,
  isUpdate,
  organizations,
}) => {
  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        {data.type === "" ? (
          <Stack sx={style}>
            <h2>Seleccione un tipo de sitio</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCurrentData((prev) => ({ ...prev, type: "meraki" }));
              }}
            >
              Meraki
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCurrentData((prev) => ({ ...prev, type: "ubiquiti" }));
              }}
            >
              Ubiquiti
            </Button>
          </Stack>
        ) : (
          <Box sx={style}>
            <h2>{isUpdate ? "Actualizar" : "Crear"} Site</h2>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Nombre"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
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
              </Grid>
              {data.type === "ubiquiti" && (
                <>
                  <Grid item xs={6}>
                    <TextField
                      label="ID Sitio"
                      name="siteId"
                      value={data.siteId}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Host"
                      name="host"
                      value={data.host}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Puerto"
                      name="port"
                      value={data.port}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Usuario"
                      name="username"
                      value={data.username}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Contraseña"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Verificación SSL"
                      name="sslverify"
                      value={data.sslverify}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {isUpdate ? "Actualizar" : "Crear"}
              </Button>
            </Box>
          </Box>
        )}
      </>
    </Modal>
  );
};

export default CreateUpdateModal;
