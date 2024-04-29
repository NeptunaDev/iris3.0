"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Snackbar,
  Slide
} from "@mui/material";
import { IoMdSettings } from "react-icons/io";

interface Field {
  title: string;
  value: string;
  type: string;
  label: string;
  selectedValue: string;
  image?: File | null;
}

interface FormConfig {
  title: string;
  fields: Field[];
}

const DynamicForm: React.FC = () => {
  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: "Formulario para creación del Portal Cautivo",
    fields: []
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const addField = () => {
    const newField: Field = {
      title: "Nuevo Campo",
      value: "",
      type: "text",
      label: "",
      selectedValue: ""
    };
    setFormConfig((prevConfig) => ({
      ...prevConfig,
      fields: [...prevConfig.fields, newField]
    }));
  };

  const removeField = (index: number) => {
    setFormConfig((prevConfig) => ({
      ...prevConfig,
      fields: prevConfig.fields.filter((_, i) => i !== index)
    }));
  };

  const handleTitleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTitle = event.target.value;
    setFormConfig((prevConfig) => ({
      ...prevConfig,
      fields: prevConfig.fields.map((field, i) =>
        i === index ? { ...field, title: newTitle } : field
      )
    }));
  };

  const handleValueChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    setFormConfig((prevConfig) => ({
      ...prevConfig,
      fields: prevConfig.fields.map((field, i) =>
        i === index ? { ...field, value: newValue } : field
      )
    }));
  };

  const handleSelectChange = (
    index: number,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newValue = event.target.value as string;
    setFormConfig((prevConfig) => ({
      ...prevConfig,
      fields: prevConfig.fields.map((field, i) =>
        i === index ? { ...field, selectedValue: newValue } : field
      )
    }));
  };

  const handleImageChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormConfig((prevConfig) => ({
        ...prevConfig,
        fields: prevConfig.fields.map((field, i) =>
          i === index ? { ...field, image: file } : field
        )
      }));
    }
  };

  const handleSubmit = () => {
    console.log(formConfig);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px"
      }}
    >
      <Typography variant="h4" gutterBottom>
        {formConfig.title}
      </Typography>
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={addField}
          sx={{ marginRight: 2 }}
        >
          Agregar Campo
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ bgcolor: "blue", color: "white" }}
        >
          Enviar Formulario
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 4
        }}
      >
        {formConfig.fields.map((field, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 3
            }}
          >
            <TextField
              label="Título del Campo"
              value={field.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTitleChange(index, e)
              }
              variant="outlined"
              sx={{ marginBottom: 1, width: "300px" }}
            />
            <FormControl variant="outlined" sx={{ marginBottom: 1 }}>
              <InputLabel>Tipo de Campo</InputLabel>
              <Select
                value={field.selectedValue}
                onChange={(e: any) => handleSelectChange(index, e)}
                label="Tipo de Campo"
                sx={{ width: "150px" }}
              >
                <MenuItem value="text">Texto</MenuItem>
                <MenuItem value="number">Número</MenuItem>
                <MenuItem value="file">Archivo</MenuItem>
              </Select>
            </FormControl>
            {field.type === "file" && (
              <Box sx={{ marginBottom: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e)}
                  style={{ display: "none" }}
                  id={`image-upload-${index}`}
                />
                <label htmlFor={`image-upload-${index}`}>
                  <Button
                    variant="contained"
                    component="span"
                    sx={{ bgcolor: "green", color: "white", mt: 1 }}
                  >
                    Subir Imagen
                  </Button>
                </label>
                {field.image && (
                  <Typography variant="body2">{field.image.name}</Typography>
                )}
              </Box>
            )}
            <TextField
              label={`Ingrese ${field.title}`}
              value={field.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleValueChange(index, e)
              }
              variant="outlined"
              sx={{ width: "300px" }}
            />
            <IconButton
              color="secondary"
              onClick={() => removeField(index)}
              sx={{ marginTop: 1 }}
            >
              <IoMdSettings />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Slide}
        message="¡Formulario enviado con éxito!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <IoMdSettings />
          </IconButton>
        }
      />
    </Box>
  );
};

export default DynamicForm;
