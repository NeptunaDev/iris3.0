"use client";
import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import Image from "next/image";
import { FormData } from "./interfaces";

interface PortalCautiveProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeSelect: (name: string, value: string) => void;
  acceptedTerms: boolean;
  setAcceptedTerms: (accepted: boolean) => void;
  sendForm: () => void;
}

export const PortalCautive: React.FC<PortalCautiveProps> = ({
  formData,
  handleChange,
  handleChangeSelect,
  acceptedTerms,
  setAcceptedTerms,
  sendForm,
}) => {
  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          p: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
          color: "white",
        }}
      >
        <Stack spacing={3}>
          {/* Header with Logo */}
          <Box textAlign="center">
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Image
                src="/netmask.png"
                alt="Netmask Logo"
                width={200}
                height={80}
                style={{ objectFit: 'contain' }}
              />
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Bienvenido
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Complete el formulario para acceder a la red WiFi
            </Typography>
          </Box>

          {/* Form */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={2.5}>
                {Object.entries(formData).map(([key, field]) => (
                  <TextField
                    key={key}
                    fullWidth
                    label={field.label}
                    name={key}
                    type={field.type}
                    value={field.value}
                    onChange={handleChange}
                    error={!!field.error}
                    helperText={field.error}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#1976d2",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                    }}
                  />
                ))}

                {/* Terms and Conditions */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      sx={{
                        color: "#1976d2",
                        "&.Mui-checked": {
                          color: "#1976d2",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Acepto los{" "}
                      <Typography
                        component="span"
                        color="primary"
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        términos y condiciones
                      </Typography>{" "}
                      del servicio
                    </Typography>
                  }
                />

                {/* Submit Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={sendForm}
                  disabled={!acceptedTerms}
                  sx={{
                    background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                    color: "white",
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderRadius: 2,
                    "&:hover": {
                      background: "linear-gradient(135deg, #1565c0 0%, #0a3d91 100%)",
                    },
                    "&:disabled": {
                      background: "#ccc",
                      color: "#666",
                    },
                  }}
                >
                  Conectarme!
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Footer */}
          <Box textAlign="center">
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              © 2025 Iris WiFi Management. Todos los derechos reservados.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}; 